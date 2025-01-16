import React, { useState, useEffect } from "react"; // Importowanie hooków Reacta
import axios from "axios"; // Importowanie axios do wysyłania zapytań HTTP
import styled from "styled-components"; // Importowanie styled-components do stylowania
import { useNavigate, Link } from "react-router-dom"; // Hooki do nawigacji
import Logo from "../assets/logo.svg"; // Importowanie logo
import { ToastContainer, toast } from "react-toastify"; // Importowanie komponentów do powiadomień toast
import "react-toastify/dist/ReactToastify.css"; // Importowanie stylów dla powiadomień toast
import { registerRoute } from "../utils/APIRoutes"; // Importowanie ścieżki do rejestracji

export default function Register() {
  // Hook useNavigate do przechodzenia między stronami
  const navigate = useNavigate();
  
  // Opcje dla powiadomień toast
  const toastOptions = {
    position: "bottom-right", // Ustawienie pozycji powiadomień
    autoClose: 8000, // Czas automatycznego zamknięcia powiadomienia
    pauseOnHover: true, // Pauza na hover
    draggable: true, // Powiadomienie można przeciągnąć
    theme: "dark", // Motyw ciemny
  };

  // Hook useState do przechowywania danych formularza (username, email, password, confirmPassword)
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // useEffect: sprawdzenie, czy użytkownik jest już zalogowany
  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/"); // Jeśli użytkownik jest zalogowany, przekierowanie na główną stronę
    }
  }, []);

  // Funkcja obsługująca zmianę wartości w formularzu
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  // Funkcja walidująca formularz
  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;

    // Sprawdzenie, czy hasło i potwierdzenie hasła są takie same
    if (password !== confirmPassword) {
      toast.error("Password and confirm password should be same.", toastOptions);
      return false;
    } 
    // Sprawdzenie długości nazwy użytkownika
    else if (username.length < 3) {
      toast.error("Username should be greater than 3 characters.", toastOptions);
      return false;
    } 
    // Sprawdzenie długości hasła
    else if (password.length < 8) {
      toast.error("Password should be equal or greater than 8 characters.", toastOptions);
      return false;
    } 
    // Sprawdzenie, czy adres email nie jest pusty
    else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  // Funkcja obsługująca wysyłanie formularza
  const handleSubmit = async (event) => {
    event.preventDefault(); // Zatrzymanie domyślnego działania formularza
    if (handleValidation()) { // Jeśli formularz jest poprawny
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, { // Wysłanie danych rejestracyjnych do serwera
        username,
        email,
        password,
      });

      // Obsługa odpowiedzi serwera
      if (data.status === false) {
        toast.error(data.msg, toastOptions); // Pokazanie błędu, jeśli rejestracja się nie udała
      }
      if (data.status === true) {
        // Jeśli rejestracja zakończyła się sukcesem, zapisanie danych użytkownika w localStorage
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        navigate("/"); // Przekierowanie na stronę główną
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
          
          {/* Formularz rejestracji */}
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Create User</button>
          
          {/* Link do strony logowania */}
          <span>
            Already have an account ? <Link to="/login">Login.</Link>
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
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column; // Ustawienie elementów formularza w kolumnie
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
    padding: 3rem 5rem; // Padding formularza
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