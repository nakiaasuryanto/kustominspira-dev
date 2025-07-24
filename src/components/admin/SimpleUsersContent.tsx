// @ts-nocheck
'use client';
import { useState } from 'react';
import { User } from '@/lib/supabase';

interface ContentProps<T> {
  onAdd: (item: Omit<T, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdate: (id: string, item: Partial<T>) => void;
  onDelete: (id: string) => void;
}

interface UsersContentProps extends ContentProps<User> {
  users: User[];
}

function SimpleUsersContent({ users, onAdd, onUpdate, onDelete }: UsersContentProps) {
  // Add built-in admin user
  const builtInAdmin = {
    id: 'admin-builtin',
    username: 'minspira',
    first_name: 'Kustominspira',
    last_name: 'Admin',
    full_name: 'Minspira',
    role: 'admin' as const,
    is_active: true,
    created_at: '2025-01-01'
  };
  
  const allUsers = [builtInAdmin, ...users];
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'writer' as 'admin' | 'writer',
    is_active: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        } else {
          updateData.password_hash = formData.password;
          delete updateData.password;
        }
        onUpdate(editingUser.id!, updateData);
        setEditingUser(null);
      } else {
        const userData = {
          username: formData.username,
          password_hash: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name,
          role: formData.role,
          is_active: formData.is_active
        };
        onAdd(userData);
      }
      setFormData({ username: '', password: '', first_name: '', last_name: '', role: 'writer', is_active: true });
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting user:', error);
      alert('Error saving user. Please try again.');
    }
  };

  const handleEdit = (user: User) => {
    setFormData({
      username: user.username,
      password: '',
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      is_active: user.is_active ?? true
    });
    setEditingUser(user);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingUser(null);
            setFormData({ username: '', password: '', first_name: '', last_name: '', role: 'writer', is_active: true });
          }}
          className="bg-[#1ca4bc] text-white px-6 py-2 rounded-lg hover:bg-[#159bb3] transition-colors"
        >
          {showForm ? 'Cancel' : 'Add New User'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingUser ? 'Edit User' : 'Create New User'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                  placeholder="username"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {editingUser ? 'New Password (leave empty to keep current)' : 'Password'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                  placeholder="password"
                  required={!editingUser}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'writer' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                >
                  <option value="writer">Writer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select 
                  value={formData.is_active ? 'active' : 'inactive'}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'active' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-[#1ca4bc] text-white px-6 py-2 rounded-lg hover:bg-[#159bb3] transition-colors"
              >
                {editingUser ? 'Update User' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">All Users ({allUsers.length})</h3>
          <div className="space-y-4">
            {allUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4 ${
                    user.role === 'admin' ? 'bg-red-500' : 'bg-blue-500'
                  }`}>
                    {user.first_name?.[0] || 'U'}{user.last_name?.[0] || 'U'}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{user.full_name || `${user.first_name} ${user.last_name}`}</h4>
                    <p className="text-sm text-gray-600">@{user.username} • {user.role} • {user.is_active ? 'Active' : 'Inactive'}</p>
                    <p className="text-sm text-gray-500 mt-1">Created: {user.created_at?.substring(0, 10) || 'Unknown'}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {user.id !== 'admin-builtin' && (
                    <>
                      <button 
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => user.id && onDelete(user.id)}
                        className="text-red-600 hover:text-red-800 px-3 py-1 rounded-md hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </>
                  )}
                  {user.id === 'admin-builtin' && (
                    <span className="text-gray-400 text-sm px-3 py-1">Built-in Admin</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimpleUsersContent;