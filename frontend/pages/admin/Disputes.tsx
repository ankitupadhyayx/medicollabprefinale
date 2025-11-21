import React, { useState } from 'react';
import { MOCK_DISPUTES } from '../../constants';
import { Button } from '../../components/ui/Button';
import { AlertTriangle, Brain, CheckCircle, XCircle, Search, FileText, RefreshCw } from 'lucide-react';
import { Dispute } from '../../types';

export const AdminDisputes: React.FC = () => {
  const [disputes, setDisputes] = useState<Dispute[]>(MOCK_DISPUTES);
  const [aiAnalyzing, setAiAnalyzing] = useState<string | null>(null);

  const handleAiAnalysis = (id: string) => {
    setAiAnalyzing(id);
    setTimeout(() => setAiAnalyzing(null), 2000);
  };

  const resolveDispute = (id: string) => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: 'Resolved' } : d));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dispute Resolution</h1>
          <p className="text-gray-500">Handle patient claims regarding medical records.</p>
        </div>
        <div className="flex items-center bg-ai-50 text-ai-700 px-4 py-2 rounded-lg border border-ai-100">
           <Brain size={18} className="mr-2" /> AI Analysis Available
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {disputes.map(d => (
            <div key={d.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
               <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div className="flex-1">
                     <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${d.status === 'Pending Review' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                           {d.status}
                        </span>
                        <span className="text-xs text-gray-400">ID: {d.id}</span>
                     </div>
                     <h3 className="text-lg font-bold text-gray-900 mb-1">{d.recordTitle}</h3>
                     <div className="flex items-center text-sm text-gray-500 mb-4">
                        <span className="font-medium text-gray-700">{d.patientName}</span>
                        <span className="mx-2">•</span>
                        <span>{d.hospitalName}</span>
                     </div>

                     <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center text-sm font-bold text-gray-700">
                              <Brain size={16} className="text-ai-500 mr-2" /> AI Insight
                           </div>
                           {aiAnalyzing === d.id && <span className="text-xs text-ai-600 flex items-center"><RefreshCw size={10} className="mr-1 animate-spin"/> Analyzing</span>}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                           Blockchain logs confirm the record was uploaded at 10:45 AM. No tampering detected. 
                           The claim that "record is missing" contradicts the ledger.
                        </p>
                        <div className={`mt-3 inline-flex items-center px-2 py-1 rounded text-xs font-bold border ${
                           d.aiSuggestion === 'Likely Valid' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                        }`}>
                           AI Suggestion: {d.aiSuggestion}
                        </div>
                     </div>
                  </div>

                  {d.status === 'Pending Review' ? (
                     <div className="flex flex-col gap-3 min-w-[150px]">
                        <button onClick={() => handleAiAnalysis(d.id)} className="w-full py-2 px-4 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
                           Re-run Analysis
                        </button>
                        <div className="h-px bg-gray-100 my-1"></div>
                        <Button variant="primary" size="sm" onClick={() => resolveDispute(d.id)}>
                           Accept Claim
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => resolveDispute(d.id)}>
                           Dismiss Dispute
                        </Button>
                     </div>
                  ) : (
                     <div className="flex flex-col items-center justify-center min-w-[150px] h-full py-4 bg-green-50/50 rounded-xl border border-green-100">
                        <CheckCircle size={32} className="text-green-500 mb-2" />
                        <span className="text-sm font-bold text-green-700">Resolved</span>
                     </div>
                  )}
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};