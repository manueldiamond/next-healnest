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
      icon: <Users className="w-8 h-8 text-accent-blue" />,
      title: "🪹 The Nests",
      description: "Anonymous support rooms where students share and heal in themed spaces like the Overthinking Nest, Heartbreak Nest, or Money Stress Nest."
    },
    {
      icon: <Heart className="w-8 h-8 text-accent-blue" />,
      title: "🧘 Mood Tracker + Healing Vault",
      description: "A personal check-in space that helps users track emotions, reflect privately, and grow over time."
    },
    {
      icon: <Shield className="w-8 h-8 text-accent-blue" />,
      title: "🎯 Focus Nests",
      description: "Timed, silent virtual rooms that help students stay productive, build consistency, and study in community."
    },
    {
      icon: <Sparkles className="w-8 h-8 text-accent-blue" />,
      title: "💰 Money Nest",
      description: "Real-life hustle tips, gig boards, and budgeting support because sometimes, the root of mental stress… is money."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-hue-gradient shadow-2xl overflow-hidden">
            <img src="/logo.png" alt="HealNest Logo" className="w-12 h-12 object-contain" />
          </div>
          
          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-primary tracking-tight">
              Heal<span className="text-accent-blue">Nest</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Your safe space for better mental health, self-expression, and genuine vibes.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Link href="/auth" className="block">
              <HueButton size="lg" className="w-full">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </HueButton>
            </Link>
            <p className="text-sm text-muted-foreground">
              Join thousands of university students
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 pb-16">
        <div className="max-w-md mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-center text-primary mb-8">
            Why HealNest?
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {features.map((feature, index) => (
              <HueCard key={index} className="p-4">
                <HueCardContent className="pt-0">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-2 rounded-xl bg-accent-blue/10">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <HueCardTitle className="text-lg mb-2">
                        {feature.title}
                      </HueCardTitle>
                      <HueCardDescription>
                        {feature.description}
                      </HueCardDescription>
                    </div>
                  </div>
                </HueCardContent>
              </HueCard>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-white/20">
        <div className="max-w-md mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Made with 💜 for university students everywhere
          </p>
        </div>
      </footer>
    </div>
  );
}