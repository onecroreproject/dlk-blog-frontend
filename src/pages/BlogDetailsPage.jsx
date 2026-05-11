import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaCalendarAlt, FaUser, FaQuoteRight, FaFacebookF, FaTwitter,
  FaLinkedinIn, FaPinterestP, FaYoutube, FaTelegramPlane,
  FaDiscord, FaThLarge, FaInstagram, FaRegComment, FaEnvelope,
  FaEye, FaShareAlt
} from "react-icons/fa";

const BlogDetailsPage = () => {
  const { idOrSlug } = useParams();
  const [blog, setBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      setLoading(true);
      try {
        setLoading(true);
        // Check if idOrSlug is likely a MongoDB ID or a slug
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
        const blogUrl = isMongoId
          ? `${import.meta.env.VITE_API_URL}/blogs/${idOrSlug}`
          : `${import.meta.env.VITE_API_URL}/blogs/slug/${idOrSlug}`;

        const [blogRes, allBlogsRes, catsRes] = await Promise.all([
          axios.get(blogUrl),
          axios.get(`${import.meta.env.VITE_API_URL}/blogs`),
          axios.get(`${import.meta.env.VITE_API_URL}/categories`)
        ]);
        setBlog(blogRes.data);
        setBlogs(allBlogsRes.data);
        setCategories(catsRes.data);
      } catch (err) {
        console.error('Error fetching blog data:', err);
        setError('Article not found');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);

    // View Count Logic: Increment if user stays for 2 minutes
    const viewTimer = setTimeout(async () => {
      try {
        await axios.patch(`${import.meta.env.VITE_API_URL}/blogs/${id}/view`);
        setBlog(prev => prev ? { ...prev, views: (prev.views || 0) + 1 } : null);
      } catch (err) {
        console.error('Error incrementing view count:', err);
      }
    }, 60000); // 60,000ms = 1 minutes

    return () => clearTimeout(viewTimer);
  }, [idOrSlug]);

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = blog?.title;

    let shareUrl = '';
    if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}`;

    if (shareUrl) {
      window.open(shareUrl, '_blank');
      try {
        await axios.patch(`${import.meta.env.VITE_API_URL}/blogs/${id}/share`);
        setBlog(prev => prev ? { ...prev, shares: (prev.shares || 0) + 1 } : null);
      } catch (err) {
        console.error('Error incrementing share count:', err);
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-3xl  text-gray-400">Loading Article...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center font-black text-2xl  text-red-600">{error}</div>;
  if (!blog) return null;

  // Clean HTML content from &nbsp; and tabs for perfect alignment
  const cleanContent = (html) => {
    if (!html) return '';
    return html
      .replace(/&nbsp;/g, ' ')
      .replace(/\t/g, '')
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><'); // Remove spaces between tags
  };

  // Helper: Get blog count for category
  const getBlogCount = (catName) => blogs.filter(b => b.category === catName).length;

  // Recent Blogs (Latest 3)
  const recentBlogs = [...blogs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  // Prev/Next Blogs
  const currentIndex = blogs.findIndex(b => b._id === blog._id);
  const prevBlog = currentIndex > 0 ? blogs[currentIndex - 1] : null;
  const nextBlog = currentIndex < blogs.length - 1 ? blogs[currentIndex + 1] : null;

  // Real Popular Tags (Unique tags from all blogs)
  const popularTags = Array.from(new Set(blogs.flatMap(b => b.tags || []))).slice(0, 15);

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <div className="bg-white border-b py-8 md:py-10 px-4 md:px-6">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl md:text-4xl font-black text-gray-900">{blog.title}</h1>
          <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 tracking-wider">
            <Link to="/" className="hover:text-red-600 transition-colors">ebuzz</Link>
            <span className="text-gray-300">&gt;</span>
            <span className="hover:text-red-600 cursor-pointer">{blog.category}</span>
            <span className="text-gray-300">&gt;</span>
            <span className="text-red-600">Details</span>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-6 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          <div className="lg:w-[68%]">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-8">
              <img
                src={`${import.meta.env.VITE_BASE_URL}/${blog.titleImage}`}
                alt=""
                className="w-full h-auto"
              />
            </div>

            <div className="flex flex-wrap items-center gap-6 mb-8 text-[11px] font-bold text-gray-400">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-red-600" />
                <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaUser className="text-red-600" />
                <span>by {blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaEye className="text-red-600" />
                <span>{blog.views || 0} Views</span>
              </div>
              <div className="flex items-center gap-2">
                <FaShareAlt className="text-red-600" />
                <span>{blog.shares || 0} Shares</span>
              </div>
            </div>

            <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-8 leading-tight">{blog.title}</h2>

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none text-gray-600 leading-relaxed mb-12 blog-content-body"
              dangerouslySetInnerHTML={{ __html: cleanContent(blog.content) }}
            />

            {/* Blockquote Style from Reference */}
            <div className="my-8 md:my-12 py-8 md:py-12 px-6 md:px-10 bg-white border border-gray-100 rounded-xl text-center shadow-sm relative overflow-hidden">
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-200">
                  <FaQuoteRight className="text-xl md:text-2xl" />
                </div>
              </div>
              <p className="text-xl md:text-3xl font-black text-gray-900 leading-snug mb-4 max-w-2xl mx-auto">
                Holistically build technologies expanded array relationships productize professional tailers rather mesh stand
              </p>
              <span className="text-red-600 font-black text-xs md:text-sm tracking-[0.2em]">{blog.author}</span>
              <div className="text-[10px] md:text-xs text-gray-400 font-bold mt-1">Top Author</div>
            </div>

            {/* Grid Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {blog.blogImage1 && (
                <div className="rounded-xl overflow-hidden shadow-sm">
                  <img src={`${import.meta.env.VITE_BASE_URL}/${blog.blogImage1}`} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              {blog.blogImage2 && (
                <div className="rounded-xl overflow-hidden shadow-sm">
                  <img src={`${import.meta.env.VITE_BASE_URL}/${blog.blogImage2}`} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Article Footer Meta */}
            <div className="flex flex-col sm:flex-row justify-between items-center py-6 border-y border-gray-100 mb-12 gap-4">
              <div className="flex items-center gap-2 text-sm font-bold">
                <span className="text-gray-900 whitespace-nowrap">Tags :</span>
                <div className="flex flex-wrap gap-2">
                  {blog.tags && blog.tags.length > 0 ? (
                    blog.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[11px] font-black hover:bg-red-600 hover:text-white transition-all cursor-pointer">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">No tags found</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-900 text-sm font-bold">Social Icon :</span>
                <div className="flex gap-4 text-gray-400">
                  <FaFacebookF onClick={() => handleShare('facebook')} className="hover:text-red-600 cursor-pointer transition-colors" />
                  <FaTwitter onClick={() => handleShare('twitter')} className="hover:text-red-600 cursor-pointer transition-colors" />
                  <FaLinkedinIn onClick={() => handleShare('linkedin')} className="hover:text-red-600 cursor-pointer transition-colors" />
                </div>
              </div>
            </div>

            {/* Prev/Next Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {prevBlog ? (
                <Link to={`/blog/${prevBlog.slug || prevBlog._id}`} className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-50 hover:border-red-100 transition-all group">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={`${import.meta.env.VITE_BASE_URL}/${prevBlog.titleImage}`} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-gray-300  mb-1">Previous Post</div>
                    <h4 className="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">{prevBlog.title}</h4>
                  </div>
                </Link>
              ) : <div />}
              {nextBlog && (
                <Link to={`/blog/${nextBlog.slug || nextBlog._id}`} className="flex items-center justify-end gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-50 hover:border-red-100 transition-all group text-right">
                  <div>
                    <div className="text-xs font-black text-gray-300  mb-1">Next Post</div>
                    <h4 className="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">{nextBlog.title}</h4>
                  </div>
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={`${import.meta.env.VITE_BASE_URL}/${nextBlog.titleImage}`} alt="" className="w-full h-full object-cover" />
                  </div>
                </Link>
              )}
            </div>

            {/* Author Bio Card */}
            <div className="bg-white p-6 md:p-10 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-center mb-12">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 shadow-md">
                {blog.authorAvatar ? (
                  <img src={`${import.meta.env.VITE_BASE_URL}/${blog.authorAvatar}`} alt={blog.author} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-red-50 text-red-600 font-black text-2xl md:text-3xl">{blog.author.charAt(0)}</div>
                )}
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">{blog.author}</h3>
                <div className="text-red-600 font-black text-[10px] md:text-xs mb-4">Author</div>
                <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed">
                  I have a personal philosophy in life: If somebody else can do something that I'm doing, they should do it. And what I want to do is find things that would represent a unique contribution to the world.
                </p>
              </div>
            </div>

            {/* Comment Form */}
            <div className="bg-white p-6 md:p-10 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Leave a Reply</h3>
              <p className="text-gray-400 text-xs md:text-sm font-bold mb-8">Your email address will not be published. Required fields are marked *</p>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <input type="text" placeholder="Your Name" className="w-full bg-[#fcfcfc] border border-gray-100 rounded-lg py-4 px-6 outline-none focus:border-red-600 transition-all font-bold text-base" />
                    <FaUser className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" />
                  </div>
                  <div className="relative">
                    <input type="email" placeholder="Email Address" className="w-full bg-[#fcfcfc] border border-gray-100 rounded-lg py-4 px-6 outline-none focus:border-red-600 transition-all font-bold text-base" />
                    <FaEnvelope className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" />
                  </div>
                </div>
                <textarea placeholder="Write Your Message" className="w-full bg-[#fcfcfc] border border-gray-100 rounded-lg py-4 px-6 outline-none focus:border-red-600 transition-all font-bold text-base h-40 resize-none"></textarea>
                <button className="bg-red-600 text-white font-black text-sm  px-10 py-5 rounded-lg hover:bg-black transition-all shadow-lg shadow-red-100">Send Comment</button>
              </form>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:w-[32%] space-y-10">

            {/* Categories Widget */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-[#fafafa]">
                <h3 className="text-xl font-black text-gray-900">Categories</h3>
              </div>
              <div className="p-6 space-y-4">
                {categories.map(cat => (
                  <div key={cat._id} className="flex justify-between items-center group cursor-pointer">
                    <span className="text-base font-bold text-gray-500 group-hover:text-red-600 transition-colors">{cat.name}</span>
                    <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-xs font-black text-gray-400 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">{getBlogCount(cat.name)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Posts Widget */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-[#fafafa]">
                <h3 className="text-xl font-black text-gray-900">Recent Posts</h3>
              </div>
              <div className="p-6 space-y-6">
                {recentBlogs.map(post => (
                  <Link key={post._id} to={`/blog/${post.slug || post._id}`} className="flex items-center gap-4 group">
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-100 shadow-sm group-hover:border-red-600 transition-all">
                      <img src={`${import.meta.env.VITE_BASE_URL}/${post.titleImage}`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <div className="text-[11px] font-black text-red-600  mb-1">{post.category}</div>
                      <h4 className="text-base font-bold text-gray-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">{post.title}</h4>
                      <div className="text-xs font-bold text-gray-400 mt-1">3 min read</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Media Widget */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-[#fafafa]">
                <h3 className="text-xl font-black text-gray-900">Social Media</h3>
              </div>
              <div className="p-6 grid grid-cols-2 gap-3">
                {[
                  { icon: <FaFacebookF />, label: 'Facebook', color: '#3b5998', link: 'https://www.facebook.com/people/DLK-Software-Solutions/61569333069634/' },
                  { icon: <FaInstagram />, label: 'Instagram', color: '#e1306c', link: 'https://www.instagram.com/dlk_softwaresolutions/' },
                  { icon: <FaLinkedinIn />, label: 'LinkedIn', color: '#0077b5', link: 'https://www.linkedin.com/company/dlk-software-solutions/' },
                  { icon: <FaYoutube />, label: 'Youtube', color: '#cd201f', link: 'https://www.youtube.com/@StudentsLearningplatform2026' },
                ].map(social => (
                  <a 
                    key={social.label} 
                    href={social.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ backgroundColor: social.color }} 
                    className="flex flex-col items-center justify-center py-4 rounded-xl text-white cursor-pointer hover:scale-105 transition-transform"
                  >
                    <span className="text-xl mb-1">{social.icon}</span>
                    <span className="text-[10px] font-black ">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Photo Gallery Widget */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-[#fafafa]">
                <h3 className="text-xl font-black text-gray-900">Photo Gallery</h3>
              </div>
              <div className="p-6 grid grid-cols-3 gap-2">
                {blogs.slice(0, 6).map((item, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden bg-gray-100 shadow-sm hover:opacity-80 transition-opacity cursor-pointer">
                    <img src={`${import.meta.env.VITE_BASE_URL}/${item.titleImage}`} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Tags Widget */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-[#fafafa]">
                <h3 className="text-xl font-black text-gray-900">Popular Tags</h3>
              </div>
              <div className="p-6 flex flex-wrap gap-2">
                {popularTags.length > 0 ? (
                  popularTags.map(tag => (
                    <div key={tag} className="px-4 py-2 bg-gray-50 rounded-full text-xs font-black text-gray-500 hover:bg-red-600 hover:text-white cursor-pointer transition-all border border-gray-100 shadow-sm">
                      {tag}
                    </div>
                  ))
                ) : (
                  <span className="text-gray-400 text-xs font-bold  px-2">No tags available</span>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .blog-content-body p {
          margin-bottom: 2rem;
          color: #4a5568;
          text-align: justify;
          text-justify: inter-word;
        }
        .blog-content-body h2 {
          font-weight: 900;
          color: #1a202c;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          text-transform:;
          letter-spacing: -0.5px;
        }
        .blog-content-body strong {
          color: #1a202c;
          font-weight: 900;
        }
      `}</style>
    </div>
  );
};

export default BlogDetailsPage;



