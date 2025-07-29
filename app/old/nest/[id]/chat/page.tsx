"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Send, Reply, ThumbsUp, ThumbsDown, Users, Eye, EyeOff, MoreVertical } from 'lucide-react';
import { HueButton } from '@/components/ui/hue-button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/lib/store';
import { Database, supabase } from '@/lib/supabase';
import { generateAnonymousName, calculateAuraLevel } from '@/lib/utils/anonymous-names';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  content: string;
  user_id: string;
  nest_id: string;
  is_anonymous: boolean;
  anonymous_name: string | null;
  reply_to_id: string | null;
  upvotes: number;
  downvotes: number;
  created_at: string;
  user?: {
    name: string;
    username: string;
    aura_level: number;
    avatar_url?: string;
  };
  reply_to?: Message;
}

// MessageActions Component
const MessageActions = ({ message, onDelete }: {
  message: Message;
  onDelete: () => void;
}) => {
  const { user } = useAuthStore();
  const [showActions, setShowActions] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteMessage = async () => {
    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }

    setLoading(true);
    try {
      // Delete the message from database
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', message.id);

      if (error) throw error;

      // Log the action
      await supabase
        .from('nest_actions')
        .insert({
          nest_id: message.nest_id,
          target_user_id: message.user_id,
          action_by: user?.id || '',
          action_type: 'delete_message',
          reason: 'Message deleted by moderator',
        });

      onDelete();
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowActions(!showActions)}
        disabled={loading}
        className="text-muted-foreground hover:text-primary transition-colors"
      >
        <MoreVertical className="w-3 h-3" />
      </button>
      
      {showActions && (
        <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-32">
          <button
            onClick={handleDeleteMessage}
            disabled={loading}
            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Delete Message
          </button>
        </div>
      )}
    </div>
  );
};

export default function NestChatPage() {
  const router = useRouter();
  const params = useParams();
  const nestId = params.id as string;
  const { user, userProfile } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  // Fetch the current nest's details from Supabase
  const [nestDetails, setNestDetails] = useState<Database['public']['Tables']['nests']['Row']|null>(null);
  // State for nest members
  const [nestMembers, setNestMembers] = useState<Database['public']['Tables']['users']['Row'][]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    if (!user || !nestId) {
      console.warn('[setupSocketConnection] No user or nestId, aborting socket setup.', { user, nestId });
      return;
    }

    fetchMessages();
    fetchNestDetails();


    const socket = setupSocketConnection();
    setSocket(socket);

    // Cleanup function
    return () => {
      console.log('[setupSocketConnection] Cleanup function called.');
      if (socket) {
        console.log('[setupSocketConnection] Emitting leave_nest event before disconnect:', { nest_id: nestId });
        socket.emit('leave_nest', { nest_id: nestId });
        socket.disconnect();
        console.log('[setupSocketConnection] Socket disconnected and cleaned up.');
      }
    };
 
  }, [nestId]);


  const setupSocketConnection = () => {
    const socketUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:4000'
      : process.env.NEXT_PUBLIC_SOCKET_URL;
    console.log('[setupSocketConnection] Connecting to Socket.IO server at:', socketUrl);

    const newSocket =io(socketUrl, {
      transports: ['websocket'],
    });
    
    newSocket.on('connect', () => {
      console.log('[Socket.IO] Connected to server. Socket ID:', newSocket.id);
      // Join the nest room
      console.log('[Socket.IO] Emitting join_nest event:', { nest_id: nestId, user_id: user?.id });
      newSocket.emit('join_nest', { nest_id: nestId, user_id: user?.id });
    });

    newSocket.on('new_message', (message: Message) => {
      console.log('[Socket.IO] Received new_message event:', message);
      setMessages(prev => {
        const updated = [...prev, message];
        console.log('[Socket.IO] Updated messages state after new_message:', updated);
        return updated;
      });
    });

    newSocket.on('message_reaction_updated', ({ message_id, upvotes, downvotes }) => {
      console.log('[Socket.IO] Received message_reaction_updated event:', { message_id, upvotes, downvotes });
      setMessages(prev => {
        const updated = prev.map(msg =>
          msg.id === message_id
            ? { ...msg, upvotes, downvotes }
            : msg
        );
        console.log('[Socket.IO] Updated messages state after message_reaction_updated:', updated);
        return updated;
      });
    });

    newSocket.on('user_joined', ({ user_id, nest_id }) => {
      console.log(`[Socket.IO] user_joined event: User ${user_id} joined nest ${nest_id}`);
    });

    newSocket.on('error', ({ message }) => {
      console.error('[Socket.IO] Error event received:', message);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('[Socket.IO] Disconnected from server. Reason:', reason);
    });

    return newSocket
 };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          user:users(name, username, aura_level, avatar_url),
          reply_to:messages(id, content, user_id, is_anonymous, anonymous_name, user:users(name, username, avatar_url))
        `)
        .eq('nest_id', nestId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

    const fetchNestDetails = async () => {
      if (!nestId) return;
      // Fetch nest details and members in one query
      const { data, error } = await supabase
        .from('nests')
        .select(`
          *,
          nest_members: nest_members (
            id,
            user_id,
            role,
            joined_at,
            user: users (
              id,
              name,
              username,
              aura_level,
              avatar_url
            )
          )
        `)
        .eq('id', nestId)
        .single();

      if (error) {
        console.error('Error fetching nest details:', error);
        setNestDetails(null);
      } else {
        console.log('',data)
        setNestDetails(data);
      }
    };



  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    // Check if user is banned from this nest
    try {
      const { data: banData, error: banError } = await supabase
        .from('nest_bans')
        .select('*')
        .eq('nest_id', nestId)
        .eq('user_id', user.id)
        .single();

      if (banData) {
        alert('You are banned from this nest and cannot send messages.');
        return;
      }
    } catch (error) {
      // User is not banned, continue
    }

    console.log('SENDING'+newMessage)
    try {
      const messageData = {
        nest_id: nestId,
        user_id: user.id,
        content: newMessage,
        reply_to_id: replyingTo?.id || null,
        is_anonymous: isAnonymous,
        anonymous_name: isAnonymous ? generateAnonymousName() : null,
      };

      // Emit Socket.IO event for real-time messaging
      if (socket) {
        socket.emit('send_message', messageData);
      }

    /* 
      const { error } = await supabase
        .from('messages')
        .insert(messageData);

      if (error) throw error;
    */  
      
      // Award aura points for sending a message
      if (userProfile) {
        const newPoints = userProfile.aura_points + 5;
        await supabase
          .from('users')
          .update({ aura_points: newPoints })
          .eq('id', user.id);
      }

      setNewMessage('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleReaction = async (messageId: string, type: 'upvote' | 'downvote') => {
    if (!user) return;

    try {
      // Emit Socket.IO event for real-time reaction updates
      if (socket) {
        socket.emit('react_to_message', {
          message_id: messageId,
          user_id: user.id,
          reaction_type: type,
        });
      }

      // Check if user already reacted
      const { data: existingReaction } = await supabase
        .from('message_reactions')
        .select('*')
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .single();

      // Get the message to find the author
      const { data: messageData } = await supabase
        .from('messages')
        .select('user_id')
        .eq('id', messageId)
        .single();

      if (!messageData) return;

      const messageAuthorId = messageData.user_id;
      const isModeratorOrAdmin = userProfile?.role === 'moderator' || userProfile?.role === 'admin' || userProfile?.role === 'super_admin';
      
      // Define aura point values
      const auraValues = {
        normal: {
          upvote: 1,
          downvote: -1
        },
        moderator: {
          upvote: 5,
          downvote: -5
        }
      };

      let auraChange = 0;

      if (existingReaction) {
        // Remove existing reaction - reverse the aura change
        await supabase
          .from('message_reactions')
          .delete()
          .eq('id', existingReaction.id);

        // Reverse the aura change
        const values = isModeratorOrAdmin ? auraValues.moderator : auraValues.normal;
        auraChange = existingReaction.reaction_type === 'upvote' ? -values.upvote : -values.downvote;
      } else {
        // Add new reaction
        await supabase
          .from('message_reactions')
          .insert({
            message_id: messageId,
            user_id: user.id,
            reaction_type: type,
          });

        // Apply aura change
        const values = isModeratorOrAdmin ? auraValues.moderator : auraValues.normal;
        auraChange = type === 'upvote' ? values.upvote : values.downvote;
      }

      // Update the message author's aura points
      if (auraChange !== 0 && messageAuthorId !== user.id) {
        const { data: authorData } = await supabase
          .from('users')
          .select('aura_points')
          .eq('id', messageAuthorId)
          .single();

        if (authorData) {
          const newAuraPoints = Math.max(0, authorData.aura_points + auraChange);
          const newAuraLevel = calculateAuraLevel(newAuraPoints);

          await supabase
            .from('users')
            .update({
              aura_points: newAuraPoints,
              aura_level: newAuraLevel
            })
            .eq('id', messageAuthorId);
        }
      }

      // Update message reaction counts
      const { data: reactions } = await supabase
        .from('message_reactions')
        .select('reaction_type')
        .eq('message_id', messageId);

      const upvotes = reactions?.filter(r => r.reaction_type === 'upvote').length || 0;
      const downvotes = reactions?.filter(r => r.reaction_type === 'downvote').length || 0;

      await supabase
        .from('messages')
        .update({ upvotes, downvotes })
        .eq('id', messageId);

      fetchMessages();
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };





  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full bg-hue-gradient mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto flex flex-col w-full h-screen bg-gradient-to-b from-accent-pink/10 via-white to-accent-yellow/10">
      {/* Header - Fixed */}
      <div className="flex items-center justify-between p-4 backdrop-blur-md bg-glass-gradient border-b border-white/20 shadow-aura-glow flex-shrink-0">
        <div className="flex items-center space-x-3">
          <HueButton variant="ghost" size="icon" onClick={() => router.back()} className="backdrop-blur-md bg-white/20 hover:bg-white/30">
            <ArrowLeft className="w-5 h-5" />
          </HueButton>
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              {nestDetails?.avatar_url ? (
                <AvatarImage src={nestDetails.avatar_url} alt="Nest avatar" />
              ) : (
                <AvatarFallback className="bg-hue-gradient text-white text-xs">
                  {nestDetails?.name?.charAt(0)?.toUpperCase() || 'N'}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h1 className="font-semibold text-primary text-lg">{nestDetails?.name} Chat</h1>
              <p className="text-xs text-muted-foreground">{messages.length} messages</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <HueButton
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/nest/${nestId}`)}
            title="View Nest Profile"
            className="backdrop-blur-md bg-white/20 hover:bg-white/30"
          >
            <Users className="w-4 h-4" />
          </HueButton>
          
          <HueButton
            variant={isAnonymous ? "default" : "ghost"}
            size="sm"
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={isAnonymous ? "bg-gradient-to-r from-accent-pink to-accent-yellow shadow-aura-glow" : "backdrop-blur-md bg-white/20 hover:bg-white/30"}
          >
            {isAnonymous ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </HueButton>
        </div>
      </div>

      {/* Messages - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((message,index) => (
          <div key={message.id} className="space-y-2">
            {/* Reply Reference */}
            {message.reply_to && (
              <div className="ml-4 p-3 backdrop-blur-md bg-glass-gradient rounded-xl border-l-2 border-accent-pink">
                <p className="text-xs text-muted-foreground">
                  Replying to message
                </p>
                <p className="text-sm truncate">{message.reply_to.content}</p>
              </div>
            )}
            
            {/* Message */}
            <div className={`flex ${message.user_id === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${
                message.user_id === user?.id 
                  ? 'bg-gradient-to-r from-accent-pink to-accent-yellow text-white shadow-aura-glow' 
                  : 'backdrop-blur-md bg-glass-gradient border border-white/30 shadow-lg'
              } rounded-2xl p-3 space-y-2`}>

                
                {/* Content */}
                <p className="text-sm">{message.content}</p>
                
                {/* Actions */}
                <div className="flex items-center justify-between text-xs">
                  <span className={message.user_id === user?.id ? 'text-white/70' : 'text-muted-foreground'}>
                    {formatTime(message.created_at)}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setReplyingTo(message)}
                      className={`hover:scale-110 transition-transform ${
                        message.user_id === user?.id ? 'text-white/70' : 'text-muted-foreground'
                      }`}
                    >
                      <Reply className="w-3 h-3" />
                    </button>
                    
                    {/* Moderator Actions */}
                    {(userProfile?.role === 'moderator' || userProfile?.role === 'admin' || userProfile?.role === 'super_admin') && (
                      <MessageActions message={message} onDelete={fetchMessages} />
                    )}
                    
                    {/* Reactions  */}
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleReaction(message.id, 'upvote')}
                        className={`hover:scale-110 transition-transform ${
                          message.user_id === user?.id ? 'text-white/70' : 'text-muted-foreground'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <span className={`text-xs ${
                        message.user_id === user?.id ? 'text-white/70' : 'text-muted-foreground'
                      }`}>
                        {message.upvotes}
                      </span>
                      
                      <button
                        onClick={() => handleReaction(message.id, 'downvote')}
                        className={`hover:scale-110 transition-transform ${
                          message.user_id === user?.id ? 'text-white/70' : 'text-muted-foreground'
                        }`}
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                      <span className={`text-xs ${
                        message.user_id === user?.id ? 'text-white/70' : 'text-muted-foreground'
                      }`}>
                        {message.downvotes}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Bar - Fixed */}
      {replyingTo && (
        <div className="px-4 py-3 backdrop-blur-md bg-glass-gradient border-t border-white/20 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Replying to message</p>
              <p className="text-sm truncate">{replyingTo.content}</p>
            </div>
            <HueButton variant="ghost" size="sm" onClick={() => setReplyingTo(null)} className="backdrop-blur-md bg-white/20 hover:bg-white/30">
              ×
            </HueButton>
          </div>
        </div>
      )}

      {/* Input - Fixed */}
      <form onSubmit={sendMessage} className="p-4 backdrop-blur-md bg-glass-gradient border-t border-white/20 shadow-aura-glow flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isAnonymous ? "Send anonymously..." : "Type a message..."}
              className="backdrop-blur-md bg-white/20 border-white/30 focus:bg-white/30 transition-all duration-300"
            />
          </div>
          <HueButton 
            type="submit" 
            size="icon" 
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-accent-pink to-accent-yellow hover:shadow-aura-glow transition-all duration-300"
          >
            <Send className="w-4 h-4" />
          </HueButton>
        </div>
        
        {isAnonymous && (
          <p className="text-xs text-accent-pink mt-2 font-medium">
            🎭 Anonymous mode: Your message will appear from a random username
          </p>
        )}
      </form>
    </div>
  );
}