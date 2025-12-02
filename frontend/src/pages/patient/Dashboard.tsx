import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Hospital,
  Calendar,
  AlertCircle,
  Filter,
  Search,
  File,
  Loader,
  Eye
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface Record {
  _id: string;
  title: string;
  description: string;
  recordType: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  hospital: {
    _id: string;
    name: string;
    email: string;
    hospitalName?: string;
  };
  files: Array<{
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    url: string;
    uploadedAt: string;
  }>;
  createdAt: string;
  rejectionReason?: string;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  hospitalsVisited: number;
}

export const PatientDashboard: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch records and stats
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
      setStats(data.stats);
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
    }
  };

  const handleApprove = async (recordId: string) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/records/${recordId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'APPROVED' }),
      });

      if (!response.ok) throw new Error('Failed to approve record');

      console.log('✅ Record approved');
      await fetchRecords();
      await fetchStats();
      setSelectedRecord(null);
    } catch (error) {
      console.error('❌ Error approving record:', error);
      alert('Failed to approve record');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRecord || !rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/records/${selectedRecord._id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'REJECTED',
          rejectionReason: rejectionReason.trim()
        }),
      });

      if (!response.ok) throw new Error('Failed to reject record');

      console.log('✅ Record rejected');
      await fetchRecords();
      await fetchStats();
      setSelectedRecord(null);
      setShowRejectModal(false);
      setRejectionReason('');
    } catch (error) {
      console.error('❌ Error rejecting record:', error);
      alert('Failed to reject record');
    } finally {
      setActionLoading(false);
    }
  };

  const downloadFile = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = `http://localhost:5000${fileUrl}`;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter records
  const filteredRecords = records.filter(record => {
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (record.hospital.hospitalName || record.hospital.name).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED': return <XCircle className="w-4 h-4" />;
      case 'PENDING': return <Clock className="w-4 h-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
              <p className="text-sm text-gray-600 mt-1">Review and manage your health records</p>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Records</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <FileText className="w-8 h-8 text-primary-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Hospitals</p>
                  <p className="text-2xl font-bold text-primary-600">{stats.hospitalsVisited}</p>
                </div>
                <Hospital className="w-8 h-8 text-primary-600" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('PENDING')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'PENDING'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilterStatus('APPROVED')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'APPROVED'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilterStatus('REJECTED')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'REJECTED'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rejected
              </button>
            </div>
          </div>
        </div>

        {/* Records List */}
        <div className="space-y-4">
          {filteredRecords.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Records Found</h3>
              <p className="text-gray-600">
                {filterStatus === 'all' 
                  ? "You don't have any medical records yet."
                  : `No ${filterStatus.toLowerCase()} records found.`}
              </p>
            </div>
          ) : (
            filteredRecords.map((record) => (
              <div
                key={record._id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(record.status)}`}>
                        {getStatusIcon(record.status)}
                        {record.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{record.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Hospital className="w-4 h-4" />
                        <span>{record.hospital.hospitalName || record.hospital.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                      </div>
                      {record.files.length > 0 && (
                        <div className="flex items-center gap-2">
                          <File className="w-4 h-4" />
                          <span>{record.files.length} file(s)</span>
                        </div>
                      )}
                    </div>

                    {record.status === 'REJECTED' && record.rejectionReason && (
                      <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-900">Rejection Reason:</p>
                          <p className="text-sm text-red-700">{record.rejectionReason}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRecord(record)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>

                {/* Files */}
                {record.files.length > 0 && (
                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Attached Files:</p>
                    <div className="space-y-2">
                      {record.files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <File className="w-5 h-5 text-primary-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{file.originalName}</p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB • {file.mimetype}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadFile(file.url, file.originalName)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* View/Action Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">Record Details</h3>
              <button onClick={() => setSelectedRecord(null)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-2xl font-bold text-gray-900">{selectedRecord.title}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(selectedRecord.status)}`}>
                    {getStatusIcon(selectedRecord.status)}
                    {selectedRecord.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Hospital</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedRecord.hospital.hospitalName || selectedRecord.hospital.name}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(selectedRecord.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-xs text-gray-600 mb-2">Description</p>
                  <p className="text-sm text-gray-900">{selectedRecord.description}</p>
                </div>

                {selectedRecord.files.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Attached Files ({selectedRecord.files.length})</p>
                    <div className="space-y-2">
                      {selectedRecord.files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <File className="w-5 h-5 text-primary-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{file.originalName}</p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadFile(file.url, file.originalName)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {selectedRecord.status === 'PENDING' && (
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <Button
                    fullWidth
                    onClick={() => handleApprove(selectedRecord._id)}
                    disabled={actionLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {actionLoading ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Approve Record
                      </>
                    )}
                  </Button>
                  <Button
                    fullWidth
                    variant="outline"
                    onClick={() => {
                      setShowRejectModal(true);
                    }}
                    disabled={actionLoading}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Reject Record
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRecord && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Reject Record</h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">Are you sure?</p>
                  <p className="text-sm text-red-700">Please provide a reason for rejecting this record.</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="Please explain why you're rejecting this record..."
                />
              </div>

              <div className="flex gap-3">
                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                  }}
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
                <Button
                  fullWidth
                  onClick={handleReject}
                  disabled={!rejectionReason.trim() || actionLoading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {actionLoading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    'Confirm Rejection'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
