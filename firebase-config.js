// Firebase web app settings for the portfolio site.
// (A Firebase web apiKey is a public identifier, not a secret. Access is controlled by Firestore rules + login.)
export const firebaseConfig = {
  apiKey: "AIzaSyD-7Q-lu1_Y5HG_KzugIc1euS13mbChUkE",
  authDomain: "fahad-abdur-rahman-portfolio.firebaseapp.com",
  projectId: "fahad-abdur-rahman-portfolio",
  storageBucket: "fahad-abdur-rahman-portfolio.firebasestorage.app",
  messagingSenderId: "765834852531",
  appId: "1:765834852531:web:aa933ab95dee5bb430d8c6",
  measurementId: "G-76LYPNY59M"
};

// Only this email can open the admin panel (also enforced by the Firestore rules).
export const ADMIN_EMAIL = "fahad.ar.official@gmail.com";
