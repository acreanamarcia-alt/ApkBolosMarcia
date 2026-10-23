import React, { useState } from 'react';
import { 
  Calculator, 
  Users, 
  Cake, 
  Sparkles, 
  Check, 
  ArrowRight,
  Wine,
  UtensilsCrossed
} from 'lucide-react';

interface PartyCalculatorProps {
  onGoToCustomBuilder: () => void;
  onGoToCatalog: () => void;
}

export const PartyCalculator: React.FC<PartyCalculatorProps> = ({
  onGoToCustomBuilder,
  onGoToCatalog,
}) => {
  const [adults, setAdults] = useState<number>(15);
  const [children, setChildren] = useState<number>(5);

  // Standard Brazilian party math:
  // Adult: 100g cake, 5 docinhos, 7 salgados, 400ml beverage
  // Child: 60g cake, 4 docinhos, 4 salgados, 250ml beverage
  const totalGuests = adults + children;
  const cakeWeightKg = ((adults * 0.1) + (children * 0.06)).toFixed(1);
  const totalSlices = Math.ceil(adults + (children * 0.8));
  const docinhosCount = Math.round((adults * 5) + (children * 4));
  const salgadosCount = Math.round((adults * 7) + (children * 4));
  const drinksLiters = Math.ceil(((adults * 0.4) + (children * 0.25)));

  // Recommendation
  let recommendedSize = 'Aro 20cm (Médio - 20 a 25 fatias)';
  if (totalSlices <= 12) recommendedSize = 'Aro 15cm (Pequeno - 10 a 12 fatias)';
  else if (totalSlices <= 25) recommendedSize = 'Aro 20cm (Médio - 20 a 25 fatias)';
  else if (totalSlices <= 40) recommendedSize = 'Aro 25cm (Grande - 35 a 40 fatias)';
  else recommendedSize = 'Bolo de 2 Andares (50 a 60 fatias)';

  return (
    <div className="space-y-6 pb-20 max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-rose-700 rounded-2xl p-6 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2">
          <Calculator className="w-3.5 h-3.5" />
          <span>Calculadora Confeiteira</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold">Calculadora de Festa & Convidados</h1>
        <p className="text-rose-100 text-xs sm:text-sm mt-1">
          Descubra o tamanho exato do bolo para não sobrar nem faltar na sua festa em Rio Branco!
        </p>
      </div>

      {/* Guest Controls */}
      <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-xs space-y-6">
        <h3 className="font-serif font-bold text-lg text-slate-900">Quantos convidados na sua celebração?</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Adults */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-rose-600" />
                Adultos
              </span>
              <span className="font-mono text-base text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-100">
                {adults}
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="100"
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>2</span>
              <span>50</span>
              <span>100+</span>
            </div>
          </div>

          {/* Children */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                Crianças (até 10 anos)
              </span>
              <span className="font-mono text-base text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-100">
                {children}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>0</span>
              <span>30</span>
              <span>60</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Cake Result Highlight Card */}
        <div className="bg-gradient-to-br from-rose-50 to-rose-100/60 border-2 border-rose-200 rounded-2xl p-5 space-y-3 sm:col-span-2">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
            <Cake className="w-4 h-4" />
            <span>Recomendação de Bolo Márcia</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div className="font-serif font-bold text-2xl sm:text-3xl text-rose-950">
              {cakeWeightKg} kg de Bolo
            </div>
            <div className="text-sm font-semibold text-rose-700 bg-white/80 px-3 py-1 rounded-full border border-rose-200 inline-block">
              {totalSlices} fatias recomendadas
            </div>
          </div>

          <div className="text-xs text-slate-700 bg-white/70 p-3 rounded-xl border border-rose-100/80">
            <strong>Modelo ideal de forma:</strong> {recommendedSize}
          </div>

          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={onGoToCustomBuilder}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all cursor-pointer"
            >
              <span>Personalizar Este Bolo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onGoToCatalog}
              className="bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 font-semibold px-4 py-2 rounded-xl text-xs transition-colors"
            >
              Ver Bolos Prontos no Cardápio
            </button>
          </div>
        </div>

        {/* Docinhos & Salgados */}
        <div className="bg-white border border-rose-100 rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Docinhos Gourmet</span>
          </div>
          <div className="font-serif font-bold text-2xl text-slate-900">
            {docinhosCount} unidades
          </div>
          <p className="text-xs text-slate-500">
            Brigadeiro, Ninho com Nutella e Beijinho de coco.
          </p>
        </div>

        {/* Bebidas */}
        <div className="bg-white border border-rose-100 rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
            <Wine className="w-4 h-4 text-cyan-500" />
            <span>Bebidas & Refrigerantes</span>
          </div>
          <div className="font-serif font-bold text-2xl text-slate-900">
            {drinksLiters} Litros
          </div>
          <p className="text-xs text-slate-500">
            Calculado para refrigerantes, água e sucos naturais.
          </p>
        </div>
      </div>
    </div>
  );
};
