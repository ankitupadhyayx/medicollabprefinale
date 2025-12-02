import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Calendar, 
  Download,
  Loader,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface Analytics {
  totalRecords: number;
  totalPatients: number;
  approvalRate: number;
  averageResponseTime: string;
  monthlyUploads: Array<{ month: string; count: number }>;
  statusBreakdown: {
    approved: number;
    pending: number;
    rejected: number;
  };
  recentActivity: Array<{
    date: string;
    uploads: number;
    approvals: number;
  }>;
}

export const HospitalReports: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7days');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch records and stats
      const [recordsRes, statsRes] = await Promise.all([
        fetch('http://localhost:5000/api/records', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('http://localhost:5000/api/records/stats', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      if (!recordsRes.ok || !statsRes.ok) throw new Error('Failed to fetch data');

      const recordsData = await recordsRes.json();
      const statsData = await statsRes.json();

      // Process analytics
      const records = recordsData.records;
      const uniquePatients = new Set(records.map((r: any) => r.patient._id)).size;
      
      // Calculate approval rate
      const approvalRate = statsData.stats.total > 0
        ? Math.round((statsData.stats.approved / statsData.stats.total) * 100)
        : 0;

      // Group by month
      const monthlyMap = new Map<string, number>();
      records.forEach((record: any) => {
        const month = new Date(record.createdAt).toLocaleString('default', { month: 'short' });
        monthlyMap.set(month, (monthlyMap.get(month) || 0) + 1);
      });

      const monthlyUploads = Array.from(monthlyMap.entries()).map(([month, count]) => ({
        month,
        count,
      }));

      // Recent activity (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const recentActivity = last7Days.map(date => {
        const dayRecords = records.filter((r: any) => 
          r.createdAt.startsWith(date)
        );
        const dayApprovals = dayRecords.filter((r: any) => r.status === 'APPROVED');
        
        return {
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          uploads: dayRecords.length,
          approvals: dayApprovals.length,
        };
      });

      setAnalytics({
        totalRecords: statsData.stats.total,
        totalPatients: uniquePatients,
        approvalRate,
        averageResponseTime: '2.5 days',
        monthlyUploads,
        statusBreakdown: {
          approved: statsData.stats.approved,
          pending: statsData.stats.pending,
          rejected: statsData.stats.rejected,
        },
        recentActivity,
      });
    } catch (error) {
      console.error('❌ Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-sm text-gray-600 mt-1">System generated insights and operational audits</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold mb-1">{analytics.totalRecords}</div>
          <div className="text-primary-100 text-sm">Total Records</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 opacity-80" />
            <Activity className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold mb-1">{analytics.totalPatients}</div>
          <div className="text-green-100 text-sm">Active Patients</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 opacity-80" />
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold mb-1">{analytics.approvalRate}%</div>
          <div className="text-blue-100 text-sm">Approval Rate</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 opacity-80" />
            <PieChart className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold mb-1">{analytics.averageResponseTime}</div>
          <div className="text-purple-100 text-sm">Avg Response</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Uploads Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Monthly Records Uploaded</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {analytics.monthlyUploads.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">{item.month}</span>
                  <span className="font-semibold text-gray-900">{item.count} records</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-medical-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${(item.count / Math.max(...analytics.monthlyUploads.map(m => m.count))) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Status Breakdown</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <div className="text-sm font-medium text-gray-600">Approved</div>
                  <div className="text-2xl font-bold text-gray-900">{analytics.statusBreakdown.approved}</div>
                </div>
              </div>
              <div className="text-lg font-bold text-green-600">
                {Math.round((analytics.statusBreakdown.approved / analytics.totalRecords) * 100)}%
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div>
                  <div className="text-sm font-medium text-gray-600">Pending</div>
                  <div className="text-2xl font-bold text-gray-900">{analytics.statusBreakdown.pending}</div>
                </div>
              </div>
              <div className="text-lg font-bold text-yellow-600">
                {Math.round((analytics.statusBreakdown.pending / analytics.totalRecords) * 100)}%
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8 text-red-600" />
                <div>
                  <div className="text-sm font-medium text-gray-600">Rejected</div>
                  <div className="text-2xl font-bold text-gray-900">{analytics.statusBreakdown.rejected}</div>
                </div>
              </div>
              <div className="text-lg font-bold text-red-600">
                {analytics.totalRecords > 0 
                  ? Math.round((analytics.statusBreakdown.rejected / analytics.totalRecords) * 100)
                  : 0}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Recent Activity (Last 7 Days)</h3>
          <Activity className="w-5 h-5 text-gray-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="pb-3">Date</th>
                <th className="pb-3 text-center">Uploads</th>
                <th className="pb-3 text-center">Approvals</th>
                <th className="pb-3 text-right">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {analytics.recentActivity.map((day, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-4 text-sm font-medium text-gray-900">{day.date}</td>
                  <td className="py-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold">
                      {day.uploads}
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full text-sm font-semibold">
                      {day.approvals}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {day.uploads > 0 ? Math.round((day.approvals / day.uploads) * 100) : 0}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
