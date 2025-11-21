import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Shield, 
  Zap, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Brain, 
  FileText, 
  Lock, 
  Globe, 
  Stethoscope, 
  Building2,
  User,
  X,
  Menu,
  ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRegister = (role: string) => {
    setShowRegisterModal(false);
    // In a real app, this would go to specific register pages
    if (role === 'patient') navigate('/register/patient');
    else if (role === 'hospital') navigate('/register/hospital');
    else navigate('/register/hospital'); // Admin usually internal or special link
  };

  return (
    <div className="min-h-screen font-sans text-gray-900 overflow-x-hidden selection:bg-tech-500 selection:text-white">
      
      {/* --- Register Modal --- */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowRegisterModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-fade-in-up transform transition-all">
            <button onClick={() => setShowRegisterModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Join MediCollab</h3>
              <p className="text-gray-500 mt-2">Select your role to get started</p>
            </div>
            <div className="grid gap-4">
              <button onClick={() => handleRegister('patient')} className="flex items-center p-4 border-2 border-gray-100 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all group text-left">
                <div className="bg-primary-100 p-3 rounded-lg text-primary-600 mr-4 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  <User size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">I am a Patient</h4>
                  <p className="text-sm text-gray-500">Manage my health timeline & approvals</p>
                </div>
                <ChevronRight className="ml-auto text-gray-300 group-hover:text-primary-500" />
              </button>
              <button onClick={() => handleRegister('hospital')} className="flex items-center p-4 border-2 border-gray-100 rounded-xl hover:border-tech-500 hover:bg-tech-50 transition-all group text-left">
                <div className="bg-tech-100 p-3 rounded-lg text-tech-600 mr-4 group-hover:bg-tech-600 group-hover:text-white transition-colors">
                  <Building2 size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">We are a Hospital</h4>
                  <p className="text-sm text-gray-500">Upload records & manage disputes</p>
                </div>
                <ChevronRight className="ml-auto text-gray-300 group-hover:text-tech-500" />
              </button>
              <button onClick={() => handleRegister('admin')} className="flex items-center p-4 border-2 border-gray-100 rounded-xl hover:border-gray-900 hover:bg-gray-50 transition-all group text-left">
                <div className="bg-gray-100 p-3 rounded-lg text-gray-600 mr-4 group-hover:bg-gray-800 group-hover:text-white transition-colors">
                  <Shield size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Administrator</h4>
                  <p className="text-sm text-gray-500">System oversight & verification</p>
                </div>
                <ChevronRight className="ml-auto text-gray-300 group-hover:text-gray-900" />
              </button>
            </div>
            <div className="mt-6 text-center text-sm text-gray-500">
              Already have an account? <button onClick={() => navigate('/login')} className="text-primary-600 font-semibold hover:underline">Sign in</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Navigation --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-primary-600 font-bold text-2xl cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-gradient-to-br from-primary-600 to-tech-600 text-white p-2 rounded-lg">
              <Activity size={24} />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-tech-700">MediCollab</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-600 items-center">
            {['Features', 'How it Works', 'AI Highlights', 'Testimonials'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="hover:text-tech-600 transition-colors relative group">
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-tech-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button onClick={() => navigate('/login')} className="text-sm font-semibold text-gray-600 hover:text-primary-600 transition-colors">
              Sign In
            </button>
            <Button 
              onClick={() => setShowRegisterModal(true)} 
              className="bg-gradient-to-r from-primary-600 to-tech-600 hover:shadow-lg hover:scale-105 transform transition-all duration-200 border-none"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
           <div className="md:hidden bg-white absolute w-full border-b shadow-lg p-4 flex flex-col space-y-4 animate-fade-in-up">
              {['Features', 'How it Works', 'AI Highlights', 'Testimonials'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} onClick={() => setMobileMenuOpen(false)} className="text-gray-600 font-medium">
                  {item}
                </a>
              ))}
              <div className="pt-4 border-t flex flex-col space-y-3">
                 <Button variant="outline" fullWidth onClick={() => navigate('/login')}>Sign In</Button>
                 <Button fullWidth onClick={() => setShowRegisterModal(true)}>Get Started</Button>
              </div>
           </div>
        )}
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-tech-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 border border-tech-100 shadow-sm mb-8 backdrop-blur-sm animate-fade-in-up">
              <span className="flex h-2 w-2 rounded-full bg-tech-500 mr-2 animate-pulse"></span>
              <span className="text-sm font-medium text-tech-700">The Future of Decentralized Healthcare</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Secure, Patient-Owned <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-tech-600 to-purple-600">
                Digital Health Records
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              A transparent platform where hospitals upload and patients approve. 
              Your health timeline, secured by blockchain and enhanced by AI.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Button 
                size="lg" 
                onClick={() => setShowRegisterModal(true)}
                className="h-14 px-8 text-lg bg-gradient-to-r from-primary-600 to-tech-600 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Start Now <ArrowRight className="ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/login')}
                className="h-14 px-8 text-lg bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                Existing Member
              </Button>
            </div>

            {/* Stats Counter */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {[
                { label: 'Patients Assisted', val: '10k+' },
                { label: 'Hospitals Connected', val: '500+' },
                { label: 'Records Protected', val: '1M+' },
              ].map((stat, idx) => (
                <div key={idx} className="glass-card p-4 rounded-2xl">
                  <div className="text-3xl font-bold text-primary-700 mb-1">{stat.val}</div>
                  <div className="text-sm font-medium text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-tech-600 font-bold tracking-wide uppercase text-sm mb-2">Core Capabilities</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Built for Modern Healthcare</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Lock, title: "Patient-Approved", desc: "Nothing goes on your record without your explicit digital signature approval.", color: "text-blue-600 bg-blue-50" },
              { icon: Building2, title: "Hospital Workflow", desc: "Streamlined upload portal for hospitals to securely transmit encrypted data.", color: "text-indigo-600 bg-indigo-50" },
              { icon: Activity, title: "Timeline Feed", desc: "View your health history like a social feed. Prescriptions, bills, reports in one place.", color: "text-teal-600 bg-teal-50" },
              { icon: Shield, title: "Emergency Access", desc: "Grant temporary access to emergency responders via secure QR codes.", color: "text-red-600 bg-red-50" },
              { icon: Globe, title: "Portability", desc: "Moving cities? Your medical history travels with you instantly.", color: "text-orange-600 bg-orange-50" },
              { icon: User, title: "Role-Based", desc: "Strict permissions ensure admins, hospitals, and patients only see what they should.", color: "text-purple-600 bg-purple-50" },
            ].map((f, i) => (
              <div key={i} className="group bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${f.color} group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon size={28} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h4>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- AI Highlights Section --- */}
      <section id="ai-highlights" className="py-24 bg-gray-900 text-white relative overflow-hidden">
         {/* Glowing accents */}
         <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-tech-900/50 to-transparent pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-900/30 rounded-full blur-3xl"></div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between mb-16">
               <div>
                 <div className="flex items-center space-x-2 mb-4">
                    <Brain className="text-ai-400 animate-pulse" />
                    <span className="text-ai-400 font-bold tracking-wider text-sm uppercase">Powered by Gemini</span>
                 </div>
                 <h2 className="text-4xl font-bold">Intelligent Health Insights</h2>
                 <p className="text-gray-400 mt-4 max-w-xl">We don't just store data. We help you understand it using advanced Generative AI.</p>
               </div>
               <Button className="mt-8 md:mt-0 bg-white text-gray-900 hover:bg-gray-100 border-none">Explore AI Demo</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[
                  { title: "Smart OCR", desc: "Scans handwritten prescriptions and digitizes them instantly." },
                  { title: "Auto Categorization", desc: "AI sorts uploaded files into Lab Reports, Imaging, or Bills automatically." },
                  { title: "Summary Generator", desc: "Turns 10-page discharge summaries into a simple 5-line paragraph." },
                  { title: "Medicine Reminders", desc: "Extracts dosage info and sets up automated push notifications." },
                  { title: "Trend Analytics", desc: "Detects patterns in your blood work over years and alerts anomalies." },
               ].map((item, i) => (
                  <div key={i} className="bg-gray-800/50 backdrop-blur-md border border-gray-700 p-6 rounded-xl hover:border-ai-500 hover:bg-gray-800 transition-all duration-300 group">
                     <div className="flex justify-between items-start mb-4">
                        <h4 className="font-bold text-lg text-white group-hover:text-ai-400 transition-colors">{item.title}</h4>
                        <Zap size={18} className="text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                     </div>
                     <p className="text-gray-400 text-sm">{item.desc}</p>
                     <div className="mt-4 inline-flex items-center text-xs font-medium text-ai-400 bg-ai-500/10 px-2 py-1 rounded border border-ai-500/20">
                        AI Powered 🧠
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- How It Works --- */}
      <section id="how-it-works" className="py-24 bg-primary-50/50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-gray-900">How MediCollab Works</h2>
               <p className="text-gray-500 mt-4">A simple secure loop between provider and patient.</p>
            </div>

            <div className="relative">
               {/* Connector Line (Desktop) */}
               <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
               
               <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                  {[
                     { step: 1, title: "Upload", text: "Hospital uploads encrypted document.", icon: FileText },
                     { step: 2, title: "Review", text: "Patient gets notified & reviews record.", icon: CheckCircle },
                     { step: 3, title: "Timeline", text: "Record added to permanent history.", icon: Activity },
                     { step: 4, title: "Enhance", text: "AI adds summary & insights.", icon: Brain },
                  ].map((s, i) => (
                     <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-500 to-tech-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg">
                           <s.icon size={28} />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h4>
                        <p className="text-sm text-gray-500">{s.text}</p>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* --- Testimonials --- */}
      <section id="testimonials" className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Trusted by the Community</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { quote: "Finally, I don't have to carry a massive folder of papers to every doctor visit.", author: "Sarah J.", role: "Patient", img: "https://i.pravatar.cc/150?u=1" },
                  { quote: "The AI summaries save me about 10 minutes per patient consultation. Incredible.", author: "Dr. A. Patel", role: "Cardiologist", img: "https://i.pravatar.cc/150?u=2" },
                  { quote: "Administering disputes has never been easier. The transparency is exactly what we needed.", author: "Marcus R.", role: "Hospital Admin", img: "https://i.pravatar.cc/150?u=3" },
               ].map((t, i) => (
                  <div key={i} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:border-primary-200 transition-colors">
                     <div className="flex items-center space-x-4 mb-6">
                        <img src={t.img} alt={t.author} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                        <div>
                           <h5 className="font-bold text-gray-900">{t.author}</h5>
                           <span className="text-xs font-bold text-primary-600 uppercase">{t.role}</span>
                        </div>
                     </div>
                     <p className="text-gray-600 italic">"{t.quote}"</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0 flex items-center space-x-2">
               <Activity className="text-primary-500" />
               <span className="text-2xl font-bold text-white">MediCollab</span>
            </div>
            <div className="flex space-x-8 text-sm font-medium">
               <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
               <a href="#" className="hover:text-white transition-colors">Contact Support</a>
            </div>
            <div className="mt-8 md:mt-0 text-sm">
               &copy; 2025 MediCollab. All rights reserved.
            </div>
         </div>
      </footer>
    </div>
  );
};
