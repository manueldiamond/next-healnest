"use client";

import React, { useState } from 'react';
import { GlobalHeader } from '@/components/layout/global-header';
import { ChevronDown, ChevronUp, Play, Clock, Target, Heart, Brain, Zap, Sun, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Exercise {
  id: string;
  title: string;
  icon: React.ReactNode;
  duration: string;
  description: string;
  instructions: string[];
  benefits: string[];
}

const exercises: Exercise[] = [
  {
    id: 'breathing',
    title: 'Deep Breathing Exercise',
    icon: <Heart className="w-6 h-6" />,
    duration: '5-10 minutes',
    description: 'A simple yet powerful technique to calm your mind and reduce anxiety.',
    instructions: [
      'Find a comfortable seated position',
      'Place one hand on your chest and the other on your belly',
      'Breathe in slowly through your nose for 4 counts',
      'Hold your breath for 4 counts',
      'Exhale slowly through your mouth for 6 counts',
      'Repeat this cycle for 5-10 minutes'
    ],
    benefits: [
      'Reduces anxiety and stress',
      'Lowers blood pressure',
      'Improves focus and concentration',
      'Promotes relaxation'
    ]
  },
  {
    id: 'progressive-relaxation',
    title: 'Progressive Muscle Relaxation',
    icon: <Target className="w-6 h-6" />,
    duration: '15-20 minutes',
    description: 'Systematically tense and relax muscle groups to release physical tension.',
    instructions: [
      'Lie down in a comfortable position',
      'Start with your toes - tense them for 5 seconds',
      'Release and feel the relaxation for 10 seconds',
      'Move up to your calves, thighs, abdomen, chest, arms, hands, neck, and face',
      'Focus on the contrast between tension and relaxation',
      'End with a full body relaxation scan'
    ],
    benefits: [
      'Reduces muscle tension',
      'Improves sleep quality',
      'Decreases anxiety symptoms',
      'Enhances body awareness'
    ]
  },
  {
    id: 'mindfulness',
    title: 'Mindfulness Meditation',
    icon: <Brain className="w-6 h-6" />,
    duration: '10-15 minutes',
    description: 'Practice present-moment awareness to cultivate inner peace.',
    instructions: [
      'Sit comfortably with your back straight',
      'Close your eyes or focus on a point',
      'Bring attention to your natural breath',
      'When your mind wanders, gently return to your breath',
      'Observe thoughts without judgment',
      'Continue for 10-15 minutes'
    ],
    benefits: [
      'Reduces stress and anxiety',
      'Improves emotional regulation',
      'Enhances self-awareness',
      'Increases focus and clarity'
    ]
  },
  {
    id: 'grounding',
    title: '5-4-3-2-1 Grounding Exercise',
    icon: <Zap className="w-6 h-6" />,
    duration: '3-5 minutes',
    description: 'Use your senses to anchor yourself in the present moment.',
    instructions: [
      'Look around and name 5 things you can see',
      'Touch 4 things and describe their texture',
      'Listen for 3 sounds you can hear',
      'Identify 2 things you can smell',
      'Name 1 thing you can taste',
      'Take a deep breath and notice how you feel'
    ],
    benefits: [
      'Reduces anxiety and panic',
      'Brings you back to the present',
      'Helps with dissociation',
      'Provides immediate relief'
    ]
  },
  {
    id: 'gratitude',
    title: 'Gratitude Practice',
    icon: <Sun className="w-6 h-6" />,
    duration: '5-10 minutes',
    description: 'Focus on the positive aspects of your life to improve mood.',
    instructions: [
      'Find a quiet, comfortable space',
      'Think of 3 things you\'re grateful for today',
      'Write them down or say them out loud',
      'Reflect on why each one matters to you',
      'Notice how you feel after this practice',
      'Make this a daily habit'
    ],
    benefits: [
      'Improves mood and happiness',
      'Reduces stress and anxiety',
      'Enhances relationships',
      'Increases resilience'
    ]
  },
  {
    id: 'sleep-hygiene',
    title: 'Sleep Hygiene Routine',
    icon: <Moon className="w-6 h-6" />,
    duration: '30-60 minutes',
    description: 'Create a calming bedtime routine to improve sleep quality.',
    instructions: [
      'Set a consistent bedtime and wake time',
      'Create a relaxing 30-60 minute routine',
      'Avoid screens 1 hour before bed',
      'Practice gentle stretching or yoga',
      'Read a book or listen to calming music',
      'Keep your bedroom cool, dark, and quiet'
    ],
    benefits: [
      'Improves sleep quality',
      'Reduces insomnia',
      'Enhances daytime energy',
      'Supports mental health'
    ]
  }
];

export default function GuidedExercisesPage() {
  const router = useRouter();
  const [openExercise, setOpenExercise] = useState<string | null>(null);

  const toggleExercise = (exerciseId: string) => {
    setOpenExercise(openExercise === exerciseId ? null : exerciseId);
  };

  return (
    <div className="min-h-screen bg-azure">
      <GlobalHeader 
        title="Guided Exercises"
        showLogo={false}
        showBackButton={true}
        showRightButton={false}
        onBackClick={() => router.back()}
      />
      
      <div className="px-4 py-6 pt-20 mx-auto max-w-md">
        <div className="space-y-4">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="bg-cardBg rounded-2xl overflow-hidden">
              {/* Exercise Header */}
              <button
                onClick={() => toggleExercise(exercise.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-white/50 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-chartPink rounded-xl flex items-center justify-center">
                    <span className="text-cardBg">
                      {exercise.icon}
                    </span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-primary">
                      {exercise.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="w-4 h-4 text-muted" />
                      <span className="text-sm text-muted">
                        {exercise.duration}
                      </span>
                    </div>
                  </div>
                </div>
                {openExercise === exercise.id ? (
                  <ChevronUp className="w-5 h-5 text-muted" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted" />
                )}
              </button>
              
              {/* Exercise Details */}
              {openExercise === exercise.id && (
                <div className="px-6 pb-6 space-y-4">
                  <p className="text-sm text-muted">
                    {exercise.description}
                  </p>
                  
                  {/* Instructions */}
                  <div>
                    <h4 className="text-sm font-semibold text-primary mb-2">
                      Instructions:
                    </h4>
                    <ol className="space-y-2">
                      {exercise.instructions.map((instruction, index) => (
                        <li key={index} className="text-sm text-primary flex items-start space-x-2">
                          <span className="w-5 h-5 bg-chartPink/20 rounded-full flex items-center justify-center text-xs font-bold text-chartPink mt-0.5">
                            {index + 1}
                          </span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  {/* Benefits */}
                  <div>
                    <h4 className="text-sm font-semibold text-primary mb-2">
                      Benefits:
                    </h4>
                    <ul className="space-y-1">
                      {exercise.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm text-muted flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 bg-chartPink rounded-full mt-2 flex-shrink-0"></span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Start Button */}
                  <button className="w-full bg-chartPink text-cardBg py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-chartPink/90 transition-all duration-200">
                    <Play className="w-4 h-4" />
                    <span>Start Exercise</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 