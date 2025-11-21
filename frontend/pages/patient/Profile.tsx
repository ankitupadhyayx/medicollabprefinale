
import React, { useState } from 'react';
import { MOCK_PATIENT_PROFILE } from '../../constants';
import { Button } from '../../components/ui/Button';
import { User, Mail, Phone, Calendar, MapPin, Save, Camera, Shield, FileText, Building } from 'lucide-react';

export const PatientProfile: React.FC = () => {
  const [profile, setProfile] = useState(MOCK_PATIENT_PROFILE);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // API call to save
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left Column: Identity Card */}
         <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary-600 to-tech-600"></div>
               
               <div className="relative z-10 mt-8 mb-4">
                  <div className="w-24 h-24 mx-auto rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100">
                     <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <button className="absolute bottom-0 right-1/2 translate-x-8 translate-y-0 bg-gray-900 text-white p-1.5 rounded-full border-2 border-white hover:bg-gray-700 transition-colors">
                     <Camera size={14} />
                  </button>
               </div>
               
               <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
               <p className="text-sm text-gray-500 mb-6">Patient ID: {profile.id}</p>

               <div className="flex justify-center gap-4 border-t border-gray-100 pt-6">
                  <div className="text-center">
                     <div className="text-lg font-bold text-primary-600">{profile.stats.totalRecords}</div>
                     <div className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">Uploads</div>
                  </div>
                  <div className="w-px bg-gray-200"></div>
                  <div className="text-center">
                     <div className="text-lg font-bold text-green-600">{profile.stats.approvedRecords}</div>
                     <div className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">Verified</div>
                  </div>
                  <div className="w-px bg-gray-200"></div>
                  <div className="text-center">
                     <div className="text-lg font-bold text-purple-600">{profile.stats.hospitalsVisited}</div>
                     <div className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">Hospitals</div>
                  </div>
               </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
               <h3 className="font-bold text-red-800 text-sm mb-4 uppercase tracking-wide flex items-center">
                  <Shield size={16} className="mr-2" /> Emergency Contact
               </h3>
               <div className="space-y-2">
                  <div className="bg-white/60 p-3 rounded-lg">
                     <p className="text-xs text-gray-500 uppercase">Name</p>
                     <p className="font-bold text-gray-900">{profile.emergencyContact.name}</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg">
                     <p className="text-xs text-gray-500 uppercase">Phone</p>
                     <p className="font-bold text-gray-900">{profile.emergencyContact.phone}</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Right Column: Details Form */}
         <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-gray-900 text-lg">Personal Information</h3>
                  {!isEditing && (
                     <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        Edit Details
                     </Button>
                  )}
               </div>
               
               <form onSubmit={handleSave} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                           <User size={14} className="mr-2 text-gray-400" /> Full Name
                        </label>
                        <input 
                           type="text" 
                           disabled={!isEditing}
                           value={profile.name}
                           onChange={(e) => setProfile({...profile, name: e.target.value})}
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                           <Mail size={14} className="mr-2 text-gray-400" /> Email
                        </label>
                        <input 
                           type="email" 
                           disabled={!isEditing}
                           value={profile.email}
                           onChange={(e) => setProfile({...profile, email: e.target.value})}
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                           <Phone size={14} className="mr-2 text-gray-400" /> Phone
                        </label>
                        <input 
                           type="tel" 
                           disabled={!isEditing}
                           value={profile.phone}
                           onChange={(e) => setProfile({...profile, phone: e.target.value})}
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                           <Calendar size={14} className="mr-2 text-gray-400" /> Date of Birth
                        </label>
                        <input 
                           type="date" 
                           disabled={!isEditing}
                           value={profile.dob}
                           onChange={(e) => setProfile({...profile, dob: e.target.value})}
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select 
                           disabled={!isEditing}
                           value={profile.gender}
                           onChange={(e) => setProfile({...profile, gender: e.target.value})}
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                        >
                           <option>Male</option>
                           <option>Female</option>
                           <option>Other</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                        <select 
                           disabled={!isEditing}
                           value={profile.bloodGroup}
                           onChange={(e) => setProfile({...profile, bloodGroup: e.target.value})}
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                        >
                           <option>A+</option>
                           <option>A-</option>
                           <option>B+</option>
                           <option>B-</option>
                           <option>O+</option>
                           <option>O-</option>
                           <option>AB+</option>
                           <option>AB-</option>
                        </select>
                     </div>
                     <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                           <MapPin size={14} className="mr-2 text-gray-400" /> Address
                        </label>
                        <input 
                           type="text" 
                           disabled={!isEditing}
                           value={profile.address}
                           onChange={(e) => setProfile({...profile, address: e.target.value})}
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                        />
                     </div>
                  </div>

                  {isEditing && (
                     <div className="flex justify-end pt-4 gap-3">
                        <Button variant="ghost" onClick={() => setIsEditing(false)} type="button">Cancel</Button>
                        <Button variant="primary" type="submit">
                           <Save size={16} className="mr-2" /> Save Changes
                        </Button>
                     </div>
                  )}
               </form>
            </div>
         </div>
      </div>
    </div>
  );
};
