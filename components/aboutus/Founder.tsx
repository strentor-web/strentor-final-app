import Image from 'next/image';

export function FounderStory() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl">
          <Image
            // src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974"
            src="/Me.png"           
            alt="Aditya Mandan, founder of Strentor"
            fill
            className="object-fit"
          />
        </div>
        <div className="space-y-6">
          <span className="text-[#C9C0B4] text-5xl font-semibold">Founder&apos;s Story</span>
          <h2 className="text-3xl font-bold font-display text-foreground">
            A Journey of <span className="text-[#C9A96A]">Purpose</span>
          </h2>
          <div className="space-y-4 text-lg font-semibold text-muted-foreground leading-relaxed">
            <p>
              As a national-level para powerlifter and certified fitness trainer, I&apos;ve
              spent years coaching athletes and clients who use wheelchairs or manage
              conditions like spina bifida and CKD. I&apos;ve seen firsthand how much
              training changes when it&apos;s built around your equipment and ability from
              day one — not adapted from a standing-body plan as an afterthought.
            </p>
            <p>
              That&apos;s what pushed me to build STRENTOR. It&apos;s not a generic wellness
              brand with a few accessible options bolted on — it&apos;s adaptive strength,
              nutrition, and mindset coaching designed specifically for people managing
              long-term physical challenges, delivered virtually so location is never
              the barrier.
            </p>
            <p className="text-xl font-semibold text-[#C9A96A] mt-6">
            &quot;The only impossible journey is the one you never begin.&quot;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}