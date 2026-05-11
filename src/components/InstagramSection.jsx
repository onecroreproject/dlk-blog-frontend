import React, { useEffect } from 'react';

/**
 * InstagramSection Component
 * Integrates Elfsight Instagram Feed to display company reels.
 * Features: Dynamic script loading, responsive design, and modern Tailwind aesthetics.
 */
const InstagramSection = () => {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="py-10 md:py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="w-full px-4 lg:px-8">
        {/* Section Header with Gradient Underline Effect */}
       

        {/* Elfsight Embed Container - Premium Card Style */}
        <div className="w-full bg-white rounded-3xl md:rounded-[3rem] p-2 sm:p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 relative">
          {/* Decorative Elements */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-100 rounded-full blur-3xl opacity-50 -z-10"></div>
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-orange-100 rounded-full blur-3xl opacity-50 -z-10"></div>
          
          <div className="relative overflow-hidden rounded-[2.5rem] min-h-[400px] flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-100">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-2xl flex items-center justify-center text-white mb-6 mx-auto shadow-lg shadow-pink-100">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Instagram Feed</h3>
              <p className="text-gray-400 font-bold max-w-xs mx-auto text-sm leading-relaxed">
                Connect with us on Instagram to see our latest updates and behind-the-scenes content.
              </p>
              <a href="https://www.instagram.com/dlk_softwaresolutions/" target="_blank" rel="noopener noreferrer">
                <button className="mt-8 bg-black text-white px-8 py-3 rounded-full font-black text-xs tracking-wider hover:bg-red-600 transition-colors shadow-lg">
                  FOLLOW @DLK_SOFTWARESOLUTIONS
                </button>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default InstagramSection;
