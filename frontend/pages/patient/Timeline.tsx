
import React, { useState } from 'react';
import { MOCK_RECORDS } from '../../constants';
import { Button } from '../../components/ui/Button';
import { FileText, Calendar, Building, CheckCircle, Sparkles, Filter, Search, Download, Share2 } from 'lucide-react';
import { summarizeMedicalRecord } from '../../services/geminiService';

export const PatientTimeline: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'LAB' | 'IMAGING' | 'PRESCRIPTION'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [summarizingId, setSummarizingId] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<Record<string, string>>({});

  const records = MOCK_RECORDS.filter(r => r.status === 'APPROVED');

  const filteredRecords = records.filter(r => {
    const matchesFilter = filter === 'ALL' || 
       (filter === 'LAB' && r.type === 'Lab Report') ||
       (filter === 'IMAGING' && r.type === 'Imaging') ||
       (filter === 'PRESCRIPTION' && r.type === 'Prescription');
    
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.hospitalName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleSummarize = async (id: string, text: string) => {
    setSummarizingId(id);
    const summary = await summarizeMedicalRecord(text);
    setSummaries(prev => ({ ...prev, [id]: summary }));
    setSummarizingId(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Timeline</h1>
          <p className="text-gray-500">Your secure medical record locker.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="secondary" size="sm">
              <Download size={16} className="mr-2" /> Download All
           </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {['ALL', 'LAB', 'IMAGING', 'PRESCRIPTION'].map((f) => (
               <button 
                 key={f}
                 onClick={() => setFilter(f as any)}
                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    filter === f 
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                 }`}
               >
                  {f === 'ALL' ? 'All Records' : f.charAt(0) + f.slice(1).toLowerCase()}
               </button>
            ))}
         </div>
         
         <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
               type="text" 
               placeholder="Search records..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-primary-300 rounded-lg text-sm outline-none transition-all" 
            />
         </div>
      </div>

      {/* Timeline Feed */}
      <div className="max-w-3xl mx-auto space-y-8 relative">
         {/* Vertical Line */}
         <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 -z-10 hidden md:block"></div>

         {filteredRecords.length > 0 ? filteredRecords.map((record) => (
            <div key={record.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative hover:shadow-md transition-all duration-300 group">
               {/* Important Tag */}
               {record.type === 'Lab Report' && (
                  <div className="absolute top-0 right-0 bg-red-50 text-red-600 text-[10px] font-bold px-3 py-1 rounded-bl-xl border-b border-l border-red-100">
                     Important
                  </div>
               )}

               <div className="p-6 flex gap-6">
                  {/* Icon (Desktop) */}
                  <div className="hidden md:flex flex-col items-center">
                     <div className="w-16 h-16 bg-white border-4 border-gray-100 rounded-full flex items-center justify-center text-primary-600 z-10">
                        <FileText size={24} />
                     </div>
                  </div>

                  <div className="flex-1">
                     {/* Header */}
                     <div className="flex justify-between items-start mb-3">
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <span className="bg-blue-50 text-primary-700 text-xs font-bold px-2 py-0.5 rounded">{record.type}</span>
                              <span className="text-gray-400 text-xs flex items-center"><Calendar size={12} className="mr-1"/> {record.date}</span>
                           </div>
                           <h3 className="text-lg font-bold text-gray-900">{record.title}</h3>
                           <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Building size={14} className="mr-1"/> {record.hospitalName}
                           </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-1">
                           {record.aiAnalyzed && (
                              <span className="flex items-center text-[10px] bg-ai-50 text-ai-600 px-1.5 py-0.5 rounded border border-ai-100">
                                 <Sparkles size={10} className="mr-1" /> AI Verified
                              </span>
                           )}
                           <span className="flex items-center text-[10px] text-green-600">
                              <CheckCircle size={10} className="mr-1" /> Approved
                           </span>
                        </div>
                     </div>

                     {/* Image Preview */}
                     {record.imageUrl && (
                        <div className="mb-4 rounded-xl overflow-hidden h-48 bg-gray-100 border border-gray-200 relative group/img">
                           <img src={record.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover/img:opacity-100">
                              <Button size="sm" variant="secondary">View Full</Button>
                           </div>
                        </div>
                     )}

                     {/* Description */}
                     <p className="text-gray-600 text-sm leading-relaxed mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        {record.description}
                     </p>

                     {/* AI Summary */}
                     {summaries[record.id] ? (
                        <div className="bg-ai-50 border border-ai-100 p-3 rounded-lg mb-4 animate-fade-in-up">
                           <div className="flex items-center text-ai-700 font-bold text-xs mb-1">
                              <Sparkles size={12} className="mr-1" /> AI Summary
                           </div>
                           <p className="text-ai-900 text-sm">{summaries[record.id]}</p>
                        </div>
                     ) : (
                        <button 
                           onClick={() => handleSummarize(record.id, record.description)}
                           disabled={summarizingId === record.id}
                           className="text-xs font-bold text-ai-600 hover:text-ai-700 flex items-center mb-4 transition-colors"
                        >
                           {summarizingId === record.id ? <Sparkles size={12} className="mr-1 animate-spin" /> : <Sparkles size={12} className="mr-1" />}
                           {summarizingId === record.id ? 'Analyzing...' : 'Generate AI Summary'}
                        </button>
                     )}

                     {/* Actions */}
                     <div className="flex gap-3 pt-2">
                        <Button size="sm" variant="outline" className="flex-1 text-xs">
                           <Download size={14} className="mr-2" /> Download
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 text-xs">
                           <Share2 size={14} className="mr-2" /> Share w/ Doctor
                        </Button>
                     </div>
                  </div>
               </div>
            </div>
         )) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
               <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                  <FileText size={32} />
               </div>
               <h3 className="text-lg font-bold text-gray-900">No Records Found</h3>
               <p className="text-gray-500 text-sm">Try adjusting your filters.</p>
            </div>
         )}
      </div>
    </div>
  );
};
