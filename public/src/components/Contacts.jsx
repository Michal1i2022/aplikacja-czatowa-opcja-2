import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg"; // Importowanie logo aplikacji

// Komponent Contacts odpowiada za wyświetlanie listy kontaktów i zmianę aktywnego czatu
export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined); // Stan przechowujący nazwę aktualnego użytkownika
  const [currentUserImage, setCurrentUserImage] = useState(undefined); // Stan przechowujący avatar aktualnego użytkownika
  const [currentSelected, setCurrentSelected] = useState(undefined); // Stan przechowujący indeks wybranego kontaktu

  // useEffect do pobrania danych użytkownika z localStorage po załadowaniu komponentu
  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    setCurrentUserName(data.username); // Ustawienie nazwy użytkownika
    setCurrentUserImage(data.avatarImage); // Ustawienie avatara użytkownika
  }, []);

  // Funkcja do zmiany aktualnie wybranego czatu
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index); // Aktualizacja wybranego kontaktu
    changeChat(contact); // Wywołanie funkcji przekazanej jako props do zmiany czatu
  };

  return (
    <>
      {currentUserImage && currentUserName && ( // Sprawdzenie, czy dane użytkownika są dostępne przed renderowaniem
        <Container>
          {/* Nagłówek z logo aplikacji */}
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>snappy</h3>
          </div>

          {/* Lista kontaktów */}
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact._id} // Klucz unikalny dla każdego kontaktu
                  className={`contact ${
                    index === currentSelected ? "selected" : "" // Podświetlenie wybranego kontaktu
                  }`}
                  onClick={() => changeCurrentChat(index, contact)} // Obsługa kliknięcia
                >
                  <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`} // Avatar kontaktu
                      alt="avatar"
                    />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3> {/* Nazwa użytkownika */}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sekcja aktualnego użytkownika */}
          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`} // Avatar aktualnego użytkownika
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2> {/* Nazwa aktualnego użytkownika */}
            </div>
          </div>
        </Container>
      )}
    </>
  );
}

// Stylowanie komponentu przy użyciu styled-components
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;

  /* Styl dla nagłówka aplikacji */
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    
    img {
      height: 2rem;
    }
    
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }

  /* Styl dla listy kontaktów */
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;

    &::-webkit-scrollbar {
      width: 0.2rem;

      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;

      .avatar {
        img {
          height: 3rem;
        }
      }

      .username {
        h3 {
          color: white;
        }
      }
    }

    .selected {
      background-color: #9a86f3; // Podświetlenie wybranego kontaktu
    }
  }

  /* Styl dla sekcji aktualnego użytkownika */
  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;

    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }

    .username {
      h2 {
        color: white;
      }
    }

    /* Stylowanie dla mniejszych ekranów */
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;

      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;
