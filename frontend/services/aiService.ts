import api from './api';

export interface PatientInsight {
  summary: string;
  riskFactors: string[];
  recommendations: string[];
  upcomingTests: string[];
}

export interface RecordAnalysis {
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  severity: 'low' | 'medium' | 'high';
}

export const aiService = {
  getPatientInsights: async (patientId: string): Promise<PatientInsight> => {
    const response = await api.get(`/ai/insights/${patientId}`);
    return response.data;
  },

  analyzeRecord: async (recordId: string): Promise<RecordAnalysis> => {
    const response = await api.post('/ai/analyze', { recordId });
    return response.data;
  },

  // Chat with medical history
  chatWithHistory: async (patientId: string, message: string): Promise<string> => {
    const response = await api.post('/ai/chat', { patientId, message });
    return response.data.response;
  },
};