"use client";

import React, { useState } from 'react';
import { GlobalHeader } from '@/components/layout/global-header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, TrendingUp, Heart, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Generate random mood data for the line chart
const generateMoodData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day) => ({
    day,
    value: Math.floor(Math.random() * 5) + 1, // Random mood value 1-5
  }));
};

// Random favorite nests
const favoriteNests = [
  { id: 'anxiety', name: 'Anxiety Nest', avatar: '😰' },
  { id: 'heartbreak', name: 'Heartbreak Nest', avatar: '💔' },
];

export default function ProfilePage() {
  const router = useRouter();
  const userProfile = useAuthStore((state) => state.userProfile);
  const { setUser, setUserProfile } = useAuthStore();
  const [moodData] = useState(generateMoodData());

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setUserProfile(null as any);
      router.push('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Mock data
  const xp = 45;
  const level = 3;
  const nextLevel = 4;
  const xpToNext = 10;
  const focusStreak = 9;

  // Chart configuration
  const chartData = {
    labels: moodData.map((item: any) => item.day),
    datasets: [
      {
        label: 'Mood Level',
        data: moodData.map((item: any) => item.value),
        borderColor: '#FF8BA7',
        backgroundColor: '#FF8BA7',
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: '#FF8BA7',
        pointBorderColor: '#FFF9F0',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#4F7972',
        bodyColor: '#4F7972',
        borderColor: '#D9E3E4',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            const moodLabels = ['', 'Sad', 'Anxious', 'Stressed', 'Calm', 'Happy'];
            return `Mood: ${moodLabels[context.parsed.y]}`;
          }
        }
      },
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        display: false,
      },
    },
  };

  return (
    <div className="min-h-screen bg-sand py-20">
      <GlobalHeader 
        title=""
        showLogo
        showBackButton
        showRightButton
        onRightClick={() => router.back()}
      />
      
      <div className="max-w-md mx-auto px-4 space-y-6">
        {/* Profile Header */}
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-chartPink rounded-2xl flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-primary">
              {userProfile?.anonymous_name || 'Anonymous User'}
            </h1>
            <p className="text-muted">
              {userProfile?.username || 'User'}
            </p>
          </div>
        </div>

        {/* Points Card */}
        <div className="bg-cardBg rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">Points</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-primary">{xp} XP</div>
                <div className="text-sm text-muted">Level {level}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-primary">Rookie</div>
                <div className="text-sm text-muted">{xpToNext}pts to level up</div>
              </div>
            </div>
            
            <div className="w-full bg-white/50 rounded-full h-3">
              <div 
                className="bg-chartPink h-3 rounded-full transition-all duration-300"
                style={{ width: `${(xp % 10) * 10}%` }}
              />
            </div>
            
            <div className="text-center text-sm text-muted">
              Next level: {nextLevel}
            </div>
          </div>
        </div>

        {/* Focus Streak Card */}
        <div className="bg-cardBg rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">Focus Streak</h2>
          <div className="text-3xl font-bold text-primary">{focusStreak} days</div>
          <div className="text-sm text-muted">Current streak</div>
        </div>

        {/* Mood Over Time Card */}
        <div className="bg-cardBg rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">Mood Over Time</h2>
          
          <div className="bg-sand rounded-xl p-4 mb-4">
            <div className="h-48">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
          
          {/* Favorite Nests */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-primary">Favorite Nests</h3>
            <div className="flex space-x-3">
              {favoriteNests.map((nest) => (
                <button
                  key={nest.id}
                  onClick={() => router.push(`/chat/${nest.id}`)}
                  className="flex-1 bg-sand rounded-xl p-3 flex items-center space-x-2 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <div className="text-xl">{nest.avatar}</div>
                  <span className="text-sm font-medium text-primary">{nest.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white rounded-xl py-3 font-semibold transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
} 