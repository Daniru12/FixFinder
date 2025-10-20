'use client';
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  PackageIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  TruckIcon, 
  AlertCircleIcon,
  DollarSign,
  TrendingUp,
  Users,
  ShoppingCart,
  BarChart3,
  Filter,
  Search,
  Grid,
  List,
  Eye,
  RefreshCw,
  Calendar,
  MapPin,
  CreditCard,
  Star
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { orderAPI } from '../../utils/api';

export default function ProviderOrdersPage() {
  const router = useRouter();
  const { user, token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    totalCustomers: 0,
    recentOrders: []
  });

  useEffect(() => {
    if (user && token) {
      fetchProviderOrders();
    }
  }, [user, token]);

  const fetchProviderOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getProviderOrders(token);
      const ordersData = response.data || [];
      setOrders(ordersData);
      calculateAnalytics(ordersData);
    } catch (error) {
      console.error('Error fetching provider orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (ordersData) => {
    const totalOrders = ordersData.length;
    const pendingOrders = ordersData.filter(o => o.status === 'PENDING').length;
    const confirmedOrders = ordersData.filter(o => o.status === 'CONFIRMED').length;
    const shippedOrders = ordersData.filter(o => o.status === 'SHIPPED').length;
    const deliveredOrders = ordersData.filter(o => o.status === 'DELIVERED').length;
    const cancelledOrders = ordersData.filter(o => o.status === 'CANCELLED').length;
    
    const validOrders = ordersData.filter(o => o.status !== 'CANCELLED');
    const totalRevenue = validOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const averageOrderValue = validOrders.length > 0 ? totalRevenue / validOrders.length : 0;
    
    const uniqueCustomers = new Set(ordersData.map(o => o.customer?.id || o.customer?.username)).size;
    
    setAnalytics({
      totalOrders,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      averageOrderValue,
      totalCustomers: uniqueCustomers,
      recentOrders: ordersData.slice(0, 5)
    });
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus, token);
      alert(`Order status updated to ${newStatus} successfully!`);
      fetchProviderOrders(); // Refresh the orders list
    } catch (error) {
      console.error('Error updating order status:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update order status. Please try again.';
      alert(`Error: ${errorMessage}`);
    }
  };

  // Filter and search orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toString().includes(searchTerm) ||
      order.customer?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    const matchesDate = (() => {
      if (dateFilter === 'all') return true;
      const orderDate = new Date(order.orderDate);
      const now = new Date();
      const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case 'today': return daysDiff === 0;
        case 'week': return daysDiff <= 7;
        case 'month': return daysDiff <= 30;
        default: return true;
      }
    })();
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'CONFIRMED':
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      case 'SHIPPED':
        return <TruckIcon className="h-5 w-5 text-purple-500" />;
      case 'DELIVERED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'CANCELLED':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus?.toUpperCase()) {
      case 'PENDING':
        return 'CONFIRMED';
      case 'CONFIRMED':
        return 'SHIPPED';
      case 'SHIPPED':
        return 'DELIVERED';
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4 text-center">
          <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchProviderOrders}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Analytics</h1>
              <p className="text-gray-600 mt-1">Track performance and manage your orders</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={fetchProviderOrders}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalOrders}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {analytics.deliveredOrders} delivered
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
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
                  Avg: Rs. {analytics.averageOrderValue.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-3xl font-bold text-orange-600">{analytics.pendingOrders}</p>
                <p className="text-xs text-orange-600 mt-1">
                  Need attention
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <ClockIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Total Customers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalCustomers}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Unique buyers
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Order Status Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{analytics.pendingOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Confirmed</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{analytics.confirmedOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Shipped</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{analytics.shippedOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Delivered</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{analytics.deliveredOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Cancelled</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{analytics.cancelledOrders}</span>
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
                      <div className={`w-2 h-2 rounded-full mr-3 ${
                        order.status === 'DELIVERED' ? 'bg-green-500' :
                        order.status === 'PENDING' ? 'bg-yellow-500' :
                        order.status === 'CANCELLED' ? 'bg-red-500' : 'bg-blue-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
                        <p className="text-xs text-gray-500">{order.product?.name || 'N/A'}</p>
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

        {/* Order Management Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Order Management</h2>
              <div className="mt-4 sm:mt-0 flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
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
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>

                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
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
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <PackageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' 
                    ? 'No orders match your filters.' 
                    : 'You haven\'t received any orders yet.'}
                </p>
                <button
                  onClick={() => router.push('/products/my-products')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PackageIcon className="h-4 w-4" /> Manage Products
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 lg:grid-cols-2 gap-6" 
                : "space-y-4"
              }>
                {filteredOrders.map((order) => (
                  viewMode === 'grid' ? (
                    // Grid View
                    <div
                      key={order.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.id}
                          </h3>
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="text-sm font-medium capitalize">{order.status}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Product:</span>
                            <span className="font-medium">{order.product?.name || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Customer:</span>
                            <span className="font-medium">{order.customer?.username || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Quantity:</span>
                            <span className="font-medium">{order.quantity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date:</span>
                            <span className="font-medium">{formatDate(order.orderDate)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="font-semibold text-gray-900">Total:</span>
                            <span className="font-bold text-blue-600">Rs. {order.totalPrice?.toLocaleString() || 'N/A'}</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-end gap-2">
                          {order.status?.toUpperCase() !== 'DELIVERED' && 
                           order.status?.toUpperCase() !== 'CANCELLED' && 
                           getNextStatus(order.status) && (
                            <button
                              onClick={() => updateOrderStatus(order.id, getNextStatus(order.status))}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              Mark as {getNextStatus(order.status)}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // List View
                    <div
                      key={order.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className={`w-3 h-3 rounded-full ${
                              order.status === 'DELIVERED' ? 'bg-green-500' :
                              order.status === 'PENDING' ? 'bg-yellow-500' :
                              order.status === 'CANCELLED' ? 'bg-red-500' : 'bg-blue-500'
                            }`}></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-gray-900">
                                Order #{order.id}
                              </h3>
                              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span className="text-sm font-medium capitalize">{order.status}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>{order.product?.name || 'N/A'}</span>
                                <span>Qty: {order.quantity}</span>
                                <span>{order.customer?.username || 'N/A'}</span>
                                <span>{formatDate(order.orderDate)}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <p className="text-lg font-bold text-gray-900">
                                  Rs. {order.totalPrice?.toLocaleString() || 'N/A'}
                                </p>
                                {order.status?.toUpperCase() !== 'DELIVERED' && 
                                 order.status?.toUpperCase() !== 'CANCELLED' && 
                                 getNextStatus(order.status) && (
                                  <button
                                    onClick={() => updateOrderStatus(order.id, getNextStatus(order.status))}
                                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                  >
                                    Mark as {getNextStatus(order.status)}
                                  </button>
                                )}
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
      </div>
    </div>
  );
}
