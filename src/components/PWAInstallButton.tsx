import React, { useState } from 'react';
import { Download, Smartphone, X, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  onOpenModal?: () => void;
  variant?: 'header' | 'floating' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  onOpenModal,
  variant = 'header',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSQuickGuide, setShowIOSQuickGuide] = useState(false);
  const [dismissedFloating, setDismissedFloating] = useState(false);

  // If already installed, hide
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) return;
    }
    if (onOpenModal) {
      onOpenModal();
    } else if (isIOS) {
      setShowIOSQuickGuide(true);
    }
  };

  if (variant === 'floating') {
    if (dismissedFloating) return null;

    return (
      <>
        <div className="fixed bottom-16 md:bottom-6 right-4 z-40 max-w-xs animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-white/95 backdrop-blur-md border border-[#FFD1E8] p-3 rounded-2xl shadow-xl shadow-[#FF9DCB]/20 flex items-center gap-3">
            <img 
              src="/pwa-192x192.png" 
              alt="Ícone App Bolos Márcia" 
              className="w-10 h-10 rounded-xl shadow-xs shrink-0 border border-[#FF9DCB]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/icon.svg';
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#2D3142] truncate">Instale o Bolos Márcia</p>
              <p className="text-[10px] text-[#8E9AAF] truncate">Acesso rápido na tela inicial</p>
            </div>
            <button
              onClick={handleClick}
              className="bg-[#FF9DCB] hover:bg-[#FF85BE] text-[#2D3142] px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-xs shrink-0 cursor-pointer border border-[#FF9DCB] transition-transform active:scale-95"
            >
              Instalar
            </button>
            <button
              onClick={() => setDismissedFloating(true)}
              className="text-[#8E9AAF] hover:text-[#2D3142] p-1 cursor-pointer"
              aria-label="Fechar aviso"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {showIOSQuickGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D3142]/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-[#FFD1E8] text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-xl p-0.5 bg-gradient-to-br from-[#FF9DCB] to-[#FFD1E8] border border-[#FF9DCB] shadow-sm">
                <img src="/pwa-192x192.png" alt="Ícone App" className="w-full h-full rounded-lg object-contain" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#2D3142]">Adicionar ao iPhone</h3>
                <p className="mt-1 text-xs text-[#8E9AAF]">
                  1. Toque em <strong>Compartilhar</strong> <Share2 className="w-3 h-3 inline text-[#2D3142]" /> no Safari.<br />
                  2. Selecione <strong>"Adicionar à Tela de Início"</strong> <PlusSquare className="w-3 h-3 inline text-[#2D3142]" />.
                </p>
              </div>
              <button
                onClick={() => setShowIOSQuickGuide(false)}
                className="w-full rounded-xl bg-[#FF9DCB] py-2 text-xs font-bold text-[#2D3142] border border-[#FF9DCB] hover:bg-[#FF85BE] cursor-pointer"
              >
                Entendi!
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Header variant
  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 bg-white/80 hover:bg-white text-[#2D3142] px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-colors shadow-xs border border-[#FF9DCB] cursor-pointer"
      title="Instalar ícone na tela do celular"
    >
      <Download className="w-3 h-3 text-[#2D3142]" />
      <span>Instalar App</span>
    </button>
  );
};
