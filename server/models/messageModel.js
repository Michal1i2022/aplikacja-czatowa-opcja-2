const mongoose = require("mongoose"); // Biblioteka do pracy z mongoDB

const MessageSchema = mongoose.Schema( // Schemat wiadomości, tak będą przekazywane do bazy danych.
  {
    message: {
      text: { type: String, required: true }, // Tak bedzie wygladac schemat wiadomości
    },
    users: Array, // Użytkownicy to lista.
    
    sender: {
      type: mongoose.Schema.Types.ObjectId, // Typ identyfikatora, który jest ObjectId z Mongoose, używany do przechowywania referencji do innych dokumentów.
      ref: "User", // Odnosi się do kolekcji "User", wskazując, że pole "sender" przechowuje identyfikator użytkownika z tej kolekcji.
      required: true, // Pole "sender" jest wymagane, co oznacza, że każda wiadomość musi mieć przypisanego nadawcę (użytkownika).
    }
  },
  {
    timestamps: true, // Automatyczne dodawanie daty utworzenia i modyfikacji
  }
);

// Eksportujemy model tej wiadomosci by uzyc go w innych czesciach aplikacji.
module.exports = mongoose.model("Messages", MessageSchema); 
