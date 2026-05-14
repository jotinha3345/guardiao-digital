import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppLayout } from "./layouts/AppLayout";
import { Admin } from "./pages/Admin";
import { Consulta } from "./pages/Consulta";
import { Dashboard } from "./pages/Dashboard";
import { Denunciar } from "./pages/Denunciar";
import { Educacao, MaterialDetalhe } from "./pages/Educacao";
import { Emergencia } from "./pages/Emergencia";
import { Login } from "./pages/Login";
import { Quiz } from "./pages/Quiz";
import { Recover } from "./pages/Recover";
import { Register } from "./pages/Register";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />
            <Route path="/recuperar-senha" element={<Recover />} />
            <Route path="/denunciar" element={<Denunciar />} />
            <Route path="/consultar" element={<Consulta />} />
            <Route path="/educacao" element={<Educacao />} />
            <Route path="/educacao/:slug" element={<MaterialDetalhe />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/emergencia" element={<Emergencia />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
