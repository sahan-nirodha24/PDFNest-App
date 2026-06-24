import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { UploadCloud, FileDown, Layers, Image as ImageIcon, CheckCircle, Trash2, X, Download, Sun, Moon } from 'lucide-react';
import { SortableImage } from './components/SortableImage';
import { generatePDF } from './utils/pdfGenerator';
function App() {
  const [images, setImages] = useState([]);
  const [targetSize, setTargetSize] = useState('original');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [pdfInstance, setPdfInstance] = useState(null);
  const [pdfName, setPdfName] = useState('PDFNest_Document');
  const [inputKey, setInputKey] = useState(Date.now());
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const processFiles = (files) => {
    setImages((prev) => {
      let startIndex = prev.length + 1;
      const newImages = Array.from(files)
        .filter((file) => file.type.startsWith('image/'))
        .map((file) => ({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
          url: URL.createObjectURL(file),
          uploadOrder: startIndex++,
        }));
      return [...prev, ...newImages];
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    // Force a complete remount of the input element to clear the browser's file cache
    setInputKey(Date.now());
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const removeImage = (id) => {
    setImages((prev) => {
      const img = prev.find(i => i.id === id);
      if (img) URL.revokeObjectURL(img.url);
      return prev.filter(i => i.id !== id);
    });
  };

  const handleGenerate = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);
    setProgress(0);

    try {
      const pdf = await generatePDF(images, targetSize, (p) => setProgress(p));
      if (pdf) {
        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        setPdfInstance(pdf);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
      setProgress(100);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  const handleDownload = () => {
    if (pdfInstance) {
      let finalName = pdfName.trim() || 'PDFNest_Document';
      if (!finalName.toLowerCase().endsWith('.pdf')) {
        finalName += '.pdf';
      }
      pdfInstance.save(finalName);
    }
  };

  const closePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPdfInstance(null);
  };

  const clearAllImages = () => {
    images.forEach(img => URL.revokeObjectURL(img.url));
    setImages([]);
    setInputKey(Date.now());
  };

  return (
    <div className="app-container">
      <header className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Layers className="logo" size={48} />
          <div>
            <h1>PDFNest</h1>
            <p style={{ margin: 0 }}>Transform your images into a beautiful, optimized PDF in seconds.</p>
          </div>
        </div>
        <button 
          className="btn-icon" 
          onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={24} color="var(--text-primary)" /> : <Moon size={24} color="var(--text-primary)" />}
        </button>
      </header>

      <main className="grid-layout">
        {/* Left Column: Upload and Grid */}
        <div className="glass-panel">
          <h2><ImageIcon size={20} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '8px' }} /> Upload Images</h2>
          
          <div 
            className={`dropzone ${isDragActive ? 'active' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className="icon" />
            <h3>Drag & Drop images here</h3>
            <p>or click to browse from your computer</p>
            <input 
              key={inputKey}
              type="file" 
              multiple 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange}
            />
          </div>

          {images.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <p>Drag to reorder your {images.length} image{images.length > 1 ? 's' : ''}.</p>
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={images.map(img => img.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="image-grid">
                    {images.map((img, index) => (
                      <SortableImage 
                        key={img.id} 
                        id={img.id} 
                        url={img.url} 
                        index={index}
                        uploadOrder={img.uploadOrder}
                        onRemove={removeImage}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>

        {/* Right Column: Settings */}
        <div className="glass-panel controls-panel">
          <h2>Settings</h2>
          
          <div className="control-group">
            <label>Target PDF Size limit</label>
            <select 
              className="select-input"
              value={targetSize}
              onChange={(e) => setTargetSize(e.target.value)}
              disabled={isGenerating}
            >
              <option value="original">High Quality (Original Size)</option>
              <option value="2.5">2.5 MB</option>
              <option value="5">5 MB</option>
              <option value="7.5">7.5 MB</option>
              <option value="10">10 MB</option>
            </select>
          </div>

          <button 
            className="btn btn-primary" 
            onClick={handleGenerate}
            disabled={images.length === 0 || isGenerating}
            style={{ marginTop: '1rem', width: '100%', padding: '1.2rem' }}
          >
            {isGenerating ? (
              <span>Generating... {progress}%</span>
            ) : progress === 100 ? (
              <><CheckCircle size={20} /> Ready to Preview</>
            ) : (
              <><FileDown size={20} /> Preview & Generate PDF</>
            )}
          </button>

          {images.length > 0 && (
            <button 
              className="btn" 
              onClick={clearAllImages}
              disabled={isGenerating}
              style={{ width: '100%', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}
            >
              <Trash2 size={18} /> Clear All
            </button>
          )}

          {(isGenerating || progress > 0) && (
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
          )}
          
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Pro Tip</h3>
            <p style={{ fontSize: '0.85rem' }}>If you select a strict size limit, PDFNest will use "Smart Compression" to shrink the images iteratively while preserving as much quality as possible.</p>
          </div>
        </div>
      </main>

      {previewUrl && (
        <div className="modal-overlay" onClick={closePreview}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>PDF Preview</h2>
              <button className="btn-icon" onClick={closePreview}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <iframe 
                src={`${previewUrl}#toolbar=0`} 
                title="PDF Preview"
                width="100%" 
                height="100%" 
                style={{ border: 'none' }}
              />
            </div>
            <div className="modal-footer" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Save As:</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    className="select-input" 
                    style={{ width: '220px', padding: '0.6rem', paddingRight: '2.5rem' }} 
                    value={pdfName} 
                    onChange={(e) => setPdfName(e.target.value)} 
                    placeholder="Document Name"
                  />
                  <span style={{ position: 'absolute', right: '0.8rem', color: 'var(--text-secondary)', fontSize: '0.9rem', pointerEvents: 'none' }}>.pdf</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-secondary" onClick={closePreview}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleDownload}>
                  <Download size={20} /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
