import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { ReviewsProvider } from "./context/ReviewsContext";
import { Home } from "./pages/Home";
import { GameDetails } from "./pages/GameDetails";
import "./index.css";

// ============================================================
// Aula: react-router-dom
// ------------------------------------------------------------
// - BrowserRouter observa a URL do navegador.
// - Routes + Route dizem "se URL for X, renderize a página Y".
// - Link / useNavigate trocam de página SEM recarregar tudo.
// ============================================================

function App() {
  return (
    <ReviewsProvider>
      <BrowserRouter>
        <header className="app-header">
          <Link to="/" className="app-logo">
            🎮 Game Reviews
          </Link>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jogos/:id" element={<GameDetails />} />
            <Route path="*" element={<p>Página não encontrada. <Link to="/">Voltar</Link></p>} />
          </Routes>
        </main>
      </BrowserRouter>
    </ReviewsProvider>
  );
}

export default App;
