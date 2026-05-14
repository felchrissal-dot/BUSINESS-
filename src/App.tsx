/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChefHat, Star, Users, MapPin, Clock, Utensils, Wheat, UtensilsCrossed, Cake, Phone, MessageSquare } from 'lucide-react';
import OwnerPortal from './components/OwnerPortal';

export default function App() {
  const [showCta, setShowCta] = useState(false);
  const [showOwner, setShowOwner] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState({ name: '', comment: '', rating: 5 });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA if scrolled past the hero section
      if (window.scrollY > 400) {
        setShowCta(true);
      } else {
        setShowCta(false);
      }

      // Hide CTA when footer is reached
      const footer = document.querySelector('footer');
      if (footer) {
        const footerPosition = footer.getBoundingClientRect().top;
        if (footerPosition < window.innerHeight) {
          setShowCta(false);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [reservation, setReservation] = useState({ name: '', date: '', time: '', guests: '1' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const confirmSubmission = () => {
    // Save to local storage
    const existing = JSON.parse(localStorage.getItem('steves_reservations') || '[]');
    localStorage.setItem('steves_reservations', JSON.stringify([...existing, { ...reservation, timestamp: new Date().toISOString(), status: 'pending' }]));
    
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    setReservation({ name: '', date: '', time: '', guests: '1' });
    setShowConfirmModal(false);
  };

  const submitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem('steves_feedback') || '[]');
    localStorage.setItem('steves_feedback', JSON.stringify([...existing, { ...feedback, timestamp: new Date().toISOString() }]));
    
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setShowFeedbackModal(false);
      setFeedback({ name: '', comment: '', rating: 5 });
    }, 3000);
  };

  if (showOwner) return <OwnerPortal onBack={() => setShowOwner(false)} />;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-900 font-sans">
      {/* Hero Section */}
      <header className="relative h-screen flex flex-col items-center justify-center text-center p-6 bg-[#2D3A2D] text-[#FDFBF7]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="z-10"
        >
          <h1 className="font-serif text-6xl md:text-8xl mb-6">Steve's Table</h1>
          <p className="text-xl md:text-2xl font-light mb-10 max-w-xl mx-auto">
            Traditional comfort, elevated to a luxury experience. The heart of Lohman dining.
          </p>
          <a href="#menu" className="px-8 py-4 bg-[#D4AF37] text-white font-semibold rounded-none hover:bg-[#b8972f] transition-colors">
            View Our Menu
          </a>
        </motion.div>
      </header>

      {/* About Section */}
      <motion.section 
        className="py-20 px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <ChefHat className="mx-auto mb-6 text-[#D4AF37]" size={48} />
          <h2 className="font-serif text-4xl mb-8">Grandma's Wisdom, Modern Luxury</h2>
          <p className="text-lg leading-relaxed text-gray-700">
            For decades, we've served the soul of comfort food. At Steve's Table, 
            every dish is crafted with the same love as a family Sunday dinner, 
            using premium ingredients that turn simple recipes into extraordinary moments.
          </p>
        </div>
      </motion.section>

      {/* Features/Highlights */}
      <section className="py-20 bg-[#F4EFE6] px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-center">
          {[
            { icon: Users, title: "Family Values", text: "Treating every guest like our own family." },
            { icon: Star, title: "Award-Winning", text: "Renowned for our crispy fried chicken." },
            { icon: Clock, title: "Generosity", text: "Satisfying value, generous portions." },
          ].map((item, i) => (
            <motion.div key={i} whileHover={{ y: -10 }} className="p-6">
              <item.icon className="mx-auto mb-6 text-[#D4AF37]" size={40} />
              <h3 className="font-semibold text-2xl mb-4">{item.title}</h3>
              <p className="text-gray-600">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Menu / CTA Section */}
      <motion.section 
        id="menu" 
        className="py-20 px-6 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="font-serif text-4xl mb-12 text-center">The Signature Experience</h2>
        <div className="bg-white p-10 border border-[#D4AF37]/30 shadow-lg">
          <h3 className="text-3xl mb-8 text-[#2D3A2D] font-serif text-center">All-You-Can-Eat Fried Chicken Dinner</h3>
          
          <div className="grid md:grid-cols-2 gap-8 text-gray-700">
            <div className="col-span-2">
              <h4 className="font-serif text-2xl mb-4 text-[#D4AF37]">Ala Carte</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <p>French Fries: $2.50</p>
                <p>Onion Rings: $4.25</p>
                <p>Ham (3 Pieces): $7.70</p>
                <p>1 pc Chicken (white): $2.60</p>
                <p>1 pc Chicken (dark): $2.40</p>
                <p>3 Fish Filets: $10.10</p>
                <p>Hot Wings: $1.30 each</p>
              </div>
            </div>
            
            <div className="col-span-2">
              <h4 className="font-serif text-2xl mb-4 text-[#D4AF37]">Food for Four (Carry-out Only)</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <p>12 piece Chicken Basket: $37.95</p>
                <p>12 piece All White Basket: $44.95</p>
                <p>12 piece Catfish Bucket: $49.95</p>
              </div>
              <p className="mt-2 text-sm italic">Includes 24 oz. Real Homemade Mashed Potatoes & 12 oz. Gravy, 24 oz. Green Beans, Fresh Bread with Butter.</p>
            </div>
          </div>
          
          <div className="text-4xl text-[#D4AF37] font-bold text-center mt-12">$70 for a Family of Six</div>
          
          <div className="mt-12 bg-[#FDFBF7] p-8 border border-[#D4AF37]/50">
            {isSubmitted ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-[#2D3A2D] font-serif text-xl py-8">
                Thank you! Your table request has been received. We'll contact you shortly to confirm.
              </motion.div>
            ) : (
              <form onSubmit={handleOpenConfirm} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input 
                  type="text" 
                  placeholder="Your Name"
                  value={reservation.name}
                  onChange={(e) => setReservation({...reservation, name: e.target.value})}
                  className="p-3 border border-[#D4AF37]/50 bg-white md:col-span-2"
                  required 
                />
                <input 
                  type="date" 
                  value={reservation.date}
                  onChange={(e) => setReservation({...reservation, date: e.target.value})}
                  className="p-3 border border-[#D4AF37]/50 bg-white"
                  required 
                />
                <input 
                  type="time" 
                  value={reservation.time}
                  onChange={(e) => setReservation({...reservation, time: e.target.value})}
                  className="p-3 border border-[#D4AF37]/50 bg-white"
                  required 
                />
                <input 
                  type="number" 
                  min="1" 
                  max="20" 
                  placeholder="Number of Guests"
                  value={reservation.guests}
                  onChange={(e) => setReservation({...reservation, guests: e.target.value})}
                  className="p-3 border border-[#D4AF37]/50 bg-white md:col-span-2"
                  required 
                />
                <motion.button 
                  type="submit" 
                  className="md:col-span-2 px-8 py-3 bg-[#D4AF37] text-white font-semibold hover:bg-[#b8972f] transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Request Reservation
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </motion.section>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[#FDFBF7] p-8 max-w-sm w-full border-2 border-[#D4AF37]">
            <h3 className="text-xl font-serif mb-4 text-[#2D3A2D]">Confirm Reservation</h3>
            <p className="mb-4 text-gray-700">Please confirm your details:</p>
            <div className="space-y-2 mb-6 text-sm">
              <p><strong>Name:</strong> {reservation.name}</p>
              <p><strong>Date:</strong> {reservation.date}</p>
              <p><strong>Time:</strong> {reservation.time}</p>
              <p><strong>Guests:</strong> {reservation.guests}</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                onClick={confirmSubmission}
                className="flex-1 px-4 py-2 bg-[#D4AF37] text-white hover:bg-[#b8972f]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section className="py-20 px-6 bg-[#FDFBF7]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl mb-12">Contact Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center gap-4">
              <MapPin className="text-[#D4AF37]" size={32} />
              <p className="text-gray-700">GJ9P+MP Lohman, Missouri, USA</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Phone className="text-[#D4AF37]" size={32} />
              <p className="text-gray-700">+1 (573) 782-0102</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2D3A2D] text-[#FDFBF7] py-12 px-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <MapPin size={24} />
          <p>Lohman, USA</p>
          <div className="text-sm opacity-70">
            &copy; 2026 Steve's Table. All rights reserved.
            <button onClick={() => setShowOwner(true)} className="ml-4 underline hover:text-[#D4AF37]">Owner Access</button>
          </div>
        </div>
      </footer>
      
      {/* Feedback floating button */}
      <motion.button
        className="fixed bottom-24 right-6 bg-[#D4AF37] text-white p-4 rounded-full shadow-lg z-40 hover:bg-[#b8972f] transition-all"
        onClick={() => setShowFeedbackModal(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Leave Feedback"
      >
        <MessageSquare size={24} />
      </motion.button>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[#FDFBF7] p-8 max-w-md w-full border-2 border-[#D4AF37] relative">
            <button 
              onClick={() => setShowFeedbackModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <h3 className="text-2xl font-serif mb-6 text-[#2D3A2D] flex items-center gap-2">
              <MessageSquare size={24} className="text-[#D4AF37]" />
              Leave Feedback
            </h3>
            
            {feedbackSubmitted ? (
              <div className="text-center py-8">
                <div className="text-[#D4AF37] mb-4 flex justify-center text-5xl">✓</div>
                <p className="text-xl font-serif text-[#2D3A2D]">Thank you for your feedback!</p>
              </div>
            ) : (
              <form onSubmit={submitFeedback} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Name (Optional)</label>
                  <input 
                    type="text" 
                    value={feedback.name}
                    onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                    className="w-full p-3 border border-[#D4AF37]/50 focus:outline-none focus:border-[#D4AF37]"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedback({ ...feedback, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star 
                          size={28} 
                          className={star <= feedback.rating ? "text-[#D4AF37] fill-current" : "text-gray-300"} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Comment</label>
                  <textarea 
                    value={feedback.comment}
                    onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                    className="w-full p-3 border border-[#D4AF37]/50 focus:outline-none focus:border-[#D4AF37] min-h-[100px]"
                    placeholder="Tell us about your experience..."
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-3 bg-[#D4AF37] text-white hover:bg-[#b8972f] uppercase tracking-wider font-semibold transition-colors"
                >
                  Submit Feedback
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Sticky CTA */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: showCta ? 1 : 0, y: showCta ? 0 : 100 }}
        className="fixed bottom-0 left-0 w-full bg-[#2D3A2D] text-[#FDFBF7] p-4 text-center z-50 flex justify-center items-center gap-4 border-t border-[#D4AF37]"
      >
        <span className="hidden md:inline font-serif text-lg">Ready to experience comfort dining?</span>
        <a href="#menu" className="px-6 py-2 bg-[#D4AF37] text-white font-semibold rounded-none hover:bg-[#b8972f] transition-colors">
          Book Your Table
        </a>
      </motion.div>
    </div>
  );
}
