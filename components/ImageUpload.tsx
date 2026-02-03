import React, { useCallback, useRef } from 'react';
import { Upload, Camera, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (base64: string, mimeType: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file) return;
    
    // Simple validation
    if (!file.type.startsWith('image/')) {
      alert('Por favor, sube un archivo de imagen.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelected(result, file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto p-6">
      <div 
        className="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center bg-white hover:bg-slate-50 transition-colors cursor-pointer flex flex-col items-center gap-4 shadow-sm"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-2">
          <Upload className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Sube una Foto de la Habitación</h3>
          <p className="text-slate-500 mt-1">Arrastra y suelta o haz clic para buscar</p>
        </div>
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div className="h-px bg-slate-300 flex-1"></div>
        <span className="text-slate-400 text-sm font-medium">O</span>
        <div className="h-px bg-slate-300 flex-1"></div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button 
          onClick={() => cameraInputRef.current?.click()}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm"
        >
          <Camera className="w-5 h-5" />
          Tomar Foto
        </button>
        {/* Hidden input for camera capture on mobile */}
        <input 
          type="file" 
          ref={cameraInputRef}
          className="hidden" 
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
        />

        <button 
          onClick={() => {
            // Load a sample image for demonstration
            // Using a nice interior placeholders
            const sampleImg = new Image();
            sampleImg.crossOrigin = "anonymous";
            sampleImg.src = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop";
            sampleImg.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = sampleImg.width;
                canvas.height = sampleImg.height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(sampleImg, 0, 0);
                onImageSelected(canvas.toDataURL('image/jpeg'), 'image/jpeg');
            };
          }}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm"
        >
          <ImageIcon className="w-5 h-5" />
          Usar Habitación de Muestra
        </button>
      </div>
    </div>
  );
};