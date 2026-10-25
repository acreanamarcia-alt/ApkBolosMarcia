import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Send, 
  MapPin, 
  Calendar, 
  Clock, 
  Check, 
  Copy, 
  CreditCard, 
  DollarSign, 
  QrCode,
  X,
  Cake
} from 'lucide-react';
import { CartItem, OrderForm } from '../types';

interface CartCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
  onNotify: (msg: string) => void;
}

export const CartCheckoutModal: React.FC<CartCheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNotify,
}) => {
  const [form, setForm] = useState<OrderForm>({
    name: '',
    whatsapp: '',
    deliveryType: 'delivery',
    address: '',
    neighborhood: '',
    deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    deliveryTime: '15:00',
    paymentMethod: 'pix',
    changeFor: '',
    observation: '',
  });

  const [copiedPix, setCopiedPix] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = form.deliveryType === 'delivery' ? 12.0 : 0.0;
  const grandTotal = subtotal + deliveryFee;

  const handleCopyPix = () => {
    navigator.clipboard.writeText('acreanamarcia@gmail.com');
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
    onNotify('Chave PIX (E-mail) copiada!');
  };

  const handleFinalizeWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      onNotify('Por favor informe seu nome.');
      return;
    }

    if (cartItems.length === 0) {
      onNotify('Seu carrinho está vazio.');
      return;
    }

    // Format WhatsApp text message
    let msg = `🎂 *NOVO PEDIDO - BOLOS MÁRCIA (BolosMarciaApk)*\n`;
    msg += `-----------------------------------------\n`;
    msg += `👤 *Cliente:* ${form.name}\n`;
    if (form.whatsapp) msg += `📱 *WhatsApp:* ${form.whatsapp}\n`;
    msg += `\n📦 *ITENS DA ENCOMENDA:*\n`;

    cartItems.forEach((item, idx) => {
      msg += `\n*${idx + 1}. ${item.title}* (${item.quantity}x)\n`;
      msg += `   Valor: R$ ${(item.price * item.quantity).toFixed(2)}\n`;
      if (item.customDetails && item.customDetails.length > 0) {
        item.customDetails.forEach(d => {
          msg += `   · ${d}\n`;
        });
      }
    });

    msg += `\n-----------------------------------------\n`;
    msg += `💰 *Subtotal:* R$ ${subtotal.toFixed(2)}\n`;
    msg += `🛵 *Entrega:* ${form.deliveryType === 'delivery' ? `R$ ${deliveryFee.toFixed(2)} (Delivery)` : 'Retirada no Ateliê (Grátis)'}\n`;
    msg += `💳 *TOTAL GERAL:* R$ ${grandTotal.toFixed(2)}\n`;
    msg += `💵 *Forma de Pagamento:* ${form.paymentMethod.toUpperCase()}${form.changeFor ? ` (Troco para R$ ${form.changeFor})` : ''}\n`;

    msg += `\n📅 *Data Desejada:* ${form.deliveryDate}\n`;
    msg += `⏰ *Horário:* ${form.deliveryTime}\n`;

    if (form.deliveryType === 'delivery') {
      msg += `📍 *Endereço de Entrega:* ${form.address}\n`;
      msg += `🏡 *Bairro:* ${form.neighborhood || 'Rio Branco'}\n`;
    } else {
      msg += `📍 *Retirada:* No Ateliê da Márcia\n`;
    }

    if (form.observation.trim()) {
      msg += `📝 *Observações:* ${form.observation}\n`;
    }

    msg += `\n_Enviado pelo aplicativo BolosMarciaApk_`;

    const encoded = encodeURIComponent(msg);
    // WhatsApp number for Marcia
    const phone = '5568999123456'; 
    const waUrl = `https://wa.me/${phone}?text=${encoded}`;

    window.open(waUrl, '_blank');
    onNotify('Abrindo WhatsApp para enviar a encomenda...');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D3142]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-auto shadow-2xl border border-[#FFD1E8] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF9DCB] via-[#FFD1E8] to-[#C8B6FF] text-[#2D3142] p-4 sm:p-5 flex items-center justify-between border-b border-[#FFD1E8]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#2D3142]" />
            <h2 className="font-serif font-bold text-lg sm:text-xl text-[#2D3142]">Sua Sacola de Encomendas</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/70 hover:bg-white text-[#2D3142] flex items-center justify-center font-bold text-sm transition-colors cursor-pointer border border-[#FF9DCB]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Cart Items List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-[#2D3142]">
              <span>Itens Selecionados ({cartItems.length})</span>
              {cartItems.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-[#8E9AAF] hover:text-[#2D3142] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Limpar Tudo</span>
                </button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="py-8 text-center text-[#8E9AAF] space-y-2">
                <Cake className="w-10 h-10 mx-auto text-[#FF9DCB] opacity-60" />
                <p className="font-serif text-base text-[#2D3142] font-semibold">Sua sacola está vazia</p>
                <p className="text-xs text-[#8E9AAF]">Escolha um bolo no cardápio para começar.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#FFD1E8]/60 border border-[#FFD1E8] rounded-2xl overflow-hidden bg-[#F7F7FF]">
                {cartItems.map((item) => (
                  <div key={item.cartId} className="p-3.5 flex items-start justify-between gap-3 bg-white">
                    <div className="space-y-1 flex-1">
                      <h4 className="font-serif font-bold text-sm text-[#2D3142]">{item.title}</h4>
                      <p className="text-xs text-[#8E9AAF]">{item.subtitle}</p>

                      {item.customDetails && item.customDetails.length > 0 && (
                        <div className="pt-1 space-y-0.5">
                          {item.customDetails.map((d, i) => (
                            <div key={i} className="text-[11px] text-[#2D3142] font-medium bg-[#FFD1E8]/40 px-2 py-0.5 rounded-md inline-block mr-1">
                              · {d}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="font-serif font-bold text-sm text-[#2D3142] pt-1">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 bg-[#F7F7FF] border border-[#FFD1E8] p-1 rounded-xl shrink-0">
                      <button
                        onClick={() => onUpdateQuantity(item.cartId, -1)}
                        className="w-7 h-7 rounded-lg bg-white text-[#2D3142] flex items-center justify-center font-bold hover:bg-[#FFD1E8] transition-colors cursor-pointer border border-[#FFD1E8]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-xs text-[#2D3142] w-5 text-center font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.cartId, 1)}
                        className="w-7 h-7 rounded-lg bg-white text-[#2D3142] flex items-center justify-center font-bold hover:bg-[#FFD1E8] transition-colors cursor-pointer border border-[#FFD1E8]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Form */}
          {cartItems.length > 0 && (
            <form onSubmit={handleFinalizeWhatsApp} className="space-y-5 pt-2">
              <h3 className="font-serif font-bold text-base text-[#2D3142] border-b border-[#FFD1E8] pb-2">
                Dados para Entrega & Finalização
              </h3>

              {/* Delivery Type Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-[#F7F7FF] p-1 rounded-xl border border-[#FFD1E8]">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, deliveryType: 'delivery' })}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    form.deliveryType === 'delivery'
                      ? 'bg-[#FF9DCB] text-[#2D3142] shadow-xs border border-[#FF9DCB]'
                      : 'text-[#8E9AAF] hover:text-[#2D3142]'
                  }`}
                >
                  🛵 Entrega Delivery (+R$ 12,00)
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, deliveryType: 'retirada' })}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    form.deliveryType === 'retirada'
                      ? 'bg-[#FF9DCB] text-[#2D3142] shadow-xs border border-[#FF9DCB]'
                      : 'text-[#8E9AAF] hover:text-[#2D3142]'
                  }`}
                >
                  🏡 Retirar no Ateliê (Grátis)
                </button>
              </div>

              {/* Name & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2D3142] block">Seu Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ex: Ana Paula da Silva"
                    className="w-full bg-[#F7F7FF] border border-[#FFD1E8] rounded-xl p-2.5 text-xs text-[#2D3142] outline-none focus:border-[#FF9DCB] focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2D3142] block">Seu WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    placeholder="(68) 99999-9999"
                    className="w-full bg-[#F7F7FF] border border-[#FFD1E8] rounded-xl p-2.5 text-xs text-[#2D3142] outline-none focus:border-[#FF9DCB] focus:bg-white"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2D3142] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#FF9DCB]" />
                    <span>Data da Entrega / Festa *</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={form.deliveryDate}
                    onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
                    className="w-full bg-[#F7F7FF] border border-[#FFD1E8] rounded-xl p-2.5 text-xs text-[#2D3142] outline-none focus:border-[#FF9DCB] focus:bg-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2D3142] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#FF9DCB]" />
                    <span>Horário Previsto *</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={form.deliveryTime}
                    onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })}
                    className="w-full bg-[#F7F7FF] border border-[#FFD1E8] rounded-xl p-2.5 text-xs text-[#2D3142] outline-none focus:border-[#FF9DCB] focus:bg-white font-mono"
                  />
                </div>
              </div>

              {/* Address if delivery */}
              {form.deliveryType === 'delivery' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#F7F7FF] p-3 rounded-2xl border border-[#FFD1E8]">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-[#2D3142] block">Endereço com Nº e Ponto de Referência *</label>
                    <input
                      type="text"
                      required
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Rua, número e complemento"
                      className="w-full bg-white border border-[#FFD1E8] rounded-xl p-2.5 text-xs text-[#2D3142] outline-none focus:border-[#FF9DCB]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#2D3142] block">Bairro (Rio Branco) *</label>
                    <input
                      type="text"
                      required
                      value={form.neighborhood}
                      onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                      placeholder="Ex: Bosque, Cerâmica..."
                      className="w-full bg-white border border-[#FFD1E8] rounded-xl p-2.5 text-xs text-[#2D3142] outline-none focus:border-[#FF9DCB]"
                    />
                  </div>
                </div>
              )}

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#2D3142] block">Forma de Pagamento</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'pix', label: 'PIX (Chave)', icon: <QrCode className="w-4 h-4 text-[#2D3142]" /> },
                    { id: 'cartao', label: 'Cartão na Entrega', icon: <CreditCard className="w-4 h-4 text-[#2D3142]" /> },
                    { id: 'dinheiro', label: 'Dinheiro', icon: <DollarSign className="w-4 h-4 text-[#2D3142]" /> },
                  ].map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setForm({ ...form, paymentMethod: method.id as any })}
                      className={`p-2.5 rounded-xl border-2 flex flex-col items-center justify-center gap-1 text-center transition-all cursor-pointer ${
                        form.paymentMethod === method.id
                          ? 'border-[#FF9DCB] bg-[#FFD1E8]/50 font-bold text-[#2D3142]'
                          : 'border-[#FFD1E8] bg-white text-[#8E9AAF] hover:border-[#FF9DCB]'
                      }`}
                    >
                      {method.icon}
                      <span className="text-[11px] leading-tight">{method.label}</span>
                    </button>
                  ))}
                </div>

                {/* PIX box */}
                {form.paymentMethod === 'pix' && (
                  <div className="bg-[#FFD1E8]/40 border border-[#FFD1E8] rounded-xl p-3 text-xs text-[#2D3142] flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold block text-[11px] text-[#2D3142]">Chave PIX Márcia (E-mail):</span>
                      <span className="font-mono text-xs text-[#2D3142] font-semibold">acreanamarcia@gmail.com</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="bg-[#FF9DCB] hover:bg-[#FF85BE] text-[#2D3142] px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer border border-[#FF9DCB]"
                    >
                      {copiedPix ? <Check className="w-3.5 h-3.5 text-[#2D3142]" /> : <Copy className="w-3.5 h-3.5 text-[#2D3142]" />}
                      <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                )}

                {/* Change input if Dinheiro */}
                {form.paymentMethod === 'dinheiro' && (
                  <div className="space-y-1 pt-1">
                    <label className="text-xs font-semibold text-[#2D3142] block">Precisa de troco para quanto?</label>
                    <input
                      type="text"
                      value={form.changeFor}
                      onChange={(e) => setForm({ ...form, changeFor: e.target.value })}
                      placeholder="Ex: Troco para R$ 200,00 ou Não preciso"
                      className="w-full bg-[#F7F7FF] border border-[#FFD1E8] rounded-xl p-2.5 text-xs text-[#2D3142] outline-none focus:border-[#FF9DCB]"
                    />
                  </div>
                )}
              </div>

              {/* Order summary totals */}
              <div className="bg-[#F7F7FF] rounded-2xl p-4 space-y-2 border border-[#FFD1E8] text-xs text-[#8E9AAF]">
                <div className="flex justify-between text-[#2D3142]">
                  <span>Subtotal dos Bolos</span>
                  <span className="font-mono font-bold text-[#2D3142]">R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#2D3142]">
                  <span>Taxa de Entrega</span>
                  <span className="font-mono font-bold text-[#2D3142]">
                    {deliveryFee > 0 ? `R$ ${deliveryFee.toFixed(2)}` : 'Grátis'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#2D3142] border-t border-[#FFD1E8] pt-2">
                  <span>Total da Encomenda</span>
                  <span className="font-serif text-xl font-black text-[#2D3142]">
                    R$ {grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Submit to WhatsApp */}
              <button
                type="submit"
                className="w-full bg-[#FF9DCB] hover:bg-[#FF85BE] active:scale-95 text-[#2D3142] font-bold py-4 px-6 rounded-2xl text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-[#FF9DCB]/30 transition-all cursor-pointer border border-[#FF9DCB]"
              >
                <Send className="w-4 h-4 text-[#2D3142]" />
                <span>Enviar Pedido pelo WhatsApp da Márcia</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
