"use client";

import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HueButton } from '@/components/ui/hue-button';

interface NestIconSelectorProps {
  selectedIcon: string;
  onIconSelect: (iconUrl: string) => void;
  showModal: boolean;
  onModalChange: (show: boolean) => void;
  title?: string;
}

// Working nest icon options - mix of icons and avatars
const nestIconOptions = [
  // Mental Health & Wellness Icons
  'https://api.dicebear.com/7.x/icons/svg?seed=anxiety&backgroundColor=ffe2f1&icon=heart',
  'https://api.dicebear.com/7.x/icons/svg?seed=depression&backgroundColor=a5c8e4&icon=cloud',
  'https://api.dicebear.com/7.x/icons/svg?seed=stress&backgroundColor=f9f0c1&icon=zap',
  'https://api.dicebear.com/7.x/icons/svg?seed=burnout&backgroundColor=ff6b6b&icon=flame',
  'https://api.dicebear.com/7.x/icons/svg?seed=overthinking&backgroundColor=4ecdc4&icon=brain',
  'https://api.dicebear.com/7.x/icons/svg?seed=loneliness&backgroundColor=45b7d1&icon=users',
  
  // Academic & Study Icons
  'https://api.dicebear.com/7.x/icons/svg?seed=study&backgroundColor=96ceb4&icon=book',
  'https://api.dicebear.com/7.x/icons/svg?seed=exam&backgroundColor=ffeaa7&icon=target',
  'https://api.dicebear.com/7.x/icons/svg?seed=deadline&backgroundColor=dda0dd&icon=clock',
  'https://api.dicebear.com/7.x/icons/svg?seed=procrastination&backgroundColor=fdcb6e&icon=hourglass',
  
  // Financial & Money Icons
  'https://api.dicebear.com/7.x/icons/svg?seed=money&backgroundColor=00b894&icon=dollar-sign',
  'https://api.dicebear.com/7.x/icons/svg?seed=budget&backgroundColor=74b9ff&icon=calculator',
  'https://api.dicebear.com/7.x/icons/svg?seed=debt&backgroundColor=e17055&icon=credit-card',
  'https://api.dicebear.com/7.x/icons/svg?seed=investing&backgroundColor=6c5ce7&icon=trending-up',
  
  // Relationships & Social Icons
  'https://api.dicebear.com/7.x/icons/svg?seed=heartbreak&backgroundColor=fd79a8&icon=heart-off',
  'https://api.dicebear.com/7.x/icons/svg?seed=friendship&backgroundColor=a29bfe&icon=users',
  'https://api.dicebear.com/7.x/icons/svg?seed=family&backgroundColor=fd79a8&icon=home',
  'https://api.dicebear.com/7.x/icons/svg?seed=dating&backgroundColor=00cec9&icon=heart',
  
  // Career & Work Icons
  'https://api.dicebear.com/7.x/icons/svg?seed=career&backgroundColor=636e72&icon=briefcase',
  'https://api.dicebear.com/7.x/icons/svg?seed=interview&backgroundColor=2d3436&icon=user-check',
  'https://api.dicebear.com/7.x/icons/svg?seed=workplace&backgroundColor=0984e3&icon=building',
  'https://api.dicebear.com/7.x/icons/svg?seed=entrepreneur&backgroundColor=fdcb6e&icon=zap',
  
  // Physical Health Icons
  'https://api.dicebear.com/7.x/icons/svg?seed=fitness&backgroundColor=00b894&icon=activity',
  'https://api.dicebear.com/7.x/icons/svg?seed=nutrition&backgroundColor=fdcb6e&icon=apple',
  'https://api.dicebear.com/7.x/icons/svg?seed=sleep&backgroundColor=6c5ce7&icon=moon',
  'https://api.dicebear.com/7.x/icons/svg?seed=meditation&backgroundColor=00cec9&icon=feather',
  
  // Creative & Hobbies Icons
  'https://api.dicebear.com/7.x/icons/svg?seed=art&backgroundColor=e84393&icon=palette',
  'https://api.dicebear.com/7.x/icons/svg?seed=music&backgroundColor=a29bfe&icon=music',
  'https://api.dicebear.com/7.x/icons/svg?seed=writing&backgroundColor=74b9ff&icon=pen-tool',
  'https://api.dicebear.com/7.x/icons/svg?seed=gaming&backgroundColor=6c5ce7&icon=gamepad-2',
  
  // Support & Recovery Icons
  'https://api.dicebear.com/7.x/icons/svg?seed=recovery&backgroundColor=00b894&icon=leaf',
  'https://api.dicebear.com/7.x/icons/svg?seed=support&backgroundColor=fd79a8&icon=shield',
  'https://api.dicebear.com/7.x/icons/svg?seed=therapy&backgroundColor=74b9ff&icon=heart-pulse',
  'https://api.dicebear.com/7.x/icons/svg?seed=growth&backgroundColor=fdcb6e&icon=sprout',
  
  // Additional Mental Health Avatars
  'https://api.dicebear.com/7.x/avataaars/svg?seed=anxiety&backgroundColor=ffe2f1&mouth=smile&style=circle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=depression&backgroundColor=a5c8e4&mouth=smile&style=circle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=stress&backgroundColor=f9f0c1&mouth=smile&style=circle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=burnout&backgroundColor=ff6b6b&mouth=smile&style=circle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=overthinking&backgroundColor=4ecdc4&mouth=smile&style=circle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=loneliness&backgroundColor=45b7d1&mouth=smile&style=circle',
  
  // Study & Academic Avatars
  'https://api.dicebear.com/7.x/avataaars/svg?seed=study&backgroundColor=96ceb4&mouth=smile&style=circle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=exam&backgroundColor=ffeaa7&mouth=smile&style=circle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=deadline&backgroundColor=dda0dd&mouth=smile&style=circle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=procrastination&backgroundColor=fdcb6e&mouth=smile&style=circle',
  
  // Money & Finance Avatars
  'https://api.dicebear.com/7.x/avataaars/svg?seed=money&backgroundColor=00b894&mouth=smile&style=circle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=budget&backgroundColor=74b9ff&mouth=smile&style=circle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=debt&backgroundColor=e17055&mouth=smile&style=circle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=investing&backgroundColor=6c5ce7&mouth=smile&style=circle',
  
  // Relationship Avatars
  'https://api.dicebear.com/7.x/avataaars/svg?seed=heartbreak&backgroundColor=fd79a8&mouth=smile&style=circle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=friendship&backgroundColor=a29bfe&mouth=smile&style=circle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=family&backgroundColor=fd79a8&mouth=smile&style=circle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=dating&backgroundColor=00cec9&mouth=smile&style=circle',
  
  // Career Avatars
  'https://api.dicebear.com/7.x/avataaars/svg?seed=career&backgroundColor=636e72&mouth=smile&style=circle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=interview&backgroundColor=2d3436&mouth=smile&style=circle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=workplace&backgroundColor=0984e3&mouth=smile&style=circle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=entrepreneur&backgroundColor=fdcb6e&mouth=smile&style=circle',
  
  // Health & Wellness Avatars
  'https://api.dicebear.com/7.x/avataaars/svg?seed=fitness&backgroundColor=00b894&mouth=smile&style=circle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=nutrition&backgroundColor=fdcb6e&mouth=smile&style=circle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=sleep&backgroundColor=6c5ce7&mouth=smile&style=circle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=meditation&backgroundColor=00cec9&mouth=smile&style=circle',
  
  // Creative Avatars
  'https://api.dicebear.com/7.x/avataaars/svg?seed=art&backgroundColor=e84393&mouth=smile&style=circle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=music&backgroundColor=a29bfe&mouth=smile&style=circle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=writing&backgroundColor=74b9ff&mouth=smile&style=circle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=gaming&backgroundColor=6c5ce7&mouth=smile&style=circle',
  
  // Support Avatars
  'https://api.dicebear.com/7.x/avataaars/svg?seed=recovery&backgroundColor=00b894&mouth=smile&style=circle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=support&backgroundColor=fd79a8&mouth=smile&style=circle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=therapy&backgroundColor=74b9ff&mouth=smile&style=circle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=growth&backgroundColor=fdcb6e&mouth=smile&style=circle',
];

export function NestIconSelector({ 
  selectedIcon, 
  onIconSelect, 
  showModal, 
  onModalChange,
  title = "Choose Nest Icon"
}: NestIconSelectorProps) {
  return (
    <>
      {/* Icon Display */}
      <div className="flex items-center space-x-4">
        <Avatar className="w-20 h-20 border-2 border-white/30">
          {selectedIcon ? (
            <AvatarImage src={selectedIcon} alt="Nest icon" />
          ) : (
            <AvatarFallback className="bg-hue-gradient text-white text-xl">
              ?
            </AvatarFallback>
          )}
        </Avatar>
        <HueButton
          type="button"
          variant="outline"
          onClick={() => onModalChange(true)}
          className="flex-1"
        >
          {selectedIcon ? 'Change Icon' : 'Select Icon'}
        </HueButton>
      </div>
      
      {/* Icon Selection Modal */}
      <Dialog open={showModal} onOpenChange={onModalChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="font-heading">{title}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-6 gap-3 max-h-[60vh] overflow-y-auto p-4">
            {nestIconOptions.map((icon, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  onIconSelect(icon);
                  onModalChange(false);
                }}
                className={`w-16 h-16 rounded-full border-2 transition-all hover:scale-110 ${
                  selectedIcon === icon
                    ? 'border-primary scale-110 shadow-lg'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                <img
                  src={icon}
                  alt={`Nest Icon ${index + 1}`}
                  className="w-full h-full rounded-full object-cover"
                />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 