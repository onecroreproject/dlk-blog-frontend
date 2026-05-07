import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaCalendarAlt } from "react-icons/fa";
import axios from 'axios';
import logo from '../assets/dlk_logo.png';

const Footer = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsRes, catsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/blogs`),
          axios.get(`${import.meta.env.VITE_API_URL}/categories`)
        ]);
        setBlogs(blogsRes.data);
        setCategories(catsRes.data);
      } catch (err) {
        console.error('Footer data fetch error:', err);
      }
    };
    fetchData();
  }, []);

  // Top Categories Logic
  const topCategories = categories.map(cat => ({
    name: cat.name,
    count: blogs.filter(b => b.category === cat.name).length
  })).sort((a, b) => b.count - a.count).slice(0, 3);

  // Popular Tags Logic
  const popularTags = Array.from(new Set(blogs.flatMap(b => b.tags || []))).slice(0, 12);

  // Recent Posts Logic
  const recentPosts = [...blogs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 2);

  const instaImages = blogs.slice(0, 6);

  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMsg, setPopupMsg] = useState('');

  const handleSubscribe = async () => {
    if (!subscribeEmail) return;

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(subscribeEmail)) {
      setPopupMsg("Please enter a valid email address");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 4000);
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/newsletter/subscribe`, { email: subscribeEmail });
      setPopupMsg(res.data.message);
      setShowPopup(true);
      setSubscribeEmail('');
      setTimeout(() => setShowPopup(false), 4000);
    } catch (err) {
      setPopupMsg(err.response?.data?.message || "Something went wrong");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 4000);
    }
  };

  return (
    <footer className="mt-20 relative">

      {/* Thank You Popup */}
      {showPopup && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[1000] animate-bounce-in">
          <div className="bg-white px-10 py-5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-b-4 border-red-600 flex items-center gap-4">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white">
              <FaBell />
            </div>
            <div>
              <h4 className="font-black text-black uppercase tracking-widest text-sm">{popupMsg}</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">You've successfully joined our list</p>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Section */}
      <div className="bg-[#111111] py-16 px-6 border-b border-white/5">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-white text-3xl shadow-[0_0_20px_rgba(220,38,38,0.4)] animate-pulse">
              <FaBell />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Sign up to Our Newsletters.</h2>
              <p className="text-gray-400 font-medium mt-2">Subscribe to our Newsletter & Event Right Now to be Updated</p>
            </div>
          </div>

          <div className="w-full lg:max-w-2xl">
            <div className="bg-white rounded-full flex items-center p-1 pl-8 shadow-2xl overflow-hidden">
              <input
                type="email"
                placeholder="Enter Your Email"
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                className="flex-grow bg-transparent outline-none text-gray-800 placeholder-gray-400 text-base font-medium"
              />
              <button
                onClick={handleSubscribe}
                className="bg-[#e32e2e] text-white px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg active:scale-95"
              >
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Section */}
      <div className="bg-[#111111] text-white py-20 px-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Column 1: Top Categories */}
          <div>
            <h3 className="text-xl font-black mb-10 tracking-tight">Top Categories</h3>
            <div className="flex flex-col gap-4">
              {topCategories.map((cat, i) => (
                <div key={i} className="flex items-center justify-between bg-white rounded-full p-1 pl-6 group cursor-pointer hover:bg-red-600 transition-all duration-300">
                  <span className="text-black font-black text-sm group-hover:text-white">{cat.name}</span>
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs group-hover:bg-white group-hover:text-red-600">
                    {cat.count}
                  </div>
                </div>
              ))}
              {topCategories.length === 0 && <span className="text-gray-500 text-xs italic">No categories found</span>}
            </div>
          </div>

          {/* Column 2: Popular Tags */}
          <div>
            <h3 className="text-xl font-black mb-10 tracking-tight">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag, i) => (
                <span key={i} className="bg-white text-black px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider cursor-pointer hover:bg-red-600 hover:text-white transition-all">
                  {tag}
                </span>
              ))}
              {popularTags.length === 0 && <span className="text-gray-500 text-xs italic">No tags found</span>}
            </div>
          </div>

          {/* Column 3: Recent Post */}
          <div>
            <h3 className="text-xl font-black mb-10 tracking-tight">Recent Post</h3>
            <div className="flex flex-col gap-8">
              {recentPosts.map((post) => (
                <Link to={`/blog/${post._id}`} key={post._id} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-white/10 overflow-hidden flex-shrink-0">
                    <img
                      src={`${import.meta.env.VITE_BASE_URL}/${post.titleImage}`}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <span className="text-red-600 text-[10px] font-black uppercase tracking-widest">{post.category}</span>
                    <h4 className="text-sm font-black mt-1 group-hover:text-red-500 transition-colors line-clamp-2 leading-tight">{post.title}</h4>
                    <div className="flex items-center gap-2 text-gray-500 text-[10px] mt-1 font-bold">
                      <FaCalendarAlt size={10} />
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Instagram Feed */}
          <div>
            <h3 className="text-xl font-black mb-10 tracking-tight">Instagram Feed</h3>
            <div className="grid grid-cols-3 gap-2">
              {instaImages.map((blog) => (
                <Link to={`/blog/${blog._id}`} key={blog._id} className="aspect-square bg-gray-800 rounded-lg overflow-hidden cursor-pointer group relative">
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/${blog.titleImage}`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-[#000000] py-10 border-t border-white/5 text-white px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-8 text-[13px] font-black tracking-tight">
            <a href="#" className="hover:text-red-600 transition-colors">Terms & Conditions</a>
            <a href="#" className="hover:text-red-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-red-600 transition-colors">Contact</a>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <Link to="/">
              <img src={logo} alt="DLK Technologies" className="h-8 w-auto mb-2 cursor-pointer" />
            </Link>
            <p className="text-gray-400 text-[13px] font-black tracking-tight uppercase">
              Copyright © 2026 <span className="text-white">DLK Technologies</span> All Right Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
