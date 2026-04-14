# HireIn - Premium Job Portal Solution

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black?logo=next.js)](https://nextjs.org/)
[![Laravel](https://img.shields.io/badge/Backend-Laravel%2011-FF2D20?logo=laravel)](https://laravel.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

**HireIn** is a state-of-the-art job portal designed to bridge the gap between high-tier talent and elite companies. Built with a focus on **Glassmorphism** and premium dark-mode aesthetics, HireIn provides a seamless, high-fidelity experience for both recruiters and job seekers.

---

## ✨ Key Features

### 👤 For Job Seekers
- **Profile Completeness Engine**: A sophisticated scoring system that provides actionable feedback and "Next Step" hints to optimize profile strength.
- **Consolidated Career Overview**: A beautiful "at-a-glance" professional dossier summarizing bio, skills, experience, and education.
- **Social Integration**: Integrated brand icons for LinkedIn, GitHub, and portfolios.
- **Asset Management**: In-browser avatar cropping and secure PDF resume uploads.

### 🏢 For Recruiters
- **Candidate Dossier View**: Detailed, multi-section expanded reviews of applicants without navigating away from the dashboard.
- **Role-Based Workflows**: Intuitive vacancy management and real-time application status updates.
- **Advanced Filtering**: Quickly narrow down talent by location, experience, and specific technical skills.

---

## 🛠️ Technical Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | `Next.js 16 (Turbopack)`, `React Query`, `Axios`, `Tailwind CSS` |
| **Backend** | `Laravel 11`, `PHP 8.3`, `MySQL` |
| **Auth** | `Laravel Sanctum` (Token-based) |
| **Icons** | `Lucide React` + Custom Brand SVGs |
| **UI Design** | `Glassmorphism`, `Indigo-Purple Gradient System` |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PHP (v8.2+)
- Composer
- MySQL

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/khanifnaufal/Job-Vacancy.git
   cd Job-Vacancy
   ```

2. **Backend Setup**
   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate --seed
   php artisan serve
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 🎨 Design Philosophy
HireIn prioritizes **visual excellence** and **responsive interactivity**.
- **Theming**: Deep-space backgrounds with indigo-indigo-purple gradients.
- **Feedback**: Real-time progress tracking for profile optimization.
- **Interactions**: Smooth micro-animations and blurred glass overlays to create depth and focus.

---

## 📄 License
This project was developed for professional educational purposes and is open for community contributions.

---
*Built with ❤️ by the HireIn Team.*
