import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { ColorSelector } from './components/ColorSelector';
import { ResultViewer } from './components/ResultViewer';
import { AppState, ColorOption } from './types';
import { repaintWalls } from './services/geminiService';

const DEFAULT_COLOR: ColorOption = { 
  id: 'beige', 
  name: 'Beige Cálido', 
  hex: '#F5F5DC', 
  description: 'warm beige' 
};

function App() {
  const [state, setState] = useState<AppState>({
    originalImage: null,
    generatedImage: null,
    isProcessing: false,
    selectedColor: DEFAULT_COLOR,
    error: null
  });

  const [mimeType, setMimeType] = useState<string>('image/png');

  // Handle new image upload
  const handleImageSelected = (base64: string, type: string) => {
    setState(prev => ({
      ...prev,
      originalImage: base64,
      generatedImage: null, // Reset generated image on new upload
      error: null
    }));
    setMimeType(type);
  };

  // Handle color selection
  const handleColorSelected = (color: ColorOption) => {
    setState(prev => ({
      ...prev,
      selectedColor: color
    }));
    // User must click "Pintar Habitación" to generate
  };

  // Trigger Gemini generation
  const handleGenerate = async () => {
    if (!state.originalImage) return;

    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
        // Strip the data:image/png;base64, prefix for the API
        const base64Data = state.originalImage.split(',')[1];
        
        const generatedImageBase64 = await repaintWalls(
            base64Data, 
            mimeType, 
            state.selectedColor.description
        );

        // Add prefix back for displaying in img tag
        const finalImageUrl = `data:image/png;base64,${generatedImageBase64}`;

        setState(prev => ({
            ...prev,
            generatedImage: finalImageUrl,
            isProcessing: false
        }));
    } catch (err: any) {
        setState(prev => ({
            ...prev,
            isProcessing: false,
            error: err.message || "Algo salió mal al pintar la habitación."
        }));
    }
  };

  const handleReset = () => {
    setState({
        originalImage: null,
        generatedImage: null,
        isProcessing: false,
        selectedColor: DEFAULT_COLOR,
        error: null
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />

      <main className="max-w-5xl mx-auto px-4 pt-8">
        
        {!state.originalImage ? (
           <div className="flex flex-col items-center justify-center min-h-[60vh]">
             <div className="text-center mb-8 max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                  Visualiza tu Habitación en Cualquier Color
                </h2>
                <p className="text-lg text-slate-600">
                  Sube una foto, elige un color y mira cómo la IA repinta profesionalmente tus paredes en segundos. 
                  Mantén tus muebles e iluminación exactamente como están.
                </p>
             </div>
             <ImageUpload onImageSelected={handleImageSelected} />
             
             {/* Features Grid */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full max-w-4xl">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                   <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                   </div>
                   <h3 className="font-bold text-slate-900 mb-2">Resultados Fotorrealistas</h3>
                   <p className="text-sm text-slate-500">Nuestra IA mantiene sombras, iluminación y texturas para una apariencia creíble.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                   <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
                   </div>
                   <h3 className="font-bold text-slate-900 mb-2">Cualquier Color</h3>
                   <p className="text-sm text-slate-500">Elige entre preajustes de tendencia o ingresa cualquier código hexadecimal personalizado para que coincida con tu marca.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                   <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                   </div>
                   <h3 className="font-bold text-slate-900 mb-2">Listo para Móvil</h3>
                   <p className="text-sm text-slate-500">Toma una foto directamente desde tu teléfono y visualiza los cambios en el sitio.</p>
                </div>
             </div>
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Controls (Desktop) or Top Controls (Mobile) */}
            <div className="lg:col-span-4 order-2 lg:order-1 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
                <ColorSelector 
                  selectedColor={state.selectedColor} 
                  onSelectColor={handleColorSelected} 
                  onGenerate={handleGenerate}
                  isProcessing={state.isProcessing}
                />
                
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Instrucciones</h4>
                  <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                    <li>Selecciona un color o descríbelo.</li>
                    <li>Haz clic en <strong>Pintar Habitación</strong> para generar.</li>
                    <li>Revisa la imagen original y el resultado.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Main Preview Area */}
            <div className="lg:col-span-8 order-1 lg:order-2">
               <ResultViewer 
                 originalImage={state.originalImage}
                 generatedImage={state.generatedImage}
                 selectedColor={state.selectedColor}
                 isProcessing={state.isProcessing}
                 onReset={handleReset}
                 error={state.error}
               />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;