"use client";
import React from 'react';
import { GlobalHeader } from '@/components/layout/global-header';
import { useRouter } from 'next/navigation';
import { Video, Camera, TrendingUp, DollarSign } from 'lucide-react';

export default function MoneyVaultPage() {
  const router = useRouter();
  
  const microCourses = [
    {
      id: 'video-editing',
      title: 'Video Editing',
      lessonsCompleted: 1,
      totalLessons: 4,
      icon: Video,
    },
    {
      id: 'photography',
      title: 'Photography',
      lessonsCompleted: 3,
      totalLessons: 6,
      icon: Camera,
    },
    {
      id: 'social-media',
      title: 'Social Media Marketing',
      lessonsCompleted: 2,
      totalLessons: 5,
      icon: TrendingUp,
    },
  ];

  const gigs = [
    {
      id: 'video-editor',
      title: 'Video Editor Needed for IG',
      pay: '10K',
      icon: Video,
    },
    {
      id: 'remote-camp',
      title: 'Remote Camps Ambassador',
      pay: '20K',
      icon: Camera,
    },
    {
      id: 'smm',
      title: 'SMM',
      pay: '15K',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-sand py-20">
      <GlobalHeader
        title="Money Vault"
        showLogo={false}
        showBackButton={true}
        showRightButton={false}
        onBackClick={() => router.back()}
      />
      
      <div className="max-w-md mx-auto px-4 space-y-6">
        {/* Micro Courses */}
        <div className="bg-cardBg rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">Micro-courses</h2>
          <div className="space-y-4">
            {microCourses.map((course) => {
              const Icon = course.icon;
              return (
                <div key={course.id} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 bg-sand rounded-xl p-3">
                    <div className="text-sm font-semibold text-primary">
                      {course.title}
                    </div>
                    <div className="text-xs text-muted">
                      {course.lessonsCompleted} of {course.totalLessons} lessons completed
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gig Board */}
        <div className="bg-cardBg rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">Gig Board</h2>
          <div className="space-y-4">
            {gigs.map((gig) => {
              const Icon = gig.icon;
              return (
                <div key={gig.id} className="flex items-center justify-between bg-sand rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-primary">
                        {gig.title}
                      </div>
                      <div className="text-xs text-muted">
                        ₦{gig.pay}
                      </div>
                    </div>
                  </div>
                  <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95">
                    Apply
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 