
import React, { useState } from 'react';
import { MOCK_HOSPITAL_PROFILE } from '../../constants';
import { Button } from '../../components/ui/Button';
import { Building2, Mail, Phone, MapPin, Globe, Camera, Save, CheckCircle, Shield } from 'lucide-react';

export const HospitalProfile: React.FC = () => {
  const [profile, setProfile] = useState(MOCK_HOSPITAL_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock API Save
    setIsEditing(false);
    setSuccessMsg('Profile details updated successfully.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Success Toast */}
      {successMsg && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center animate-fade-in-up">
          <CheckCircle size={18} className="text-green-400 mr-2" />
          {successMsg}
        </div>
      )}

      {/* Header / Banner */}
      <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden bg-gray-200 group">
        <img src={profile.banner} alt="Hospital Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30"></div>
        <button className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-lg backdrop-blur-md transition-colors">
          <Camera size={20} /> <span className="text-sm ml-1 font-medium">Change Cover</span>
        </button>
      </div>

      <div className="relative px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="relative -mt-16">
              <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white">
                <img src={profile.avatar} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <button className="absolute bottom-0 right-0 bg-primary-600 text-white p-1.5 rounded-full shadow border-2 border-white hover:bg-primary-700">
                <Camera size={14} />
              </button>
            </div>
            
            <div className="flex-1 mb-2">
               <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                 {profile.name}
                 <span className="ml-2 text-green-500" title="Verified Facility">
                   <CheckCircle size={24} fill="currentColor" className="text-white" />
                 </span>
               </h1>
               <p className="text-gray-500 mt-1 flex items-center">
                 <MapPin size={14} className="mr-1" /> {profile.address}
               </p>
            </div>

            <div className="flex gap-3 mt-4 md:mt-0">
               {!isEditing ? (
                 <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button>
               ) : (
                 <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
               )}
            </div>
          </div>

          {/* Stats Strip */}
          <div className="grid grid-cols-3 gap-4 border-t border-gray-100 mt-8 pt-6 text-center">
             <div>
                <div className="text-2xl font-bold text-gray-900">{profile.stats.totalPatients}</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">Patients</div>
             </div>
             <div className="border-l border-gray-100">
                <div className="text-2xl font-bold text-gray-900">{profile.stats.doctorsCount}</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">Doctors</div>
             </div>
             <div className="border-l border-gray-100">
                <div className="text-2xl font-bold text-gray-900">{profile.stats.recordsUploaded}</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">Uploads</div>
             </div>
          </div>
        </div>
      </div>

      {/* Detailed Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 sm:px-0">
         {/* Left: License & Specialization */}
         <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center">
                 <Shield size={18} className="mr-2 text-primary-600" /> Licensing
               </h3>
               <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                     <p className="text-xs text-gray-500 uppercase mb-1">License ID</p>
                     <p className="font-mono font-bold text-gray-800">{profile.licenseId}</p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100 text-green-700">
                     <span className="text-sm font-bold">Status</span>
                     <span className="text-xs bg-green-200 px-2 py-1 rounded-full font-bold uppercase">Active</span>
                  </div>
               </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <h3 className="font-bold text-gray-900 text-lg mb-4">Specializations</h3>
               <div className="flex flex-wrap gap-2">
                  {profile.specialization.map(spec => (
                     <span key={spec} className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium border border-primary-100">
                        {spec}
                     </span>
                  ))}
                  {isEditing && (
                    <button className="px-3 py-1 bg-gray-50 text-gray-400 rounded-full text-sm border border-dashed border-gray-300 hover:border-gray-400 hover:text-gray-600">
                       + Add
                    </button>
                  )}
               </div>
            </div>
         </div>

         {/* Right: Editable Form */}
         <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-900 text-lg">Facility Details</h3>
                  {isEditing && (
                    <Button size="sm" onClick={handleSave}>
                       <Save size={16} className="mr-2" /> Save Changes
                    </Button>
                  )}
               </div>
               
               <form className="space-y-6">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">About Facility</label>
                     <textarea 
                        disabled={!isEditing}
                        value={profile.description}
                        onChange={(e) => setProfile({...profile, description: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all resize-none"
                     />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                           <Mail size={14} className="mr-2 text-gray-400" /> Official Email
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
                           <Phone size={14} className="mr-2 text-gray-400" /> Contact Phone
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
                           <Globe size={14} className="mr-2 text-gray-400" /> Website
                        </label>
                        <input 
                           type="text" 
                           disabled={!isEditing}
                           value={profile.website}
                           onChange={(e) => setProfile({...profile, website: e.target.value})}
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                        />
                     </div>
                     <div>
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
               </form>
            </div>
         </div>
      </div>

    </div>
  );
};
