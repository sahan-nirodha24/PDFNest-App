import jsPDF from 'jspdf';

// Helper to load file into an Image object
const loadImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

// Iterative compression algorithm to hit a target byte size
const compressImageToTarget = async (img, targetBytes) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  let width = img.width;
  let height = img.height;
  let quality = 0.9;
  let scale = 1.0;
  
  // We'll do a max number of iterations to avoid infinite loops
  for (let i = 0; i < 20; i++) {
    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fill white background in case of transparent PNGs
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    // Estimate byte size from base64 string
    const base64Length = dataUrl.length - 'data:image/jpeg;base64,'.length;
    const sizeInBytes = Math.ceil(base64Length * 0.75); // approx base64 to bytes
    
    // Stop compressing if we hit the quality floor (to protect text legibility)
    if (sizeInBytes <= targetBytes || (quality <= 0.5 && scale <= 0.8)) {
      return { dataUrl, width: canvas.width, height: canvas.height };
    }
    
    // Logic: Reduce quality first. If quality gets too low, reduce scale instead.
    if (quality > 0.6) {
      quality -= 0.1;
    } else {
      scale *= 0.8; // Reduce dimensions by 20%
    }
  }
  
  // Return the best effort
  canvas.width = width * scale;
  canvas.height = height * scale;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return { dataUrl: canvas.toDataURL('image/jpeg', quality), width: canvas.width, height: canvas.height };
};

export const generatePDF = async (images, targetMB, onProgress) => {
  if (!images || images.length === 0) return null;
  
  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'pt',
    format: 'a4'
  });
  
  const A4_WIDTH = 595.28;
  const A4_HEIGHT = 841.89;
  
  let targetBytesPerImage = Infinity;
  if (targetMB !== 'original') {
    const totalTargetBytes = parseFloat(targetMB) * 1024 * 1024;
    // Leave 50KB for PDF overhead
    targetBytesPerImage = (totalTargetBytes - 50000) / images.length;
  }

  for (let i = 0; i < images.length; i++) {
    const file = images[i].file;
    const imgObj = await loadImage(file);
    
    let imgDataUrl;
    let finalWidth = imgObj.width;
    let finalHeight = imgObj.height;
    
    if (targetMB === 'original') {
      const canvas = document.createElement('canvas');
      canvas.width = finalWidth;
      canvas.height = finalHeight;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imgObj, 0, 0);
      imgDataUrl = canvas.toDataURL('image/jpeg', 0.95);
    } else {
      const compressed = await compressImageToTarget(imgObj, targetBytesPerImage);
      imgDataUrl = compressed.dataUrl;
      finalWidth = compressed.width;
      finalHeight = compressed.height;
    }
    
    // Add new page if not the first image
    if (i > 0) {
      pdf.addPage();
    }
    
    // Calculate aspect ratio to fit into A4 page
    const imgRatio = finalWidth / finalHeight;
    const pageRatio = A4_WIDTH / A4_HEIGHT;
    
    let renderWidth = A4_WIDTH;
    let renderHeight = A4_HEIGHT;
    let xOffset = 0;
    let yOffset = 0;
    
    if (imgRatio > pageRatio) {
      // Image is wider than page aspect ratio
      renderWidth = A4_WIDTH;
      renderHeight = A4_WIDTH / imgRatio;
      yOffset = (A4_HEIGHT - renderHeight) / 2; // center vertically
    } else {
      // Image is taller than page aspect ratio
      renderHeight = A4_HEIGHT;
      renderWidth = A4_HEIGHT * imgRatio;
      xOffset = (A4_WIDTH - renderWidth) / 2; // center horizontally
    }
    
    pdf.addImage(imgDataUrl, 'JPEG', xOffset, yOffset, renderWidth, renderHeight);
    
    if (onProgress) {
      onProgress(Math.round(((i + 1) / images.length) * 100));
    }
  }
  
  return pdf;
};
