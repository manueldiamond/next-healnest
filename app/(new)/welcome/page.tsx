"use client";

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const moods = [
  { emoji: '😊', label: 'Happy', value: 5, moodValue: 5 },
  { emoji: '😌', label: 'Calm', value: 4, moodValue: 4 },
  { emoji: '😤', label: 'Stressed', value: 3, moodValue: 3 },
  { emoji: '😰', label: 'Anxious', value: 2, moodValue: 2 },
  { emoji: '😔', label: 'Sad', value: 1, moodValue: 1 },
];

export default function NewHomePage() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [moodDetails, setMoodDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleMoodSelect = (moodValue: number) => {
    setSelectedMood(moodValue);
  };

  const handleProceed = async () => {
    if (!selectedMood || !userProfile?.id) return;
    
    const selectedMoodData = moods.find(mood => mood.value === selectedMood);
    if (!selectedMoodData) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('moods')
        .insert({
          user_id: userProfile.id,
          mood_value: selectedMoodData.moodValue,
          mood_label: selectedMoodData.label,
          details: moodDetails || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving mood:', error);
        // You might want to show a toast notification here
        return;
      }

      console.log('Mood saved successfully:', data);
      // Navigate to the dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving mood:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const userProfile=useAuthStore(s=>s.userProfile)

  return (
    <div className="min-h-screen bg-bg-sand-gradient flex flex-col justify-between p-4">

      <div className="max-w-md mx-auto space-y-8">

        {/* Logo */}
        <div className="flex justify-center pt-8">
            <img
              src="/logo.png"
              alt="HealNest Logo"
              className="w-12 h-12 object-contain"
              style={{
                filter:
                  'brightness(0) saturate(100%) invert(32%) sepia(13%) saturate(1012%) hue-rotate(110deg) brightness(92%) contrast(90%)',
              }}
            />
        </div>

        {/* Welcome Message */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-medium text-primary">
            Welcome back, {userProfile?.username||'User'}
          </h1>
          <p className="text-3xl font-light text-muted">
            Howya feeling today?
          </p>
        </div>

        {/* Mood Tracker */}
            <div className="grid grid-cols-5 gap-0 ">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => handleMoodSelect(mood.value)}
                  className={`p-4 rounded-xl transition-all duration-200 flex flex-col items-center space-y-2 ${
                    selectedMood === mood.value
                      ? 'bg-primary text-white shadow-lg scale-105'
                      : 'hover:scale-105'
                  }`}
                >
                  <span className="text-5xl">{mood.emoji}</span>
                  <span className="text-xs font-medium">{mood.label}</span>
                </button>
              ))}
            </div>

        {/* Tell us more button */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="text-center text-muted text-base font-semibold cursor-pointer py-3 transition hover:text-accent-blue"
          style={{ outline: 'none' }}
        >
          Tell us more?
        </div>
       {/* Proceed button */}
       </div>

      <Button
        onClick={handleProceed}
        disabled={!selectedMood || isLoading}
        size={'lg'}
        className="w-full  max-w-md mx-auto  mt-auto bg-primary text-white hover:bg-primary/90 rounded-2xl py-6 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Saving...' : 'Continued to HealNest'}
      </Button>

      {/* Modal for mood details */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-surface border-0 shadow-xl rounded-2xl max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-primary text-center">
              Tell us more about how you're feeling
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Describe your mood, thoughts, or anything you'd like to share..."
              value={moodDetails}
              onChange={(e) => setMoodDetails(e.target.value)}
              className="min-h-[120px] border-azure focus:border-primary rounded-xl resize-none"
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-azure border-azure text-primary hover:bg-green/50 rounded-xl"
              >
                Cancel
              </Button>
              <Button
              
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-primary text-white hover:bg-primary/90 rounded-xl"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 