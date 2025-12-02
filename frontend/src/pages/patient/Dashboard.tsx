
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_RECORDS, MOCK_REMINDERS, MOCK_PENDING_APPOINTMENTS } from '../../constants';
import { Button } from '../../components/ui/Button';
import { 
  FileText, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Brain, 
  ChevronRight,
  Activity,
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Derived Stats
  const pendingApprovals = MOCK_RECORDS.filter(r => r.status === 'PENDING').length + MOCK_PENDING_APPOINTMENTS.length;
  const upcomingReminders = MOCK_REMINDERS.filter(r => r.status === 'UPCOMING' || r.status === 'REFILL_NEEDED').length;
  
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img src={user?.avatar} alt="Profile" className="w-14 h-14 rounded-full border-2 border-primary-100" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hello, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-gray-500 text-sm">Here's your health overview for today.</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
           <div className="relative cursor-pointer p-2 bg-white rounded-full shadow-sm hover:text-primary-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
           </div>
           <div className="flex items-center px-3 py-1.5 bg-ai-500/10 rounded-full border border-ai-500/20">
              <Brain size={16} className="text-ai-600 mr-1.5" />
              <span className="text-xs font-bold text-ai-700">AI Supported</span>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white p-6 rounded-2xl shadow-lg shadow-primary-500/30 hover:scale-[1.02] transition-transform">
            <div className="flex justify-between items-start mb-4">
               <div className="p-2 bg-white/20 rounded-lg"><Activity size={24} /></div>
               <span className="bg-white/20 px-2 py-1 rounded text-xs font-medium">Updated</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{MOCK_RECORDS.filter(r => r.status === 'APPROVED').length}</h3>
            <p className="text-primary-100 text-sm">Verified Records</p>
            <Button 
               size="sm" 
               variant="ghost" 
               className="mt-4 w-full justify-between text-white hover:bg-white/10 border border-white/20"
               onClick={() => navigate('/patient/timeline')}
            >
               View Timeline <ChevronRight size={16} />
            </Button>
         </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-50 rounded-bl-full -mr-4 -mt-4 group-hover:scale-110 transition-transform"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
               <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><AlertCircle size={24} /></div>
               {pendingApprovals > 0 && (
                 <span className="animate-pulse bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">Action Req.</span>
               )}
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1 relative z-10">{pendingApprovals}</h3>
            <p className="text-gray-500 text-sm relative z-10">Pending Approvals</p>
            <Button 
               size="sm" 
               variant="outline" 
               className="mt-4 w-full justify-between group-hover:border-yellow-200 group-hover:bg-yellow-50/50"
               onClick={() => navigate('/patient/approvals')}
            >
               Review Now <ChevronRight size={16} />
            </Button>
         </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-50 rounded-bl-full -mr-4 -mt-4 group-hover:scale-110 transition-transform"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
               <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Clock size={24} /></div>
               {upcomingReminders > 0 && (
                 <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-bold flex items-center">
                   <Brain size={10} className="mr-1"/> AI
                 </span>
               )}
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1 relative z-10">{upcomingReminders}</h3>
            <p className="text-gray-500 text-sm relative z-10">Active Reminders</p>
            <Button 
               size="sm" 
               variant="outline" 
               className="mt-4 w-full justify-between group-hover:border-purple-200 group-hover:bg-purple-50/50"
               onClick={() => navigate('/patient/reminders')}
            >
               View Reminders <ChevronRight size={16} />
            </Button>
         </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Left: Recent Activity Feed */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
               <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
               <button onClick={() => navigate('/patient/timeline')} className="text-sm text-primary-600 hover:underline font-medium">View Full Timeline</button>
            </div>
            
            <div className="space-y-4">
               {MOCK_RECORDS.slice(0, 3).map(record => (
                  <div key={record.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4 hover:border-primary-100 transition-colors cursor-pointer" onClick={() => navigate('/patient/timeline')}>
                     <div className={`p-3 rounded-full flex-shrink-0 ${
                        record.status === 'APPROVED' ? 'bg-green-50 text-green-600' :
                        record.status === 'PENDING' ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'
                     }`}>
                        <FileText size={20} />
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between">
                           <h4 className="font-bold text-gray-900 text-sm">{record.title}</h4>
                           <span className="text-xs text-gray-400">{record.date}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{record.hospitalName}</p>
                        
                        <div className="flex gap-2 mt-2">
                           {record.aiAnalyzed && (
                             <span className="text-[10px] flex items-center bg-ai-50 text-ai-700 px-1.5 py-0.5 rounded border border-ai-100">
                                <Brain size={10} className="mr-1" /> AI Analyzed
                             </span>
                           )}
                           {record.status === 'PENDING' && (
                             <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold">Action Needed</span>
                           )}
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Right: Quick Actions & Upcoming */}
         <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
               <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
               <div className="space-y-3">
                  <Button fullWidth variant="outline" onClick={() => navigate('/patient/appointments')} className="justify-start text-left text-sm">
                     <Calendar size={16} className="mr-2 text-primary-600" /> Book Appointment
                  </Button>
                  <Button fullWidth variant="outline" onClick={() => navigate('/patient/profile')} className="justify-start text-left text-sm">
                     <Activity size={16} className="mr-2 text-green-600" /> Update Vitals
                  </Button>
                  <Button fullWidth variant="outline" onClick={() => navigate('/patient/reminders')} className="justify-start text-left text-sm">
                     <Clock size={16} className="mr-2 text-purple-600" /> Add Reminder
                  </Button>
               </div>
            </div>

            <div className="bg-primary-50/50 p-5 rounded-2xl border border-primary-100">
               <div className="flex items-center mb-3 text-primary-700 font-bold">
                  <Brain size={18} className="mr-2 animate-pulse" /> AI Insight
               </div>
               <p className="text-sm text-gray-600 leading-relaxed">
                  Your vital trends look stable. Consider scheduling your annual dental checkup soon based on your history.
               </p>
               <button onClick={() => navigate('/patient/ai-insights')} className="mt-3 text-xs font-bold text-primary-600 hover:underline">View Health Report</button>
            </div>
         </div>

      </div>
    </div>
  );
};
