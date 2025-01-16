import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput"; // Komponent do obsługi wprowadzania wiadomości
import Logout from "./Logout"; // Komponent do obsługi wylogowania
import { v4 as uuidv4 } from "uuid"; // Biblioteka do generowania unikalnych kluczy
import axios from "axios"; // Klient HTTP do komunikacji z serwerem
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes"; // Ścieżki API do obsługi wiadomości

// Komponent główny obsługujący wyświetlanie czatu i komunikację
export default function ChatContainer({ currentChat, socket }) {
  // Stan komponentu
  const [messages, setMessages] = useState([]); // Lista wiadomości
  const scrollRef = useRef(); // Referencja do ostatniej wiadomości, używana do przewijania
  const [arrivalMessage, setArrivalMessage] = useState(null); // Wiadomość odebrana w czasie rzeczywistym

  // Pobieranie wiadomości między aktualnym użytkownikiem a rozmówcą
  useEffect(() => {
    const fetchMessages = async () => {
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY) // Pobranie danych użytkownika z localStorage
      );
      const response = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: currentChat._id,
      });
      setMessages(response.data); // Ustawienie wiadomości w stanie
    };
    fetchMessages();
  }, [currentChat]);

  // Ustawienie aktualnego czatu w pamięci
  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  // Funkcja obsługująca wysyłanie wiadomości
  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    // Wysłanie wiadomości przez WebSocket
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });
    // Wysłanie wiadomości do serwera
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    // Dodanie wiadomości do lokalnego stanu
    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  // Odbieranie wiadomości w czasie rzeczywistym
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  // Dodawanie odebranej wiadomości do stanu
  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  // Automatyczne przewijanie do ostatniej wiadomości
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Renderowanie komponentu
  return (
    <Container>
      {/* Nagłówek czatu */}
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} // Awatar użytkownika
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3> {/* Nazwa użytkownika */}
          </div>
        </div>
        <Logout /> {/* Komponent wylogowania */}
      </div>

      {/* Wiadomości w czacie */}
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pole do wprowadzania wiadomości */}
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

// Stylowanie komponentu
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

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
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0.2rem;

      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

    .message {
      display: flex;
      align-items: center;

      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;

        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }

    .sended {
      justify-content: flex-end;

      .content {
        background-color: #4f04ff21;
      }
    }

    .recieved {
      justify-content: flex-start;

      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
