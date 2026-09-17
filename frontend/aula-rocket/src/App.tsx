import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { GameDetails } from "./pages/GameDetails";
import "./index.css";

function App() {
  return (
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
          <Route
            path="*"
            element={
              <p>
                Página não encontrada. <Link to="/">Voltar</Link>
              </p>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
