import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useBlogContext } from '../context/BlogContext';

const ImageSlider = () => {
    const { blogs: allBlogsFromContext, loading } = useBlogContext();
    const [blogs, setBlogs] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const containerRef = useRef(null);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [widths, setWidths] = useState({ item: 350, active: 700, gap: 35 });

    const API_URL = import.meta.env.VITE_API_URL;
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        if (!loading && allBlogsFromContext.length > 0) {
            setBlogs(allBlogsFromContext.slice(0, 5));
        }
    }, [allBlogsFromContext, loading]);

    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            if (w < 640) {
                setWidths({ item: w - 32, active: w - 32, gap: 10 });
            } else if (w < 768) {
                setWidths({ item: w - 60, active: w - 60, gap: 16 });
            } else if (w < 1024) {
                setWidths({ item: 300, active: 500, gap: 25 });
            } else {
                setWidths({ item: 350, active: 700, gap: 35 });
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const slideCount = blogs.length;
    const allBlogs = [...blogs, ...blogs]; 
    const { item: itemWidth, active: activeWidth, gap } = widths;
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

    const handlePrev = () => {
        if (slideCount <= 1) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => (prev === 0 ? slideCount - 1 : prev - 1));
    };

    const handleTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
        setIsPaused(true);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) handleNext();
        if (isRightSwipe) handlePrev();
        
        setIsPaused(false);
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

    const calculateOffset = () => {
        const centerPadding = (window.innerWidth - activeWidth) / 2;
        return (currentIndex * (itemWidth + gap)) - centerPadding;
    };

    if (slideCount === 0) return <div className="h-[400px] md:h-[500px] flex items-center justify-center font-black text-gray-200 italic">Loading Featured Stories...</div>;

    return (
        <div
            className="w-full pt-2 pb-8 md:py-16 overflow-hidden bg-white relative"
            ref={containerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div
                className={`flex items-center ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
                style={{
                    transform: `translateX(${-calculateOffset()}px)`,
                    gap: `${gap}px`,
                    width: 'max-content'
                }}
            >
                {allBlogs.map((blog, index) => {
                    const isActive = index === currentIndex || (currentIndex === slideCount && index === 0);

                    return (
                        <Link
                            to={`/blog/${blog.slug || blog._id}`}
                            key={`${blog._id}-${index}`}
                            className={`relative flex-shrink-0 h-[300px] sm:h-[350px] md:h-[450px] rounded-2xl md:rounded-[10px] overflow-hidden cursor-pointer group shadow-2xl block ${isTransitioning ? 'transition-all duration-700 ease-in-out' : ''}`}
                            style={{
                                width: `${isActive ? activeWidth : itemWidth}px`,
                            }}
                        >
                            <div className="w-full h-full bg-gray-900 relative">
                                {blog.titleImage ? (
                                    <img
                                        src={`${BASE_URL}/${blog.titleImage}`}
                                        alt={blog.title}
                                        className={`w-full h-full object-cover transition-transform duration-700 ${isActive ? 'scale-105' : 'scale-110 grayscale-[0.5] opacity-60'}`}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white font-black text-3xl md:text-5xl italic opacity-20">DLK</div>
                                )}

                                <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-90' : 'opacity-40'}`} />

                                <div className={`absolute bottom-0 left-0 p-4 sm:p-5 md:p-10 w-full transition-all duration-500 transform ${isActive ? 'translate-y-0' : 'translate-y-4'}`}>
                                    <span className="bg-red-600 text-white text-[9px] md:text-xs font-black tracking-[0.2em] px-3 md:px-4 py-1 md:py-1.5 rounded-full mb-3 md:mb-4 inline-block shadow-lg uppercase">
                                        {blog.category}
                                    </span>
                                    <h3 className={`text-white font-black leading-tight transition-all duration-500 ${isActive ? 'text-xl sm:text-2xl md:text-5xl mb-4 line-clamp-2 md:line-clamp-none' : 'text-base md:text-2xl line-clamp-1'}`}>
                                        {blog.title}
                                    </h3>

                                    <div className={`overflow-hidden transition-all duration-500 ${isActive ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-red-600 flex items-center justify-center text-[10px] md:text-xs font-black text-white">{blog.author.charAt(0)}</div>
                                            <span className="text-gray-300 text-xs md:text-sm font-bold ">{blog.author}</span>
                                        </div>
                                        <div className="flex items-center text-white font-black text-[10px] md:text-sm tracking-[0.2em] cursor-pointer group-hover:text-red-500 transition-colors">
                                            READ STORY <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Pagination Dots for Mobile */}
            <div className="flex justify-center gap-2 mt-6 md:mt-8">
                {blogs.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setIsTransitioning(true);
                            setCurrentIndex(idx);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex % slideCount === idx ? 'w-8 bg-red-600' : 'w-2 bg-gray-200'}`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageSlider;

