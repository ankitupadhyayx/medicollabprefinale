import React from 'react';
import { ANALYTICS_DATA } from '../../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Download, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const AdminAnalytics: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Analytics</h1>
          <p className="text-gray-500">Platform growth, usage metrics, and performance.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm"><Calendar size={16} className="mr-2" /> Last 30 Days</Button>
           <Button variant="secondary" size="sm"><Download size={16} className="mr-2" /> Export Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
         {/* Chart 1 */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="mb-6">
               <h3 className="text-lg font-bold text-gray-900">Patient Onboarding</h3>
               <p className="text-sm text-gray-500">New registrations per month</p>
            </div>
            <div className="h-72">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ANALYTICS_DATA}>
                     <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} />
                     <YAxis axisLine={false} tickLine={false} />
                     <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                     <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Chart 2 */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="mb-6">
               <h3 className="text-lg font-bold text-gray-900">Records Uploaded vs Approved</h3>
               <p className="text-sm text-gray-500">Transaction volume</p>
            </div>
            <div className="h-72">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ANALYTICS_DATA}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} />
                     <YAxis axisLine={false} tickLine={false} />
                     <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                     <Legend />
                     <Bar dataKey="value" name="Uploaded" fill="#6366f1" radius={[4, 4, 0, 0]} />
                     <Bar dataKey="value" name="Approved" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {[
            { label: 'Avg Response Time', val: '1.2s', delta: '-0.1s', good: true },
            { label: 'AI Accuracy', val: '98.5%', delta: '+1.2%', good: true },
            { label: 'Storage Used', val: '45 TB', delta: '+5 TB', good: false },
            { label: 'Active Sessions', val: '850', delta: '+120', good: true },
         ].map((kpi, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <p className="text-sm text-gray-500 font-medium mb-2">{kpi.label}</p>
               <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold text-gray-900">{kpi.val}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${kpi.good ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                     {kpi.delta}
                  </span>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};