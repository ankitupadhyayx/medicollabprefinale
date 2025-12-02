import React, { useState } from 'react';
import { MOCK_HOSPITALS } from '../../constants';
import { Button } from '../../components/ui/Button';
import { Calendar, Clock, MapPin, Plus, CheckCircle, AlertCircle, CalendarCheck } from 'lucide-react';
import { Appointment } from '../../types';

export const PatientAppointments: React.FC = () => {
  const [isBooking, setIsBooking] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Mock Initial Data
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'apt-1',
      hospitalId: 'h1',
      hospitalName: 'St. Marys Medical Center',
      date: '2023-11-15',
      time: '10:00 AM',
      reason: 'Regular Cardiac Follow-up',
      status: 'SCHEDULED'
    }
  ]);

  // Form State
  const [selectedHospital, setSelectedHospital] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooking(true);
    setSuccessMsg('');

    // Simulate API Call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const hospital = MOCK_HOSPITALS.find(h => h.id === selectedHospital);
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      hospitalId: selectedHospital,
      hospitalName: hospital?.name || 'Unknown Hospital',
      date,
      time,
      reason,
      status: 'SCHEDULED'
    };

    setAppointments([newAppointment, ...appointments]);
    setIsBooking(false);
    setSuccessMsg('Appointment scheduled successfully!');
    
    // Reset form
    setSelectedHospital('');
    setDate('');
    setTime('');
    setReason('');

    // Clear success message after 3s
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-500">Manage your hospital visits and consultations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Booking Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Plus size={20} className="mr-2 text-primary-600" />
              Book New Appointment
            </h3>

            {successMsg && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center text-sm animate-fadeIn">
                <CheckCircle size={16} className="mr-2 flex-shrink-0" />
                {successMsg}
              </div>
            )}

            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Hospital</label>
                <select 
                  required
                  value={selectedHospital}
                  onChange={(e) => setSelectedHospital(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow"
                >
                  <option value="">Choose a hospital...</option>
                  {MOCK_HOSPITALS.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input 
                    required
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <select
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="">Select</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea 
                  required
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Briefly describe your symptoms..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <Button 
                type="submit" 
                fullWidth 
                isLoading={isBooking}
                disabled={!selectedHospital || !date || !time}
              >
                Confirm Booking
              </Button>
            </form>
          </div>
        </div>

        {/* Right Column: Upcoming List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Visits</h3>
          
          {appointments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <CalendarCheck className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-500 font-medium">No upcoming appointments</p>
            </div>
          ) : (
            appointments.map((apt) => (
              <div key={apt.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-primary-200 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between group">
                <div className="flex items-start space-x-4 mb-4 sm:mb-0">
                  <div className="bg-blue-50 text-primary-600 p-3 rounded-lg group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{apt.hospitalName}</h4>
                    <p className="text-sm text-gray-500 mb-2">{apt.reason}</p>
                    <div className="flex items-center space-x-4 text-xs font-medium text-gray-500">
                      <span className="flex items-center bg-gray-100 px-2 py-1 rounded"><Clock size={12} className="mr-1"/> {apt.time}</span>
                      <span className="flex items-center bg-gray-100 px-2 py-1 rounded"><Calendar size={12} className="mr-1"/> {apt.date}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 self-start sm:self-end">
                     {apt.status}
                   </span>
                   <Button variant="outline" size="sm" className="text-xs w-full sm:w-auto">Reschedule</Button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};