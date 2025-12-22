# 💰 Personal Finance Tracker — Assignment 7

A **React-based Personal Finance Tracker application** that helps users manage their **income, expenses, budgets, and savings** efficiently.  
The app provides a clean dashboard, interactive charts, transaction management, budget monitoring, and profile customization.

This project is built using **Pure React JS (Functional Components & Hooks)** with **React Router**, **localStorage persistence**, and **React Toastify** for notifications.

---

## 🚀 Live Demo

🔗 **You can check the deployed project here:**  
👉 [Personal Finance Tracker](https://personal-finance-tracker-project-sub.netlify.app/)  

---

## 🎯 Objective

The objective of this application is to help users:
- Track income and expenses
- Monitor monthly budgets category-wise
- Visualize spending patterns
- Receive real-time alerts on budget overspending
- Manage profile details and currency preferences

---

## 📌 Features

### 🧭 Global Layout
- Common **Header and Footer** across the application
- Smooth navigation using **React Router**

---

## 📊 Dashboard Page

- **Summary Cards**
  - Total Income
  - Total Expenses
  - Remaining Budget
  - Savings
- **Interactive Charts**
  - Monthly spending trend (Line / Bar Chart)
  - Category-wise expense split (Pie Chart)
- **Today’s Expenses Table**
  - Amount
  - Category
  - Note
- **Date Filter**
  - Filter all dashboard data by a specific date or date range

---

## 💸 Transactions Page

- Full transaction list in a **sortable table**
  - Type (Income / Expense)
  - Amount
  - Category
  - Date
  - Description
- **Add Transaction Form**
- **Edit Transaction**
- **Delete Transaction**
- All actions update data in real time

---

## 📈 Budgets Page

- Set **monthly budgets per category**
  - Example: ₹10,000 for Groceries
- Visual progress indicators (bars / meters)
- **Real-time overspend alerts** when limits are exceeded

---

## 👤 Profile Page

- Display user details:
  - Name
  - Email
- Change **Default Currency**
  - ₹, $, €, £
- View:
  - Lifetime Total Expenses
  - Lifetime Total Savings
- Edit profile functionality

---

## 🔔 Notifications (React Toastify)

- Success notifications:
  - Transaction added, edited, or deleted
  - Budget added or updated
- Error notifications:
  - Invalid form inputs
- Warning notifications:
  - Budget exceeded alerts

---

## 🧩 Tech Stack

| Technology | Purpose |
|----------|--------|
| React.js | UI Development |
| React Router | Navigation |
| React Hooks | State Management |
| Context / Redux | Global State |
| React Toastify | Notifications |
| Recharts / Charts | Data Visualization |
| CSS / Bootstrap | Styling |
| localStorage | Data Persistence |

---

## 📂 Data Handling

- Application data is stored using **localStorage**
- Includes **default sample data** for:
  - Transactions
  - Budgets
  - Profile

---

## 📱 Responsive Design

- Fully responsive layout
- Works on:
  - Desktop
  - Tablet
  - Mobile devices

---



# Start development server
npm start
