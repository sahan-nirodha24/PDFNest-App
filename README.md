# 🪹 PDFNest

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)

**PDFNest** is a beautiful, privacy-first web application that transforms your high-quality images into optimized PDF documents. Built with React and Vite, the entire conversion process happens locally in your browser, guaranteeing zero server uploads and 100% data privacy.

## ✨ Features

- 🔒 **100% Client-Side Processing**: Your images never leave your computer. Everything is processed directly within your browser.
- 🎨 **Beautiful UI**: Modern glassmorphism design with a seamless Light/Dark mode toggle.
- 🔄 **Drag & Drop Reordering**: Easily upload multiple images and drag them to arrange the exact page order.
- 📉 **Smart Compression Engine**: Need a 2.5MB limit? PDFNest iteratively scales and compresses your images on a hidden canvas to hit strict file size limits without destroying visual quality.
- 👁️ **Interactive Preview**: Preview your generated PDF document in a built-in modal before saving.
- 🚀 **Lightning Fast**: Optimized with Vite for incredibly fast build and load times.

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)
- **Drag & Drop**: [@dnd-kit/core](https://dndkit.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS (Custom Glassmorphism Variables)

## 🚀 Getting Started

To run this project locally, follow these steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pdfnest.git
   ```
2. Navigate to the project directory:
   ```bash
   cd pdfnest
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and visit `http://localhost:5173`

## 📦 Building for Production

To build the app for production, run:
```bash
npm run build
```
This will generate optimized static files in the `dist` folder, ready to be deployed to Vercel, Netlify, or GitHub Pages.

## 🐳 Running with Docker

PDFNest includes a multi-stage `Dockerfile` to easily run the app in an isolated container using Nginx.

1. Build the Docker image:
   ```bash
   docker build -t pdfnest-app .
   ```
2. Run the Docker container:
   ```bash
   docker run -p 8080:80 -d pdfnest-app
   ```
3. Open your browser and visit `http://localhost:8080`
## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/pdfnest/issues).

## 📄 License
This project is licensed under the MIT License.
