
import React, { useState } from 'react';
import { 
  UploadCloud, 
  File, 
  X, 
  CheckCircle, 
  Shield, 
  Users, 
  Activity, 
  AlertCircle, 
  Sparkles, 
  Brain, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Search,
  Eye
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { HOSPITAL_APPOINTMENT_REQUESTS, MOCK_PATIENTS } from '../../constants';
import { Appointment } from '../../types';

export const HospitalDashboard: React.FC = () => {
  // State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [appointmentRequests, setAppointmentRequests] = useState<Appointment[]>(HOSPITAL_APPOINTMENT_REQUESTS);

  // Upload State
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [recordTitle, setRecordTitle] = useState('');

  // Handlers for Appointment Requests
  const handleAppointmentAction = (id: string, action: 'approve' | 'reject') => {
    setAppointmentRequests(prev => prev.filter(req => req.id !== id));
    // In real app, API call here
  };

  // Handlers for Upload
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => { setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };
  const handleUpload = () => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const next = prev + Math.random() * 20;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => { setIsUploading(false); setUploadSuccess(true); }, 500);
          return 100;
        }
        return next;
      });
    }, 200);
  };
  const resetUpload = () => {
    setFile(null); setPatientId(''); setRecordTitle(''); setUploadSuccess(false); setUploadProgress(0); setShowUploadModal(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* --- Quick AI Actions --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          onClick={() => setShowUploadModal(true)}
          className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-primary-600 to-medical-600 text-white shadow-lg shadow-primary-500/20 hover:shadow-xl hover:scale-[1.02] transition-all group text-left"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <UploadCloud size={100} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="p-3 bg-white/20 w-fit rounded-xl mb-4 backdrop-blur-sm">
               <UploadCloud size={24} />
            </div>
            <div>
               <h3 className="text-xl font-bold">Upload Document</h3>
               <p className="text-primary-100 text-sm mt-1">Securely add patient records to blockchain</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => setShowAIModal(true)}
          className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-tech-600 to-ai-500 text-white shadow-lg shadow-tech-500/20 hover:shadow-xl hover:scale-[1.02] transition-all group text-left"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Brain size={100} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="p-3 bg-white/20 w-fit rounded-xl mb-4 backdrop-blur-sm">
               <Sparkles size={24} />
            </div>
            <div>
               <h3 className="text-xl font-bold">AI Insights on Patients</h3>
               <p className="text-tech-100 text-sm mt-1">Analyze trends & detect anomalies</p>
            </div>
          </div>
        </button>
      </div>

      {/* --- Stats Row --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
               <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users size={20} /></div>
               <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+12%</span>
            </div>
            <h4 className="text-3xl font-bold text-gray-900">1,240</h4>
            <p className="text-sm text-gray-500">Active Patients</p>
         </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-50 rounded-bl-full -mr-8 -mt-8"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
               <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><Activity size={20} /></div>
               <div className="flex items-center text-[10px] font-bold text-ai-600 bg-ai-50 px-2 py-1 rounded border border-ai-100">
                  <Sparkles size={10} className="mr-1" /> AI Assisted
               </div>
            </div>
            <h4 className="text-3xl font-bold text-gray-900">45</h4>
            <p className="text-sm text-gray-500">Need Follow-up</p>
         </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
               <div className="p-2 bg-red-50 text-red-600 rounded-lg"><AlertCircle size={20} /></div>
            </div>
            <h4 className="text-3xl font-bold text-gray-900">3</h4>
            <p className="text-sm text-gray-500">Disputed Records</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Left Column: Patient List --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 text-lg">Recent Patients</h3>
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                   <input type="text" placeholder="Search patients..." className="pl-9 pr-4 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-primary-300 rounded-lg text-sm outline-none transition-all w-48 md:w-64" />
                </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full">
                   <thead className="bg-gray-50/50">
                      <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                         <th className="px-6 py-4">Patient Name</th>
                         <th className="px-6 py-4">Date of Birth / Age</th>
                         <th className="px-6 py-4">Last Visit</th>
                         <th className="px-6 py-4">Status</th>
                         <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {MOCK_PATIENTS.map((p) => (
                         <tr key={p.id} className="hover:bg-gray-50/80 transition-colors group">
                            <td className="px-6 py-4">
                               <div className="flex items-center">
                                  <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs mr-3">
                                     {p.name.charAt(0)}
                                  </div>
                                  <span className="font-medium text-gray-900">{p.name}</span>
                                  {p.aiFlag && (
                                     <span className="ml-2 text-yellow-500" title="AI Attention Needed"><AlertCircle size={14} /></span>
                                  )}
                               </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{p.age} yrs ({p.gender})</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{p.lastVisit}</td>
                            <td className="px-6 py-4">
                               <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                  p.status === 'Critical' ? 'bg-red-100 text-red-700' : 
                                  p.status === 'Recovered' ? 'bg-green-100 text-green-700' : 
                                  'bg-blue-100 text-blue-700'
                               }`}>
                                  {p.status}
                               </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                               <button className="text-gray-400 hover:text-primary-600 transition-colors">
                                  <Eye size={18} />
                               </button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
             <div className="p-4 border-t border-gray-100 text-center">
                <button className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center justify-center mx-auto">
                   View All Patients <ChevronRight size={16} className="ml-1" />
                </button>
             </div>
          </div>
        </div>

        {/* --- Right Column: Appointment Requests --- */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="font-bold text-gray-900 text-lg">Requests</h3>
                 <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">{appointmentRequests.length} New</span>
              </div>

              {appointmentRequests.length === 0 ? (
                 <div className="text-center py-10 text-gray-400">
                    <Calendar size={48} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No pending requests.</p>
                 </div>
              ) : (
                 <div className="space-y-4">
                    {appointmentRequests.map((req) => (
                       <div key={req.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-primary-200 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                             <h4 className="font-bold text-gray-900 text-sm">Patient Appt Request</h4>
                             <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded">New</span>
                          </div>
                          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{req.reason}</p>
                          <div className="flex items-center text-xs text-gray-500 mb-4 space-x-3">
                             <span className="flex items-center"><Calendar size={12} className="mr-1"/> {req.date}</span>
                             <span className="flex items-center"><Clock size={12} className="mr-1"/> {req.time}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                             <button 
                               onClick={() => handleAppointmentAction(req.id, 'reject')}
                               className="py-1.5 text-xs font-bold text-red-600 bg-white border border-gray-200 rounded-lg hover:bg-red-50 transition-colors"
                             >
                                Decline
                             </button>
                             <button 
                               onClick={() => handleAppointmentAction(req.id, 'approve')}
                               className="py-1.5 text-xs font-bold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                             >
                                Approve
                             </button>
                          </div>
                       </div>
                    ))}
                 </div>
              )}
           </div>
        </div>
      </div>

      {/* --- MODAL: Upload Document --- */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="text-xl font-bold text-gray-900">Upload Medical Record</h3>
                 <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
              </div>
              
              <div className="p-6">
                 {!uploadSuccess ? (
                    <div className="space-y-5">
                       {/* File Drop Zone */}
                       <div 
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => document.getElementById('doc-upload')?.click()}
                          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:bg-gray-50'}`}
                       >
                          <input id="doc-upload" type="file" className="hidden" onChange={handleFileChange} />
                          {!file ? (
                             <>
                                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                   <UploadCloud />
                                </div>
                                <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG (Max 10MB)</p>
                             </>
                          ) : (
                             <div className="flex items-center justify-center space-x-2">
                                <File className="text-primary-600" />
                                <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{file.name}</span>
                             </div>
                          )}
                       </div>

                       <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID / Email</label>
                          <input type="text" value={patientId} onChange={(e) => setPatientId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="P-12345" />
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Record Title</label>
                          <input type="text" value={recordTitle} onChange={(e) => setRecordTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Annual Report" />
                       </div>

                       {isUploading && (
                          <div className="space-y-1">
                             <div className="flex justify-between text-xs font-medium text-gray-500">
                                <span>Encrypting & Uploading...</span>
                                <span>{Math.round(uploadProgress)}%</span>
                             </div>
                             <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                <div className="bg-primary-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                             </div>
                          </div>
                       )}

                       <Button fullWidth onClick={handleUpload} disabled={!file || !patientId || !recordTitle || isUploading}>
                          {isUploading ? 'Processing...' : 'Secure Upload'}
                       </Button>
                    </div>
                 ) : (
                    <div className="text-center py-8">
                       <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                          <CheckCircle size={32} />
                       </div>
                       <h3 className="text-xl font-bold text-gray-900">Upload Successful</h3>
                       <p className="text-gray-500 mt-2 mb-6 text-sm">Record encrypted and stored on blockchain.</p>
                       <div className="flex items-center justify-center p-3 bg-blue-50 rounded-lg border border-blue-100 text-blue-800 mb-6 text-xs">
                          <Shield size={14} className="mr-2" />
                          Hash: 0x71C...9A23
                       </div>
                       <Button onClick={resetUpload} variant="outline">Upload Another</Button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* --- MODAL: AI Insights --- */}
      {showAIModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up relative">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-tech-400 to-ai-500"></div>
               <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-tr from-tech-500 to-ai-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-tech-500/30">
                     <Brain className="text-white animate-pulse" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">AI Patient Analysis</h3>
                  <p className="text-gray-500 mb-6">Scanning 1,240 records for anomalies and trends...</p>
                  
                  <div className="space-y-3">
                     <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-tech-500 w-2/3 animate-[width_1.5s_ease-in-out_infinite]"></div>
                     </div>
                     <p className="text-xs text-tech-600 font-bold">Processing Natural Language Data...</p>
                  </div>

                  <div className="mt-8">
                     <Button variant="outline" fullWidth onClick={() => setShowAIModal(false)}>Close Demo</Button>
                  </div>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};
