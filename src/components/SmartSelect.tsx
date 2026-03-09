import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

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
}

export function SmartSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  icon,
}: SmartSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? '';

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  const isActive = !!value;

  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={[
          'group relative w-full flex items-center gap-2.5 px-4 rounded-xl border text-left',
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
        {/* Icon */}
        {icon && (
          <span className={`flex-shrink-0 transition-colors duration-200 ${isActive || open ? 'text-smartlease-teal' : 'text-gray-400'}`}>
            {icon}
          </span>
        )}

        {/* Label + value stacked, fixed height, no layout shift */}
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

        {/* Chevron */}
        <ChevronDown
          className={`flex-shrink-0 h-4 w-4 transition-all duration-300 ${
            open ? 'rotate-180 text-smartlease-teal' : 'text-gray-400'
          }`}
        />
      </button>

      {/* Dropdown panel */}
      {open && !disabled && (
        <div
          className="absolute left-0 right-0 z-50 mt-2 bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-gray-200/80 overflow-hidden"
          style={{
            animation: 'smartSelectOpen 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <style>{`
            @keyframes smartSelectOpen {
              from { opacity: 0; transform: translateY(-6px) scale(0.98); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>

          <ul className="max-h-64 overflow-y-auto py-1.5" role="listbox">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li key={opt.value} role="option" aria-selected={isSelected}>
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
                    {isSelected && <Check className="h-3.5 w-3.5 flex-shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}