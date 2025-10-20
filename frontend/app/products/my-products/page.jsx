'use client';
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { productAPI, orderAPI } from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import { 
  EditIcon, 
  TrashIcon, 
  EyeIcon, 
  PlusIcon, 
  TrendingUp, 
  Package, 
  DollarSign, 
  ShoppingCart, 
  BarChart3, 
  Filter,
  Search,
  Grid,
  List,
  MoreVertical,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';

export default function MyProductsPage() {
  const router = useRouter();
  const { user, token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [analytics, setAnalytics] = useState({
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    totalRevenue: 0,
    totalOrders: 0,
    averageRating: 0,
    topSellingCategory: '',
    recentOrders: []
  });

  const isAllowed = user && (
    user.role === 'ADMIN' || 
    user.role === 'USER' || 
    user.role === 'PROVIDER' ||
    user.role === 'ROLE_ADMIN' || 
    user.role === 'ROLE_USER' ||
    user.role === 'ROLE_PROVIDER' ||
    (user.serviceType && user.serviceType.trim() !== '') // User with service type is considered a provider
  );

  useEffect(() => {
    if (!isAllowed) {
      router.push('/products');
      return;
    }
    loadMyProducts();
  }, [isAllowed]);

  // Load analytics after products are loaded
  useEffect(() => {
    loadAnalytics();
  }, [products]);

  const loadMyProducts = async () => {
    try {
      setLoading(true);
      
      // Use the proper API endpoint for user's products
      const response = await productAPI.getMyProducts(token);
      const userProducts = response.data || [];
      
      console.log('User products from API:', userProducts);
      console.log('Products count:', userProducts.length);
      
      setProducts(userProducts);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load your products. Please make sure you are logged in and have the correct permissions.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      // Load orders for revenue calculation
      let orders = [];
      try {
        console.log('Loading orders for user:', user);
        console.log('User serviceType:', user?.serviceType);
        console.log('User role:', user?.role);
        const ordersResponse = await orderAPI.getProviderOrders(token);
        orders = ordersResponse.data || [];
        console.log('Orders loaded:', orders);
      } catch (orderErr) {
        console.log('No orders found or error loading orders:', orderErr);
        orders = [];
      }
      
      // Calculate analytics from products and orders
      const totalProducts = products.length;
      const activeProducts = products.filter(p => p.status === 'ACTIVE' || p.status === 'active').length;
      const lowStockProducts = products.filter(p => (p.stockQuantity || 0) < 10).length;
      
      // Filter out cancelled orders for revenue calculation
      const validOrders = orders.filter(order => order.status !== 'CANCELLED' && order.status !== 'cancelled');
      const totalRevenue = validOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      const totalOrders = orders.length;

      // If no products, show some sample data for demonstration
      if (totalProducts === 0) {
        console.log('No products found, showing sample analytics');
        // For demonstration purposes, show some sample data
        setAnalytics({
          totalProducts: 0,
          activeProducts: 0,
          lowStockProducts: 0,
          totalRevenue: 0,
          totalOrders: 0,
          averageRating: 0,
          topSellingCategory: 'None',
          recentOrders: []
        });
        return;
      }
      
      // Calculate average rating (mock data for now)
      const averageRating = products.length > 0 ? 
        products.reduce((sum, p) => sum + (p.rating || 4.2), 0) / products.length : 0;
      
      // Find top selling category
      const categoryCount = {};
      products.forEach(p => {
        const category = p.category || 'Uncategorized';
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
      const topSellingCategory = Object.keys(categoryCount).length > 0 
        ? Object.keys(categoryCount).reduce((a, b) => 
            categoryCount[a] > categoryCount[b] ? a : b, 'None'
          )
        : 'None';

      console.log('Analytics calculated:', {
        totalProducts,
        activeProducts,
        lowStockProducts,
        totalRevenue,
        totalOrders,
        averageRating,
        topSellingCategory
      });

      setAnalytics({
        totalProducts,
        activeProducts,
        lowStockProducts,
        totalRevenue,
        totalOrders,
        averageRating,
        topSellingCategory,
        recentOrders: orders.slice(0, 5)
      });
    } catch (err) {
      console.error('Failed to load analytics:', err);
      // Set default analytics if there's an error
      setAnalytics({
        totalProducts: products.length,
        activeProducts: products.filter(p => p.status === 'ACTIVE' || p.status === 'active').length,
        lowStockProducts: products.filter(p => (p.stockQuantity || 0) < 10).length,
        totalRevenue: 0,
        totalOrders: 0,
        averageRating: 0,
        topSellingCategory: 'None',
        recentOrders: []
      });
    }
  };

  const handleDelete = async (productId) => {
    try {
      await productAPI.remove(productId, token);
      setProducts(products.filter(p => p.id !== productId));
      setDeleteConfirm(null);
      loadAnalytics(); // Refresh analytics after deletion
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  // Filter and search products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return (b.price || 0) - (a.price || 0);
      case 'stock':
        return (b.stockQuantity || 0) - (a.stockQuantity || 0);
      case 'date':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      default:
        return 0;
    }
  });

  if (!isAllowed) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-700">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Analytics</h1>
              <p className="text-gray-600 mt-1">Track performance and manage your product portfolio</p>
            </div>
            <div className="mt-4 sm:mt-0">
            <button
              onClick={() => router.push('/products/create')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg"
              >
                <PlusIcon className="h-5 w-5" /> Add New Product
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalProducts}</p>
                <p className="text-xs text-green-600 mt-1">
                  {analytics.activeProducts} active
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">
                  Rs. {analytics.totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  From {analytics.totalOrders} orders (excluding cancelled)
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
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

          {/* Average Rating */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics.averageRating.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {analytics.topSellingCategory} top category
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* My Orders Card */}
        <div className="mb-8">
          <div 
            onClick={() => router.push('/Provider/providerOrders')}
            className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-teal-600/20"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <ShoppingCart className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">My Orders</h3>
                    <p className="text-green-100 text-lg">
                      {analytics.totalOrders} Total Orders
                    </p>
                    <p className="text-green-200 text-sm">
                      Rs. {analytics.totalRevenue.toLocaleString()} Revenue
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-2">
                    <span className="text-white font-semibold">Manage Orders</span>
                  </div>
                  <div className="flex items-center text-white/80 group-hover:text-white transition-colors">
                    <span className="text-sm mr-2">View Details</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Animated Money Falling Effect */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-bounce opacity-60" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
                <div className="absolute top-0 left-1/3 w-1 h-1 bg-yellow-200 rounded-full animate-bounce opacity-40" style={{animationDelay: '0.5s', animationDuration: '2.5s'}}></div>
                <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce opacity-50" style={{animationDelay: '1s', animationDuration: '2.8s'}}></div>
                <div className="absolute top-0 left-2/3 w-1 h-1 bg-yellow-300 rounded-full animate-bounce opacity-60" style={{animationDelay: '1.5s', animationDuration: '3.2s'}}></div>
                <div className="absolute top-0 left-3/4 w-2 h-2 bg-yellow-200 rounded-full animate-bounce opacity-40" style={{animationDelay: '2s', animationDuration: '2.7s'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Product Status Chart */}
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
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Inactive Products</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {analytics.totalProducts - analytics.activeProducts}
                </span>
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

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {analytics.recentOrders.length > 0 ? (
                analytics.recentOrders.map((order, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
                        <p className="text-xs text-gray-500">{order.status}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      Rs. {order.totalPrice?.toLocaleString() || '0'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No recent orders</p>
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
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Home">Home</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price">Sort by Price</option>
                    <option value="stock">Sort by Stock</option>
                    <option value="date">Sort by Date</option>
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
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading your products...</p>
          </div>
            ) : sortedProducts.length === 0 ? (
          <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
                    ? 'No products match your filters.' 
                    : 'You haven\'t created any products yet.'}
                </p>
            <button
              onClick={() => router.push('/products/create')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4" /> Create Your First Product
            </button>
          </div>
        ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {sortedProducts.map((product) => (
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
                        <div className="absolute top-3 right-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.status === 'ACTIVE' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                      {product.status}
                    </span>
                  </div>
                        {product.stockQuantity < 10 && (
                          <div className="absolute top-3 left-3">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              Low Stock
                            </span>
                          </div>
                        )}
                </div>
                <div className="p-4">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <span className="font-medium">{product.category}</span>
                    <span>Stock: {product.stockQuantity}</span>
                  </div>
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-xl font-bold text-gray-900">
                    Rs. {Number(product.price || 0).toLocaleString()}
                  </p>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">
                              {product.rating?.toFixed(1) || '4.2'}
                            </span>
                          </div>
                        </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => router.push(`/products/${product.id}`)}
                            className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                            aria-label="View product"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/products/${product.id}/edit`)}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                            aria-label="Edit product"
                          >
                            <EditIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(product)}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            aria-label="Delete product"
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
                        <img
                          src={product.imageUrl || 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=1000&q=80'}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {product.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                product.status === 'ACTIVE' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {product.status}
                              </span>
                              {product.stockQuantity < 10 && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  Low Stock
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{product.category}</span>
                              <span>Stock: {product.stockQuantity}</span>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="ml-1">{product.rating?.toFixed(1) || '4.2'}</span>
                              </div>
                            </div>
                            <p className="text-lg font-bold text-gray-900">
                              Rs. {Number(product.price || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => router.push(`/products/${product.id}`)}
                            className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                      aria-label="View product"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => router.push(`/products/${product.id}/edit`)}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                      aria-label="Edit product"
                    >
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(product)}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      aria-label="Delete product"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
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
            <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-xl">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-2 rounded-lg mr-3">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "<span className="font-medium">{deleteConfirm.name}</span>"? 
                This action cannot be undone and will remove the product from your inventory.
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
