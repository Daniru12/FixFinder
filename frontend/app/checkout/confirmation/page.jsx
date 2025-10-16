'use client';
import React, { useState, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeftIcon, MapPinIcon, PackageIcon, CreditCardIcon, CheckCircleIcon, TruckIcon } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { orderAPI } from '../../utils/api';

export default function OrderConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useContext(AuthContext);
  
  // Get data from URL params
  const productId = searchParams.get('productId');
  const productName = searchParams.get('productName');
  const productPrice = searchParams.get('productPrice');
  const quantityParam = searchParams.get('quantity') || '1';
  const stockQuantity = searchParams.get('stockQuantity') || '10';
  const shippingDataParam = searchParams.get('shippingData');
  
  // Parse shipping data from URL params
  const [shippingData] = useState(() => {
    if (shippingDataParam) {
      try {
        return JSON.parse(decodeURIComponent(shippingDataParam));
      } catch (error) {
        console.error('Error parsing shipping data:', error);
      }
    }
    // Fallback data if parsing fails
    return {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '0771234567',
      address: '123 Main Street',
      city: 'Colombo',
      district: 'Colombo',
      postalCode: '10000',
      country: 'Sri Lanka',
      deliveryInstructions: 'Please call before delivery'
    };
  });

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Convert quantity from string to number
  const quantity = parseInt(quantityParam);

  const productPriceNum = Number(productPrice || 0);
  const deliveryFee = 300;
  const totalAmount = (productPriceNum * quantity) + deliveryFee;

  const placeOrder = async () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions to continue.');
      return;
    }

    if (!user || !token) {
      alert('Please login to place an order.');
      router.push('/login');
      return;
    }

    setIsPlacingOrder(true);
    
    try {
      // Prepare order data according to backend Order model
      const orderData = {
        product: {
          id: parseInt(productId)
        },
        quantity: quantity, // Use quantity from user input
        deliveryFee: deliveryFee,
        paymentMethod: 'COD',
        deliveryAddress: `${shippingData.address}, ${shippingData.city}, ${shippingData.district}, ${shippingData.postalCode}, ${shippingData.country}`,
        notes: `Delivery Instructions: ${shippingData.deliveryInstructions || 'None'} | Customer Phone: ${shippingData.phone} | Customer Email: ${shippingData.email}`,
        status: 'PENDING'
      };
      
      console.log('Order data before sending:', JSON.stringify(orderData, null, 2));

      console.log('Order data to save:', orderData);
      console.log('Token:', token ? 'Present' : 'Missing');
      console.log('User:', user);
      
      // Test backend connectivity first
      try {
        console.log('Testing backend connectivity...');
        const testResponse = await fetch('http://localhost:8080/products');
        console.log('Backend test status:', testResponse.status);
        if (testResponse.ok) {
          const products = await testResponse.json();
          console.log('Products available:', products.length);
          if (products.length === 0) {
            alert('No products found in database. Please create some products first.');
            return;
          }
        } else {
          console.error('Backend not reachable');
          alert('Backend server is not running. Please start your Spring Boot server on port 8080.');
          return;
        }
      } catch (connectError) {
        console.error('Backend connectivity test failed:', connectError);
        alert('Cannot connect to backend server. Please make sure your Spring Boot server is running on port 8080.');
        return;
      }
      
      // Test specific product
      try {
        console.log('Testing specific product...');
        const productResponse = await fetch(`http://localhost:8080/products/${productId}`);
        console.log('Product test status:', productResponse.status);
        if (productResponse.ok) {
          const product = await productResponse.json();
          console.log('Product found:', product);
        } else {
          console.error('Product not found');
          alert(`Product with ID ${productId} not found. Please try a different product.`);
          return;
        }
      } catch (productError) {
        console.error('Product test failed:', productError);
        alert('Error checking product. Please try again.');
        return;
      }
      
      // Call the actual API to save to database
      const response = await orderAPI.create(orderData, token);
      
      if (response.data) {
        // Generate order number for display
        const newOrderNumber = `ORD-${response.data.id}-${Date.now().toString().slice(-6)}`;
        setOrderNumber(newOrderNumber);
        setOrderPlaced(true);
      } else {
        throw new Error('No data returned from server');
      }
      
    } catch (error) {
      console.error('Error placing order:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.error || 'Failed to place order. Please check product availability and try again.';
        alert(`Error: ${errorMessage}`);
      } else if (error.response?.status === 401) {
        alert('Please login to place an order.');
        router.push('/login');
      } else {
        alert('Failed to place order. Please try again.');
      }
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/50 p-8 text-center">
            <div className="mb-6">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-green-600 mb-2">Order Placed Successfully!</h1>
              <p className="text-gray-600">Your order has been confirmed and will be processed soon.</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6 mb-6 border border-green-200">
              <h2 className="text-lg font-semibold text-green-800 mb-2">Order Details</h2>
              <p className="text-green-700"><strong>Order Number:</strong> {orderNumber}</p>
              <p className="text-green-700"><strong>Product:</strong> {productName}</p>
              <p className="text-green-700"><strong>Total Amount:</strong> Rs. {totalAmount.toLocaleString()}</p>
              <p className="text-green-700"><strong>Payment Method:</strong> Cash on Delivery</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">What's Next?</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• You will receive a confirmation email shortly</li>
                <li>• Our team will contact you within 24 hours</li>
                <li>• Delivery will be made within 3-5 business days</li>
                <li>• Payment will be collected upon delivery</li>
              </ul>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/products')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => router.push('/products/my-products')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View My Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-4 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Shipping
          </button>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
            <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Order Confirmation
            </h1>
            <p className="text-gray-600">
              Please review your order details and confirm your purchase
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Details */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <PackageIcon className="h-5 w-5 mr-2 text-blue-600" />
                Product Details
              </h2>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <PackageIcon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{productName}</h3>
                  <p className="text-gray-600 text-sm">Product ID: {productId}</p>
                  <p className="text-blue-600 font-semibold">Rs. {productPriceNum.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2 text-blue-600" />
                Shipping Address
              </h2>
              <div className="text-gray-700">
                <p className="font-medium">{shippingData.firstName} {shippingData.lastName}</p>
                <p>{shippingData.address}</p>
                <p>{shippingData.city}, {shippingData.district}</p>
                <p>{shippingData.postalCode}, {shippingData.country}</p>
                <p className="text-sm text-gray-600 mt-2">Phone: {shippingData.phone}</p>
                {shippingData.deliveryInstructions && (
                  <p className="text-sm text-gray-600">Instructions: {shippingData.deliveryInstructions}</p>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <CreditCardIcon className="h-5 w-5 mr-2 text-blue-600" />
                Payment Method
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <TruckIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800">Cash on Delivery (COD)</h3>
                    <p className="text-green-700 text-sm">Pay when your order arrives</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product Price</span>
                  <span className="font-medium">Rs. {productPriceNum.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium">{quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">Rs. {(productPriceNum * quantity).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">Rs. {deliveryFee.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-800">Total Amount</span>
                    <span className="font-bold text-blue-600 text-lg">Rs. {totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">Delivery Information</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Island-wide delivery available</li>
                  <li>• 3-5 business days delivery</li>
                  <li>• Free delivery for orders over Rs. 5,000</li>
                  <li>• COD available nationwide</li>
                </ul>
              </div>

              {/* Terms and Conditions */}
              <div className="mb-6">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms and Conditions
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>
                    . I understand that payment will be collected upon delivery.
                  </span>
                </label>
              </div>

              {/* Place Order Button */}
              <button
                onClick={placeOrder}
                disabled={!agreedToTerms || isPlacingOrder}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg font-medium"
              >
                {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
