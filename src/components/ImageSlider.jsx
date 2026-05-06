import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ImageSlider = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const containerRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API_URL}/blogs`);
      setBlogs(res.data.slice(0, 5)); // Show top 5 latest blogs
    } catch (err) {
      console.error("Error fetching slider blogs:", err);
    }
  };

  const slideCount = blogs.length;
  const allBlogs = [...blogs, ...blogs]; // Duplicate for infinite effect
  const itemWidth = 450;
  const activeWidth = 700;
  const gap = 65;
  const autoPlayDelay = 4000;

  useEffect(() => {
    if (isPaused || slideCount <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, autoPlayDelay);

    return () => clearInterval(interval);
  }, [isPaused, currentIndex, slideCount]);

  const handleNext = () => {
    if (slideCount <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  useEffect(() => {
    if (slideCount > 0 && currentIndex === slideCount) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, slideCount]);

  const offset = currentIndex * (itemWidth + gap);

  if (slideCount === 0) return <div className="h-[500px] flex items-center justify-center font-black text-gray-200 uppercase tracking-widest italic">Loading Featured Stories...</div>;

  return (
    <div 
      className="w-full py-16 overflow-hidden bg-white" 
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        className={`flex items-center ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
        style={{ 
          transform: `translateX(${-offset}px)`,
          gap: `${gap}px`,
          paddingLeft: '5%',
          width: 'max-content'
        }}
      >
        {allBlogs.map((blog, index) => {
          const isActive = index === currentIndex || (currentIndex === slideCount && index === 0);
          
          return (
            <Link
              to={`/blog/${blog._id}`}
              key={`${blog._id}-${index}`}
              className={`relative flex-shrink-0 h-[450px] rounded-[40px] overflow-hidden cursor-pointer group shadow-2xl block ${isTransitioning ? 'transition-all duration-700 ease-in-out' : ''}`}
              style={{ 
                width: isActive ? `${activeWidth}px` : `${itemWidth}px`,
              }}
            >
              <div className="w-full h-full bg-gray-900 relative">
                {/* Real Image from Backend */}
                {blog.titleImage ? (
                  <img 
                    src={`${BASE_URL}/${blog.titleImage}`} 
                    alt={blog.title} 
                    className={`w-full h-full object-cover transition-transform duration-700 ${isActive ? 'scale-105' : 'scale-110 grayscale-[0.5] opacity-60'}`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-black text-4xl italic opacity-20">DLK</div>
                )}
                
                {/* Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-80' : 'opacity-40'}`} />
                
                {/* Content */}
                <div className={`absolute bottom-0 left-0 p-10 w-full transition-all duration-500 transform ${isActive ? 'translate-y-0' : 'translate-y-4'}`}>
                  <span className="bg-red-600 text-white text-[10px] font-black tracking-[0.2em] px-4 py-1.5 rounded-full uppercase mb-4 inline-block shadow-lg">
                    {blog.category}
                  </span>
                  <h3 className={`text-white font-black leading-tight transition-all duration-500 ${isActive ? 'text-4xl mb-4' : 'text-xl'}`}>
                    {blog.title}
                  </h3>
                  
                  <div className={`overflow-hidden transition-all duration-500 ${isActive ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-[10px] font-black text-white uppercase">{blog.author.charAt(0)}</div>
                      <span className="text-gray-300 text-xs font-bold uppercase tracking-widest">{blog.author}</span>
                    </div>
                    <div className="flex items-center text-white font-black text-xs uppercase tracking-[0.2em] cursor-pointer group-hover:text-red-500 transition-colors">
                      Read Full Story <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ImageSlider;

