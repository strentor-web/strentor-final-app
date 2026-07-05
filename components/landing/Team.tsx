"use client"

import { Card } from "@/components/ui/card"
import { Instagram } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface TeamMember {
  name: string
  role: string
  image: string 
  social: {
    instagram?: string
  }
}

export default function Team() {
  const team: TeamMember[] = [
    {
      name: "Aditya Mandan",
      role: "Founder & Empowerment Coach",
      image: "/Aditya-transparent.png",
      social: {
        instagram: "https://www.instagram.com/strentor/"
      }
    },
  ]

  const handleSocialClick = (e: React.MouseEvent, link: string) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="relative w-full overflow-hidden py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold font-display tracking-tighter sm:text-5xl text-[#C9A96A]">Meet Your Coach</h2>
          <p className="max-w-[900px] text-muted-foreground font-semibold md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Coached personally by Aditya Mandan — a national-level para powerlifter and certified fitness trainer who builds every program around your equipment and ability, not a standing-body template.
          </p>
        </div>
        <div className="mx-auto mt-12">
          <div className="grid grid-cols-1 max-w-sm mx-auto gap-6 px-4">
            {team.map((member) => (
              <Link
                key={member.name}
                href={`/programs#${member.name.toLowerCase().replace(/\s+/g, "")}`}
                passHref
              >
                <Card
                  className="group relative overflow-hidden rounded-lg backdrop-blur-sm bg-card/10 border-border transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
                >
                  <div className="aspect-square overflow-hidden relative">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      priority={true}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-card-foreground">{member.name}</h3>
                    <p className="text-sm text-muted-foreground font-medium">{member.role}</p>
                    <div className="flex space-x-3 mt-4">
                      {member.social.instagram && (
                        <button
                          onClick={(e) => handleSocialClick(e, member.social.instagram!)}
                          className="text-muted-foreground hover:text-card-foreground"
                        >
                          <Instagram className="h-6 w-6" />
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}