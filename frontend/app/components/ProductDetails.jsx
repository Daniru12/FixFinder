'use client';
import React from 'react';
import { ArrowLeftIcon, ShoppingCartIcon, StarIcon } from 'lucide-react';

export default function ProductDetails({ product, onBack }) {
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
              <div className="mb-8">
                <h3 className="text-gray-800 font-medium mb-2">Description</h3>
                <p className="text-gray-600">
                  This premium {product.title.toLowerCase()} is designed for
                  professionals and DIY enthusiasts alike. Built with
                  high-quality materials, it offers exceptional performance and
                  durability. Available for delivery across Sri Lanka.
                </p>
              </div>

              {/* Add to Cart Button */}
              <button
                className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-white transition-all duration-300 shadow-md hover:shadow-lg"
                style={{
                  background:
                    'linear-gradient(to right, rgba(37, 99, 235, 0.9), rgba(147, 51, 234, 0.9), rgba(79, 70, 229, 0.9))',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                Add to Cart
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


