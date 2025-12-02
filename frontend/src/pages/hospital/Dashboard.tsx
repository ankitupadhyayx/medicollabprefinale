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
import { recordService } from '../../services/recordService';
import { Loader } from 'lucide-react';

export const HospitalDashboard: React.FC = () => {
  // State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [appointmentRequests, setAppointmentRequests] = useState<Appointment[]>(HOSPITAL_APPOINTMENT_REQUESTS);

  // Upload State
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [patientEmail, setPatientEmail] = useState('');
  const [recordTitle, setRecordTitle] = useState('');
  const [recordDescription, setRecordDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  // Handlers for Appointment Requests
  const handleAppointmentAction = (id: string, action: 'approve' | 'reject') => {
    setAppointmentRequests(prev => prev.filter(req => req.id !== id));
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
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    setUploadError(null);
    
    // Validation
    if (!patientEmail || !recordTitle || !recordDescription) {
      setUploadError('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(patientEmail)) {
      setUploadError('Please enter a valid email address');
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('title', recordTitle);
      formData.append('description', recordDescription);
      formData.append('patientEmail', patientEmail);
      formData.append('recordType', 'Other');
      
      // Append files
      files.forEach((file, index) => {
        formData.append('files', file);
        console.log(`📎 File ${index + 1}:`, file.name, file.size, 'bytes');
      });

      // Log what we're sending
      console.log('📤 Sending data:', {
        title: recordTitle,
        description: recordDescription,
        patientEmail: patientEmail,
        filesCount: files.length
      });

      // Log FormData contents
      for (let pair of formData.entries()) {
        console.log('FormData:', pair[0], typeof pair[1] === 'object' ? pair[1].constructor.name : pair[1]);
      }

      const token = localStorage.getItem('token');
      console.log('🔑 Token:', token ? token.substring(0, 30) + '...' : 'NO TOKEN');

      const response = await fetch('http://localhost:5000/api/records', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      console.log('✅ Success:', data);
      setUploadSuccess(true);
    } catch (error: any) {
      console.error('❌ Error:', error);
      setUploadError(error.message || 'Failed to upload record. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setFiles([]);
    setPatientEmail('');
    setRecordTitle('');
    setRecordDescription('');
    setUploadSuccess(false);
    setUploadError(null);
    setShowUploadModal(false);
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
        {/* ...existing patient list code... */}
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

        {/* ...existing appointment requests code... */}
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

      {/* --- MODAL: Upload Document (UPDATED WITH REAL API) --- */}
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
                       {/* Error Message */}
                       {uploadError && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                             <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                             <p className="text-sm text-red-700">{uploadError}</p>
                          </div>
                       )}

                       {/* File Upload Zone */}
                       <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                             Attach Files (Optional)
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-500 transition-colors">
                             <input
                               type="file"
                               id="file-upload"
                               multiple
                               accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                               onChange={handleFileChange}
                               className="hidden"
                               disabled={isUploading}
                             />
                             <label htmlFor="file-upload" className="cursor-pointer">
                               <UploadCloud className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                               <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                               <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG, DOC (Max 10MB each)</p>
                             </label>
                          </div>
                          
                          {/* File List */}
                          {files.length > 0 && (
                             <div className="mt-3 space-y-2">
                                {files.map((file, index) => (
                                   <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                      <div className="flex items-center gap-2">
                                         <File className="w-4 h-4 text-primary-600" />
                                         <span className="text-sm text-gray-700 truncate max-w-[200px]">{file.name}</span>
                                         <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                                      </div>
                                      <button
                                         onClick={() => removeFile(index)}
                                         className="text-red-500 hover:text-red-700"
                                         disabled={isUploading}
                                      >
                                         <X className="w-4 h-4" />
                                      </button>
                                   </div>
                                ))}
                             </div>
                          )}
                       </div>

                       <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                             Patient Email <span className="text-red-500">*</span>
                          </label>
                          <input 
                             type="email" 
                             value={patientEmail} 
                             onChange={(e) => setPatientEmail(e.target.value)} 
                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                             placeholder="patient@example.com" 
                             disabled={isUploading}
                          />
                       </div>

                       <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                             Record Title <span className="text-red-500">*</span>
                          </label>
                          <input 
                             type="text" 
                             value={recordTitle} 
                             onChange={(e) => setRecordTitle(e.target.value)} 
                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                             placeholder="Blood Test Results" 
                             disabled={isUploading}
                          />
                       </div>

                       <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                             Description <span className="text-red-500">*</span>
                          </label>
                          <textarea 
                             value={recordDescription} 
                             onChange={(e) => setRecordDescription(e.target.value)} 
                             rows={3}
                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                             placeholder="Complete blood count analysis, all parameters within normal range..." 
                             disabled={isUploading}
                          />
                       </div>

                       <Button 
                          fullWidth 
                          onClick={handleUpload} 
                          disabled={!patientEmail || !recordTitle || !recordDescription || isUploading}
                       >
                          {isUploading ? (
                             <>
                                <Loader className="w-5 h-5 mr-2 animate-spin" />
                                Creating Record...
                             </>
                          ) : (
                             'Create & Send to Patient'
                          )}
                       </Button>
                    </div>
                 ) : (
                    <div className="text-center py-8">
                       <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                          <CheckCircle size={32} />
                       </div>
                       <h3 className="text-xl font-bold text-gray-900">Record Created Successfully!</h3>
                       <p className="text-gray-500 mt-2 mb-6 text-sm">
                          Record sent to <span className="font-semibold text-gray-700">{patientEmail}</span> for approval.
                       </p>
                       {files.length > 0 && (
                          <p className="text-sm text-gray-600 mb-4">
                             📎 {files.length} file(s) uploaded successfully
                          </p>
                       )}
                       <div className="flex items-center justify-center p-3 bg-blue-50 rounded-lg border border-blue-100 text-blue-800 mb-6 text-xs">
                          <Shield size={14} className="mr-2" />
                          Status: Pending Patient Approval
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