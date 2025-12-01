import React, { useState, useRef } from 'react';
import { useAuth } from '../services/authContext.jsx';
import { useToast } from '../services/toastContext.jsx';
import { Camera, Save, User, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsView = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  
  const [name, setName] = useState(user?.displayName || '');
  const [photo, setPhoto] = useState(user?.photoURL || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [birthdate, setBirthdate] = useState(user?.birthdate || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    
    if (!name.trim()) {
        showToast("Display name cannot be empty.", "error");
        setIsLoading(false);
        return;
    }

    try {
        await new Promise(resolve => setTimeout(resolve, 800));

        updateUser({ 
            displayName: name, 
            photoURL: photo,
            bio: bio,
            birthdate: birthdate
        });
        
        showToast("Profile updated successfully!", "success");
    } catch (error) {
        console.error("Profile update error:", error);
        showToast("Failed to update profile. Please try again.", "error");
    } finally {
        setIsLoading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { 
        showToast("Image size must be less than 2MB", "error");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
        showToast("Image selected successfully", "info");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Account Settings</h2>
        <p className="text-slate-500 dark:text-gray-400 text-sm">Manage your profile and preferences.</p>
      </div>

      <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-2xl p-8 shadow-sm">
         <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Profile Information</h3>
         
         <div className="space-y-6">
            <div className="flex flex-col items-center sm:flex-row sm:space-x-8">
                <div 
                    className="relative group cursor-pointer mb-4 sm:mb-0"
                    onClick={handleImageClick}
                >
                    <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden border-4 border-slate-50 dark:border-slate-800 shadow-lg relative">
                        {photo ? (
                            <img src={photo} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-gray-500">
                                <User size={40} />
                            </div>
                        )}
                    </div>
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white w-6 h-6" />
                    </div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/*"
                    />
                </div>
                
                <div className="flex-1 w-full space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase text-slate-500 dark:text-gray-500">Display Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`w-full bg-slate-50 dark:bg-black/20 border rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 ring-blue-500 outline-none transition-all ${
                                !name.trim() ? 'border-red-500' : 'border-slate-200 dark:border-white/10'
                            }`}
                        />
                        {!name.trim() && (
                            <span className="text-xs text-red-500 flex items-center mt-1">
                                <AlertCircle size={10} className="mr-1" />
                                Name is required
                            </span>
                        )}
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase text-slate-500 dark:text-gray-500">Birthdate</label>
                            <input 
                                type="date" 
                                value={birthdate}
                                onChange={(e) => setBirthdate(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 ring-blue-500 outline-none transition-all"
                            />
                        </div>
                     </div>
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-slate-500 dark:text-gray-500">Bio</label>
                <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 ring-blue-500 outline-none transition-all resize-none"
                    placeholder="Tell us about your sleep journey..."
                />
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-white/5 flex items-center justify-end">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium flex items-center shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>Saving...</>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </motion.button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SettingsView;