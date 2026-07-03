"use client"
import dynamic from 'next/dynamic'
import { IntroHeader } from '@/components/landing/intro/IntroHeader'
import { IntroContent } from '@/components/landing/intro/IntroContent'

const IntroScene3D = dynamic(() => import('@/components/landing/intro/IntroScene3D'), {
  ssr: false,
})

export default function Introduction() {
  return (
    <section className="">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="relative">
          <div className="pointer-events-none absolute inset-x-0 -top-8 -bottom-8 md:-top-16 md:-bottom-16" aria-hidden="true">
            <IntroScene3D />
          </div>
          <div className="relative z-10">
            <IntroHeader />
          </div>
        </div>
        <div className="mt-16 max-w-6xl mx-auto">
          <IntroContent />
        </div>
      </div>
    </section>
  );
}