import React from 'react';
import { Link } from 'react-router-dom';
import { useBlogContext } from '../context/BlogContext';

const FeaturedPosts = () => {
  const { blogs, loading } = useBlogContext();

  // Sort by Editor's Choice first, then by views
  const sortedBlogs = [...blogs].sort((a, b) => {
    if (a.isEditorsChoice && !b.isEditorsChoice) return -1;
    if (!a.isEditorsChoice && b.isEditorsChoice) return 1;
    return (b.views || 0) - (a.views || 0);
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // We skip the first 5 because they are likely used in the Hero FeaturedSection
  const horizontalPosts = sortedBlogs.slice(5, 8);
  const gridPosts = sortedBlogs.slice(8, 12);

  if (loading) {
    return (
      <div className="w-full px-4 lg:px-8 py-12 mt-10 animate-pulse">
        <div className="h-10 w-64 bg-gray-100 rounded mb-12"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-2xl"></div>)}
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-[350px] bg-gray-100 rounded-2xl"></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full px-4 lg:px-8 py-12 mt-10">
      {/* Title Section */}
      <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-grow w-full">
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 whitespace-nowrap">More Featured</h2>
          <div className="flex-grow hidden sm:flex flex-col gap-1">
            <div className="h-px w-full bg-gray-200"></div>
            <div className="h-px w-full bg-gray-200"></div>
          </div>
        </div>
        <Link to="/category/all" className="w-full md:w-auto text-center px-8 py-3 border border-gray-100 rounded-full text-[#3aed43] text-base font-bold hover:bg-[#3aed43]/5 hover:border-[#3aed43]/20 transition-all shadow-sm whitespace-nowrap">
          See All Latest Post
        </Link>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Left Column: Horizontal Cards */}
        <div className="flex flex-col gap-8">
          {horizontalPosts.length > 0 ? horizontalPosts.map((post) => (
            <Link to={`/blog/${post.slug || post._id}`} key={post._id} className="flex flex-col md:flex-row gap-6 group cursor-pointer bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="md:w-2/5 h-48 md:h-auto bg-gray-200 overflow-hidden relative">
                {post.titleImage ? (
                  <img src={`${BASE_URL}/${post.titleImage}`} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">{post.title.charAt(0)}</div>
                )}
                <div className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white text-[11px] font-black  rounded-full shadow-lg">
                  {post.category}
                </div>
              </div>
              <div className="md:w-3/5 p-5 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-red-600 text-[10px] font-black border border-red-100">
                    {post.author?.charAt(0)}
                  </div>
                  <span className="text-xs text-gray-500 font-black">by {post.author} • {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-black text-gray-900 leading-tight mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <div dangerouslySetInnerHTML={{ __html: post.content }} className="text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed font-medium"></div>
                <div className="flex items-center gap-3 text-xs font-black ">
                  <span className="text-red-600">{post.category}</span>
                  <span className="text-gray-200">•</span>
                  <span className="text-gray-400">1 min read</span>
                </div>
              </div>
            </Link>
          )) : (
            <div className="h-full flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 py-20">
              <p className="text-gray-400 font-black  text-sm">No Featured Posts</p>
            </div>
          )}
        </div>

        {/* Right Column: Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gridPosts.length > 0 ? gridPosts.map((post) => (
            <Link to={`/blog/${post.slug || post._id}`} key={post._id} className="relative h-[350px] rounded-2xl overflow-hidden group cursor-pointer shadow-lg border border-gray-100 block">
              {post.titleImage ? (
                <img src={`${BASE_URL}/${post.titleImage}`} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center text-white font-black text-3xl">{post.title.charAt(0)}</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-6 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-red-600 border border-white/20 flex items-center justify-center text-white text-[10px] font-black shadow-lg">
                    {post.author?.charAt(0)}
                  </div>
                  <span className="text-xs text-white font-black ">
                    by {post.author} • {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-white font-black text-base leading-tight mb-3 group-hover:text-red-500 transition-colors line-clamp-3">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 text-xs font-black tracking-wider">
                  <span className="text-red-600">{post.category}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/60">1 min read</span>
                </div>
              </div>
            </Link>
          )) : (
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-[350px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center">
                <p className="text-gray-300 font-black  text-xs">Upcoming Post</p>
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
};

export default FeaturedPosts;
