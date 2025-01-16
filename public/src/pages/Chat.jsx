import React, { useEffect, useState, useRef } from "react"; // Importowanie potrzebnych hooków Reacta
import axios from "axios"; // Importowanie axios do wysyłania zapytań HTTP
import { useNavigate } from "react-router-dom"; // Hook do nawigacji między stronami
import { io } from "socket.io-client"; // Importowanie socket.io do komunikacji w czasie rzeczywistym
import styled from "styled-components"; // Importowanie styled-components do stylowania
import { allUsersRoute, host } from "../utils/APIRoutes"; // Importowanie ścieżek API
import ChatContainer from "../components/ChatContainer"; // Importowanie komponentu do wyświetlania czatu
import Contacts from "../components/Contacts"; // Importowanie komponentu do wyświetlania kontaktów
import Welcome from "../components/Welcome"; // Importowanie komponentu powitalnego

export default function Chat() {
  // Hook useNavigate umożliwia przekierowanie użytkownika do innych stron
  const navigate = useNavigate();
  
  // useRef do przechowywania instancji połączenia socket
  const socket = useRef();
  
  // Zmienna stanu przechowująca listę kontaktów użytkownika
  const [contacts, setContacts] = useState([]);
  
  // Zmienna stanu przechowująca aktualny czat (lub undefined, jeśli żaden czat nie jest wybrany)
  const [currentChat, setCurrentChat] = useState(undefined);
  
  // Zmienna stanu przechowująca dane użytkownika
  const [currentUser, setCurrentUser] = useState(undefined);

  // Pierwszy useEffect: sprawdza, czy użytkownik jest zalogowany, jeśli nie, przekierowuje na stronę logowania
  useEffect(async () => {
    // Sprawdzanie, czy w localStorage jest zapisany użytkownik
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      // Jeśli użytkownik nie jest zalogowany, przekierowanie na stronę logowania
      navigate("/login");
    } else {
      // Jeśli użytkownik jest zalogowany, zapisujemy dane użytkownika w stanie
      setCurrentUser(
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )
      );
    }
  }, []); // Uruchamiane tylko raz przy pierwszym renderze

  // Drugi useEffect: tworzy połączenie WebSocket po załadowaniu użytkownika
  useEffect(() => {
    if (currentUser) {
      // Inicjalizujemy połączenie WebSocket z serwerem
      socket.current = io(host);
      
      // Wysyłamy do serwera zdarzenie "add-user", aby połączyć użytkownika z odpowiednim identyfikatorem
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]); // Uruchamia się, gdy zmienia się currentUser

  // Trzeci useEffect: ładuje kontakty, jeśli użytkownik ma ustawiony avatar
  useEffect(async () => {
    if (currentUser) {
      // Sprawdzamy, czy użytkownik ma ustawiony avatar
      if (currentUser.isAvatarImageSet) {
        // Jeśli avatar jest ustawiony, wysyłamy zapytanie po kontakty użytkownika
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data); // Zapisujemy listę kontaktów w stanie
      } else {
        // Jeśli avatar nie jest ustawiony, przekierowujemy do strony ustawiania avatara
        navigate("/setAvatar");
      }
    }
  }, [currentUser]); // Uruchamia się, gdy zmienia się currentUser

  // Funkcja obsługująca zmianę czatu (ustawienie wybranego czatu)
  const handleChatChange = (chat) => {
    setCurrentChat(chat); // Ustawiamy nowy czat w stanie
  };

  return (
    <>
      <Container>
        <div className="container">
          {/* Wyświetlanie komponentu Contacts (lista kontaktów) */}
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          
          {/* Jeśli nie ma wybranego czatu, wyświetlamy komponent powitalny, w przeciwnym przypadku wyświetlamy ChatContainer */}
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </Container>
    </>
  );
}

// Stylowanie komponentu za pomocą styled-components
const Container = styled.div`
  height: 100vh; // Ustawienie wysokości na pełną wysokość widoku
  width: 100vw; // Ustawienie szerokości na pełną szerokość widoku
  display: flex;
  flex-direction: column; // Ustawienie kierunku flexa na kolumny
  justify-content: center; // Wyśrodkowanie zawartości w pionie
  gap: 1rem; // Odstęp między elementami
  align-items: center; // Wyśrodkowanie zawartości w poziomie
  background-color: #131324; // Ustawienie tła na ciemny kolor
  .container {
    height: 85vh; // Wysokość wewnętrznego kontenera
    width: 85vw; // Szerokość wewnętrznego kontenera
    background-color: #00000076; // Lekko przezroczyste tło
    display: grid; // Użycie siatki do rozmieszczenia elementów
    grid-template-columns: 25% 75%; // 25% szerokości dla kontaktów i 75% dla czatu
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%; // Zmiana układu siatki na mniejszych ekranach
    }
  }
`;
