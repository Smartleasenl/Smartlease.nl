import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { vehicleApi } from '../services/api';
import { supabase } from '../lib/supabase';
import type { FiltersResponse, ModelOption } from '../types/vehicle';

interface SiteSettings {
  [key: string]: string;
}

function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>({});
  useEffect(() => {
    supabase.from('site_settings').select('key,value').then(({ data }) => {
      if (data) {
        const map: SiteSettings = {};
        data.forEach(({ key, value }: { key: string; value: string }) => {
          map[key] = value;
        });
        setSettings(map);
      }
    });
  }, []);
  return settings;
}

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current || target <= 0) return;
    hasAnimated.current = true;
    const duration = 2000;
    const steps = 80;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      if (step >= steps) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return <>{count.toLocaleString('nl-NL')}</>;
}

const popularBrands = [
  { name: 'BMW', logo: 'https://www.carlogos.org/car-logos/bmw-logo.png' },
  { name: 'Mercedes-Benz', short: 'Mercedes', logo: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png' },
  { name: 'Audi', logo: 'https://www.carlogos.org/car-logos/audi-logo.png' },
  { name: 'Volkswagen', short: 'VW', logo: 'https://www.carlogos.org/car-logos/volkswagen-logo.png' },
  { name: 'Toyota', logo: 'https://www.carlogos.org/car-logos/toyota-logo.png' },
  { name: 'Volvo', logo: 'https://www.carlogos.org/car-logos/volvo-logo.png' },
];

interface Suggestion {
  type: 'merk' | 'model';
  merk: string;
  model?: string;
  label: string;
  sublabel?: string;
}

export function Hero() {
  const navigate = useNavigate();
  const siteSettings = useSiteSettings();

  const [filters, setFilters] = useState<FiltersResponse | null>(null);
  const [selectedMerk, setSelectedMerk] = useState('');
  const [models, setModels] = useState<ModelOption[]>([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const modelCache = useRef<Record<string, ModelOption[]>>({});
  const searchRef = useRef<HTMLDivElement>(null);

  const heroTitle    = siteSettings['hero_title']    || 'Slimmer leasen begint hier';
  const heroSubtitle = siteSettings['hero_subtitle'] || '';

  useEffect(() => {
    vehicleApi.getFilters().then(setFilters);
    vehicleApi.search({ per_page: 1 }).then((data) => setTotalCount(data.total));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadModels = async (merk: string): Promise<ModelOption[]> => {
    if (modelCache.current[merk]) return modelCache.current[merk];
    const result = await vehicleApi.getModels(merk);
    modelCache.current[merk] = result;
    return result;
  };

  useEffect(() => {
    const q = searchQuery.trim();
    if (!q || !filters) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const qLower = q.toLowerCase();

    const buildSuggestions = async () => {
      const results: Suggestion[] = [];
      const sortedMerken = [...filters.merken].sort((a, b) => b.length - a.length);

      let matchedMerk: string | null = null;
      let modelQuery = '';

      for (const merk of sortedMerken) {
        if (qLower.startsWith(merk.toLowerCase())) {
          matchedMerk = merk;
          modelQuery = q.slice(merk.length).trim();
          break;
        }
      }

      if (matchedMerk && modelQuery) {
        const merkModels = await loadModels(matchedMerk);
        const filtered = merkModels.filter((m) =>
          m.model.toLowerCase().includes(modelQuery.toLowerCase())
        );
        filtered.slice(0, 7).forEach((m) => {
          results.push({
            type: 'model',
            merk: matchedMerk!,
            model: m.model,
            label: `${matchedMerk} ${m.model}`,
            sublabel: `${m.count} auto's`,
          });
        });
        if (results.length === 0) {
          results.push({
            type: 'merk',
            merk: matchedMerk,
            label: matchedMerk,
            sublabel: 'Alle modellen',
          });
        }
      } else if (matchedMerk && !modelQuery) {
        results.push({
          type: 'merk',
          merk: matchedMerk,
          label: matchedMerk,
          sublabel: 'Alle modellen',
        });
        const merkModels = await loadModels(matchedMerk);
        merkModels.slice(0, 5).forEach((m) => {
          results.push({
            type: 'model',
            merk: matchedMerk!,
            model: m.model,
            label: `${matchedMerk} ${m.model}`,
            sublabel: `${m.count} auto's`,
          });
        });
      } else {
        const matchedMerken = sortedMerken.filter((m) =>
          m.toLowerCase().includes(qLower)
        );
        matchedMerken.slice(0, 6).forEach((merk) => {
          results.push({
            type: 'merk',
            merk,
            label: merk,
            sublabel: 'Alle modellen',
          });
        });
      }

      setSuggestions(results.slice(0, 8));
      setShowSuggestions(results.length > 0);
      setActiveSuggestion(-1);
    };

    buildSuggestions();
  }, [searchQuery, filters]);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setShowSuggestions(false);
    if (suggestion.type === 'merk') {
      setSearchQuery(suggestion.merk);
      setSelectedMerk(suggestion.merk);
      setSelectedModel('');
      loadModels(suggestion.merk).then(setModels);
    } else {
      setSearchQuery(`${suggestion.merk} ${suggestion.model}`);
      setSelectedMerk(suggestion.merk);
      setSelectedModel(suggestion.model || '');
      loadModels(suggestion.merk).then(setModels);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedMerk) {
      params.append('merk', selectedMerk);
    } else if (searchQuery.trim()) {
      params.append('q', searchQuery.trim());
    }
    if (selectedModel) params.append('model', selectedModel);
    if (selectedBudget) {
      const [min, max] = selectedBudget.split('-');
      if (min) params.append('budget_min', min);
      if (max) params.append('budget_max', max);
    }
    navigate(`/aanbod?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
        handleSuggestionClick(suggestions[activeSuggestion]);
      } else {
        setShowSuggestions(false);
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedMerk('');
    setSelectedModel('');
    setModels([]);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleBrandClick = (brand: string) => {
    navigate(`/aanbod?merk=${encodeURIComponent(brand)}`);
  };

  return (
    <div className="relative bg-gradient-to-b from-[#e8f6f5] via-[#f0faf9] to-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,180,160,0.08)_0%,_transparent_70%)]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 lg:py-16">
        <div className="max-w-4xl mx-auto text-center">

          {/* Titel uit site_settings */}
<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 leading-tight tracking-tight text-gray-900">
  {(() => {
    const words = heroTitle.split(' ');
    const tealCount = 2;
    const darkWords = words.slice(0, words.length - tealCount).join(' ');
    const tealWords = words.slice(words.length - tealCount).join(' ');
    return (
      <>
        {darkWords}{' '}
        <span className="text-smartlease-teal">{tealWords}</span>
      </>
    );
  })()}
</h1>

          <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Zoek in onze{' '}
            <span className="text-smartlease-teal font-bold tabular-nums">
              {totalCount !== null && totalCount > 0 ? (
                <AnimatedCounter target={totalCount} />
              ) : (
                <span className="animate-pulse text-gray-400">···</span>
              )}
            </span>{' '}
            auto's
          </p>

          {/* Search form */}
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-xl border border-gray-100">

            {/* Zoekbalk met suggesties */}
            <div className="relative mb-3" ref={searchRef}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Zoek op merk of model, bijv. Audi Q5..."
                className="w-full pl-11 pr-10 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 font-medium focus:ring-2 focus:ring-smartlease-teal focus:border-smartlease-teal transition-all"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Suggesties dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden text-left">
                  {suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0 ${
                        i === activeSuggestion ? 'bg-teal-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <Search className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-sm font-medium ${
                            i === activeSuggestion ? 'text-smartlease-teal' : 'text-gray-800'
                          }`}
                        >
                          {suggestion.label}
                        </span>
                      </div>
                      {suggestion.sublabel && (
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {suggestion.sublabel}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filters + zoekknop */}
            <div className="flex flex-col md:flex-row items-stretch gap-3">
              <select
                value={selectedMerk}
                onChange={(e) => {
                  const merk = e.target.value;
                  setSelectedMerk(merk);
                  setSearchQuery(merk);
                  setSelectedModel('');
                  if (merk) loadModels(merk).then(setModels);
                  else setModels([]);
                }}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-900 bg-white font-medium focus:ring-2 focus:ring-smartlease-teal focus:border-smartlease-teal transition-all appearance-none cursor-pointer hover:border-gray-400"
              >
                <option value="">Alle merken</option>
                {filters?.merken.map((merk) => (
                  <option key={merk} value={merk}>{merk}</option>
                ))}
              </select>

              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={!selectedMerk || models.length === 0}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-900 bg-white font-medium focus:ring-2 focus:ring-smartlease-teal focus:border-smartlease-teal transition-all appearance-none cursor-pointer hover:border-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">Alle modellen</option>
                {models.map((model) => (
                  <option key={model.model} value={model.model}>
                    {model.model} ({model.count})
                  </option>
                ))}
              </select>

              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-900 bg-white font-medium focus:ring-2 focus:ring-smartlease-teal focus:border-smartlease-teal transition-all appearance-none cursor-pointer hover:border-gray-400"
              >
                <option value="">Maandbudget</option>
                <option value="0-99">€0 - €99 p/m</option>
                <option value="100-199">€100 - €199 p/m</option>
                <option value="200-299">€200 - €299 p/m</option>
                <option value="300-399">€300 - €399 p/m</option>
                <option value="400-499">€400 - €499 p/m</option>
                <option value="500-699">€500 - €699 p/m</option>
                <option value="700-899">€700 - €899 p/m</option>
                <option value="800-999">€800 - €999 p/m</option>
                <option value="1000-">€1000+ p/m</option>
              </select>

              <button
                onClick={handleSearch}
                className="bg-smartlease-teal hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
              >
                <Search className="h-5 w-5" />
                <span>Vinden</span>
              </button>
            </div>
          </div>

          {/* Popular brands */}
          <div className="mt-8">
            <p className="text-sm text-gray-400 mb-4 font-medium uppercase tracking-wider">
              Populaire merken
            </p>
            <div className="flex flex-wrap justify-center gap-2.5 md:gap-3">
              {popularBrands.map((brand) => (
                <button
                  key={brand.name}
                  onClick={() => handleBrandClick(brand.name)}
                  className="flex items-center space-x-2 bg-white hover:bg-gray-50 border border-gray-200 hover:border-smartlease-teal rounded-full px-4 py-2 md:px-5 md:py-2.5 transition-all duration-200 group shadow-sm hover:shadow-md"
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-5 w-5 md:h-6 md:w-6 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                  <span className="text-sm font-medium text-gray-600 group-hover:text-smartlease-teal transition-colors">
                    {brand.short || brand.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}