
import React, { useState } from 'react';
import { Oil, ViewMode } from './types';
import { OILS_DATA } from './data/oils';
import Header from './components/Header';
import Oil3DViewer from './components/Oil3DViewer';
import OilTextGraphic from './components/OilTextGraphic';
import { askGeminiAboutOil } from './services/geminiService';
import { Search, Sparkles, Send, CheckCircle, Droplets, Wind, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.GRID);
  const [selectedOil, setSelectedOil] = useState<Oil | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const filteredOils = OILS_DATA.filter(oil => 
    oil.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    oil.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOilClick = (oil: Oil) => {
    setSelectedOil(oil);
    setCurrentView(ViewMode.DETAIL);
    setAiResponse(null);
    setQuestion('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskAI = async () => {
    if (!selectedOil || !question.trim()) return;

    setIsAiLoading(true);
    setAiResponse(null);

    try {
      const response = await askGeminiAboutOil(selectedOil.name, question);
      setAiResponse(response || "Nu s-a primit niciun răspuns de la expert.");
    } catch (error) {
      console.error("AI Interaction error:", error);
      setAiResponse("A apărut o problemă la comunicarea cu expertul AI.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-white selection:bg-stone-900 selection:text-white">
      <Header 
        showBack={currentView === ViewMode.DETAIL} 
        onBack={() => setCurrentView(ViewMode.GRID)} 
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === ViewMode.GRID ? (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="text-center space-y-8 py-16">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-stone-50 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">
                Aromaterapie de Înaltă Precizie
              </div>
              <h2 className="text-6xl md:text-8xl font-serif text-stone-900 tracking-tighter leading-none">Catalog dōTERRA</h2>
              <p className="text-stone-400 max-w-lg mx-auto text-lg leading-relaxed font-medium">
                Explorare vizuală elegantă și expertiză digitală pentru fiecare picătură de puritate.
              </p>
              
              <div className="max-w-xl mx-auto relative mt-12 group">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-stone-900 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Caută în universul dōTERRA..."
                  className="w-full pl-16 pr-8 py-7 bg-white border border-stone-100 rounded-[2.5rem] shadow-2xl shadow-stone-200/40 focus:ring-4 focus:ring-stone-900/5 focus:border-stone-200 outline-none transition-all text-xl placeholder:text-stone-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
              {filteredOils.map((oil) => (
                <div 
                  key={oil.id}
                  onClick={() => handleOilClick(oil)}
                  className="group bg-white rounded-[3.5rem] p-8 border border-stone-50 shadow-sm hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 cursor-pointer overflow-hidden flex flex-col items-center"
                >
                  <div className="aspect-square w-full rounded-[2.5rem] overflow-hidden mb-10 relative bg-stone-50 group-hover:bg-white transition-colors duration-500">
                    <OilTextGraphic 
                      name={oil.name} 
                      scientificName={oil.scientificName} 
                      color={oil.color} 
                    />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-stone-900 mb-1">{oil.name.split(' (')[0]}</h3>
                    <p className="text-[10px] uppercase font-black tracking-[0.4em] text-stone-300">{oil.scientificName}</p>
                    <div className="pt-6">
                      <div className="w-4 h-4 rounded-full mx-auto ring-4 ring-stone-50" style={{backgroundColor: oil.color}} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-12 duration-1000">
            {selectedOil && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                {/* Visual Column */}
                <div className="lg:col-span-5 space-y-12">
                  <div className="relative aspect-square rounded-[4rem] overflow-hidden bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border border-stone-50 group">
                    <OilTextGraphic 
                      name={selectedOil.name} 
                      scientificName={selectedOil.scientificName} 
                      color={selectedOil.color} 
                    />
                    <div className="absolute bottom-12 left-10 right-10 flex justify-center">
                      <div className="bg-white/80 backdrop-blur-2xl px-6 py-3 rounded-full border border-stone-100/40 shadow-sm flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-stone-900 animate-pulse" />
                         <span className="text-[10px] font-black text-stone-500 uppercase tracking-[0.5em]">Essence Profile</span>
                      </div>
                    </div>
                  </div>

                  <Oil3DViewer 
                    labelColor={selectedOil.color} 
                    name={selectedOil.name} 
                    scientificName={selectedOil.scientificName}
                  />
                  
                  {/* AI Support Box */}
                  <div className="bg-stone-900 p-12 rounded-[4rem] shadow-2xl space-y-10">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">Consultanță Expert</h3>
                        <p className="text-[10px] text-stone-500 uppercase tracking-[0.5em] font-black">Powered by Gemini AI</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Întreabă despre beneficii..."
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-6 text-white placeholder:text-stone-600 focus:ring-2 focus:ring-white/20 outline-none transition-all pr-20"
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
                        />
                        <button 
                          onClick={handleAskAI}
                          disabled={isAiLoading || !question.trim()}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-stone-900 p-3.5 rounded-xl hover:bg-stone-200 disabled:opacity-20 transition-all shadow-xl"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>

                      {isAiLoading && (
                        <div className="flex items-center gap-4 py-2 text-white/50">
                          <Loader2 className="animate-spin h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Analizăm baza de date terapeutică...</span>
                        </div>
                      )}

                      {aiResponse && (
                        <div className="p-8 bg-white/5 rounded-[3rem] border border-white/10 animate-in fade-in slide-in-from-top-10 duration-700">
                          <div className="text-stone-300 text-sm leading-[2] whitespace-pre-wrap font-medium">
                            {aiResponse}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content Column */}
                <div className="lg:col-span-7 space-y-20 py-12">
                  <header className="space-y-8">
                    <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-stone-50 rounded-full text-[10px] font-black uppercase tracking-[0.5em] text-stone-400 border border-stone-100">
                      <div className="w-2 h-2 rounded-full" style={{backgroundColor: selectedOil.color}} />
                      Therapeutic Protocol
                    </div>
                    <h1 className="text-8xl md:text-9xl font-serif text-stone-900 leading-[0.9] tracking-tighter">
                      {selectedOil.name.split(' (')[0]}
                    </h1>
                    <p className="text-4xl italic text-stone-300 font-light tracking-tight">
                      {selectedOil.scientificName}
                    </p>
                    <div className="w-32 h-1.5 bg-stone-900 rounded-full" />
                    <p className="text-2xl text-stone-500 leading-relaxed max-w-2xl font-medium pt-4">
                      {selectedOil.description}
                    </p>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                    <section className="space-y-10">
                      <div className="flex items-center gap-4">
                        <CheckCircle className="w-6 h-6 text-stone-900" />
                        <h3 className="text-[11px] font-black text-stone-400 uppercase tracking-[0.6em]">Proprietăți</h3>
                      </div>
                      <ul className="space-y-8">
                        {selectedOil.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-8 group">
                            <span className="mt-3 w-2.5 h-2.5 rounded-full border-2 border-stone-100 group-hover:border-stone-900 group-hover:bg-stone-900 transition-all shrink-0" />
                            <span className="text-stone-600 text-lg font-bold leading-snug">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section className="space-y-10">
                      <div className="flex items-center gap-4">
                        <Droplets className="w-6 h-6 text-stone-900" />
                        <h3 className="text-[11px] font-black text-stone-400 uppercase tracking-[0.6em]">Mod Utilizare</h3>
                      </div>
                      <ul className="space-y-8">
                        {selectedOil.uses.map((use, i) => (
                          <li key={i} className="flex items-start gap-8 group">
                            <span className="mt-3 w-2.5 h-2.5 rounded-full border-2 border-stone-100 group-hover:border-stone-900 group-hover:bg-stone-900 transition-all shrink-0" />
                            <span className="text-stone-600 text-lg font-bold leading-snug">{use}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>

                  <div className="pt-20 border-t border-stone-100 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="space-y-6 text-center md:text-left">
                      <h4 className="text-[11px] font-black text-stone-300 uppercase tracking-[0.6em]">Experiență Olfactivă</h4>
                      <p className="text-5xl md:text-6xl text-stone-900 font-serif italic leading-tight">
                        "{selectedOil.aromaticDescription}"
                      </p>
                    </div>
                    <div className="shrink-0 relative">
                      <div className="w-32 h-32 rounded-full border-4 border-stone-50 flex items-center justify-center p-6 shadow-xl shadow-stone-100">
                         <div className="w-full h-full rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]" style={{backgroundColor: selectedOil.color}} />
                      </div>
                      <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center border border-stone-100 shadow-lg">
                        <Wind className="w-5 h-5 text-stone-900" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-20 space-y-6 opacity-40">
                    <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.5em] leading-loose">
                      PROTOCOL DE SIGURANȚĂ CPTG: PURE THERAPEUTIC GRADE
                    </p>
                    <p className="text-stone-300 text-[10px] italic leading-loose">
                      Produsele dōTERRA sunt concepute pentru a sprijini bunăstarea generală. 
                      Utilizați conform instrucțiunilor de pe etichetă. Nu lăsați la îndemâna copiilor. 
                      Aceste informații nu înlocuiesc sfatul medicului.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
