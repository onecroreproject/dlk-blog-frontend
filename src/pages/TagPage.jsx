import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt, FaChevronRight, FaUser, FaHome } from "react-icons/fa";
import { useBlogContext } from '../context/BlogContext';

const TagPage = () => {
  const { tag } = useParams();
  const { blogs, loading } = useBlogContext();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tag]);

  // Filter blogs for this tag
  const filteredPosts = blogs.filter(blog =>
    blog.tags && blog.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-black  text-sm">Loading posts for #{tag}...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b py-8 md:py-10 px-4 md:px-6">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl md:text-4xl font-black text-gray-900">Tag: #{tag}</h1>
          <div className="text-sm font-bold text-gray-400 flex items-center gap-2">
            <Link to="/" className="flex items-center gap-1 hover:text-red-600"><FaHome size={10} /> DLK Technologies</Link>
            <FaChevronRight size={8} />
            <span className="text-red-600">Tag: #{tag}</span>
          </div>
        </div>
      </div>

      <div className="w-full px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Main Content: Post List */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div key={post._id} className="bg-white rounded-[10px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                  {/* Post Image */}
                  <div className="aspect-video bg-gray-200 overflow-hidden relative">
                    {post.titleImage ? (
                      <img
                        src={`${BASE_URL}/${post.titleImage}`}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-black text-2xl ">{post.title.charAt(0)}</div>
                    )}
                    <div className="absolute top-4 md:top-6 right-4 md:right-6 px-3 md:px-4 py-1.5 md:py-2 bg-red-600 text-white text-[10px] md:text-xs font-black  rounded-full shadow-lg z-10 uppercase">
                      {post.category}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-6 md:p-10">
                    <div className="flex items-center gap-4 text-[10px] md:text-xs font-black text-gray-400 mb-6 ">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center border border-red-100 overflow-hidden text-red-600 font-black text-[10px]">
                          {post.author?.charAt(0)}
                        </div>
                        <span>by {post.author}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-red-600" />
                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>

                    <h2 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight mb-6 group-hover:text-red-600 transition-colors">
                      <Link to={`/blog/${post.slug || post._id}`}>{post.title}</Link>
                    </h2>

                    <div
                      dangerouslySetInnerHTML={{ __html: post.content }}
                      className="text-gray-500 font-medium leading-relaxed mb-8 line-clamp-3 text-base"
                    ></div>

                    <Link to={`/blog/${post.slug || post._id}`}>
                      <button className="bg-red-600 text-white font-black text-[11px] tracking-[2px] px-8 py-4 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100">
                        Read More
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-32 bg-white rounded-[10px] border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-black text-gray-300 ">No Posts Found with tag #{tag}</h2>
                <p className="text-gray-400 mt-2 font-bold">Check back later for fresh content!</p>
              </div>
            )}
          </div>

          {/* Sidebar (Optional, but keeping it empty for now or adding some stats) */}
          <div className="lg:col-span-4">
            {/* Can add popular tags or recent posts here too */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagPage;
