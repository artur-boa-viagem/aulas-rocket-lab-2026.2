import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import { Home } from "./pages/Home";
import { GameDetails } from "./pages/GameDetails";
import { FetchWithUseffect } from "./pages/FetchWithUseffect";
import "./index.css";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/jogos/:id", element: <GameDetails /> },
  { path: "/fetch-with-useEffect", element: <FetchWithUseffect /> },
  {
    path: "*",
    element: (
      <p>
        Página não encontrada. <Link to="/">Voltar</Link>
      </p>
    ),
  },
]);

function App() {
  return (
    <main className="app-main">
      <RouterProvider router={router} />
    </main>
  );
}

export default App;
