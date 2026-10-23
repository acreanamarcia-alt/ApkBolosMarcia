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
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 space-y-5 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-rose-500/30">
          <Cake className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h3 className="font-serif font-bold text-xl text-slate-900">
            Instalar BolosMarciaApk
          </h3>
          <p className="text-xs text-slate-500">
            Tenha o cardápio do Ateliê Bolos Márcia direto na tela inicial do seu celular!
          </p>
        </div>

        {/* Step Guide */}
        <div className="bg-rose-50/60 rounded-2xl p-4 text-left space-y-3 text-xs text-slate-700 border border-rose-100">
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div>
              <strong className="text-slate-900 block">No Android / Chrome:</strong>
              <span>Toque nos 3 pontinhos do navegador e selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div>
              <strong className="text-slate-900 block">No iPhone / Safari:</strong>
              <span>Toque no botão de Compartilhar <Share2 className="w-3 h-3 inline text-blue-600" /> e selecione <strong>"Adicionar à Tela de Início"</strong>.</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleSimulateInstall}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-600/30 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{installed ? 'Aplicativo Instalado no Aparelho!' : 'Instalar Agora no Celular'}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-xs text-slate-500 hover:text-slate-700 font-medium"
          >
            Continuar no navegador
          </button>
        </div>
      </div>
    </div>
  );
};
