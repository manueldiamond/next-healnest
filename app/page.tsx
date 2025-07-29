"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Heart, Users, Shield, ArrowRight } from 'lucide-react';
import { HueButton } from '@/components/ui/hue-button';
import { HueCard, HueCardContent, HueCardDescription, HueCardTitle } from '@/components/ui/hue-card';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';

export default function LandingPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        router.push('/chats');
      }
    };
    checkUser();
  }, [setUser, router]);

  const features = [
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: "🪹 The Nests",
      description: "Anonymous support rooms where students share and heal in themed spaces like the Overthinking Nest, Heartbreak Nest, or Money Stress Nest."
    },
    {
      icon: <Heart className="w-8 h-8 text-white" />,
      title: "🧘 Mood Tracker + Healing Vault",
      description: "A personal check-in space that helps users track emotions, reflect privately, and grow over time."
    },
    {
      icon: <Shield className="w-8 h-8 text-white" />,
      title: "🎯 Focus Nests",
      description: "Timed, silent virtual rooms that help students stay productive, build consistency, and study in community."
    },
    {
      icon: <Sparkles className="w-8 h-8 text-white" />,
      title: "💰 Money Nest",
      description: "Real-life hustle tips, gig boards, and budgeting support because sometimes, the root of mental stress… is money."
    }
  ];

  return (
    <div className="min-h-screen bg-sand relative overflow-hidden">
      {/* Floating Emojis Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 text-4xl animate-bounce">💖</div>
        <div className="absolute top-40 right-20 text-3xl animate-pulse">🧠</div>
        <div className="absolute bottom-40 left-20 text-3xl animate-bounce delay-1000">🌈</div>
        <div className="absolute bottom-20 right-10 text-4xl animate-pulse delay-500">✨</div>
      </div>

      <div className="flex flex-col min-h-screen relative z-10">
        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-2xl w-full text-center space-y-12">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-2xl bg-chartPink shadow-lg animate-pulse">
              <img 
                src="/logo.png" 
                alt="HealNest Logo" 
                className="w-16 h-16 object-contain"
                style={{
                  filter: 'invert(34%) sepia(10%) saturate(1012%) hue-rotate(110deg) brightness(90%) contrast(90%)',
                }}
              />
            </div>
            
            {/* Heading */}
            <div className="space-y-6">
              <h1 className="text-6xl font-heading font-bold text-primary leading-tight">
                HealNest – A Safe Space to Feel Seen
              </h1>
              <p className="text-xl font-body text-muted max-w-lg mx-auto">
                Built for Gen Z, by Gen Z. Safe. Wholesome. Real.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/auth" className="block">
                <button className="w-full sm:w-auto bg-primary text-white rounded-xl py-4 px-8 font-semibold transition-all duration-200 hover:scale-105 active:scale-95">
                  Join a Nest 💖
                </button>
              </Link>
              <Link href="/auth" className="block">
                <button className="w-full sm:w-auto bg-white/80 text-primary rounded-xl py-4 px-8 font-semibold border border-white/20 transition-all duration-200 hover:bg-white">
                  Find your Space ✨
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-20 bg-cardBg/50 border-t border-white/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-heading font-bold text-center text-primary mb-16">
              Why Choose HealNest? ✨
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {features.map((feature, index) => (
                <div key={index} className="text-center space-y-6 p-8 rounded-2xl bg-cardBg shadow-lg border border-white/20 hover:scale-105 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-chartPink shadow-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-heading font-semibold text-primary">{feature.title}</h3>
                  <p className="text-body text-muted text-lg leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 py-8 bg-cardBg/50 border-t border-white/20">
          <div className="max-w-md mx-auto text-center">
            <p className="text-sm text-muted">
              Made with 💜 for university students everywhere
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}