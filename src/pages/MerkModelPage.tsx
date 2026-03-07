import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { VehicleCard } from '../components/VehicleCard';
import { Calculator, Phone, ChevronRight, Car } from 'lucide-react';

interface SeoPage {
  merk: string;
  model: string | null;
  seo_title: string;
  seo_description: string;
  h1: string;
  intro_tekst: string;
  body_tekst: string;
  is_published: boolean;
}

interface Vehicle {
  id: string;
  merk: string;
  model: string;
  uitvoering: string;
  bouwjaar: number;
  kilometerstand: number;
  prijs: number;
  lease_prijs?: number;
  brandstof: string;
  transmissie: string;
  foto_urls?: string[];
}

export default function MerkModelPage() {
  const { merk: merkSlug, model: modelSlug } = useParams<{ merk: string; model?: string }>();

  const [seoPage, setSeoPage] = useState<SeoPage | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [vehicleCount, setVehicleCount] = useState(0);

  const merkDisplay = merkSlug
    ? merkSlug.charAt(0).toUpperCase() + merkSlug.slice(1).replace(/-/g, ' ')
    : '';
  const modelDisplay = modelSlug
    ? modelSlug.toUpperCase().replace(/-/g, ' ')
    : '';

  useEffect(() => {
    if (!merkSlug) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
    loadData();
  }, [merkSlug, modelSlug]);

  async function loadData() {
    setLoading(true);
    await Promise.all([loadSeoPage(), loadVehicles()]);
    setLoading(false);
  }

  async function loadSeoPage() {
    let query = supabase
      .from('seo_pages')
      .select('*')
      .eq('slug_merk', merkSlug || '')
      .eq('is_published', true);

    if (modelSlug) {
      query = query.eq('slug_model', modelSlug);
    } else {
      query = query.is('slug_model', null);
    }

    const { data } = await query.maybeSingle();
    setSeoPage(data);
  }

  async function loadVehicles() {
    // %slug% wildcards zodat 'volkswagen' matcht op 'Volkswagen', 'mercedes-benz' op 'Mercedes-Benz' etc.
    const merkFilter = `%${(merkSlug || '').replace(/-/g, '%')}%`;
    const modelFilter = modelSlug ? `%${modelSlug.replace(/-/g, '%')}%` : null;

    let query = supabase
      .from('vehicles')
      .select('id, merk, model, uitvoering, bouwjaar, kilometerstand, prijs, lease_prijs, brandstof, transmissie, foto_urls')
      .eq('is_active', true)
      .ilike('merk', merkFilter)
      .order('prijs', { ascending: true })
      .limit(12);

    if (modelFilter) {
      query = query.ilike('model', modelFilter);
    }

    const { data } = await query;
    setVehicles(data || []);

    // Tel totaal aanbod
    let countQuery = supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .ilike('merk', merkFilter);

    if (modelFilter) {
      countQuery = countQuery.ilike('model', modelFilter);
    }

    const { count: total } = await countQuery;
    setVehicleCount(total || 0);
  }

  const pageTitle = seoPage?.h1 || `${merkDisplay}${modelDisplay ? ' ' + modelDisplay : ''} Financial Lease`;
  const pageIntro = seoPage?.intro_tekst || `Bekijk ons actuele aanbod ${merkDisplay}${modelDisplay ? ' ' + modelDisplay : ''} financial lease occasions. Direct eigenaar, fiscaal voordelig, ook zonder jaarcijfers.`;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <nav className="text-blue-200 text-sm mb-6 flex items-center gap-1 flex-wrap">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/aanbod" className="hover:text-white transition-colors">Aanbod</Link>
            <ChevronRight size={14} />
            <Link to={`/financial-lease/${merkSlug}`} className="hover:text-white transition-colors capitalize">
              {merkDisplay}
            </Link>
            {modelSlug && (
              <>
                <ChevronRight size={14} />
                <span className="text-white">{modelDisplay}</span>
              </>
            )}
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{pageTitle}</h1>
          <p className="text-blue-100 text-lg max-w-3xl leading-relaxed">{pageIntro}</p>

          <div className="flex flex-wrap gap-3 mt-6">
            {['Direct eigenaar', 'Fiscaal voordelig', 'Zonder jaarcijfers', 'Vaste maandprijs'].map((k) => (
              <span key={k} className="bg-blue-800 bg-opacity-60 text-blue-100 text-sm px-3 py-1.5 rounded-full border border-blue-600">
                ✓ {k}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Aanbod */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {loading ? 'Aanbod laden...' : `${vehicleCount} ${merkDisplay}${modelDisplay ? ' ' + modelDisplay : ''} occasions`}
            </h2>
            <p className="text-gray-500 text-sm mt-0.5">Gesorteerd op laagste prijs</p>
          </div>
          <Link
            to={`/aanbod?merk=${merkSlug}`}
            className="text-blue-600 font-medium text-sm hover:underline flex items-center gap-1"
          >
            Bekijk alle {merkDisplay} <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm h-64 animate-pulse" />
            ))}
          </div>
        ) : vehicles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
            {vehicleCount > 12 && (
              <div className="text-center mt-8">
                <Link
                  to={`/aanbod?merk=${encodeURIComponent(merkDisplay)}${modelSlug ? `&model=${encodeURIComponent(modelDisplay)}` : ''}`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                  Bekijk alle {vehicleCount} occasions
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl p-10 text-center shadow-sm">
            <Car size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Momenteel geen {merkDisplay} {modelDisplay} in ons aanbod.</p>
            <Link to="/aanbod" className="mt-4 inline-block text-blue-600 hover:underline text-sm">
              Bekijk ons volledige aanbod →
            </Link>
          </div>
        )}
      </div>

      {/* SEO body tekst — gestyled zonder Tailwind typography plugin */}
      {seoPage?.body_tekst && (
        <div className="bg-white border-t border-gray-100 py-14">
          <div className="max-w-4xl mx-auto px-4">
            <div className="seo-body" dangerouslySetInnerHTML={{ __html: seoPage.body_tekst }} />
          </div>
        </div>
      )}

      <style>{`
        .seo-body h2 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #111827;
          margin-top: 2.25rem;
          margin-bottom: 0.6rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
        }
        .seo-body h2:first-child {
          margin-top: 0;
        }
        .seo-body p {
          color: #4b5563;
          line-height: 1.8;
          margin-bottom: 1rem;
          font-size: 0.975rem;
        }
        .seo-body ul {
          list-style: none;
          padding: 0;
          margin-bottom: 1rem;
        }
        .seo-body ul li {
          color: #4b5563;
          padding: 0.3rem 0 0.3rem 1.5rem;
          position: relative;
          line-height: 1.6;
          font-size: 0.975rem;
        }
        .seo-body ul li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #2563eb;
          font-weight: 700;
        }
      `}</style>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-2xl font-bold mb-3">
            Interesse in een {merkDisplay}{modelDisplay ? ' ' + modelDisplay : ''} lease?
          </h2>
          <p className="text-blue-100 mb-7 text-base max-w-xl mx-auto">
            Bereken direct jouw maandbedrag of laat ons je terugbellen voor persoonlijk advies.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/offerte"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Calculator size={18} />
              Bereken maandbedrag
            </Link>
            <Link
              to="/bel-mij"
              className="inline-flex items-center gap-2 border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Phone size={18} />
              Laat je terugbellen
            </Link>
          </div>
        </div>
      </div>

      {/* Andere merken */}
      {!modelSlug && (
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Andere populaire merken</h2>
          <div className="flex flex-wrap gap-2">
            {['toyota', 'volkswagen', 'bmw', 'mercedes-benz', 'renault', 'ford', 'audi', 'volvo', 'kia', 'nissan', 'peugeot', 'hyundai'].map((m) => (
              <Link
                key={m}
                to={`/financial-lease/${m}`}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  m === merkSlug
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1).replace(/-/g, ' ')}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}