import { X, Mail, Calendar, Package, RotateCw } from 'lucide-react';
import { useState } from 'react';

interface Notification {
    _id: string;
    itemName: string;
    quantityRequired: string;
    recipientEmail: string;
    sentAt: string;
    status: string;
}

interface NotificationHistoryProps {
    notifications: Notification[];
    onClose: () => void;
    onRefresh: () => Promise<void>;
}

export function NotificationHistory({ notifications, onClose, onRefresh }: NotificationHistoryProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await onRefresh();
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" onClick={onClose}></div>
            <div className="bg-white rounded-[1.5rem] shadow-2xl w-full max-w-3xl relative z-10 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-white">
                    <div>
                        <h3 className="text-xl font-extrabold text-gray-900">Email Notification History</h3>
                        <p className="text-sm text-gray-500 mt-1 font-medium">Tracking all low-stock alerts sent to suppliers.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-0 max-h-[60vh] overflow-y-auto no-scrollbar bg-gray-50/30">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-white shadow-sm z-10">
                            <tr>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Date & Time</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Item / Recipient</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Quantity</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {notifications.length > 0 ? (
                                notifications.map((notif) => (
                                    <tr key={notif._id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center space-x-3">
                                                <Calendar size={14} className="text-gray-400" />
                                                <span className="text-[13px] font-medium text-gray-900">
                                                    {new Date(notif.sentAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-bold text-gray-900 flex items-center">
                                                    <Package size={14} className="mr-1.5 text-blue-500" />
                                                    {notif.itemName}
                                                </span>
                                                <span className="text-[11px] text-gray-400 flex items-center mt-1">
                                                    <Mail size={12} className="mr-1.5" />
                                                    {notif.recipientEmail}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[13px] font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded-md">
                                                {notif.quantityRequired}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                                notif.status === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                                {notif.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                                        No notification history found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-between items-center">
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="flex items-center space-x-2 px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-all disabled:opacity-50"
                    >
                        <RotateCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                        <span>{isRefreshing ? 'Refreshing...' : 'Refresh History'}</span>
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-xl border border-gray-200 transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
