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
      <div className="bg-gradient-to-r from-[#2D3142] via-[#353A4E] to-[#2D3142] rounded-3xl p-6 text-white shadow-xl border border-[#FFD1E8]/30">
        <div className="inline-flex items-center gap-1.5 bg-[#FFD1E8]/20 border border-[#FFD1E8]/30 px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2 text-[#FFD1E8]">
          <Calculator className="w-3.5 h-3.5 text-[#FF9DCB]" />
          <span>Calculadora Confeiteira</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold">Calculadora de Festa & Convidados</h1>
        <p className="text-[#F7F7FF]/90 text-xs sm:text-sm mt-1">
          Descubra o tamanho exato do bolo para não sobrar nem faltar na sua festa em Rio Branco!
        </p>
      </div>

      {/* Guest Controls */}
      <div className="bg-white rounded-3xl border border-[#FFD1E8] p-6 shadow-xs space-y-6">
        <h3 className="font-serif font-bold text-lg text-[#2D3142]">Quantos convidados na sua celebração?</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Adults */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-semibold text-[#2D3142]">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#FF9DCB]" />
                Adultos
              </span>
              <span className="font-mono font-bold text-base text-[#2D3142] bg-[#FFD1E8] px-2.5 py-0.5 rounded-lg border border-[#FF9DCB]">
                {adults}
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="100"
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="w-full accent-[#FF9DCB] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#8E9AAF] font-mono">
              <span>2</span>
              <span>50</span>
              <span>100+</span>
            </div>
          </div>

          {/* Children */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-semibold text-[#2D3142]">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#C8B6FF]" />
                Crianças (até 10 anos)
              </span>
              <span className="font-mono font-bold text-base text-[#2D3142] bg-[#FFD1E8] px-2.5 py-0.5 rounded-lg border border-[#FF9DCB]">
                {children}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
              className="w-full accent-[#FF9DCB] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#8E9AAF] font-mono">
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
        <div className="bg-[#F7F7FF] border-2 border-[#FFD1E8] rounded-3xl p-5 space-y-3 sm:col-span-2 shadow-xs">
          <div className="flex items-center gap-2 text-[#2D3142] font-bold text-xs uppercase tracking-wider">
            <Cake className="w-4 h-4 text-[#2D3142]" />
            <span>Recomendação de Bolo Márcia</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div className="font-serif font-bold text-2xl sm:text-3xl text-[#2D3142]">
              {cakeWeightKg} kg de Bolo
            </div>
            <div className="text-sm font-bold text-[#2D3142] bg-[#FFD1E8] px-3 py-1 rounded-full border border-[#FF9DCB] inline-block shadow-xs">
              {totalSlices} fatias recomendadas
            </div>
          </div>

          <div className="text-xs text-[#2D3142] bg-white p-3 rounded-2xl border border-[#FFD1E8]">
            <strong>Modelo ideal de forma:</strong> {recommendedSize}
          </div>

          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={onGoToCustomBuilder}
              className="bg-[#FF9DCB] hover:bg-[#FF85BE] text-[#2D3142] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-[#FF9DCB]/30 transition-all cursor-pointer border border-[#FF9DCB]"
            >
              <span>Personalizar Este Bolo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onGoToCatalog}
              className="bg-white hover:bg-[#FFD1E8]/40 text-[#2D3142] border border-[#FFD1E8] font-semibold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Ver Bolos Prontos no Cardápio
            </button>
          </div>
        </div>

        {/* Docinhos & Salgados */}
        <div className="bg-white border border-[#FFD1E8] rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-[#8E9AAF] text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-[#FF9DCB]" />
            <span className="text-[#2D3142]">Docinhos Gourmet</span>
          </div>
          <div className="font-serif font-bold text-2xl text-[#2D3142]">
            {docinhosCount} unidades
          </div>
          <p className="text-xs text-[#8E9AAF]">
            Brigadeiro, Ninho com Nutella e Beijinho de coco.
          </p>
        </div>

        {/* Bebidas */}
        <div className="bg-white border border-[#FFD1E8] rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-[#8E9AAF] text-xs font-semibold">
            <Wine className="w-4 h-4 text-[#C8B6FF]" />
            <span className="text-[#2D3142]">Bebidas & Refrigerantes</span>
          </div>
          <div className="font-serif font-bold text-2xl text-[#2D3142]">
            {drinksLiters} Litros
          </div>
          <p className="text-xs text-[#8E9AAF]">
            Calculado para refrigerantes, água e sucos naturais.
          </p>
        </div>
      </div>
    </div>
  );
};
