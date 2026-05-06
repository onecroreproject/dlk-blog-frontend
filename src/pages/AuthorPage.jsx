import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaChevronRight, FaFacebookF, FaPinterestP, FaLinkedinIn, FaYoutube, FaTelegramPlane, FaDiscord, FaHome } from "react-icons/fa";

const AuthorPage = () => {
  const { name } = useParams();
  const authorName = name ? name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Casey Roberts';

  const posts = [
    {
      id: 1,
      title: 'The Role of the United Nations in Addressing Global',
      excerpt: 'Quickly predominate enabled technology and web-enabled schemas. Completely evisculate diverse communities whereas pandemic data. Quickly build covalent data after turnkey content...',
      date: '2 months ago',
      category: 'Uncategorized',
      readTime: '1 min read'
    },
    {
      id: 2,
      title: 'How Regional Conflicts Impact Global Peace and',
      excerpt: 'Quickly predominate enabled technology and web-enabled schemas. Completely evisculate diverse communities whereas pandemic data. Quickly build covalent data after turnkey content...',
      date: '2 months ago',
      category: 'Uncategorized',
      readTime: '1 min read'
    }
  ];

  const sidebarCategories = [
    { name: 'Affairs', count: 1 },
    { name: 'AI Models', count: 1 },
    { name: 'Analytics', count: 4 },
    { name: 'Animals', count: 1 },
    { name: 'Animals Eating', count: 1 },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b py-10 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-black text-gray-900">Author: {authorName}</h1>
          <div className="text-xs font-bold text-gray-400 flex items-center gap-2 uppercase tracking-tighter">
            <Link to="/" className="flex items-center gap-1 hover:text-red-600"><FaHome size={10} /> DLK Technologies</Link>
            <FaChevronRight size={8} />
            <span className="text-red-600">Articles by: {authorName}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Author Bio Banner */}
        <div className="bg-white rounded-[40px] p-12 border border-gray-100 shadow-sm mb-12 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-grow text-center md:text-left">
            <h2 className="text-4xl font-black text-gray-900 mb-6">{authorName}</h2>
            <p className="text-gray-400 font-medium leading-relaxed max-w-2xl">
              I have a personal philosophy in life: If somebody else can do something that I'm doing, they should do it. And what I want to do is find things that would represent a unique contribution to the world.
            </p>
          </div>
          <div className="w-48 h-48 rounded-full border-8 border-gray-50 overflow-hidden shadow-2xl flex-shrink-0">
             <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 font-black uppercase text-xs">Author Photo</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content: Post List */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row gap-6 p-6 group cursor-pointer">
                <div className="md:w-1/3 aspect-video md:aspect-square bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 relative">
                  <div className="w-full h-full flex items-center justify-center text-gray-300 font-black uppercase text-[10px] group-hover:scale-105 transition-transform duration-500">Post Img</div>
                </div>
                <div className="flex-grow flex flex-col justify-center">
                   <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                      <div className="flex items-center gap-1">
                        <FaUser className="text-red-600" size={10} />
                        <span>by {authorName}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="text-red-600" size={10} />
                        <span>{post.date}</span>
                      </div>
                   </div>
                   <h3 className="text-xl font-black text-gray-900 leading-tight mb-4 group-hover:text-red-600 transition-colors">
                     {post.title}
                   </h3>
                   <p className="text-gray-400 text-sm font-medium leading-relaxed mb-6 line-clamp-2">
                     {post.excerpt}
                   </p>
                   <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-red-600">
                      <span>{post.category}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-400">{post.readTime}</span>
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-10">
            {/* Categories */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 mb-8 border-l-4 border-red-600 pl-4 uppercase tracking-tighter">Categories</h3>
              <div className="flex flex-col gap-4">
                {sidebarCategories.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer border-b border-gray-50 pb-3 last:border-0">
                    <span className="text-sm font-black text-gray-600 group-hover:text-red-600 transition-colors">{cat.name}</span>
                    <span className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-xs font-black text-gray-400 group-hover:bg-red-600 group-hover:text-white transition-all">{cat.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Recent */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
               <h3 className="text-lg font-black text-gray-900 mb-8 border-l-4 border-red-600 pl-4 uppercase tracking-tighter">Most Recent</h3>
               <div className="flex flex-col gap-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="group cursor-pointer">
                       <h4 className="text-sm font-black text-gray-900 leading-tight mb-2 group-hover:text-red-600 transition-colors">The Role of Education in Building</h4>
                       <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                          <span className="text-red-600">Innovate</span>
                          <span>•</span>
                          <span>19 Oct</span>
                       </div>
                       <div className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-widest flex items-center gap-1">
                          <span>•</span> 1 min read
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Social Media */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 mb-8 border-l-4 border-red-600 pl-4 uppercase tracking-tighter">Social Media</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Facebook', color: 'bg-[#3b5998]', icon: <FaFacebookF /> },
                  { name: 'Pinterest', color: 'bg-[#bd081c]', icon: <FaPinterestP /> },
                  { name: 'Linkedin', color: 'bg-[#0077b5]', icon: <FaLinkedinIn /> },
                  { name: 'Youtube', color: 'bg-[#ff0000]', icon: <FaYoutube /> },
                  { name: 'Telegram', color: 'bg-[#0088cc]', icon: <FaTelegramPlane /> },
                  { name: 'Discord', color: 'bg-[#7289da]', icon: <FaDiscord /> },
                ].map((social, i) => (
                  <div 
                    key={i} 
                    className={`${social.color} rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:opacity-90 transition-opacity gap-1 h-20 shadow-md`}
                  >
                    <div className="text-white text-lg">{social.icon}</div>
                    <p className="text-white font-black text-[8px] uppercase tracking-widest">{social.name}</p>
                    <p className="text-white/60 text-[6px] uppercase font-bold">14k followers</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 mb-8 border-l-4 border-red-600 pl-4 uppercase tracking-tighter">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['Artificial Intelligence', 'Beauty', 'Breaking News', 'Business', 'Climate Change', 'Court News', 'Crime Report', 'Cyber Security', 'Development', 'Economy', 'Education', 'Elections', 'Entertainment', 'Environment', 'Global Market'].map((tag, i) => (
                  <span key={i} className="bg-gray-50 text-gray-500 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider cursor-pointer hover:bg-red-600 hover:text-white transition-all border border-gray-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorPage;
