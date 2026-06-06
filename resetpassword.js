import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const firebaseConfig = { "give your own API"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Get the oobCode from the URL
const urlParams = new URLSearchParams(window.location.search);
const actionCode = urlParams.get('oobCode');

const resetForm = document.getElementById('resetPasswordForm');

// Reuse your existing password strength logic
function isPasswordStrong(password) {
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})");
    return strongRegex.test(password);
}

if (!actionCode) {
    alert("Invalid or expired reset link.");
    window.location.href = 'login.html';
}

resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('newPassword').value;
    const btn = document.getElementById('resetBtn');

    if (!isPasswordStrong(newPassword)) {
        alert("Password is too weak!");
        return;
    }

    try {
        btn.textContent = "Updating...";
        btn.disabled = true;

        // Verify the code is still valid
        await verifyPasswordResetCode(auth, actionCode);
        // Save the new password
        await confirmPasswordReset(auth, actionCode, newPassword);

        alert("Success! Your password has been changed.");
        window.location.href = 'login.html';
    } catch (error) {
        alert("Error: " + error.message);
        btn.disabled = false;
        btn.textContent = "Update Password";
    }
});

// Basic password toggle
document.getElementById('togglePassword').addEventListener('click', function() {
    const input = document.getElementById('newPassword');
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});
