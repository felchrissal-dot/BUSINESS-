import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, LogOut, ClipboardList, ArrowLeft, X, Search, Star, MessageSquare } from 'lucide-react';

interface OwnerPortalProps {
  onBack: () => void;
}

export default function OwnerPortal({ onBack }: OwnerPortalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [reservations, setReservations] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reservationToConfirm, setReservationToConfirm] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'reservations' | 'feedback'>('reservations');

  useEffect(() => {
    const loadReservations = () => {
      const stored = localStorage.getItem('steves_reservations');
      try {
        if (stored) {
          const parsed = JSON.parse(stored);
          setReservations(Array.isArray(parsed) ? parsed : []);
        }
      } catch (e) {
        setErrorMessage('Failed to load reservations. Please try again.');
        setReservations([]);
      }
      
      const storedFeedback = localStorage.getItem('steves_feedback');
      try {
        if (storedFeedback) {
          const parsedFeedback = JSON.parse(storedFeedback);
          setFeedbacks(Array.isArray(parsedFeedback) ? parsedFeedback : []);
        }
      } catch(e) {
        setFeedbacks([]);
      }
    };
    
    loadReservations();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'LOHMAN') {
      setIsAuthenticated(true);
    } else {
      setErrorMessage('Incorrect Password');
    }
  };

  const confirmMarkAsDone = () => {
    if (!reservationToConfirm) return;
    
    console.log('markAsDone: Button clicked, reservationToConfirm:', reservationToConfirm);

    const stored = localStorage.getItem('steves_reservations');
    const currentReservations = stored ? JSON.parse(stored) : [];
    
    console.log('markAsDone: currentReservations from localStorage:', currentReservations);

    // Filter out the specific reservation using string comparison to handle type discrepancies
    const updatedReservations = currentReservations.filter(
      (r: any) => String(r.timestamp) !== String(reservationToConfirm.timestamp)
    );

    console.log('markAsDone: updatedReservations:', updatedReservations);

    // Update localStorage
    localStorage.setItem('steves_reservations', JSON.stringify(updatedReservations));

    // Update component state
    setReservations(updatedReservations);
    setReservationToConfirm(null);
  };

  const updateStatus = (reservationToUpdate: any, newStatus: string) => {
    const stored = localStorage.getItem('steves_reservations');
    const currentReservations = stored ? JSON.parse(stored) : [];
    
    const updatedReservations = currentReservations.map((r: any) => {
      if (String(r.timestamp) === String(reservationToUpdate.timestamp)) {
        return { ...r, status: newStatus };
      }
      return r;
    });

    localStorage.setItem('steves_reservations', JSON.stringify(updatedReservations));
    setReservations(updatedReservations);
  };

  const togglePin = (reservationToToggle: any) => {
    const stored = localStorage.getItem('steves_reservations');
    const currentReservations = stored ? JSON.parse(stored) : [];
    
    const updatedReservations = currentReservations.map((r: any) => {
      if (String(r.timestamp) === String(reservationToToggle.timestamp)) {
        return { ...r, pinned: !r.pinned };
      }
      return r;
    });

    localStorage.setItem('steves_reservations', JSON.stringify(updatedReservations));
    setReservations(updatedReservations);
  };

  useEffect(() => {
    console.log('DEBUG: Reservations state updated:', reservations);
  }, [reservations]);

  console.log('OwnerPortal rendering, reservations count:', reservations.length);
  const pendingReservations = reservations.filter((res: any) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = res.name?.toLowerCase().includes(query);
    const dateMatch = res.date?.toLowerCase().includes(query);
    return nameMatch || dateMatch;
  }).sort((a: any, b: any) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  const getStatusBadge = (status: string = 'pending') => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full uppercase tracking-wider">Confirmed</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full uppercase tracking-wider">Completed</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full uppercase tracking-wider">Cancelled</span>;
      case 'pending':
      default:
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full uppercase tracking-wider">Pending</span>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FDFBF7]">
        <div className="p-8 bg-white border border-[#D4AF37]/50 shadow-lg w-full max-w-sm">
          <button 
            onClick={onBack} 
            className="mb-6 flex items-center text-gray-500 hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to Website
          </button>
          <form onSubmit={handleLogin}>
            <h2 className="font-serif text-2xl mb-6 text-[#2D3A2D] flex items-center gap-2">
              <Lock size={24} /> Owner Access
            </h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full p-3 mb-6 border border-[#D4AF37]/50"
              required
            />
            <button type="submit" className="w-full px-8 py-3 bg-[#D4AF37] text-white font-semibold hover:bg-[#b8972f] transition-all">
              Unlock Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-3xl text-[#2D3A2D] flex items-center gap-2">
          {activeTab === 'reservations' ? <ClipboardList /> : <MessageSquare />}
          {activeTab === 'reservations' ? 'Incoming Reservations' : 'Customer Feedback'}
        </h2>
        <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-2 text-[#2D3A2D] hover:text-[#D4AF37]">
          <LogOut size={20} /> Logout
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('reservations')}
          className={`pb-2 px-1 text-lg font-semibold ${activeTab === 'reservations' ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]' : 'text-gray-500 hover:text-[#2D3A2D]'}`}
        >
          Reservations
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`pb-2 px-1 text-lg font-semibold ${activeTab === 'feedback' ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]' : 'text-gray-500 hover:text-[#2D3A2D]'}`}
        >
          Feedback
        </button>
      </div>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {errorMessage}
        </div>
      )}

      {activeTab === 'reservations' ? (
        <>
          <div className="mb-8 relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-shadow bg-white"
            />
          </div>
          
          <div className="grid gap-6">
            {pendingReservations.length === 0 ? (
              <p className="text-gray-500 italic">No incoming reservations.</p>
            ) : (
              pendingReservations.map((res: any) => (
                <motion.div 
                  key={res.timestamp} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-6 border border-[#D4AF37]/30 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-bold text-lg">{res.name}</p>
                        {getStatusBadge(res.status)}
                      </div>
                      <p className="font-medium">Date: {res.date}</p>
                      <p>Time: {res.time}</p>
                      <p>Guests: {res.guests}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-400 block mb-2">Received: {new Date(res.timestamp).toLocaleString()}</span>
                      <div className="flex gap-2">
                        <select
                          value={res.status || 'pending'}
                          onChange={(e) => updateStatus(res, e.target.value)}
                          className="p-2 border border-gray-300 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer bg-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button 
                          onClick={() => togglePin(res)} 
                          className={`p-2 border transition-colors ${res.pinned ? 'bg-[#D4AF37] text-white border-[#D4AF37]' : 'text-gray-400 border-gray-300 hover:text-[#D4AF37] hover:border-[#D4AF37]'}`} 
                          title={res.pinned ? "Unpin" : "Pin to top"}
                        >
                          <Star size={18} fill={res.pinned ? "currentColor" : "none"} />
                        </button>
                        <button onClick={() => setReservationToConfirm(res)} className="px-4 py-2 bg-[#D4AF37] text-white text-sm hover:bg-[#b8972f] uppercase tracking-wider font-semibold rounded-none transition-colors">
                          Mark Done
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="grid gap-6">
          {feedbacks.length === 0 ? (
            <p className="text-gray-500 italic">No feedback received yet.</p>
          ) : (
            feedbacks.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((fb: any, idx: number) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 border border-[#D4AF37]/30 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-1 items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} className={star <= fb.rating ? "text-[#D4AF37] fill-current" : "text-gray-300"} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{new Date(fb.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-gray-800 italic mb-4">"{fb.comment}"</p>
                <p className="text-sm font-semibold text-gray-600">- {fb.name || 'Anonymous'}</p>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {reservationToConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 max-w-md w-full shadow-2xl border border-[#D4AF37]/30"
          >
            <h3 className="font-serif text-2xl mb-4 text-[#2D3A2D]">Confirm Action</h3>
            <p className="mb-6 text-gray-700">Are you sure you want to mark this reservation for {reservationToConfirm.name} as done? This will remove it from the list.</p>
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setReservationToConfirm(null)}
                className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmMarkAsDone}
                className="px-6 py-2 bg-[#D4AF37] text-white hover:bg-[#b8972f] transition-colors"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
