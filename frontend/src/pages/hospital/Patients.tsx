import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  Eye,
  Loader,
  ChevronRight,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface Patient {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  recordCount: number;
  approvedCount: number;
  pendingCount: number;
  lastVisit?: string;
  status: 'active' | 'inactive';
}

interface PatientRecord {
  _id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  files: any[];
}

export const HospitalPatients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientRecords, setPatientRecords] = useState<PatientRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/records', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch records');

      const data = await response.json();
      
      // Group records by patient
      const patientMap = new Map<string, Patient>();
      
      data.records.forEach((record: any) => {
        const patientId = record.patient._id;
        
        if (!patientMap.has(patientId)) {
          patientMap.set(patientId, {
            _id: patientId,
            name: record.patient.name,
            email: record.patient.email,
            phone: record.patient.phone,
            recordCount: 0,
            approvedCount: 0,
            pendingCount: 0,
            lastVisit: record.createdAt,
            status: 'active',
          });
        }
        
        const patient = patientMap.get(patientId)!;
        patient.recordCount++;
        
        if (record.status === 'APPROVED') patient.approvedCount++;
        if (record.status === 'PENDING') patient.pendingCount++;
        
        // Update last visit to most recent
        if (new Date(record.createdAt) > new Date(patient.lastVisit!)) {
          patient.lastVisit = record.createdAt;
        }
      });

      setPatients(Array.from(patientMap.values()));
    } catch (error) {
      console.error('❌ Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientRecords = async (patientEmail: string) => {
    setLoadingRecords(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/records', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch records');

      const data = await response.json();
      
      // Filter records for selected patient
      const filtered = data.records.filter((r: any) => r.patient.email === patientEmail);
      setPatientRecords(filtered);
    } catch (error) {
      console.error('❌ Error fetching patient records:', error);
    } finally {
      setLoadingRecords(false);
    }
  };

  const handleViewPatient = async (patient: Patient) => {
    setSelectedPatient(patient);
    await fetchPatientRecords(patient.email);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Patient Directory</h1>
          <p className="text-sm text-gray-600 mt-1">Manage patient records and status</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-sm text-gray-600">Total Patients: </span>
            <span className="text-lg font-bold text-primary-600">{patients.length}</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Patients Found</h3>
            <p className="text-gray-600">
              {searchQuery ? 'Try a different search term' : 'No patients have been added yet'}
            </p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <div
              key={patient._id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => handleViewPatient(patient)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-medical-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {patient.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {patient.name}
                    </h3>
                    <p className="text-xs text-gray-500">ID: {patient._id.slice(-6)}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{patient.email}</span>
                </div>
                {patient.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{patient.phone}</span>
                  </div>
                )}
                {patient.lastVisit && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Last: {new Date(patient.lastVisit).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{patient.recordCount}</div>
                    <div className="text-xs text-gray-500">Records</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-600">{patient.pendingCount}</div>
                    <div className="text-xs text-gray-500">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{patient.approvedCount}</div>
                    <div className="text-xs text-gray-500">Approved</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-medical-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {selectedPatient.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedPatient.name}</h2>
                  <p className="text-sm text-gray-600">{selectedPatient.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Eye className="w-6 h-6" />
              </button>
            </div>

            {/* Patient Stats */}
            <div className="p-6 bg-gray-50 border-b border-gray-100">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <FileText className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{selectedPatient.recordCount}</div>
                  <div className="text-xs text-gray-500">Total Records</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-600">{selectedPatient.pendingCount}</div>
                  <div className="text-xs text-gray-500">Pending</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{selectedPatient.approvedCount}</div>
                  <div className="text-xs text-gray-500">Approved</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <Activity className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-xs font-medium text-gray-900">Last Visit</div>
                  <div className="text-xs text-gray-500">
                    {selectedPatient.lastVisit 
                      ? new Date(selectedPatient.lastVisit).toLocaleDateString()
                      : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Records List */}
            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Medical Records</h3>
              
              {loadingRecords ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-primary-600" />
                </div>
              ) : patientRecords.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No records found for this patient</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {patientRecords.map((record) => (
                    <div
                      key={record._id}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{record.title}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                              {record.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{record.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(record.createdAt).toLocaleDateString()}
                          </span>
                          {record.files.length > 0 && (
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {record.files.length} file(s)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100">
              <Button
                fullWidth
                variant="outline"
                onClick={() => setSelectedPatient(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
