import React from "react";
import { useNavigate } from "react-router-dom"; // Hook do nawigacji między stronami
import { BiPowerOff } from "react-icons/bi"; // Ikona wylogowania
import styled from "styled-components"; // Styled-components do stylowania przycisku
import axios from "axios"; // Axios do wysyłania żądań HTTP
import { logoutRoute } from "../utils/APIRoutes"; // Import trasy API dla wylogowania

export default function Logout() {
  const navigate = useNavigate(); // Inicjalizacja nawigacji

  // Funkcja obsługująca wylogowanie użytkownika
  const handleClick = async () => {
    // Pobranie ID użytkownika z localStorage
    const id = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;

    // Wysłanie żądania GET do API, aby wylogować użytkownika
    const data = await axios.get(`${logoutRoute}/${id}`);

    // Jeśli żądanie zakończyło się sukcesem (status 200), czyścimy localStorage i przekierowujemy do strony logowania
    if (data.status === 200) {
      localStorage.clear();
      navigate("/login"); // Przekierowanie do strony logowania
    }
  };

  return (
    <Button onClick={handleClick}>
      <BiPowerOff /> {/* Ikona wylogowania */}
    </Button>
  );
}

// Stylowanie przycisku wylogowania
const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3; /* Kolor tła */
  border: none;
  cursor: pointer;

  svg {
    font-size: 1.3rem;
    color: #ebe7ff; /* Kolor ikony */
  }
`;