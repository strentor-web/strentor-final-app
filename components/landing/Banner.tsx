"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/forms/ContactForm"

const Banner = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <section className="relative min-h-[300px] w-full overflow-hidden bg-muted">
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="space-y-4">
            <h2 className="text-4xl text-foreground font-bold font-display tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Ready to Transform Your Fitness Journey?
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground font-medium md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join hundreds of individuals who have transformed their lives with STRENTOR
            </p>
            <div className="mx-auto max-w-sm space-y-2">
              <Button
                className="w-full py-7 bg-[#C9A96A] hover:bg-[#C9A96A]/90"
                onClick={() => window.open("https://calendly.com/strentor/strentor-services", "_blank")}
              >
                Start Your Fitness Journey
              </Button>

              <ContactForm open={showForm} onOpenChange={setShowForm} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Banner;