import React from 'react';

const SectionTitle = ({ title, linkText }) => {
  return (
    <div className="container mx-auto px-6 mb-10 flex items-center justify-between gap-6">
      <div className="flex items-center gap-4 flex-grow">
        <h2 className="text-3xl font-black text-gray-900 whitespace-nowrap">{title}</h2>
        <div className="flex-grow flex flex-col gap-[2px]">
          <div className="h-[1px] w-full bg-gray-200"></div>
          <div className="h-[1px] w-full bg-gray-100"></div>
        </div>
      </div>
      <button className="px-6 py-2 border border-gray-200 rounded-full text-blue-600 text-sm font-bold hover:bg-blue-50 transition-colors whitespace-nowrap">
        {linkText}
      </button>
    </div>
  );
};

export default SectionTitle;
