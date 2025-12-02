import React, { useState } from 'react';
import { MOCK_HOSPITALS } from '../../constants';
import { Button } from '../../components/ui/Button';
import { Search, Filter, CheckCircle, XCircle, Ban, MapPin, FileText, MoreHorizontal, Building2, AlertCircle } from 'lucide-react';
import { Hospital } from '../../types';

export const AdminHospitals: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>(MOCK_HOSPITALS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL');

  const filteredHospitals = hospitals.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) || h.licenseId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'ALL' || 
                          (filter === 'VERIFIED' && h.status === 'Verified') ||
                          (filter === 'PENDING' && h.status === 'Pending') ||
                          (filter === 'SUSPENDED' && h.status === 'Suspended');
    return matchesSearch && matchesFilter;
  });

  const updateStatus = (id: string, status: 'Verified' | 'Suspended') => {
    setHospitals(prev => prev.map(h => h.id === id ? { ...h, status, verified: status === 'Verified' } : h));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hospital Registry</h1>
          <p className="text-gray-500">Manage verifying and monitoring connected healthcare facilities.</p>
        </div>
        <div className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
           Total Facilities: <span className="font-bold text-gray-900">{hospitals.length}</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex space-x-2 w-full md:w-auto overflow-x-auto">
            {['ALL', 'VERIFIED', 'PENDING', 'SUSPENDED'].map((f) => (
               <button 
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    filter === f 
                    ? 'bg-primary-600 text-white shadow-md' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                 }`}
               >
                  {f.charAt(0) + f.slice(1).toLowerCase()}
               </button>
            ))}
         </div>
         
         <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
               type="text" 
               placeholder="Search name or license..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-primary-300 rounded-lg text-sm outline-none transition-all" 
            />
         </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full">
               <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                     <th className="px-6 py-4">Hospital Name</th>
                     <th className="px-6 py-4">License Info</th>
                     <th className="px-6 py-4">Location</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {filteredHospitals.length > 0 ? filteredHospitals.map(h => (
                     <tr key={h.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex items-center">
                              <div className="h-10 w-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm mr-3">
                                 <Building2 size={20} />
                              </div>
                              <div>
                                 <div className="font-medium text-gray-900 flex items-center gap-2">
                                    {h.name}
                                    {h.aiFlag && <span className="text-xs text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 flex items-center" title="AI Flagged Suspicious"><AlertCircle size={10} className="mr-1"/> Flagged</span>}
                                 </div>
                                 <div className="text-xs text-gray-500">ID: {h.id}</div>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded w-fit">
                              <FileText size={14} className="mr-2 text-gray-400" /> {h.licenseId}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                           <div className="flex items-center">
                              <MapPin size={14} className="mr-2 text-gray-400" /> {h.location}
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                              ${h.status === 'Verified' ? 'bg-green-100 text-green-800' : 
                                h.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}
                           `}>
                              {h.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex justify-end gap-2">
                              {h.status === 'Pending' && (
                                 <>
                                    <button onClick={() => updateStatus(h.id, 'Verified')} className="p-1.5 text-green-600 hover:bg-green-50 rounded border border-transparent hover:border-green-100 transition-colors" title="Approve">
                                       <CheckCircle size={18} />
                                    </button>
                                    <button onClick={() => updateStatus(h.id, 'Suspended')} className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-100 transition-colors" title="Reject">
                                       <XCircle size={18} />
                                    </button>
                                 </>
                              )}
                              {h.status === 'Verified' && (
                                 <button onClick={() => updateStatus(h.id, 'Suspended')} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded border border-transparent hover:border-orange-100 transition-colors" title="Suspend Access">
                                    <Ban size={18} />
                                 </button>
                              )}
                              {h.status === 'Suspended' && (
                                 <button onClick={() => updateStatus(h.id, 'Verified')} className="p-1.5 text-green-600 hover:bg-green-50 rounded border border-transparent hover:border-green-100 transition-colors" title="Re-instate">
                                    <CheckCircle size={18} />
                                 </button>
                              )}
                              <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100">
                                 <MoreHorizontal size={18} />
                              </button>
                           </div>
                        </td>
                     </tr>
                  )) : (
                     <tr>
                        <td colSpan={5} className="text-center py-12 text-gray-400">
                           No hospitals found matching your criteria.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};