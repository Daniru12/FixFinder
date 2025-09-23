'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  SearchIcon,
  ShoppingCartIcon,
  SlidersIcon,
  StarIcon,
  EyeIcon,
} from 'lucide-react';
import ProductDetails from '../components/ProductDetails';

// Sample product data for FixFinder marketplace (tools, equipment, materials)
const products = [
  {
    id: 1,
    title: 'Professional Cordless Drill Set',
    price: 12999,
    rating: 4.8,
    provider: 'ToolMaster Lanka',
    location: 'Colombo',
    category: 'Power Tools',
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 2,
    title: 'Heavy-Duty Angle Grinder',
    price: 8500,
    rating: 4.6,
    provider: 'Lanka Hardware Solutions',
    location: 'Kandy',
    category: 'Power Tools',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 3,
    title: 'Premium Cement (50kg)',
    price: 2450,
    rating: 4.7,
    provider: 'BuildRight Materials',
    location: 'Galle',
    category: 'Building Materials',
    image: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 4,
    title: 'Complete Plumbing Tool Kit',
    price: 15999,
    rating: 4.9,
    provider: 'Master Plumbers',
    location: 'Negombo',
    category: 'Plumbing',
    image: 'https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 5,
    title: 'Electric Circular Saw',
    price: 9999,
    rating: 4.5,
    provider: "Carpenter's Choice",
    location: 'Colombo',
    category: 'Power Tools',
    image: 'https://images.unsplash.com/photo-1613687184123-acd7056e0275?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 6,
    title: 'Professional Paint Sprayer',
    price: 18500,
    rating: 4.7,
    provider: 'Color Master Lanka',
    location: 'Jaffna',
    category: 'Painting',
    image: 'https://images.unsplash.com/photo-1572981272698-c9b1a56a02b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 7,
    title: 'Premium Teak Wood (per cubic ft)',
    price: 5500,
    rating: 4.8,
    provider: 'Lanka Timber House',
    location: 'Kurunegala',
    category: 'Building Materials',
    image: 'https://images.unsplash.com/photo-1520627977056-c307aeb9a625?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 8,
    title: 'Welding Machine Set',
    price: 24999,
    rating: 4.9,
    provider: 'Industrial Tools Lanka',
    location: 'Ratnapura',
    category: 'Electrical',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  },
];

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

export default function ProductsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All Tools');
  const [priceRange, setPriceRange] = useState(25000);
  const [selectedLocations, setSelectedLocations] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Handle location checkbox change
  const handleLocationChange = (location) => {
    setSelectedLocations((prev) => ({
      ...prev,
      [location]: !prev[location],
    }));
  };

  // Filter products based on category, price, and location
  const filteredProducts = products.filter((product) => {
    // Filter by category
    const categoryMatch =
      selectedCategory === 'All Tools' || product.category === selectedCategory;
    // Filter by price
    const priceMatch = product.price <= priceRange;
    // Filter by location
    const locationMatch =
      Object.keys(selectedLocations).length === 0 ||
      !Object.keys(selectedLocations).some((loc) => selectedLocations[loc]) ||
      selectedLocations[product.location];
    // Filter by search term
    const searchMatch =
      searchTerm === '' ||
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.provider.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && priceMatch && locationMatch && searchMatch;
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      {/* Header with search bar */}
      <div className="w-full px-4 sm:px-6 md:px-8 pt-6 pb-4 sticky top-0 z-10 backdrop-blur-md bg-white/30">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            FixFinder Products
          </h1>
          <div className="backdrop-blur-sm bg-white/70 rounded-xl shadow-lg border border-white/50 p-2 flex items-center max-w-2xl mx-auto">
            <SearchIcon className="h-4 w-4 text-blue-600 mr-2" />
            <input
              type="text"
              placeholder="Search for tools, equipment, materials..."
              className="w-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 text-sm py-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main content with sidebar and product grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-8 flex flex-col md:flex-row gap-6">
        {/* Sidebar filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-28 bg-white/60 backdrop-blur-sm rounded-xl p-5 shadow-md border border-white/50">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center">
              <SlidersIcon className="h-4 w-4 mr-2" />
              Filters
            </h2>
            
            {/* Category filters */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Categories
              </h3>
              <div className="flex flex-col gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`
                      px-4 py-2 rounded-full text-sm relative 
                      ${selectedCategory === category ? 'text-white shadow-lg' : 'text-gray-700 hover:text-gray-900'}
                      transition-all duration-300 ease-in-out
                    `}
                    style={{
                      background:
                        selectedCategory === category
                          ? 'linear-gradient(to right, #2563eb, #9333ea, #4f46e5)'
                          : 'transparent',
                      boxShadow:
                        selectedCategory === category
                          ? '0 0 15px rgba(139, 92, 246, 0.3)'
                          : 'none',
                    }}
                  >
                    <span
                      className={`
                      absolute inset-0 rounded-full 
                      ${selectedCategory === category ? '' : 'border border-transparent bg-gradient-to-r from-blue-500/10 to-purple-500/10'}
                    `}
                      style={{
                        padding: '1px',
                        background:
                          selectedCategory === category
                            ? 'none'
                            : 'linear-gradient(to right, #2563eb, #9333ea, #4f46e5)',
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        maskComposite: 'exclude',
                      }}
                    />
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Price filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Price Range
              </h3>
              <div className="px-1">
                <input
                  type="range"
                  min="1000"
                  max="25000"
                  step="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: 'linear-gradient(to right, #2563eb, #9333ea, #4f46e5)',
                  }}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-600">Rs. 1,000</span>
                  <span className="text-sm font-medium text-blue-600">
                    Rs. {priceRange.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Location filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Location
              </h3>
              <div className="space-y-2">
                {locations.map((location) => (
                  <div key={location} className="flex items-center">
                    <input
                      type="checkbox"
                      id={location}
                      checked={selectedLocations[location] || false}
                      onChange={() => handleLocationChange(location)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-purple-500"
                    />
                    <label
                      htmlFor={location}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {location}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] border border-white/50 group"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                      <StarIcon
                        className="h-3 w-3 text-yellow-500 mr-1"
                        fill="currentColor"
                      />
                      <span className="text-xs font-medium text-gray-800">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent line-clamp-2">
                      {product.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      <span className="font-medium text-gray-700">
                        {product.provider}
                      </span>
                      <span className="mx-1">•</span>
                      <span>{product.location}</span>
                    </div>
                    <p className="text-blue-600 font-bold text-xl mb-4">
                      Rs. {product.price.toLocaleString()}
                    </p>
                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-3">
                      <button
                        className="p-2 rounded-lg flex items-center justify-center text-white transition-all duration-300 bg-blue-600 hover:bg-blue-700"
                        aria-label="Add to cart"
                      >
                        <ShoppingCartIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="p-2 rounded-lg flex items-center justify-center text-white transition-all duration-300 bg-purple-600 hover:bg-purple-700"
                        aria-label="View details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">
                  No products match your filters. Try adjusting your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Details Modal/Overlay */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50">
          <ProductDetails 
            product={selectedProduct} 
            onBack={() => setSelectedProduct(null)} 
          />
        </div>
      )}
    </div>
  );
}
