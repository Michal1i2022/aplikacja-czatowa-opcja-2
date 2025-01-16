import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Buffer } from "buffer"; // Import klasy Buffer do konwersji danych na base64
import loader from "../assets/loader.gif"; // Import obrazka ładowania
import { ToastContainer, toast } from "react-toastify"; // Powiadomienia Toast
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // Hook do nawigacji
import { setAvatarRoute } from "../utils/APIRoutes"; // Import trasy API do ustawiania awatara

export default function SetAvatar() {
  const api = `https://api.multiavatar.com/4645646`; // API do generowania awatarów
  const navigate = useNavigate(); // Hook do nawigacji
  const [avatars, setAvatars] = useState([]); // Tablica przechowująca awatary
  const [isLoading, setIsLoading] = useState(true); // Flaga ładowania
  const [selectedAvatar, setSelectedAvatar] = useState(undefined); // Wybrany awatar

  // Opcje powiadomień Toast
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  // Sprawdzenie, czy użytkownik jest zalogowany (jeśli nie, przekierowanie do logowania)
  useEffect(() => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
      navigate("/login");
  }, []);

  // Funkcja ustawiająca wybrany awatar jako obraz profilowy użytkownika
  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions); // Komunikat błędu, jeśli użytkownik nie wybrał awatara
    } else {
      const user = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );

      // Wysłanie żądania POST do API, aby zapisać awatar użytkownika
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar], // Przekazanie wybranego awatara
      });

      // Jeśli operacja się powiodła, zapisujemy nowy awatar użytkownika
      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(user)
        );
        navigate("/"); // Przekierowanie użytkownika na stronę główną
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    }
  };

  // Pobranie 4 losowych awatarów z API i zapisanie ich w stanie komponentu
  useEffect(() => {
    const fetchAvatars = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}` // Pobranie losowego awatara
        );
        const buffer = new Buffer(image.data); // Konwersja na base64
        data.push(buffer.toString("base64"));
      }
      setAvatars(data); // Aktualizacja stanu awatarów
      setIsLoading(false); // Zakończenie ładowania
    };

    fetchAvatars();
  }, []);

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" /> {/* Wyświetlenie loadera */}
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  key={index} // Unikalny klucz dla każdego elementu
                  className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
                  onClick={() => setSelectedAvatar(index)} // Kliknięcie wybiera awatar
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                  />
                </div>
              );
            })}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
          <ToastContainer /> {/* Komponent obsługujący powiadomienia */}
        </Container>
      )}
    </>
  );
}

// Stylowanie kontenera strony
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;

      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }

    .selected {
      border: 0.4rem solid #4e0eff; // Podświetlenie wybranego awatara
    }
  }

  .submit-btn {
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
      background-color: #4e0eff;
    }
  }
`;