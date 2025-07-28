"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Lock, Globe, Sparkles } from 'lucide-react';
import { HueButton } from '@/components/ui/hue-button';
import { HueCard, HueCardContent } from '@/components/ui/hue-card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';

export default function CreateNestPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    avatar_url: '',
  });
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Nest avatar options - Fancy icons for different nest types
  const nestAvatarOptions = [
    // Mental Health & Wellness
    'https://api.dicebear.com/7.x/icons/svg?seed=anxiety&backgroundColor=ffe2f1&icon=heart',
    'https://api.dicebear.com/7.x/icons/svg?seed=depression&backgroundColor=a5c8e4&icon=cloud',
    'https://api.dicebear.com/7.x/icons/svg?seed=stress&backgroundColor=f9f0c1&icon=zap',
    'https://api.dicebear.com/7.x/icons/svg?seed=burnout&backgroundColor=ff6b6b&icon=flame',
    'https://api.dicebear.com/7.x/icons/svg?seed=overthinking&backgroundColor=4ecdc4&icon=brain',
    'https://api.dicebear.com/7.x/icons/svg?seed=loneliness&backgroundColor=45b7d1&icon=users',
    
    // Academic & Study
    'https://api.dicebear.com/7.x/icons/svg?seed=study&backgroundColor=96ceb4&icon=book',
    'https://api.dicebear.com/7.x/icons/svg?seed=exam&backgroundColor=ffeaa7&icon=target',
    'https://api.dicebear.com/7.x/icons/svg?seed=deadline&backgroundColor=dda0dd&icon=clock',
    'https://api.dicebear.com/7.x/icons/svg?seed=procrastination&backgroundColor=fdcb6e&icon=hourglass',
    
    // Financial & Money
    'https://api.dicebear.com/7.x/icons/svg?seed=money&backgroundColor=00b894&icon=dollar-sign',
    'https://api.dicebear.com/7.x/icons/svg?seed=budget&backgroundColor=74b9ff&icon=calculator',
    'https://api.dicebear.com/7.x/icons/svg?seed=debt&backgroundColor=e17055&icon=credit-card',
    'https://api.dicebear.com/7.x/icons/svg?seed=investing&backgroundColor=6c5ce7&icon=trending-up',
    
    // Relationships & Social
    'https://api.dicebear.com/7.x/icons/svg?seed=heartbreak&backgroundColor=fd79a8&icon=heart-off',
    'https://api.dicebear.com/7.x/icons/svg?seed=friendship&backgroundColor=a29bfe&icon=users',
    'https://api.dicebear.com/7.x/icons/svg?seed=family&backgroundColor=fd79a8&icon=home',
    'https://api.dicebear.com/7.x/icons/svg?seed=dating&backgroundColor=00cec9&icon=heart',
    
    // Career & Work
    'https://api.dicebear.com/7.x/icons/svg?seed=career&backgroundColor=636e72&icon=briefcase',
    'https://api.dicebear.com/7.x/icons/svg?seed=interview&backgroundColor=2d3436&icon=user-check',
    'https://api.dicebear.com/7.x/icons/svg?seed=workplace&backgroundColor=0984e3&icon=building',
    'https://api.dicebear.com/7.x/icons/svg?seed=entrepreneur&backgroundColor=fdcb6e&icon=zap',
    
    // Physical Health
    'https://api.dicebear.com/7.x/icons/svg?seed=fitness&backgroundColor=00b894&icon=activity',
    'https://api.dicebear.com/7.x/icons/svg?seed=nutrition&backgroundColor=fdcb6e&icon=apple',
    'https://api.dicebear.com/7.x/icons/svg?seed=sleep&backgroundColor=6c5ce7&icon=moon',
    'https://api.dicebear.com/7.x/icons/svg?seed=meditation&backgroundColor=00cec9&icon=feather',
    
    // Creative & Hobbies
    'https://api.dicebear.com/7.x/icons/svg?seed=art&backgroundColor=e84393&icon=palette',
    'https://api.dicebear.com/7.x/icons/svg?seed=music&backgroundColor=a29bfe&icon=music',
    'https://api.dicebear.com/7.x/icons/svg?seed=writing&backgroundColor=74b9ff&icon=pen-tool',
    'https://api.dicebear.com/7.x/icons/svg?seed=gaming&backgroundColor=6c5ce7&icon=gamepad-2',
    
    // Support & Recovery
    'https://api.dicebear.com/7.x/icons/svg?seed=recovery&backgroundColor=00b894&icon=leaf',
    'https://api.dicebear.com/7.x/icons/svg?seed=support&backgroundColor=fd79a8&icon=shield',
    'https://api.dicebear.com/7.x/icons/svg?seed=therapy&backgroundColor=74b9ff&icon=heart-pulse',
    'https://api.dicebear.com/7.x/icons/svg?seed=growth&backgroundColor=fdcb6e&icon=sprout',
  ];
  // Restrict access to only admins and super_admins
  const { userProfile } = useAuthStore();

  React.useEffect(() => {
    if (!user || !userProfile) {
      router.replace('/chats');
      return;
    }
    if (userProfile.role !== 'admin' && userProfile.role !== 'super_admin') {
      router.replace('/chats');
    }
  }, [user, userProfile, router]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Create the nest
      const { data: nest, error: nestError } = await supabase
        .from('nests')
        .insert({
          name: formData.name,
          description: formData.description,
          is_private: formData.isPrivate,
          avatar_url: formData.avatar_url,
          member_count: 1,
          created_by: user.id,
        })
        .select()
        .single();

      if (nestError) throw nestError;

      // Add the creator as an admin member
      const { error: memberError } = await supabase
        .from('nest_members')
        .insert({
          nest_id: nest.id,
          user_id: user.id,
          role: 'admin',
        });

      if (memberError) throw memberError;

      // Navigate to the new nest
      router.push(`/nest/${nest.id}`);
    } catch (error) {
      console.error('Error creating nest:', error);
      // You might want to show a toast notification here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <HueButton
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="w-10 h-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </HueButton>
        <div>
          <h1 className="text-2xl font-bold text-primary">Create Nest</h1>
          <p className="text-muted-foreground text-sm">
            Build a community around your interests
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <HueCard>
          <HueCardContent className="p-6 space-y-6">
            {/* Nest Avatar */}
            <div className="space-y-2">
                          <Label className="text-sm font-medium text-primary">
              Nest Icon
            </Label>
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20 border-2 border-white/30">
                  {formData.avatar_url ? (
                    <AvatarImage src={formData.avatar_url} alt="Nest avatar" />
                  ) : (
                    <AvatarFallback className="bg-hue-gradient text-white text-xl">
                      ?
                    </AvatarFallback>
                  )}
                </Avatar>
                            <HueButton
              type="button"
              variant="outline"
              onClick={() => setShowAvatarModal(true)}
              className="flex-1"
            >
              {formData.avatar_url ? 'Change Icon' : 'Select Icon'}
            </HueButton>
              </div>
                          <p className="text-xs text-muted-foreground">
              Choose an icon to represent your nest
            </p>
            </div>

            {/* Nest Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-primary">
                Nest Name *
              </Label>
              <Input
                id="name"
                placeholder="e.g., Study Buddies, Mental Health Support"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="hue-input"
                required
                maxLength={50}
              />
              <p className="text-xs text-muted-foreground">
                Choose a name that reflects your community's purpose
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-primary">
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe what your nest is about and who it's for..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="hue-input min-h-[100px] resize-none"
                required
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground">
                {formData.description.length}/200 characters
              </p>
            </div>

            {/* Privacy Settings */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-primary">
                Privacy Settings
              </Label>
              <div className="space-y-2">
                <HueButton
                  type="button"
                  variant={formData.isPrivate ? "default" : "outline"}
                  className="w-full justify-start h-auto p-4"
                  onClick={() => setFormData({ ...formData, isPrivate: true })}
                >
                  <Lock className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Private Nest</div>
                    <div className="text-sm opacity-80">Only invited members can join</div>
                  </div>
                </HueButton>
                
                <HueButton
                  type="button"
                  variant={!formData.isPrivate ? "default" : "outline"}
                  className="w-full justify-start h-auto p-4"
                  onClick={() => setFormData({ ...formData, isPrivate: false })}
                >
                  <Globe className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Public Nest</div>
                    <div className="text-sm opacity-80">Anyone can discover and join</div>
                  </div>
                </HueButton>
              </div>
            </div>
          </HueCardContent>
        </HueCard>

        {/* Submit Button */}
        <HueButton
          type="submit"
          className="w-full h-12"
          disabled={loading || !formData.name || !formData.description}
        >
          {loading ? (
            <>
              <Sparkles className="w-5 h-5 mr-2 animate-spin" />
              Creating Nest...
            </>
          ) : (
            <>
              <Users className="w-5 h-5 mr-2" />
              Create Nest
            </>
          )}
        </HueButton>
      </form>

      {/* Avatar Selection Modal */}
      <Dialog open={showAvatarModal} onOpenChange={setShowAvatarModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Nest Icon</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto">
            {nestAvatarOptions.map((avatar, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setFormData({ ...formData, avatar_url: avatar });
                  setShowAvatarModal(false);
                }}
                className={`w-16 h-16 rounded-full border-2 transition-all hover:scale-110 ${
                  formData.avatar_url === avatar
                    ? 'border-primary scale-110'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                <img
                  src={avatar}
                  alt={`Nest Avatar ${index + 1}`}
                  className="w-full h-full rounded-full object-cover"
                />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 