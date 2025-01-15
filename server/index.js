// Importowanie bibliotek
const express = require("express"); // Biblioteka Express do tworzenia serwerów HTTP i obsługi tras
const cors = require("cors"); // Biblioteka CORS do obsługi żądań między różnymi domenami
const mongoose = require("mongoose"); // Biblioteka Mongoose do pracy z bazą danych MongoDB
const authRoutes = require("./routes/auth"); // Trasy związane z autoryzacją i rejestracją użytkowników
const messageRoutes = require("./routes/messages"); // Trasy związane z obsługą wiadomości
const app = express(); // Główny obiekt aplikacji do definiowania tras, middleware i logiki serwera
const socket = require("socket.io"); // Socket.IO do komunikacji w czasie rzeczywistym za pomocą WebSocket
require("dotenv").config(); // Wczytanie zmiennych środowiskowych z pliku `.env`

// Middleware do obsługi CORS i parsowania JSON
app.use(cors()); // Umożliwia żądania między różnymi domenami, np. z frontend na backend
app.use(express.json()); // Umożliwia aplikacji odbieranie danych w formacie JSON w ciele żądań

// Połączenie z bazą danych MongoDB
mongoose
  .connect(process.env.MONGO_URL, { // Łączenie z MongoDB za pomocą URL zapisanego w zmiennej środowiskowej
    useNewUrlParser: true, // Użycie nowego parsera URL
    useUnifiedTopology: true, // Użycie ujednoliconej topologii w połączeniach MongoDB
  })
  .then(() => {
    console.log("DB Connection Successful"); // Logowanie komunikatu o udanym połączeniu z bazą danych
  })
  .catch((err) => {
    console.log(err.message); // Logowanie błędu, jeśli połączenie z bazą się nie uda
  });

// Prosta trasa ping, używana do sprawdzenia, czy serwer działa
app.get("/ping", (_req, res) => {
  return res.json({ msg: "Ping Successful" }); // Zwraca odpowiedź JSON, aby potwierdzić działanie serwera
});

// Rejestrowanie tras aplikacji
app.use("/api/auth", authRoutes); // Trasy związane z autoryzacją użytkowników
app.use("/api/messages", messageRoutes); // Trasy związane z obsługą wiadomości

// Uruchomienie serwera, który nasłuchuje na porcie zapisanym w zmiennej środowiskowej
const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`) // Logowanie, że serwer został uruchomiony na odpowiednim porcie
);

// Ustawienie Socket.IO do komunikacji w czasie rzeczywistym
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000", // Określa, że tylko frontend działający na porcie 3000 może łączyć się z serwerem
    credentials: true, // Włącza obsługę ciasteczek i nagłówków autoryzacyjnych
  },
});

// Globalna mapa przechowująca użytkowników online
global.onlineUsers = new Map(); // Mapa przechowująca `userId` jako klucz i `socket.id` jako wartość

// Nasłuchiwanie na połączenie klienta przez WebSocket
io.on("connection", (socket) => {
  global.chatSocket = socket; // Przechowywanie referencji do aktualnego połączenia klienta

  // Obsługa dodania użytkownika do mapy onlineUsers
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id); // Zapisanie połączenia użytkownika w mapie onlineUsers
  });

  // Obsługa wysyłania wiadomości do innego użytkownika
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to); // Pobranie `socket.id` odbiorcy wiadomości
    if (sendUserSocket) { // Jeśli odbiorca jest online
      socket.to(sendUserSocket).emit("msg-recieve", data.msg); // Wysłanie wiadomości do odbiorcy
    }
  });
});
