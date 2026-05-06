import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SlArrowDown } from "react-icons/sl";
import { FiSearch, FiX, FiLock, FiAlertCircle } from "react-icons/fi";
import axios from 'axios';
import Logo from "../assets/dlk_logo.png";
import { useEffect } from 'react';


function NavBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Dynamic Data State
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [blogsRes, catsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/blogs`),
        axios.get(`${import.meta.env.VITE_API_URL}/categories`)
      ]);
      setBlogs(blogsRes.data);
      setCategories(catsRes.data);
    } catch (err) {
      console.error('Error fetching nav data:', err);
    }
  };

  const getBlogCount = (catName) => {
    return blogs.filter(blog => blog.category === catName).length;
  };

  const newsBlogs = blogs.filter(blog => blog.category.toLowerCase() === 'news');

  const handlePostBlogClick = (e) => {
    e.preventDefault();
    setIsOtpModalOpen(true);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setOtpError('');

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/otp/verify`, { code: otpInput });
      if (res.data.success) {
        setIsOtpModalOpen(false);
        setOtpInput('');
        navigate('/post-blog');
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Invalid OTP. Please ask your mentor.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="relative">
      {/* Search Overlay - Slides Down */}
      <div 
        className={`fixed top-0 left-0 w-full bg-white shadow-2xl z-[150] transition-all duration-500 ease-in-out overflow-hidden ${
          isSearchOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-grow relative">
              <input 
                type="text" 
                placeholder="Search for articles, news, and more..." 
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-full py-4 px-8 outline-none focus:border-green-400 transition-colors text-lg font-black uppercase tracking-tight"
                autoFocus={isSearchOpen}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            </div>
            <button 
              onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
              className="w-14 h-14 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
            >
              <FiX className="text-2xl" />
            </button>
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="max-h-[400px] overflow-y-auto px-4 custom-search-scroll">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Search Results ({blogs.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase())).length})</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blogs
                  .filter(blog => blog.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((blog) => (
                    <Link
                      key={blog._id}
                      to={`/blog/${blog._id}`}
                      onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                      className="group flex items-center gap-4 p-4 rounded-3xl bg-gray-50 hover:bg-green-50 border border-transparent hover:border-green-100 transition-all"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white overflow-hidden flex-shrink-0 shadow-sm">
                        {blog.titleImage ? (
                          <img src={`${import.meta.env.VITE_BASE_URL}/${blog.titleImage}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-black text-gray-300">DLK</div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="text-[9px] font-black text-green-600 uppercase tracking-widest mb-1">{blog.category}</div>
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1">{blog.title}</h4>
                      </div>
                    </Link>
                  ))}
              </div>
              
              {blogs.filter(blog => blog.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                <div className="py-12 text-center">
                  <div className="text-gray-300 font-black text-xl italic uppercase">No matching stories found</div>
                  <p className="text-gray-400 text-sm mt-2">Try searching for different keywords</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* OTP Verification Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-black">
                <FiLock size={24} />
              </div>
              <button onClick={() => setIsOtpModalOpen(false)} className="text-gray-400 hover:text-black transition-colors">
                <FiX size={24} />
              </button>
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Access Code Required</h2>
            <p className="text-gray-500 mb-8 font-medium">Please ask the OTP to your mentor to proceed with posting.</p>

            <form onSubmit={handleVerifyOtp}>
              <div className="mb-6">
                <input 
                  type="text" 
                  maxLength={4}
                  placeholder="Enter 4-digit code"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-center text-2xl font-black tracking-[1rem] outline-none focus:border-black transition-all"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  autoFocus
                />
                {otpError && (
                  <div className="flex items-center gap-2 mt-3 text-red-500 text-sm font-semibold">
                    <FiAlertCircle />
                    <span>{otpError}</span>
                  </div>
                )}
              </div>

              <button 
                type="submit"
                disabled={otpInput.length !== 4 || isVerifying}
                className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? 'Verifying...' : 'Verify & Proceed'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between bg-gray-100 px-6 border-b border-gray-200">

      {/* Left Section (Logo + Menu) */}
      <div className="flex items-center gap-10">

        {/* Logo */}
        <Link to="/">
          <img
            src={Logo}
            alt="logo"
            className="w-[150px] h-[100px] object-contain cursor-pointer"
          />
        </Link>

        {/* Menu */}
        <ul className="flex items-center space-x-10 text-xl font-medium">
          <li className="cursor-pointer hover:text-green-500 transition-colors">
            <Link to="/">Home</Link>
          </li>

          <li className="cursor-pointer hover:text-green-500 transition-colors">About</li>
          <li className="cursor-pointer hover:text-green-500 transition-colors">
            <Link to="/contact">Contact</Link>
          </li>

          {/* News Dropdown */}
          <li 
            className="relative flex gap-1 items-center cursor-pointer group"
            onMouseEnter={() => setIsNewsOpen(true)}
            onMouseLeave={() => setIsNewsOpen(false)}
          >
            News
            <SlArrowDown className={`transition-transform duration-300 ${isNewsOpen ? 'rotate-180' : ''}`} size={12} />
            
            {isNewsOpen && newsBlogs.length > 0 && (
              <div className="absolute top-full left-0 w-72 pt-2 z-[70] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="bg-white shadow-2xl rounded-2xl py-4 border border-gray-100 overflow-hidden">
                  {newsBlogs.map((blog) => (
                    <Link 
                      key={blog._id} 
                      to={`/blog/${blog._id}`}
                      className="block px-6 py-3 text-sm font-bold text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors border-b border-gray-50 last:border-0"
                    >
                      {blog.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </li>

          {/* Pages / Category Dropdown */}
          <li 
            className="relative flex gap-1 items-center cursor-pointer group"
            onMouseEnter={() => setIsPagesOpen(true)}
            onMouseLeave={() => setIsPagesOpen(false)}
          >
            Pages
            <SlArrowDown className={`transition-transform duration-300 ${isPagesOpen ? 'rotate-180' : ''}`} size={12} />
            
            {isPagesOpen && (
              <div className="absolute top-full left-0 w-64 pt-2 z-[70] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="bg-white shadow-2xl rounded-2xl py-4 border border-gray-100 overflow-hidden">
                  {categories
                    .filter(cat => getBlogCount(cat.name) > 0 && cat.name.toLowerCase() !== 'news')
                    .map((cat) => (
                      <div 
                        key={cat._id} 
                        className="px-6 py-3 flex items-center justify-between hover:bg-green-50 group/item transition-colors cursor-pointer border-b border-gray-50 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                            {cat.image ? (
                              <img src={`${import.meta.env.VITE_BASE_URL}/${cat.image}`} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-gray-400">{cat.name.charAt(0)}</div>
                            )}
                          </div>
                          <span className="text-sm font-bold text-gray-700 group-hover/item:text-green-600 uppercase tracking-wider">{cat.name}</span>
                        </div>
                        <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-black text-gray-400 group-hover/item:bg-green-600 group-hover/item:text-white transition-all">
                          {getBlogCount(cat.name)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </li>
        </ul>

      </div>


      {/* Right Section */}
      <div className="flex items-center gap-4">

        <button 
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center justify-center w-10 h-10 bg-green-400 text-black rounded-full hover:bg-green-500 transition shadow-md"
        >
          <FiSearch className="text-lg" />
        </button>

        <button 
          onClick={handlePostBlogClick}
          className="px-5 h-10 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition"
        >
          Post Blog
        </button>

        <Link to="/contact">
          <button className="px-5 h-10 bg-green-400 text-black font-medium rounded-full hover:bg-green-500 transition">
            Subscribe
          </button>
        </Link>

      </div>

      </div>
    </div>
  );
}

export default NavBar;
