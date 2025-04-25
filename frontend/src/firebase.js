import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyAXPDdgB5PuDLUxPhWzTv-zsFAq2UdByVc",
  authDomain: "lectureprogress-bf4ce.firebaseapp.com",
  projectId: "lectureprogress-bf4ce",
  storageBucket: "lectureprogress-bf4ce.firebasestorage.app",
  messagingSenderId: "1069734408661",
  appId: "1:1069734408661:web:d75fe6fd5e34fb86f50d5c",
  measurementId: "G-M69KS69Y33"
};

const app = initializeApp(firebaseConfig);
export default app;