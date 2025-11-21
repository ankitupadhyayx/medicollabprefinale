
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Bell, Lock, Moon, Globe, Shield, Save, User } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500">Manage your preferences and security.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          
          {/* Section 1: Profile Summary */}
          <div className="p-6 md:col-span-1 space-y-4">
             <div className="flex items-center space-x-4">
                <img src={user?.avatar} alt="Profile" className="w-16 h-16 rounded-full border-2 border-gray-100" />
                <div>
                   <h3 className="font-bold text-gray-900">{user?.name}</h3>
                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 capitalize">
                      {user?.role.toLowerCase()}
                   </span>
                </div>
             </div>
             <div className="pt-4">
                <Button variant="outline" fullWidth size="sm">Change Avatar</Button>
             </div>
          </div>

          {/* Section 2: Preferences */}
          <div className="p-6 md:col-span-2 space-y-8">
             
             {/* Notifications */}
             <div>
                <h3 className="font-bold text-gray-900 flex items-center mb-4">
                   <Bell size={18} className="mr-2 text-gray-400" /> Notifications
                </h3>
                <div className="space-y-3">
                   <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">Email Alerts</label>
                      <button 
                        onClick={() => setEmailNotifs(!emailNotifs)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${emailNotifs ? 'bg-primary-600' : 'bg-gray-200'}`}
                      >
                         <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${emailNotifs ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                   </div>
                   <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">Push Notifications</label>
                      <button 
                        onClick={() => setPushNotifs(!pushNotifs)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${pushNotifs ? 'bg-primary-600' : 'bg-gray-200'}`}
                      >
                         <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${pushNotifs ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                   </div>
                </div>
             </div>

             {/* Security */}
             <div>
                <h3 className="font-bold text-gray-900 flex items-center mb-4">
                   <Shield size={18} className="mr-2 text-gray-400" /> Security
                </h3>
                <div className="space-y-3">
                   <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center">
                         <Lock size={16} className="text-gray-400 mr-3" />
                         <div>
                            <p className="text-sm font-medium text-gray-900">Password</p>
                            <p className="text-xs text-gray-500">Last changed 3 months ago</p>
                         </div>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs">Update</Button>
                   </div>
                   <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center">
                         <Globe size={16} className="text-gray-400 mr-3" />
                         <div>
                            <p className="text-sm font-medium text-gray-900">Active Sessions</p>
                            <p className="text-xs text-gray-500">2 devices connected</p>
                         </div>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs">Manage</Button>
                   </div>
                </div>
             </div>

             {/* Appearance */}
             <div>
                <h3 className="font-bold text-gray-900 flex items-center mb-4">
                   <Moon size={18} className="mr-2 text-gray-400" /> Appearance
                </h3>
                <div className="flex gap-3">
                   <button className="flex-1 py-2 border-2 border-primary-600 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium">Light</button>
                   <button className="flex-1 py-2 border border-gray-200 bg-white text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">Dark (Coming Soon)</button>
                </div>
             </div>

             <div className="pt-4 border-t border-gray-100 flex justify-end">
                <Button onClick={handleSave} isLoading={isSaving}>
                   <Save size={18} className="mr-2" /> Save Changes
                </Button>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
};
