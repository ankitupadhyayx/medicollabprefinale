
import React, { useState } from 'react';
import { MOCK_PATIENTS } from '../../constants';
import { Button } from '../../components/ui/Button';
import { Search, Filter, Plus, MoreHorizontal, FileText, Calendar, AlertCircle, User } from 'lucide-react';

export const HospitalPatients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL');

  const filteredPatients = MOCK_PATIENTS.filter(p => {
     const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
     const matchesFilter = filter === 'ALL' || 
       (filter === 'CRITICAL' && p.status === 'Critical') ||
       (filter === 'ACTIVE' && p.status === 'Active');
     return matchesSearch && matchesFilter;
  });

  const handleAddPatient = () => {
     alert("Mock Feature: Open Add Patient Modal");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Directory</h1>
          <p className="text-gray-500">Manage patient records and status.</p>
        </div>
        <Button onClick={handleAddPatient}>
           <Plus size={18} className="mr-2" /> Add New Patient
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex space-x-2 w-full md:w-auto">
            {['ALL', 'ACTIVE', 'CRITICAL', 'RECOVERED'].map((f) => (
               <button 
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
               placeholder="Search by name or ID..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-primary-300 rounded-lg text-sm outline-none transition-all" 
            />
         </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
         <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-100">
               <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Patient Name</th>
                  <th className="px-6 py-4">Age / Gender</th>
                  <th className="px-6 py-4">Last Visit</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {filteredPatients.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors group">
                     <td className="px-6 py-4">
                        <div className="flex items-center">
                           <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm mr-3">
                              {p.name.charAt(0)}
                           </div>
                           <div>
                              <div className="font-medium text-gray-900 flex items-center">
                                 {p.name}
                                 {p.aiFlag && <span className="ml-2 text-red-500" title="Critical"><AlertCircle size={12} fill="currentColor" className="text-white" /></span>}
                              </div>
                              <div className="text-xs text-gray-500">ID: {p.id.toUpperCase()}</div>
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-4 text-sm text-gray-600">{p.age} yrs <span className="text-gray-300 mx-1">|</span> {p.gender}</td>
                     <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center">
                           <Calendar size={14} className="mr-2 text-gray-400" /> {p.lastVisit}
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                           p.status === 'Critical' ? 'bg-red-100 text-red-700' : 
                           p.status === 'Recovered' ? 'bg-green-100 text-green-700' : 
                           'bg-blue-100 text-blue-700'
                        }`}>
                           {p.status}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                           <Button size="sm" variant="outline" className="text-xs h-8">History</Button>
                           <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100">
                              <MoreHorizontal size={18} />
                           </button>
                        </div>
                     </td>
                  </tr>
               ))}
               {filteredPatients.length === 0 && (
                  <tr>
                     <td colSpan={5} className="text-center py-10 text-gray-400">
                        No patients found matching criteria.
                     </td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
};
