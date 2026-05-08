import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BreakingNewsSection = () => {
  const [leftPosts, setLeftPosts] = useState([]);
  const [rightPosts, setRightPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/blogs`);
        const allBlogs = res.data;
        
        // Filter for News category
        const newsBlogs = allBlogs.filter(b => b.category.toLowerCase() === 'news');

        if (newsBlogs.length > 0) {
          // Left side: Top 3 news by views
          const topNews = [...newsBlogs]
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 3);
          setLeftPosts(topNews);

          // Right side: Recent news (excluding top news if possible, or just most recent 2)
          const recentNews = [...newsBlogs]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 2);
          setRightPosts(recentNews);
        }
      } catch (err) {
        console.error("Error fetching breaking news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <section className="container mx-auto px-6 py-12">
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-10">
        <h2 className="text-2xl font-black text-gray-900 whitespace-nowrap uppercase tracking-tight">Breaking News</h2>
        <div className="flex-grow h-[1px] bg-gray-200"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Column: Horizontal List (Top 3 News) */}
        <div className="flex flex-col gap-8">
          {loading ? (
             [...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-6 bg-white border border-gray-100 rounded-2xl h-48 animate-pulse">
                   <div className="md:w-2/5 bg-gray-100"></div>
                   <div className="md:w-3/5 p-5 flex flex-col justify-center gap-3">
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                      <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                      <div className="h-2 bg-gray-50 rounded w-32 mt-4"></div>
                   </div>
                </div>
             ))
          ) : leftPosts.length > 0 ? (
            leftPosts.map((post) => (
              <Link to={`/blog/${post.slug || post._id}`} key={post._id} className="flex flex-col md:flex-row gap-6 group cursor-pointer bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="md:w-2/5 h-48 md:h-auto bg-gray-200 overflow-hidden relative">
                  {post.titleImage ? (
                    <img 
                      src={`${import.meta.env.VITE_BASE_URL}/${post.titleImage}`} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold uppercase">{post.title.charAt(0)}</div>
                  )}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                     {post.category}
                  </div>
                </div>
                <div className="md:w-3/5 p-5 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600 text-[8px] font-black uppercase">
                       {post.author?.charAt(0)}
                    </div>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-tight">by {post.author} • {new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg font-black text-gray-900 leading-tight mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <div dangerouslySetInnerHTML={{ __html: post.content }} className="text-gray-400 text-xs line-clamp-2 mb-4 leading-relaxed font-medium"></div>
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                    <span className="text-red-600">News</span>
                    <span className="text-gray-200">•</span>
                    <span className="text-gray-400">1 min read</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
               <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No News Articles Found</p>
            </div>
          )}

          {/* Load More Button */}
          <div className="mt-4">
            <Link to="/categories/news" className="block text-center w-full py-4 bg-white border border-gray-100 rounded-2xl text-gray-900 font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all shadow-sm">
              VIEW ALL NEWS
            </Link>
          </div>
        </div>

        {/* Right Column: Recent News */}
        <div className="flex flex-col gap-8">
          {loading ? (
             [...Array(2)].map((_, i) => <div key={i} className="flex-1 min-h-[350px] bg-gray-100 rounded-3xl animate-pulse"></div>)
          ) : rightPosts.length > 0 ? (
            rightPosts.map((post, idx) => (
              <Link to={`/blog/${post.slug || post._id}`} key={post._id} className="relative flex-1 min-h-[350px] rounded-3xl overflow-hidden group cursor-pointer shadow-2xl block border border-gray-100">
                {post.titleImage ? (
                  <img 
                    src={`${import.meta.env.VITE_BASE_URL}/${post.titleImage}`} 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center text-white font-black text-4xl uppercase">{post.title.charAt(0)}</div>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-10 flex flex-col justify-end">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-black uppercase border-2 border-white/20 shadow-lg">
                       {post.author?.charAt(0)}
                    </div>
                    <span className="text-white text-xs font-black uppercase tracking-widest">by {post.author} • {new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-white text-3xl font-black leading-tight mb-6 group-hover:text-red-500 transition-colors line-clamp-3">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/70">
                    <span className="text-red-600">Recent News</span>
                    <span>•</span>
                    <span>1 min read</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="flex-1 min-h-[350px] flex items-center justify-center bg-gray-100 rounded-3xl border-2 border-dashed border-gray-200">
               <p className="text-gray-400 font-black uppercase tracking-widest text-xs text-center">Stay tuned for<br/>latest news</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default BreakingNewsSection;
