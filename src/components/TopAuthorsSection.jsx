import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TopAuthorsSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [mustRead, setMustRead] = useState([]);
  const [recentThumbnails, setRecentThumbnails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/blogs`);
        const allBlogs = res.data;
        setBlogs(allBlogs);

        // 1. Top Authors Logic (Group by author and sum views)
        const authorMap = {};
        allBlogs.forEach(blog => {
          if (!authorMap[blog.author]) {
            authorMap[blog.author] = {
              name: blog.author,
              articles: 0,
              totalViews: 0,
              avatar: blog.authorAvatar,
              slug: blog.author.toLowerCase().replace(/ /g, '-')
            };
          }
          authorMap[blog.author].articles += 1;
          authorMap[blog.author].totalViews += (blog.views || 0);
        });

        const sortedAuthors = Object.values(authorMap)
          .sort((a, b) => b.totalViews - a.totalViews)
          .slice(0, 12);
        setAuthors(sortedAuthors);

        // 2. Must Read Logic (Highest Views)
        const sortedByViews = [...allBlogs]
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 3);
        setMustRead(sortedByViews);

        // 3. Recent Post Thumbnails
        const sortedByDate = [...allBlogs]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 9);
        setRecentThumbnails(sortedByDate);

      } catch (err) {
        console.error("Error fetching Top Authors Section data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="w-full px-4 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Left Column: Top Tech Authors */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 whitespace-nowrap">Top Tech Author</h2>
            <div className="flex-grow hidden sm:flex flex-col gap-1">
              <div className="h-px w-full bg-gray-200"></div>
              <div className="h-px w-full bg-gray-200"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {authors.length > 0 ? (
              authors.map((author, index) => (
                <Link
                  to={`/author/${author.slug}`}
                  key={index}
                  className="bg-white border border-gray-100 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="w-20 h-20 rounded-full bg-gray-50 mb-4 border-2 border-gray-50 overflow-hidden flex items-center justify-center text-gray-400 group-hover:border-red-600 transition-colors">
                    {author.avatar ? (
                      <img src={`${import.meta.env.VITE_BASE_URL}/${author.avatar}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-black text-gray-300">{author.name.charAt(0)}</span>
                    )}
                  </div>
                  <h3 className="text-base font-black text-gray-900 mb-1 group-hover:text-red-600 transition-colors">{author.name}</h3>
                  <p className="text-xs text-gray-400 font-black">{author.articles} Articles</p>
                </Link>
              ))
            ) : (
              [...Array(8)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 flex flex-col items-center animate-pulse">
                  <div className="w-20 h-20 rounded-full bg-gray-100 mb-4"></div>
                  <div className="h-4 w-20 bg-gray-100 rounded mb-2"></div>
                  <div className="h-2 w-12 bg-gray-50 rounded"></div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">

          {/* Recent Post Thumbnails */}
          <div className="mb-10">
            <h3 className="text-xl font-black text-gray-900 mb-6">Recent Post</h3>
            <div className="grid grid-cols-3 gap-3">
              {recentThumbnails.length > 0 ? (
                recentThumbnails.map((blog) => (
                  <Link
                    to={`/blog/${blog._id}`}
                    key={blog._id}
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center text-xs text-gray-400 font-bold hover:opacity-80 transition-opacity"
                  >
                    {blog.titleImage ? (
                      <img src={`${import.meta.env.VITE_BASE_URL}/${blog.titleImage}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="uppercase">{blog.title.charAt(0)}</span>
                    )}
                  </Link>
                ))
              ) : (
                [...Array(6)].map((_, i) => <div key={i} className="aspect-square bg-gray-100 rounded-lg animate-pulse"></div>)
              )}
            </div>
          </div>

          {/* Must Read Section */}
          <div>
            <h3 className="text-xl font-black text-gray-900 mb-6">Must Read</h3>
            <div className="flex flex-col gap-6">
              {mustRead.length > 0 ? (
                mustRead.map((post) => (
                  <Link to={`/blog/${post._id}`} key={post._id} className="flex gap-4 group cursor-pointer items-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex-shrink-0 border border-gray-200 overflow-hidden flex items-center justify-center text-gray-400 font-bold text-xs shadow-sm">
                      {post.titleImage ? (
                        <img src={`${import.meta.env.VITE_BASE_URL}/${post.titleImage}`} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="uppercase">{post.title.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-[15px] font-black text-gray-900 leading-tight mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] font-black  text-gray-400">
                        <span className="text-red-600">{post.category}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-4 animate-pulse items-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex-shrink-0"></div>
                    <div className="flex-grow">
                      <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                      <div className="h-2 bg-gray-50 rounded w-20"></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default TopAuthorsSection;
