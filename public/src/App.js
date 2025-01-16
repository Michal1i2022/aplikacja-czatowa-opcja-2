import React from "react"; // Importowanie React
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Importowanie komponentów do routingu
import SetAvatar from "./components/SetAvatar"; // Importowanie komponentu do ustawiania awatara
import Chat from "./pages/Chat"; // Importowanie strony czatu
import Login from "./pages/Login"; // Importowanie strony logowania
import Register from "./pages/Register"; // Importowanie strony rejestracji

export default function App() {
  return (
    <BrowserRouter>  {/* BrowserRouter umożliwia nawigację po aplikacji przy użyciu URL w przeglądarce */}
      <Routes> {/* Routes jest kontenerem dla wszystkich tras */}
        {/* Definicje tras */}
        <Route path="/register" element={<Register />} />  {/* Trasa dla rejestracji */}
        <Route path="/login" element={<Login />} />  {/* Trasa dla logowania */}
        <Route path="/setAvatar" element={<SetAvatar />} />  {/* Trasa dla ustawienia awatara */}
        <Route path="/" element={<Chat />} />  {/* Trasa dla głównego czatu */}
      </Routes>
    </BrowserRouter>
  );
}