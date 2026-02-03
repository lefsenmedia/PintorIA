import React, { useState, useEffect } from 'react';
import { Check, Plus, Palette, Sparkles } from 'lucide-react';
import { ColorOption } from '../types';

interface ColorSelectorProps {
  selectedColor: ColorOption;
  onSelectColor: (color: ColorOption) => void;
  onGenerate: () => void;
  isProcessing: boolean;
}

const PRESET_COLORS: ColorOption[] = [
  { id: 'white', name: 'Blanco Nítido', hex: '#FFFFFF', description: 'crisp bright white' },
  { id: 'beige', name: 'Beige Cálido', hex: '#F5F5DC', description: 'warm beige or cream' },
  { id: 'gray', name: 'Gris Moderno', hex: '#A9A9A9', description: 'neutral modern gray' },
  { id: 'navy', name: 'Azul Marino', hex: '#000080', description: 'deep navy blue' },
  { id: 'sage', name: 'Verde Salvia', hex: '#8A9A5B', description: 'soft sage green' },
  { id: 'terracotta', name: 'Terracota', hex: '#E2725B', description: 'earthy terracotta orange' },
  { id: 'black', name: 'Negro Intenso', hex: '#000000', description: 'matte black' },
  { id: 'teal', name: 'Verde Azulado', hex: '#008080', description: 'rich deep teal' },
];

export const ColorSelector: React.FC<ColorSelectorProps> = ({ 
  selectedColor, 
  onSelectColor, 
  onGenerate, 
  isProcessing 
}) => {
  const [customColor, setCustomColor] = useState<string>('#6366f1');
  const [promptText, setPromptText] = useState('');

  // Sync local text with selectedColor if it comes from parent (e.g. reset)
  useEffect(() => {
    if (selectedColor.id === 'prompt') {
        setPromptText(selectedColor.description);
    } else if (selectedColor.id !== 'prompt') {
        // Clear prompt text if a preset is selected externally or by clicking
        setPromptText('');
    }
  }, [selectedColor]);

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setCustomColor(hex);
    onSelectColor({
      id: 'custom',
      name: 'Personalizado',
      hex: hex,
      description: `color with hex code ${hex}`
    });
  };
  
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setPromptText(text);
    if (text.trim()) {
        onSelectColor({
            id: 'prompt',
            name: 'Descripción Personalizada',
            hex: '', // No hex for prompt
            description: text
        });
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Elige el Color de la Pared</h3>
      
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3">
        {PRESET_COLORS.map((color) => (
          <button
            key={color.id}
            onClick={() => onSelectColor(color)}
            className={`
              relative group w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-sm border border-slate-200 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              ${selectedColor.id === color.id ? 'ring-2 ring-offset-2 ring-indigo-600 scale-110' : 'hover:scale-105'}
              transition-all duration-200
            `}
            style={{ backgroundColor: color.hex }}
            title={color.name}
            aria-label={`Seleccionar ${color.name}`}
          >
            {selectedColor.id === color.id && (
              <span className={`
                absolute inset-0 flex items-center justify-center
                ${['white', 'beige'].includes(color.id) ? 'text-slate-800' : 'text-white'}
              `}>
                <Check className="w-5 h-5" />
              </span>
            )}
          </button>
        ))}

        {/* Custom Color Picker Button */}
        <div className="relative w-10 h-10 sm:w-12 sm:h-12">
           <input
            type="color"
            value={customColor}
            onChange={handleCustomColorChange}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-20"
            title="Elegir color personalizado"
          />
          <div className={`
            w-full h-full rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 shadow-sm
            ${selectedColor.id === 'custom' ? 'ring-2 ring-offset-2 ring-indigo-600' : ''}
          `}>
             {selectedColor.id === 'custom' ? (
                 <div className="w-full h-full rounded-full flex items-center justify-center text-slate-800" style={{ backgroundColor: selectedColor.hex }}>
                     <Check className="w-5 h-5 mix-blend-difference text-white" />
                 </div>
             ) : (
                <Plus className="w-5 h-5" />
             )}
          </div>
        </div>
      </div>

      <div className="mt-6 mb-6">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
            <Palette className="w-4 h-4 text-indigo-600" />
            ¿O describe el color/estilo?
        </label>
        <textarea 
            value={promptText}
            onChange={handlePromptChange}
            placeholder="Ej: Azul marino mate, acabado de estuco veneciano beige..."
            className={`w-full p-3 text-sm border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none shadow-sm
                ${selectedColor.id === 'prompt' ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/10' : 'border-slate-300 bg-white'}
            `}
            rows={2}
        />
      </div>

      <button 
        onClick={onGenerate}
        disabled={isProcessing}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform active:scale-[0.98] text-lg"
      >
        <Sparkles className="w-5 h-5" />
        {isProcessing ? 'Procesando...' : 'Pintar Habitación'}
      </button>
      
      <div className="mt-4 text-center">
          <p className="text-sm font-medium text-slate-700">
            Seleccionado: <span className="font-bold text-indigo-700">{selectedColor.name}</span>
            {selectedColor.id === 'custom' && <span className="ml-2 text-slate-400 font-mono text-xs">{selectedColor.hex}</span>}
          </p>
      </div>
    </div>
  );
};