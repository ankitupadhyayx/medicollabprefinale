import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Database, Download, CheckCircle, Server, History, Settings, RefreshCw } from 'lucide-react';

export const AdminBackup: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [lastBackup, setLastBackup] = useState('2 hours ago');
  
  const handleBackup = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setLastBackup('Just now');
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Backup & Data Retention</h1>
          <p className="text-gray-500">Manage system snapshots and data policies.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Main Backup Card */}
         <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-600">
               <Database size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Full System Backup</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
               Create an encrypted snapshot of all Patient Records, Hospital Registries, and Transaction Logs.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 text-sm flex justify-between items-center max-w-sm mx-auto">
               <span className="text-gray-500 flex items-center"><History size={16} className="mr-2"/> Last Backup:</span>
               <span className="font-bold text-gray-900">{lastBackup}</span>
            </div>

            <Button size="lg" onClick={handleBackup} isLoading={isDownloading} className="shadow-xl shadow-primary-500/20">
               <Download size={20} className="mr-2" /> Download Encrypted Snapshot
            </Button>
         </div>

         {/* Settings & Status */}
         <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
               <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Server size={20} className="mr-2 text-gray-400" /> Storage Status
               </h3>
               <div className="space-y-4">
                  <div>
                     <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Database Usage</span>
                        <span className="font-bold text-gray-900">450 GB / 1 TB</span>
                     </div>
                     <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-primary-600 h-2 rounded-full w-[45%]"></div>
                     </div>
                  </div>
                  <div>
                     <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Document Storage (S3)</span>
                        <span className="font-bold text-gray-900">2.4 TB / 5 TB</span>
                     </div>
                     <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full w-[48%]"></div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
               <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Settings size={20} className="mr-2 text-gray-400" /> Retention Policy
               </h3>
               <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                     <span className="text-sm text-gray-700">Auto-backup Frequency</span>
                     <span className="text-sm font-bold text-gray-900">Daily (00:00 UTC)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                     <span className="text-sm text-gray-700">Log Retention</span>
                     <span className="text-sm font-bold text-gray-900">365 Days</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                     <span className="text-sm text-gray-700">Encryption</span>
                     <span className="text-sm font-bold text-green-600 flex items-center"><CheckCircle size={12} className="mr-1"/> AES-256</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};