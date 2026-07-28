-- Patch for the trigger function behind create_user_email_confirmation_trigger
-- (fires AFTER UPDATE OF email_confirmed_at ON auth.users).
--
-- Bug: corporate_group_id was never inserted into users_profile, even
-- though the invite actions (actions/corporate/invite-employee.action.ts,
-- actions/admin/invite-corporate-admin.action.ts) pass it in
-- raw_user_meta_data. Every invited CORPORATE_ADMIN/CORPORATE_EMPLOYEE
-- would get created with corporate_group_id stuck at NULL.
--
-- Everything else here is identical to what's already live — this only
-- adds one column to the INSERT and one variable to read it.
--
-- NOTE: replace <ORIGINAL_FUNCTION_NAME> below with whatever this function
-- is actually named (the trigger definition you pasted calls
-- create_user_record(), so it's almost certainly that — but if
-- `CREATE OR REPLACE FUNCTION public.create_user_record()` errors with a
-- "cannot change return type" or "does not exist" message, run
-- `SELECT proname, pg_get_function_identity_arguments(oid) FROM pg_proc
-- WHERE prosrc LIKE '%users_profile%INSERT%'` first to confirm the exact
-- name/signature, then adjust this line.

CREATE OR REPLACE FUNCTION public.create_user_record()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role public."Role";
  user_corporate_group_id uuid;
BEGIN
  -- Check if email_confirmed_at was updated to non-NULL
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN

    -- Extract role from raw_user_meta_data, default to CLIENT
    user_role := COALESCE(
      (NEW.raw_user_meta_data->>'role')::public."Role",
      'CLIENT'::public."Role"
    );

    -- Extract corporate_group_id from raw_user_meta_data — only present
    -- for CORPORATE_ADMIN/CORPORATE_EMPLOYEE invites, NULL otherwise.
    user_corporate_group_id := NULLIF(NEW.raw_user_meta_data->>'corporate_group_id', '')::uuid;

    -- Insert into public.users_profile
    INSERT INTO public.users_profile (
      id,
      email,
      name,
      role,
      profile_completed,
      corporate_group_id
    )
    VALUES (
      NEW.id::uuid, -- UUID as substitute for cuid
      NEW.email,
      COALESCE(
        NULLIF((NEW.raw_user_meta_data->>'full_name')::text, ''),
        NULLIF((NEW.raw_user_meta_data->>'name')::text, ''),  --added this for Google OAuth and other OAuth
        SPLIT_PART(NEW.email, '@', 1)
      ),
      user_role,
      CASE
        WHEN user_role = 'CLIENT' THEN false
        ELSE true  -- Trainers (and now corporate roles) start with profile completed
      END,
      user_corporate_group_id
    )
    ON CONFLICT (email) DO NOTHING;

    -- Log the user creation for debugging
    RAISE NOTICE 'Created user profile: email=%, role=%, name=%, corporate_group_id=%',
      NEW.email,
      user_role,
      COALESCE((NEW.raw_user_meta_data->>'name')::text, SPLIT_PART(NEW.email, '@', 1)),
      user_corporate_group_id;

  END IF;

  RETURN NEW;
END;
$$;
