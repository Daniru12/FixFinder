'use client';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';
import { adminAPI } from '../../utils/api';
import { Users, Calendar, Briefcase, TrendingUp, Activity, BarChart3, PieChart } from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout, loading, token } = useContext(AuthContext);
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalServices: 0,
    activeServices: 0,
    pendingBookings: 0,
    completedBookings: 0
  });
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('../login');
      } else if (user.role !== 'ROLE_ADMIN') {
        router.push('/');
      } else {
        fetchDashboardData();
      }
    }
  }, [user, router, loading]);

  const fetchDashboardData = async () => {
    try {
      setLoadingData(true);
      // Fetch all data in parallel
      const [usersRes, servicesRes, bookingsRes] = await Promise.all([
        adminAPI.getAllUsers(token).catch(() => ({ data: [] })),
        adminAPI.getAllServices(token).catch(() => ({ data: [] })),
        adminAPI.getAllBookings(token).catch(() => ({ data: [] }))
      ]);

      const usersData = usersRes.data || [];
      const servicesData = servicesRes.data || [];
      const bookingsData = bookingsRes.data || [];

      setServices(servicesData);
      setBookings(bookingsData);

      // Calculate statistics
      setStats({
        totalUsers: usersData.length,
        totalBookings: bookingsData.length,
        totalServices: servicesData.length,
        activeServices: servicesData.filter(s => s.status === 'ACTIVE').length,
        pendingBookings: bookingsData.filter(b => b.status === 'PENDING').length,
        completedBookings: bookingsData.filter(b => b.status === 'COMPLETED').length
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  // Calculate services by category for chart
  const getServicesByCategory = () => {
    const categoryCount = {};
    services.forEach(service => {
      const category = service.category || 'Uncategorized';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    return Object.entries(categoryCount).map(([name, count]) => ({ name, count }));
  };

  // Calculate booking status distribution
  const getBookingStatusDistribution = () => {
    const statusCount = {
      PENDING: 0,
      CONFIRMED: 0,
      COMPLETED: 0,
      CANCELLED: 0
    };
    bookings.forEach(booking => {
      const status = booking.status || 'PENDING';
      if (statusCount.hasOwnProperty(status)) {
        statusCount[status]++;
      }
    });
    return Object.entries(statusCount).map(([name, count]) => ({ name, count }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
          <p className="mt-4 text-cyan-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'ROLE_ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50 flex items-center justify-center">
        <p className="text-gray-500 text-center">Checking access...</p>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      route: './users'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      gradient: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      route: './bookings',
      subtitle: `${stats.pendingBookings} pending`
    },
    {
      title: 'Total Services',
      value: stats.totalServices,
      icon: Briefcase,
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      route: './services',
      subtitle: `${stats.activeServices} active`
    },
    {
      title: 'Completed',
      value: stats.completedBookings,
      icon: TrendingUp,
      gradient: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      route: './bookings'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-cyan-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-cyan-600 to-teal-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-cyan-600 font-bold text-lg">
                    {user.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-cyan-50 text-sm">Welcome back,</p>
                  <p className="text-white font-semibold text-lg">{user.username}</p>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-lg transition-all duration-200 border border-white/20 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                onClick={() => router.push(card.route)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${card.bgColor} p-3 rounded-lg`}>
                      <IconComponent className={`h-6 w-6 ${card.iconColor}`} />
                    </div>
                    {loadingData ? (
                      <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
                    ) : (
                      <div className="text-right">
                        <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                      </div>
                    )}
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
                  {card.subtitle && (
                    <p className="text-xs text-gray-500">{card.subtitle}</p>
                  )}
                </div>
                <div className={`h-1 bg-gradient-to-r ${card.gradient}`}></div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Services by Category Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-cyan-600" />
                  Services by Category
                </h3>
                <p className="text-sm text-gray-500 mt-1">Distribution across categories</p>
              </div>
            </div>
            {loadingData ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {getServicesByCategory().length > 0 ? (
                  getServicesByCategory().map((item, index) => {
                    const maxCount = Math.max(...getServicesByCategory().map(i => i.count));
                    const percentage = (item.count / maxCount) * 100;
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'];
                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{item.name}</span>
                          <span className="text-sm font-bold text-gray-800">{item.count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`${colors[index % colors.length]} h-3 rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No service data available</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Booking Status Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-green-600" />
                  Booking Status
                </h3>
                <p className="text-sm text-gray-500 mt-1">Current booking distribution</p>
              </div>
            </div>
            {loadingData ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {getBookingStatusDistribution().map((item, index) => {
                  const total = bookings.length || 1;
                  const percentage = ((item.count / total) * 100).toFixed(1);
                  const statusColors = {
                    PENDING: { bg: 'bg-yellow-500', text: 'text-yellow-700', light: 'bg-yellow-50' },
                    CONFIRMED: { bg: 'bg-blue-500', text: 'text-blue-700', light: 'bg-blue-50' },
                    COMPLETED: { bg: 'bg-green-500', text: 'text-green-700', light: 'bg-green-50' },
                    CANCELLED: { bg: 'bg-red-500', text: 'text-red-700', light: 'bg-red-50' }
                  };
                  const color = statusColors[item.name] || statusColors.PENDING;
                  return (
                    <div key={index} className={`${color.light} rounded-lg p-4`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-semibold ${color.text}`}>{item.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-800">{item.count}</span>
                          <span className="text-xs text-gray-500">({percentage}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-white rounded-full h-2">
                        <div
                          className={`${color.bg} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
   {/* Quick Actions */}
<div className="bg-white rounded-xl shadow-md p-6">
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
      <p className="text-gray-600 text-sm mt-1">Manage your platform</p>
    </div>
  </div>

  {/* Updated grid to 4 columns */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <button
      onClick={() => router.push('./users')}
      className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-lg transition-all duration-200 group text-left"
    >
      <Users className="h-8 w-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
      <p className="text-lg font-bold text-gray-800">User Management</p>
      <p className="text-sm text-gray-600 mt-1">Manage all users</p>
    </button>

    <button
      onClick={() => router.push('./bookings')}
      className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-lg transition-all duration-200 group text-left"
    >
      <Calendar className="h-8 w-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
      <p className="text-lg font-bold text-gray-800">Bookings</p>
      <p className="text-sm text-gray-600 mt-1">View all bookings</p>
    </button>

    <button
      onClick={() => router.push('./services')}
      className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-lg transition-all duration-200 group text-left"
    >
      <Briefcase className="h-8 w-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
      <p className="text-lg font-bold text-gray-800">Services</p>
      <p className="text-sm text-gray-600 mt-1">Manage services</p>
    </button>

    {/* ✅ Reviews Button */}
    <button
      onClick={() => router.push('./reviews')}
      className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl hover:shadow-lg transition-all duration-200 group text-left"
    >
      <BarChart3 className="h-8 w-8 text-pink-600 mb-3 group-hover:scale-110 transition-transform" />
      <p className="text-lg font-bold text-gray-800">Reviews</p>
      <p className="text-sm text-gray-600 mt-1">View and manage reviews</p>
    </button>
  </div>
</div>

      </div>
    </div>
  );
}