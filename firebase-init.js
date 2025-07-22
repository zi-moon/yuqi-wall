// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDPpjIi7FprXIRPBHMS1aCE5dWRbYO4C8E",
  authDomain: "yuju-wall.firebaseapp.com",
  databaseURL: "https://yuju-wall-default-rtdb.firebaseio.com",
  projectId: "yuju-wall",
  storageBucket: "yuju-wall.appspot.com",
  messagingSenderId: "1046860516937",
  appId: "1:1046860516937:web:96b9baa9df4e807f2bb998"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
