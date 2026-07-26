// Single source of truth for STRENTOR's real, named client testimonials —
// reused by the homepage carousel (components/landing/Testimonials.tsx) and
// the dedicated /transformation-stories page. Do not add entries here
// without a real, attributable quote; see
// STRENTOR_Website_Content_Verification.md for their permission status.
export const testimonials = [
  {
    quote:
      "Working with Aditya for over a year now and he is arguably the best fitness coach you could ask for. From personalized workouts to diet, he takes care of everything. Having Spina Bifida, I had my doubts whether lifting heaving weights is for me but he helped overcome those hurdles with ease!",
    author: "Chaitanya Shetty",
  },
  {
    quote:
      "Aditya is a brilliant trainer. He pushed me when it was needed and cherished every fitness milestone that I achieved.",
    author: "Tanushree Das",
  },
  {
    quote:
      "Working with Aditya I've seen good results in the past few months! My workouts are constantly increasing in difficulty and scope focused to match my fitness goals. Aditya suggests exercise routines that are individualized and challenging, but not more than I handle.",
    author: "Promila Dsilva",
  },
] as const;
