import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPhoneAlt, FaMapMarkerAlt, FaRegClock, FaUser, FaRegEnvelope, FaChevronRight, FaHome, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', content: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const offices = [
    { name: 'America Office', address: '259 NYD, Newyork', img: 'America' },
    { name: 'Germany Office', address: '259 NYD, Newyork', img: 'Germany' },
    { name: 'Dubai Office', address: '259 NYD, Newyork', img: 'Dubai' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.content) {
      setStatus({ type: 'error', message: 'Please fill in all fields.' });
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/messages`, formData);
      setStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully. We will get back to you soon.' });
      setFormData({ name: '', email: '', content: '' });
      
      // Auto-fade success message
      setTimeout(() => setStatus({ type: '', message: '' }), 5000);
    } catch (err) {
      console.error("Error submitting message:", err);
      setStatus({ type: 'error', message: 'Something went wrong. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b py-10 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Contact Us</h1>
          <div className="text-xs font-bold text-gray-400 flex items-center gap-2 uppercase tracking-tighter">
            <Link to="/" className="flex items-center gap-1 hover:text-red-600 transition-colors"><FaHome size={10} /> DLK Technologies</Link>
            <FaChevronRight size={8} />
            <span className="text-red-600">Contact</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        
        {/* Office Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {offices.map((office, i) => (
            <div key={i} className="bg-white rounded-[40px] p-6 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group flex flex-col items-center text-center">
              <div className="w-full aspect-[4/3] bg-gray-100 rounded-[30px] overflow-hidden mb-8 relative">
                <div className="w-full h-full flex items-center justify-center text-gray-300 font-black uppercase text-xs group-hover:scale-110 transition-transform duration-700 bg-gray-900/5">{office.img} Office Photo</div>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-red-600 transition-colors uppercase tracking-tight">{office.name}</h3>
              <p className="text-gray-400 font-bold text-sm">{office.address}</p>
            </div>
          ))}
        </div>

        {/* Info & Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Office Address Details */}
          <div className="bg-white rounded-[40px] p-12 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">Germany Office Address</h2>
            <p className="text-gray-400 font-bold leading-relaxed mb-12">
              Completely recaptualize 24/7 communities via standards compliant metrics whereas web-enabled content.
            </p>

            <div className="flex flex-col gap-10">
              <div className="flex gap-6 group">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 flex-shrink-0 group-hover:bg-red-600 group-hover:text-white transition-all shadow-lg shadow-red-50">
                  <FaPhoneAlt size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-gray-900 mb-2 uppercase tracking-tighter">Phone & Email</h4>
                  <p className="text-gray-400 font-bold tracking-tight">+1(210) 2501 21503</p>
                  <p className="text-gray-400 font-bold tracking-tight">contact@dlktechnologies.com</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 flex-shrink-0 group-hover:bg-red-600 group-hover:text-white transition-all shadow-lg shadow-red-50">
                  <FaMapMarkerAlt size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-gray-900 mb-2 uppercase tracking-tighter">Office Address</h4>
                  <p className="text-gray-400 font-bold leading-relaxed">
                    258 Dancing Street, Miland Line,<br />
                    HUYI 21563, NewYork
                  </p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 flex-shrink-0 group-hover:bg-red-600 group-hover:text-white transition-all shadow-lg shadow-red-50">
                  <FaRegClock size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-gray-900 mb-2 uppercase tracking-tighter">Working Hours</h4>
                  <p className="text-gray-400 font-bold">
                    7:00am – 6:00pm ( Mon – Fri )<br />
                    Sat, Sun & Holiday Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-white rounded-[40px] p-12 border border-gray-100 shadow-sm relative overflow-hidden">
            <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Leave a Message</h2>
            <p className="text-gray-400 font-bold mb-10">We're Ready To Help You</p>

            {status.message && (
              <div className={`mb-8 p-6 rounded-3xl flex items-center gap-4 animate-fade-in ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                {status.type === 'success' ? <FaCheckCircle className="text-xl shrink-0" /> : <FaExclamationCircle className="text-xl shrink-0" />}
                <p className="text-sm font-black uppercase tracking-tight">{status.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-full py-5 px-10 outline-none focus:border-red-600 transition-all font-bold text-sm shadow-sm"
                  />
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-red-600 transition-colors" />
                </div>
                <div className="relative group">
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-full py-5 px-10 outline-none focus:border-red-600 transition-all font-bold text-sm shadow-sm"
                  />
                  <FaRegEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-red-600 transition-colors" />
                </div>
              </div>

              <div className="relative group">
                <textarea 
                  rows="6"
                  placeholder="Type Your Message" 
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-[30px] py-6 px-10 outline-none focus:border-red-600 transition-all font-bold text-sm resize-none shadow-sm"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className={`bg-red-600 text-white font-black text-[13px] uppercase tracking-widest px-12 py-5 rounded-full hover:bg-black transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-3 group self-start lg:self-stretch ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Sending...' : 'Submit Message'} 
                {!loading && <FaChevronRight className="group-hover:translate-x-2 transition-transform" />}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ContactPage;
