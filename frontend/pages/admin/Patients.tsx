import React, { useState } from 'react';
import { MOCK_PATIENTS } from '../../constants';
import { Search, User, AlertCircle, Calendar, Activity, Shield } from 'lucide-react';

export const AdminPatients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = MOCK_PATIENTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Database</h1>
          <p className="text-gray-500">Global view of all registered patients on the network.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
              type="text" 
              placeholder="Search patient name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 focus:border-primary-300 rounded-lg text-sm outline-none transition-all shadow-sm" 
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
         <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-100">
               <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Patient Info</th>
                  <th className="px-6 py-4">Demographics</th>
                  <th className="px-6 py-4">Last Activity</th>
                  <th className="px-6 py-4">Health Status</th>
                  <th className="px-6 py-4 text-right">Access Level</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {filteredPatients.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                     <td className="px-6 py-4">
                        <div className="flex items-center">
                           <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm mr-3 shadow-sm">
                              {p.name.charAt(0)}
                           </div>
                           <div>
                              <div className="font-medium text-gray-900 flex items-center gap-2">
                                 {p.name}
                                 {p.aiFlag && <AlertCircle size={12} className="text-red-500" />}
                              </div>
                              <div className="text-xs text-gray-500">ID: {p.id.toUpperCase()}</div>
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-4 text-sm text-gray-600">
                        {p.age} Years <span className="text-gray-300 mx-1">|</span> {p.gender}
                     </td>
                     <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center">
                           <Calendar size={14} className="mr-2 text-gray-400" /> {p.lastVisit}
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                           p.status === 'Critical' ? 'bg-red-100 text-red-700' : 
                           p.status === 'Recovered' ? 'bg-green-100 text-green-700' : 
                           'bg-blue-100 text-blue-700'
                        }`}>
                           <Activity size={12} className="mr-1" /> {p.status}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end text-xs font-medium text-gray-500">
                           <Shield size={12} className="mr-1 text-green-500" /> Standard
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};