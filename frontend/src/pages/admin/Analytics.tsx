import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Building2, Activity, FileText } from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  // Mock data
  const userGrowthData = [
    { month: 'Jan', patients: 120, hospitals: 15 },
    { month: 'Feb', patients: 180, hospitals: 22 },
    { month: 'Mar', patients: 250, hospitals: 28 },
    { month: 'Apr', patients: 320, hospitals: 35 },
    { month: 'May', patients: 400, hospitals: 42 },
    { month: 'Jun', patients: 480, hospitals: 50 },
  ];

  const recordsData = [
    { name: 'Approved', value: 450 },
    { name: 'Pending', value: 120 },
    { name: 'Rejected', value: 30 },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  const stats = [
    { icon: Users, label: 'Total Patients', value: '1,248', change: '+12%', color: 'blue' },
    { icon: Building2, label: 'Total Hospitals', value: '156', change: '+8%', color: 'green' },
    { icon: FileText, label: 'Total Records', value: '5,890', change: '+15%', color: 'purple' },
    { icon: Activity, label: 'Active Sessions', value: '342', change: '+5%', color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">System Analytics</h1>
        <p className="text-gray-600 mt-1">Platform-wide statistics and insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className="text-sm font-semibold text-green-600">{stat.change}</span>
              </div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">User Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="patients" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="hospitals" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Records Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Records Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={recordsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {recordsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Activity */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="patients" fill="#3b82f6" />
              <Bar dataKey="hospitals" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};