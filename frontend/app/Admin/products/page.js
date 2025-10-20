'use client';
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';
import { productAPI, orderAPI } from '../../utils/api';
import { 
  EditIcon, 
  TrashIcon, 
  EyeIcon, 
  PlusIcon,
  Search,
  Filter,
  Grid,
  List,
  RefreshCw,
  DollarSign,
  Package,
  Users,
  TrendingUp,
  BarChart3,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  MoreVertical,
  Star,
  Calendar,
  MapPin
} from 'lucide-react';

export default function AdminProductsPage() {
  const { user, token, loading: authLoading } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [analytics, setAnalytics] = useState({
    totalProducts: 0,
    activeProducts: 0,
    inactiveProducts: 0,
    totalRevenue: 0,
    totalOrders: 0,
    totalProviders: 0,
    lowStockProducts: 0,
    topCategories: [],
    recentProducts: []
  });
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'ROLE_ADMIN') {
        router.push('/login');
        return;
      }
      loadData();
    }
  }, [user, router, authLoading]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes] = await Promise.all([
        productAPI.getAll(),
        orderAPI.getAll().catch(() => ({ data: [] }))
      ]);
      
      const productsData = productsRes.data || [];
      const ordersData = ordersRes.data || [];
      
      setProducts(productsData);
      setOrders(ordersData);
      calculateAnalytics(productsData, ordersData);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (productsData, ordersData) => {
    const totalProducts = productsData.length;
    const activeProducts = productsData.filter(p => p.status === 'ACTIVE').length;
    const inactiveProducts = productsData.filter(p => p.status === 'INACTIVE').length;
    const lowStockProducts = productsData.filter(p => p.stockQuantity < 10).length;
    
    const validOrders = ordersData.filter(o => o.status !== 'CANCELLED');
    const totalRevenue = validOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const totalOrders = ordersData.length;
    
    const uniqueProviders = new Set(productsData.map(p => p.provider?.id || p.provider?.username)).size;
    
    // Top categories
    const categoryCount = {};
    productsData.forEach(product => {
      const category = product.category || 'Uncategorized';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    const topCategories = Object.entries(categoryCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    setAnalytics({
      totalProducts,
      activeProducts,
      inactiveProducts,
      totalRevenue,
      totalOrders,
      totalProviders: uniqueProviders,
      lowStockProducts,
      topCategories,
      recentProducts: productsData.slice(0, 5)
    });
  };

  const handleDelete = async (productId) => {
    try {
      await productAPI.remove(productId, token);
      setProducts(products.filter(p => p.id !== productId));
      setDeleteConfirm(null);
      loadData(); // Refresh analytics
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.provider?.username || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesProvider = providerFilter === 'all' || 
      (product.provider?.username || 'Unknown') === providerFilter;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesProvider;
  });

  const getUniqueProviders = () => {
    const providers = products.map(p => p.provider?.username || 'Unknown');
    return [...new Set(providers)];
  };

  const getUniqueCategories = () => {
    const categories = products.map(p => p.category).filter(Boolean);
    return [...new Set(categories)];
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading product analytics...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'ROLE_ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-center">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/Admin/admin-dashboard')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Analytics</h1>
              <p className="text-gray-600 mt-1">Comprehensive product management and analytics</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center gap-3">
              <button
                onClick={loadData}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            <button
              onClick={() => router.push('/products/create')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
                <PlusIcon className="h-4 w-4" />
                Add Product
            </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalProducts}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {analytics.activeProducts} active
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">
                  Rs. {analytics.totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  From {analytics.totalOrders} orders
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Providers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Providers</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalProviders}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Active sellers
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-3xl font-bold text-orange-600">{analytics.lowStockProducts}</p>
                <p className="text-xs text-orange-600 mt-1">
                  Need restocking
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Product Status Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Status Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Active Products</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{analytics.activeProducts}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Inactive Products</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{analytics.inactiveProducts}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Low Stock</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{analytics.lowStockProducts}</span>
              </div>
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
            <div className="space-y-3">
              {analytics.topCategories.length > 0 ? (
                analytics.topCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{category.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-500 h-2 rounded-full" 
                          style={{ width: `${(category.count / analytics.totalProducts) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8 text-right">{category.count}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No category data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Product Management Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Product Management</h2>
              <div className="mt-4 sm:mt-0 flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {getUniqueCategories().map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>

                  <select
                    value={providerFilter}
                    onChange={(e) => setProviderFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Providers</option>
                    {getUniqueProviders().map(provider => (
                      <option key={provider} value={provider}>{provider}</option>
                    ))}
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || providerFilter !== 'all'
                    ? 'No products match your filters.' 
                    : 'No products found in the system.'}
                </p>
              <button
                onClick={() => router.push('/products/create')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <PlusIcon className="h-4 w-4" /> Create First Product
              </button>
          </div>
        ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                : "space-y-4"
              }>
                {filteredProducts.map((product) => (
                  viewMode === 'grid' ? (
                    // Grid View
              <div
                key={product.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=1000&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                    <span className={`text-xs font-medium ${
                            product.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {product.status}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 text-gray-800 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {product.description}
                  </p>
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <span className="font-medium text-gray-700">{product.category}</span>
                    <span className="mx-1">•</span>
                    <span>Stock: {product.stockQuantity}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                          <Users className="h-3 w-3 mr-1" />
                    <span className="font-medium text-gray-700">
                            {product.provider?.username || 'Unknown'}
                    </span>
                  </div>
                        <p className="text-indigo-600 font-bold text-xl mb-4">
                    Rs. {Number(product.price || 0).toLocaleString()}
                  </p>
                  
                  {/* Admin Action buttons */}
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => router.push(`/products/${product.id}`)}
                            className="p-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
                            title="View product"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => router.push(`/products/${product.id}/edit`)}
                            className="p-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                            title="Edit product"
                    >
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(product)}
                            className="p-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
                            title="Delete product"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
                  ) : (
                    // List View
                    <div
                      key={product.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            src={product.imageUrl || 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=1000&q=80'}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {product.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                product.status === 'ACTIVE' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {product.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{product.category}</span>
                              <span>Stock: {product.stockQuantity}</span>
                              <span className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {product.provider?.username || 'Unknown'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <p className="text-lg font-bold text-gray-900">
                                Rs. {Number(product.price || 0).toLocaleString()}
                              </p>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => router.push(`/products/${product.id}`)}
                                  className="p-1 rounded text-white bg-green-600 hover:bg-green-700 transition-colors"
                                  title="View"
                                >
                                  <EyeIcon className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => router.push(`/products/${product.id}/edit`)}
                                  className="p-1 rounded text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                                  title="Edit"
                                >
                                  <EditIcon className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(product)}
                                  className="p-1 rounded text-white bg-red-600 hover:bg-red-700 transition-colors"
                                  title="Delete"
                                >
                                  <TrashIcon className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
            ))}
          </div>
        )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl p-6 max-w-md mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-2 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>"{deleteConfirm.name}"</strong>? This action cannot be undone and will remove the product from all providers and customers.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.id)}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
