import { useEffect, useState, useMemo } from 'react';
import { getOrders } from '../../features/orders/ordersAPI';
import { 
  Search, ChevronLeft, ChevronRight, ShoppingBag, 
  Calendar, User, Hash, Download, Filter, MoreHorizontal 
} from 'lucide-react';
import { EmptyState } from '../../components/DashboardComponents';

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getOrders()
      .then((data) => { if (!cancelled) setOrders(Array.isArray(data) ? data : []); })
      .catch(() => { if (!cancelled) setOrders([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filteredOrders = useMemo(() => {
    const q = (search || '').trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(o => 
      String(o.id).toLowerCase().includes(q) || 
      o.userName?.toLowerCase().includes(q) || 
      o.userEmail?.toLowerCase().includes(q)
    );
  }, [orders, search]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  const paginatedOrders = useMemo(() => filteredOrders.slice(start, start + pageSize), [filteredOrders, start, pageSize]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-2 border-[#9E3B3B]/10 border-t-[#9E3B3B] rounded-full animate-spin" />
      <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium">Loading orders...</p>
    </div>
  );

  return (
    <div className="min-h-screen mt-1 p-4 sm:p-8 lg:p-12 bg-[#FDFBF9]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-[#9E3B3B] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Historique des Commandes
            </h1>
            <p className="text-sm text-gray-400 uppercase tracking-[0.1em] font-medium">
              Gestionnaire de ventes • {filteredOrders.length} transactions
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            
            <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden md:block"></div>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="bg-transparent text-xs font-bold uppercase tracking-widest text-gray-500 focus:outline-none cursor-pointer"
            >
              {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n} par page</option>)}
            </select>
          </div>
        </div>

        {/* Search Bar - Minimalist Floating */}
        <div className="relative mb-10 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#9E3B3B] transition-colors" />
          <input
            type="text"
            placeholder="Rechercher un client, un email ou un ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-2xl text-sm shadow-sm focus:ring-4 focus:ring-[#9E3B3B]/5 focus:border-[#9E3B3B] outline-none transition-all placeholder:text-gray-300"
          />
        </div>

        {/* Content Area */}
        {filteredOrders.length === 0 ? (
          <EmptyState message="Aucune commande trouvée dans les archives." />
        ) : (
          <div className="space-y-6">
            
            {/* Desktop Table - Elegant & Spacious */}
            <div className="hidden md:block bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#9E3B3B] text-white">
                  <tr className="bg-[#9E3B3B] text-white border-b border-gray-50">
                    <th className="px-8 py-5 text-left text-[12px] font-bold uppercase tracking-[0.2em] ">Référence</th>
                    <th className="px-8 py-5 text-left text-[12px] font-bold uppercase tracking-[0.2em] ">Client</th>
                    <th className="px-8 py-5 text-left text-[12px] font-bold uppercase tracking-[0.2em] ">Date d'achat</th>
                    <th className="px-8 py-5 text-right text-[12px] font-bold uppercase tracking-[0.2em] ">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#9E3B3B]/10 transition-colors group">
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-[#9E3B3B] bg-gray-100 px-2 py-1 rounded">#{order.id}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900">{order.userName || 'Anonyme'}</span>
                          <span className="text-xs text-gray-400">{order.userEmail}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-sm font-bold text-gray-900">${Number(order.total).toFixed(2)}</span>
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards - Boutique Style */}
            <div className="md:hidden space-y-4">
              {paginatedOrders.map((order) => (
                <div key={order.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold text-[#9E3B3B] bg-[#9E3B3B]/5 px-2 py-1 rounded uppercase tracking-widest">
                      ID: {order.id}
                    </span>
                    <span className="font-bold text-gray-900">${Number(order.total).toFixed(2)}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{order.userName}</h3>
                  <p className="text-xs text-gray-400 mb-4">{order.userEmail}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {formatDate(order.createdAt)}
                    </div>
                    <button className="text-xs font-bold text-[#9E3B3B] uppercase tracking-tighter">Détails</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination - Clean & Minimalist */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-8">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                  Page {currentPage} sur {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-3 rounded-full border border-gray-100 bg-white text-gray-400 disabled:opacity-20 hover:border-[#9E3B3B] hover:text-[#9E3B3B] transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-3 rounded-full border border-gray-100 bg-white text-gray-400 disabled:opacity-20 hover:border-[#9E3B3B] hover:text-[#9E3B3B] transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}