import React from 'react';
import { 
  Target, 
  HandshakeIcon, 
  Star 
} from 'lucide-react';

export function Mission() {
  return (
    <section className="bg-black text-white py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-black opacity-30"></div>
      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-5xl font-extrabold font-display mb-8 tracking-tight">
          <span className="text-[#B8935A] drop-shadow-[0_0_10px_rgba(201,151,43,0.5)]">Our Mission</span>
        </h2>
        <p className="text-2xl text-gray-200 max-w-4xl mx-auto mb-16 leading-relaxed">
          Most fitness coaching assumes a <span className="text-[#B8935A] font-bold">standing body</span>. STRENTOR exists to close
          that gap — bringing expert, adaptive strength coaching to wheelchair users and people
          managing long-term physical challenges, delivered virtually so location is never a barrier.
        </p>
        <div className="grid md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
          <div className="bg-black/70 backdrop-blur-sm p-8 rounded-xl border-t-4 border-[#C9A96A] shadow-2xl hover:scale-105 transition-transform">
            <div className="flex items-center mb-4">
              <Target className="text-[#C9A96A] mr-4" size={40} strokeWidth={2} />
              <h3 className="text-2xl font-bold text-[#C9A96A]">Vision</h3>
            </div>
            <p className="text-gray-300 text-lg">
              A world where wheelchair users have the same access to expert strength
              coaching as anyone else — no accessible gym required.
            </p>
          </div>
          <div className="bg-black/70 backdrop-blur-sm p-8 rounded-xl border-t-4 border-[#B8935A] shadow-2xl hover:scale-105 transition-transform">
            <div className="flex items-center mb-4">
              <HandshakeIcon className="text-[#B8935A] mr-4" size={40} strokeWidth={2} />
              <h3 className="text-2xl font-bold text-[#B8935A]">Promise</h3>
            </div>
            <p className="text-gray-300 text-lg">
              Every program adapts to your body and your equipment — never a
              standing-body plan with a few exercises swapped out.
            </p>
          </div>
          <div className="bg-black/70 backdrop-blur-sm p-8 rounded-xl border-t-4 border-[#C9C0B4] shadow-2xl hover:scale-105 transition-transform">
            <div className="flex items-center mb-4">
              <Star className="text-[#C9C0B4] mr-4" size={40} strokeWidth={2} />
              <h3 className="text-2xl font-bold text-[#C9C0B4]">Values</h3>
            </div>
            <p className="text-gray-300 text-lg">
              Strength, resilience, and lived coaching experience — programming
              shaped by a national-level para powerlifter, not a textbook.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Mission;