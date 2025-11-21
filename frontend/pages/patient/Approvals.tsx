
import React, { useState } from 'react';
import { MOCK_PENDING_APPOINTMENTS, MOCK_RECORDS } from '../../constants';
import { Button } from '../../components/ui/Button';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, FileText, Building2, Sparkles, ArrowRight } from 'lucide-react';
import { Appointment, MedicalRecord } from '../../types';
import { useNavigate } from 'react-router-dom';

export const PatientApprovals: React.FC = () => {
  const navigate = useNavigate();
  // State for Appointments
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>(MOCK_PENDING_APPOINTMENTS);
  // State for Records (Filtering from mock where status is PENDING)
  const [pendingRecords, setPendingRecords] = useState<MedicalRecord[]>(MOCK_RECORDS.filter(r => r.status === 'PENDING'));

  const [activeTab, setActiveTab] = useState<'ALL' | 'RECORDS' | 'APPOINTMENTS'>('ALL');

  // --- Handlers ---

  const handleAppointmentAction = (id: string, action: 'approve' | 'reject') => {
    setPendingAppointments(prev => prev.filter(apt => apt.id !== id));
    // In real app, API call here
  };

  const handleRecordAction = (id: string, action: 'approve' | 'reject') => {
    setPendingRecords(prev => prev.filter(rec => rec.id !== id));
    // If approved, in real app, it moves to timeline. If rejected, moves to dispute.
    if(action === 'approve') {
       // Show toast or navigate
    }
  };

  const totalPending = pendingAppointments.length + pendingRecords.length;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
          <p className="text-gray-500">Review uploads and requests requiring your action.</p>
        </div>
        <div className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full text-sm font-bold border border-yellow-100 flex items-center shadow-sm">
          <AlertCircle size={18} className="mr-2" />
          {totalPending} Actions Required
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex space-x-6">
         {['ALL', 'RECORDS', 'APPOINTMENTS'].map(tab => (
            <button
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`pb-3 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
               {tab === 'ALL' ? 'All Requests' : tab.charAt(0) + tab.slice(1).toLowerCase()}
               {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full"></div>}
            </button>
         ))}
      </div>

      <div className="space-y-6">
        {totalPending === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">All Caught Up!</h3>
            <p className="text-gray-500">You have no pending approvals.</p>
            <Button variant="outline" className="mt-6" onClick={() => navigate('/patient/timeline')}>
               View Timeline
            </Button>
          </div>
        ) : (
           <div className="grid grid-cols-1 gap-6">
              
              {/* --- MEDICAL RECORDS --- */}
              {(activeTab === 'ALL' || activeTab === 'RECORDS') && pendingRecords.map(rec => (
                 <div key={rec.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-all">
                    <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <div className="p-6">
                       <div className="flex justify-between items-start mb-4">
                          <div className="flex items-start space-x-4">
                             <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                                <FileText size={24} />
                             </div>
                             <div>
                                <h3 className="font-bold text-gray-900 text-lg">{rec.title}</h3>
                                <div className="flex items-center text-gray-500 text-sm mt-1">
                                   <Building2 size={14} className="mr-1" /> {rec.hospitalName}
                                </div>
                             </div>
                          </div>
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                             {rec.type}
                          </span>
                       </div>

                       <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
                          <div className="flex justify-between text-xs text-gray-400 mb-2 uppercase font-bold tracking-wide">
                             <span>Upload Date: {rec.date}</span>
                             {rec.aiAnalyzed && <span className="flex items-center text-ai-600"><Sparkles size={10} className="mr-1"/> AI Analyzed</span>}
                          </div>
                          <p className="text-gray-600 text-sm">{rec.description}</p>
                       </div>

                       <div className="flex items-center space-x-3">
                          <Button 
                             variant="outline" 
                             className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                             onClick={() => handleRecordAction(rec.id, 'reject')}
                          >
                             <XCircle size={18} className="mr-2" /> Reject
                          </Button>
                          <Button 
                             variant="primary" 
                             className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-none"
                             onClick={() => handleRecordAction(rec.id, 'approve')}
                          >
                             <CheckCircle size={18} className="mr-2" /> Approve
                          </Button>
                       </div>
                       <p className="text-center text-[10px] text-gray-400 mt-3">
                          Approving adds this record permanently to your Health Timeline.
                       </p>
                    </div>
                 </div>
              ))}

              {/* --- APPOINTMENTS --- */}
              {(activeTab === 'ALL' || activeTab === 'APPOINTMENTS') && pendingAppointments.map(apt => (
                 <div key={apt.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-all">
                    <div className="p-1 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
                    <div className="p-6">
                       <div className="flex justify-between items-start mb-4">
                          <div className="flex items-start space-x-4">
                             <div className="h-12 w-12 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600 flex-shrink-0">
                                <Calendar size={24} />
                             </div>
                             <div>
                                <h3 className="font-bold text-gray-900 text-lg">Appointment Request</h3>
                                <div className="flex items-center text-gray-500 text-sm mt-1">
                                   <Building2 size={14} className="mr-1" /> {apt.hospitalName}
                                </div>
                             </div>
                          </div>
                          <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                             Request
                          </span>
                       </div>

                       <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                             <p className="text-gray-900 font-medium text-sm mb-1">{apt.reason}</p>
                             <p className="text-xs text-gray-500">Requested by Hospital Staff</p>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="bg-white px-3 py-2 rounded border border-gray-200 flex items-center text-sm font-bold text-gray-700">
                                <Calendar size={14} className="mr-2 text-primary-500" /> {apt.date}
                             </div>
                             <div className="bg-white px-3 py-2 rounded border border-gray-200 flex items-center text-sm font-bold text-gray-700">
                                <Clock size={14} className="mr-2 text-primary-500" /> {apt.time}
                             </div>
                          </div>
                       </div>

                       <div className="flex items-center space-x-3">
                          <Button 
                             variant="outline" 
                             className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                             onClick={() => handleAppointmentAction(apt.id, 'reject')}
                          >
                             <XCircle size={18} className="mr-2" /> Decline
                          </Button>
                          <Button 
                             variant="primary" 
                             className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-none"
                             onClick={() => handleAppointmentAction(apt.id, 'approve')}
                          >
                             <CheckCircle size={18} className="mr-2" /> Confirm
                          </Button>
                       </div>
                    </div>
                 </div>
              ))}

           </div>
        )}
      </div>
    </div>
  );
};
