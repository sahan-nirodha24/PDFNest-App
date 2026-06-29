# 🪹 PDFNest

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?logo=github-actions&logoColor=white)](#)

**PDFNest** is a beautiful, privacy-first web application that transforms your high-quality images into optimized PDF documents. Built with React and Vite, the entire conversion process happens locally in your browser, guaranteeing zero server uploads and 100% data privacy.

---

## 💡 Why PDFNest?

Most online image-to-PDF converters require you to upload your sensitive or personal images to their remote servers, which poses a massive privacy risk. Furthermore, heavy image files can take minutes to upload on slow connections. 

**PDFNest solves this by doing all the heavy lifting locally on your machine.** It utilizes modern browser APIs and JavaScript to read, compress, and bundle your images into a single PDF instantly. 

---

## ✨ Key Features

- 🔒 **100% Client-Side Processing**: Your images never leave your computer. Total privacy is guaranteed.
- 🎨 **Premium UI/UX**: Features a stunning, responsive glassmorphism design with a seamless Light/Dark mode toggle.
- 🔄 **Drag & Drop Reordering**: Upload multiple images and seamlessly drag them around to arrange the exact page order of your final PDF.
- 📉 **Smart Compression Engine**: Need to fit your PDF into a strict 2.5MB or 5MB limit for an email attachment? PDFNest's smart engine iteratively scales and compresses your images on a hidden canvas to hit your target file size without destroying visual quality.
- 👁️ **Interactive Preview**: Preview your generated PDF document in a built-in interactive modal before saving.
- ⚡ **GPU Accelerated**: Optimized grid rendering with lazy-loading and CSS containment ensures smooth 60fps scrolling even when uploading 100+ images.

---

## ⚙️ How "Smart Compression" Works

When you select a strict size limit (e.g., `2.5 MB`), PDFNest uses a binary-search style compression algorithm:
1. It calculates the ideal file size per image.
2. It draws the image onto a hidden HTML5 `<canvas>`.
3. It exports the canvas to a JPEG buffer, iteratively lowering the JPEG quality (and dimensions if necessary) until the image buffer fits within the required target size.
4. Finally, it uses `jsPDF` to stitch these perfectly compressed buffers into a single, optimized PDF document.

---

## 📸 Screenshots

> *(Add screenshots of your application here)*
> 
> ![Dark Mode Preview](placeholder-dark.png)
> *PDFNest Dark Mode Interface*
> 
> ![Light Mode Preview](placeholder-light.png)
> *PDFNest Light Mode Interface*

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)
- **Drag & Drop**: [@dnd-kit/core](https://dndkit.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS (Custom Glassmorphism Variables)

---

## 🚀 Getting Started

To run this project locally, follow these steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (Version 20+ recommended) installed on your machine.

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

---

## 📦 Building for Production

To build the app for production, run:
```bash
npm run build
```
This will generate optimized static files in the `dist` folder, ready to be deployed to Vercel, Netlify, or GitHub Pages.

---

## 🐳 Running with Docker

PDFNest includes a multi-stage `Dockerfile` to easily run the app in an isolated container using Nginx. This ensures a consistent environment regardless of your operating system.

1. Build the Docker image:
   ```bash
   docker build -t pdfnest-app .
   ```
2. Run the Docker container:
   ```bash
   docker run -p 8080:80 -d pdfnest-app
   ```
3. Open your browser and visit `http://localhost:8080`

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/pdfnest/issues). If you'd like to contribute code:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.
