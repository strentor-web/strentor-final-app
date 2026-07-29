import { NextResponse } from "next/server";
import { getHomeTestimonials } from "@/lib/testimonials/getHomeTestimonials";

// Public, unauthenticated — same audience as the homepage testimonial
// carousel it feeds. Fetched client-side (rather than at page render) so the
// homepage stays statically generated and never depends on DB availability
// at build time.
export async function GET() {
  try {
    const stories = await getHomeTestimonials();
    return NextResponse.json({ stories });
  } catch {
    return NextResponse.json({ stories: [] }, { status: 200 });
  }
}
