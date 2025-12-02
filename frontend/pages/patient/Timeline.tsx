import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { FileText, Calendar, Building, CheckCircle, Sparkles, Search, Download, Share2 } from "lucide-react";
import { aiService } from "../../services/aiService";
import { recordService, MedicalRecord } from "../../services/recordService";

export const PatientTimeline = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [summarizingId, setSummarizingId] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<{ [key: string]: string }>({});

  // Fetch patient's medical records timeline
  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const user = localStorage.getItem('user');
        if (!user) {
          setError("Please login to view your timeline");
          return;
        }

        const parsedUser = JSON.parse(user);
        const patientId = parsedUser.user.id;

        const data = await recordService.getTimeline(patientId);
        setRecords(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load timeline");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeline();
  }, []);

  // Summarize a medical record using AI
  const handleSummarize = async (recordId: string) => {
    setSummarizingId(recordId);
    try {
      const analysis = await aiService.analyzeRecord(recordId);
      setSummaries(prev => ({
        ...prev,
        [recordId]: analysis.summary
      }));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to generate summary");
    } finally {
      setSummarizingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Medical Timeline</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Search className="w-4 h-4 mr-2" />
            Search Records
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Timeline
          </Button>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Records Yet</h3>
          <p className="text-gray-500">Your medical records will appear here once hospitals upload them.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div
              key={record._id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    record.status === 'approved' ? 'bg-green-100' :
                    record.status === 'rejected' ? 'bg-red-100' :
                    'bg-yellow-100'
                  }`}>
                    <FileText className={`w-6 h-6 ${
                      record.status === 'approved' ? 'text-green-600' :
                      record.status === 'rejected' ? 'text-red-600' :
                      'text-yellow-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{record.title}</h3>
                    <p className="text-gray-600 mt-1">{record.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        Hospital
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'approved' ? 'bg-green-100 text-green-700' :
                        record.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => handleSummarize(record._id)}
                  disabled={summarizingId === record._id}
                  variant="outline"
                  size="sm"
                >
                  {summarizingId === record._id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Summary
                    </>
                  )}
                </Button>
              </div>

              {summaries[record._id] && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI-Generated Summary
                  </h4>
                  <p className="text-blue-800">{summaries[record._id]}</p>
                </div>
              )}

              {record.rejectionReason && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2">Rejection Reason</h4>
                  <p className="text-red-800">{record.rejectionReason}</p>
                </div>
              )}

              {record.files && record.files.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Attachments</h4>
                  <div className="flex flex-wrap gap-2">
                    {record.files.map((file, index) => (
                      <a
                        key={index}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">File {index + 1}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientTimeline;
