import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CategorySlider = () => {
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, blogsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/categories`),
          axios.get(`${import.meta.env.VITE_API_URL}/blogs`)
        ]);
        setCategories(catsRes.data);
        setBlogs(blogsRes.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getBlogCount = (catName) => {
    return blogs.filter(blog => blog.category === catName).length;
  };

  // Only show categories that have at least 1 blog
  const activeCategories = categories.filter(cat => getBlogCount(cat.name) > 0);

  if (loading || activeCategories.length === 0) return null;

  // Duplicate for seamless loop
  const displayCategories = [...activeCategories, ...activeCategories, ...activeCategories];

  return (
    <div className="w-full p-10 bg-gray-50/50 overflow-hidden">
     

      <div className="flex animate-marquee hover:pause-marquee space-x-6 px-6">
        {displayCategories.map((cat, index) => (
          <Link
            to={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
            key={`${cat._id}-${index}`}
            className="flex-shrink-0 w-48  h-64 bg-white border border-gray-100 rounded-[10px] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center  cursor-pointer group"
          >
            {/* Circular Symbol / Letter */}
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center  overflow-hidden border-2 border-transparent group-hover:border-red-600 transition-all duration-500">
              {cat.image ? (
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/${cat.image}`}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <span className="text-red-600 font-black text-3xl group-hover:text-red-600 transition-colors">
                  {cat.name.charAt(0)}
                </span>
              )}
            </div>

            {/* Category Name */}
            <h3 className="text-gray-900 font-black text-[17px] text-center group-hover:text-red-600 transition-colors mb-2">
              {cat.name}
            </h3>

            {/* Content Count */}
            <div className="bg-gray-50 px-3 py-1 rounded-full text-sm font-black text-gray-400 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
              {getBlogCount(cat.name)} Articles
            </div>
          </Link>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        .animate-marquee {
          animation: marquee 13s linear infinite;
        }
        .hover\\:pause-marquee:hover {
          animation-play-state: paused;
        }
      `}} />
    </div>
  );
};

export default CategorySlider;

