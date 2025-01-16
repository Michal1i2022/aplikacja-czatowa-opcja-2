export const host = "http://localhost:5000"; // Adres serwera API (localhost w tym przypadku)
export const loginRoute = `${host}/api/auth/login`; // URL do logowania użytkownika
export const registerRoute = `${host}/api/auth/register`; // URL do rejestracji użytkownika
export const logoutRoute = `${host}/api/auth/logout`; // URL do wylogowania użytkownika
export const allUsersRoute = `${host}/api/auth/allusers`; // URL do pobierania wszystkich użytkowników
export const sendMessageRoute = `${host}/api/messages/addmsg`; // URL do wysyłania wiadomości
export const recieveMessageRoute = `${host}/api/messages/getmsg`; // URL do odbierania wiadomości
export const setAvatarRoute = `${host}/api/auth/setavatar`; // URL do ustawiania awatara użytkownika
