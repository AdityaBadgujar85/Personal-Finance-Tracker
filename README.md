# Assignment-7 Personal Finance Tracker

The **Personal Finance Tracker** is a React application designed to help users manage their finances effectively. It provides insights into income, expenses, budgets, and savings through interactive dashboards, detailed transaction management, and budget monitoring.  

---

## 🚀 Live Demo  
You can check the deployed project here:  
🔗 [Personal Finance Tracker - Netlify Link](https://personal-finance-tracker-project-sub.netlify.app/)

---

## 📌 Features

### 🔹 Global
- **Global Header and Footer** across the app.  
- **React Router** navigation between pages.  
- **Responsive Design** for mobile, tablet, and desktop.  
- **Data Persistence** using **localStorage** or a mock API.  
- **Default Data** included for quick start.  

---

### 🔹 Dashboard Page
- **Summary Cards:** Total Income, Total Expenses, Remaining Budget, and Savings.  
- **Interactive Charts:**  
  - Monthly spending trend (bar/line chart).  
  - Category-wise expense split (pie chart).  
- **Today’s Expenses Table:** Lists expenses with **amount, category, and notes**.  
- **Date Filter:** Narrow down dashboard data to a specific day or range.  

---

### 🔹 Transactions Page
- **Transaction Table** with sortable columns:  
  - Type (Income/Expense)  
  - Amount  
  - Category  
  - Date  
  - Description (optional)  
- **Add Transaction Form/Dialog** to capture all fields.  
- **Edit & Delete** actions for each row.  

---

### 🔹 Budgets Page
- Set a **monthly budget per category** (e.g., ₹ 10,000 for Groceries).  
- **Visual Progress Indicators:** Bars, rings, or meters showing current spend vs. budget.  
- **Overspend Alerts:** Real-time notifications when any category exceeds its limit.  

---

### 🔹 Profile Page
- Display **user details** (Name, Email, etc.).  
- **Default Currency Dropdown** (₹, $, €, £, …).  
- Show **Lifetime Total Expenses** and **Total Savings**.  
- **Edit Profile Button** to update user info.  

---

### 🔹 Notifications
- Integrated with **React Toastify** for alerts:  
  - Transaction added  
  - Transaction updated  
  - Transaction deleted  
  - Budget exceeded  

---

## 🛠️ Tech Stack
- **React.js** (Functional Components & Hooks)  
- **React Router DOM** (for navigation)  
- **React Toastify** (for notifications)  
- **Context API / Redux** (for state management)  
- **Chart.js / Recharts** (for interactive charts)  
- **CSS / Tailwind / Styled Components** (for styling & responsiveness)  

---
