import React, { useState, useEffect, useRef } from 'react';
import { FaFacebookF, FaPinterestP, FaLinkedinIn, FaYoutube, FaTelegramPlane, FaDiscord } from "react-icons/fa";
import axios from 'axios';
import { Link } from 'react-router-dom';

const CategoryColumnsSection = () => {
  const [allCategoryData, setAllCategoryData] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, blogsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/categories`),
          axios.get(`${import.meta.env.VITE_API_URL}/blogs`)
        ]);

        const allCats = catsRes.data;
        const allBlogs = blogsRes.data;

        // Group blogs by category and limit to top 3
        const processed = allCats.map(cat => {
          const catBlogs = allBlogs.filter(b => b.category === cat.name);
          if (catBlogs.length === 0) return null;
          
          return {
            title: cat.name,
            mainPost: catBlogs[0],
            listPosts: catBlogs.slice(1, 3) // Only top 3 total (1 main + 2 list)
          };
        }).filter(Boolean);

        setAllCategoryData(processed);
      } catch (err) {
        console.error("Error fetching CategoryColumnsSection data:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (allCategoryData.length <= 3 || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentSlide(prev => {
        const next = prev + 3;
        return next >= allCategoryData.length ? 0 : next;
      });
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [allCategoryData, isPaused]);

  // Show 3 categories at a time
  const visibleCategories = allCategoryData.slice(currentSlide, currentSlide + 3);

  const socialLinks = [
    { name: 'Facebook', followers: '14k followers', color: 'bg-[#3b5998]', icon: <FaFacebookF /> },
    { name: 'Pinterest', followers: '14k followers', color: 'bg-[#bd081c]', icon: <FaPinterestP /> },
    { name: 'Linkedin', followers: '14k followers', color: 'bg-[#0077b5]', icon: <FaLinkedinIn /> },
    { name: 'Youtube', followers: '14k followers', color: 'bg-[#ff0000]', icon: <FaYoutube /> },
    { name: 'Telegram', followers: '14k followers', color: 'bg-[#0088cc]', icon: <FaTelegramPlane /> },
    { name: 'Discord', followers: '14k followers', color: 'bg-[#7289da]', icon: <FaDiscord /> },
  ];

  return (
    <section className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Category Columns (Shows 3 at a time) */}
        <div 
          className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {visibleCategories.length > 0 ? (
            visibleCategories.map((section, idx) => (
              <div key={idx} className="flex flex-col gap-6 animate-fade-in">
                <div className="flex items-center gap-4 mb-2">
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{section.title}</h2>
                  <div className="flex-grow h-[1px] bg-gray-200"></div>
                </div>

                {/* Main Post */}
                <Link to={`/blog/${section.mainPost._id}`} className="relative h-48 rounded-xl overflow-hidden group cursor-pointer shadow-md block border border-gray-100">
                  {section.mainPost.titleImage ? (
                    <img src={`${import.meta.env.VITE_BASE_URL}/${section.mainPost.titleImage}`} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-700 font-bold text-xs uppercase">{section.mainPost.title.charAt(0)}</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent p-5 flex flex-col justify-end">
                    <h3 className="text-white font-bold text-sm leading-snug group-hover:text-red-500 transition-colors line-clamp-2">
                      {section.mainPost.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">
                      <span className="text-red-500">{section.mainPost.category}</span>
                      <span>•</span>
                      <span>{new Date(section.mainPost.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>

                {/* List Posts (Top 2 remaining) */}
                <div className="flex flex-col gap-6 mt-2">
                  {section.listPosts.map((post) => (
                    <Link to={`/blog/${post._id}`} key={post._id} className="flex gap-4 items-start group cursor-pointer">
                      <div className="w-16 h-16 rounded-full bg-gray-50 flex-shrink-0 border border-gray-100 overflow-hidden flex items-center justify-center text-gray-300 font-bold text-[10px]">
                        {post.titleImage ? (
                           <img src={`${import.meta.env.VITE_BASE_URL}/${post.titleImage}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                           <span className="uppercase">{post.title.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 leading-snug mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          <span className="text-red-600">{post.category}</span>
                          <span>•</span>
                          <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          ) : (
            [...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-6 w-32 bg-gray-100 rounded mb-6"></div>
                <div className="h-48 bg-gray-100 rounded-xl mb-6"></div>
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100"></div>
                  <div className="flex-grow py-2">
                    <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
                    <div className="h-2 bg-gray-50 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Social Sidebar */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm flex flex-col gap-8 h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-tight">Connect With Us</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {socialLinks.map((social, i) => (
              <div 
                key={i} 
                className={`${social.color} rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:opacity-90 transition-opacity gap-2 h-24`}
              >
                <div className="text-white text-xl">
                  {social.icon}
                </div>
                <div>
                  <p className="text-white font-bold text-[11px] leading-none uppercase tracking-tighter">{social.name}</p>
                  <p className="text-white/70 text-[9px] mt-1 font-bold">{social.followers}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default CategoryColumnsSection;
