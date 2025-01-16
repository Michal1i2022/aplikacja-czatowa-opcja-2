import React, { useState, useEffect } from "react"; // Importowanie React oraz hooków useState i useEffect
import styled from "styled-components"; // Importowanie biblioteki do stylowania komponentów
import Robot from "../assets/robot.gif"; // Importowanie pliku graficznego

export default function Welcome() {
  const [userName, setUserName] = useState(""); // Stan przechowujący nazwę użytkownika

  useEffect(async () => {
    // Pobranie nazwy użytkownika z localStorage po zamontowaniu komponentu
    setUserName(
      await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY) // Pobranie wartości z localStorage
      ).username
    );
  }, []); // Pusta tablica zależności oznacza, że kod wykona się tylko raz (po pierwszym renderze)

  return (
    <Container>
      {/* Wyświetlenie obrazka powitalnego */}
      <img src={Robot} alt="" />

      {/* Powitanie użytkownika */}
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>

      {/* Komunikat informujący użytkownika o konieczności wyboru czatu */}
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
}

// Stylowanie komponentu za pomocą styled-components
const Container = styled.div`
  display: flex;
  justify-content: center; 
  align-items: center; 
  color: white;
  flex-direction: column;

  img {
    height: 20rem;
  }

  span {
    color: #4e0eff;
  }
`;