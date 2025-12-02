import React, { useState } from 'react';
import { recordService } from '../../services/recordService';
import { Button } from '../../components/ui/Button';
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export const HospitalUpload: React.FC = () => {
  const [formData, setFormData] = useState({
    patientEmail: '',
    title: '',
    description: '',
    recordType: 'Lab Report' as const,
    doctorName: '',
    department: '',
    dateOfVisit: '',
    diagnosis: '',
    medications: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recordTypes = [
    'Lab Report',
    'Prescription',
    'Imaging',
    'Discharge Summary',
    'Bill',
    'Other',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.patientEmail || !formData.title || !formData.description) {
        setError('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      // Validate email format
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(formData.patientEmail)) {
        setError('Please enter a valid email address');
        setIsSubmitting(false);
        return;
      }

      // Prepare medications array
      const medications = formData.medications
        ? formData.medications.split(',').map((med) => med.trim()).filter((med) => med)
        : [];

      // Create record data
      const recordData = {
        title: formData.title,
        description: formData.description,
        patientEmail: formData.patientEmail,
        recordType: formData.recordType,
        metadata: {
          doctorName: formData.doctorName || undefined,
          department: formData.department || undefined,
          dateOfVisit: formData.dateOfVisit || undefined,
          diagnosis: formData.diagnosis || undefined,
          medications: medications.length > 0 ? medications : undefined,
        },
      };

      console.log('📤 Submitting record:', recordData);

      // Submit to API
      const createdRecord = await recordService.createRecord(recordData);

      console.log('✅ Record created successfully:', createdRecord);

      setSuccess(`Record created successfully! Sent to ${formData.patientEmail} for approval.`);

      // Reset form
      setFormData({
        patientEmail: '',
        title: '',
        description: '',
        recordType: 'Lab Report',
        doctorName: '',
        department: '',
        dateOfVisit: '',
        diagnosis: '',
        medications: '',
      });

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      console.error('❌ Upload error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create record';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-lg">
            <UploadIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Upload Medical Record</h1>
            <p className="text-blue-100 mt-1">Create and send records to patients for approval</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-green-800 font-medium">Success!</p>
            <p className="text-green-700 text-sm mt-1">{success}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Patient Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Patient Information
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="patientEmail"
              value={formData.patientEmail}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="patient@example.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the patient's registered email address
            </p>
          </div>
        </div>

        {/* Record Details */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Record Details</h2>
          
          <div className="space-y-4">
            {/* Record Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Record Type <span className="text-red-500">*</span>
              </label>
              <select
                name="recordType"
                value={formData.recordType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {recordTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Record Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Blood Test Results - Dec 2024"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Provide detailed information about the medical record..."
              />
            </div>
          </div>
        </div>

        {/* Medical Information (Optional) */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Additional Information <span className="text-gray-400 text-sm font-normal">(Optional)</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Doctor Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doctor Name
              </label>
              <input
                type="text"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Dr. Smith"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Cardiology"
              />
            </div>

            {/* Date of Visit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Visit
              </label>
              <input
                type="date"
                name="dateOfVisit"
                value={formData.dateOfVisit}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Diagnosis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diagnosis
              </label>
              <input
                type="text"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Hypertension"
              />
            </div>

            {/* Medications */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medications
              </label>
              <input
                type="text"
                name="medications"
                value={formData.medications}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Medication1, Medication2, Medication3"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple medications with commas
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Creating Record...
              </>
            ) : (
              <>
                <UploadIcon className="w-5 h-5 mr-2" />
                Create & Send to Patient
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Fill in the patient's email and record details</li>
          <li>Record is created with status "PENDING"</li>
          <li>Patient receives notification to review the record</li>
          <li>Patient can approve or reject the record</li>
          <li>Once approved, record becomes part of patient's medical history</li>
        </ol>
      </div>
    </div>
  );
};