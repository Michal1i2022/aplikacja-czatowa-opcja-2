const { addMessage, getMessages } = require("../controllers/messageController"); 
// Importujemy funkcje `addMessage` i `getMessages` z kontrolera wiadomości.

const router = require("express").Router(); 
// Inicjalizujemy router Express.js, który będzie obsługiwał różne ścieżki związane z wiadomościami.

router.post("/addmsg/", addMessage); 
// Definiujemy trasę POST dla dodawania wiadomości.
// Ścieżka `/addmsg/` wywołuje funkcję `addMessage`, która dodaje nową wiadomość do bazy danych.

router.post("/getmsg/", getMessages); 
// Definiujemy trasę POST dla pobierania wiadomości.
// Ścieżka `/getmsg/` wywołuje funkcję `getMessages`, która zwraca wiadomości między dwoma użytkownikami.

module.exports = router; 
// Eksportujemy router, aby mógł być używany w innych plikach aplikacji.
