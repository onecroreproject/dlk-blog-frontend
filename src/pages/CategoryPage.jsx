import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt, FaChevronRight, FaChevronLeft, FaFacebookF, FaPinterestP, FaLinkedinIn, FaYoutube, FaTelegramPlane, FaDiscord, FaInstagram } from "react-icons/fa";
import { useBlogContext } from '../context/BlogContext';

const BlogImage = ({ src, title }) => {
  const [error, setError] = useState(false);
  
  if (error || !src || src.endsWith('undefined') || src.endsWith('null')) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-black text-4xl uppercase">
        {title ? title.charAt(0) : '?'}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      onError={() => setError(true)}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
    />
  );
};

const CategoryPage = () => {
  const { name } = useParams(); // This is the slug, e.g., "full-stack-development"
  const { blogs, categories, loading } = useBlogContext();
  const [categoryName, setCategoryName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    window.scrollTo(0, 0);
    // Find the actual category name from the categories list using the slug
    // Find the actual category name from the categories list using the slug
    if (name === 'all') {
      setCategoryName('All Posts');
    } else if (categories.length > 0) {
      const normalizedParam = name.toLowerCase().replace(/ /g, '-');
      const currentCat = categories.find(c => c.name.toLowerCase().replace(/ /g, '-') === normalizedParam);
      setCategoryName(currentCat ? currentCat.name : name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
    }
    setCurrentPage(1); // Reset to first page on category change
  }, [name, categories]);

  // Filter blogs for this category
  const filteredPosts = name === 'all'
    ? blogs
    : blogs.filter(blog => {
        const blogSlug = blog.category?.toLowerCase().replace(/ /g, '-');
        const paramSlug = name.toLowerCase().replace(/ /g, '-');
        return blogSlug === paramSlug;
      });

  // Pagination Logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    { name: 'Facebook', link: 'https://www.facebook.com/people/DLK-Software-Solutions/61569333069634/', color: 'bg-[#3b5998]', icon: <FaFacebookF /> },
    { name: 'Instagram', link: 'https://www.instagram.com/dlk_softwaresolutions/', color: 'bg-[#e1306c]', icon: <FaInstagram /> },
    { name: 'Linkedin', link: 'https://www.linkedin.com/company/dlk-software-solutions/', color: 'bg-[#0077b5]', icon: <FaLinkedinIn /> },
    { name: 'Youtube', link: 'https://www.youtube.com/@StudentsLearningplatform2026', color: 'bg-[#ff0000]', icon: <FaYoutube /> },
  ];

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-black  text-sm">Loading {categoryName}...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b py-8 md:py-10 px-4 md:px-6">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl md:text-4xl font-black text-gray-900">Category: {categoryName}</h1>
          <div className="text-sm font-bold text-gray-400 flex items-center gap-2">
            <Link to="/" className="hover:text-red-600">DLK Technologies</Link>
            <FaChevronRight size={8} />
            <span className="hover:text-red-600 cursor-pointer">Category</span>
            <FaChevronRight size={8} />
            <span className="text-red-600">{categoryName}</span>
          </div>
        </div>
      </div>

      <div className="w-full px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Main Content: Post List */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {currentPosts.length > 0 ? (
              <>
                {currentPosts.map((post) => (
                  <div key={post._id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col md:flex-row">
                    {/* Post Image */}
                    <div className="md:w-[300px] flex-shrink-0 aspect-video md:aspect-[4/3] overflow-hidden relative bg-gray-100">
                      <BlogImage src={`${BASE_URL}/${post.titleImage}`} title={post.title} />
                      <div className="absolute top-4 right-4 px-3 py-1.5 bg-red-600 text-white text-[9px] font-black rounded-full shadow-lg z-10 uppercase">
                        {post.category}
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="flex-grow p-5 md:p-7 flex flex-col justify-center">
                      <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center border border-red-100 overflow-hidden text-red-600">
                            {post.authorAvatar ? (
                              <img src={`${BASE_URL}/${post.authorAvatar}`} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[10px]">{post.author?.charAt(0)}</span>
                            )}
                          </div>
                          <span>by {post.author}</span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-red-600" />
                          <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>

                      <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-tight mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                        <Link to={`/blog/${post.slug || post._id}`}>{post.title}</Link>
                      </h2>

                      <div
                        dangerouslySetInnerHTML={{ __html: post.content }}
                        className="text-gray-500 font-medium leading-relaxed mb-4 line-clamp-2 text-sm"
                      ></div>

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                        <Link to={`/blog/${post.slug || post._id}`}>
                          <button className="text-red-600 font-black text-[10px] tracking-[2px] uppercase hover:text-black transition-all flex items-center gap-2">
                            Read More <FaChevronRight size={10} />
                          </button>
                        </Link>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400">
                          <span>1 min read</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination UI */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 mt-10">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border ${
                        currentPage === 1 
                        ? 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-red-600 hover:text-white hover:border-red-600 shadow-sm'
                      }`}
                    >
                      <FaChevronLeft size={14} />
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`w-12 h-12 rounded-xl text-sm font-black transition-all border ${
                          currentPage === i + 1
                          ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-100'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-red-600 hover:text-red-600 shadow-sm'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border ${
                        currentPage === totalPages 
                        ? 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-red-600 hover:text-white hover:border-red-600 shadow-sm'
                      }`}
                    >
                      <FaChevronRight size={14} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-32 bg-white rounded-[10px] border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-black text-gray-300 ">No Posts Found in {categoryName}</h2>
                <p className="text-gray-400 mt-2 font-bold">Check back later for fresh content!</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-10">
            {/* Categories Widget */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-black text-gray-900 mb-8 border-l-4 border-red-600 pl-4">Categories</h3>
              <div className="flex flex-col gap-4">
                {categoryCounts.map((cat, i) => (
                  <Link to={`/category/${cat.name.toLowerCase().replace(/ /g, '-')}`} key={i} className="flex items-center justify-between group cursor-pointer border-b border-gray-50 pb-3 last:border-0">
                    <span className={`text-base font-black transition-colors ${cat.name === categoryName ? 'text-red-600' : 'text-gray-600 group-hover:text-red-600'}`}>{cat.name}</span>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all ${cat.name === categoryName ? 'bg-red-600 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-red-600 group-hover:text-white'}`}>{cat.count}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Most Recent Widget */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-black text-gray-900 mb-8 border-l-4 border-red-600 pl-4">Most Recent</h3>
              <div className="flex flex-col gap-8">
                {recentPosts.map((post, i) => (
                  <Link to={`/blog/${post.slug || post._id}`} key={post._id} className="flex gap-4 items-center group cursor-pointer">
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gray-50 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-xs text-gray-400 font-bold">
                        {post.titleImage ? (
                          <img src={`${BASE_URL}/${post.titleImage}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="uppercase">{post.title.charAt(0)}</span>
                        )}
                      </div>
                      <div className="absolute -top-1 -left-1 w-6 h-6 bg-red-600 text-white text-xs font-black rounded-full flex items-center justify-center shadow-lg">{i + 1}</div>
                    </div>
                    <div>
                      <h4 className="text-base font-black text-gray-900 leading-tight group-hover:text-red-600 transition-colors line-clamp-2">{post.title}</h4>
                      <div className="flex items-center gap-2 text-xs font-black text-gray-400 mt-2">
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
              <h3 className="text-2xl font-black text-gray-900 mb-8 border-l-4 border-red-600 pl-4 text-center">Social Media</h3>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${social.color} rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:scale-105 transition-all gap-1 h-20 shadow-sm`}
                  >
                    <div className="text-white text-xl">
                      {social.icon}
                    </div>
                    <div>
                      <p className="text-white font-black text-xs leading-none">{social.name}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Popular Tags Widget */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-black text-gray-900 mb-8 border-l-4 border-red-600 pl-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.length > 0 ? allTags.map((tag, i) => (
                  <Link 
                    key={i} 
                    to={`/tag/${tag}`}
                    className="bg-gray-50 text-gray-400 px-4 py-2 rounded-full text-xs font-black tracking-wider cursor-pointer hover:bg-red-600 hover:text-white transition-all border border-gray-100 shadow-sm"
                  >
                    #{tag}
                  </Link>
                )) : (
                  <span className="text-gray-300 text-sm font-black italic">No tags found</span>
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
