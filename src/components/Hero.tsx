import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { vehicleApi } from '../services/api';
import type { FiltersResponse, ModelOption } from '../types/vehicle';

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

export function Hero() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FiltersResponse | null>(null);
  const [selectedMerk, setSelectedMerk] = useState('');
  const [models, setModels] = useState<ModelOption[]>([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [totalCount, setTotalCount] = useState<number | null>(null);

  useEffect(() => {
    vehicleApi.getFilters().then(setFilters);
    vehicleApi.search({ per_page: 1 }).then((data) => setTotalCount(data.total));
  }, []);

  useEffect(() => {
    if (selectedMerk) {
      vehicleApi.getModels(selectedMerk).then(setModels);
    } else {
      setModels([]);
      setSelectedModel('');
    }
  }, [selectedMerk]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('q', searchQuery.trim());
    if (selectedMerk) params.append('merk', selectedMerk);
    if (selectedModel) params.append('model', selectedModel);
    if (selectedBudget) {
      const [min, max] = selectedBudget.split('-');
      if (min) params.append('budget_min', min);
      if (max) params.append('budget_max', max);
    }
    navigate(`/aanbod?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleBrandClick = (brand: string) => {
    navigate(`/aanbod?merk=${encodeURIComponent(brand)}`);
  };

  return (
    <div className="relative bg-gradient-to-b from-[#e8f6f5] via-[#f0faf9] to-white overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,180,160,0.08)_0%,_transparent_70%)]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight tracking-tight text-gray-900">
            Slimmer leasen <span className="text-smartlease-teal">begint hier</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Zoek in onze{' '}
            <span className="text-smartlease-teal font-bold tabular-nums">
              {totalCount !== null && totalCount > 0
                ? <AnimatedCounter target={totalCount} />
                : <span className="animate-pulse text-gray-400">···</span>
              }
            </span>
            {' '}auto's
          </p>

          {/* Search form */}
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-xl border border-gray-100">

            {/* Tekstzoekbalk bovenaan — volle breedte */}
            <div className="relative mb-3">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Zoek op merk, model, uitvoering..."
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 font-medium focus:ring-2 focus:ring-smartlease-teal focus:border-smartlease-teal transition-all"
              />
            </div>

            {/* Filters + zoekknop */}
            <div className="flex flex-col md:flex-row items-stretch gap-3">
              <select
                value={selectedMerk}
                onChange={(e) => setSelectedMerk(e.target.value)}
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
            <p className="text-sm text-gray-400 mb-4 font-medium uppercase tracking-wider">Populaire merken</p>
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