import React from 'react';

const PostGridSection = () => {
  const horizontalPosts = [
    {
      id: 1,
      title: '5G Expansion on Global Communication and Business Growth',
      excerpt: 'Quickly predominate enabled technology and web-enabled schemas. Completely evisculate diverse communities whereas pandemic data.',
      author: 'Edward',
      date: '3 months ago',
      category: 'Leadership',
      readTime: '2 min read'
    },
    {
      id: 2,
      title: 'Why Global Tech Collaboration Is the Key to Solving Climate Change',
      excerpt: 'Quickly predominate enabled technology and web-enabled schemas. Completely evisculate diverse communities whereas pandemic data.',
      author: 'Edward',
      date: '3 months ago',
      category: 'Leadership',
      readTime: '2 min read'
    },
    {
      id: 3,
      title: 'Why Global Tech Collaboration Is the Key to Solving Climate Change',
      excerpt: 'Quickly predominate enabled technology and web-enabled schemas. Completely evisculate diverse communities whereas pandemic data.',
      author: 'Edward',
      date: '3 months ago',
      category: 'Leadership',
      readTime: '2 min read'
    }
  ];

  const gridPosts = [
    {
      id: 4,
      title: 'Minimalist Packing Guide: Essentials for Every Journey',
      author: 'Edward',
      date: '3 months ago',
      category: 'Space',
      readTime: '1 min read'
    },
    {
      id: 5,
      title: 'Why Global Tech Collaboration Is the Key to Solving Climate',
      author: 'Edward',
      date: '3 months ago',
      category: 'Mobiles',
      readTime: '1 min read'
    },
    {
      id: 6,
      title: 'Why Lifelong Learning Is No Longer Optional in Today’s Economy',
      author: 'Edward',
      date: '3 months ago',
      category: 'Travel',
      readTime: '1 min read'
    },
    {
      id: 7,
      title: 'Minimalist Packing Guide: Essentials for Every Journey',
      author: 'Edward',
      date: '3 months ago',
      category: 'Mobile',
      readTime: '1 min read'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Column: Horizontal Cards */}
        <div className="flex flex-col gap-8">
          {horizontalPosts.map((post) => (
            <div key={post.id} className="flex flex-col md:flex-row gap-6 group cursor-pointer bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="md:w-2/5 h-48 md:h-auto bg-gray-200 flex items-center justify-center text-gray-400 font-bold overflow-hidden">
                <div className="w-full h-full bg-gray-200 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">Post Img</div>
              </div>
              <div className="md:w-3/5 p-4 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                  <span className="text-xs text-gray-600 font-medium">by {post.author} • {post.date}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider">
                  <span className="text-blue-600">{post.category}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-500">{post.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gridPosts.map((post) => (
            <div key={post.id} className="relative h-[350px] rounded-2xl overflow-hidden group cursor-pointer shadow-lg">
              {/* Background Image Placeholder */}
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center text-gray-600 font-bold">
                Grid Img
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-gray-400 border border-white/20"></div>
                  <span className="text-[10px] text-white font-medium">by {post.author} • {post.date}</span>
                </div>
                <h4 className="text-white font-bold text-base leading-tight mb-3 group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-blue-400">{post.category}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/60">{post.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default PostGridSection;
