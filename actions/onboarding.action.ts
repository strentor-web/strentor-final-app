'use server'

import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma/prismaClient'
import { onboardingSchema } from '@/types/onboarding'
import { alpha3ToCountryEnum } from '@/utils/country-mapping'
import { RED_FLAG_OPTIONS, RED_FLAG_NONE_VALUE } from '@/utils/assessment/scoring'
import { sendIntakeNotification } from '@/utils/email/resend'
// import { v4 as uuidv4 } from 'uuid'

const SAFETY_ADMIN_EMAIL = 'fitassessment@strentor.com'

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}


export async function completeOnboardingAction(data: unknown) {
  // Validate data
  const result = onboardingSchema.safeParse(data)
  if (!result.success) {
    return {
      success: false,
      error: 'Invalid form data',
      fieldErrors: result.error.flatten().fieldErrors
    }
  }

  // Get authenticated user
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      success: false,
      error: 'Authentication required'
    }
  }

  try {
    // Prepare measurement data (convert empty strings to null)
    const prepareMeasurement = (value: number | string | undefined) => {
      if (value === '' || value === undefined) return null
      return typeof value === 'string' ? parseFloat(value) : value
    }

    // Convert country Alpha3 to enum
    const countryEnum = alpha3ToCountryEnum(result.data.country)
    if (!countryEnum) {
      return {
        success: false,
        error: 'Invalid country selection'
      }
    }

    // Prepare phone number (convert empty strings to null)
    const phoneNumber = result.data.phone?.trim() || null

    const flaggedRedFlags = (result.data.redFlags || []).filter((v) => v !== RED_FLAG_NONE_VALUE)
    const concerningAnswers = [result.data.medicalConditionAffectsTraining, result.data.medicalClearance].filter(
      (v) => v === 'yes' || v === 'unsure'
    )
    const needsSafetyReview = flaggedRedFlags.length > 0 || concerningAnswers.length > 0

    // Update user profile in database (role defaults to CLIENT)
    const updatedUser = await prisma.users_profile.update({
      where: { id: user.id },
      data: {
        name: result.data.name,
        weight: result.data.weight,
        weight_unit: "KG", // Always KG for new users
        height: result.data.height,
        height_unit: "CM", // Always CM for new users
        date_of_birth: new Date(result.data.dateOfBirth),
        gender: result.data.gender,
        activity_level: result.data.activityLevel,
        // Country and phone information
        country: countryEnum as any, // Convert to enum type
        phone: phoneNumber,
        // Optional measurements
        neck: prepareMeasurement(result.data.neck),
        waist: prepareMeasurement(result.data.waist),
        hips: prepareMeasurement(result.data.hips),
        profile_completed: true,
        onboarding_completed: new Date(),
        // Safety Check — persisted regardless of answer so a coach can see
        // the check was done, not only when something was flagged.
        safety_medical_condition: result.data.medicalConditionAffectsTraining,
        safety_medical_clearance: result.data.medicalClearance,
        safety_red_flags: flaggedRedFlags,
        safety_notes: result.data.additionalSafetyNotes?.trim() || null,
        safety_check_completed_at: new Date(),
      }
    })

    // Create initial weight log entry
    await prisma.weight_logs.create({
      data: {
        // id: uuidv4(),
        user_id: user.id,
        weight: result.data.weight,
        weight_unit: "KG", // Always KG for new users
        date_logged: new Date(),
        notes: 'Initial weight from onboarding'
      }
    })

    // Never blocks onboarding completion — same pattern as the body-check
    // tracker's red-flag handling. Surfaces in the existing admin Safety
    // Flags queue for human review before real coaching begins.
    if (needsSafetyReview) {
      const flagLabels = flaggedRedFlags.map((v) => RED_FLAG_OPTIONS.find((o) => o.value === v)?.label || v)
      const symptomType = flagLabels.length > 0 ? flagLabels.join(', ') : 'Medical history / clearance flagged'

      try {
        await prisma.safety_flags.create({
          data: {
            user_id: user.id,
            source_type: 'onboarding_safety_check',
            source_id: user.id,
            symptom_type: symptomType,
            severity: flagLabels.length > 0 ? 'HIGH' : 'MEDIUM',
            message: 'New sign-up flagged during onboarding safety check — review before their first coached session.',
            human_review_required: true,
          },
        })

        await sendIntakeNotification({
          to: SAFETY_ADMIN_EMAIL,
          subject: `[Safety Flag] Onboarding safety check — ${result.data.name}`,
          html: `<div style="font-family: Arial, sans-serif; max-width: 640px; color:#111;">
            <h2 style="color:#B42318;">Onboarding safety check flagged</h2>
            <p><strong>${escapeHtml(result.data.name)}</strong> (${escapeHtml(result.data.email)}) completed onboarding with items needing review.</p>
            ${flagLabels.length > 0 ? `<p>Reported: ${escapeHtml(flagLabels.join(', '))}</p>` : ''}
            <p>Medical condition affects training: ${escapeHtml(result.data.medicalConditionAffectsTraining)}</p>
            <p>Medical clearance recommended/required: ${escapeHtml(result.data.medicalClearance)}</p>
            ${result.data.additionalSafetyNotes ? `<p>Notes: ${escapeHtml(result.data.additionalSafetyNotes)}</p>` : ''}
            <p>human_review_required = true.</p>
          </div>`,
        })
      } catch (error) {
        console.error('Failed to record/notify onboarding safety flag:', error)
      }
    }

    return { success: true, user: updatedUser }
  } catch (error) {
    console.error('Failed to complete onboarding:', error)
    return {
      success: false,
      error: 'Failed to save profile. Please try again.'
    }
  }
}

export async function getUserOnboardingStatus(userId: string) {
  try {
    const user = await prisma.users_profile.findUnique({
      where: { id: userId },
      select: {
        profile_completed: true,
        // onboarding_started: true,
        onboarding_completed: true,
        name: true,
        weight: true,
        height: true,
        country: true,
        phone: true,
        neck: true,
        waist: true,
        hips: true
      }
    })

    return { success: true, user }
  } catch (error) {
    console.error('Failed to get onboarding status:', error)
    return { success: false, error: 'Failed to check onboarding status' }
  }
}
