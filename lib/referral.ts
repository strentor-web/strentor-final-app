import prisma from "@/utils/prisma/prismaClient";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I — avoids visual ambiguity when shared aloud/typed
const CODE_LENGTH = 7;

function randomCode(): string {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

/** Returns the user's existing referral code, generating and persisting one if they don't have it yet. */
export async function getOrCreateReferralCode(userId: string): Promise<string> {
  const profile = await prisma.users_profile.findUnique({
    where: { id: userId },
    select: { referral_code: true },
  });
  if (profile?.referral_code) return profile.referral_code;

  // Extremely low collision odds at this length/alphabet, but retry a few
  // times against the unique constraint rather than trusting that blindly.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomCode();
    try {
      await prisma.users_profile.update({
        where: { id: userId },
        data: { referral_code: code },
      });
      return code;
    } catch {
      // Unique constraint collision — try again.
    }
  }
  throw new Error("Failed to generate a unique referral code");
}
