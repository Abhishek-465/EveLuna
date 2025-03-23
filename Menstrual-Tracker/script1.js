import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// 🔥 Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyDXXXXXX-FAKE-KEYXXXXXXX",
    authDomain: "dummy-project.firebaseapp.com",
    projectId: "dummy-project-id",
    storageBucket: "dummy-project.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456",
    measurementId: "G-FAKE12345"
};


// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 🔥 DOM Elements
const signInBtn = document.getElementById("sign-in-btn");
const signOutBtn = document.getElementById("sign-out-btn");
const userInfo = document.getElementById("user-info");
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const userPhoto = document.getElementById("user-photo");

// 🔥 Google Sign-In
signInBtn.addEventListener("click", async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("✅ Signed in as:", result.user.displayName);
        window.location.href = "home.html"; 
    } catch (error) {
        console.error("❌ Error during sign-in:", error);
    }
});

// 🔥 Google Sign-Out
signOutBtn.addEventListener("click", async () => {
    try {
        await signOut(auth);
        console.log("✅ Signed out successfully!");
    } catch (error) {
        console.error("❌ Error during sign-out:", error);
    }
});

// 🔥 Auth State Listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        // ✅ User is signed in
        signInBtn.classList.add("hidden");
        signOutBtn.classList.remove("hidden");
        userInfo.classList.remove("hidden");

        onAuthStateChanged(auth, (user) => {
            if (user) {
                window.location.href = "home.html";
            }
        });
    } else {
        // ❌ User is signed out
        signInBtn.classList.remove("hidden");
        signOutBtn.classList.add("hidden");
        userInfo.classList.add("hidden");
    }
});
