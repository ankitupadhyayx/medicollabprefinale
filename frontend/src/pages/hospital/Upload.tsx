import React, { useState } from 'react';
import { 
  UploadCloud, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Loader,
  User,
  FileText,
  Calendar,
  Shield
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const HospitalUpload: React.FC = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const [patientEmail, setPatientEmail] = useState('');
  const [recordTitle, setRecordTitle] = useState('');
  const [recordDescription, setRecordDescription] = useState('');
  const [recordType, setRecordType] = useState('Lab Report');
  const [files, setFiles] = useState<File[]>([]);

  const recordTypes = [
    'Lab Report',
    'X-Ray',
    'MRI Scan',
    'CT Scan',
    'Blood Test',
    'Prescription',
    'Discharge Summary',
    'Other'
  ];

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
      formData.append('recordType', recordType);
      
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
    } catch (error: any) {
      console.error('❌ Upload error:', error);
      setUploadError(error.message || 'Failed to upload record');
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFiles([]);
    setPatientEmail('');
    setRecordTitle('');
    setRecordDescription('');
    setRecordType('Lab Report');
    setUploadSuccess(false);
    setUploadError(null);
  };

  if (uploadSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Record Uploaded Successfully!</h2>
          <p className="text-gray-600 mb-2">
            Medical record has been sent to <span className="font-semibold text-gray-900">{patientEmail}</span>
          </p>
          {files.length > 0 && (
            <p className="text-sm text-gray-600 mb-6">
              📎 {files.length} file(s) attached and uploaded
            </p>
          )}
          
          <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg border border-blue-100 text-blue-800 mb-8 text-sm">
            <Shield size={18} className="mr-2" />
            Status: Pending Patient Approval
          </div>

          <div className="flex gap-3 justify-center">
            <Button onClick={resetForm}>
              Upload Another Record
            </Button>
            <Button variant="outline" onClick={() => navigate('/hospital/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Medical Record</h1>
        <p className="text-gray-600">Securely upload and send patient medical records to blockchain</p>
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Upload Failed</p>
            <p className="text-sm text-red-700">{uploadError}</p>
          </div>
        </div>
      )}

      {/* Upload Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 space-y-6">
          
          {/* Patient Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-600" />
              Patient Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Email Address <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  value={patientEmail} 
                  onChange={(e) => setPatientEmail(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
                  placeholder="patient@example.com" 
                  disabled={isUploading}
                />
                <p className="text-xs text-gray-500 mt-1">Enter the registered email of the patient</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100"></div>

          {/* Record Details Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-600" />
              Record Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Record Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={recordType}
                  onChange={(e) => setRecordType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  disabled={isUploading}
                >
                  {recordTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Record Title <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={recordTitle} 
                  onChange={(e) => setRecordTitle(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                  placeholder="e.g., Complete Blood Count Analysis" 
                  disabled={isUploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea 
                  value={recordDescription} 
                  onChange={(e) => setRecordDescription(e.target.value)} 
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none" 
                  placeholder="Provide detailed information about this medical record..." 
                  disabled={isUploading}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100"></div>

          {/* File Upload Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-primary-600" />
              Attach Files (Optional)
            </h3>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-500 transition-colors bg-gray-50">
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
                <UploadCloud className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">PDF, JPG, PNG, DOC up to 10MB each</p>
              </label>
            </div>
            
            {/* File List */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected Files ({files.length})</p>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 bg-primary-50 rounded-lg">
                        <File className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="ml-3 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      disabled={isUploading}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <Shield className="inline w-4 h-4 mr-1" />
              All data is encrypted and secure
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/hospital/dashboard')}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={!patientEmail || !recordTitle || !recordDescription || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-5 h-5 mr-2" />
                    Upload & Send to Patient
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};