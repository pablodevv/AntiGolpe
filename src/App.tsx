import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import AmazonAnalysis from './is-safe/AmazonAnalysis';
import InstagramAnalysis from './is-safe/InstagramAnalysis';
import ShopeeAnalysis from './is-safe/ShopeeAnalysis';
import AliExpressAnalysis from './is-safe/AliExpressAnalysis';
import TemuAnalysis from './is-safe/TemuAnalysis';
import MercadoLivreAnalysis from './is-safe/MercadoLivreAnalysis';
import Blog from './Blog';

// Isso evita erros de TypeScript ao usar o window.prerenderReady
declare global {
  interface Window {
    prerenderReady?: boolean;
  }
}

/**
 * App.tsx - Main Router for Fraudara.pro
 */
const App: React.FC = () => {
  useEffect(() => {
    // Sempre que o App iniciar ou mudar de rota, resetamos para false
    // Isso garante que o Netlify espere o sinal específico da nova página
    window.prerenderReady = false;
  }, []);
  return (
    <>
      <Helmet>
        <title>Fraudara – #1 Website & Brand Checker</title>
        <meta name="description" content="Stop scams before you buy. Instantly check if any website or brand is safe." />
        <meta property="og:image" content="https://fraudara.pro/Fraudara-OG.png" />
        {/* Adicione aqui as keywords globais que você quer que apareçam em tudo */}
        <meta name="keywords" content="fraudara, scam checker, website safety..." />
      </Helmet>
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
      </>
  );
};

export default App;
