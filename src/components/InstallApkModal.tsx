import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  CheckCircle2, 
  Share2, 
  PlusSquare, 
  X,
  Cake
} from 'lucide-react';

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
  const [installed, setInstalled] = useState(false);

  if (!isOpen) return null;

  const handleSimulateInstall = () => {
    // If browser supports beforeinstallprompt
    if ('serviceWorker' in navigator && (window as any).deferredPrompt) {
      (window as any).deferredPrompt.prompt();
    }
    setInstalled(true);
    onNotify('BolosMarciaApk pronto para instalação na tela inicial!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D3142]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#FFD1E8] space-y-5 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F7F7FF] hover:bg-[#FFD1E8] text-[#2D3142] flex items-center justify-center font-bold text-sm cursor-pointer border border-[#FFD1E8] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF9DCB] to-[#FFD1E8] mx-auto flex items-center justify-center text-[#2D3142] shadow-lg shadow-[#FF9DCB]/30 border border-[#FF9DCB]">
          <Cake className="w-8 h-8 text-[#2D3142]" />
        </div>

        <div className="space-y-1">
          <h3 className="font-serif font-bold text-xl text-[#2D3142]">
            Instalar BolosMarciaApk
          </h3>
          <p className="text-xs text-[#8E9AAF]">
            Tenha o cardápio do Ateliê Bolos Márcia direto na tela inicial do seu celular!
          </p>
        </div>

        {/* Step Guide */}
        <div className="bg-[#F7F7FF] rounded-2xl p-4 text-left space-y-3 text-xs text-[#2D3142] border border-[#FFD1E8]">
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-[#FF9DCB] text-[#2D3142] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-[#FFD1E8]">
              1
            </span>
            <div>
              <strong className="text-[#2D3142] block">No Android / Chrome:</strong>
              <span className="text-[#5C677D]">Toque nos 3 pontinhos do navegador e selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-[#FF9DCB] text-[#2D3142] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-[#FFD1E8]">
              2
            </span>
            <div>
              <strong className="text-[#2D3142] block">No iPhone / Safari:</strong>
              <span className="text-[#5C677D]">Toque no botão de Compartilhar <Share2 className="w-3 h-3 inline text-[#2D3142]" /> e selecione <strong>"Adicionar à Tela de Início"</strong>.</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleSimulateInstall}
            className="w-full bg-[#FF9DCB] hover:bg-[#FF85BE] text-[#2D3142] font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-[#FF9DCB]/30 transition-all cursor-pointer border border-[#FF9DCB]"
          >
            <Download className="w-4 h-4 text-[#2D3142]" />
            <span>{installed ? 'Aplicativo Instalado no Aparelho!' : 'Instalar Agora no Celular'}</span>
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
