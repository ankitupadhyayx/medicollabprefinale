import React, { useState, useEffect } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  User, 
  Building2, 
  Camera, 
  Upload, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  X, 
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../components/ui/Button';

// --- Validation Schemas ---

const phoneRegExp = /^[0-9]{10}$/;

const patientSchema = yup.object().shape({
  fullName: yup.string().required('Full Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().matches(phoneRegExp, 'Phone number must be 10 digits').required('Phone is required'),
  dob: yup.string().required('Date of Birth is required'),
  gender: yup.string().required('Gender is required'),
  bloodGroup: yup.string().required('Blood Group is required'),
  address: yup.string().required('Address is required'),
  emergencyContactName: yup.string().required('Emergency Contact Name is required'),
  emergencyContactPhone: yup.string().matches(phoneRegExp, 'Phone number must be 10 digits').required('Emergency Phone is required'),
  password: yup.string().min(6, 'Password must be at least 6 chars').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm Password is required'),
});

const hospitalSchema = yup.object().shape({
  fullName: yup.string().required('Hospital/Doctor Name is required'),
  licenseId: yup.string().required('License/Registration ID is required'),
  specialization: yup.string().required('Specialization is required'),
  experience: yup.number().typeError('Experience must be a number').positive().integer().required('Experience is required'),
  email: yup.string().email('Invalid email').required('Contact Email is required'),
  phone: yup.string().matches(phoneRegExp, 'Phone number must be 10 digits').required('Phone is required'),
  address: yup.string().required('Clinic/Hospital Address is required'),
  password: yup.string().min(6, 'Password must be at least 6 chars').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm Password is required'),
});

// Interface for all possible form fields
interface RegisterFormInputs {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  address: string;
  // Patient fields
  dob?: string;
  gender?: string;
  bloodGroup?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  // Hospital fields
  licenseId?: string;
  specialization?: string;
  experience?: number;
}

// --- Components ---

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State
  const [role, setRole] = useState<'PATIENT' | 'HOSPITAL'>('PATIENT');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [docPreview, setDocPreview] = useState<string | null>(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState('AI Suggesting Data...');

  // Check URL for initial role (e.g. /register?role=hospital)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlRole = searchParams.get('role');
    if (urlRole === 'hospital') setRole('HOSPITAL');
    else if (urlRole === 'patient') setRole('PATIENT');
  }, [location]);

  // Form Setup
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, isSubmitting },
    setValue
  } = useForm<RegisterFormInputs>({
    // Cast schemas to correct Resolver type to handle union of schemas mismatch
    resolver: yupResolver(role === 'PATIENT' ? patientSchema : hospitalSchema) as unknown as Resolver<RegisterFormInputs>,
    mode: 'onBlur'
  });

  // Reset form when role changes
  useEffect(() => {
    reset();
    setAvatarPreview(null);
    setDocPreview(null);
  }, [role, reset]);

  // Handlers
  const onRoleChange = (newRole: 'PATIENT' | 'HOSPITAL') => {
    setRole(newRole);
    navigate(`/register?role=${newRole.toLowerCase()}`, { replace: true });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'doc') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'avatar') setAvatarPreview(url);
      else setDocPreview(url);
    }
  };

  const handleAISuggestion = () => {
    setShowAIModal(true);
    setAiLoading(true);
    setAiMessage('AI Scanning Context & Suggesting Data...');
    
    setTimeout(() => {
      setAiMessage('Optimizing Profile...');
    }, 1500);

    setTimeout(() => {
      // Mock autofill
      setValue('fullName', role === 'PATIENT' ? 'John Doe' : 'City General Hospital');
      setValue('email', role === 'PATIENT' ? 'john.doe@example.com' : 'admin@citygeneral.com');
      setValue('phone', '9876543210');
      setValue('address', '123 Health St, Metropolis');
      if(role === 'HOSPITAL') {
        setValue('specialization', 'Cardiology');
        setValue('experience', 15);
        setValue('licenseId', 'REG-2024-X99');
      }
      
      setAiLoading(false);
      setAiMessage('Data Autofilled Successfully!');
      
      setTimeout(() => {
        setShowAIModal(false);
      }, 1000);
    }, 3000);
  };

  const onSubmit = async (data: any) => {
    console.log('Form Submitted:', data);
    // Mock API Call
    await new Promise(resolve => setTimeout(resolve, 1500));
    navigate('/login');
  };

  // Helper for Input Fields
  const InputField = ({ label, name, type = "text", placeholder, icon: Icon, aiBadge = false }: any) => (
    <div className="space-y-1">
      <div className="flex justify-between">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {aiBadge && <span className="text-[10px] font-bold text-ai-500 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100 flex items-center"><Sparkles size={10} className="mr-1" /> AI Validated</span>}
      </div>
      <div className="relative rounded-md shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          {...register(name)}
          className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 border ${errors[name] ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-tech-500 focus:border-tech-500'} rounded-lg focus:outline-none focus:ring-2 sm:text-sm transition-all`}
          placeholder={placeholder}
        />
      </div>
      {errors[name] && (
        <p className="text-xs text-red-600 flex items-center mt-1">
          <AlertCircle size={12} className="mr-1" /> {errors[name]?.message as string}
        </p>
      )}
    </div>
  );

  // Helper for Select Fields
  const SelectField = ({ label, name, options, aiBadge = false }: any) => (
    <div className="space-y-1">
      <div className="flex justify-between">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {aiBadge && <span className="text-[10px] font-bold text-ai-500 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">AI Validated</span>}
      </div>
      <select
        {...register(name)}
        className={`block w-full pl-3 pr-10 py-2.5 text-base border ${errors[name] ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-tech-500 focus:border-tech-500'} rounded-lg focus:outline-none focus:ring-2 sm:text-sm transition-all`}
      >
        <option value="">Select {label}</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {errors[name] && (
        <p className="text-xs text-red-600 flex items-center mt-1">
          <AlertCircle size={12} className="mr-1" /> {errors[name]?.message as string}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col relative overflow-hidden">
      
      {/* --- Background Elements --- */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-tech-600/10 to-transparent -z-10"></div>
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-primary-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-ai-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>

      {/* --- AI Modal --- */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center animate-fade-in-up border border-purple-100 relative overflow-hidden">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            
            <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-ai-400 to-tech-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Sparkles className="text-white animate-pulse" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">AI Assistant</h3>
            <p className="text-gray-600 mb-6">{aiMessage}</p>
            {aiLoading && (
              <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                 <div className="bg-tech-500 h-2 rounded-full animate-[width_2s_ease-in-out_infinite]" style={{width: '80%'}}></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- Navbar --- */}
      <div className="w-full max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
        <Link to="/" className="flex items-center text-gray-500 hover:text-tech-600 font-medium transition-colors">
           <ArrowLeft className="mr-2" size={20} /> Back to Home
        </Link>
        <div className="flex items-center space-x-2">
           <div className="bg-gradient-to-br from-primary-600 to-tech-600 text-white p-1.5 rounded-lg shadow-md">
             <Sparkles size={16} />
           </div>
           <span className="font-bold text-gray-900 tracking-tight">MediCollab Registration</span>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="flex-1 flex items-center justify-center p-4 pb-20">
        <div className="w-full max-w-4xl bg-white/80 backdrop-blur-lg border border-white/50 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          
          {/* Left Side: Visuals */}
          <div className="hidden md:flex w-1/3 bg-gradient-to-br from-primary-600 to-tech-700 relative p-8 flex-col justify-between text-white">
             <div>
               <h2 className="text-3xl font-bold mb-2">Welcome!</h2>
               <p className="text-primary-100 text-sm">Join the transparent healthcare revolution.</p>
             </div>
             
             <div className="relative h-64 w-full my-auto">
                {/* Illustration Placeholder using CSS shapes */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/20 rounded-full backdrop-blur-md border border-white/30 flex items-center justify-center animate-float">
                   {role === 'PATIENT' ? <User size={48} /> : <Building2 size={48} />}
                </div>
                <div className="absolute top-10 right-10 w-16 h-16 bg-tech-400/30 rounded-lg backdrop-blur-sm animate-float animation-delay-2000"></div>
                <div className="absolute bottom-10 left-10 w-20 h-20 bg-primary-400/30 rounded-full backdrop-blur-sm animate-float animation-delay-4000"></div>
             </div>

             <div className="space-y-4">
               <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/20">
                 <div className="flex items-center mb-1 text-ai-400 text-xs font-bold uppercase"><Sparkles size={10} className="mr-1"/> AI Feature</div>
                 <p className="text-xs text-gray-100">Smart parsing of uploaded IDs to auto-verify your account.</p>
               </div>
             </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full md:w-2/3 p-8 md:p-12 relative overflow-y-auto max-h-[90vh]">
            
            {/* AI Button */}
            <button 
              onClick={handleAISuggestion}
              type="button"
              className="absolute top-6 right-6 flex items-center space-x-2 px-4 py-2 bg-purple-50 text-tech-600 rounded-full text-sm font-bold hover:bg-tech-600 hover:text-white transition-all shadow-sm hover:shadow-md group"
            >
               <Sparkles size={16} className="group-hover:animate-spin" />
               <span>AI Autofill</span>
            </button>

            {/* Role Tabs */}
            <div className="flex space-x-6 border-b border-gray-200 mb-8 relative w-fit">
              <button 
                onClick={() => onRoleChange('PATIENT')}
                className={`pb-3 text-sm font-bold transition-all relative ${role === 'PATIENT' ? 'text-tech-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Patient
                {role === 'PATIENT' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-tech-500"></div>}
              </button>
              <button 
                onClick={() => onRoleChange('HOSPITAL')}
                className={`pb-3 text-sm font-bold transition-all relative ${role === 'HOSPITAL' ? 'text-tech-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Doctor / Hospital
                {role === 'HOSPITAL' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-tech-500"></div>}
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fadeIn">
              
              {/* --- Image Uploads --- */}
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-6">
                 {/* Avatar */}
                 <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-tech-500 transition-colors">
                       {avatarPreview ? (
                         <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                       ) : (
                         <Camera className="text-gray-400" size={32} />
                       )}
                    </div>
                    <input 
                      type="file" 
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      onChange={(e) => handleImageChange(e, 'avatar')}
                    />
                    <div className="absolute bottom-0 right-0 bg-tech-600 text-white p-1.5 rounded-full shadow-md pointer-events-none">
                      <Upload size={12} />
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-2 font-medium">Profile Photo</p>
                 </div>

                 {/* Doc Proof (Hospital Only) */}
                 {role === 'HOSPITAL' && (
                   <div className="relative group">
                      <div className="w-24 h-24 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-tech-500 transition-colors">
                         {docPreview ? (
                           <img src={docPreview} alt="Doc" className="w-full h-full object-cover" />
                         ) : (
                           <div className="text-center p-2">
                             <Upload className="text-gray-400 mx-auto mb-1" size={24} />
                             <span className="text-[10px] text-gray-400">ID Proof</span>
                            </div>
                         )}
                      </div>
                      <input 
                        type="file" 
                        accept="image/*,.pdf"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        onChange={(e) => handleImageChange(e, 'doc')}
                      />
                      <p className="text-xs text-center text-gray-500 mt-2 font-medium">License ID</p>
                   </div>
                 )}
              </div>

              {/* --- Dynamic Fields --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField 
                  label={role === 'PATIENT' ? "Full Name" : "Hospital / Doctor Name"} 
                  name="fullName" 
                  placeholder={role === 'PATIENT' ? "e.g. Alex Doe" : "e.g. St. Marys"}
                  aiBadge={true}
                />
                
                {role === 'HOSPITAL' && (
                  <>
                    <InputField label="License / Registration ID" name="licenseId" placeholder="e.g. REG-12345" aiBadge={true} />
                    <SelectField 
                      label="Specialization" 
                      name="specialization" 
                      options={["Cardiology", "Dermatology", "General Physician", "Pediatrics", "Orthopedic", "Oncology", "Other"]} 
                    />
                    <InputField label="Experience (Years)" name="experience" type="number" placeholder="e.g. 10" />
                  </>
                )}

                <InputField label="Contact Email" name="email" type="email" placeholder="name@example.com" />
                <InputField label="Phone Number" name="phone" type="number" placeholder="10-digit number" />
                
                {role === 'PATIENT' && (
                  <>
                    <InputField label="Date of Birth" name="dob" type="date" />
                    <SelectField label="Gender" name="gender" options={["Male", "Female", "Other"]} />
                    <SelectField label="Blood Group" name="bloodGroup" options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]} aiBadge={true} />
                    <InputField label="Address" name="address" placeholder="City, Country" />
                  </>
                )}

                {role === 'HOSPITAL' && (
                  <div className="md:col-span-2">
                    <InputField label="Clinic / Hospital Address" name="address" placeholder="Full Street Address" aiBadge={true} />
                  </div>
                )}
              </div>

              {/* --- Emergency Contact (Patient Only) --- */}
              {role === 'PATIENT' && (
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 mt-4">
                   <h4 className="text-sm font-bold text-red-800 mb-3 flex items-center"><AlertCircle size={16} className="mr-2"/> Emergency Contact</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField label="Contact Name" name="emergencyContactName" placeholder="e.g. Parent/Spouse" />
                      <InputField label="Contact Phone" name="emergencyContactPhone" type="number" placeholder="10-digit number" />
                   </div>
                </div>
              )}

              {/* --- Password Section --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <InputField label="Password" name="password" type="password" placeholder="••••••" />
                <InputField label="Confirm Password" name="confirmPassword" type="password" placeholder="••••••" />
              </div>

              {/* --- Action Buttons --- */}
              <div className="pt-6">
                <Button type="submit" fullWidth size="lg" isLoading={isSubmitting} className="rounded-xl shadow-lg shadow-primary-500/20">
                  Create Account <ArrowRight size={20} className="ml-2" />
                </Button>
                <p className="text-center text-sm text-gray-500 mt-4">
                  Already registered? <Link to="/login" className="text-tech-600 font-bold hover:underline">Sign In</Link>
                </p>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};