
import React, { useState } from 'react';
import { MOCK_HOSPITALS, MOCK_DISPUTES, MOCK_AUDIT_LOGS } from '../../constants';
import { 
  ShieldCheck, 
  AlertTriangle, 
  MapPin, 
  Check, 
  X, 
  Ban, 
  Bell, 
  Search, 
  Sparkles, 
  Building2, 
  FileText, 
  Brain,
  Eye,
  MoreHorizontal,
  Lock,
  RefreshCw,
  Download,
  CheckCircle,
  ChevronRight,
  Calendar,
  Mail,
  Phone
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { Hospital, Dispute } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // --- Local State ---
  const [hospitals, setHospitals] = useState(MOCK_HOSPITALS);
  const [disputes, setDisputes] = useState(MOCK_DISPUTES);
  const [searchTerm, setSearchTerm] = useState('');
  
  // UI State
  const [aiAnalyzingId, setAiAnalyzingId] = useState<string | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // --- Helpers ---
  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // --- Hospital Logic ---
  const updateHospitalStatus = (id: string, status: 'Verified' | 'Suspended' | 'Pending') => {
    setHospitals(prev => prev.map(h => h.id === id ? { ...h, status: status, verified: status === 'Verified' } : h));
    showToast(`Hospital ${status} Successfully`);
    if (selectedHospital?.id === id) {
      setSelectedHospital(prev => prev ? { ...prev, status: status, verified: status === 'Verified' } : null);
    }
  };

  const filteredHospitals = hospitals.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.licenseId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Dispute Logic ---
  const handleAiScan = (id: string) => {
    setAiAnalyzingId(id);
    // Mock AI Delay
    setTimeout(() => {
      setAiAnalyzingId(null);
      showToast('AI Analysis Complete: No anomalies found.');
    }, 2000); 
  };

  const resolveDispute = (id: string, resolution: 'Valid' | 'Dismissed') => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: 'Resolved' } : d));
    showToast(`Dispute Resolved: Claim ${resolution}`);
    setSelectedDispute(null);
  };

  // --- System Logic ---
  const handleDownloadBackup = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      showToast('Encrypted Backup Downloaded Successfully');
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn relative">
      
      {/* --- Toast Notification --- */}
      {feedbackMsg && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center animate-fade-in-up">
          <CheckCircle size={18} className="text-green-400 mr-2" />
          {feedbackMsg}
        </div>
      )}

      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back, Admin 👋</h1>
          <p className="text-gray-500">System overview and compliance monitoring.</p>
        </div>
        <div className="flex items-center space-x-4 relative">
           {/* Search */}
           <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search system..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 outline-none w-64 transition-all" 
              />
           </div>
           
           {/* Notifications */}
           <div className="relative">
             <button 
               onClick={() => setShowNotifications(!showNotifications)}
               className="p-2 bg-white rounded-full shadow-sm border border-gray-100 text-gray-500 hover:text-primary-600 relative transition-colors"
             >
               <Bell size={20} />
               <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
             </button>
             
             {showNotifications && (
               <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-20 overflow-hidden animate-fade-in-up">
                 <div className="p-3 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                   <h4 className="font-bold text-sm text-gray-900">Notifications</h4>
                   <span className="text-xs text-primary-600 cursor-pointer hover:underline">Mark all read</span>
                 </div>
                 <div className="max-h-64 overflow-y-auto">
                   {[1, 2, 3].map((_, i) => (
                     <div key={i} className="p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 cursor-pointer">
                       <div className="flex items-start gap-3">
                         <div className="bg-blue-50 p-1.5 rounded-full text-blue-600 mt-0.5"><ShieldCheck size={14} /></div>
                         <div>
                           <p className="text-xs font-medium text-gray-800">New Hospital Registration</p>
                           <p className="text-[10px] text-gray-500 mt-0.5">Apex Cardio applied for verification.</p>
                           <span className="text-[10px] text-gray-400 mt-1 block">2 mins ago</span>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}
           </div>

           {/* AI Badge */}
           <div className="flex items-center px-3 py-1.5 bg-ai-500/10 rounded-full border border-ai-500/20">
              <Brain size={14} className="text-ai-600 mr-1.5" />
              <span className="text-xs font-bold text-ai-700">AI Enabled</span>
           </div>
        </div>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Hospitals', val: hospitals.length, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending Approvals', val: hospitals.filter(h => h.status === 'Pending').length, icon: ShieldCheck, color: 'text-yellow-600', bg: 'bg-yellow-50', ai: true },
          { label: 'Disputed Records', val: disputes.filter(d => d.status === 'Pending Review').length, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Compliance Alerts', val: '2', icon: Brain, color: 'text-ai-600', bg: 'bg-ai-50', ai: true },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:scale-[1.02] transition-all duration-300 group">
             <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                   <stat.icon size={24} />
                </div>
                {stat.ai && (
                  <span className="bg-ai-50 text-ai-600 text-[10px] font-bold px-2 py-1 rounded-full border border-ai-100 flex items-center">
                    <Sparkles size={10} className="mr-1" /> AI
                  </span>
                )}
             </div>
             <h3 className="text-3xl font-bold text-gray-900">{stat.val}</h3>
             <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* --- Section 1: Hospital Management --- */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
         <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 text-lg">Hospital Registry</h3>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setSearchTerm('Pending')}>Pending</Button>
              <Button variant="outline" size="sm" onClick={() => setSearchTerm('')}>View All</Button>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full">
               <thead className="bg-gray-50/50">
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                     <th className="px-6 py-4">Hospital / Doctor</th>
                     <th className="px-6 py-4">License ID</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {filteredHospitals.length > 0 ? filteredHospitals.map((h) => (
                     <tr key={h.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedHospital(h)}>
                           <div className="flex items-center">
                              <div className="h-10 w-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm mr-3 group-hover:bg-primary-200 transition-colors">
                                 {h.name.charAt(0)}
                              </div>
                              <div>
                                 <div className="font-medium text-gray-900 flex items-center group-hover:text-primary-600 transition-colors">
                                   {h.name}
                                   {h.aiFlag && (
                                      <span className="ml-2 flex items-center text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100" title="AI Flag: Suspicious Pattern">
                                         <Brain size={10} className="mr-1" /> Flag
                                      </span>
                                   )}
                                 </div>
                                 <div className="text-xs text-gray-500 flex items-center"><MapPin size={10} className="mr-1"/> {h.location}</div>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-mono">{h.licenseId}</td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                              ${h.status === 'Verified' ? 'bg-green-100 text-green-800' : 
                                h.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}
                           `}>
                              {h.status === 'Verified' && <Check size={12} className="mr-1" />}
                              {h.status === 'Pending' && <AlertTriangle size={12} className="mr-1" />}
                              {h.status === 'Suspended' && <Ban size={12} className="mr-1" />}
                              {h.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex justify-end items-center space-x-2">
                              {h.status === 'Pending' && (
                                <>
                                  <button onClick={() => updateHospitalStatus(h.id, 'Verified')} className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" title="Approve"><Check size={18} /></button>
                                  <button onClick={() => updateHospitalStatus(h.id, 'Suspended')} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Reject"><X size={18} /></button>
                                </>
                              )}
                              {h.status === 'Verified' && (
                                 <button onClick={() => updateHospitalStatus(h.id, 'Suspended')} className="p-1.5 text-orange-500 hover:bg-orange-50 rounded transition-colors" title="Suspend"><Ban size={18} /></button>
                              )}
                              <button onClick={() => setSelectedHospital(h)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded"><Eye size={18} /></button>
                           </div>
                        </td>
                     </tr>
                  )) : (
                     <tr><td colSpan={4} className="text-center py-8 text-gray-400">No hospitals found matching "{searchTerm}"</td></tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* --- Section 2: Disputed Records --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
               <h3 className="font-bold text-gray-900 text-lg">Disputed Records</h3>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead className="bg-gray-50/50">
                     <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-3">Record Info</th>
                        <th className="px-6 py-3">AI Analysis</th>
                        <th className="px-6 py-3 text-right">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {disputes.map((d) => (
                        <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                           <td className="px-6 py-4">
                              <div className="font-medium text-gray-900 text-sm">{d.recordTitle}</div>
                              <div className="text-xs text-gray-500">{d.hospitalName} • {d.patientName}</div>
                              {d.status === 'Resolved' && <span className="mt-1 inline-block text-[10px] bg-gray-100 text-gray-600 px-1.5 rounded">Resolved</span>}
                           </td>
                           <td className="px-6 py-4">
                              {aiAnalyzingId === d.id ? (
                                 <div className="flex items-center text-xs text-ai-600">
                                    <RefreshCw size={12} className="mr-2 animate-spin" /> Analyzing...
                                 </div>
                              ) : (
                                 <button 
                                   onClick={() => handleAiScan(d.id)}
                                   className={`flex items-center px-2 py-1 rounded text-xs font-medium border transition-all hover:scale-105
                                     ${d.aiSuggestion === 'Likely Valid' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}
                                   `}
                                 >
                                    <Brain size={12} className="mr-1.5" />
                                    {d.aiSuggestion}
                                 </button>
                              )}
                           </td>
                           <td className="px-6 py-4 text-right">
                              {d.status === 'Pending Review' ? (
                                <Button size="sm" variant="outline" className="text-xs" onClick={() => setSelectedDispute(d)}>Review</Button>
                              ) : (
                                <span className="text-xs text-green-600 flex items-center justify-end"><CheckCircle size={12} className="mr-1" /> Done</span>
                              )}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* --- Analytics / Backup Column --- */}
         <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary-900 to-primary-800 text-white rounded-xl p-6 shadow-lg relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Brain size={100} /></div>
               <h3 className="text-lg font-bold mb-1">System Health</h3>
               <p className="text-primary-200 text-sm mb-6">AI Quality Score: 98/100</p>
               
               <div className="space-y-4">
                  <div>
                     <div className="flex justify-between text-xs mb-1">
                        <span>Uptime</span>
                        <span>99.9%</span>
                     </div>
                     <div className="w-full bg-white/10 rounded-full h-1.5">
                        <div className="bg-green-400 h-1.5 rounded-full w-[99%] shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                     </div>
                  </div>
                  <div>
                     <div className="flex justify-between text-xs mb-1">
                        <span>Secure Transactions</span>
                        <span>14k</span>
                     </div>
                     <div className="w-full bg-white/10 rounded-full h-1.5">
                        <div className="bg-blue-400 h-1.5 rounded-full w-[85%]"></div>
                     </div>
                  </div>
               </div>
               
               <button 
                 onClick={() => showToast('Full Analytics Dashboard coming in v2.0')}
                 className="mt-6 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
               >
                  View Full Analytics
               </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
               <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg"><Lock size={20} /></div>
                  <div>
                     <h3 className="font-bold text-gray-900">Encrypted Backup</h3>
                     <p className="text-xs text-gray-500">Last backup: 2 hours ago</p>
                  </div>
               </div>
               <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4">
                  <span className="text-xs font-mono text-gray-600">AES-256-GCM</span>
                  <span className="text-xs font-bold text-green-600 flex items-center"><Check size={10} className="mr-1"/> Secure</span>
               </div>
               <Button 
                 variant="outline" 
                 fullWidth 
                 className="text-sm flex items-center justify-center"
                 onClick={handleDownloadBackup}
                 disabled={isDownloading}
               >
                 {isDownloading ? (
                   <> <RefreshCw size={14} className="mr-2 animate-spin" /> Processing... </>
                 ) : (
                   <> <Download size={14} className="mr-2" /> Download Backup </>
                 )}
               </Button>
            </div>
         </div>
      </div>

      {/* --- Section 4: Audit Trail --- */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
         <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg">Security Audit Log</h3>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-sm">
               <thead className="bg-gray-50/50 text-gray-500">
                  <tr>
                     <th className="px-6 py-3 text-left font-medium">Action</th>
                     <th className="px-6 py-3 text-left font-medium">Performed By</th>
                     <th className="px-6 py-3 text-left font-medium">Target</th>
                     <th className="px-6 py-3 text-left font-medium">Date/Time</th>
                     <th className="px-6 py-3 text-left font-medium">Result</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {MOCK_AUDIT_LOGS.map((log) => (
                     <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-medium text-gray-900">{log.action}</td>
                        <td className="px-6 py-3 text-gray-600">{log.performedBy}</td>
                        <td className="px-6 py-3 text-gray-600">{log.target}</td>
                        <td className="px-6 py-3 text-gray-500 font-mono text-xs">{log.date}</td>
                        <td className="px-6 py-3">
                           <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border
                             ${log.result === 'Secure' ? 'bg-green-50 text-green-700 border-green-100' : 
                               log.result === 'Failed Attempt' ? 'bg-red-50 text-red-700 border-red-100' : 
                               'bg-orange-50 text-orange-700 border-orange-100'}
                           `}>
                             {log.result === 'Secure' && <Lock size={10} className="mr-1" />}
                             {log.result}
                           </span>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* --- Modals --- */}
      
      {/* 1. Hospital Detail Modal */}
      {selectedHospital && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
            <div className="relative h-24 bg-gradient-to-r from-primary-600 to-tech-600">
               <button onClick={() => setSelectedHospital(null)} className="absolute top-4 right-4 p-1 bg-black/20 rounded-full text-white hover:bg-black/40"><X size={20}/></button>
            </div>
            <div className="px-6 pb-6">
               <div className="-mt-12 mb-4">
                  <div className="h-24 w-24 rounded-2xl bg-white p-1 shadow-lg">
                     <div className="h-full w-full bg-gray-100 rounded-xl flex items-center justify-center text-3xl font-bold text-gray-400">
                        {selectedHospital.name.charAt(0)}
                     </div>
                  </div>
               </div>
               
               <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedHospital.name}</h3>
               <div className="flex items-center text-gray-500 text-sm mb-4">
                  <MapPin size={14} className="mr-1" /> {selectedHospital.location}
               </div>

               <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                     <span className="text-sm text-gray-600 flex items-center"><FileText size={16} className="mr-2"/> License ID</span>
                     <span className="text-sm font-mono font-bold">{selectedHospital.licenseId}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                     <span className="text-sm text-gray-600 flex items-center"><Mail size={16} className="mr-2"/> Email</span>
                     <span className="text-sm font-medium text-primary-600">contact@{selectedHospital.name.replace(/\s+/g, '').toLowerCase()}.com</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                     <span className="text-sm text-gray-600 flex items-center"><Phone size={16} className="mr-2"/> Phone</span>
                     <span className="text-sm font-medium">+1 (555) 000-0000</span>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-3">
                  <Button 
                     variant="danger" 
                     disabled={selectedHospital.status === 'Suspended'}
                     onClick={() => updateHospitalStatus(selectedHospital.id, 'Suspended')}
                  >
                     Suspend
                  </Button>
                  <Button 
                     variant="primary" 
                     disabled={selectedHospital.status === 'Verified'}
                     onClick={() => updateHospitalStatus(selectedHospital.id, 'Verified')}
                  >
                     Verify Now
                  </Button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Dispute Review Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full animate-fade-in-up">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center"><AlertTriangle size={20} className="text-red-500 mr-2" /> Review Dispute</h3>
                <button onClick={() => setSelectedDispute(null)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
             </div>
             <div className="p-6">
                <div className="space-y-4 mb-6">
                   <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Record Title</label>
                      <p className="font-medium text-gray-900">{selectedDispute.recordTitle}</p>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="text-xs font-bold text-gray-500 uppercase">Patient</label>
                         <p className="text-sm text-gray-900">{selectedDispute.patientName}</p>
                      </div>
                      <div>
                         <label className="text-xs font-bold text-gray-500 uppercase">Hospital</label>
                         <p className="text-sm text-gray-900">{selectedDispute.hospitalName}</p>
                      </div>
                   </div>
                   <div className="bg-ai-50 p-4 rounded-xl border border-ai-100">
                      <div className="flex items-center text-ai-700 font-bold text-sm mb-2">
                         <Brain size={16} className="mr-2" /> AI Suggestion
                      </div>
                      <p className="text-sm text-gray-700">
                         Analysis of blockchain timestamps indicates the record was uploaded correctly. 
                         <br/>
                         <strong>Recommendation:</strong> {selectedDispute.aiSuggestion}
                      </p>
                   </div>
                </div>

                <div className="flex gap-3">
                   <Button variant="outline" fullWidth onClick={() => resolveDispute(selectedDispute.id, 'Dismissed')}>
                      Dismiss Dispute
                   </Button>
                   <Button variant="primary" fullWidth onClick={() => resolveDispute(selectedDispute.id, 'Valid')}>
                      Accept Claim
                   </Button>
                </div>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};
    