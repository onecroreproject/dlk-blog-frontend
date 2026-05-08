import React, { useEffect } from 'react';

/**
 * InstagramSection Component
 * Integrates Elfsight Instagram Feed to display company reels.
 * Features: Dynamic script loading, responsive design, and modern Tailwind aesthetics.
 */
const InstagramSection = () => {
  useEffect(() => {
    // Check if script is already present to avoid multiple loads
    const existingScript = document.querySelector('script[src="https://elfsightcdn.com/platform.js"]');
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://elfsightcdn.com/platform.js';
      script.async = true;
      document.body.appendChild(script);
    }

    // Elfsight widget might need a re-initialization call if it doesn't appear on dynamic routes
    // but usually the data-elfsight-app-lazy attribute handles it well.
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header with Gradient Underline Effect */}
       

        {/* Elfsight Embed Container - Premium Card Style */}
        <div className="w-full bg-white rounded-[3rem] p-2 sm:p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 relative">
          {/* Decorative Elements */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-100 rounded-full blur-3xl opacity-50 -z-10"></div>
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-orange-100 rounded-full blur-3xl opacity-50 -z-10"></div>
          
          <div className="relative overflow-hidden rounded-[2.5rem]">
            <div 
              className="elfsight-app-b8f17a3a-6590-44e6-acce-13f64079297f" 
              data-elfsight-app-lazy
            ></div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default InstagramSection;
