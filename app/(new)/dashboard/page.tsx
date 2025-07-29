"use client";

import React, { useState } from 'react';
import { GlobalHeader } from '@/components/layout/global-header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Heart, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Dummy data for the mood chart
const generateMoodData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, index) => ({
    day,
    value: Math.floor(Math.random() * 5) + 1, // Random mood value 1-5
  }));
};

// Single uniform color for all bars - pastel pink that POPs!
const chartColor = '#FF8BA7'; // chartPink - soft pastel pink

export default function DashboardPage() {
  const [moodData] = useState(generateMoodData());
  const router = useRouter();

  // Chart.js configuration
  const chartData = {
    labels: moodData.map(item => item.day),
    datasets: [
      {
        label: 'Mood Level',
        data: moodData.map(item => item.value),
        backgroundColor: chartColor,
        borderColor: chartColor + '80', // Add transparency
        borderWidth: 0, // No border
        borderRadius: 8,
        borderSkipped: false,
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
        display: false, // Hide Y axis completely
      },
      x: {
        display: false, // Hide X axis completely
      },
    },
  };

  return (
    <div className="min-h-screen bg-azure py-20">
      <GlobalHeader 
        title="HealNest"
        showLogo
        showBackButton={false}
        showRightButton={false}
      />
      
      <div className="max-w-md mx-auto px-4 space-y-6">
        {/* Mood Chart Card */}
        <div className="bg-cardBg rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Mood over the last 7 days
          </h2>
          
          <div className="h-64">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Heal Card */}
          <button
            onClick={() => router.push('/heal')}
            className="bg-cardBg rounded-2xl p-6 flex flex-col items-center space-y-3 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <div className="w-16 h-16 bg-chartPink rounded-2xl flex items-center justify-center">
              <Heart className="w-8 h-8 text-cardBg" />
            </div>
            <h3 className="text-lg font-semibold text-primary text-center">
              Heal
            </h3>
          </button>

          {/* Grow Card */}
          <button
            onClick={() => router.push('/grow')}
            className="bg-cardBg rounded-2xl p-6 flex flex-col items-center space-y-3 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <div className="w-16 h-16 bg-chartPink rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-cardBg" />
            </div>
            <h3 className="text-lg font-semibold text-primary text-center">
              Grow
            </h3>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
} 