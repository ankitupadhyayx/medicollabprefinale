import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Edit2, 
  Save, 
  X,
  Shield,
  CheckCircle,
  AlertCircle,
  Camera,
  Loader
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface HospitalProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  hospitalName?: string;
  hospitalAddress?: string;
  licenseNumber?: string;
  role: string;
  createdAt: string;
}

export const HospitalProfile: React.FC = () => {
  const [profile, setProfile] = useState<HospitalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    hospitalName: '',
    hospitalAddress: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userStr = localStorage.getItem('user');
      
      if (!userStr) {
        throw new Error('User data not found');
      }

      const user = JSON.parse(userStr);
      setProfile(user);
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        hospitalName: user.hospitalName || user.name || '',
        hospitalAddress: user.hospitalAddress || '',
      });
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setError(null);
    setSaving(true);

    try {
      const updatedUser = { ...profile, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setProfile(updatedUser as HospitalProfile);
      
      setSuccess(true);
      setEditing(false);
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      console.error('❌ Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        hospitalName: profile.hospitalName || profile.name || '',
        hospitalAddress: profile.hospitalAddress || '',
      });
    }
    setEditing(false);
    setError(null);
  };

  const getInitials = () => {
    const name = profile?.hospitalName || profile?.name || 'H';
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hospital Profile</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your hospital information</p>
        </div>
        {!editing && (
          <Button onClick={() => setEditing(true)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-sm text-green-700 font-medium">Profile updated successfully!</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-500 via-medical-500 to-tech-500 relative">
          <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-white transition-colors flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Change Cover
          </button>
        </div>

        <div className="p-8">
          <div className="flex items-start gap-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-medical-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg -mt-16 border-4 border-white">
                {getInitials()}
              </div>
              <button className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {profile.hospitalName || profile.name}
              </h2>
              <p className="text-gray-600 mb-4">{profile.email}</p>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium">
                  <Shield className="w-4 h-4" />
                  Verified Hospital
                </div>
                <div className="text-sm text-gray-500">
                  Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Dr. John Doe"
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{profile.name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{profile.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="+1 (555) 000-0000"
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{profile.phone || 'Not provided'}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Number
              </label>
              <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                <FileText className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{profile.licenseNumber || 'Not provided'}</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hospital Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="St. Mary's Medical Center"
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{profile.hospitalName || profile.name}</span>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hospital Address
              </label>
              {editing ? (
                <textarea
                  value={formData.hospitalAddress}
                  onChange={(e) => setFormData({ ...formData, hospitalAddress: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  placeholder="400 W 113th St, New York, NY 10025"
                />
              ) : (
                <div className="flex items-start gap-3 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <span className="text-gray-900">{profile.hospitalAddress || 'Not provided'}</span>
                </div>
              )}
            </div>
          </div>

          {editing && (
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saving ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={saving} className="flex-1">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Shield className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Verification Status</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">Your hospital is verified and active</p>
          <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
            <CheckCircle className="w-4 h-4" />
            Verified
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Account Type</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">Healthcare Provider Account</p>
          <div className="text-sm text-blue-600 font-medium">
            {profile.role ? profile.role.toUpperCase() : 'HOSPITAL'}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Building2 className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Member Since</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">Account created on</p>
          <div className="text-sm text-purple-600 font-medium">
            {new Date(profile.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
