"use client"
import React from 'react';
import Image from 'next/image';

interface LogoProps {
  src: string;
  alt: string;
  href: string;
}

export const Logo = ({ src, alt, href }: LogoProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="relative h-14 w-24 sm:h-20 sm:w-32 shrink-0 hover:opacity-80 transition-opacity"
  >
    <Image src={src} alt={alt} fill sizes="(max-width: 640px) 96px, 128px" className="object-contain" />
  </a>
);

export default function Featured() {
  return (
    <div className="container mx-auto px-4 mt-12 items-center">
      <h2 className="text-3xl font-bold font-display tracking-tighter sm:text-5xl mb-6 text-center text-[#C9A96A]">
        Also Featured In
      </h2>
      <div className="flex flex-row flex-wrap gap-x-6 gap-y-6 sm:gap-x-9 justify-center items-center">
        <Logo
          src="/zeebiz.png"
          alt="Zee Business"
          href="https://youtu.be/yNR2nag2bxY?si=nKXvHjeBSn7vK1Ve"
        />
        <Logo
          src="/dailyhunt1.png"
          alt="DailyHunt"
          href="https://m.dailyhunt.in/news/india/english/r+news+india-epaper-dhfacc36dfce9c4bb68db0e89d033c921b/strentor+the+space+where+your+mind+body+soul+finally+sync+up-newsid-dhfacc36dfce9c4bb68db0e89d033c921b_a3f1cd10314611f0bd7e4ef0a55aa118?sm=Y"
        />
        <Logo
          src="/startupstory1.png"
          alt="The Startup Story"
          href="https://thestartupstory.co.in/index.php/2025/04/23/strentor-a-new-era-of-holistic-coaching-and-wellness"
        />
        <Logo
          src="/gameroom.png"
          alt="Game Room"
          href="https://youtu.be/jIjfj5b9kLU?si=IHWL4so_xWoH1z7l"
        />
        <Logo
          src="/udaan.png"
          alt="Radio Udaan"
          href="https://youtu.be/O0rwgzslQy0?si=WAvS4lkze0-KanjW"
        />
        <Logo
          src="/joshtalks.png"
          alt="Josh Talks"
          href="https://youtu.be/29PHD0uHhDY?si=AOEL30jDkwWrjnZe"
        />
      </div>
    </div>
  );
}