'use client';
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';
import { productAPI } from '../../utils/api';
import { EditIcon, TrashIcon, EyeIcon, PlusIcon } from 'lucide-react';

export default function AdminProductsPage() {
  const { user, token, loading: authLoading } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'ROLE_ADMIN') {
        router.push('/login');
        return;
      }
      loadProducts();
    }
  }, [user, router, authLoading]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data || []);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await productAPI.remove(productId, token);
      setProducts(products.filter(p => p.id !== productId));
      setDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
          <p className="mt-4 text-cyan-700 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'ROLE_ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50 flex items-center justify-center">
        <p className="text-gray-500 text-center">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
              <p className="text-gray-600 mt-1">Manage all products in the system</p>
            </div>
            <button
              onClick={() => router.push('/products/create')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700"
            >
              <PlusIcon className="h-4 w-4" /> Add Product
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Products Found</h3>
              <p className="text-gray-600 mb-4">There are no products in the system yet.</p>
              <button
                onClick={() => router.push('/products/create')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700"
              >
                <PlusIcon className="h-4 w-4" /> Create First Product
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=1000&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                    <span className={`text-xs font-medium ${
                      product.status === 'ACTIVE' ? 'text-green-600' : 
                      product.status === 'INACTIVE' ? 'text-gray-600' : 'text-red-600'
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
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <span className="font-medium text-gray-700">
                      {product.category}
                    </span>
                    <span className="mx-1">•</span>
                    <span>Stock: {product.stockQuantity}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <span className="font-medium text-gray-700">
                      Provider: {product.provider?.username || 'Unknown'}
                    </span>
                  </div>
                  <p className="text-purple-600 font-bold text-xl mb-4">
                    Rs. {Number(product.price || 0).toLocaleString()}
                  </p>
                  
                  {/* Admin Action buttons */}
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => router.push(`/products/${product.id}`)}
                      className="p-2 rounded-lg flex items-center justify-center text-white transition-all duration-300 bg-green-600 hover:bg-green-700"
                      aria-label="View product"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => router.push(`/products/${product.id}/edit`)}
                      className="p-2 rounded-lg flex items-center justify-center text-white transition-all duration-300 bg-blue-600 hover:bg-blue-700"
                      aria-label="Edit product"
                    >
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(product)}
                      className="p-2 rounded-lg flex items-center justify-center text-white transition-all duration-300 bg-red-600 hover:bg-red-700"
                      aria-label="Delete product"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Product</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.id)}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
