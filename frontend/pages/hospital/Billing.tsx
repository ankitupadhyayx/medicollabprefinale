
import React, { useState } from 'react';
import { MOCK_BILLS } from '../../constants';
import { Button } from '../../components/ui/Button';
import { CreditCard, Plus, Download, CheckCircle, Clock, AlertCircle, Search } from 'lucide-react';

export const HospitalBilling: React.FC = () => {
  const [bills, setBills] = useState(MOCK_BILLS);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateInvoice = () => {
    setIsCreating(true);
    setTimeout(() => {
       const newBill = {
          id: `b-${Date.now()}`,
          patientName: 'New Patient',
          date: new Date().toISOString().split('T')[0],
          amount: 250.00,
          status: 'PENDING',
          service: 'Consultation'
       };
       setBills([newBill as any, ...bills]);
       setIsCreating(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
       <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Invoices</h1>
          <p className="text-gray-500">Manage patient payments and insurance claims.</p>
        </div>
        <Button onClick={handleCreateInvoice} isLoading={isCreating}>
           <Plus size={18} className="mr-2" /> Create Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2 text-gray-500">
               <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CreditCard size={20} /></div>
               <span className="text-sm font-medium uppercase">Total Revenue (Nov)</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">$14,250.00</h3>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2 text-gray-500">
               <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><Clock size={20} /></div>
               <span className="text-sm font-medium uppercase">Pending Payments</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">$3,400.00</h3>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2 text-gray-500">
               <div className="p-2 bg-red-50 text-red-600 rounded-lg"><AlertCircle size={20} /></div>
               <span className="text-sm font-medium uppercase">Overdue</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">$1,200.00</h3>
         </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 text-lg">Recent Invoices</h3>
            <div className="relative w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
               <input type="text" placeholder="Search invoice..." className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-lg text-sm outline-none" />
            </div>
         </div>
         <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-100">
               <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Invoice ID</th>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Service / Description</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {bills.map(bill => (
                  <tr key={bill.id} className="hover:bg-gray-50 transition-colors">
                     <td className="px-6 py-4 text-sm font-mono text-gray-500">#{bill.id.toUpperCase()}</td>
                     <td className="px-6 py-4 font-medium text-gray-900">{bill.patientName}</td>
                     <td className="px-6 py-4 text-sm text-gray-600">{bill.service}</td>
                     <td className="px-6 py-4 text-sm text-gray-500">{bill.date}</td>
                     <td className="px-6 py-4 font-bold text-gray-900">${bill.amount.toFixed(2)}</td>
                     <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                           bill.status === 'PAID' ? 'bg-green-100 text-green-800' :
                           bill.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                           'bg-red-100 text-red-800'
                        }`}>
                           {bill.status}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-primary-600 transition-colors">
                           <Download size={18} />
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};
