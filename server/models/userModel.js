const mongoose = require("mongoose"); // Biblioteka do pracy z MongoDB

// Stworzenie modelu użytkownika  bazie danych
const userSchema = new mongoose.Schema({ // Schemat usera. okresla: username, email, password, isAavatarImageSet, avatarImage.
  username: { 
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: { 
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Users", userSchema); //Tworzy i eksportuje model Users, który opiera się na schemacie userSchema. Model ten będzie reprezentował kolekcję Users w bazie danych.
