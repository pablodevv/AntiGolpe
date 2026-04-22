import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import AmazonAnalysis from './is-safe/AmazonAnalysis';
import InstagramAnalysis from './is-safe/InstagramAnalysis';
import ShopeeAnalysis from './is-safe/ShopeeAnalysis';
import AliExpressAnalysis from './is-safe/AliExpressAnalysis';
import TemuAnalysis from './is-safe/TemuAnalysis';
import MercadoLivreAnalysis from './is-safe/MercadoLivreAnalysis';
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
      <Route path="/is-site-safe/instagram" element={<InstagramAnalysis />} />
      <Route path="/is-site-safe/shopee" element={<ShopeeAnalysis />} />
      <Route path="/is-site-safe/aliexpress" element={<AliExpressAnalysis />} />
      <Route path="/is-site-safe/temu" element={<TemuAnalysis />} />
      <Route path="/is-site-safe/mercado-livre" element={<MercadoLivreAnalysis />} />
      
      {/* Blog Routes */}
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<Blog />} />
      
      {/* 404 - Redirect to Home */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default App;
