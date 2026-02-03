import React from 'react';
import { Download, RotateCcw, AlertCircle } from 'lucide-react';
import { ColorOption } from '../types';

interface ResultViewerProps {
  originalImage: string;
  generatedImage: string | null;
  selectedColor: ColorOption;
  isProcessing: boolean;
  onReset: () => void;
  error: string | null;
}

export const ResultViewer: React.FC<ResultViewerProps> = ({
  originalImage,
  generatedImage,
  selectedColor,
  isProcessing,
  onReset,
  error
}) => {
  
  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `pintoria-${selectedColor.name.toLowerCase().replace(/\s/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-8 pb-4">
      
      {/* Original Image Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-md uppercase tracking-wider">Original</span>
        </h3>
        <div className="relative w-full aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden shadow-md border border-slate-200">
           <img 
             src={originalImage} 
             alt="Habitación Original" 
             className="w-full h-full object-cover"
           />
        </div>
      </div>

      {/* Generated Image Section */}
      {(generatedImage || isProcessing || error) && (
         <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-md uppercase tracking-wider">Resultado</span>
            </h3>
            <div className="relative w-full aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden shadow-xl border border-indigo-100 ring-1 ring-indigo-50">
                
                {generatedImage && (
                    <img 
                      src={generatedImage} 
                      alt="Habitación Pintada" 
                      className={`w-full h-full object-cover transition-all duration-700 ${isProcessing ? 'scale-105 blur-sm opacity-50' : 'scale-100 opacity-100'}`}
                    />
                )}

                {/* Loading State */}
                {isProcessing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/60 backdrop-blur-sm">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mb-4"></div>
                    <p className="text-indigo-900 font-bold text-lg">Pintando paredes...</p>
                    <p className="text-indigo-600 text-sm mt-1">Esto puede tomar unos segundos</p>
                  </div>
                )}

                {/* Error State */}
                {!isProcessing && error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-red-50/90 backdrop-blur-sm p-8 text-center">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                             <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h4 className="text-red-900 font-bold text-lg mb-2">Error al generar</h4>
                        <p className="text-red-700 mb-6 max-w-xs">{error}</p>
                        <p className="text-xs text-slate-500 mt-2">Intenta ajustar tu descripción o elegir otro color.</p>
                    </div>
                )}
            </div>
         </div>
      )}

      {/* Action Bar */}
      <div className="mt-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
             <button 
                onClick={onReset}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors w-full sm:w-auto"
            >
                <RotateCcw className="w-5 h-5" />
                Empezar de Nuevo
            </button>
        </div>

        {generatedImage && !error && (
            <div className="w-full sm:w-auto">
              <button 
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform active:scale-95 w-full sm:w-auto"
              >
                <Download className="w-5 h-5" />
                Descargar
              </button>
            </div>
        )}
      </div>
    </div>
  );
};