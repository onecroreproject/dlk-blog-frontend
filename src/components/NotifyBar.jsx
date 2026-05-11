import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBolt, FaFacebookF, FaLinkedinIn, FaInstagram, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function NotifyBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState("translate-x-0 opacity-100");
  const [trendingNews, setTrendingNews] = useState(["Loading latest news..."]);

  useEffect(() => {
    fetchLatestBlogs();
    
    // Polling: Update news every 30 seconds without refresh
    const pollInterval = setInterval(() => {
      fetchLatestBlogs();
    }, 30000); 

    return () => clearInterval(pollInterval);
  }, []);

  const fetchLatestBlogs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/blogs`);
      if (res.data && res.data.length > 0) {
        setTrendingNews(res.data.map(blog => blog.title));
      } else {
        setTrendingNews(["Welcome to DLK Technologies Blog Platform"]);
      }
    } catch (err) {
      console.error("Error fetching trending news:", err);
      setTrendingNews(["Stay updated with latest news and tech trends"]);
    }
  };

  useEffect(() => {
    if (trendingNews.length <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(timer);
  }, [currentIndex, trendingNews]);

  const handleNext = () => {
    if (trendingNews.length <= 1) return;
    setAnimationClass("-translate-x-10 opacity-0");
    
    setTimeout(() => {
      setAnimationClass("translate-x-10 opacity-0");
      setCurrentIndex((prev) => (prev + 1) % trendingNews.length);
      
      setTimeout(() => {
        setAnimationClass("translate-x-0 opacity-100");
      }, 50);
    }, 300);
  };

  const handlePrev = () => {
    if (trendingNews.length <= 1) return;
    setAnimationClass("translate-x-10 opacity-0");
    
    setTimeout(() => {
      setAnimationClass("-translate-x-10 opacity-0");
      setCurrentIndex((prev) => (prev - 1 + trendingNews.length) % trendingNews.length);
      
      setTimeout(() => {
        setAnimationClass("translate-x-0 opacity-100");
      }, 50);
    }, 300);
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-green-200 w-full border-b border-green-300/50">
      <div className="w-full px-4 lg:px-8 py-3.5 flex items-center justify-between">
        
        {/* Left Section: Trending */}
        <div className="flex items-center gap-3 overflow-hidden flex-grow">
          <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-green-500 flex-shrink-0 shadow-sm">
            <FaBolt className="text-sm" />
          </div>
          <span className="font-bold text-gray-900 text-[17px] whitespace-nowrap">Trending:</span>
          
          <div className="overflow-hidden flex-grow relative flex items-center">
            <h3 className={`text-[17px] font-medium text-gray-800 truncate max-w-[800px] transition-all duration-300 transform ${animationClass}`}>
              {trendingNews[currentIndex]}
            </h3>
          </div>
        </div>

        {/* Right Section: Date and Socials */}
        <div className="flex items-center gap-4 text-[17px] text-gray-800 flex-shrink-0 ml-4 hidden md:flex">
          <span className="font-bold">{formattedDate}</span>
          
          <div className="w-px h-4 bg-gray-400/50"></div>
          
          <div className="flex items-center gap-3">
            <span className="font-bold">Follow Us:</span>
            <div className="flex items-center gap-3 text-gray-600">
              <a href="https://www.facebook.com/people/DLK-Software-Solutions/61569333069634/" target="_blank" rel="noopener noreferrer">
                <FaFacebookF className="cursor-pointer hover:text-gray-900 transition text-[17px]" />
              </a>
              <a href="https://www.linkedin.com/company/dlk-software-solutions/" target="_blank" rel="noopener noreferrer">
                <FaLinkedinIn className="cursor-pointer hover:text-gray-900 transition text-[17px]" />
              </a>
              <a href="https://www.instagram.com/dlk_softwaresolutions/" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="cursor-pointer hover:text-gray-900 transition text-[17px]" />
              </a>
              <a href="https://www.youtube.com/@StudentsLearningplatform2026" target="_blank" rel="noopener noreferrer">
                <svg className="w-5 h-5 cursor-pointer hover:text-gray-900 transition" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default NotifyBar;