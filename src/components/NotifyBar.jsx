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
    <div className="bg-green-200 flex items-center justify-between">
      <div className="flex items-center">
        <div className="flex items-center h-10 overflow-hidden max-w-5xl">
          <div className="bg-[#3aed43] text-white p-6 h-full flex items-center gap-2 font-black text-xs uppercase italic rounded-tr-[40px] rounded-br-[5px] z-10 relative">
            <FaBolt className="animate-pulse" />
            <span>Trending:</span>
          </div>
          
          <div className="px-6 overflow-hidden hidden sm:block grow">
            <h3 
              className={`text-xs font-bold text-gray-700 truncate max-w-[900px] transition-all duration-300 transform ${animationClass}`}
            >
              {trendingNews[currentIndex]}
            </h3>
          </div>

          <div className="flex items-center gap-3 text-gray-300 border-l border-gray-100 pl-4 h-1/2 bg-green-200 z-10 relative">
            <FaChevronLeft 
              onClick={handlePrev}
              className="cursor-pointer hover:text-purple-600 transition-colors text-[10px]" 
            />
            <div className="h-3 w-px bg-gray-200"></div>
            <FaChevronRight 
              onClick={handleNext}
              className="cursor-pointer hover:text-purple-600 transition-colors text-[10px]" 
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm px-4">
        <h1 className="capitalize font-medium text-lg">
          {formattedDate}
        </h1>

        <div className="w-px h-6 bg-white/50"></div>

        <div className="flex items-center gap-4">
          <h1 className="font-medium text-xs">Follow Us:</h1>
          <div className="flex items-center gap-3">
            <FaFacebookF className="cursor-pointer hover:text-blue-600 transition text-xs" />
            <FaLinkedinIn className="cursor-pointer hover:text-blue-700 transition text-xs" />
            <FaInstagram className="cursor-pointer hover:text-pink-500 transition text-xs" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotifyBar;