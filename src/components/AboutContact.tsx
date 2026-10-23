import React from 'react';
import { 
  Heart, 
  Sparkles, 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Award, 
  CheckCircle2 
} from 'lucide-react';

export const AboutContact: React.FC = () => {
  const testimonials = [
    {
      name: 'Camila Albuquerque',
      city: 'Rio Branco - AC',
      date: 'Há 3 dias',
      rating: 5,
      text: 'O bolo vulcão de Ninho com Nutella da Márcia foi o ponto alto do aniversário da minha mãe! Molhadinho e muito recheado, todo mundo pediu o contato.',
    },
    {
      name: 'Marcos Vinicius',
      city: 'Rio Branco - AC',
      date: 'Há 1 semana',
      rating: 5,
      text: 'Encomendei o bolo de 2 andares personalizado e o topper veio perfeito. Entrega pontualíssima aqui no Bosque. Recomendo demais!',
    },
    {
      name: 'Juliana Castro',
      city: 'Rio Branco - AC',
      date: 'Há 2 semanas',
      rating: 5,
      text: 'Os bolos no pote e o bolo de cenoura com casquinha crocante viraram vício aqui no trabalho! Márcia tem mãos de fada.',
    },
  ];

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      {/* Hero presentation */}
      <section className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-rose-200 shrink-0 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1556911073-38141963c9e0?auto=format&fit=crop&w=600&q=80"
              alt="Márcia Confeiteira"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200/80 px-2.5 py-0.5 rounded-full text-xs font-semibold text-rose-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Confeitaria Afetiva & Artesanal</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Olá, eu sou a Márcia!
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl">
              Criei o <strong>Bolos Márcia (BolosMarciaApk)</strong> para levar sabor, carinho e memórias doces para as famílias de Rio Branco e todo o Acre. Cada massa é assada na temperatura ideal e os recheios são preparados com chocolates e laticínios nobres.
            </p>
          </div>
        </div>

        {/* Quality Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-rose-100 text-xs">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50/50">
            <Award className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-900 block">Ingredientes Nobres</span>
              <span className="text-[11px] text-slate-500">Nutella & Leite Ninho originais</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50/50">
            <ShieldCheck className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-900 block">100% Artesanal</span>
              <span className="text-[11px] text-slate-500">Sem conservantes químicos</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50/50">
            <Clock className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-900 block">Pontualidade</span>
              <span className="text-[11px] text-slate-500">Entrega programada para a festa</span>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <h3 className="font-serif font-bold text-xl text-slate-900">
            O que nossos clientes dizem
          </h3>
          <p className="text-xs text-slate-500">Mais de 500 festas adoçadas com amor</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-rose-100 p-4 space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{t.name}</span>
                <span className="text-[10px] text-slate-400">{t.date}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "{t.text}"
              </p>
              <span className="text-[10px] text-rose-600 font-medium block">
                {t.city}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Location and Info */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="font-serif font-bold text-xl text-white">Localização & Atendimento</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>Ateliê Bolos Márcia · Rio Branco, Acre</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-rose-400" />
              <span>WhatsApp de Encomendas: (68) 99912-3456</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-400" />
              <span>Segunda a Sábado: 08h às 19h · Domingo: 08h às 13h</span>
            </div>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl space-y-2 border border-slate-700">
            <span className="font-bold text-amber-400 block text-xs">Dúvidas Frequentes:</span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              <strong>Qual antecedência mínima?</strong> Recomendamos 24 horas para bolos decorados e festas. Bolos caseiros e de pote temos pronta entrega diariamente.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
