import api from './api';

export interface CreateRecordData {
  title: string;
  description: string;
  patientEmail: string;
  recordType: 'Lab Report' | 'Prescription' | 'Imaging' | 'Discharge Summary' | 'Bill' | 'Other';
  metadata?: {
    doctorName?: string;
    department?: string;
    dateOfVisit?: string;
    diagnosis?: string;
    medications?: string[];
  };
}

export interface UpdateRecordStatusData {
  status: 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
}

export interface Record {
  _id: string;
  title: string;
  description: string;
  patient: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  hospital: {
    _id: string;
    name: string;
    hospitalName?: string;
    email: string;
    phone?: string;
  };
  hospitalName: string;
  recordType: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  files: Array<{
    filename: string;
    originalName: string;
    url: string;
    uploadedAt: string;
  }>;
  metadata?: {
    doctorName?: string;
    department?: string;
    dateOfVisit?: string;
    diagnosis?: string;
    medications?: string[];
  };
  aiAnalysis?: {
    analyzed: boolean;
    summary?: string;
    keyFindings?: string[];
    recommendations?: string[];
    riskLevel?: 'Low' | 'Medium' | 'High' | 'Critical';
  };
  createdAt: string;
  updatedAt: string;
}

export interface RecordStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  hospitalsVisited: number;
}

export const recordService = {
  // Create new record (Hospital only)
  async createRecord(data: CreateRecordData): Promise<Record> {
    console.log('🚀 Creating record:', { ...data });
    
    try {
      const response = await api.post('/records', data);
      console.log('✅ Record created:', response.data);
      return response.data.record;
    } catch (error: any) {
      console.error('❌ Create record error:', {
        message: error.message,
        response: error.response?.data,
      });
      throw error;
    }
  },

  // Get all records (filtered by role on backend)
  async getRecords(params?: {
    status?: string;
    recordType?: string;
    search?: string;
  }): Promise<Record[]> {
    console.log('🚀 Fetching records:', params);
    
    try {
      const response = await api.get('/records', { params });
      console.log('✅ Records fetched:', response.data.count);
      return response.data.records;
    } catch (error: any) {
      console.error('❌ Fetch records error:', error);
      throw error;
    }
  },

  // Get single record by ID
  async getRecordById(id: string): Promise<Record> {
    console.log('🚀 Fetching record:', id);
    
    try {
      const response = await api.get(`/records/${id}`);
      console.log('✅ Record fetched:', response.data.record);
      return response.data.record;
    } catch (error: any) {
      console.error('❌ Fetch record error:', error);
      throw error;
    }
  },

  // Update record status (Patient only - Approve/Reject)
  async updateRecordStatus(id: string, data: UpdateRecordStatusData): Promise<Record> {
    console.log('🚀 Updating record status:', { id, ...data });
    
    try {
      const response = await api.put(`/records/${id}/status`, data);
      console.log('✅ Record status updated:', response.data.record.status);
      return response.data.record;
    } catch (error: any) {
      console.error('❌ Update status error:', {
        message: error.message,
        response: error.response?.data,
      });
      throw error;
    }
  },

  // Update record (Hospital only)
  async updateRecord(id: string, data: Partial<CreateRecordData>): Promise<Record> {
    console.log('🚀 Updating record:', { id, ...data });
    
    try {
      const response = await api.put(`/records/${id}`, data);
      console.log('✅ Record updated');
      return response.data.record;
    } catch (error: any) {
      console.error('❌ Update record error:', error);
      throw error;
    }
  },

  // Delete record (Hospital/Admin only)
  async deleteRecord(id: string): Promise<void> {
    console.log('🚀 Deleting record:', id);
    
    try {
      await api.delete(`/records/${id}`);
      console.log('✅ Record deleted');
    } catch (error: any) {
      console.error('❌ Delete record error:', error);
      throw error;
    }
  },

  // Get record statistics (Patient)
  async getRecordStats(patientId?: string): Promise<RecordStats> {
    console.log('🚀 Fetching record stats');
    
    try {
      const params = patientId ? { patientId } : {};
      const response = await api.get('/records/stats', { params });
      console.log('✅ Stats fetched:', response.data.stats);
      return response.data.stats;
    } catch (error: any) {
      console.error('❌ Fetch stats error:', error);
      throw error;
    }
  },

  // Helper: Format date
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },

  // Helper: Get status color
  getStatusColor(status: string): string {
    switch (status) {
      case 'APPROVED':
        return 'green';
      case 'REJECTED':
        return 'red';
      case 'PENDING':
        return 'yellow';
      default:
        return 'gray';
    }
  },

  // Helper: Get status badge class
  getStatusBadgeClass(status: string): string {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold';
    switch (status) {
      case 'APPROVED':
        return `${baseClasses} bg-green-100 text-green-700`;
      case 'REJECTED':
        return `${baseClasses} bg-red-100 text-red-700`;
      case 'PENDING':
        return `${baseClasses} bg-yellow-100 text-yellow-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  },

  // Helper: Get record type icon
  getRecordTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'Lab Report': '🧪',
      'Prescription': '💊',
      'Imaging': '📷',
      'Discharge Summary': '📋',
      'Bill': '💰',
      'Other': '📄',
    };
    return icons[type] || '📄';
  },
};