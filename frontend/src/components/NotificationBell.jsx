import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import API from "../services/api";

function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [show, setShow] = useState(false);

    const fetchNotifications = async () => {
        try {
            const { data } = await API.get("/notifications");
            setNotifications(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markAsRead = async (id) => {
        await API.put(`/notifications/${id}/read`);
        fetchNotifications();
    };

    return (
        <div className="relative">
            <button onClick={() => setShow(!show)} className="relative p-2 text-gray-600 hover:text-blue-600 transition">
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {show && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden transform origin-top-right animate-in fade-in zoom-in-95">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-blue-50/50">
                        <h4 className="font-bold text-blue-800">Notifications</h4>
                        <span className="text-xs text-blue-500">{unreadCount} New</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="p-8 text-center text-gray-400 italic">No notifications yet.</p>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n._id}
                                    onClick={() => markAsRead(n._id)}
                                    className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition ${!n.isRead ? "bg-blue-50/30 font-medium" : "opacity-75"}`}
                                >
                                    <p className="text-sm text-gray-700">{n.message}</p>
                                    <span className="text-[10px] text-gray-400 mt-1 block">
                                        {new Date(n.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationBell;
