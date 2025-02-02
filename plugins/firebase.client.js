import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
export default defineNuxtPlugin((params) => {
  // 您的Web应用程序的Firebase配置
  const firebaseConfig = {
    apiKey: "AIzaSyBa9Pk1Ju-nYcdeuYSX740J5FgaE5ROriM",
    authDomain: "habitsapp-aa8ae.firebaseapp.com",
    projectId: "habitsapp-aa8ae",
    storageBucket: "habitsapp-aa8ae.firebasestorage.app",
    messagingSenderId: "455333457135",
    appId: "1:455333457135:web:19b916491f497ed90aff1a",
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  return {
    provide: {
      firebaseApp: app,
      db: db,
    },
  };
});
