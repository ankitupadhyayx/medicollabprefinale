import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle, 
  XCircle, 
  Loader,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  Building2,
  ChevronRight
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface Appointment {
  _id: string;
  hospital: {
    name: string;
    hospitalName?: string;
    email: string;
    phone?: string;
  };
  date: string;
  time: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
}

export const PatientAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  
  // Booking form
  const [hospitalEmail, setHospitalEmail] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [reason, setReason] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    // Mock data for now - you'll need to create backend endpoints
    const mockAppointments: Appointment[] = [
      {
        _id: '1',
        hospital: {
          name: 'shivalik',
          hospitalName: 'St. Marys Medical Center',
          email: 'test@example.com',
          phone: '+1 (555) 999-8888'
        },
        date: '2023-11-15',
        time: '10:00 AM',
        reason: 'Regular Cardiac Follow-up',
        status: 'scheduled',
        createdAt: new Date().toISOString()
      }
    ];

    setTimeout(() => {
      setAppointments(mockAppointments);
      setLoading(false);
    }, 1000);
  }, []);

  const handleBookAppointment = async () => {
    if (!hospitalEmail || !appointmentDate || !appointmentTime || !reason) {
      alert('Please fill all fields');
      return;
    }

    setBooking(true);

    // Simulate API call
    setTimeout(() => {
      const newAppointment: Appointment = {
        _id: Date.now().toString(),
        hospital: {
          name: hospitalEmail.split('@')[0],
          hospitalName: 'Hospital Name',
          email: hospitalEmail,
        },
        date: appointmentDate,
        time: appointmentTime,
        reason,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };

      setAppointments([newAppointment, ...appointments]);
      setShowBooking(false);
      setHospitalEmail('');
      setAppointmentDate('');
      setAppointmentTime('');
      setReason('');
      setBooking(false);
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            SCHEDULED
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            COMPLETED
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            CANCELLED
          </span>
        );
    }
  };

  const upcomingAppointments = appointments.filter(a => a.status === 'scheduled');
  const pastAppointments = appointments.filter(a => a.status !== 'scheduled');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your hospital visits and consultations</p>
        </div>
        <Button onClick={() => setShowBooking(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Book New Appointment
        </Button>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-600" />
          Upcoming Visits
        </h2>

        {upcomingAppointments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No upcoming appointments</p>
            <Button onClick={() => setShowBooking(true)} variant="outline" className="mt-4">
              Book Your First Appointment
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-medical-50 rounded-xl border border-primary-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <Calendar className="w-6 h-6 text-primary-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {appointment.hospital.hospitalName || appointment.hospital.name}
                      </h3>
                      {getStatusBadge(appointment.status)}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{appointment.reason}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(appointment.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {appointment.time}
                      </span>
                      {appointment.hospital.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {appointment.hospital.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Button variant="outline" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Past Appointments</h2>
          <div className="space-y-3">
            {pastAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">
                      {appointment.hospital.hospitalName || appointment.hospital.name}
                    </h4>
                    {getStatusBadge(appointment.status)}
                  </div>
                  <p className="text-sm text-gray-600">{appointment.reason}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(appointment.date).toLocaleDateString()} • {appointment.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Book New Appointment</h3>
              <p className="text-sm text-gray-600 mt-1">Schedule a visit with your hospital</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hospital Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={hospitalEmail}
                  onChange={(e) => setHospitalEmail(e.target.value)}
                  placeholder="hospital@example.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  disabled={booking}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    disabled={booking}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    disabled={booking}
                  >
                    <option value="">Select</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  placeholder="Briefly describe your symptoms..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  disabled={booking}
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowBooking(false)}
                disabled={booking}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBookAppointment}
                disabled={booking}
                className="flex-1"
              >
                {booking ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Booking...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};