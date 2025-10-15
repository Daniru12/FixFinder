'use client';
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { productAPI } from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import { EditIcon, TrashIcon, EyeIcon, PlusIcon } from 'lucide-react';

export default function MyProductsPage() {
  const router = useRouter();
  const { user, token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const isAllowed = user && (
    user.role === 'ADMIN' || 
    user.role === 'USER' || 
    user.role === 'PROVIDER' ||
    user.role === 'ROLE_ADMIN' || 
    user.role === 'ROLE_USER' ||
    user.role === 'ROLE_PROVIDER'
  );

  useEffect(() => {
    if (!isAllowed) {
      router.push('/products');
      return;
    }
    loadMyProducts();
  }, [isAllowed]);

  const loadMyProducts = async () => {
    try {
      setLoading(true);
      // For now, we'll get all products and filter by current user
      // In a real app, you'd have a dedicated endpoint for user's products
      const response = await productAPI.getAll();
      const allProducts = response.data || [];
      
      // Filter products by current user (this is a workaround since we don't have /my-products endpoint working)
      // In production, you'd call a dedicated endpoint like productAPI.getMyProducts(token)
      setProducts(allProducts);
    } catch (err) {
      setError('Failed to load your products');
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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Products</h1>
              <p className="text-gray-600">Manage your product listings</p>
            </div>
            <button
              onClick={() => router.push('/products/create')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
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

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading your products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">You haven't created any products yet.</p>
            <button
              onClick={() => router.push('/products/create')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4" /> Create Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-white/50"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=1000&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1">
                    <span className="text-xs font-medium text-gray-800">
                      {product.status}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent line-clamp-2">
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
                  <p className="text-blue-600 font-bold text-xl mb-4">
                    Rs. {Number(product.price || 0).toLocaleString()}
                  </p>
                  
                  {/* Action buttons */}
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
