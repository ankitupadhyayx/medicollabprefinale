
import React, { useState } from 'react';
import { MOCK_REMINDERS } from '../../constants';
import { Button } from '../../components/ui/Button';
import { Clock, Plus, Check, Pill, CalendarHeart, Brain, Trash2, RefreshCw } from 'lucide-react';
import { Reminder } from '../../types';

export const PatientReminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>(MOCK_REMINDERS);

  const toggleStatus = (id: string) => {
    setReminders(prev => prev.map(r => {
      if(r.id === id) {
         if(r.status === 'ONGOING' || r.status === 'UPCOMING') return { ...r, status: 'COMPLETED' };
         return { ...r, status: 'ONGOING' }; // Simplified toggle
      }
      return r;
    }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reminders</h1>
          <p className="text-gray-500">Track your medications and follow-up visits.</p>
        </div>
        <Button variant="primary">
           <Plus size={18} className="mr-2" /> Add Reminder
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {reminders.map((rem) => (
            <div key={rem.id} className={`p-6 rounded-2xl shadow-sm border transition-all group ${
               rem.status === 'COMPLETED' ? 'bg-gray-50 border-gray-100 opacity-75' : 
               rem.status === 'REFILL_NEEDED' ? 'bg-yellow-50 border-yellow-100' :
               'bg-white border-gray-100 hover:shadow-md hover:border-primary-100'
            }`}>
               <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                        rem.type === 'MEDICINE' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                     }`}>
                        {rem.type === 'MEDICINE' ? <Pill size={24} /> : <CalendarHeart size={24} />}
                     </div>
                     <div>
                        <h3 className={`font-bold text-lg ${rem.status === 'COMPLETED' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                           {rem.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                           <Clock size={14} className="mr-1" /> {rem.time} 
                           {rem.frequency && <span className="mx-1">•</span>} {rem.frequency}
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                     {rem.aiSuggested && (
                        <span className="flex items-center text-[10px] bg-ai-50 text-ai-600 px-2 py-0.5 rounded-full border border-ai-100 font-bold">
                           <Brain size={10} className="mr-1" /> AI Suggested
                        </span>
                     )}
                     {rem.status === 'REFILL_NEEDED' && (
                        <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold animate-pulse">
                           Refill Needed
                        </span>
                     )}
                  </div>
               </div>

               <div className="flex items-center justify-between pt-4 border-t border-gray-100/50 mt-2">
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                     {rem.status === 'COMPLETED' ? 'Marked Done' : rem.duration || rem.date || 'Ongoing'}
                  </div>
                  
                  <div className="flex space-x-2">
                     {rem.status === 'REFILL_NEEDED' ? (
                        <Button size="sm" variant="outline" className="text-xs h-8 border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100">
                           <RefreshCw size={12} className="mr-1" /> Order Refill
                        </Button>
                     ) : (
                        <button 
                           onClick={() => toggleStatus(rem.id)}
                           className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                              rem.status === 'COMPLETED' 
                              ? 'bg-green-500 text-white hover:bg-green-600' 
                              : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-500'
                           }`}
                        >
                           <Check size={16} />
                        </button>
                     )}
                     <button className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                     </button>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};
