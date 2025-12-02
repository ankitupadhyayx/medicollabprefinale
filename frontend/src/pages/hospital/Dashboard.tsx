import React, { useState, useEffect } from 'react';
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
  Eye,
  Download,
  Loader,
  Filter,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface Record {
  _id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  patient: {
    name: string;
    email: string;
  };
  files: Array<{
    filename: string;
    originalName: string;
    size: number;
    url: string;
  }>;
  createdAt: string;
}

interface Stats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

export const HospitalDashboard: React.FC = () => {
  // State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [records, setRecords] = useState<Record[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [patientEmail, setPatientEmail] = useState('');
  const [recordTitle, setRecordTitle] = useState('');
  const [recordDescription, setRecordDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  // Fetch records and stats on mount
  useEffect(() => {
    fetchRecords();
    fetchStats();
  }, []);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/records', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch records');

      const data = await response.json();
      console.log('📊 Records fetched:', data);
      setRecords(data.records);
    } catch (error) {
      console.error('❌ Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/records/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch stats');

      const data = await response.json();
      console.log('📈 Stats fetched:', data);
      setStats(data.stats);
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
    }
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
    
    if (!patientEmail || !recordTitle || !recordDescription) {
      setUploadError('Please fill in all required fields');
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(patientEmail)) {
      setUploadError('Please enter a valid email address');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('title', recordTitle);
      formData.append('description', recordDescription);
      formData.append('patientEmail', patientEmail);
      formData.append('recordType', 'Other');
      
      files.forEach(file => {
        formData.append('files', file);
      });

      const token = localStorage.getItem('token');
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

      console.log('✅ Record created:', data);
      setUploadSuccess(true);
      
      // Refresh records and stats
      await fetchRecords();
      await fetchStats();
    } catch (error: any) {
      console.error('❌ Upload error:', error);
      setUploadError(error.message || 'Failed to upload record');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredRecords = records.filter(record => 
    filterStatus === 'all' || record.status === filterStatus
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          onClick={() => setShowUploadModal(true)}
          className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-primary-600 to-medical-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all group text-left"
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
               <p className="text-primary-100 text-sm mt-1">Add new patient medical records</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => window.location.href = '/#/hospital/reports'}
          className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-tech-600 to-ai-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all group text-left"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Brain size={100} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="p-3 bg-white/20 w-fit rounded-xl mb-4 backdrop-blur-sm">
               <TrendingUp size={24} />
            </div>
            <div>
               <h3 className="text-xl font-bold">Analytics Dashboard</h3>
               <p className="text-tech-100 text-sm mt-1">View trends and insights</p>
            </div>
          </div>
        </button>
      </div>

      {/* Stats Row */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <FileText size={20} />
              </div>
            </div>
            <h4 className="text-3xl font-bold text-gray-900">{stats.total}</h4>
            <p className="text-sm text-gray-500">Total Records</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                <Clock size={20} />
              </div>
            </div>
            <h4 className="text-3xl font-bold text-gray-900">{stats.pending}</h4>
            <p className="text-sm text-gray-500">Pending Approval</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                <CheckCircle size={20} />
              </div>
            </div>
            <h4 className="text-3xl font-bold text-gray-900">{stats.approved}</h4>
            <p className="text-sm text-gray-500">Approved</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                <AlertCircle size={20} />
              </div>
            </div>
            <h4 className="text-3xl font-bold text-gray-900">{stats.rejected}</h4>
            <p className="text-sm text-gray-500">Rejected</p>
          </div>
        </div>
      )}

      {/* Upload History */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Upload History</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('PENDING')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'PENDING'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilterStatus('APPROVED')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'APPROVED'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Approved
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Record Title</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Date Uploaded</th>
                <th className="px-6 py-4">Files</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No records found</p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{record.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{record.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{record.patient.name}</p>
                        <p className="text-xs text-gray-500">{record.patient.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <File size={14} />
                        <span>{record.files.length}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="text-xl font-bold text-gray-900">Upload Medical Record</h3>
                 <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                   <X />
                 </button>
              </div>
              
              <div className="p-6">
                 {!uploadSuccess ? (
                    <div className="space-y-5">
                       {uploadError && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                             <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                             <p className="text-sm text-red-700">{uploadError}</p>
                          </div>
                       )}

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
                               <p className="text-sm text-gray-600">Click to upload files</p>
                               <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG, DOC (Max 10MB each)</p>
                             </label>
                          </div>
                          
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
                             placeholder="Detailed description..." 
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
                       <h3 className="text-xl font-bold text-gray-900">Record Created!</h3>
                       <p className="text-gray-500 mt-2 mb-6 text-sm">
                          Sent to <span className="font-semibold">{patientEmail}</span>
                       </p>
                       {files.length > 0 && (
                          <p className="text-sm text-gray-600 mb-4">
                             📎 {files.length} file(s) uploaded
                          </p>
                       )}
                       <Button onClick={resetUpload} variant="outline">Upload Another</Button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};