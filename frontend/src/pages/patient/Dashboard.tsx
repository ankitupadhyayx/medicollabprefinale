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
  Eye,
  TrendingUp,
  Activity,
  Heart,
  Shield,
  ChevronRight,
  Bell,
  Settings,
  User,
  Home,
  BarChart3,
  Plus,
  ExternalLink,
  Sparkles
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

  const userName = JSON.parse(localStorage.getItem('user') || '{}').name || 'Patient';

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
      const response = await fetch(`http://localhost:5000/api/records/${recordId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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
      const response = await fetch(`http://localhost:5000/api/records/${selectedRecord._id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
            <span className="text-xs font-semibold text-green-700">APPROVED</span>
          </div>
        );
      case 'REJECTED':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-red-50 to-rose-50 border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            <span className="text-xs font-semibold text-red-700">REJECTED</span>
          </div>
        );
      case 'PENDING':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 animate-pulse">
            <Clock className="w-3.5 h-3.5 text-yellow-600" />
            <span className="text-xs font-semibold text-yellow-700">PENDING</span>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-medical-50 to-tech-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-medical-50 to-tech-50">
      {/* Enhanced Header with Gradient */}
      <div className="bg-gradient-to-r from-primary-600 via-medical-600 to-tech-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                  Welcome back, {userName}! 
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </h1>
                <p className="text-primary-100 mt-1">Manage your health records securely on blockchain</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-white" />
                {stats && stats.pending > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                    {stats.pending}
                  </span>
                )}
              </button>
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-white" />
              </button>
              <Button 
                variant="outline" 
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/';
                }}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-lg"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Stats Cards with Animations */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Total Records */}
            <div className="group bg-gradient-to-br from-white to-primary-50 rounded-2xl p-6 shadow-lg border border-primary-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-primary-400 group-hover:text-primary-600 transition-colors" />
              </div>
              <p className="text-sm text-gray-600 font-medium mb-1">Total Records</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-medical-600 bg-clip-text text-transparent">
                {stats.total}
              </p>
            </div>

            {/* Pending */}
            <div className="group bg-gradient-to-br from-white to-yellow-50 rounded-2xl p-6 shadow-lg border border-yellow-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="animate-pulse">
                  <Activity className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
              <p className="text-sm text-gray-600 font-medium mb-1">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              {stats.pending > 0 && (
                <p className="text-xs text-yellow-600 mt-2 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Action required
                </p>
              )}
            </div>

            {/* Approved */}
            <div className="group bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <Shield className="w-5 h-5 text-green-400 group-hover:text-green-600 transition-colors" />
              </div>
              <p className="text-sm text-gray-600 font-medium mb-1">Approved</p>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              <p className="text-xs text-green-600 mt-2 font-medium">Stored on blockchain</p>
            </div>

            {/* Rejected */}
            <div className="group bg-gradient-to-br from-white to-red-50 rounded-2xl p-6 shadow-lg border border-red-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600 font-medium mb-1">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            </div>

            {/* Hospitals */}
            <div className="group bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <Hospital className="w-6 h-6 text-white" />
                </div>
                <Heart className="w-5 h-5 text-purple-400 group-hover:text-purple-600 transition-colors" />
              </div>
              <p className="text-sm text-gray-600 font-medium mb-1">Hospitals</p>
              <p className="text-3xl font-bold text-purple-600">{stats.hospitalsVisited}</p>
              <p className="text-xs text-purple-600 mt-2 font-medium">Healthcare partners</p>
            </div>
          </div>
        )}

        {/* Enhanced Search & Filters */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary-600 transition-colors" />
              <input
                type="text"
                placeholder="Search by title, description, or hospital..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all bg-white/50 backdrop-blur-sm"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap lg:flex-nowrap">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  filterStatus === 'all'
                    ? 'bg-gradient-to-r from-primary-600 to-medical-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                }`}
              >
                All ({records.length})
              </button>
              <button
                onClick={() => setFilterStatus('PENDING')}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  filterStatus === 'PENDING'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                }`}
              >
                Pending ({stats?.pending || 0})
              </button>
              <button
                onClick={() => setFilterStatus('APPROVED')}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  filterStatus === 'APPROVED'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                }`}
              >
                Approved ({stats?.approved || 0})
              </button>
              <button
                onClick={() => setFilterStatus('REJECTED')}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  filterStatus === 'REJECTED'
                    ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                }`}
              >
                Rejected ({stats?.rejected || 0})
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Records List */}
        <div className="space-y-5">
          {filteredRecords.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-16 text-center shadow-xl border border-white/50">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-medical-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-12 h-12 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Records Found</h3>
                <p className="text-gray-600 mb-6">
                  {filterStatus === 'all' 
                    ? "You don't have any medical records yet. They will appear here once uploaded by hospitals."
                    : `No ${filterStatus.toLowerCase()} records found. Try adjusting your filters.`}
                </p>
                <Button variant="outline" onClick={() => setFilterStatus('all')}>
                  View All Records
                </Button>
              </div>
            </div>
          ) : (
            filteredRecords.map((record, index) => (
              <div
                key={record._id}
                className={`group bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border-2 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] ${
                  record.status === 'PENDING' 
                    ? 'border-yellow-200 hover:border-yellow-400' 
                    : record.status === 'APPROVED'
                    ? 'border-green-200 hover:border-green-400'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icon */}
                    <div className={`p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform ${
                      record.status === 'PENDING' 
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-400' 
                        : record.status === 'APPROVED'
                        ? 'bg-gradient-to-br from-green-400 to-emerald-400'
                        : 'bg-gradient-to-br from-red-400 to-rose-400'
                    }`}>
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {record.title}
                        </h3>
                        {getStatusBadge(record.status)}
                      </div>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed">{record.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg">
                          <Hospital className="w-4 h-4" />
                          <span className="font-medium">{record.hospital.hospitalName || record.hospital.name}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">
                            {new Date(record.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        {record.files.length > 0 && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg">
                            <File className="w-4 h-4" />
                            <span className="font-medium">{record.files.length} Attachment(s)</span>
                          </div>
                        )}
                      </div>

                      {/* Rejection Reason Alert */}
                      {record.status === 'REJECTED' && record.rejectionReason && (
                        <div className="mt-4 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start gap-3">
                          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-red-900 mb-1">Rejection Reason:</p>
                            <p className="text-sm text-red-700 leading-relaxed">{record.rejectionReason}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* View Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRecord(record)}
                    className="ml-4 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                {/* Files Preview */}
                {record.files.length > 0 && (
                  <div className="border-t-2 border-gray-100 pt-4 mt-4">
                    <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <File className="w-4 h-4 text-primary-600" />
                      Attached Files ({record.files.length})
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {record.files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl hover:from-primary-50 hover:to-medical-50 transition-all group/file border border-gray-200"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <File className="w-5 h-5 text-primary-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate group-hover/file:text-primary-600 transition-colors">
                                {file.originalName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB • {file.mimetype.split('/')[1].toUpperCase()}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => downloadFile(file.url, file.originalName)}
                            className="ml-3 p-2 hover:bg-primary-100 rounded-lg transition-colors group/download"
                            title="Download"
                          >
                            <Download className="w-5 h-5 text-gray-600 group-hover/download:text-primary-600 transition-colors" />
                          </button>
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

      {/* Enhanced View Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-scaleIn">
            {/* Modal Header */}
            <div className={`p-6 border-b-2 flex justify-between items-center ${
              selectedRecord.status === 'PENDING' 
                ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' 
                : selectedRecord.status === 'APPROVED'
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl shadow-lg ${
                  selectedRecord.status === 'PENDING' 
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-400' 
                    : selectedRecord.status === 'APPROVED'
                    ? 'bg-gradient-to-br from-green-400 to-emerald-400'
                    : 'bg-gradient-to-br from-red-400 to-rose-400'
                }`}>
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Record Details</h3>
                  <p className="text-sm text-gray-600">Complete information and attachments</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedRecord(null)} 
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                <XCircle className="w-7 h-7 text-gray-600 hover:text-gray-900 transition-colors" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Title & Status */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-3xl font-bold text-gray-900">{selectedRecord.title}</h4>
                  {getStatusBadge(selectedRecord.status)}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-primary-50 to-medical-50 rounded-2xl p-5 border border-primary-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Hospital className="w-5 h-5 text-primary-600" />
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Hospital</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedRecord.hospital.hospitalName || selectedRecord.hospital.name}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-5 border border-purple-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Date Created</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(selectedRecord.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">Description</p>
                </div>
                <p className="text-gray-900 leading-relaxed">{selectedRecord.description}</p>
              </div>

              {/* Files */}
              {selectedRecord.files.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <File className="w-5 h-5 text-primary-600" />
                    <p className="text-lg font-bold text-gray-900">Attached Files ({selectedRecord.files.length})</p>
                  </div>
                  <div className="space-y-3">
                    {selectedRecord.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-2xl hover:from-primary-50 hover:to-medical-50 transition-all border border-gray-200 group"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="p-3 bg-white rounded-xl shadow-sm">
                            <File className="w-6 h-6 text-primary-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                              {file.originalName}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Size: {(file.size / 1024 / 1024).toFixed(2)} MB • Type: {file.mimetype}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => window.open(`http://localhost:5000${file.url}`, '_blank')}
                            className="p-2.5 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl transition-colors"
                            title="Open"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => downloadFile(file.url, file.originalName)}
                            className="p-2.5 bg-green-100 hover:bg-green-200 text-green-600 rounded-xl transition-colors"
                            title="Download"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            {selectedRecord.status === 'PENDING' && (
              <div className="p-6 border-t-2 border-gray-200 bg-gray-50">
                <div className="flex gap-4">
                  <Button
                    fullWidth
                    onClick={() => handleApprove(selectedRecord._id)}
                    disabled={actionLoading}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    {actionLoading ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Approve & Store on Blockchain
                      </>
                    )}
                  </Button>
                  <Button
                    fullWidth
                    variant="outline"
                    onClick={() => setShowRejectModal(true)}
                    disabled={actionLoading}
                    className="border-2 border-red-300 text-red-600 hover:bg-red-50 shadow-lg hover:shadow-xl transition-all"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Reject Record
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Reject Modal */}
      {showRejectModal && selectedRecord && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg animate-scaleIn">
            <div className="p-6 bg-gradient-to-r from-red-50 to-rose-50 border-b-2 border-red-200 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl shadow-lg">
                  <XCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Reject Record</h3>
                  <p className="text-sm text-gray-600">Please provide a reason for rejection</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-900">Are you absolutely sure?</p>
                  <p className="text-sm text-red-700 mt-1">This action cannot be undone. The hospital will be notified.</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 outline-none transition-all resize-none"
                  placeholder="Please explain why you're rejecting this record. Be specific and clear..."
                />
                <p className="text-xs text-gray-500 mt-2">Minimum 10 characters required</p>
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
                  className="border-2"
                >
                  Cancel
                </Button>
                <Button
                  fullWidth
                  onClick={handleReject}
                  disabled={rejectionReason.trim().length < 10 || actionLoading}
                  className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg"
                >
                  {actionLoading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 mr-2" />
                      Confirm Rejection
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
