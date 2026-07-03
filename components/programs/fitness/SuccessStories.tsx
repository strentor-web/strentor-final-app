"use client"

const successStories = [
  {
    condition: "Type-2 Diabetes",
    description: "Supported clients in managing their sugar levels and regaining strength - one even returned to running marathons.",
    number: "01",
    color: "from-[#C9A96A]/10 to-[#C9A96A]/5",
    numberBg: "#C9A96A"
  },
  {
    condition: "Cerebral Palsy",
    description: "Ensured consistent fitness routines and improved overall well-being for clients",
    number: "02",
    color: "from-[#B8935A]/10 to-[#B8935A]/5",
    numberBg: "#B8935A"
  },
  {
    condition: "Thyroid Issues",
    description: "Helped clients reverse weight management and significantly reduced joint pain.",
    number: "03",
    color: "from-[#C9C0B4]/10 to-[#C9C0B4]/5",
    numberBg: "#C9C0B4"
  },
  {
    condition: "Down's Syndrome",
    description: "Empowered individuals to become regular and committed gym-goers.",
    number: "04",
    color: "from-[#DCC28C]/10 to-[#DCC28C]/5",
    numberBg: "#DCC28C"
  },
  {
    condition: "Spina Bifida",
    description: "Helped clients play sports like critical pain-free with customised fitness plans.",
    number: "05",
    color: "from-[#EDE0C8]/10 to-[#EDE0C8]/5",
    numberBg: "#EDE0C8"
  }
]

export default function SuccessStories() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Real <span className="text-[#C9A96A]">Transformations</span>, Real Results
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            At STRENTOR, we&apos;ve already helped people achieve life-changing results. We don&apos;t promise magic - we deliver proven strategies that empower you to break through your limitations.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {successStories.slice(0, 3).map((story, index) => (
              <div
                key={index}
                className={`rounded-xl p-6 bg-gradient-to-br ${story.color} border border-border transition-all duration-300 hover:shadow-lg`}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: story.numberBg }}
                  >
                    <span className="text-xl font-bold text-strentor-black">{story.number}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{story.condition}</h3>
                    <p className="text-muted-foreground">{story.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Second Row - Centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:px-[16.666%]">
            {successStories.slice(3).map((story, index) => (
              <div
                key={index}
                className={`rounded-xl p-6 bg-gradient-to-br ${story.color} border border-border transition-all duration-300 hover:shadow-lg`}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: story.numberBg }}
                  >
                    <span className="text-xl font-bold text-strentor-black">{story.number}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{story.condition}</h3>
                    <p className="text-muted-foreground">{story.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 