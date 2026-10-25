import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  CheckCircle2, 
  Share2, 
  PlusSquare, 
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallApkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export const InstallApkModal: React.FC<InstallApkModalProps> = ({
  isOpen,
  onClose,
  onNotify,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [deviceTab, setDeviceTab] = useState<'android' | 'ios'>(isIOS ? 'ios' : 'android');

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        onNotify('Bolos Márcia instalado com sucesso na sua tela de início!');
        onClose();
        return;
      }
    }
    onNotify('Siga o passo a passo abaixo para fixar o ícone na tela inicial!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D3142]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#FFD1E8] space-y-5 text-center relative animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F7F7FF] hover:bg-[#FFD1E8] text-[#2D3142] flex items-center justify-center font-bold text-sm cursor-pointer border border-[#FFD1E8] transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Real App Icon Preview for Mobile Screen */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF9DCB] to-[#FFD1E8] p-1 shadow-xl shadow-[#FF9DCB]/35 border-2 border-white ring-2 ring-[#FF9DCB]/40 transition-transform group-hover:scale-105">
              <img 
                src="/pwa-192x192.png" 
                alt="Ícone Bolos Márcia para celular" 
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/icon.svg';
                }}
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-[#C8B6FF] text-[#2D3142] p-1 rounded-full shadow-md border-2 border-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#2D3142] mt-2 font-mono tracking-wider">
            Bolos Márcia
          </span>
          <span className="text-[10px] text-[#8E9AAF]">
            Ícone oficial com as cores do aplicativo
          </span>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h3 className="font-serif font-bold text-xl text-[#2D3142]">
            Instalar na Tela do Celular
          </h3>
          <p className="text-xs text-[#8E9AAF] px-2">
            Acesse nosso cardápio instantaneamente, faça pedidos rápidos e receba atualizações sem precisar de app store!
          </p>
        </div>

        {/* Device Switcher Tabs */}
        <div className="flex rounded-xl bg-[#F7F7FF] p-1 border border-[#FFD1E8]">
          <button
            onClick={() => setDeviceTab('android')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              deviceTab === 'android'
                ? 'bg-[#FF9DCB] text-[#2D3142] shadow-xs'
                : 'text-[#8E9AAF] hover:text-[#2D3142]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android / Chrome</span>
          </button>
          <button
            onClick={() => setDeviceTab('ios')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              deviceTab === 'ios'
                ? 'bg-[#FF9DCB] text-[#2D3142] shadow-xs'
                : 'text-[#8E9AAF] hover:text-[#2D3142]'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>iPhone / Safari</span>
          </button>
        </div>

        {/* Dynamic Instruction Guide based on Platform */}
        {deviceTab === 'android' ? (
          <div className="bg-[#F7F7FF] rounded-2xl p-4 text-left space-y-3 text-xs text-[#2D3142] border border-[#FFD1E8]">
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#FF9DCB] text-[#2D3142] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-[#FFD1E8]">
                1
              </span>
              <div>
                <strong className="text-[#2D3142] block">Instalação Direta:</strong>
                <span className="text-[#5C677D]">
                  Clique no botão rosa <strong>"Instalar Agora no Celular"</strong> logo abaixo.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#FF9DCB] text-[#2D3142] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-[#FFD1E8]">
                2
              </span>
              <div>
                <strong className="text-[#2D3142] block">Ou pelo menu do Chrome:</strong>
                <span className="text-[#5C677D]">
                  Toque nos <strong>três pontinhos (⋮)</strong> no canto superior do navegador e escolha <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#F7F7FF] rounded-2xl p-4 text-left space-y-3 text-xs text-[#2D3142] border border-[#FFD1E8]">
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#FF9DCB] text-[#2D3142] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-[#FFD1E8]">
                1
              </span>
              <div>
                <strong className="text-[#2D3142] block">Toque em Compartilhar:</strong>
                <span className="text-[#5C677D]">
                  No Safari, toque no ícone de <strong>Compartilhar <Share2 className="w-3.5 h-3.5 inline text-[#2D3142] mx-0.5" /></strong> na barra inferior do iPhone.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#FF9DCB] text-[#2D3142] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-[#FFD1E8]">
                2
              </span>
              <div>
                <strong className="text-[#2D3142] block">Adicionar à Tela de Início:</strong>
                <span className="text-[#5C677D]">
                  Role as opções para cima e toque em <strong>"Adicionar à Tela de Início" <PlusSquare className="w-3.5 h-3.5 inline text-[#2D3142] mx-0.5" /></strong> com o nosso ícone decorado!
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleInstallClick}
            className="w-full bg-[#FF9DCB] hover:bg-[#FF85BE] active:scale-98 text-[#2D3142] font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-[#FF9DCB]/30 transition-all cursor-pointer border border-[#FF9DCB]"
          >
            {isInstalled ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#2D3142]" />
                <span>Aplicativo Já Instalado no Dispositivo</span>
              </>
            ) : isInstallable ? (
              <>
                <Download className="w-4 h-4 text-[#2D3142]" />
                <span>Instalar Agora no Celular (Automático)</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 text-[#2D3142]" />
                <span>{deviceTab === 'ios' ? 'Seguir Instruções do iPhone' : 'Adicionar à Tela Inicial'}</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-xs text-[#8E9AAF] hover:text-[#2D3142] font-medium cursor-pointer transition-colors"
          >
            Continuar no navegador
          </button>
        </div>
      </div>
    </div>
  );
};
