import React from 'react';
import { Link } from 'react-router-dom';
import { useBlogContext } from '../context/BlogContext';

const FeaturedSection = () => {
    const { blogs, loading } = useBlogContext();

                // Sort by Editor's Choice first, then by views
                const sortedBlogs = [...blogs].sort((a, b) => {
                    if (a.isEditorsChoice && !b.isEditorsChoice) return -1;
                    if (!a.isEditorsChoice && b.isEditorsChoice) return 1;
                    return (b.views || 0) - (a.views || 0);
                });

    if (loading) {
        return (
            <div className="px-4 md:px-6 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 rounded-3xl lg:rounded-[10px] overflow-hidden shadow-2xl animate-pulse bg-gray-100 h-auto lg:h-[800px]">
                    <div className="lg:col-span-2 bg-gray-200 h-[400px] lg:h-full"></div>
                    <div className="bg-[#121212] p-6 md:p-8 flex flex-col gap-8">
                        <div className="h-48 bg-gray-800 rounded-xl"></div>
                        <div className="flex flex-col gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-16 h-16 rounded-full bg-gray-800"></div>
                                    <div className="flex-grow py-2 space-y-2">
                                        <div className="h-3 bg-gray-800 rounded w-full"></div>
                                        <div className="h-2 bg-gray-800 rounded w-20"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const mainPost = sortedBlogs[0];
    const sidebarTop = sortedBlogs[1];
    const listPosts = sortedBlogs.slice(2, 5);

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    return (
        <div className="px-4 md:px-6 py-8 md:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 rounded-3xl lg:rounded-[10px] overflow-hidden shadow-2xl border border-gray-100">

                {/* Left Section: Main Featured Post */}
                {mainPost ? (
                    <Link to={`/blog/${mainPost.slug || mainPost._id}`} className="lg:col-span-2 relative h-[400px] md:h-[500px] lg:h-[600px] group cursor-pointer overflow-hidden block">
                        {/* Main Image */}
                        {mainPost.titleImage ? (
                            <img
                                src={`${BASE_URL}/${mainPost.titleImage}`}
                                alt=""
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white font-black text-7xl">{mainPost.title.charAt(0)}</div>
                        )}

                        {/* Overlay Content */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent">
                            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-white font-black text-base shadow-xl">
                                        {mainPost.authorAvatar ? (
                                            <img src={`${BASE_URL}/${mainPost.authorAvatar}`} alt="" className="w-full h-full object-cover rounded-full" />
                                        ) : (
                                            <span>{mainPost.author?.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div className="text-white">
                                        <p className="text-xs font-black  text-red-500 mb-1">Featured Author</p>
                                        <p className="text-base font-black">by {mainPost.author}</p>
                                    </div>
                                </div>

                                <h1 className="text-white text-2xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 leading-tight group-hover:text-red-500 transition-colors">
                                    {mainPost.title}
                                </h1>

                                <div className="flex items-center gap-4 text-xs font-black  text-gray-300 bg-black/40 backdrop-blur-md w-fit px-6 py-3 rounded-full border border-white/10">
                                    <span className="text-red-500">{mainPost.category}</span>
                                    <span>•</span>
                                    <span>{new Date(mainPost.createdAt).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>1 min read</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ) : (
                    <div className="lg:col-span-2 h-[400px] lg:h-[600px] bg-gray-200 flex items-center justify-center text-gray-400 font-bold">No Featured Post</div>
                )}

                {/* Right Section: Sidebar Posts */}
                <div className="bg-[#0a0a0a] p-6 md:p-8 flex flex-col gap-8">

                    {/* Top Sidebar Post */}
                    {sidebarTop ? (
                        <Link to={`/blog/${sidebarTop.slug || sidebarTop._id}`} className="relative h-56 rounded-3xl overflow-hidden group cursor-pointer block border border-white/5 shadow-2xl">
                            {sidebarTop.titleImage ? (
                                <img src={`${BASE_URL}/${sidebarTop.titleImage}`} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white font-black text-3xl">{sidebarTop.title.charAt(0)}</div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent p-6 flex flex-col justify-end">
                                <h3 className="text-white font-black text-base leading-snug group-hover:text-red-500 transition-colors line-clamp-2">
                                    {sidebarTop.title}
                                </h3>
                                <div className="flex items-center gap-2 text-[10px] md:text-[11px] text-gray-400 mt-3 font-black ">
                                    <span className="text-red-600">{sidebarTop.category}</span>
                                    <span>•</span>
                                    <span>{new Date(sidebarTop.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <div className="h-56 bg-gray-800 rounded-3xl flex items-center justify-center text-gray-600">Post Image</div>
                    )}

                    {/* List Posts */}
                    <div className="flex flex-col gap-8">
                        {listPosts.map((post, idx) => (
                            <Link to={`/blog/${post.slug || post._id}`} key={post._id} className="flex gap-4 items-center group cursor-pointer">
                                <div className="relative flex-shrink-0">
                                    <div className="w-16 h-16 rounded-full bg-gray-900 border-2 border-white/10 overflow-hidden flex items-center justify-center text-gray-500 font-black text-sm shadow-xl">
                                        {post.titleImage ? (
                                            <img src={`${BASE_URL}/${post.titleImage}`} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="uppercase">{post.title.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div className={`absolute -top-1 -left-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-[11px] font-black border-2 border-[#0a0a0a] shadow-lg`}>
                                        {idx + 1}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-white font-black text-[15px] leading-tight mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                                        {post.title}
                                    </h4>
                                    <div className="flex items-center gap-2 text-[11px] text-gray-500 font-black ">
                                        <span className="text-red-600">{post.category}</span>
                                        <span>•</span>
                                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>

            </div>
        </div>
    );
};

export default FeaturedSection;
