-- Public, unauthenticated testimonial submissions from the marketing site
-- (/transformation-stories/share). Deliberately separate from the existing
-- "testimonials" table, which requires an authenticated user_id and feeds
-- the admin-moderated in-app client flow (/admin/testimonials) — site
-- visitors submitting here aren't logged in, so there's no user record to
-- attach to.
--
-- Per business direction, these publish immediately on submission
-- (is_published defaults to true) rather than sitting in a moderation
-- queue. is_published exists so a bad entry can be unpublished later
-- without deleting the record.

CREATE TABLE IF NOT EXISTS "public"."site_testimonials" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "name_display" TEXT NOT NULL,
  "testimonial_text" TEXT NOT NULL,
  "context" TEXT,
  "consent_given" BOOLEAN NOT NULL DEFAULT false,
  "is_published" BOOLEAN NOT NULL DEFAULT true,
  "source_page" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "site_testimonials_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "SiteTestimonial_isPublished_idx" ON "public"."site_testimonials"("is_published");
