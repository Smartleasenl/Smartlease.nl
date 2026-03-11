// src/pages/OfferteVergelijkerPage.tsx
import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle, ArrowRight, Phone, MessageCircle, TrendingDown, TrendingUp, Minus, RefreshCw, Shield, Zap, Star, ChevronRight, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Step = 'upload' | 'analyzing' | 'result' | 'error';

interface OfferteData {
  aanbieder: string | null;
  merk: string | null;
  model: string | null;
  uitvoering: string | null;
  bouwjaar: number | null;
  verkoopprijs: number | null;
  catalogusprijs: number | null;
  looptijd_maanden: number | null;
  km_per_jaar: number | null;
  aanbetaling: number | null;
  aanbetaling_percentage: number | null;
  slottermijn: number | null;
  slottermijn_percentage: number | null;
  rente_percentage: number | null;
  maandbedrag: number | null;
  opmerkingen: string | null;
}

interface Vergelijking {
  concurrent_maandbedrag: number | null;
  smartlease_maandbedrag: number | null;
  besparing_per_maand: number | null;
  besparing_totaal: number | null;
  smartlease_params: {
    looptijd: number;
    aanbetaling_pct: number;
    slottermijn_pct: number;
    rente_pct: number;
  };
}

const SUPABASE_URL = 'https://bcjbghqrdlzwxgfuuxss.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjamJnaHFyZGx6d3hnZnV1eHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1NjY0MDAsImV4cCI6MjA1NjE0MjQwMH0.xMEbRBnMGSGn1OycpY4cDJSIGWfAFVSfnQMkuLiZcI8';

function formatEuro(amount: number | null): string {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
}

function formatNumber(n: number | null): string {
  if (n === null || n === undefined) return '—';
  return new Intl.NumberFormat('nl-NL').format(n);
}

export function OfferteVergelijkerPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const [offerte, setOfferte] = useState<OfferteData | null>(null);
  const [vergelijking, setVergelijking] = useState<Vergelijking | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [leadSaved, setLeadSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setStep('analyzing');
    setAnalyzeProgress(0);

    // Animate progress
    const interval = setInterval(() => {
      setAnalyzeProgress(p => Math.min(p + Math.random() * 15, 85));
    }, 400);

    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch(`${SUPABASE_URL}/functions/v1/analyze-offerte`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ fileData: base64, mimeType: file.type }),
      });

      clearInterval(interval);
      setAnalyzeProgress(100);

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Er ging iets mis');
      }

      const data = await response.json();
      setOfferte(data.offerte);
      setVergelijking(data.vergelijking);

      setTimeout(() => setStep('result'), 500);
    } catch (err) {
      clearInterval(interval);
      setErrorMsg(err instanceof Error ? err.message : 'Er ging iets mis bij de analyse');
      setStep('error');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleAanvragen = async () => {
    // Save lead
    if (!leadSaved && offerte) {
      try {
        await supabase.from('leads').insert({
          bron: 'offerte_vergelijker',
          voertuig_info: offerte.merk && offerte.model ? `${offerte.merk} ${offerte.model}` : null,
          vergelijker_data: offerte,
          concurrent_aanbieder: offerte.aanbieder,
          concurrent_maandbedrag: vergelijking?.concurrent_maandbedrag,
          smartlease_maandbedrag: vergelijking?.smartlease_maandbedrag,
          besparing_per_maand: vergelijking?.besparing_per_maand,
          status: 'nieuw',
        });
        setLeadSaved(true);
      } catch { /* silent */ }
    }

    // Navigate to offerte with prefilled data
    const params = new URLSearchParams();
    if (offerte?.merk) params.set('merk', offerte.merk);
    if (offerte?.model) params.set('model', offerte.model);
    navigate(`/offerte?${params.toString()}`);
  };

  const besparing = vergelijking?.besparing_per_maand ?? 0;
  const besparingPositief = besparing > 0;
  const besparingNeutraal = besparing === 0 || besparing === null;

  return (
    <main className="min-h-screen bg-[#f8f9fb]">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="flex items-center gap-2 text-smartlease-teal text-sm font-semibold mb-4">
            <Zap className="h-4 w-4" />
            <span>AI-gestuurde analyse</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-4">
            Betaal je te veel<br />
            <span className="text-smartlease-teal">voor je financial lease?</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl">
            Upload je huidige offerte en ontvang binnen 10 seconden een eerlijke vergelijking. Geen verplichtingen.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-4 mt-6">
            {[
              { icon: Shield, text: 'Veilig & privé' },
              { icon: Zap, text: 'Resultaat in 10 sec' },
              { icon: Star, text: '4,9 ★ beoordeling' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-sm text-gray-500">
                <Icon className="h-4 w-4 text-smartlease-teal" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* STAP 1: Upload */}
        {step === 'upload' && (
          <div className="space-y-6">
            {/* Upload zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 p-12 md:p-16 flex flex-col items-center justify-center text-center ${
                dragOver
                  ? 'border-smartlease-teal bg-smartlease-teal/5 scale-[1.01]'
                  : 'border-gray-300 bg-white hover:border-smartlease-teal hover:bg-smartlease-teal/3'
              }`}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-colors ${dragOver ? 'bg-smartlease-teal text-white' : 'bg-smartlease-teal/10 text-smartlease-teal'}`}>
                <Upload className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Sleep je offerte hierheen
              </h3>
              <p className="text-gray-400 text-sm mb-4">of klik om een bestand te kiezen</p>
              <div className="flex items-center gap-2">
                <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full font-medium">PDF</span>
                <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full font-medium">JPG</span>
                <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full font-medium">PNG</span>
              </div>
            </div>

            {/* How it works */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
              <h3 className="font-bold text-gray-800 mb-5 text-lg">Hoe werkt het?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { step: '1', title: 'Upload je offerte', desc: 'Foto of PDF van je huidige financial lease offerte' },
                  { step: '2', title: 'AI analyseert', desc: 'Onze AI leest alle details uit en berekent ons aanbod' },
                  { step: '3', title: 'Zie je besparing', desc: 'Direct zien wat jij kunt besparen bij Smartlease.nl' },
                ].map(({ step: s, title, desc }) => (
                  <div key={s} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-smartlease-teal text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                      {s}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{title}</p>
                      <p className="text-gray-400 text-sm mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy note */}
            <p className="text-center text-xs text-gray-400">
              <Shield className="h-3.5 w-3.5 inline mr-1" />
              Je offerte wordt alleen gebruikt voor deze vergelijking en nooit gedeeld met derden.
            </p>
          </div>
        )}

        {/* STAP 2: Analyzing */}
        {step === 'analyzing' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 md:p-16 flex flex-col items-center text-center">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full bg-smartlease-teal/10 animate-ping" />
              <div className="relative w-20 h-20 rounded-full bg-smartlease-teal/10 flex items-center justify-center">
                <FileText className="h-9 w-9 text-smartlease-teal" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-2">Offerte wordt geanalyseerd...</h3>
            <p className="text-gray-400 text-sm mb-1">{fileName}</p>
            <p className="text-gray-400 text-sm mb-8">Onze AI leest alle details uit je offerte</p>

            {/* Progress bar */}
            <div className="w-full max-w-sm bg-gray-100 rounded-full h-2 mb-3">
              <div
                className="bg-smartlease-teal h-2 rounded-full transition-all duration-500"
                style={{ width: `${analyzeProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400">{Math.round(analyzeProgress)}%</p>

            <div className="mt-8 space-y-2 text-sm text-gray-400">
              {analyzeProgress > 20 && <p className="animate-fade-in">✓ Bestand ontvangen</p>}
              {analyzeProgress > 40 && <p className="animate-fade-in">✓ Gegevens worden gelezen...</p>}
              {analyzeProgress > 65 && <p className="animate-fade-in">✓ Bedragen worden geëxtraheerd...</p>}
              {analyzeProgress > 80 && <p className="animate-fade-in">✓ Vergelijking wordt berekend...</p>}
            </div>
          </div>
        )}

        {/* STAP 3: Resultaat */}
        {step === 'result' && offerte && vergelijking && (
          <div className="space-y-6">
            {/* Besparing banner */}
            <div className={`rounded-2xl p-6 md:p-8 ${
              besparingPositief
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                : besparingNeutraal
                ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
            }`}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                    {besparingPositief ? <TrendingDown className="h-7 w-7" /> :
                     besparingNeutraal ? <Minus className="h-7 w-7" /> :
                     <TrendingUp className="h-7 w-7" />}
                  </div>
                  <div>
                    {besparingPositief ? (
                      <>
                        <p className="text-white/80 text-sm font-medium">Jij bespaart</p>
                        <p className="text-3xl font-bold">{formatEuro(besparing)} per maand</p>
                        {vergelijking.besparing_totaal && (
                          <p className="text-white/70 text-sm mt-0.5">
                            {formatEuro(vergelijking.besparing_totaal)} totaal over de looptijd
                          </p>
                        )}
                      </>
                    ) : besparingNeutraal ? (
                      <>
                        <p className="text-white/80 text-sm font-medium">Vergelijkbaar aanbod</p>
                        <p className="text-2xl font-bold">Onze prijs is gelijk</p>
                        <p className="text-white/70 text-sm mt-0.5">Maar wij bieden meer service & zekerheid</p>
                      </>
                    ) : (
                      <>
                        <p className="text-white/80 text-sm font-medium">Hun aanbod is goedkoper</p>
                        <p className="text-2xl font-bold">{formatEuro(Math.abs(besparing))} per maand</p>
                        <p className="text-white/70 text-sm mt-0.5">Maar check onze service & voorwaarden</p>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleAanvragen}
                  className="flex-shrink-0 bg-white text-gray-800 font-bold px-6 py-3.5 rounded-xl hover:bg-gray-50 transition flex items-center gap-2 shadow-lg"
                >
                  Vraag onze offerte aan
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Vergelijking tabel */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-5 md:p-6 border-b border-gray-100">
                <h3 className="font-bold text-gray-800 text-lg">Gedetailleerde vergelijking</h3>
                <p className="text-gray-400 text-sm mt-0.5">
                  {offerte.merk && offerte.model ? `${offerte.merk} ${offerte.model}` : 'Uw voertuig'}
                  {offerte.uitvoering ? ` — ${offerte.uitvoering}` : ''}
                </p>
              </div>

              <div className="grid grid-cols-3 text-sm">
                {/* Header */}
                <div className="p-4 bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">Onderdeel</div>
                <div className="p-4 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-l border-gray-100">
                  {offerte.aanbieder || 'Huidige aanbieder'}
                </div>
                <div className="p-4 bg-smartlease-teal/5 text-xs font-bold text-smartlease-teal uppercase tracking-wider border-l border-gray-100">
                  Smartlease.nl
                </div>

                {/* Maandbedrag */}
                <div className="p-4 text-gray-500 border-t border-gray-50 flex items-center">Maandbedrag</div>
                <div className="p-4 font-semibold text-gray-800 border-t border-gray-50 border-l border-gray-100">
                  {formatEuro(vergelijking.concurrent_maandbedrag)}
                </div>
                <div className={`p-4 font-bold border-t border-gray-50 border-l border-gray-100 ${besparingPositief ? 'text-emerald-600' : 'text-gray-800'}`}>
                  {formatEuro(vergelijking.smartlease_maandbedrag)}
                </div>

                {/* Rente */}
                <div className="p-4 text-gray-500 border-t border-gray-50 flex items-center">Rente</div>
                <div className="p-4 text-gray-800 border-t border-gray-50 border-l border-gray-100">
                  {offerte.rente_percentage ? `${offerte.rente_percentage}%` : '—'}
                </div>
                <div className="p-4 text-emerald-600 font-semibold border-t border-gray-50 border-l border-gray-100">
                  8,99%
                </div>

                {/* Looptijd */}
                <div className="p-4 text-gray-500 border-t border-gray-50">Looptijd</div>
                <div className="p-4 text-gray-800 border-t border-gray-50 border-l border-gray-100">
                  {offerte.looptijd_maanden ? `${offerte.looptijd_maanden} mnd` : '—'}
                </div>
                <div className="p-4 text-gray-800 border-t border-gray-50 border-l border-gray-100">72 mnd</div>

                {/* Aanbetaling */}
                <div className="p-4 text-gray-500 border-t border-gray-50">Aanbetaling</div>
                <div className="p-4 text-gray-800 border-t border-gray-50 border-l border-gray-100">
                  {offerte.aanbetaling_percentage ? `${offerte.aanbetaling_percentage}%` : offerte.aanbetaling ? formatEuro(offerte.aanbetaling) : '—'}
                </div>
                <div className="p-4 text-gray-800 border-t border-gray-50 border-l border-gray-100">15%</div>

                {/* Slottermijn */}
                <div className="p-4 text-gray-500 border-t border-gray-50">Slottermijn</div>
                <div className="p-4 text-gray-800 border-t border-gray-50 border-l border-gray-100">
                  {offerte.slottermijn_percentage ? `${offerte.slottermijn_percentage}%` : offerte.slottermijn ? formatEuro(offerte.slottermijn) : '—'}
                </div>
                <div className="p-4 text-gray-800 border-t border-gray-50 border-l border-gray-100">10%</div>

                {/* Verkoopprijs */}
                {offerte.verkoopprijs && (
                  <>
                    <div className="p-4 text-gray-500 border-t border-gray-50">Voertuigprijs</div>
                    <div className="p-4 text-gray-800 border-t border-gray-50 border-l border-gray-100 col-span-2">
                      {formatEuro(offerte.verkoopprijs)}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* CTA sectie */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
              <h3 className="font-bold text-gray-800 text-lg mb-1">Interesse in ons aanbod?</h3>
              <p className="text-gray-400 text-sm mb-6">Vraag direct een persoonlijke offerte aan of neem contact op.</p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAanvragen}
                  className="flex-1 bg-smartlease-teal hover:bg-teal-500 text-white font-bold px-6 py-3.5 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  Gratis offerte aanvragen
                </button>
                <a
                  href="tel:0858008600"
                  className="flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-5 py-3.5 rounded-xl transition text-sm"
                >
                  <Phone className="h-4 w-4" />
                  085 - 80 08 600
                </a>
                <a
                  href="https://wa.me/31613669328"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-gray-200 hover:border-green-300 text-gray-700 hover:text-green-600 font-semibold px-5 py-3.5 rounded-xl transition text-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Opnieuw uploaden */}
            <div className="text-center">
              <button
                onClick={() => { setStep('upload'); setOfferte(null); setVergelijking(null); setFileName(''); }}
                className="text-sm text-gray-400 hover:text-gray-600 transition flex items-center gap-1.5 mx-auto"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Andere offerte uploaden
              </button>
            </div>
          </div>
        )}

        {/* STAP 4: Error */}
        {step === 'error' && (
          <div className="bg-white rounded-2xl border border-red-100 p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <X className="h-7 w-7 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Analyse mislukt</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">{errorMsg}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => { setStep('upload'); setErrorMsg(''); }}
                className="bg-smartlease-teal text-white font-bold px-6 py-3 rounded-xl hover:bg-teal-500 transition flex items-center gap-2 justify-center"
              >
                <RefreshCw className="h-4 w-4" />
                Opnieuw proberen
              </button>
              <a
                href="tel:0858008600"
                className="border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:border-gray-300 transition flex items-center gap-2 justify-center text-sm"
              >
                <Phone className="h-4 w-4" />
                Bel ons direct
              </a>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}