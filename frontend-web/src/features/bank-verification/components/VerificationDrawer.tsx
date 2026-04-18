import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Download, User as UserIcon, Clock, MapPin, ShieldCheck, Truck } from 'lucide-react';
import type { PendingTransferData } from '../api/bank-verification.api';
import { bankVerificationApi } from '../api/bank-verification.api';
import toast from 'react-hot-toast';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transfer: PendingTransferData | null;
  onSuccess: () => void;
}

export const VerificationDrawer: React.FC<DrawerProps> = ({ isOpen, onClose, transfer, onSuccess }) => {
  const [rejectReason, setRejectReason] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [isSuspicious, setIsSuspicious] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionType, setActionType] = useState<"APPROVED" | "REJECTED" | null>(null);

  if (!isOpen || !transfer) return null;

  const handleVerify = async (status: "APPROVED" | "REJECTED") => {
    if (status === "REJECTED" && !rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setIsSubmitting(true);
    setActionType(status);
    
    try {
      await bankVerificationApi.verifyTransfer(transfer._id, {
        status,
        internalNotes,
        isSuspicious,
        rejectReason: status === "REJECTED" ? rejectReason : undefined
      });
      
      toast.success(`Transfer successfully ${status.toLowerCase()}`);
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to verify transfer");
    } finally {
      setIsSubmitting(false);
      setActionType(null);
    }
  };

  const formattedDate = new Date(transfer.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
  const formattedTime = new Date(transfer.createdAt).toLocaleTimeString([], { 
    hour: '2-digit', minute: '2-digit', hour12: false 
  });

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-[580px] bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-50 transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center px-8 py-6 border-b border-slate-100 bg-white">
          <div className="w-10 h-10 bg-[#3b82f6] rounded-lg flex items-center justify-center text-white mr-4 shadow-lg shadow-blue-100">
            <ShieldCheck size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[#1e293b]">Verification Detail</h2>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              B & W LAUNDRY • BANK VERIFICATION
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all active:scale-95"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
          
          <div className="p-8 space-y-8">
            
            {/* Payment Proof Section - Screenshot 2 style */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] font-extrabold text-slate-400 uppercase tracking-widest">Payment Proof</h3>
                <p className="text-[13px] text-slate-500">Received: {formattedDate}, {formattedTime}</p>
              </div>
              
              <div className="relative group bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
                <div className="aspect-[4/3] w-full bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center border border-slate-100">
                  {transfer.slipImageUrl ? (
                    <img 
                      src={transfer.slipImageUrl} 
                      alt="Payment Slip" 
                      className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <AlertCircle size={32} />
                      <span className="text-sm font-medium">No image available</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Row */}
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center overflow-hidden">
                  {transfer.userId?.avatar ? (
                    <img src={transfer.userId.avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={24} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-[#1e293b]">{transfer.userId?.firstName} {transfer.userId?.lastName}</h4>
                  <p className="text-[13px] text-slate-500">{transfer.userId?.email}</p>
                </div>
                <a 
                  href={transfer.slipImageUrl}
                  download
                  target="_blank"
                  className="bg-[#3b82f6] hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-[13px] flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-100"
                >
                  <Download size={16} /> Download Slip
                </a>
              </div>
            </section>

            {/* Order & Customer Details - Screenshot 2 style */}
            <section>
              <h3 className="text-[13px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">Order & Customer</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Order ID</p>
                  <p className="text-lg font-black text-[#1e293b]">#{transfer.paymentId?.orderId?.orderNo}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border-l-[4px] border-[#3b82f6] shadow-sm">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Token Number</p>
                  <p className="text-lg font-black text-[#3b82f6]">{transfer.paymentId?.orderId?.tokenNumber || 'A42-B'}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                <div className="flex justify-between p-4 text-[14px]">
                  <span className="text-slate-500 font-medium">Service Type</span>
                  <span className="font-bold text-[#1e293b] flex items-center gap-2 text-right">
                    <Truck size={16} className="text-slate-400" />
                    {transfer.paymentId?.orderId?.serviceId?.name || 'Full Service + Delivery'}
                  </span>
                </div>
                <div className="flex justify-between p-4 text-[14px]">
                  <span className="text-slate-500 font-medium">Item Count</span>
                  <span className="font-bold text-[#1e293b] text-right">
                    {transfer.paymentId?.orderId?.weightKg ? `${transfer.paymentId.orderId.weightKg}kg` : "3 Bags (Approx 12kg)"}
                  </span>
                </div>
                <div className="flex justify-between p-4 text-[14px]">
                  <span className="text-slate-500 font-medium">Time Window</span>
                  <span className="font-bold text-[#1e293b] text-right flex items-center gap-2">
                    <Clock size={16} className="text-slate-400" />
                    {transfer.paymentId?.orderId?.reservedDateTime 
                      ? new Date(transfer.paymentId.orderId.reservedDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : "Today, 18:00 - 20:00"}
                  </span>
                </div>
                <div className="p-4 text-[13px]">
                  <span className="block text-slate-500 font-medium mb-1.5">Pickup/Delivery Address</span>
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
                    <span className="font-bold text-[#1e293b] leading-relaxed">
                      {transfer.paymentId?.orderId?.pickupAddress || "34, Isurupura, Malabe."}
                    </span>
                  </div>
                </div>
              </div>

              {/* Special Instructions - Screenshot 2 style */}
              <div className="mt-4 bg-[#fffbeb] border border-[#fef3c7] rounded-xl p-5">
                 <p className="text-[11px] font-extrabold text-[#92400e] uppercase tracking-wider mb-2">Special Instructions</p>
                 <p className="text-[14px] text-[#92400e] italic leading-relaxed font-medium">
                   "{transfer.paymentId?.orderId?.notes || "No special instructions provided."}"
                 </p>
              </div>
            </section>

            {/* Bank Details Section - OCR Integration - Screenshot 3 style */}
            <section>
              <h3 className="text-[13px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">Bank Details</h3>
              
              <div className="bg-[#eff6ff] border border-[#dbeafe] rounded-2xl p-6 relative">
                 <div className="flex items-center justify-between mb-1">
                   <h4 className="font-extrabold text-[#1d4ed8] text-[15px]">{transfer.bankName}</h4>
                   <span className="bg-[#dcfce7] text-[#166534] text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider">
                     Verified Merchant
                   </span>
                 </div>

                 {/* OCR Result Card */}
                 <div className="mt-4 bg-white rounded-xl p-5 border border-[#bfdbfe]">
                    <div className="flex items-center justify-between mb-4">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Server Ref ID</p>
                       {transfer.ocrStatus === 'MATCHED' ? (
                         <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                           <CheckCircle size={14} /> System Verified
                         </span>
                       ) : (
                         <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
                           <AlertTriangle size={14} /> Manual Review
                         </span>
                       )}
                    </div>
                    <p className={`text-2xl font-black tracking-tight ${transfer.ocrStatus === 'MATCHED' ? 'text-slate-900' : 'text-slate-800'}`}>
                      {transfer.systemRefId}
                    </p>
                    
                    {transfer.ocrStatus === 'MISMATCHED' && (
                      <div className="mt-3 flex items-center gap-2 text-rose-500 font-bold text-[11px]">
                         <AlertCircle size={14} />
                         <span>Reference ID must match remark exactly</span>
                      </div>
                    )}
                 </div>

                 <div className="mt-4 flex items-center gap-2 text-[14px]">
                    <span className="text-slate-500 font-medium shrink-0">Customer Remark:</span>
                    <span className="font-bold text-[#1e293b] truncate bg-white/50 px-2 py-0.5 rounded">{transfer.referenceNo}</span>
                 </div>
              </div>
            </section>

            {/* Admin Actions - Screenshot 3 style */}
            <section className="space-y-6">
              <h3 className="text-[13px] font-extrabold text-slate-400 uppercase tracking-widest">Admin Actions</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Internal Notes</label>
                  <textarea 
                    className="w-full text-[14px] border border-slate-200 rounded-2xl p-4 bg-white focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none"
                    rows={4}
                    placeholder="Add private notes for other admins..."
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                  />
                </div>

                <div className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${isSuspicious ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'}`}>
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                      checked={isSuspicious}
                      onChange={(e) => setIsSuspicious(e.target.checked)}
                    />
                    <span className={`text-[15px] font-bold flex items-center gap-2 ${isSuspicious ? 'text-rose-700' : 'text-slate-600'}`}>
                      <AlertTriangle size={18} /> Flag as suspicious
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Buttons - Screenshot 3 style */}
              <div className="flex gap-4 pt-2">
                <button 
                  className="flex-1 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  onClick={() => handleVerify("APPROVED")}
                  disabled={isSubmitting}
                >
                  {isSubmitting && actionType === "APPROVED" ? (
                    <Clock className="animate-spin" size={20} />
                  ) : (
                    <><CheckCircle size={20} /> Approve</>
                  )}
                </button>
                <button 
                  className="flex-1 h-14 rounded-2xl bg-[#e11d48] hover:bg-rose-700 text-white font-black transition-all shadow-lg shadow-rose-100 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  onClick={() => handleVerify("REJECTED")}
                  disabled={isSubmitting}
                >
                   {isSubmitting && actionType === "REJECTED" ? (
                    <Clock className="animate-spin" size={20} />
                  ) : (
                    <><X size={20} /> Reject</>
                  )}
                </button>
              </div>

              {/* Rejection Reason Input (Visible if rejecting or for context) */}
              <div className="mt-4">
                 <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Rejection Reason (Required for Reject)</label>
                 <textarea 
                    className="w-full text-[14px] border border-slate-200 rounded-2xl p-4 bg-white focus:bg-white focus:ring-4 focus:ring-rose-50 focus:border-rose-500 transition-all outline-none"
                    rows={2}
                    placeholder="Provide a reason for rejection..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                 />
              </div>
            </section>

            {/* Audit Info / Timeline - Screenshot 3 style */}
            <section>
               <h3 className="text-[13px] font-extrabold text-slate-400 uppercase tracking-widest mb-6 px-1">Audit Info</h3>
               <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-1 before:bottom-1 before:w-[2px] before:bg-slate-100">
                  {/* Step 1 */}
                  <div className="relative">
                    <div className="absolute -left-8 top-1 w-[24px] h-[24px] rounded-full bg-emerald-500 border-4 border-white shadow-sm flex items-center justify-center z-10" />
                    <div>
                       <p className="text-[14px] font-bold text-[#1e293b]">Payment Submitted</p>
                       <p className="text-[12px] text-slate-500 mt-0.5">{formattedDate} • {formattedTime} by Customer</p>
                    </div>
                  </div>
                  {/* Step 2 */}
                  <div className="relative">
                    <div className="absolute -left-8 top-1 w-[24px] h-[24px] rounded-full bg-blue-500 border-4 border-white shadow-sm z-10" />
                    <div>
                       <p className="text-[14px] font-bold text-[#1e293b]">Review Started</p>
                       <p className="text-[12px] text-slate-500 mt-0.5">By Admin Portal • Automatic OCR Completed</p>
                    </div>
                  </div>
                  {/* Step 3 */}
                  <div className="relative opacity-60">
                    <div className="absolute -left-8 top-1 w-[24px] h-[24px] rounded-full bg-slate-200 border-4 border-white shadow-sm z-10" />
                    <div>
                       <p className="text-[14px] font-bold text-slate-400">Approval Pending</p>
                       <p className="text-[12px] text-slate-400 mt-0.5 italic">Expected within 15 minutes</p>
                    </div>
                  </div>
               </div>
            </section>

          </div>
        </div>
        
        {/* Footer Banner - Screenshot 3 style */}
        <div className="mx-8 my-6 px-6 py-4 bg-[#fff9f2] border border-[#ffedd5] rounded-2xl flex items-center justify-center gap-3">
          <Clock className="text-[#9a3412] " size={18} />
          <p className="text-[12px] font-black text-[#9a3412] uppercase tracking-widest">
            Awaiting Admin Final Action
          </p>
        </div>

      </div>
    </>
  );
};

