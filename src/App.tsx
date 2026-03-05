import { BrowserRouter, Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { OccasionsPage } from './pages/OccasionsPage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { KeuzehulpPage } from './pages/KeuzehulpPage';
import { ContactPage } from './pages/ContactPage';
import { OffertePage } from './pages/OffertePage';
import { BelMijPage } from './pages/BelMijPage';
import InfoPage from './pages/InfoPage';

// Admin imports
import LoginPage from './pages/admin/LoginPage';
import AuthGuard from './components/admin/AuthGuard';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import SiteInstellingenPage from './pages/admin/SiteInstellingenPage';
import LeadsPage from './pages/admin/LeadsPage';
import { PaginasPage, StatistiekenPage } from './pages/admin/PlaceholderPages';
import DealersPage from './pages/admin/DealersPage';

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-gray-600">Deze pagina is binnenkort beschikbaar.</p>
    </div>
  );
}

// Public layout wrapper met Header + Footer
function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Outlet />
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Smartlease.nl</h3>
              <p className="text-gray-400">
                Slimmer leasen begint hier. Jouw partner voor betrouwbare en voordelige autolease oplossingen.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/aanbod" className="hover:text-white transition">Aanbod</Link></li>
                <li><Link to="/calculator" className="hover:text-white transition">Calculator</Link></li>
                <li><Link to="/keuzehulp" className="hover:text-white transition">Keuzehulp</Link></li>
                <li><Link to="/financial-lease" className="hover:text-white transition">Financial lease</Link></li>
                <li><Link to="/meer-informatie" className="hover:text-white transition">Meer informatie</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@smartlease.nl</li>
                <li>Telefoon: 085 - 80 08 600</li>
                <li className="pt-2">
                  <Link to="/contact" className="text-smartlease-teal hover:text-white transition">
                    Contactformulier →
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Smartlease.nl - Alle rechten voorbehouden</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ─── Admin login (geen layout) ──────────────────────────────── */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* ─── Admin routes (met AdminLayout + AuthGuard) ─────────────── */}
        <Route
          path="/admin"
          element={
            <AuthGuard>
              <AdminLayout />
            </AuthGuard>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="site-instellingen" element={<SiteInstellingenPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="paginas" element={<PaginasPage />} />
          <Route path="statistieken" element={<StatistiekenPage />} />
          <Route path="dealers" element={<DealersPage />} />
        </Route>

        {/* ─── Public routes (met Header + Footer) ────────────────────── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/aanbod" element={<OccasionsPage />} />
          <Route path="/occasions" element={<Navigate to="/aanbod" replace />} />
          <Route path="/auto/:id/:slug" element={<VehicleDetailPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/keuzehulp" element={<KeuzehulpPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/offerte" element={<OffertePage />} />
          <Route path="/bel-mij" element={<BelMijPage />} />
          <Route path="/financial-lease/*" element={<InfoPage />} />
          <Route path="/meer-informatie" element={<PlaceholderPage title="Meer Informatie" />} />
          <Route path="*" element={<PlaceholderPage title="Pagina niet gevonden" />} />
          <Route path="/meer-informatie/*" element={<InfoPage />} />
          <Route path="/admin/paginas" element={<PaginaBeheer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
