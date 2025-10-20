'use client';
import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, CreditCardIcon, StarIcon, PackageIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function ProductDetails({ product, onBack }) {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(1);
  
  // Get stock quantity from product (default to 10 if not available)
  const stockQuantity = product.stockQuantity || 10;
  const isInStock = stockQuantity > 0;
  if (!product) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/50 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-700 mb-6">
            The product you are looking for does not exist.
          </p>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Products
        </button>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-white/50">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2">
              <div className="h-72 md:h-full overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="md:w-1/2 p-6 md:p-8">
              {/* Category and Rating */}
              <div className="flex justify-between items-center mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {product.category}
                </span>
                <div className="flex items-center">
                  <StarIcon
                    className="h-4 w-4 text-yellow-500 mr-1"
                    fill="currentColor"
                  />
                  <span className="text-sm font-medium text-gray-800">
                    {product.rating}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {product.title}
              </h1>

              {/* Provider and Location */}
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <span className="font-medium text-gray-800">
                  {product.provider}
                </span>
                <span className="mx-1">•</span>
                <span>{product.location}</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-gray-600 text-sm mb-1">Price</p>
                <p className="text-blue-600 font-bold text-3xl">
                  Rs. {product.price.toLocaleString()}
                </p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-gray-800 font-medium mb-2">Description</h3>
                <p className="text-gray-600">
                  This premium {product.title.toLowerCase()} is designed for
                  professionals and DIY enthusiasts alike. Built with
                  high-quality materials, it offers exceptional performance and
                  durability. Available for delivery across Sri Lanka.
                </p>
              </div>

              {/* Stock Information */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <PackageIcon className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-800 font-medium">Availability</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {isInStock ? `${stockQuantity} items in stock` : 'Out of stock'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isInStock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {isInStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              {isInStock && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-gray-800 font-medium">Quantity</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-16 h-10 flex items-center justify-center font-medium text-gray-800 border-x border-gray-300">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(stockQuantity, quantity + 1))}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors"
                        disabled={quantity >= stockQuantity}
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-gray-600">
                      Max: {stockQuantity}
                    </span>
                  </div>
                </div>
              )}

              {/* Buy Now Button */}
              <button
                onClick={() => {
                  if (!isInStock) return;
                  
                  // Check if user is logged in
                  if (!user) {
                    router.push('/register');
                    return;
                  }
                  
                  // Navigate to shipping address page with product info including quantity
                  const params = new URLSearchParams({
                    productId: product.id,
                    productName: product.title,
                    productPrice: product.price.toString(),
                    quantity: quantity.toString(),
                    stockQuantity: stockQuantity.toString(),
                  });
                  router.push(`/checkout/shipping?${params.toString()}`);
                }}
                disabled={!isInStock}
                className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-white transition-all duration-300 shadow-md ${
                  isInStock 
                    ? 'hover:shadow-lg cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
                style={{
                  background: isInStock
                    ? 'linear-gradient(to right, rgba(34, 197, 94, 0.9), rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9))'
                    : 'linear-gradient(to right, rgba(156, 163, 175, 0.9), rgba(107, 114, 128, 0.9))',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <CreditCardIcon className="h-5 w-5" />
                {isInStock ? `Buy Now (${quantity} item${quantity > 1 ? 's' : ''})` : 'Out of Stock'}
              </button>
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="border-t border-gray-200 p-6 md:p-8 bg-white/50">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  Category
                </h3>
                <p className="text-gray-800">{product.category}</p>
              </div>
              <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  Provider
                </h3>
                <p className="text-gray-800">{product.provider}</p>
              </div>
              <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  Location
                </h3>
                <p className="text-gray-800">{product.location}</p>
              </div>
              <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  Rating
                </h3>
                <p className="text-gray-800">{product.rating} / 5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


