import React from 'react';

import ImageSlider from '../components/ImageSlider';
import CategorySlider from '../components/CategorySlider';
import FeaturedSection from '../components/FeaturedSection';
import FeaturedPosts from '../components/FeaturedPosts';
import EditorsChoice from '../components/EditorsChoice';
import TopAuthorsSection from '../components/TopAuthorsSection';
import CategoryColumnsSection from '../components/CategoryColumnsSection';
import BreakingNewsSection from '../components/BreakingNewsSection';
import InstagramSection from '../components/InstagramSection';

function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* Hero Image Slider */}
      <ImageSlider />

      {/* Categories Section */}
      <CategorySlider />

      {/* Featured & Trending Section */}
      <FeaturedSection />

      {/* Combined Featured Posts Section */}
      <FeaturedPosts />

      {/* Editor's Choice Section */}
      <EditorsChoice />

      {/* Top Authors & Sidebar Section */}
      <TopAuthorsSection />

      {/* Category Columns & Social Sidebar Section */}
      <CategoryColumnsSection />

      {/* Breaking News Section */}
      <BreakingNewsSection />

      {/* Instagram Feed Section */}
      <InstagramSection />
    </div>
  );
}

export default HomePage;
