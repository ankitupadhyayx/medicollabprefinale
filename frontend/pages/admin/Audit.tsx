import React, { useState } from 'react';
import { MOCK_AUDIT_LOGS } from '../../constants';
import { Search, Filter, Shield, AlertTriangle, Lock, FileText, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const AdminAudit: React.FC = () => {
  const [filter, setFilter] = useState('ALL');
  
  const filteredLogs = MOCK_AUDIT_LOGS.filter(l => 
     filter === 'ALL' ||
     (filter === 'SECURE' && l.result === 'Secure') ||
     (filter === 'FAILED' && l.result === 'Failed Attempt') ||
     (filter === 'RESTRICTED' && l.result === 'Restricted Attempt')
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Audit Trail</h1>
          <p className="text-gray-500">Immutable logs of all system actions and access attempts.</p>
        </div>
        <Button variant="outline">
           <Download size={18} className="mr-2" /> Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
         {['ALL', 'SECURE', 'FAILED', 'RESTRICTED'].map((f) => (
            <button 
               key={f}
               onClick={() => setFilter(f)}
               className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === f 
                  ? 'bg-primary-600 text-white shadow-md' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
               }`}
            >
               {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
         ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
         <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-100">
               <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Performed By</th>
                  <th className="px-6 py-4">Target Resource</th>
                  <th className="px-6 py-4">Result</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                     <td className="px-6 py-4 text-sm font-mono text-gray-500">{log.date}</td>
                     <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{log.action}</span>
                     </td>
                     <td className="px-6 py-4 text-sm text-gray-600">
                        {log.performedBy}
                     </td>
                     <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                        {log.target}
                     </td>
                     <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${
                           log.result === 'Secure' ? 'bg-green-50 text-green-700 border-green-100' : 
                           log.result === 'Failed Attempt' ? 'bg-red-50 text-red-700 border-red-100' : 
                           'bg-orange-50 text-orange-700 border-orange-100'
                        }`}>
                           {log.result === 'Secure' ? <Lock size={10} className="mr-1" /> : <AlertTriangle size={10} className="mr-1" />}
                           {log.result}
                        </span>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};