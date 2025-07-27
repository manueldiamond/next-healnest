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
      icon: <Heart className="w-8 h-8 text-accent-blue" />,
      title: "Wellness First",
      description: "Every interaction is designed to promote mental health and positive vibes"
    },
    {
      icon: <Users className="w-8 h-8 text-accent-blue" />,
      title: "Group Nests Only",
      description: "Safe group conversations with no DMs - build community, not isolation"
    },
    {
      icon: <Shield className="w-8 h-8 text-accent-blue" />,
      title: "Anonymous Mode",
      description: "Express yourself freely with our anonymous posting feature"
    },
    {
      icon: <Sparkles className="w-8 h-8 text-accent-blue" />,
      title: "Aura System",
      description: "Level up your positive impact with our unique gamification"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-hue-gradient shadow-2xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          
          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-primary tracking-tight">
              Hue<span className="text-accent-blue">Nest</span>
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
            Why HueNest?
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