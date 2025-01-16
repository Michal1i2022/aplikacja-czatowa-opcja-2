import React, { useState, useEffect } from "react"; // Importowanie hooków Reacta
import axios from "axios"; // Importowanie axios do wysyłania zapytań HTTP
import styled from "styled-components"; // Importowanie styled-components do stylowania
import { useNavigate, Link } from "react-router-dom"; // Hooki do nawigacji
import Logo from "../assets/logo.svg"; // Importowanie logo
import { ToastContainer, toast } from "react-toastify"; // Importowanie komponentów do powiadomień toast
import "react-toastify/dist/ReactToastify.css"; // Importowanie stylów dla powiadomień toast
import { loginRoute } from "../utils/APIRoutes"; // Importowanie ścieżki do logowania

export default function Login() {
  // Hook useNavigate do przechodzenia między stronami
  const navigate = useNavigate();
  
  // Hook useState do przechowywania danych formularza (username i password)
  const [values, setValues] = useState({ username: "", password: "" });
  
  // Opcje dla powiadomień toast
  const toastOptions = {
    position: "bottom-right", // Ustawienie pozycji powiadomień
    autoClose: 8000, // Czas automatycznego zamknięcia powiadomienia
    pauseOnHover: true, // Pauza na hover
    draggable: true, // Powiadomienie można przeciągnąć
    theme: "dark", // Motyw ciemny
  };

  // Pierwszy useEffect: sprawdzenie, czy użytkownik jest już zalogowany
  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      // Jeśli użytkownik jest zalogowany, przekierowanie do głównej strony
      navigate("/");
    }
  }, []); // Uruchamia się tylko raz przy pierwszym renderze

  // Funkcja obsługująca zmianę wartości w formularzu
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value }); // Zaktualizowanie stanu dla odpowiedniego pola
  };

  // Funkcja walidująca formularz
  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Email and Password is required.", toastOptions); // Powiadomienie o błędzie
      return false;
    } else if (password === "") {
      toast.error("Email and Password is required.", toastOptions); // Powiadomienie o błędzie
      return false;
    }
    return true;
  };

  // Funkcja obsługująca wysyłanie formularza
  const handleSubmit = async (event) => {
    event.preventDefault(); // Zatrzymanie domyślnego działania formularza
    if (validateForm()) { // Sprawdzenie, czy formularz jest prawidłowy
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, { // Wysłanie danych do serwera
        username,
        password,
      });
      
      // Obsługa odpowiedzi serwera
      if (data.status === false) {
        toast.error(data.msg, toastOptions); // Jeśli login się nie udał, pokazujemy błąd
      }
      if (data.status === true) {
        // Jeśli login się powiódł, zapisujemy dane użytkownika w localStorage
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );

        navigate("/"); // Przekierowanie na główną stronę po zalogowaniu
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          {/* Logo i nazwa aplikacji */}
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>snappy</h1>
          </div>
          
          {/* Formularz logowania */}
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            min="3"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Log In</button>
          
          {/* Link do strony rejestracji */}
          <span>
            Don't have an account ? <Link to="/register">Create One.</Link>
          </span>
        </form>
      </FormContainer>
      
      {/* Komponent wyświetlający powiadomienia */}
      <ToastContainer />
    </>
  );
}

// Stylowanie komponentu za pomocą styled-components
const FormContainer = styled.div`
  height: 100vh; // Ustawienie wysokości na pełną wysokość widoku
  width: 100vw; // Ustawienie szerokości na pełną szerokość widoku
  display: flex;
  flex-direction: column; // Ustawienie kierunku flexa na kolumny
  justify-content: center; // Wyśrodkowanie zawartości w pionie
  gap: 1rem; // Odstęp między elementami
  align-items: center; // Wyśrodkowanie zawartości w poziomie
  background-color: #131324; // Ustawienie tła na ciemny kolor
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column; // Ustawienie elementów formularza w kolumnie
    gap: 2rem; // Odstęp między polami formularza
    background-color: #00000076; // Lekko przezroczyste tło formularza
    border-radius: 2rem; // Zaokrąglenie rogów formularza
    padding: 5rem;
  }
  
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff; // Kolor obramowania
    border-radius: 0.4rem; // Zaokrąglenie rogów inputów
    color: white; // Kolor tekstu
    width: 100%; // Szerokość inputu
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0; // Zmiana koloru obramowania po skupieniu
      outline: none; // Usunięcie konturu
    }
  }
  
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff; // Brak zmiany koloru przy hoverze
    }
  }
  
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
