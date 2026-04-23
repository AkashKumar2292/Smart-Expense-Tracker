// ADDED sendPasswordResetEmail to the imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-storage.js";

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
const storage = getStorage(app);

// Validates password strength
function isPasswordStrong(password) {
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})");
    return strongRegex.test(password);
}

function switchTab(tabName) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (tabName === 'login') {
        loginForm.classList.add('active-form');
        registerForm.classList.remove('active-form');
    } else {
        registerForm.classList.add('active-form');
        loginForm.classList.remove('active-form');
    }
}

function previewPhoto(event) {
    const file = event.target.files[0];
    const previewArea = document.getElementById('photoPreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewArea.style.backgroundImage = `url(${e.target.result})`;
            previewArea.innerHTML = ''; 
            previewArea.style.borderStyle = 'solid';
            previewArea.style.borderColor = '#3b82f6';
        };
        reader.readAsDataURL(file);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const photoInput = document.getElementById('profilePhotoInput');
    
    if (!isPasswordStrong(password)) {
        showNotification(
            "Password too weak! Must be 8+ chars and include a Capital, Small, Number, and Special Character.", 
            "#ef4444"
        );
        return; 
    }
    
    const btn = e.target.querySelector('button');
    
    try {
        btn.textContent = "Creating Account...";
        btn.disabled = true;

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        let photoURL = "";

        if (photoInput.files && photoInput.files[0]) {
            const file = photoInput.files[0];
            const storageRef = ref(storage, `profile_photos/${user.uid}`);
            
            await uploadBytes(storageRef, file);
            photoURL = await getDownloadURL(storageRef);
        }

        await setDoc(doc(db, "users", user.uid), {
            fullName: name,
            email: email,
            photoURL: photoURL,
            createdAt: new Date().toISOString()
        });

        showNotification("Account created! Redirecting...", "#10b981");
        setTimeout(() => { window.location.href = 'expensetracker.html'; }, 1000);

    } catch (error) {
        let errorMsg = "An error occurred.";
        if (error.code === 'auth/email-already-in-use') errorMsg = "That email is already registered.";
        else if (error.code === 'auth/weak-password') errorMsg = "Password should be at least 6 characters.";
        
        showNotification(errorMsg, "#ef4444");
        btn.textContent = "Create Account";
        btn.disabled = false;
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    // Updated to use the specific IDs we created in HTML
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const btn = e.target.querySelector('button');
    
    try {
        btn.textContent = "Signing In...";
        btn.disabled = true;

        await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
        
        showNotification("Login successful!", "#10b981");
        setTimeout(() => { window.location.href = 'expensetracker.html'; }, 1000);

    } catch (error) {
        showNotification("Invalid email or password.", "#ef4444");
        btn.textContent = "Sign In";
        btn.disabled = false;
    }
}

// Ensure notifications don't overlap using the master container technique
function showNotification(message, type = "success") {
    let container = document.getElementById("notification-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "notification-container";
        container.style.cssText = `position: fixed; top: 2rem; right: 2rem; z-index: 9999; display: flex; flex-direction: column; gap: 10px; pointer-events: none;`;
        document.body.appendChild(container);
    }
    
    let bgColor = "#10b981"; 
    if (type === "error" || type === "#ef4444") bgColor = "#ef4444"; 
    else if (type === "info" || type === "#3b82f6") bgColor = "#3b82f6"; 
    else if (type.startsWith("#")) bgColor = type; 
    
    const notification = document.createElement("div"); 
    notification.style.cssText = `background: ${bgColor}; color: white; padding: 1rem 1.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-weight: 600; pointer-events: auto;`;
    notification.textContent = message; 
    
    container.appendChild(notification);
    setTimeout(() => { if (container.contains(notification)) container.removeChild(notification); }, 3000);
}

// ==========================================================================
// EVENT LISTENERS
// ==========================================================================

const showLoginBtn = document.getElementById('showLogin');
const showRegisterBtn = document.getElementById('showRegister');

if (showLoginBtn) {
    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('login');
    });
}

if (showRegisterBtn) {
    showRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('register');
    });
}

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

if (loginForm) loginForm.addEventListener('submit', handleLogin);
if (registerForm) registerForm.addEventListener('submit', handleRegister);

const photoInput = document.getElementById('profilePhotoInput');
if (photoInput) photoInput.addEventListener('change', previewPhoto);

// --- FEATURE: Password Toggle Visibility ---
function setupPasswordToggle(toggleIconId, passwordInputId) {
    const toggleIcon = document.getElementById(toggleIconId);
    const passwordInput = document.getElementById(passwordInputId);
    
    if (toggleIcon && passwordInput) {
        toggleIcon.addEventListener('click', function () {
            // Toggle the type attribute
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            // Toggle the eye / eye-slash icon
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
}

setupPasswordToggle('toggleLoginPassword', 'loginPassword');
setupPasswordToggle('toggleRegPassword', 'regPassword');

// --- FEATURE: Forgot Password Logic ---
const forgotPasswordBtn = document.getElementById('forgotPassword');
if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('loginEmail');
    const email = emailInput.value.trim();
    
    if (!email) {
        showNotification("Please enter your email address first.", "#ef4444");
        return;
    }
    
    // Explicitly tell Firebase to use your new page
    const actionCodeSettings = {
        url: 'https://expensetracker-85a50.firebaseapp.com/resetpassword.html',
        handleCodeInApp: false,
    };
    
    try {
        await sendPasswordResetEmail(auth, email, actionCodeSettings); //
        showNotification("Reset link sent! check your inbox.", "#10b981");
    } catch (error) {
        showNotification(error.message, "#ef4444");
    }
});
}