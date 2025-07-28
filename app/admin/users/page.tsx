"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Edit, Save, X, Users, Shield, Crown, User } from 'lucide-react';
import { HueButton } from '@/components/ui/hue-button';
import { HueCard, HueCardContent } from '@/components/ui/hue-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

type User = Database['public']['Tables']['users']['Row'];

export default function UserManagementPage() {
  const router = useRouter();
  const { user, userProfile } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  useEffect(() => {
    const checkAuth = async () => {
      if (!user || !userProfile) {
        router.push('/auth');
        return;
      }

      // Check if user is admin or super_admin
      if (userProfile.role !== 'admin' && userProfile.role !== 'super_admin') {
        router.push('/chats');
        return;
      }

      fetchUsers();
    };

    checkAuth();
  }, [user, userProfile, router]);

  const fetchUsers = async () => {
    try {
      const { data: usersData, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(usersData || []);
      setFilteredUsers(usersData || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleEdit = (user: User) => {
    setEditingUser(user.id);
    setEditForm({
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      bio: user.bio,
      university: user.university,
    });
  };

  const handleSave = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update(editForm)
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, ...editForm } : user
      ));
      setEditingUser(null);
      setEditForm({});
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setEditForm({});
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'moderator':
        return <Users className="w-4 h-4 text-green-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-yellow-100 text-yellow-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'moderator':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-primary">User Management</h1>
        <p className="text-muted-foreground text-sm">
          Manage user accounts and permissions
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users by name, email, or username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 hue-input"
        />
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.map((user) => (
          <HueCard key={user.id} className="p-4">
            <HueCardContent className="pt-0">
              {editingUser === user.id ? (
                // Edit Form
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-primary">Edit User</h3>
                    <div className="flex space-x-2">
                      <HueButton
                        size="sm"
                        variant="outline"
                        onClick={() => handleSave(user.id)}
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </HueButton>
                      <HueButton
                        size="sm"
                        variant="ghost"
                        onClick={handleCancel}
                      >
                        <X className="w-4 h-4" />
                      </HueButton>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-primary">Name</label>
                      <Input
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="hue-input mt-1"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-primary">Email</label>
                      <Input
                        value={editForm.email || ''}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="hue-input mt-1"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-primary">Username</label>
                      <Input
                        value={editForm.username || ''}
                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                        className="hue-input mt-1"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-primary">Role</label>
                      <Select
                        value={editForm.role || 'user'}
                        onValueChange={(value) => setEditForm({ ...editForm, role: value as any })}
                      >
                        <SelectTrigger className="hue-input mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ) : (
                // User Display
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      {user.avatar_url ? (
                        <AvatarImage src={user.avatar_url} alt="User avatar" />
                      ) : (
                        <AvatarFallback className="bg-hue-gradient text-white text-sm">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-primary truncate">
                          {user.name}
                        </h3>
                        {getRoleIcon(user.role)}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {user.email}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Aura Level {user.aura_level}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <HueButton
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(user)}
                  >
                    <Edit className="w-4 h-4" />
                  </HueButton>
                </div>
              )}
            </HueCardContent>
          </HueCard>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-primary mb-2">No users found</h3>
          <p className="text-muted-foreground text-sm">
            {searchQuery ? 'Try a different search term' : 'No users in the system'}
          </p>
        </div>
      )}
    </div>
  );
} 