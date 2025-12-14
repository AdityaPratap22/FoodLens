# 🍽️ FoodLens – Intelligent Food Health Analysis System

## 📌 Project Overview
**FoodLens** is designed to help users make **healthier food choices** by analyzing what they eat.  
The system identifies food items using **barcode scanning**, **image recognition**, and **manual input**, then provides **nutritional insights** and a **health score** to indicate how healthy the food is.

The motivation behind this project comes from the rising number of lifestyle diseases caused by unhealthy eating habits, especially in India.

---

## 🎯 Objectives
- Help users understand the nutritional value of their food
- Promote healthy eating habits
- Provide quick, easy-to-understand health insights
- Apply web technologies and AI to solve a real-world problem

---

## 🚀 Key Features

### 1️⃣ Packaged Food Analysis (✅ Completed)
- Scan packaged food using **barcode**
- Fetch product data from **Open Food Facts API**
- Display:
  - Calories
  - Sugar
  - Fat
  - Saturated Fat
  - Sodium
  - Allergens & additives
- Generate a **Health Score (0–100)** with color indicators:
  - 🟢 Green – Healthy
  - 🟡 Yellow – Moderate
  - 🔴 Red – Unhealthy

---

### 2️⃣ Street Food Analysis (🟡 In Progress)
- Upload an image of street food
- Image sent to an **ML inference server**
- Predict food type using **image classification**
- Estimate nutritional values
- Generate health score

(Currently implemented using a pre-trained vision model via Hugging Face API.)

---

### 3️⃣ Manual Food Entry (🔴 Planned)
- User manually types food name
- Nutrition fetched from food databases
- Health score generated
- Works as a fallback option when scanning fails

---

## 🧠 Health Score Logic
FoodLens uses a **rule-based health scoring algorithm** based on:
- Calories
- Sugar content
- Saturated fat
- Sodium level
- Additives and allergens

Score Range:
- **80–100** → Healthy (Green)
- **50–79** → Moderate (Yellow)
- **0–49** → Unhealthy (Red)

---

## 🛠️ Tech Stack

### Frontend
- Next.js 16 (App Router)
- React
- Tailwind CSS
- ZXing (Barcode Scanner)
- TypeScript / JavaScript

### Backend
- Next.js API Routes
- Open Food Facts API
- Formidable (image upload handling)

### Machine Learning
- FastAPI (Python)
- Hugging Face Inference API
- Pillow

### Tools
- Git & GitHub
- VS Code
- Node.js & npm

---

## ⚙️ How to Run Locally

### Frontend
npm install
npm run dev

### Image Inference Server
cd inference-server
pip install -r requirements.txt
uvicorn app:app --reload --port 8000

### 👨‍💻 Team Members
- Shobhit Chaudhary
- Aditya Pratap Singh

### 🏁 Conclusion

FoodLens demonstrates how modern web technologies and AI can be combined to address real-world health problems.
The project is modular, scalable, and suitable for academic evaluation as well as future product development.

