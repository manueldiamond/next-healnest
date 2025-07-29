"use client";

import React, { useState, useRef, useEffect } from 'react';
import { GlobalHeader } from '@/components/layout/global-header';
import { Send, Users, MoreHorizontal, Smile, ChevronDown, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

const nestData: { [key: string]: any } = {
  'anxiety': {
    name: 'Anxiety Nest',
    description: 'A safe space to share anxiety struggles and find support from others who understand.',
    avatar: '😰',
    memberCount: 127,
    onlineMods: 2,
    onlineMembers: 8,
  },
  'overthinking': {
    name: 'Overthinking Nest',
    description: 'For those who tend to overthink and need a place to share thoughts and get perspective.',
    avatar: '🤔',
    memberCount: 89,
    onlineMods: 1,
    onlineMembers: 5,
  },
  'burnout': {
    name: 'Burnout Nest',
    description: 'Support for those dealing with work, life, or emotional burnout.',
    avatar: '😤',
    memberCount: 156,
    onlineMods: 3,
    onlineMembers: 12,
  },
  'heartbreak': {
    name: 'Heartbreak Nest',
    description: 'Healing from relationships, breakups, and emotional pain.',
    avatar: '💔',
    memberCount: 203,
    onlineMods: 2,
    onlineMembers: 15,
  },
  'money-stress': {
    name: 'Money Stress Nest',
    description: 'Financial anxiety, money worries, and economic stress support.',
    avatar: '💰',
    memberCount: 94,
    onlineMods: 1,
    onlineMembers: 6,
  },
};

export default function ChatPage({ params }: { params: { nestId: string } }) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [showNestInfo, setShowNestInfo] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, user: 'Worried Owl', message: 'Hey everyone, how are you feeling today?', timestamp: '2:30 PM' },
    { id: 2, user: 'Anxious Panda', message: 'I\'ve been feeling really anxious lately...', timestamp: '2:32 PM' },
    { id: 3, user: 'Calm Deer', message: 'You\'re not alone. I feel the same way.', timestamp: '2:35 PM' },
    { id: 4, user: 'Worried Owl', message: 'Thanks for the support everyone 💙', timestamp: '2:37 PM' },
    { id: 5, user: 'Anxious Panda', message: 'This community is amazing', timestamp: '2:40 PM' },
  ]);
  
  const userProfile = useAuthStore((state) => state.userProfile);
  const currentUser = userProfile?.anonymous_name || 'Anonymous User';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const nest = nestData[params.nestId] || nestData['anxiety'];

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
      };
      
      setMessages([...messages, newMessage]);
      setMessage('');

    }
  };

  return (
    <div className="min-h-screen bg-azure flex flex-col">
      <GlobalHeader 
        title={nest.name}
        showLogo={false}
        showBackButton={true}
        showRightButton={true}
        onBackClick={() => router.back()}
        onRightClick={() => setShowNestInfo(!showNestInfo)}
      />
      
      {/* Nest Info Popover */}
      {showNestInfo && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowNestInfo(false)}
          />
          
          {/* Popover */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 w-80 max-w-[90vw] bg-cardBg rounded-3xl shadow-2xl border border-white/20">
            <div className="p-6">
              {/* Header with X button */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-primary">Nest Info</h2>
                <button
                  onClick={() => setShowNestInfo(false)}
                  className="w-8 h-8 bg-chartPink/20 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-chartPink/30"
                >
                  <X className="w-4 h-4 text-chartPink" />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="w-20 h-20 bg-chartPink rounded-2xl flex items-center justify-center text-3xl mb-4 overflow-hidden">
                  {nest.avatar}
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {nest.name}
                </h3>
                <p className="text-sm text-muted">
                  {nest.description}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/50 rounded-xl p-3">
                  <div className="text-2xl font-bold text-primary">{nest.onlineMods}</div>
                  <div className="text-xs text-muted">Mods Online</div>
                </div>
                <div className="bg-white/50 rounded-xl p-3">
                  <div className="text-2xl font-bold text-primary">{nest.onlineMembers}</div>
                  <div className="text-xs text-muted">Members Online</div>
                </div>
              </div>
              
              <div className="bg-white/50 rounded-xl p-3">
                <div className="text-lg font-semibold text-primary">{nest.memberCount}</div>
                <div className="text-xs text-muted">Total Members</div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Nest Profile Section */}
      <div className="px-4 py-6 pt-20 mx-auto max-w-md">
        <div className="bg-cardBg rounded-2xl p-6 mb-6">
          <div className="mb-4">
            <div className="w-20 h-20 bg-chartPink rounded-2xl flex items-center justify-center text-3xl mb-4 overflow-hidden">
              {nest.avatar}
            </div>
            <h2 className="text-xl font-semibold text-primary mb-2">
              {nest.name}
            </h2>
            <p className="text-sm text-muted">
              {nest.description}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/50 rounded-xl p-3">
              <div className="text-lg font-bold text-primary">{nest.onlineMods}</div>
              <div className="text-xs text-muted">Mods Online</div>
            </div>
            <div className="bg-white/50 rounded-xl p-3">
              <div className="text-lg font-bold text-primary">{nest.onlineMembers}</div>
              <div className="text-xs text-muted">Members Online</div>
            </div>
          </div>
          
          <div className="mt-4 bg-white/50 rounded-xl p-3">
            <div className="text-base font-semibold text-primary">{nest.memberCount}</div>
            <div className="text-xs text-muted">Total Members</div>
          </div>
        </div>
      </div>

      {/* Chat Messages - Scrollable Area */}
      <div className="flex-1 max-w-md w-full flex-1 mx-auto overflow-y-auto px-4 py-4 space-y-4 mt- pb-40">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-chartPink rounded-full flex items-center justify-center overflow-hidden">
              {msg.user === currentUser && userProfile?.avatar_url ? (
                <img 
                  src={userProfile.avatar_url} 
                  alt="User Avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Users className="w-4 h-4 text-cardBg" />
              )}
            </div>
            <div className="flex-1 bg-cardBg rounded-xl p-3">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-semibold text-primary">
                  {msg.user}
                </span>
                <span className="text-xs text-muted">
                  {msg.timestamp}
                </span>
              </div>
              <p className="text-sm text-primary">
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