import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt, FaChevronRight, FaFacebookF, FaPinterestP, FaLinkedinIn, FaYoutube, FaTelegramPlane, FaDiscord } from "react-icons/fa";

const CategoryPage = () => {
  const { name } = useParams(); // This is the slug, e.g., "full-stack-development"
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsRes, catsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/blogs`),
          axios.get(`${import.meta.env.VITE_API_URL}/categories`)
        ]);

        setBlogs(blogsRes.data);
        setCategories(catsRes.data);

        // Find the actual category name from the categories list using the slug
        const currentCat = catsRes.data.find(c => c.name.toLowerCase().replace(/ /g, '-') === name);
        setCategoryName(currentCat ? currentCat.name : name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
      } catch (err) {
        console.error("Error fetching category page data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [name]);

  // Filter blogs for this category
  const filteredPosts = blogs.filter(blog =>
    blog.category.toLowerCase().replace(/ /g, '-') === name
  );

  // Sidebar: Category Counts
  const categoryCounts = categories.map(cat => ({
    name: cat.name,
    count: blogs.filter(b => b.category === cat.name).length
  })).filter(c => c.count > 0);

  // Sidebar: Recent Posts
  const recentPosts = [...blogs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  // Sidebar: Popular Tags
  const allTags = Array.from(new Set(blogs.flatMap(b => b.tags || []))).slice(0, 15);

  const socialLinks = [
    { name: 'Facebook', followers: '14k followers', color: 'bg-[#3b5998]', icon: <FaFacebookF /> },
    { name: 'Pinterest', followers: '14k followers', color: 'bg-[#bd081c]', icon: <FaPinterestP /> },
    { name: 'Linkedin', followers: '14k followers', color: 'bg-[#0077b5]', icon: <FaLinkedinIn /> },
    { name: 'Youtube', followers: '14k followers', color: 'bg-[#ff0000]', icon: <FaYoutube /> },
    { name: 'Telegram', followers: '14k followers', color: 'bg-[#0088cc]', icon: <FaTelegramPlane /> },
    { name: 'Discord', followers: '14k followers', color: 'bg-[#7289da]', icon: <FaDiscord /> },
  ];

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Loading {categoryName}...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b py-10 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Category: {categoryName}</h1>
          <div className="text-xs font-bold text-gray-400 flex items-center gap-2 uppercase tracking-tighter">
            <Link to="/" className="hover:text-red-600">DLK Technologies</Link>
            <FaChevronRight size={8} />
            <span className="hover:text-red-600 cursor-pointer">Category</span>
            <FaChevronRight size={8} />
            <span className="text-red-600">{categoryName}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Main Content: Post List */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div key={post._id} className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                  {/* Post Image */}
                  <div className="aspect-video bg-gray-200 overflow-hidden relative">
                    {post.titleImage ? (
                      <img
                        src={`${BASE_URL}/${post.titleImage}`}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-black text-xl uppercase tracking-widest">{post.title.charAt(0)}</div>
                    )}
                    <div className="absolute top-6 right-6 px-4 py-2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg z-10">
                      {post.category}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-10">
                    <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 mb-6 uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center border border-red-100 overflow-hidden text-red-600">
                          {post.authorAvatar ? (
                            <img src={`${BASE_URL}/${post.authorAvatar}`} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span>{post.author?.charAt(0)}</span>
                          )}
                        </div>
                        <span>by {post.author}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-red-600" />
                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>

                    <h2 className="text-3xl font-black text-gray-900 leading-tight mb-6 group-hover:text-red-600 transition-colors">
                      <Link to={`/blog/${post._id}`}>{post.title}</Link>
                    </h2>

                    <div
                      dangerouslySetInnerHTML={{ __html: post.content }}
                      className="text-gray-500 font-medium leading-relaxed mb-8 line-clamp-3 text-sm"
                    ></div>

                    <Link to={`/blog/${post._id}`}>
                      <button className="bg-red-600 text-white font-black text-[11px] uppercase tracking-[2px] px-8 py-4 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100 mb-8">
                        Read More
                      </button>
                    </Link>

                    <div className="pt-8 border-t border-gray-50 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <span className="text-red-600 hover:underline cursor-pointer">{post.category}</span>
                      <span>•</span>
                      <span>1 min read</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-32 bg-white rounded-[40px] border border-gray-100 shadow-sm">
                <h2 className="text-xl font-black text-gray-300 uppercase tracking-widest">No Posts Found in {categoryName}</h2>
                <p className="text-gray-400 mt-2 font-bold">Check back later for fresh content!</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-10">
            {/* Categories Widget */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-8 border-l-4 border-red-600 pl-4 uppercase tracking-tighter">Categories</h3>
              <div className="flex flex-col gap-4">
                {categoryCounts.map((cat, i) => (
                  <Link to={`/category/${cat.name.toLowerCase().replace(/ /g, '-')}`} key={i} className="flex items-center justify-between group cursor-pointer border-b border-gray-50 pb-3 last:border-0">
                    <span className={`text-sm font-black transition-colors ${cat.name === categoryName ? 'text-red-600' : 'text-gray-600 group-hover:text-red-600'}`}>{cat.name}</span>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${cat.name === categoryName ? 'bg-red-600 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-red-600 group-hover:text-white'}`}>{cat.count}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Most Recent Widget */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-8 border-l-4 border-red-600 pl-4 uppercase tracking-tighter">Most Recent</h3>
              <div className="flex flex-col gap-8">
                {recentPosts.map((post, i) => (
                  <Link to={`/blog/${post._id}`} key={post._id} className="flex gap-4 items-center group cursor-pointer">
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gray-50 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-[10px] text-gray-400 font-bold">
                        {post.titleImage ? (
                          <img src={`${BASE_URL}/${post.titleImage}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="uppercase">{post.title.charAt(0)}</span>
                        )}
                      </div>
                      <div className="absolute -top-1 -left-1 w-6 h-6 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg">{i + 1}</div>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-gray-900 leading-tight group-hover:text-red-600 transition-colors line-clamp-2">{post.title}</h4>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 mt-2">
                        <span className="text-red-600">{post.category}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Media Widget */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-8 border-l-4 border-red-600 pl-4 uppercase tracking-tighter text-center">Social Media</h3>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((social, i) => (
                  <div
                    key={i}
                    className={`${social.color} rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:scale-105 transition-all gap-1 h-20 shadow-sm`}
                  >
                    <div className="text-white text-lg">
                      {social.icon}
                    </div>
                    <div>
                      <p className="text-white font-black text-[10px] uppercase leading-none">{social.name}</p>
                      <p className="text-white/60 text-[8px] mt-1 uppercase font-bold">{social.followers}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Tags Widget */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-8 border-l-4 border-red-600 pl-4 uppercase tracking-tighter">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.length > 0 ? allTags.map((tag, i) => (
                  <span key={i} className="bg-gray-50 text-gray-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider cursor-pointer hover:bg-red-600 hover:text-white transition-all border border-gray-100 shadow-sm">
                    #{tag}
                  </span>
                )) : (
                  <span className="text-gray-300 text-xs font-black uppercase italic">No tags found</span>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
