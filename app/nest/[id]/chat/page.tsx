"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Send, Reply, ThumbsUp, ThumbsDown, EyeOff, Eye, MoreVertical } from 'lucide-react';
import { HueButton } from '@/components/ui/hue-button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/lib/store';
import { Database, supabase } from '@/lib/supabase';
import { generateAnonymousName } from '@/lib/utils/anonymous-names';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  content: string;
  user_id: string;
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
  };
  reply_to?: Message;
}

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
          user:users(name, username, aura_level),
          reply_to:messages(id, content, user_id, is_anonymous, anonymous_name, user:users(name, username))
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
      const { data, error } = await supabase
        .from('nests')
        .select('*')
        .eq('id', nestId)
        .single();
      if (error) {
        console.error('Error fetching nest details:', error);
        setNestDetails(null);
      } else {
        setNestDetails(data);
      }
    };



  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

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

      if (existingReaction) {
        // Remove existing reaction
        await supabase
          .from('message_reactions')
          .delete()
          .eq('id', existingReaction.id);
      } else {
        // Add new reaction
        await supabase
          .from('message_reactions')
          .insert({
            message_id: messageId,
            user_id: user.id,
            reaction_type: type,
          });
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

  const getDisplayName = (message: Message) => {
    if (message.is_anonymous) {
      return message.anonymous_name || 'Anonymous Student';
    }
    return message.user?.name || 'Unknown User';
  };

  const getAuraColor = (level: number) => {
    if (level >= 5) return 'text-purple-600';
    if (level >= 3) return 'text-blue-600';
    return 'text-accent-blue';
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
    <div className="max-w-md mx-auto flex flex-col w-full h-full bg-gradient-to-b from-white to-accent-blue/5">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="flex items-center space-x-3">
          <HueButton variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </HueButton>
          <div>
            <h1 className="font-semibold text-primary">{nestDetails?.name} Chat</h1>
            <p className="text-xs text-muted-foreground">{messages.length} messages</p>
          </div>
        </div>
        
        <HueButton
          variant={isAnonymous ? "default" : "ghost"}
          size="sm"
          onClick={() => setIsAnonymous(!isAnonymous)}
        >
          {isAnonymous ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </HueButton>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message,index) => (
          <div key={message.id} className="space-y-2">
            {/* Reply Reference */}
            {message.reply_to && (
              <div className="ml-4 p-2 bg-accent-blue/10 rounded-lg border-l-2 border-accent-blue">
                <p className="text-xs text-muted-foreground">
                  Replying to {getDisplayName(message.reply_to)}
                </p>
                <p className="text-sm truncate">{message.reply_to.content}</p>
              </div>
            )}
            
            {/* Message */}
            <div className={`flex ${message.user_id === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${
                message.user_id === user?.id 
                  ? 'bg-primary text-white' 
                  : 'bg-white border border-white/30'
              } rounded-2xl p-3 space-y-2`}>
                {/* Sender Info */}
                {message.user_id !== user?.id && (index === 0 || messages[index - 1].user_id !== message.user_id) && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm text-primary">
                      {getDisplayName(message)}
                    </span>
                    {!message.is_anonymous && message.user && (
                      <span className={`text-xs font-bold ${getAuraColor(message.user.aura_level)}`}>
                        L{message.user.aura_level}
                      </span>
                    )}
                  </div>
                )}
                
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
                    
                    {/* Reactions (visible to all for now, in real app would be moderator-only) */}
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Bar */}
      {replyingTo && (
        <div className="px-4 py-2 bg-accent-blue/10 border-t border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Replying to {getDisplayName(replyingTo)}</p>
              <p className="text-sm truncate">{replyingTo.content}</p>
            </div>
            <HueButton variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
              ×
            </HueButton>
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 bg-white/80 backdrop-blur-sm border-t border-white/20">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isAnonymous ? "Send anonymously..." : "Type a message..."}
              className="hue-input pr-12"
            />
          </div>
          <HueButton type="submit" size="icon" disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </HueButton>
        </div>
        
        {isAnonymous && (
          <p className="text-xs text-accent-blue mt-2">
            🎭 Anonymous mode: Your message will appear from a random username
          </p>
        )}
      </form>
    </div>
  );
}