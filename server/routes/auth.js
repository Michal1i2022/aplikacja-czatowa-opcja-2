const { // Pobieramy te funkcje z pliku userController.js 
  login,
  register,
  getAllUsers,
  setAvatar,
  logOut,
} = require("../controllers/userController");

const router = require("express").Router(); // Inicjalizujemy Router z expressa, dzieki ktoremu, bedziemy mogli ustawic trasy, dla żądań HTTP.

// Trasy:
router.post("/login", login);
router.post("/register", register);
router.get("/allusers/:id", getAllUsers);
router.post("/setavatar/:id", setAvatar);
router.get("/logout/:id", logOut);

module.exports = router; // Eksportujemy router, aby można go było zaimportować i użyć w głównym pliku aplikacji Express (np. w app.js). Dzięki temu trasy zdefiniowane w tym pliku będą dostępne w aplikacji.
