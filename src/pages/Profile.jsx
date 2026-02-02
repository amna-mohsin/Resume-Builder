import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, Edit2, Save, X, CheckCircle, AlertCircle, Phone } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: 'User', email: '', phone: '', createdAt: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  useEffect(() => {
    const getProfile = async () => {
      // Check localStorage authentication first (your main login system)
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const userSession = localStorage.getItem('userSession');
      
      if (isAuthenticated && userSession) {
        try {
          const user = JSON.parse(userSession);
          setUserData({
            name: user.name || 'User',
            email: user.email || '',
            phone: user.phone || '', // Adjust based on what you store in localStorage
            createdAt: user.createdAt || new Date().toLocaleDateString() // Fallback date
          });
          setEditedName(user.name || 'User');
          setEditedPhone(user.phone || '');
          return;
        } catch (err) {
          console.error('Error parsing user session:', err);
        }
      }
      
      // Fallback: Check Supabase auth (for backward compatibility)
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserData({
            name: user.user_metadata?.full_name || 'User',
            email: user.email || '',
            phone: user.user_metadata?.phone || '',
            createdAt: user.created_at ? new Date(user.created_at).toLocaleDateString() : new Date().toLocaleDateString()
          });
          setEditedName(user.user_metadata?.full_name || 'User');
          setEditedPhone(user.user_metadata?.phone || '');
        } else {
          // No authentication found, redirect to login
          navigate('/login');
        }
      } catch (err) {
        console.error('Error fetching user from Supabase:', err);
        navigate('/login');
      }
    };
    
    getProfile();
  }, [navigate]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // First check localStorage authentication
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const userSession = localStorage.getItem('userSession');
      
      if (isAuthenticated && userSession) {
        // Update localStorage user data
        const user = JSON.parse(userSession);
        const updatedUser = {
          ...user,
          name: editedName,
          phone: editedPhone
        };
        localStorage.setItem('userSession', JSON.stringify(updatedUser));
        
        setUserData(prev => ({ ...prev, name: editedName, phone: editedPhone }));
        setIsEditing(false);
        showToast('Profile updated successfully!', 'success');
        return;
      }
      
      // Fallback: Update Supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase.auth.updateUser({
          data: { 
            full_name: editedName,
            phone: editedPhone
          }
        });
        
        if (error) throw error;
        
        setUserData(prev => ({ ...prev, name: editedName, phone: editedPhone }));
        setIsEditing(false);
        showToast('Profile updated successfully!', 'success');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      showToast('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const sidebarGradient = 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 100%)';
  const accentGradient = 'linear-gradient(135deg, #7AA1D2, #CC95C0, #DBD4B4)';

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8FAFC] font-sans overflow-x-hidden">
      {/* SIDEBAR */}
      <div className="w-full md:w-64 fixed md:relative inset-y-0 left-0 text-white flex flex-col shadow-2xl z-20" style={{ background: sidebarGradient }}>
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg" style={{ background: accentGradient }}>
            <User size={18} className="text-white" />
          </div>
          <span className="font-black tracking-tighter text-xl uppercase italic">ResumeAI+</span>
        </div>
        <div className="p-4 mt-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-white/60 hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-64 p-4 md:p-8 mt-16 md:mt-0">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-[1000] text-slate-900 mb-6 md:mb-8">Profile</h1>

          <div className="bg-white rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm p-4 md:p-8 mt-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full md:w-auto">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl md:text-4xl font-black shadow-xl">
                  {userData.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <div className="space-y-3 w-full">
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="w-full text-xl md:text-3xl font-black text-slate-900 bg-slate-50 border-2 border-blue-500 rounded-xl px-4 py-2 outline-none focus:bg-white"
                        autoFocus
                        placeholder="Full Name"
                      />
                      <input
                        type="tel"
                        value={editedPhone}
                        onChange={(e) => setEditedPhone(e.target.value)}
                        className="w-full text-base md:text-lg font-bold text-slate-700 bg-slate-50 border-2 border-blue-500 rounded-xl px-4 py-2 outline-none focus:bg-white"
                        placeholder="Phone Number"
                      />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl md:text-3xl font-black text-slate-900 break-words">{userData.name}</h2>
                      <p className="text-sm md:text-base text-slate-500 font-bold mt-2 flex items-start gap-2">
                        <Mail size={14} className="flex-shrink-0 mt-0.5 md:w-4 md:h-4" />
                        <span className="break-all">{userData.email}</span>
                      </p>
                      {userData.phone && (
                        <p className="text-sm md:text-base text-slate-500 font-bold mt-2 flex items-start gap-2">
                          <Phone size={14} className="flex-shrink-0 mt-0.5 md:w-4 md:h-4" />
                          <span className="break-all">{userData.phone}</span>
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-2 md:gap-3 w-full md:w-auto">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      <Save size={18} />
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedName(userData.name);
                        setEditedPhone(userData.phone);
                      }}
                      className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-black hover:bg-slate-200 transition-all flex items-center gap-2"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-all flex items-center gap-2"
                  >
                    <Edit2 size={18} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
              <div className="p-4 md:p-6 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <Mail className="text-blue-600 flex-shrink-0" size={18} />
                  <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400">Email</h3>
                </div>
                <p className="text-sm md:text-lg font-bold text-slate-900 break-words overflow-wrap-anywhere">{userData.email}</p>
              </div>

              <div className="p-4 md:p-6 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <Phone className="text-green-600 flex-shrink-0" size={18} />
                  <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400">Phone</h3>
                </div>
                <p className="text-sm md:text-lg font-bold text-slate-900 break-words">{userData.phone || 'Not provided'}</p>
              </div>

              <div className="p-4 md:p-6 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <Calendar className="text-purple-600 flex-shrink-0" size={18} />
                  <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400">Member Since</h3>
                </div>
                <p className="text-sm md:text-lg font-bold text-slate-900">{userData.createdAt || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      <div className={`fixed bottom-8 right-8 z-[2000] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border transition-all duration-500 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'} ${toast.type === 'success' ? 'bg-white border-green-100 text-green-600' : 'bg-white border-red-100 text-red-600'}`}>
        {toast.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
        <span className="font-black text-sm uppercase tracking-tight">{toast.message}</span>
      </div>
    </div>
  );
};

export default Profile;