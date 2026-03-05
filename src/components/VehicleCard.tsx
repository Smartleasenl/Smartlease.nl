import { useState } from 'react';
import { Gauge, Fuel, Zap, Settings2, Car } from 'lucide-react';
import type { Vehicle } from '../types/vehicle';
import { proxyThumb } from '../utils/imageProxy';

interface VehicleCardProps {
  vehicle: Vehicle;
  onClick: () => void;
}

function CarPlaceholder({ merk, model }: { merk: string; model: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 select-none">
      <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-3">
        <Car className="h-8 w-8 text-smartlease-teal opacity-60" />
      </div>
      <p className="text-xs font-semibold text-gray-400 text-center px-4 truncate max-w-full">
        {merk} {model}
      </p>
      <p className="text-[10px] text-gray-300 mt-0.5">Geen foto beschikbaar</p>
    </div>
  );
}

export function VehicleCard({ vehicle, onClick }: VehicleCardProps) {
  const [imgError, setImgError] = useState(false);

  const formatPrice = (price: number) => {
    if (price === 0) return 'Prijs op aanvraag';
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatKm = (km: number) => {
    return new Intl.NumberFormat('nl-NL').format(km) + ' km';
  };

  const imageUrl = vehicle.external_id
    ? proxyThumb(vehicle.external_id)
    : vehicle.small_picture || null;

  const showPlaceholder = !imageUrl || imgError;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-gray-200/60 cursor-pointer group border border-gray-100 hover:border-teal-200 transition-all duration-500 ease-out"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio: '16/10' }}>
        {showPlaceholder ? (
          <CarPlaceholder merk={vehicle.merk} model={vehicle.model} />
        ) : (
          <>
            <img
              src={imageUrl!}
              alt={`${vehicle.merk} ${vehicle.model}`}
              className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
              loading="lazy"
              onError={() => setImgError(true)}
            />
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </>
        )}

        {/* Year badge */}
        {vehicle.bouwjaar_year && (
          <span className="absolute top-3 left-3 bg-smartlease-teal text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg shadow-teal-500/30 tracking-wide">
            {vehicle.bouwjaar_year}
          </span>
        )}

        {/* BTW badge */}
        {vehicle.btw_marge && (
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
            {vehicle.btw_marge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        {/* Title */}
        <div className="mb-3">
          <h3 className="text-base font-bold text-gray-900 mb-0.5 group-hover:text-smartlease-blue transition-colors duration-300">
            {vehicle.merk} {vehicle.model}
          </h3>
          <p className="text-gray-400 text-sm truncate">{vehicle.uitvoering}</p>
        </div>

        {/* Price */}
        <div className="mb-4">
          {vehicle.maandprijs > 0 ? (
            <>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                  € {vehicle.maandprijs},-
                </span>
                <span className="text-sm text-gray-400 font-medium">p/m</span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                {formatPrice(vehicle.verkoopprijs)}
              </div>
            </>
          ) : (
            <div className="text-xl font-bold text-gray-900">
              {formatPrice(vehicle.verkoopprijs)}
            </div>
          )}
        </div>

        {/* Spec pills */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 px-2.5 py-2 bg-gray-50 rounded-xl">
            <Gauge className="h-3.5 w-3.5 text-smartlease-teal flex-shrink-0" />
            <span className="text-xs text-gray-600 font-medium truncate">{formatKm(vehicle.kmstand)}</span>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-2 bg-gray-50 rounded-xl">
            <Zap className="h-3.5 w-3.5 text-smartlease-teal flex-shrink-0" />
            <span className="text-xs text-gray-600 font-medium">{vehicle.vermogen} pk</span>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-2 bg-gray-50 rounded-xl">
            <Fuel className="h-3.5 w-3.5 text-smartlease-teal flex-shrink-0" />
            <span className="text-xs text-gray-600 font-medium">{vehicle.brandstof}</span>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-2 bg-gray-50 rounded-xl">
            <Settings2 className="h-3.5 w-3.5 text-smartlease-teal flex-shrink-0" />
            <span className="text-xs text-gray-600 font-medium">{vehicle.transmissie}</span>
          </div>
        </div>
      </div>
    </div>
  );
}