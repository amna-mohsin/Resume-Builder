import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings as SettingsIcon, Moon, Sun, Bell, Shield, Globe } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

const Settings = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
      }
    };
    getProfile();
  }, [navigate]);

  // Ensure light mode on mount
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    
    // Update state
    setDarkMode(newDarkMode);
    
    // Update document class IMMEDIATELY
    const htmlElement = document.documentElement;
    
    // Remove dark class first (in case it exists)
    htmlElement.classList.remove('dark');
    
    // Then add it only if dark mode is enabled
    if (newDarkMode) {
      htmlElement.classList.add('dark');
    }
    
    // Save to localStorage
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    // Dispatch custom event to notify all pages
    window.dispatchEvent(new CustomEvent('darkModeChange', { detail: { darkMode: newDarkMode } }));
  };

  const sidebarGradient = 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 100%)';
  const accentGradient = 'linear-gradient(135deg, #7AA1D2, #CC95C0, #DBD4B4)';

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8FAFC]">
      {/* SIDEBAR */}
      <div className="w-full md:w-64 fixed md:relative inset-y-0 left-0 text-white flex flex-col shadow-2xl z-20" style={{ background: sidebarGradient }}>
        <div className="p-4 sm:p-5 md:p-6 flex items-center gap-2 sm:gap-3 border-b border-white/10">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0" style={{ background: accentGradient }}>
            <SettingsIcon size={16} className="sm:w-[18px] sm:h-[18px] text-white" />
          </div>
          <span className="font-black tracking-tighter text-base sm:text-lg md:text-xl uppercase italic truncate">ResumeAI+</span>
        </div>
        <div className="p-3 sm:p-4 mt-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all text-white/60 hover:bg-white/5 hover:text-white text-sm sm:text-base"
          >
            <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
            <span className="truncate">Back to Dashboard</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-64 p-3 sm:p-4 md:p-6 lg:p-8 mt-16 md:mt-0">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-[1000] text-slate-900 mb-4 md:mb-6">Settings</h1>

          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Appearance Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm p-4 sm:p-5 md:p-6 lg:p-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
                {darkMode ? <Moon className="text-blue-600" size={20} className="sm:w-6 sm:h-6" /> : <Sun className="text-yellow-500" size={20} className="sm:w-6 sm:h-6" />}
                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900">Appearance</h2>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 md:p-6 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1">Dark Mode</h3>
                  <p className="text-xs sm:text-sm text-slate-600">Switch between light and dark theme</p>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`relative w-14 h-7 sm:w-16 sm:h-8 rounded-full transition-all duration-300 flex-shrink-0 ${
                    darkMode ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 sm:top-1 left-0.5 sm:left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                      darkMode ? 'translate-x-7 sm:translate-x-8' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm p-4 sm:p-5 md:p-6 lg:p-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
                <Bell className="text-purple-600" size={20} className="sm:w-6 sm:h-6" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900">Notifications</h2>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 md:p-6 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1">Email Notifications</h3>
                  <p className="text-xs sm:text-sm text-slate-600">Receive email updates about your resumes</p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative w-14 h-7 sm:w-16 sm:h-8 rounded-full transition-all duration-300 flex-shrink-0 ${
                    notifications ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 sm:top-1 left-0.5 sm:left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                      notifications ? 'translate-x-7 sm:translate-x-8' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Privacy Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm p-4 sm:p-5 md:p-6 lg:p-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
                <Shield className="text-green-600" size={20} className="sm:w-6 sm:h-6" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900">Privacy & Security</h2>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="p-4 sm:p-5 md:p-6 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1 sm:mb-2">Data Storage</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4 break-words">
                    Your resumes are stored locally in your browser. No data is sent to external servers except for authentication.
                  </p>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm p-4 sm:p-5 md:p-6 lg:p-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
                <Globe className="text-indigo-600" size={20} className="sm:w-6 sm:h-6" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900">About</h2>
              </div>
              
              <div className="p-4 sm:p-5 md:p-6 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100">
                <p className="text-xs sm:text-sm text-slate-600 mb-1 sm:mb-2 break-words">
                  <strong className="text-slate-900">ResumeAI+</strong> - Build professional, ATS-optimized resumes
                </p>
                <p className="text-[10px] sm:text-xs text-slate-500">Version 1.0.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

