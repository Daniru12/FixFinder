'use client';
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext'; // adjust path
import { serviceAPI } from '../../utils/api';

export default function MyServicesPage() {
  const { user, token } = useContext(AuthContext);
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    if (!user || !token) {
      router.push('/login');
      return;
    }

    loadServices();
  }, [user, token, router]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await serviceAPI.getMyServices(token);
      setServices(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (service) => {
    setEditingService(service.id);
    setEditFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      category: service.category,
      status: service.status,
      images: service.images
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await serviceAPI.updateService(editingService, editFormData, token);
      setEditingService(null);
      setEditFormData({});
      loadServices(); // Reload services
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update service');
    }
  };

  const handleDeleteClick = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await serviceAPI.deleteService(serviceId, token);
        loadServices(); // Reload services
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete service');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingService(null);
    setEditFormData({});
  };

  if (loading) {
    return <p className="text-center py-10">Loading your services...</p>;
  }

  if (error) {
    return <p className="text-center py-10 text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Services</h1>
        <button
          onClick={() => router.push('./create-service')}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
        >
          + Create Service
        </button>
      </div>

      {services.length === 0 ? (
        <p className="text-center text-gray-600">You have not added any services yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition"
            >
              {editingService === service.id ? (
                // Edit Form
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.name || ''}
                      onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editFormData.description || ''}
                      onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      rows="3"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editFormData.price || ''}
                      onChange={(e) => setEditFormData({...editFormData, price: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={editFormData.category || ''}
                      onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={editFormData.status || ''}
                      onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="PENDING">Pending</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={editFormData.images || ''}
                      onChange={(e) => setEditFormData({...editFormData, images: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                // Display Mode
                <>
                  {service.images && (
                    <img
                      src={service.images}
                      alt={service.name}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h2 className="text-xl font-semibold">{service.name}</h2>
                  <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                  <p className="font-medium text-blue-600">Category: {service.category}</p>
                  <p className="font-medium text-green-600">Status: {service.status}</p>
                  <p className="text-lg font-bold mt-2">${service.price}</p>
                  
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => handleEditClick(service)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(service.id)}
                      className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
