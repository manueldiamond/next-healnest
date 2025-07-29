"use client";

import React, { useState, useRef, useEffect } from 'react';
import { GlobalHeader } from '@/components/layout/global-header';
import { Send, Users, Smile, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

export default function CounsellingPage() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, user: 'Dr. Sarah', message: 'Hello! I\'m here to support you. How are you feeling today?', timestamp: '2:30 PM', isTherapist: true },
    { id: 2, user: 'You', message: 'I\'ve been feeling really anxious lately...', timestamp: '2:32 PM', isTherapist: false },
    { id: 3, user: 'Dr. Sarah', message: 'I understand. Anxiety can be overwhelming. Can you tell me more about what triggers these feelings?', timestamp: '2:35 PM', isTherapist: true },
    { id: 4, user: 'You', message: 'Work stress mostly, and I can\'t seem to relax', timestamp: '2:37 PM', isTherapist: false },
    { id: 5, user: 'Dr. Sarah', message: 'That sounds challenging. Let\'s work on some coping strategies together.', timestamp: '2:40 PM', isTherapist: true },
  ]);
  
  const userProfile = useAuthStore((state) => state.userProfile);
  const currentUser = userProfile?.anonymous_name || 'You';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        user: currentUser,
        message: message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isTherapist: false,
      };
      
      setMessages([...messages, newMessage]);
      setMessage('');
      
      // Simulate therapist response after 2 seconds
      setTimeout(() => {
        const therapistResponse = {
          id: messages.length + 2,
          user: 'Dr. Sarah',
          message: 'Thank you for sharing that with me. I\'m here to listen and help you work through this.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isTherapist: true,
        };
        setMessages(prev => [...prev, therapistResponse]);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-azure flex flex-col">
      <GlobalHeader 
        title="Counselling"
        showLogo={false}
        showBackButton={true}
        showRightButton={true}
        onBackClick={() => router.back()}
        onRightClick={() => setShowInfo(!showInfo)}
      />
      
      {/* Info Popover */}
      {showInfo && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowInfo(false)}
          />
          
          {/* Popover */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 w-80 max-w-[90vw] bg-cardBg rounded-3xl shadow-2xl border border-white/20">
            <div className="p-6">
              {/* Header with X button */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-primary">Counselling Info</h2>
                <button
                  onClick={() => setShowInfo(false)}
                  className="w-8 h-8 bg-chartPink/20 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-chartPink/30"
                >
                  <X className="w-4 h-4 text-chartPink" />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="w-20 h-20 bg-chartPink rounded-2xl flex items-center justify-center text-3xl mb-4 overflow-hidden">
                  👩‍⚕️
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">
                  Professional Counselling
                </h3>
                <p className="text-sm text-muted">
                  Connect with licensed therapists for professional mental health support and guidance.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white/50 rounded-xl p-3">
                  <div className="text-sm font-semibold text-primary">Dr. Sarah</div>
                  <div className="text-xs text-muted">Licensed Therapist</div>
                </div>
                <div className="bg-white/50 rounded-xl p-3">
                  <div className="text-sm font-semibold text-primary">Available 24/7</div>
                  <div className="text-xs text-muted">Professional Support</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Counselling Profile Section */}
      <div className="px-4 py-6 pt-20 mx-auto max-w-md">
        <div className="bg-cardBg rounded-2xl p-6 mb-6">
          <div className="mb-4">
            <div className="w-20 h-20 bg-chartPink rounded-2xl flex items-center justify-center text-3xl mb-4 overflow-hidden">
              👩‍⚕️
            </div>
            <h2 className="text-xl font-semibold text-primary mb-2">
              Professional Counselling
            </h2>
            <p className="text-sm text-muted">
              Connect with licensed therapists for professional mental health support and guidance.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white/50 rounded-xl p-3">
              <div className="text-sm font-semibold text-primary">Dr. Sarah</div>
              <div className="text-xs text-muted">Licensed Therapist</div>
            </div>
            <div className="bg-white/50 rounded-xl p-3">
              <div className="text-sm font-semibold text-primary">Available 24/7</div>
              <div className="text-xs text-muted">Professional Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages - Scrollable Area */}
      <div className="flex-1 max-w-md w-full flex-1 mx-auto overflow-y-auto px-4 py-4 space-y-4 pb-40">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start space-x-3 ${msg.isTherapist ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${msg.isTherapist ? 'bg-chartPink' : 'bg-primary'}`}>
              {msg.isTherapist ? (
                <span className="text-cardBg text-sm font-bold">👩‍⚕️</span>
              ) : (
                <Users className="w-4 h-4 text-cardBg" />
              )}
            </div>
            <div className={`flex-1 rounded-xl p-3 ${msg.isTherapist ? 'bg-cardBg' : 'bg-primary'}`}>
              <div className="flex items-center space-x-2 mb-1">
                <span className={`text-sm font-semibold ${msg.isTherapist ? 'text-primary' : 'text-cardBg'}`}>
                  {msg.user}
                </span>
                <span className={`text-xs ${msg.isTherapist ? 'text-muted' : 'text-cardBg/70'}`}>
                  {msg.timestamp}
                </span>
              </div>
              <p className={`text-sm ${msg.isTherapist ? 'text-primary' : 'text-cardBg'}`}>
                {msg.message}
              </p>
            </div>
          </div>
        ))}
        {/* Invisible div for scrolling to bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input - Fixed at Bottom */}
      <div className="p-4 bg-cardBg rounded-t-2xl border-t fixed bottom-0 left-0 w-full border-white/20">
        <div className="flex items-center max-w-md mx-auto space-x-3">
          <button className="w-10 h-10 bg-chartPink/20 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-chartPink/30">
            <Smile className="w-5 h-5 text-chartPink" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-white/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-chartPink"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="w-10 h-10 bg-chartPink rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Send className="w-4 h-4 text-cardBg" />
          </button>
        </div>
      </div>
    </div>
  );
} 