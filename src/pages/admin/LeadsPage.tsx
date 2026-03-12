import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Mail, Phone, Eye, Loader2, Inbox } from 'lucide-react';

interface Lead {
  id: number;
  type: string;
  naam: string | null;
  bedrijfsnaam: string | null;
  email: string | null;
  telefoon: string | null;
  vehicle_info: string | null;
  status: string;
  created_at: string;
}

const STATUS_OPTIONS = [
  { value: 'nieuw', label: 'Nieuw', color: 'bg-blue-100 text-blue-700' },
  { value: 'in_behandeling', label: 'In behandeling', color: 'bg-amber-100 text-amber-700' },
  { value: 'afgerond', label: 'Afgerond', color: 'bg-green-100 text-green-700' },
  { value: 'afgewezen', label: 'Afgewezen', color: 'bg-red-100 text-red-700' },
];

export default function LeadsPage() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('alle');

  useEffect(() => { loadLeads(); }, []);

  const loadLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('id, type, naam, bedrijfsnaam, email, telefoon, vehicle_info, status, created_at')
      .order('created_at', { ascending: false })
      .limit(100);
    if (!error && data) setLeads(data);
    setLoading(false);
  };

  const filteredLeads = filter === 'alle' ? leads : leads.filter((l) => l.status === filter);

  const getStatusBadge = (status: string) => {
    const opt = STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
    return <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${opt.color}`}>{opt.label}</span>;
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleString('nl-NL', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-smartlease-teal" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-500 mt-1">
            {leads.length} totaal, {leads.filter((l) => l.status === 'nieuw').length} nieuw
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['alle', ...STATUS_OPTIONS.map((s) => s.value)].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition ${
              filter === f
                ? 'bg-smartlease-teal text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f === 'alle' ? 'Alle' : STATUS_OPTIONS.find((s) => s.value === f)?.label}
          </button>
        ))}
      </div>

      {filteredLeads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Inbox className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Geen leads gevonden</p>
          <p className="text-gray-400 text-sm mt-1">
            {filter !== 'alle' ? 'Probeer een ander filter' : 'Leads verschijnen hier zodra ze binnenkomen'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Naam / Bedrijf</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Contact</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Type</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Datum</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-gray-50/50 transition cursor-pointer"
                    onClick={() => navigate(`/admin/leads/${lead.id}`)}
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900 text-sm">{lead.naam || '—'}</p>
                      {lead.bedrijfsnaam && (
                        <p className="text-xs text-gray-400 mt-0.5">{lead.bedrijfsnaam}</p>
                      )}
                      {lead.vehicle_info && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">{lead.vehicle_info}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-0.5">
                        {lead.email && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {lead.email}
                          </p>
                        )}
                        {lead.telefoon && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {lead.telefoon}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-gray-500 capitalize">{lead.type}</span>
                    </td>
                    <td className="px-5 py-4">{getStatusBadge(lead.status)}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-gray-400">{formatDate(lead.created_at)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/admin/leads/${lead.id}`); }}
                        className="p-2 text-gray-400 hover:text-smartlease-teal hover:bg-smartlease-teal/10 rounded-lg transition"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}