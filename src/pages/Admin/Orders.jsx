import { useEffect, useState, useMemo } from 'react';
import { getOrders } from '../../features/orders/ordersAPI';
import { Search, ChevronLeft, ChevronRight, ShoppingBag, Calendar, User, Hash } from 'lucide-react';
import { EmptyState } from '../../components/DashboardComponents';

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getOrders()
      .then((data) => {
        if (!cancelled) setOrders(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setOrders([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const filteredOrders = useMemo(() => {
    const q = (search || '').trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        (o.id && String(o.id).toLowerCase().includes(q)) ||
        (o.userName && o.userName.toLowerCase().includes(q)) ||
        (o.userEmail && o.userEmail.toLowerCase().includes(q))
    );
  }, [orders, search]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  const paginatedOrders = useMemo(
    () => filteredOrders.slice(start, start + pageSize),
    [filteredOrders, start, pageSize]
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTotal = (total) => {
    const n = Number(total);
    if (Number.isNaN(n)) return '—';
    return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9E3B3B]" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-1">View and manage all orders from MockAPI</p>
      </div>

      {/* Search + Page size */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID, customer name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9E3B3B]/30 focus:border-[#9E3B3B] transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Per page</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#9E3B3B]/30"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table (desktop) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">All orders</h2>
          <p className="text-sm text-gray-500 mt-1">
            {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {filteredOrders.length === 0 ? (
          <EmptyState message={orders.length === 0 ? 'No orders yet' : 'No orders match your search'} />
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80">
                  <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4 text-left">Order ID</th>
                    <th className="px-6 py-4 text-left">Customer name</th>
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-left">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#9E3B3B]/5 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-semibold text-gray-800">{order.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{order.userName || '—'}</span>
                        {order.userEmail && (
                          <p className="text-xs text-gray-500 mt-0.5">{order.userEmail}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 font-bold text-[#9E3B3B]">
                        {formatTotal(order.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards (mobile) */}
            <div className="md:hidden divide-y divide-gray-100">
              {paginatedOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-gray-800">
                        <Hash className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="font-mono text-sm font-semibold truncate">{order.id}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 text-gray-700">
                        <User className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="font-medium truncate">{order.userName || '—'}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-[#9E3B3B]" />
                      <span className="font-bold text-[#9E3B3B]">{formatTotal(order.total)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-4 px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                <p className="text-sm text-gray-500">
                  Showing {start + 1}–{Math.min(start + pageSize, filteredOrders.length)} of {filteredOrders.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#9E3B3B]/30"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="px-3 py-1.5 text-sm font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#9E3B3B]/30"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
