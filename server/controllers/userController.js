const User = require("../models/userModel"); // Potrzebujemy funkcji z userModel.js 
const bcrypt = require("bcrypt"); // Szyfrowanie 

module.exports.login = async (req, res, next) => { // Odpowiada za logowanie
  try {
    const { username, password } = req.body; // pobiera username i password z dokumentu.
    const user = await User.findOne({ username }); // szukamy usera po username.
    
    if (!user) // Jesli nie ma usera o podanym username i password zwroc blad.
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password); // sprawdzenie czy haslo jest prawdilowe. W tym celu porownujemy haslo wpisane z haslem ktore jest zapisane w bazie do tego usera.
    
    if (!isPasswordValid) // Jesli haslo jest niepoprawne zwroc blad.
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password; 
    return res.json({ status: true, user }); // Jesli jednak wszystko sie zgadza - zaloguj. Zwraca dane usera bez hasla.
  } catch (ex) { //Jesli cos jest nie tak to przekazujemy dalej blad.
    next(ex);
  }
};

module.exports.register = async (req, res, next) => { // Odpowiada za rejestracje. 
  try {
    const { username, email, password } = req.body; // Pobranie username email, password z dokumentu.
    const usernameCheck = await User.findOne({ username }); // szukamy usera po username i zapisujemy w zmiennej. Przyda sie potem do by zobaczyc czy taki user juz nie istnieje.
    
    if (usernameCheck) // Jesli user o podanym username istnieje to zwroc blad i nie pozwol utworzyc takiego usera.
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email }); // szukamy usera po mailu i zapisujemy w zmiennej. Przyda sie potem do by zobaczyc czy taki user juz nie istnieje.
    
    if (emailCheck) // Jesli taki istnieje to zwracamy blad i nie pozwalamy na utworzenie takiego usera.
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10); // Szyfrujemy haslo

    const user = await User.create({ // Jesli wszystko jest dobrze, szyfrujemy haslo i tworzymy usera w bazie danych.
      email,
      username,
      password: hashedPassword,
    });

    delete user.password;
    return res.json({ status: true, user }); // Rejestrujemy
  } catch (ex) { // Jesli cos jest nie tak to przekazujemy dalej blad.
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => { // Pobiera liste wszystkich użytkownikow, oprocz tego ktory wykonuje żądanie.
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([ //Zwraca dane:email, username, awatar i ID.
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) { // Jesli jest jakis blad przekazujemy go dalej.
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => { // Odpowiada za ustawienie awatara. 
  try {
    const userId = req.params.id; // pobieramy id usera z dokumentu.
    const avatarImage = req.body.image; // pobieramy zdjecie jakie zostalo wybrane przez usera jako awatar.
    const userData = await User.findByIdAndUpdate( // Update danych usera
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) { // Jesli jest jakis blad przekazujemy go dalej.
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => { // Odpowiada za wylogowanie
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " }); // Jesli nie pobrało user id to zwracamy blad, ze potrzebujemy takiego id.
    onlineUsers.delete(req.params.id); // Usun usera z userow online.
    return res.status(200).send(); // Status sukces.
  } catch (ex) { // Jesli jest jakis blad przekazujemy go dalej.
    next(ex);
  }
};
