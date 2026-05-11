import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useBlogContext } from '../context/BlogContext';

const CategorySlider = () => {
  const { blogs, categories, loading } = useBlogContext();
  const scrollRef = useRef(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const autoScrollTimer = useRef(null);
  const animationRef = useRef(null);
  const scrollPosRef = useRef(0);

  const getBlogCount = (catName) => {
    return blogs.filter(blog => blog.category === catName).length;
  };

  const activeCategories = categories.filter(cat => getBlogCount(cat.name) > 0);

  // Stop auto-scroll with cleanup
  const stopAutoScroll = useCallback(() => {
    setIsAutoScrolling(false);
    if (autoScrollTimer.current) {
      clearTimeout(autoScrollTimer.current);
    }
  }, []);

  // Start auto-scroll after delay
  const startAutoScroll = useCallback(() => {
    if (autoScrollTimer.current) {
      clearTimeout(autoScrollTimer.current);
    }
    autoScrollTimer.current = setTimeout(() => {
      setIsAutoScrolling(true);
    }, 3000); // Resume after 3 seconds of inactivity
  }, []);

  // Handle manual scroll (only when user is actively scrolling)
  const handleManualScroll = useCallback(() => {
    if (isAutoScrolling) {
      stopAutoScroll();
      startAutoScroll();
    }
  }, [isAutoScrolling, stopAutoScroll, startAutoScroll]);

  // Handle mouse wheel
  const handleWheel = useCallback(() => {
    handleManualScroll();
  }, [handleManualScroll]);

  // Handle touch start for mobile
  const handleTouchStart = useCallback(() => {
    handleManualScroll();
  }, [handleManualScroll]);

  // Handle mouse down for drag scrolling
  const handleMouseDown = useCallback(() => {
    handleManualScroll();
  }, [handleManualScroll]);

  // Auto-scroll animation
  useEffect(() => {
    if (loading || activeCategories.length === 0 || !scrollRef.current) return;

    const animate = () => {
      if (!scrollRef.current) return;
      
      if (isAutoScrolling) {
        // Update scroll position
        scrollPosRef.current += 1.5; // Smoother, slightly slower speed
        
        const maxScroll = scrollRef.current.scrollWidth / 3;
        if (scrollPosRef.current >= maxScroll * 2) {
          scrollPosRef.current -= maxScroll;
        } else if (scrollPosRef.current <= 0) {
          scrollPosRef.current += maxScroll;
        }
        
        scrollRef.current.scrollLeft = scrollPosRef.current;
      } else {
        // Sync position when not auto-scrolling
        if (scrollRef.current) {
          scrollPosRef.current = scrollRef.current.scrollLeft;
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Initialize scroll position reference
    scrollPosRef.current = scrollRef.current.scrollLeft;
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [loading, activeCategories.length, isAutoScrolling]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoScrollTimer.current) {
        clearTimeout(autoScrollTimer.current);
      }
    };
  }, []);

  if (loading || activeCategories.length === 0) return null;

  const displayCategories = [...activeCategories, ...activeCategories, ...activeCategories];

  return (
    <div className="w-full px-4 py-8 md:p-10 bg-gray-50/50 overflow-hidden relative">
      <div 
        ref={scrollRef}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onMouseDown={handleMouseDown}
        className="flex space-x-4 md:space-x-6 px-4 md:px-6 overflow-x-auto scrollbar-hide py-4 select-none"
        style={{
          cursor: 'grab',
          scrollBehavior: 'auto' // Don't use smooth scrolling for auto-scroll
        }}
      >
        {displayCategories.map((cat, index) => (
          <Link
            to={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
            key={`${cat._id}-${index}`}
            className="flex-shrink-0 w-56 md:w-64 h-72 md:h-80 bg-white border border-gray-100 rounded-[10px] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center group p-6 md:p-8"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-red-50 flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-red-600 transition-all duration-500 mb-6">
              {cat.image ? (
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/${cat.image}`}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  draggable={false}
                />
              ) : (
                <span className="text-red-600 font-black text-3xl md:text-5xl group-hover:text-red-600 transition-colors">
                  {cat.name.charAt(0)}
                </span>
              )}
            </div>

            <h3 className="text-gray-900 font-black text-lg md:text-2xl text-center group-hover:text-red-600 transition-colors mb-3">
              {cat.name}
            </h3>

            <div className="bg-gray-50 px-4 py-1.5 rounded-full text-xs md:text-sm font-black text-gray-400 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
              {getBlogCount(cat.name)} Articles
            </div>
          </Link>
        ))}
      </div>

     

      <style dangerouslySetInnerHTML={{
        __html: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default CategorySlider;