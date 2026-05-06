import React, { useState, useEffect } from 'react';
import { FaPlay } from "react-icons/fa";
import axios from 'axios';
import { Link } from 'react-router-dom';

const EditorsChoice = () => {
  const [blogs, setBlogs] = useState([]);
  const [editorsChoice, setEditorsChoice] = useState([]);
  const categories = ["STORIES OF THE DAY", "STORIES OF THE WEEK", "STORIES OF THE MONTH"];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/blogs`);
        const choice = res.data.filter(b => b.isEditorsChoice === true);
        setBlogs(res.data);
        setEditorsChoice(choice);
      } catch (err) {
        console.error("Error fetching Editor's Choice:", err);
      }
    };
    fetchBlogs();
  }, []);

  const dummyData = [
    { _id: '1', title: 'Discoveries in Genetics That Could Change Human History', category: 'Stories of the Week', author: 'Edward', createdAt: new Date() },
    { _id: '2', title: 'The Ethics of Artificial Intelligence: Should We Fear the Future?', category: 'Stories of the Week', author: 'Edward', createdAt: new Date() },
    { _id: '3', title: 'Sustainable Tourism Is Changing the Way We See the World', category: 'Stories of the day', author: 'Edward', createdAt: new Date() },
    { _id: '4', title: 'Why Lifelong Learning Is No Longer Optional in Today’s Economy', category: 'Stories of the day', author: 'Edward', createdAt: new Date() },
    { _id: '5', title: 'Olympic Dreams: Stories of Athletes Who Overcame the Impossible', category: 'Stories of the day', author: 'Edward', createdAt: new Date() },
  ];

  const displayPosts = editorsChoice.length > 0 ? editorsChoice : dummyData;
  const mainPost = displayPosts[0];
  const sidePosts = displayPosts.slice(1, 5);

  return (
    <section className="bg-green-700 py-16 mt-12">
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-4 w-full justify-center mb-8">
            <div className="h-[2px] bg-white/20 flex-grow max-w-[200px]"></div>
            <h2 className="text-white text-3xl font-black uppercase tracking-widest text-center">Editor's Choice</h2>
            <div className="h-[2px] bg-white/20 flex-grow max-w-[200px]"></div>
          </div>
          
          <div className="flex gap-8 overflow-x-auto pb-4 no-scrollbar">
            {categories.map((cat, i) => (
              <button 
                key={i} 
                className={`text-[10px] md:text-xs font-bold tracking-tighter transition-colors whitespace-nowrap ${i === 0 ? 'text-white border-b-2 border-green-400 pb-1' : 'text-white/60 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Main Featured Post */}
          {mainPost && (
            <Link to={mainPost._id ? `/blog/${mainPost._id}` : '#'} className="relative h-[600px] rounded-2xl overflow-hidden group cursor-pointer shadow-2xl block">
              {mainPost.titleImage ? (
                <img 
                  src={`${import.meta.env.VITE_BASE_URL}/${mainPost.titleImage}`} 
                  alt="" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
              ) : (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-700 font-bold text-4xl">
                  {mainPost.title.charAt(0)}
                </div>
              )}
              
              {/* Play Button Overlay */}
              <div className="absolute top-8 left-8 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform z-10">
                <FaPlay className="text-green-700 ml-1 text-xl" />
              </div>

              {/* Bottom Content Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent flex flex-col justify-end p-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-[10px] font-bold uppercase">
                    {mainPost.author?.charAt(0)}
                  </div>
                  <span className="text-white text-sm font-bold">
                    by {mainPost.author} • {new Date(mainPost.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="text-white text-3xl font-bold leading-tight mb-4 group-hover:text-green-400 transition-colors">
                  {mainPost.title}
                </h3>
                <div className="flex items-center gap-3 text-xs font-bold uppercase text-white/70">
                  <span className="text-green-400">{mainPost.category}</span>
                  <span>•</span>
                  <span>1 min read</span>
                </div>
              </div>
            </Link>
          )}

          {/* Side Posts Grid (2x2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sidePosts.map((post) => (
              <Link key={post._id} to={post._id ? `/blog/${post._id}` : '#'} className="bg-white rounded-2xl overflow-hidden shadow-xl flex flex-col group cursor-pointer hover:-translate-y-2 transition-all duration-300">
                <div className="h-44 relative bg-gray-200 overflow-hidden">
                  {post.titleImage ? (
                    <img 
                      src={`${import.meta.env.VITE_BASE_URL}/${post.titleImage}`} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-2xl uppercase">
                      {post.title.charAt(0)}
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform z-10">
                      <FaPlay className="text-red-500 ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600 text-[8px] font-black uppercase">
                       {post.author?.charAt(0)}
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold">by {post.author} • {new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-gray-900 font-bold text-sm leading-snug mb-4 group-hover:text-green-600 transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <div className="mt-auto flex items-center gap-2 text-[10px] font-bold uppercase text-gray-400">
                    <span className="text-blue-600">{post.category}</span>
                    <span>•</span>
                    <span>1 min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default EditorsChoice;

