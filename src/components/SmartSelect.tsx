import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SmartSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  popularValues?: string[];
  searchable?: boolean;
}

export function SmartSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  icon,
  popularValues,
  searchable = false,
}: SmartSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? '';
  const isActive = !!value;

  const emptyOption = options.find((o) => o.value === '');
  const allOptions = options.filter((o) => o.value !== '');

  const filtered = query.trim()
    ? allOptions.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : allOptions;

  const popularOptions = popularValues && !query.trim()
    ? allOptions.filter((o) => popularValues.includes(o.value))
    : [];

  const mainOptions = popularOptions.length > 0
    ? filtered.filter((o) => !popularValues?.includes(o.value))
    : filtered;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open && searchable) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    if (!open) setQuery('');
  }, [open, searchable]);

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
    setQuery('');
  };

  const OptionRow = ({ opt }: { opt: Option }) => {
    const isSelected = opt.value === value;
    return (
      <li role="option" aria-selected={isSelected}>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleSelect(opt.value)}
          className={[
            'w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors duration-100',
            isSelected
              ? 'bg-teal-50 text-smartlease-teal font-semibold'
              : 'text-gray-700 hover:bg-gray-50 font-medium',
          ].join(' ')}
        >
          <span>{opt.label}</span>
          {isSelected && <Check className="h-3.5 w-3.5 flex-shrink-0 text-smartlease-teal" />}
        </button>
      </li>
    );
  };

  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={[
          'w-full flex items-center gap-2.5 px-4 rounded-xl border text-left',
          'transition-all duration-200 outline-none h-[50px]',
          'bg-white',
          disabled
            ? 'opacity-50 cursor-not-allowed border-gray-100'
            : open
            ? 'border-smartlease-teal ring-2 ring-smartlease-teal/20 shadow-sm'
            : isActive
            ? 'border-smartlease-teal/60 shadow-sm hover:border-smartlease-teal'
            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm',
        ].join(' ')}
      >
        {icon && (
          <span className={`flex-shrink-0 transition-colors duration-200 ${isActive || open ? 'text-smartlease-teal' : 'text-gray-400'}`}>
            {icon}
          </span>
        )}

        <span className="flex-1 min-w-0 flex flex-col justify-center gap-0.5 overflow-hidden">
          <span
            className={[
              'leading-none transition-all duration-200 pointer-events-none whitespace-nowrap',
              isActive || open
                ? 'text-[10px] font-semibold tracking-widest uppercase text-smartlease-teal'
                : 'text-sm font-medium text-gray-400',
            ].join(' ')}
          >
            {placeholder}
          </span>
          {isActive && (
            <span className="text-sm font-semibold text-gray-900 truncate leading-tight">
              {selectedLabel}
            </span>
          )}
        </span>

        <ChevronDown
          className={`flex-shrink-0 h-4 w-4 transition-all duration-300 ${
            open ? 'rotate-180 text-smartlease-teal' : 'text-gray-400'
          }`}
        />
      </button>

      {/* Dropdown panel */}
      {open && !disabled && (
        <div
          className="absolute left-0 z-50 mt-2 bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-gray-200/80 overflow-hidden"
          style={{ animation: 'smartSelectOpen 0.18s cubic-bezier(0.16, 1, 0.3, 1)', minWidth: '280px', width: 'max-content', maxWidth: '360px' }}
        >
          <style>{`
            @keyframes smartSelectOpen {
              from { opacity: 0; transform: translateY(-6px) scale(0.98); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>

          {/* Search input */}
          {searchable && (
            <div className="px-3 pt-3 pb-2 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onMouseDown={(e) => e.stopPropagation()}
                  placeholder={`Zoek ${placeholder.toLowerCase()}...`}
                  className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-smartlease-teal focus:ring-1 focus:ring-smartlease-teal/20 placeholder-gray-400 text-gray-800"
                />
              </div>
            </div>
          )}

          <ul className="max-h-[420px] overflow-y-auto py-1.5" role="listbox">
            {/* "Alle ..." optie */}
            {emptyOption && !query.trim() && <OptionRow opt={emptyOption} />}

            {/* Populair sectie */}
            {popularOptions.length > 0 && (
              <>
                <li className="px-4 pt-2 pb-1">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                    Populair
                  </span>
                </li>
                {popularOptions.map((opt) => (
                  <OptionRow key={`popular-${opt.value}`} opt={opt} />
                ))}
                {mainOptions.length > 0 && (
                  <li className="px-4 pt-3 pb-1 border-t border-gray-50 mt-1">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                      Alle merken
                    </span>
                  </li>
                )}
              </>
            )}

            {/* Hoofdlijst */}
            {mainOptions.map((opt) => (
              <OptionRow key={opt.value} opt={opt} />
            ))}

            {/* Geen resultaten */}
            {query.trim() && filtered.length === 0 && (
              <li className="px-4 py-4 text-sm text-gray-400 text-center">
                Geen resultaten voor "{query}"
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}