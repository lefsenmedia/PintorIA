import React from 'react';
import { PaintRoller } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <PaintRoller className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-slate-900 leading-none">PintorIA</h1>
            <p className="text-xs text-slate-500 font-medium">Pintor de Habitaciones con IA</p>
          </div>
        </div>
      </div>
    </header>
  );
};