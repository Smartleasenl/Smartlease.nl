import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';

export interface CalculatorState {
  looptijd: number;
  aanbetaling: number;
  maandbedrag: number;
  slottermijn: number;
}

interface LeaseCalculatorProps {
  vehiclePrice: number;
  onChange?: (state: CalculatorState) => void;
}

const DURATION_OPTIONS = [12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72];

const MAX_RESIDUAL_PERCENTAGES: Record<number, number> = {
  12: 0.60,
  18: 0.55,
  24: 0.50,
  30: 0.475,
  36: 0.45,
  42: 0.40,
  48: 0.35,
  54: 0.30,
  60: 0.25,
  66: 0.20,
  72: 0.15,
};

export function LeaseCalculator({ vehiclePrice, onChange }: LeaseCalculatorProps) {
  const [downPayment, setDownPayment] = useState(vehiclePrice * 0.15);
  const [duration, setDuration] = useState(72);
  const [residualValue, setResidualValue] = useState(vehiclePrice * 0.15);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  const maxResidualValue = vehiclePrice * (MAX_RESIDUAL_PERCENTAGES[duration] || 0.15);

  useEffect(() => {
    if (residualValue > maxResidualValue) {
      setResidualValue(maxResidualValue);
    }
  }, [duration, maxResidualValue]);

  useEffect(() => {
    const r = 8.99 / 100 / 12;
    const loan = vehiclePrice - downPayment;
    const n = duration;

    if (r === 0) {
      setMonthlyPayment((loan - residualValue) / n);
      return;
    }

    const pmt = (loan * r * Math.pow(1 + r, n) - residualValue * r) / (Math.pow(1 + r, n) - 1);
    setMonthlyPayment(pmt);
  }, [vehiclePrice, downPayment, duration, residualValue]);

  useEffect(() => {
    if (onChange) {
      onChange({
        looptijd: duration,
        aanbetaling: Math.round(downPayment),
        maandbedrag: Math.round(monthlyPayment),
        slottermijn: Math.round(residualValue),
      });
    }
  }, [duration, downPayment, monthlyPayment, residualValue, onChange]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const downPaymentPercent = Math.round((downPayment / vehiclePrice) * 100);
  const residualValuePercent = ((residualValue / vehiclePrice) * 100).toFixed(1);
  const maxResidualPercent = (MAX_RESIDUAL_PERCENTAGES[duration] * 100).toFixed(1);

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4 text-smartlease-teal">
        <Calculator className="h-5 w-5" />
        <h3 className="font-bold">Financial Lease Calculator</h3>
      </div>
      <p className="text-xs text-gray-600 mb-6">Bereken je maandbedrag</p>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Autoprijs</label>
            <span className="text-sm font-semibold">{formatPrice(vehiclePrice)}</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Aanbetaling</label>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold">€</span>
              <input
                type="number"
                value={Math.round(downPayment)}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded text-right"
              />
              <span className="text-sm font-semibold">{downPaymentPercent}%</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max={vehiclePrice * 0.5}
            step="100"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-smartlease-blue"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Looptijd (maanden)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {DURATION_OPTIONS.map((months) => (
              <button
                key={months}
                onClick={() => setDuration(months)}
                className={`py-2 px-3 text-sm font-semibold rounded-lg transition ${
                  duration === months
                    ? 'bg-smartlease-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {months}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Slottermijn (restwaarde)</label>
            <div className="flex items-center space-x-2">
              <span className="text-sm">€</span>
              <input
                type="number"
                value={Math.round(residualValue)}
                onChange={(e) => {
                  const value = Math.min(Number(e.target.value), maxResidualValue);
                  setResidualValue(value);
                }}
                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded text-right"
              />
              <span className="text-sm font-semibold">{residualValuePercent}%</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max={maxResidualValue}
            step="1"
            value={residualValue}
            onChange={(e) => setResidualValue(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-smartlease-blue"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>€ 0</span>
            <span>Max: {formatPrice(maxResidualValue)} ({maxResidualPercent}%)</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-smartlease-blue to-blue-700 text-white rounded-lg p-6 text-center">
          <p className="text-sm mb-2">Maandtermijn</p>
          <p className="text-4xl font-bold">€ {Math.round(monthlyPayment)}</p>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Indicatieve berekening.
        </p>
      </div>
    </div>
  );
}