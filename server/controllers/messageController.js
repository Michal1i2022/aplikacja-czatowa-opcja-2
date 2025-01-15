const Messages = require("../models/messageModel"); // Import modelu wiadomości

// Funkcja do pobierania wiadomości pomiędzy dwoma użytkownikami
module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body; // Pobranie identyfikatorów użytkowników z ciała żądania

    // Wyszukiwanie wiadomości między użytkownikami
    const messages = await Messages.find({
      users: {
        $all: [from, to], // Sprawdza, czy obaj użytkownicy znajdują się w tablicy `users`
      },
    }).sort({ updatedAt: 1 }); // Sortowanie wyników według czasu aktualizacji (rosnąco)

    // Przetwarzanie wiadomości w celu stworzenia uproszczonej struktury odpowiedzi
    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from, // Określenie, czy wiadomość została wysłana przez użytkownika `from`
        message: msg.message.text, // Pobranie tekstu wiadomości
      };
    });

    res.json(projectedMessages); // Wysyłanie przetworzonej listy wiadomości jako odpowiedzi
  } catch (ex) {
    next(ex); // Przekazanie błędu do middleware do obsługi błędów
  }
};

// Funkcja do dodawania nowej wiadomości do bazy danych
module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body; // Pobranie danych wiadomości z ciała żądania

    // Tworzenie nowej wiadomości w bazie danych
    const data = await Messages.create({
      message: { text: message }, // Treść wiadomości
      users: [from, to], // Tablica z identyfikatorami użytkowników (nadawca i odbiorca)
      sender: from, // Identyfikator nadawcy wiadomości
    });

    // Sprawdzenie, czy wiadomość została pomyślnie dodana
    if (data) {
      return res.json({ msg: "Message added successfully." }); // Odpowiedź w przypadku sukcesu
    } else {
      return res.json({ msg: "Failed to add message to the database" }); // Odpowiedź w przypadku niepowodzenia
    }
  } catch (ex) {
    next(ex); // Przekazanie błędu do middleware do obsługi błędów
  }
};
