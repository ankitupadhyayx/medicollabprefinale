import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  FileText, 
  Download, 
  Eye, 
  Loader,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  Search,
  ChevronDown,
  Activity,
  Heart,
  Droplet,
  Pill,
  Stethoscope
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface TimelineRecord {
  _id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  recordType: string;
  hospital: {
    name: string;
    hospitalName?: string;
  };
  files: Array<{
    filename: string;
    originalName: string;
    url: string;
  }>;
  createdAt: string;
  approvedAt?: string;
}

export const PatientTimeline: React.FC = () => {
  const [records, setRecords] = useState<TimelineRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/records', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch timeline');

      const data = await response.json();
      setRecords(data.records.sort((a: TimelineRecord, b: TimelineRecord) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      console.error('❌ Error fetching timeline:', error);
    } finally {
      setLoading(false);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'REJECTED': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'PENDING': return <Clock className="w-5 h-5 text-yellow-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRecordIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'lab report':
      case 'blood test':
        return <Droplet className="w-5 h-5 text-red-500" />;
      case 'prescription':
        return <Pill className="w-5 h-5 text-blue-500" />;
      case 'checkup':
        return <Stethoscope className="w-5 h-5 text-green-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = new Date(record.createdAt).getFullYear() === selectedYear;
    
    return matchesStatus && matchesSearch && matchesYear;
  });

  // Group by month
  const groupedRecords = filteredRecords.reduce((acc, record) => {
    const monthYear = new Date(record.createdAt).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
    
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(record);
    return acc;
  }, {} as Record<string, TimelineRecord[]>);

  const availableYears = Array.from(
    new Set(records.map(r => new Date(r.createdAt).getFullYear()))
  ).sort((a, b) => b - a);

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
          <h1 className="text-2xl font-bold text-gray-900">Health Timeline</h1>
          <p className="text-sm text-gray-600 mt-1">Your complete medical history</p>
        </div>
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-primary-600" />
          <span className="text-sm font-medium text-gray-700">{records.length} Total Records</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none appearance-none"
            >
              <option value="all">All Status</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>

          {/* Year Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none appearance-none"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Timeline */}
      {Object.keys(groupedRecords).length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Records Found</h3>
          <p className="text-gray-600">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedRecords).map(([monthYear, monthRecords]) => (
            <div key={monthYear}>
              {/* Month Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{monthYear}</h2>
                  <p className="text-sm text-gray-600">{monthRecords.length} record(s)</p>
                </div>
              </div>

              {/* Records */}
              <div className="ml-6 border-l-2 border-gray-200 pl-6 space-y-6">
                {monthRecords.map((record, index) => (
                  <div 
                    key={record._id}
                    className="relative bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute -left-9 top-8 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-md"></div>

                    {/* Record Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          {getRecordIcon(record.recordType)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{record.title}</h3>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(record.status)}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
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
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Files */}
                    {record.files.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <p className="text-xs font-medium text-gray-700 mb-2">Attached Files ({record.files.length})</p>
                        {record.files.map((file, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <FileText className="w-4 h-4 text-primary-600 flex-shrink-0" />
                              <span className="text-sm text-gray-700 truncate">{file.originalName}</span>
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
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
