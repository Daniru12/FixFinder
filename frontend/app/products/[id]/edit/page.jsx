'use client';
import React, { useContext, useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { productAPI } from '../../../utils/api';
import { AuthContext } from '../../../context/AuthContext';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { user, token } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
    location: '',
    stockQuantity: 0,
    status: 'ACTIVE',
  });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = [
    'All Tools',
    'Power Tools',
    'Hand Tools',
    'Building Materials',
    'Plumbing',
    'Electrical',
    'Painting',
    'Safety Equipment',
  ];

  const locations = [
    'Colombo',
    'Kandy',
    'Galle',
    'Negombo',
    'Jaffna',
    'Kurunegala',
    'Ratnapura',
  ];

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
    loadProduct();
  }, [params.id, isAllowed]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getById(params.id);
      const product = response.data;
      
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        imageUrl: product.imageUrl || '',
        category: product.category || '',
        location: product.provider?.location || 'Colombo',
        stockQuantity: product.stockQuantity || 0,
        status: product.status || 'ACTIVE',
      });
    } catch (err) {
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'price' || name === 'stockQuantity' ? value : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isAllowed) return;
    try {
      setSubmitting(true);
      setError('');
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price || 0),
        imageUrl: form.imageUrl || undefined,
        category: form.category || 'General',
        stockQuantity: Number(form.stockQuantity || 0),
        status: form.status || 'ACTIVE',
      };
      
      console.log('Updating product with payload:', payload);
      console.log('Product ID:', params.id);
      console.log('User token:', token ? 'Present' : 'Missing');
      console.log('User role:', user?.role);
      
      await productAPI.update(params.id, payload, token);
      router.push('/products');
    } catch (err) {
      console.error('Update error:', err);
      console.error('Error response:', err.response?.data);
      setError(`Failed to update product: ${err.response?.data?.message || err.message || 'Please check your inputs or permissions.'}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-700">You don't have permission to edit this product.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6">
          <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">{error}</div>
          )}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Name</label>
              <input name="name" value={form.name} onChange={onChange} required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={onChange} rows={4} className="w-full border rounded px-3 py-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Price (Rs.)</label>
                <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={onChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Stock Quantity</label>
                <input name="stockQuantity" type="number" min="0" step="1" value={form.stockQuantity} onChange={onChange} className="w-full border rounded px-3 py-2" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Category</label>
              <select 
                name="category" 
                value={form.category} 
                onChange={onChange} 
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Photo Upload Section */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Product Photos</label>
              <div className="space-y-4">
                {/* Image URL Input */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Image URL (Primary Photo)</label>
                  <input 
                    name="imageUrl" 
                    value={form.imageUrl} 
                    onChange={onChange} 
                    placeholder="https://example.com/image.jpg"
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                
                {/* Image Preview */}
                {form.imageUrl && (
                  <div className="mt-2">
                    <label className="block text-xs text-gray-600 mb-1">Preview:</label>
                    <div className="w-32 h-32 border rounded overflow-hidden">
                      <img 
                        src={form.imageUrl} 
                        alt="Product preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs" style={{display: 'none'}}>
                        Invalid URL
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={() => router.push('/products')} className="px-4 py-2 rounded border">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60">
                {submitting ? 'Updating...' : 'Update Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
