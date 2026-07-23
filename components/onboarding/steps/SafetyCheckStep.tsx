'use client'

import { useFormContext } from 'react-hook-form'
import { OnboardingData } from '@/types/onboarding'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { RED_FLAG_OPTIONS, RED_FLAG_NONE_VALUE } from '@/utils/assessment/scoring'

const CLEARANCE_OPTIONS: { value: 'no' | 'yes' | 'unsure'; label: string }[] = [
  { value: 'no', label: 'No' },
  { value: 'yes', label: 'Yes' },
  { value: 'unsure', label: 'Unsure' },
]

export default function SafetyCheckStep() {
  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = useFormContext<OnboardingData>()

  const redFlags = watch('redFlags') || []

  const toggleRedFlag = (value: string) => {
    if (value === RED_FLAG_NONE_VALUE) {
      setValue('redFlags', [RED_FLAG_NONE_VALUE], { shouldValidate: true })
      return
    }
    const withoutNone = redFlags.filter((v) => v !== RED_FLAG_NONE_VALUE)
    const next = withoutNone.includes(value)
      ? withoutNone.filter((v) => v !== value)
      : [...withoutNone, value]
    setValue('redFlags', next, { shouldValidate: true })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Safety Check</h2>
        <p className="text-muted-foreground">
          This isn&apos;t a diagnosis — it just helps your coach train you safely from day one.
        </p>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg">Do you currently have any of the following?</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {RED_FLAG_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-start gap-3 rounded-lg border border-border p-3 text-sm cursor-pointer hover:border-primary"
            >
              <Checkbox
                checked={redFlags.includes(option.value)}
                onCheckedChange={() => toggleRedFlag(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardContent className="space-y-6 pt-6">
          <div>
            <Label>Any medical condition that affects training?</Label>
            <RadioGroup
              className="mt-3 flex flex-wrap gap-3"
              value={watch('medicalConditionAffectsTraining')}
              onValueChange={(v) =>
                setValue('medicalConditionAffectsTraining', v as 'no' | 'yes' | 'unsure', { shouldValidate: true })
              }
            >
              {CLEARANCE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm cursor-pointer hover:border-primary"
                >
                  <RadioGroupItem value={option.value} />
                  <span>{option.label}</span>
                </label>
              ))}
            </RadioGroup>
            {errors.medicalConditionAffectsTraining && (
              <p className="mt-1 text-xs text-destructive">
                {errors.medicalConditionAffectsTraining.message as string}
              </p>
            )}
          </div>

          <div>
            <Label>Medical clearance recommended or required?</Label>
            <RadioGroup
              className="mt-3 flex flex-wrap gap-3"
              value={watch('medicalClearance')}
              onValueChange={(v) => setValue('medicalClearance', v as 'no' | 'yes' | 'unsure', { shouldValidate: true })}
            >
              {CLEARANCE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm cursor-pointer hover:border-primary"
                >
                  <RadioGroupItem value={option.value} />
                  <span>{option.label}</span>
                </label>
              ))}
            </RadioGroup>
            {errors.medicalClearance && (
              <p className="mt-1 text-xs text-destructive">{errors.medicalClearance.message as string}</p>
            )}
          </div>

          <div>
            <Label htmlFor="additionalSafetyNotes">
              Anything else your coach should know before your first session? (optional)
            </Label>
            <Textarea id="additionalSafetyNotes" {...register('additionalSafetyNotes')} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-destructive/30 bg-destructive/5">
        <CardContent className="pt-6">
          <p className="text-sm text-destructive mb-4">
            Pause coaching and seek medical help for chest pain, severe breathlessness, fainting, new
            weakness/numbness, fever, sudden severe headache, open wound, major swelling, or any symptom your
            care team treats as urgent.
          </p>
          <div className="flex items-start space-x-3">
            <Checkbox
              id="safetyAcknowledged"
              checked={!!watch('safetyAcknowledged')}
              onCheckedChange={(checked) => setValue('safetyAcknowledged', checked === true, { shouldValidate: true })}
              className="mt-1"
            />
            <Label htmlFor="safetyAcknowledged" className="text-sm leading-relaxed cursor-pointer">
              I understand STRENTOR coaching is educational and lifestyle-focused; it does not diagnose, treat,
              prescribe, or replace medical care. I will report pain, fatigue, skin issues, dizziness,
              breathlessness, fever, swelling, or new symptoms before training.
            </Label>
          </div>
          {errors.safetyAcknowledged && (
            <p className="mt-2 text-xs text-destructive">{errors.safetyAcknowledged.message as string}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
