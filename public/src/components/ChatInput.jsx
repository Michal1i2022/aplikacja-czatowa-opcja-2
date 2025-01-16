import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs"; // Ikona uśmiechniętej buźki do wyboru emoji
import { IoMdSend } from "react-icons/io"; // Ikona przycisku wysyłania wiadomości
import styled from "styled-components"; // Biblioteka do stylowania komponentów
import Picker from "emoji-picker-react"; // Biblioteka do obsługi wyboru emoji

// Komponent ChatInput obsługujący pole do wpisywania wiadomości
export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState(""); // Stan przechowujący wpisaną wiadomość
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Stan określający, czy picker emoji jest widoczny

  // Funkcja przełączająca widoczność pickera emoji
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Funkcja obsługująca wybór emoji i dodawanie go do wiadomości
  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji; // Dodanie wybranego emoji do wiadomości
    setMsg(message);
  };

  // Funkcja obsługująca wysyłanie wiadomości
  const sendChat = (event) => {
    event.preventDefault(); // Zapobieganie przeładowaniu strony
    if (msg.length > 0) {
      handleSendMsg(msg); // Przekazanie wiadomości do funkcji obsługującej wysyłanie
      setMsg(""); // Wyczyszczenie pola po wysłaniu wiadomości
    }
  };

  return (
    <Container>
      {/* Sekcja z przyciskiem do wyboru emoji */}
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />} {/* Picker emoji */}
        </div>
      </div>

      {/* Formularz do wpisywania wiadomości */}
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="type your message here" // Placeholder dla pola wpisywania wiadomości
          onChange={(e) => setMsg(e.target.value)} // Aktualizacja stanu po wpisaniu tekstu
          value={msg} // Wartość pola input pobrana ze stanu
        />
        <button type="submit">
          <IoMdSend /> {/* Ikona wysyłania wiadomości */}
        </button>
      </form>
    </Container>
  );
}

// Stylowanie komponentu
const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: #080420;
  padding: 0 2rem;

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }

  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;

    .emoji {
      position: relative;
      
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }

      .emoji-picker-react {
        position: absolute;
        top: -350px;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;

        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;

          &-thumb {
            background-color: #9a86f3;
          }
        }

        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }

        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
        }

        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }

  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;

    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }

      &:focus {
        outline: none;
      }
    }

    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;

      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;

        svg {
          font-size: 1rem;
        }
      }

      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;