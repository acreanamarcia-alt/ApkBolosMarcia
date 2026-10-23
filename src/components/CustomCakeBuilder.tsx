import React, { useState } from 'react';
import { 
  Wand2, 
  Sparkles, 
  Check, 
  Plus, 
  Info, 
  Cake, 
  ShoppingBag,
  Layers,
  Heart
} from 'lucide-react';
import { 
  CUSTOM_SIZES, 
  CUSTOM_DOUGHS, 
  CUSTOM_FILLINGS, 
  CUSTOM_FROSTINGS, 
  CUSTOM_EXTRAS 
} from '../data/cakes';
import { CartItem } from '../types';

interface CustomCakeBuilderProps {
  onAddCustomCake: (item: CartItem) => void;
  onNotify: (msg: string) => void;
}

export const CustomCakeBuilder: React.FC<CustomCakeBuilderProps> = ({
  onAddCustomCake,
  onNotify,
}) => {
  const [selectedSizeId, setSelectedSizeId] = useState<string>(CUSTOM_SIZES[1].id); // Aro 20cm default
  const [selectedDoughId, setSelectedDoughId] = useState<string>(CUSTOM_DOUGHS[0].id);
  const [selectedFilling1, setSelectedFilling1] = useState<string>(CUSTOM_FILLINGS[0].id);
  const [selectedFilling2, setSelectedFilling2] = useState<string>(CUSTOM_FILLINGS[1].id);
  const [selectedFrosting, setSelectedFrosting] = useState<string>(CUSTOM_FROSTINGS[0].id);
  const [selectedExtras, setSelectedExtras] = useState<string[]>(['topper-personalizado']);
  const [topperText, setTopperText] = useState<string>('Parabéns!');
  const [specialNotes, setSpecialNotes] = useState<string>('');

  const currentSize = CUSTOM_SIZES.find(s => s.id === selectedSizeId) || CUSTOM_SIZES[0];
  const currentDough = CUSTOM_DOUGHS.find(d => d.id === selectedDoughId) || CUSTOM_DOUGHS[0];
  const filling1Obj = CUSTOM_FILLINGS.find(f => f.id === selectedFilling1) || CUSTOM_FILLINGS[0];
  const filling2Obj = CUSTOM_FILLINGS.find(f => f.id === selectedFilling2) || CUSTOM_FILLINGS[1];
  const frostingObj = CUSTOM_FROSTINGS.find(f => f.id === selectedFrosting) || CUSTOM_FROSTINGS[0];

  // Calculate total price
  const extrasTotal = selectedExtras.reduce((sum, extraId) => {
    const found = CUSTOM_EXTRAS.find(e => e.id === extraId);
    return sum + (found ? found.price : 0);
  }, 0);

  const totalPrice = 
    currentSize.basePrice + 
    filling1Obj.extra + 
    filling2Obj.extra + 
    frostingObj.extra + 
    extrasTotal;

  const toggleExtra = (id: string) => {
    if (selectedExtras.includes(id)) {
      setSelectedExtras(selectedExtras.filter(e => e !== id));
    } else {
      setSelectedExtras([...selectedExtras, id]);
    }
  };

  const handleFinishCustomCake = () => {
    const details = [
      `Tamanho: ${currentSize.name} (${currentSize.slices})`,
      `Massa: ${currentDough.name}`,
      `1º Recheio: ${filling1Obj.name}`,
      `2º Recheio: ${filling2Obj.name}`,
      `Cobertura: ${frostingObj.name}`,
    ];

    if (selectedExtras.length > 0) {
      const extraNames = selectedExtras.map(id => CUSTOM_EXTRAS.find(e => e.id === id)?.name).filter(Boolean);
      details.push(`Extras: ${extraNames.join(', ')}`);
    }

    if (topperText.trim()) {
      details.push(`Dizeres do Topper: "${topperText}"`);
    }

    if (specialNotes.trim()) {
      details.push(`Observação: ${specialNotes}`);
    }

    const customCartItem: CartItem = {
      cartId: 'custom-cake-' + Date.now(),
      title: `Bolo Personalizado · ${currentSize.name}`,
      subtitle: `${filling1Obj.name} + ${filling2Obj.name}`,
      price: totalPrice,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      customDetails: details,
    };

    onAddCustomCake(customCartItem);
    onNotify('Bolo personalizado adicionado ao carrinho com sucesso!');
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Title header */}
      <div className="bg-gradient-to-r from-rose-600 to-amber-600 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2">
            <Wand2 className="w-3.5 h-3.5" />
            <span>Ateliê Personalizado</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">Monte Seu Bolo dos Sonhos</h1>
          <p className="text-rose-100 text-xs sm:text-sm mt-1">
            Escolha o tamanho, massa favorita, recheios duplos e decoração personalizada.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 text-right shrink-0">
          <span className="text-[11px] text-rose-100 block">Total Estimado</span>
          <span className="font-serif text-2xl font-black text-amber-300">
            R$ {totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Step 1: Size */}
        <section className="bg-white rounded-2xl border border-rose-100 p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-xs">1</span>
            <h3>Escolha o Tamanho do Bolo</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {CUSTOM_SIZES.map((size) => {
              const isSelected = selectedSizeId === size.id;
              return (
                <div
                  key={size.id}
                  onClick={() => setSelectedSizeId(size.id)}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-rose-600 bg-rose-50/50 shadow-sm'
                      : 'border-slate-100 bg-white hover:border-rose-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-xs sm:text-sm text-slate-900">{size.name}</div>
                    <div className="text-xs text-rose-600 font-medium">{size.slices} · {size.weight}</div>
                  </div>
                  <div className="font-serif font-bold text-sm text-slate-800">
                    R$ {size.basePrice.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Step 2: Dough */}
        <section className="bg-white rounded-2xl border border-rose-100 p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-xs">2</span>
            <h3>Escolha o Tipo de Massa</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {CUSTOM_DOUGHS.map((dough) => {
              const isSelected = selectedDoughId === dough.id;
              return (
                <div
                  key={dough.id}
                  onClick={() => setSelectedDoughId(dough.id)}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-rose-600 bg-rose-50/50 shadow-sm'
                      : 'border-slate-100 bg-white hover:border-rose-200'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs sm:text-sm text-slate-900">{dough.name}</div>
                    <div className="text-[11px] text-slate-500">{dough.desc}</div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-rose-600 shrink-0" />}
                </div>
              );
            })}
          </div>
        </section>

        {/* Step 3: Recheios (Duplo) */}
        <section className="bg-white rounded-2xl border border-rose-100 p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-xs">3</span>
            <h3>Escolha 2 Recheios Especiais (Camadas Duplas)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1st Filling */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">1º Recheio</label>
              <select
                value={selectedFilling1}
                onChange={(e) => setSelectedFilling1(e.target.value)}
                className="w-full bg-rose-50/40 border border-rose-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-rose-500/20 font-medium"
              >
                {CUSTOM_FILLINGS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} {f.extra > 0 ? `(+R$ ${f.extra.toFixed(2)})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* 2nd Filling */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">2º Recheio</label>
              <select
                value={selectedFilling2}
                onChange={(e) => setSelectedFilling2(e.target.value)}
                className="w-full bg-rose-50/40 border border-rose-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-rose-500/20 font-medium"
              >
                {CUSTOM_FILLINGS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} {f.extra > 0 ? `(+R$ ${f.extra.toFixed(2)})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Step 4: Cobertura */}
        <section className="bg-white rounded-2xl border border-rose-100 p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-xs">4</span>
            <h3>Cobertura & Finalização</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {CUSTOM_FROSTINGS.map((frost) => {
              const isSelected = selectedFrosting === frost.id;
              return (
                <div
                  key={frost.id}
                  onClick={() => setSelectedFrosting(frost.id)}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-rose-600 bg-rose-50/50 shadow-sm'
                      : 'border-slate-100 bg-white hover:border-rose-200'
                  }`}
                >
                  <span className="font-semibold text-xs sm:text-sm text-slate-900">{frost.name}</span>
                  <span className="text-xs font-serif font-bold text-slate-700">
                    {frost.extra > 0 ? `+R$ ${frost.extra.toFixed(2)}` : 'Incluso'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Step 5: Extras & Topper Personalizado */}
        <section className="bg-white rounded-2xl border border-rose-100 p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-xs">5</span>
            <h3>Adicionais & Topper de Aniversário</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CUSTOM_EXTRAS.map((extra) => {
              const isChecked = selectedExtras.includes(extra.id);
              return (
                <div
                  key={extra.id}
                  onClick={() => toggleExtra(extra.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isChecked
                      ? 'border-amber-400 bg-amber-50/50 shadow-xs'
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="rounded text-rose-600 focus:ring-0"
                    />
                    <span className="text-xs font-medium text-slate-800">{extra.name}</span>
                  </div>
                  <span className="text-xs font-serif font-bold text-amber-700">
                    +R$ {extra.price.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Topper text input if selected */}
          {selectedExtras.includes('topper-personalizado') && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 space-y-1.5">
              <label className="text-xs font-semibold text-amber-900 block">
                Nome e Idade para o Topper de Festa:
              </label>
              <input
                type="text"
                value={topperText}
                onChange={(e) => setTopperText(e.target.value)}
                placeholder="Ex: Clara 5 anos ou Feliz Aniversário Lucas!"
                className="w-full bg-white border border-amber-300 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-amber-500/20 font-medium"
              />
            </div>
          )}

          {/* Special Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Observações Especiais para a Márcia (opcional):
            </label>
            <input
              type="text"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="Ex: Pouco açúcar, sem canela, tom rosa claro com dourado..."
              className="w-full bg-white border border-rose-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>
        </section>

        {/* Summary Card & Add to Cart */}
        <section className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs text-rose-400 font-semibold uppercase tracking-wider block">Resumo do Bolo</span>
              <h3 className="font-serif font-bold text-lg text-white">
                {currentSize.name} · {currentSize.slices}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Valor Final</span>
              <span className="font-serif text-2xl font-black text-amber-400">
                R$ {totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-300 space-y-1 leading-relaxed">
            <p><strong>Massa:</strong> {currentDough.name}</p>
            <p><strong>Recheios:</strong> {filling1Obj.name} + {filling2Obj.name}</p>
            <p><strong>Cobertura:</strong> {frostingObj.name}</p>
            {topperText && <p><strong>Topper:</strong> "{topperText}"</p>}
          </div>

          <button
            onClick={handleFinishCustomCake}
            className="w-full bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Adicionar Bolo Personalizado ao Carrinho (R$ {totalPrice.toFixed(2)})</span>
          </button>
        </section>
      </div>
    </div>
  );
};
