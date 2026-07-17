import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Medical Disclaimer",
  description: "Read Strentor's medical disclaimer to understand the scope of our fitness coaching services and their limitations.",
  alternates: {
    canonical: "/medical-disclaimer",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function MedicalDisclaimer() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-strentor-red mb-4">
              Medical Disclaimer
            </h1>
          </div>

          {/* Content Section */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-card rounded-xl shadow-lg p-8 space-y-8">

              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>This Medical Disclaimer applies to all use of STRENTOR's website, coaching programs, content, and communications (collectively, "Service"). Please read it carefully before beginning any program with us.</p>
                  <p>STRENTOR ("Company", "we", "our", "us") is a fitness and nutrition coaching business. We help people build strength, improve fitness, and pursue physical transformation through structured, adaptive coaching. Nothing on our Service, and nothing communicated to you by a STRENTOR coach, is intended to be, or should be treated as, medical advice, diagnosis, or treatment.</p>
                  <p>By using our Service, you acknowledge that you have read, understood, and agree to this Medical Disclaimer. This Disclaimer should be read alongside our <a href="/terms-of-service" className="text-[#C9A96A] hover:underline">Terms of Service</a> and <a href="/privacy-policy" className="text-[#C9A96A] hover:underline">Privacy Policy</a>.</p>
                </div>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Fitness Coaching, Not Medical Care</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>STRENTOR provides fitness coaching, training programming, and nutrition guidance aimed at helping clients get stronger, move better, and progress toward their personal transformation goals. Our coaches are trained in adaptive coaching methodology, not in the practice of medicine.</p>
                  <p>Coaching services are not medical care. We do not diagnose, treat, cure, or prevent any disease, injury, or medical condition. Any information, program, or recommendation provided through our Service is general coaching guidance based on the information you provide to us, and is not a substitute for individualized medical evaluation or care from a licensed healthcare provider.</p>
                </div>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">3. Not Physiotherapy</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>STRENTOR is not a physiotherapy practice, and our coaches do not act as physiotherapists, occupational therapists, or rehabilitation specialists. While our programming may be adapted around injuries, mobility limitations, or physical conditions you disclose to us, this adaptation is coaching in nature and is not clinical rehabilitation, manual therapy, or a physiotherapy treatment plan.</p>
                  <p>If you are recovering from an injury, surgery, or a condition that a physiotherapist or other rehabilitation professional is treating, you should continue to follow their guidance and involve them in decisions about whether and how you begin or continue training with us.</p>
                </div>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Not Emergency Support</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>STRENTOR is not equipped, staffed, or available to respond to medical emergencies. Our coaches communicate with clients through scheduled sessions, messaging, and program check-ins, none of which are monitored on an emergency basis or intended for urgent medical situations.</p>
                  <p>Do not rely on STRENTOR, our coaches, or our Service for emergency support of any kind.</p>
                </div>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Does Not Replace Medical Professionals</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>Nothing about our Service is intended to replace the advice, diagnosis, or treatment of a qualified physician, physiotherapist, registered dietitian, or any other licensed healthcare professional. You should continue to consult your own healthcare providers for any medical concerns, and you should never disregard, delay, or discontinue professional medical advice because of something you read on our Service or were told by a STRENTOR coach.</p>
                  <p>Where there is any conflict between guidance from your healthcare provider and guidance from STRENTOR, your healthcare provider's advice should always take priority.</p>
                </div>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Medical Clearance</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>Depending on the information you share with us — including through our intake or Fit Assessment process — we may ask you to obtain medical clearance from a physician before starting or continuing a coaching program. This may apply, for example, where you disclose a pre-existing condition, a recent injury or surgery, a chronic illness, or any other factor that could affect the safety of physical training for you.</p>
                  <p>It is your responsibility to obtain any medical clearance we request, and to share accurate and current information with both your physician and your STRENTOR coach. We may pause or decline to begin coaching until appropriate clearance has been provided.</p>
                </div>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">7. Results Vary — No Guarantees</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>Fitness and body composition outcomes depend on many factors outside our control, including your starting condition, consistency, effort, nutrition, sleep, stress, genetics, and adherence to the program. Because of this, STRENTOR does not guarantee any specific result, timeline, or outcome from our coaching programs, and testimonials or examples shared on our Service represent individual experiences rather than typical or guaranteed results.</p>
                </div>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">8. Your Responsibility to Disclose Health Information</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>You are responsible for accurately and honestly disclosing any health conditions, injuries, mobility limitations, medications, or other safety-relevant information to STRENTOR, whether through our intake and Fit Assessment forms or in ongoing conversations with your coach. This information allows us to design and adapt programming responsibly.</p>
                  <p>You agree to keep this information up to date and to promptly inform your coach of any change in your health status, including new injuries, diagnoses, or symptoms that arise during coaching. Incomplete or inaccurate disclosure may result in programming that is not appropriate for your circumstances, and STRENTOR cannot be responsible for outcomes arising from information you did not share with us.</p>
                </div>
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">9. Our Right to Decline or Pause Coaching</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>STRENTOR may, at our sole discretion, decline to begin, or may pause or discontinue, coaching services where we are unable to reasonably establish that training can proceed safely. This may include situations where requested medical clearance has not been provided, where disclosed health information raises safety concerns beyond the scope of fitness coaching, or where continuing training could reasonably put you at risk.</p>
                  <p>This is a safety measure, not a judgment on your ability to train. Where possible, we will explain our reasoning and, where appropriate, suggest that you seek guidance from a relevant medical professional before returning to coaching.</p>
                </div>
              </section>

              {/* Section 10 */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">10. Medical Emergencies</h2>
                <div className="text-muted-foreground space-y-4">
                  <p className="uppercase font-semibold">IF YOU ARE EXPERIENCING A MEDICAL EMERGENCY, CONTACT YOUR LOCAL EMERGENCY SERVICES IMMEDIATELY. DO NOT CONTACT STRENTOR OR YOUR COACH FOR EMERGENCY ASSISTANCE.</p>
                  <p>If you experience chest pain, severe shortness of breath, dizziness, fainting, sudden severe pain, or any other symptom that feels like a medical emergency during or after training, stop activity immediately and seek emergency medical attention.</p>
                </div>
              </section>

              {/* Section 11 */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">11. Assumption of Risk</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>Physical exercise carries inherent risk, including the risk of injury. By participating in STRENTOR coaching programs, you voluntarily assume the risks associated with physical training, and you agree that STRENTOR, its coaches, and its affiliates are not liable for injuries or health complications that may arise from your participation, except where such liability cannot be excluded under applicable law.</p>
                </div>
              </section>

              {/* Section 12 */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">12. Changes to This Disclaimer</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>We may update this Medical Disclaimer from time to time. We will notify you of material changes by posting the updated Disclaimer on this page. Your continued use of our Service after changes are posted constitutes your acceptance of the updated Disclaimer.</p>
                </div>
              </section>

              {/* Section 13 */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">13. Contact Us</h2>
                <div className="text-muted-foreground">
                  <p>If you have any questions about this Medical Disclaimer, please contact us by email: <a href="mailto:adityamandan@strentor.com" className="text-[#C9A96A] hover:underline">adityamandan@strentor.com</a>.</p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
