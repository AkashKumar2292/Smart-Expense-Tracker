# 📊 Smart Expense Tracker

**Interactive Personal Finance & Budget Visualization System**

Smart Expense Tracker is a responsive web application that helps users monitor their daily financial habits. The system logs expenses, syncs data securely to the cloud, and dynamically renders interactive charts to visualize spending patterns, enabling data-driven budget management across multiple devices.

### ⚙️ How It Works

* User inputs daily transaction details (amount, category, date)
* Application securely pushes and retrieves data using Firebase
* Visual charts re-render dynamically in real-time to reflect new data
* Spending categories are compared instantly for budget analysis
* Data is stored in the cloud, ensuring your financial tracking is never lost

### 🧠 Core Features Used

| Feature | Purpose |
| :--- | :--- |
| **Cloud Synchronization** | saves transaction data securely via Firebase |
| **Dynamic Graphs** | visualizes spending trends over time |
| **Category Breakdown** | identifies highest expenditure areas |
| **Responsive UI** | ensures seamless access across mobile and desktop |

### 🚨 Expense Tracking Metrics

| Data Point | Meaning |
| :--- | :--- |
| 🔴 **Current Expense** | total money spent in the current tracked cycle |
| 🟠 **Category Split** | distribution of spending across specific tags (e.g., Food, Rent) |
| 🟡 **Historical Comparison** | current spending plotted against previous trends |
| 🟢 **Budget Status** | visual indicator of financial health and remaining funds |

### 🔥 Firebase Configuration & Setup

To run this project locally and enable cloud storage, you will need to connect it to your own Firebase project.

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/your-username/expense-tracker.git](https://github.com/your-username/expense-tracker.git)
   cd expense-tracker

2. **Create a Firebase Project:**

* Go to the Firebase Console and create a new project.
* Enable Firestore Database (or Realtime Database) and set the rules to allow read/write access.

3. **Add Your Firebase Config:**

* Open the script.js (or firebase-config.js) file.
* Locate the Firebase configuration object and replace the placeholder values with your actual Firebase API keys:

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

4. **Launch the App:**
Open index.html in your browser. Your expenses will now automatically sync to your Firebase database!

### 🛠 Tech Stack
**Frontend**

* HTML5
* CSS3
* Vanilla JavaScript (ES6)

**Backend & Storage**

* Firebase (Firestore / Realtime Database)

**Data Visualization**

* HTML Canvas / JS Charting Integration
