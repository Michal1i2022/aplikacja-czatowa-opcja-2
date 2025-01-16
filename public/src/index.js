import React from "react"; // Importowanie React, aby móc używać JSX i komponentów
import ReactDOM from "react-dom"; // Importowanie ReactDOM, które jest odpowiedzialne za renderowanie komponentów w DOM
import App from "./App"; // Importowanie głównego komponentu aplikacji
import "./index.css"; // Importowanie globalnych stylów CSS

ReactDOM.render( // Funkcja renderująca aplikację do DOM
  <React.StrictMode> {/* StrictMode to narzędzie do wykrywania problemów w aplikacji podczas rozwoju */}
    <App /> {/* Renderowanie głównego komponentu aplikacji */}
  </React.StrictMode>,
  document.getElementById("root") // Określenie elementu DOM, do którego aplikacja zostanie zamontowana
);