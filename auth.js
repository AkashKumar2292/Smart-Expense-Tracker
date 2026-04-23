import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDVXb3gnVKm-JguPCsWiFQ8IcM9VQsQveo",
  authDomain: "expensetracker-85a50.firebaseapp.com",
  projectId: "expensetracker-85a50",
  storageBucket: "expensetracker-85a50.firebasestorage.app",
  messagingSenderId: "622489677206",
  appId: "1:622489677206:web:6c8c52deff322a253c81b7",
  measurementId: "G-0R6M9MXL9E"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 1. Guard the route and load profile
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const greetingEl = document.getElementById('greetingText');
                const avatarEl = document.getElementById('profileAvatar');
                
                const fullName = userData.fullName || "User";
                
                if (greetingEl) {
                    const hour = new Date().getHours();
                    let timeGreeting = "Good Morning";
                    if (hour >= 12 && hour < 17) timeGreeting = "Good Afternoon";
                    else if (hour >= 17) timeGreeting = "Good Evening";
                    
                    greetingEl.textContent = `${timeGreeting}, ${fullName.split(' ')[0]}!`;
                }
                
                if (avatarEl) {
                    // MAGIC INITIALS GENERATOR
                    const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=3b82f6&color=fff&size=128&bold=true`;
                    avatarEl.src = userData.photoURL ? userData.photoURL : fallbackAvatar;
                }
            }
        } catch (error) {
            console.error("Error fetching profile: ", error);
        }
    } else {
        window.location.href = "login.html";
    }
});

// 2. Global Sign Out Function
window.performSignOut = function() {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    }).catch((error) => {
        alert("Error signing out: " + error.message);
    });
};

// 3. Attach Sign Out event listener safely
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('signOutBtn')?.addEventListener('click', window.performSignOut);
});