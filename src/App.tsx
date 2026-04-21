import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import AmazonAnalysis from './is-safe/AmazonAnalysis';
import Blog from './Blog';

/**
 * App.tsx - Main Router for Fraudara.pro
 */
const App: React.FC = () => {
  return (
    <Routes>
      {/* Home Page */}
      <Route path="/" element={<Home />} />
      
      {/* SEO Dynamic Brand Pages */}
      <Route path="/is-site-safe/amazon" element={<AmazonAnalysis />} />
      
      {/* Blog Routes */}
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<Blog />} />
      
      {/* 404 - Redirect to Home */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default App;
