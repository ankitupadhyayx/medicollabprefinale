import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Download, 
  Eye,
  Loader,
  Building2,
  Calendar,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Info,
  ChevronDown,
  Filter,
  Search
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface PendingRecord {
  _id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  recordType: string;
  hospital: {
    _id: string;
    name: string;
    email: string;
    hospitalName?: string;
  };
  files: Array<{
    filename: string;
    originalName: string;
    url: string;
    size: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export const PatientApprovals: React.FC = () => {
  const [records, setRecords] = useState<PendingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<PendingRecord | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    fetchRecords();
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
      setRecords(data.records);
    } catch (error) {
      console.error('❌ Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (recordId: string) => {
    setProcessing(recordId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/records/${recordId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to approve record');

      const data = await response.json();
      console.log('✅ Record approved:', data);

      // Update local state
      setRecords(records.map(r => 
        r._id === recordId ? { ...r, status: 'APPROVED' as const } : r
      ));

      setSelectedRecord(null);
      setActionType(null);
    } catch (error) {
      console.error('❌ Error approving record:', error);
      alert('Failed to approve record');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (recordId: string) => {
    setProcessing(recordId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/records/${recordId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to reject record');

      const data = await response.json();
      console.log('✅ Record rejected:', data);

      // Update local state
      setRecords(records.map(r => 
        r._id === recordId ? { ...r, status: 'REJECTED' as const } : r
      ));

      setSelectedRecord(null);
      setActionType(null);
    } catch (error) {
      console.error('❌ Error rejecting record:', error);
      alert('Failed to reject record');
    } finally {
      setProcessing(null);
    }
  };

  const handleDownload = async (fileUrl: string, filename: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000${fileUrl}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('❌ Download error:', error);
      alert('Failed to download file');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            APPROVED
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            REJECTED
          </span>
        );
      case 'PENDING':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            PENDING
          </span>
        );
    }
  };

  const filteredRecords = records.filter(record => {
    if (filterTab === 'all') return true;
    if (filterTab === 'pending') return record.status === 'PENDING';
    if (filterTab === 'approved') return record.status === 'APPROVED';
    if (filterTab === 'rejected') return record.status === 'REJECTED';
    return true;
  });

  const pendingCount = records.filter(r => r.status === 'PENDING').length;
  const approvedCount = records.filter(r => r.status === 'APPROVED').length;
  const rejectedCount = records.filter(r => r.status === 'REJECTED').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
          <p className="text-sm text-gray-600 mt-1">Review uploads and requests requiring your action</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <span className="text-sm font-semibold text-yellow-900">{pendingCount} Actions Required</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterTab('pending')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              filterTab === 'pending'
                ? 'bg-yellow-100 text-yellow-900 border border-yellow-200'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilterTab('approved')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              filterTab === 'approved'
                ? 'bg-green-100 text-green-900 border border-green-200'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setFilterTab('rejected')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              filterTab === 'rejected'
                ? 'bg-red-100 text-red-900 border border-red-200'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Rejected ({rejectedCount})
          </button>
          <button
            onClick={() => setFilterTab('all')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              filterTab === 'all'
                ? 'bg-primary-100 text-primary-900 border border-primary-200'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            All ({records.length})
          </button>
        </div>
      </div>

      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-600">
            {filterTab === 'pending' 
              ? 'You have no pending approvals.' 
              : `No ${filterTab} records found.`}
          </p>
          {filterTab !== 'all' && (
            <Button onClick={() => setFilterTab('all')} variant="outline" className="mt-4">
              View All Records
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRecords.map((record) => (
            <div
              key={record._id}
              className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-all ${
                record.status === 'PENDING' 
                  ? 'border-yellow-200 bg-yellow-50/30' 
                  : 'border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 rounded-lg ${
                    record.status === 'PENDING' ? 'bg-yellow-100' : 'bg-gray-100'
                  }`}>
                    <FileText className={`w-6 h-6 ${
                      record.status === 'PENDING' ? 'text-yellow-600' : 'text-gray-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
                      {getStatusBadge(record.status)}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{record.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {record.hospital.hospitalName || record.hospital.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(record.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {record.files.length} file(s)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Files */}
              {record.files.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
                  <p className="text-xs font-medium text-gray-700 mb-2">Attached Files</p>
                  {record.files.map((file, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText className="w-4 h-4 text-primary-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 truncate">{file.originalName}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.open(`http://localhost:5000${file.url}`, '_blank')}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(file.url, file.originalName)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              {record.status === 'PENDING' && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => {
                      setSelectedRecord(record);
                      setActionType('approve');
                    }}
                    disabled={processing === record._id}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedRecord(record);
                      setActionType('reject');
                    }}
                    disabled={processing === record._id}
                    variant="outline"
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {selectedRecord && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className={`p-6 border-b ${
              actionType === 'approve' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
            }`}>
              <div className="flex items-center gap-3">
                {actionType === 'approve' ? (
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                ) : (
                  <div className="p-2 bg-red-100 rounded-full">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {actionType === 'approve' ? 'Approve Record?' : 'Reject Record?'}
                  </h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-gray-900 mb-1">{selectedRecord.title}</p>
                <p className="text-xs text-gray-600">{selectedRecord.description}</p>
              </div>

              {actionType === 'approve' ? (
                <div className="flex items-start gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg mb-4">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>This record will be added to your medical history and stored on the blockchain.</p>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 p-3 rounded-lg mb-4">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>This record will be marked as rejected and removed from pending approvals.</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedRecord(null);
                  setActionType(null);
                }}
                disabled={processing === selectedRecord._id}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (actionType === 'approve') {
                    handleApprove(selectedRecord._id);
                  } else {
                    handleReject(selectedRecord._id);
                  }
                }}
                disabled={processing === selectedRecord._id}
                className={`flex-1 ${
                  actionType === 'approve' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {processing === selectedRecord._id ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
