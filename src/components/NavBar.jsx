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
  const [activeCategory, setActiveCategory] = useState(null);
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
        className={`fixed top-0 left-0 w-full bg-white shadow-2xl z-[150] transition-all duration-500 ease-in-out overflow-hidden ${isSearchOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="w-full px-4 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder="Search for articles, news, and more..."
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-full py-4 px-8 outline-none focus:border-green-400 transition-colors text-xl font-black"
                autoFocus={isSearchOpen}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 text-2xl" />
            </div>
            <button
              onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
              className="w-14 h-14 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
            >
              <FiX className="text-3xl" />
            </button>
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="max-h-[400px] overflow-y-auto px-4 custom-search-scroll">
              <div className="text-xs font-black text-gray-400 tracking-[0.2em] mb-4">Search Results ({blogs.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase())).length})</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blogs
                  .filter(blog => blog.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((blog) => (
                    <Link
                      key={blog._id}
                      to={`/blog/${blog.slug || blog._id}`}
                      onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                      className="group flex items-center gap-4 p-4 rounded-3xl bg-gray-50 hover:bg-green-50 border border-transparent hover:border-green-100 transition-all"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white overflow-hidden flex-shrink-0 shadow-sm">
                        {blog.titleImage ? (
                          <img src={`${import.meta.env.VITE_BASE_URL}/${blog.titleImage}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm font-black text-gray-300">DLK</div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="text-[11px] font-black text-green-600  mb-1">{blog.category}</div>
                        <h4 className="text-[17px] font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1">{blog.title}</h4>
                      </div>
                    </Link>
                  ))}
              </div>

              {blogs.filter(blog => blog.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                <div className="py-12 text-center">
                  <div className="text-gray-300 font-black text-2xl italic">No matching stories found</div>
                  <p className="text-gray-400 text-[17px] mt-2">Try searching for different keywords</p>
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

            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Access Code Required</h2>
            <p className="text-gray-500 mb-8 font-medium">Please ask the OTP to your mentor to proceed with posting.</p>

            <form onSubmit={handleVerifyOtp}>
              <div className="mb-6">
                <input
                  type="text"
                  maxLength={4}
                  placeholder="Enter 4-digit code"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-center text-3xl font-black tracking-[1rem] outline-none focus:border-black transition-all"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  autoFocus
                />
                {otpError && (
                  <div className="flex items-center gap-2 mt-3 text-red-500 text-[17px] font-semibold">
                    <FiAlertCircle />
                    <span>{otpError}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={otpInput.length !== 4 || isVerifying}
                className="w-full bg-black text-white py-4 rounded-2xl font-bold text-xl hover:bg-gray-800 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? 'Verifying...' : 'Verify & Proceed'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-gray-100 border-b border-gray-200">
        <div className="w-full px-4 lg:px-8 h-24 flex items-center justify-between">

          {/* Left Section (Logo + Menu) */}
          <div className="flex items-center gap-10">
            {/* Logo */}
            <Link to="/">
              <img
                src={Logo}
                alt="logo"
                className="w-[140px] h-[70px] object-contain cursor-pointer"
              />
            </Link>

            {/* Menu */}
            <ul className="flex items-center text-[19px] font-bold text-gray-800 hidden lg:flex">
              <li className="cursor-pointer hover:text-green-600 transition-colors pr-6 border-r border-gray-300 flex items-center gap-1">
                <Link to="/">Home</Link> <SlArrowDown size={10} className="text-gray-400" />
              </li>

              <li className="cursor-pointer hover:text-green-600 transition-colors px-6 border-r border-gray-300 flex items-center h-full">
                <Link to="/about">About</Link>
              </li>

              {/* News Dropdown */}
              <li
                className="relative flex gap-1 items-center cursor-pointer group px-6 border-r border-gray-300 hover:text-green-600 transition-colors h-full"
                onMouseEnter={() => setIsNewsOpen(true)}
                onMouseLeave={() => setIsNewsOpen(false)}
              >
                News
                <SlArrowDown className={`transition-transform duration-300 text-gray-400 ${isNewsOpen ? 'rotate-180' : ''}`} size={11} />

                {isNewsOpen && newsBlogs.length > 0 && (
                  <div className="absolute top-full left-0 w-72 pt-6 z-[70] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-white shadow-2xl rounded-2xl py-4 border border-gray-100 overflow-hidden">
                      {newsBlogs.map((blog) => (
                        <Link
                          key={blog._id}
                          to={`/blog/${blog.slug || blog._id}`}
                          className="block px-6 py-3 text-[17px] font-bold text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors border-b border-gray-50 last:border-0"
                        >
                          {blog.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>

              {/* Pages / Category Mega Menu */}
              <li
                className="relative flex gap-1.5 items-center cursor-pointer group px-6 border-r border-gray-300 hover:text-green-600 transition-colors h-full"
                onMouseEnter={() => {
                  setIsPagesOpen(true);
                  const firstCat = categories.filter(cat => getBlogCount(cat.name) > 0 && cat.name.toLowerCase() !== 'news')[0];
                  if (firstCat && !activeCategory) setActiveCategory(firstCat.name);
                }}
                onMouseLeave={() => setIsPagesOpen(false)}
              >
                Pages
                <SlArrowDown className={`transition-transform duration-300 text-gray-400 ${isPagesOpen ? 'rotate-180' : ''}`} size={11} />

                {isPagesOpen && (
                  <div className="absolute top-full left-[-300px] w-[900px] pt-6 z-[70] animate-in fade-in slide-in-from-top-2 duration-200 cursor-default">
                    <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl border border-gray-100 flex overflow-hidden h-[450px]">
                      
                      {/* Left Column: Categories List with Scrollbar */}
                      <div className="w-[320px] flex-shrink-0 border-r border-gray-100 overflow-y-auto py-10 custom-nav-scroll">
                        <div className="px-10 mb-4">
                          <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Categories</h4>
                        </div>
                        {categories
                          .filter(cat => getBlogCount(cat.name) > 0 && cat.name.toLowerCase() !== 'news')
                          .map((cat) => (
                            <div
                              key={cat._id}
                              onMouseEnter={() => setActiveCategory(cat.name)}
                              onClick={() => {
                                navigate(`/category/${cat.name.toLowerCase().replace(/ /g, '-')}`);
                                setIsPagesOpen(false);
                              }}
                              className={`px-10 py-3 flex items-center justify-between transition-all cursor-pointer group/cat ${
                                activeCategory === cat.name ? 'bg-green-600 text-white' : 'hover:bg-gray-50 text-gray-700'
                              }`}
                            >
                              <span className="text-[17px] font-bold tracking-wide">{cat.name}</span>
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                                activeCategory === cat.name ? 'bg-white text-green-600' : 'bg-gray-100 text-gray-400'
                              }`}>
                                {getBlogCount(cat.name)}
                              </span>
                            </div>
                          ))}
                      </div>

                      {/* Right Column: Topics (Blogs) for Active Category */}
                      <div className="flex-grow bg-gray-50/50 overflow-y-auto p-10 custom-nav-scroll">
                        {activeCategory ? (
                          <div>
                            <div className="flex items-center justify-between mb-8">
                              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Latest in {activeCategory}</h4>
                              <Link 
                                to={`/category/${activeCategory.toLowerCase().replace(/ /g, '-')}`}
                                onClick={() => setIsPagesOpen(false)}
                                className="text-[11px] font-black text-green-600 uppercase tracking-widest hover:underline"
                              >
                                View All
                              </Link>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              {blogs
                                .filter(blog => blog.category === activeCategory)
                                .slice(0, 10)
                                .map(blog => (
                                  <Link
                                    key={blog._id}
                                    to={`/blog/${blog.slug || blog._id}`}
                                    onClick={() => setIsPagesOpen(false)}
                                    className="group/item py-2 block border-b border-gray-100 last:border-0"
                                  >
                                    <h5 className="text-[17px] font-bold text-gray-900 group-hover/item:text-green-600 transition-colors line-clamp-1 leading-tight">
                                      {blog.title}
                                    </h5>
                                    <p className="text-[11px] text-gray-500 font-bold mt-2">
                                      {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • 1 min read
                                    </p>
                                  </Link>
                                ))}
                            </div>
                          </div>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center">
                             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-4">
                                <SlArrowDown size={32} className="-rotate-90" />
                             </div>
                             <h4 className="text-xl font-bold text-gray-900 mb-2">Explore Topics</h4>
                             <p className="text-gray-500 max-w-xs">Select a category on the left to see the latest trending stories.</p>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                )}
              </li>

              <li className="cursor-pointer hover:text-green-600 transition-colors pl-6 flex items-center h-full">
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-center w-11 h-11 bg-green-500 text-white rounded-full hover:bg-green-600 transition shadow-sm"
            >
              <FiSearch className="text-2xl" />
            </button>

            <button
              onClick={handlePostBlogClick}
              className="px-7 h-11 bg-black text-white font-bold text-[17px] rounded-full hover:bg-gray-800 transition whitespace-nowrap hidden sm:block"
            >
              Post Blog
            </button>

            <Link to="/contact">
              <button className="px-7 h-11 bg-green-500 text-white font-bold text-[17px] rounded-full hover:bg-green-600 transition shadow-sm whitespace-nowrap hidden sm:block">
                Subscribe Now
              </button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default NavBar;
