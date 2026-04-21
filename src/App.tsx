import { Routes, Route } from 'react-router-dom';
import Home from './Home'; // Renomeie seu App.tsx original para Home.tsx
import AmazonAnalysis from './is-safe/AmazonAnalysis';

/**
 * App.tsx - Configuração de Rotas do Fraudara.pro
 * 
 * Aqui definimos os caminhos para as páginas de SEO.
 */

function App() {
  return (
    <Routes>
      {/* Página Principal (O que era o seu App.tsx antes) */}
      <Route path="/" element={<Home />} />

      {/* Página de SEO para Amazon */}
      <Route path="/is-site-safe/amazon" element={<AmazonAnalysis />} />

      {/* 
        DICA: Se quiser criar páginas para outras marcas sem criar novos arquivos, 
        você pode usar uma rota dinâmica:
        <Route path="/is-site-safe/:brand" element={<BrandAnalysis />} />
      */}
    </Routes>
  );
}

export default App;
