import React from 'react';

const InstagramSection = () => {
  const images = [1, 2, 3, 4];

  return (
    <section className="container mx-auto px-6 py-12">
      {/* Centered Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="flex-grow h-[1px] bg-gray-200"></div>
        <h2 className="text-2xl font-black text-gray-900 whitespace-nowrap px-4">Follow Instagram</h2>
        <div className="flex-grow h-[1px] bg-gray-200"></div>
      </div>

      {/* Instagram Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {images.map((img) => (
          <div key={img} className="aspect-[4/5] rounded-3xl overflow-hidden group cursor-pointer shadow-lg relative">
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold group-hover:scale-110 transition-transform duration-500">
              Insta Post {img}
            </div>
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                <span className="text-xl">❤</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InstagramSection;

