# Mauli PG Manager — Interactive Client Demo Website

*Your PG. Your tenants. Your accounts. All in one place.*

---

## 🏢 Product Overview

**Mauli PG Manager** is a modern, high-trust PG (Paying Guest) and hostel management dashboard designed specifically for Indian PG owners and accommodation operators. 

This client demo provides an interactive prototype that a PG owner can explore on their phone or laptop. It demonstrates day-to-day operations: managing rooms and beds across multiple floors, registering new tenants, tracking monthly rent with partial payments, calculating transparent checkout deposit refunds, and enforcing the standard 15-day notice policy.

---

## 🚀 How to Run Locally

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### 2. Start the Application
Open a terminal in the project directory and run:

```bash
# If running for the first time:
npm install

# Start the interactive development server:
npm run dev
```

The application will be accessible at:
👉 **`http://localhost:5173/`** (or `http://127.0.0.1:5173/`)

---

## ☁️ How to Deploy to Vercel

The project is pre-configured with `vercel.json` for seamless static SPA hosting:

### Option A: Using the Vercel CLI
```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Deploy directly from your terminal:
vercel
```

### Option B: Deploying via GitHub / Git Repository
1. Push this directory to your GitHub repository.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import the GitHub repository.
4. Framework Preset will be automatically detected as **Vite**.
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click **"Deploy"**. Within 60 seconds, you will have a live public link (e.g. `https://mauli-pg-manager.vercel.app`) to share with the client.

---

## 🎯 What is Implemented vs. Simulated

| Feature Module | Implementation Status | Technical Details |
| :--- | :--- | :--- |
| **Interactive Occupancy Map** | **Fully Implemented** | Real-time floor-wise visual grid (Floor 1, 2, 3), bed status colors (Occupied, Available, Notice, Reserved, Maintenance), bed click inspection, bed transfer, and room occupancy counters. |
| **Tenant Management** | **Fully Implemented** | Search, multi-status filters, Add Tenant form with phone validation, floor/room/bed selectors, and comprehensive Tenant Profile Drawer with rent ledger & activity logs. |
| **Rent & Partial Payments** | **Fully Implemented** | Monthly ledger with partial payment support (e.g. ₹3,000 paid / ₹3,000 pending -> automatically marks bill as Partially Paid; additional payment marks it Paid). |
| **Printable Rent Receipt** | **Fully Implemented** | Professional, Indian PG-formatted paper/PDF rent receipt with receipt number, breakdown, authorized signature line, and native browser print trigger (`window.print()`). |
| **Security Deposit Settlement** | **Fully Implemented** | Transparent deposit tracking (₹3,000 received − ₹1,000 standard maintenance deduction = ₹2,000 refund due). Includes an interactive test calculator for custom deductions. |
| **Move-In / Move-Out Wizard** | **Fully Implemented** | 5-step checkout wizard with 15-day notice calculation, room checklist, deposit settlement, and bed release controls. |
| **Business Reports & CSV Export** | **Fully Implemented** | Real-time analytics for rent collection, bed utilization, and deposit liabilities with functioning one-click **"Export to CSV"** downloads. |
| **State Persistence & Reset** | **Fully Implemented** | Central reactive store backed by `localStorage` with a visible **"Reset Demo Data"** confirmation modal. |
| **Client Feedback Wishlist** | **Fully Implemented** | Built-in feedback drawer allowing the client to submit feature requests and view recorded notes. |
| **Payment Gateway (UPI/Netbanking)** | *Simulated* | Records simulated transaction references and payment modes without real banking credentials. |
| **WhatsApp Reminders** | *Simulated* | Pre-formats authentic WhatsApp reminder copy with one-click clipboard copy (production integrates WhatsApp Cloud API). |
| **Biometric Turnstile Integration** | *Simulated / Clearly Disclaimed* | Explicitly displayed as **"Not Connected — Integration Required"** with hardware protocol specifications (ZKTeco / eSSL SDK). |

---

## 🎙️ Demonstration Script for the PG Owner Client

When presenting this website to the client (either over a screen-share or by sending them the link), guide them through this quick 5-minute walkthrough:

### Minute 1: The Owner Dashboard & Top Bar
- *"Namaste Kishore-ji, this is the dashboard of **Mauli PG Manager**. Notice the top banner clearly indicating Demo Mode so you can freely test anything without worrying."*
- *"At a single glance, you see your total active tenants, occupied beds, vacant beds, and how much rent has been collected this month versus what is still pending."*
- Point out the **Monthly Collection Trend** chart and the **Upcoming Move-outs** notification.

### Minute 2: The Floor-Wise Room & Bed Map
- Click **"Rooms & Beds"** in the sidebar.
- *"Here is the interactive floor layout of your PG. Rooms 101, 102, 103 on Floor 1, and 201–203 on Floor 2. Notice each bed has a clear color: dark green for occupied, fresh green for available, orange for notice, and gray for maintenance."*
- Click on **Bed 102-B** (Aditya Joshi): *"Clicking any bed opens the occupant's details, their monthly rent, contact details, and allows shifting them to another bed with one click."*

### Minute 3: Rent Collection & Partial Payments
- Click **"Rent & Bills"** in the sidebar.
- *"In India, PG tenants often pay in installments. Here, Rohan Deshmukh paid ₹3,000 out of ₹6,000, so the system automatically marked his bill as 'Partially Paid'."*
- Click **"Receipt"** on any paid bill to open the print-ready receipt: *"You can print or save this receipt as a PDF directly for the tenant or their parents."*

### Minute 4: Security Deposits & The 15-Day Checkout Wizard
- Click **"Security Deposits"** in the sidebar.
- *"Your standard rules are built directly into the system: ₹3,000 deposit − ₹1,000 maintenance deduction = ₹2,000 refund due. No manual math, no disputes with tenants."*
- Click **"Move-in / Move-out"** and click **"Start Checkout"**:
  - Show the 4-step wizard: check unpaid rent, verify deposit deductions, verify room checklist (keys returned, geyser tested), and release the bed back to 'Available' or 'Maintenance'.

### Minute 5: Client Wishlist & Settings
- Click the **"Request Changes / Feedback"** button in the top banner:
  - *"If you want any custom rule—such as food preferences, electricity meter readings, or biometric scanner connections—you can type it right here. We've also highlighted the biometric scanner status in Settings as 'Integration Required' so you know exactly how the hardware will connect."*

---

## 🛡️ Current Prototype Limitations

1. **Frontend-Only Mock Database**: Data is stored in the browser's `localStorage`. Opening the site in Incognito or on a different device will show the fresh initial seed data.
2. **Simulated Payments**: Payments record simulated transaction IDs (e.g. `UPI/6278009182/GPAY`) for accounting demonstration; real UPI auto-capture requires Razorpay/Cashfree merchant gateway onboarding.
3. **Hardware Biometrics**: Biometric devices (eSSL/ZKTeco) require a physical bridge service running on a local PG network PC or a static IP push receiver.
