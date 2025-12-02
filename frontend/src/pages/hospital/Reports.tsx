
import React, { useState } from 'react';
import { MOCK_REPORTS } from '../../constants';
import { Button } from '../../components/ui/Button';
import { FileText, Download, RefreshCw, Brain, BarChart2, PieChart } from 'lucide-react';

export const HospitalReports: React.FC = () => {
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const handleGenerate = (id: string) => {
    setGeneratingId(id);
    setTimeout(() => {
       setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Ready' as const } : r));
       setGeneratingId(null);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
       <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-500">System generated insights and operational audits.</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-xs font-bold text-ai-600 bg-ai-50 px-3 py-1.5 rounded-lg border border-ai-100 flex items-center">
              <Brain size={14} className="mr-2" /> AI Analysis Enabled
           </span>
        </div>
      </div>

      {/* Charts Area Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-gray-900">Patient Demographics</h3>
               <PieChart className="text-gray-400" size={20} />
            </div>
            <div className="h-48 flex items-end justify-center space-x-6 px-8">
               {/* Mock Bars */}
               <div className="w-12 bg-blue-100 rounded-t-lg h-[60%] relative group"><div className="absolute bottom-0 w-full bg-blue-500 h-0 group-hover:h-full transition-all duration-500"></div></div>
               <div className="w-12 bg-blue-100 rounded-t-lg h-[80%] relative group"><div className="absolute bottom-0 w-full bg-blue-500 h-0 group-hover:h-full transition-all duration-500 delay-100"></div></div>
               <div className="w-12 bg-blue-100 rounded-t-lg h-[40%] relative group"><div className="absolute bottom-0 w-full bg-blue-500 h-0 group-hover:h-full transition-all duration-500 delay-200"></div></div>
            </div>
            <div className="flex justify-center gap-8 mt-4 text-xs text-gray-500 font-bold uppercase">
               <span>0-18</span>
               <span>19-50</span>
               <span>50+</span>
            </div>
         </div>
         
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-gray-900">Monthly Records Uploaded</h3>
               <BarChart2 className="text-gray-400" size={20} />
            </div>
            <div className="h-48 flex items-end justify-around">
               {[30, 50, 45, 70, 65, 85].map((h, i) => (
                  <div key={i} className="w-8 bg-tech-100 rounded-t-md relative overflow-hidden group" style={{height: `${h}%`}}>
                     <div className="absolute bottom-0 w-full bg-tech-500 h-0 group-hover:h-full transition-all duration-500"></div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg">Available Reports</h3>
         </div>
         <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-100">
               <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Report Title</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Date Generated</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {reports.map(rep => (
                  <tr key={rep.id} className="hover:bg-gray-50 transition-colors">
                     <td className="px-6 py-4">
                        <div className="flex items-center">
                           <FileText className="text-gray-400 mr-3" size={20} />
                           <span className="font-medium text-gray-900">{rep.title}</span>
                        </div>
                     </td>
                     <td className="px-6 py-4 text-sm text-gray-600">{rep.type}</td>
                     <td className="px-6 py-4 text-sm text-gray-500">{rep.date}</td>
                     <td className="px-6 py-4">
                        {rep.status === 'Generating' || generatingId === rep.id ? (
                           <span className="flex items-center text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded w-fit">
                              <RefreshCw size={12} className="mr-1 animate-spin" /> Processing
                           </span>
                        ) : (
                           <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded w-fit">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div> Ready
                           </span>
                        )}
                     </td>
                     <td className="px-6 py-4 text-right">
                        {(rep.status === 'Generating' || generatingId === rep.id) ? (
                           <span className="text-xs text-gray-400">Please wait...</span>
                        ) : (
                           rep.status === 'Ready' ? (
                              <Button size="sm" variant="outline" className="text-xs h-8">
                                 <Download size={14} className="mr-2" /> PDF
                              </Button>
                           ) : (
                              <Button size="sm" variant="secondary" className="text-xs h-8" onClick={() => handleGenerate(rep.id)}>
                                 Generate
                              </Button>
                           )
                        )}
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};
