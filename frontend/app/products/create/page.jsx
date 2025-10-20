'use client';
import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { productAPI } from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import { 
  PlusIcon, 
  X, 
  Upload, 
  Image as ImageIcon, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  ArrowLeft,
  Package,
  DollarSign,
  Hash,
  Tag,
  MapPin,
  FileText,
  Eye,
  EyeOff
} from 'lucide-react';

export default function CreateProductPage() {
  const router = useRouter();
  const { user, token } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
    location: '',
    stockQuantity: '',
    status: 'ACTIVE',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports & Outdoors',
    'Beauty & Health',
    'Toys & Games',
    'Automotive',
    'Food & Beverages',
    'Office Supplies',
    'Jewelry',
    'Furniture',
    'Other'
  ];

  const locations = [
    'Colombo',
    'Kandy',
    'Galle',
    'Negombo',
    'Jaffna',
    'Kurunegala',
    'Ratnapura',
    'Anuradhapura',
    'Polonnaruwa',
    'Batticaloa',
    'Trincomalee',
    'Matale',
    'Nuwara Eliya',
    'Badulla',
    'Moneragala',
    'Hambantota',
    'Matara',
    'Kalutara',
    'Gampaha',
    'Kegalle',
    'Puttalam',
    'Vavuniya',
    'Mannar',
    'Mullaitivu',
    'Kilinochchi'
  ];

  const isAllowed = user && (
    user.role === 'ADMIN' || 
    user.role === 'USER' || 
    user.role === 'PROVIDER' ||
    user.role === 'ROLE_ADMIN' || 
    user.role === 'ROLE_USER' ||
    user.role === 'ROLE_PROVIDER' ||
    (user.serviceType && user.serviceType.trim() !== '')
  );

  // Validation rules
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Product name is required';
        } else if (value.trim().length < 3) {
          newErrors.name = 'Product name must be at least 3 characters';
        } else if (value.trim().length > 100) {
          newErrors.name = 'Product name must be less than 100 characters';
        } else {
          delete newErrors.name;
        }
        break;
      
      case 'description':
        if (!value.trim()) {
          newErrors.description = 'Product description is required';
        } else if (value.trim().length < 10) {
          newErrors.description = 'Description must be at least 10 characters';
        } else if (value.trim().length > 1000) {
          newErrors.description = 'Description must be less than 1000 characters';
        } else {
          delete newErrors.description;
        }
        break;
      
      case 'price':
        if (!value) {
          newErrors.price = 'Price is required';
        } else if (isNaN(value) || parseFloat(value) < 0) {
          newErrors.price = 'Price must be a valid positive number';
        } else if (parseFloat(value) > 1000000) {
          newErrors.price = 'Price must be less than Rs. 1,000,000';
        } else {
          delete newErrors.price;
        }
        break;
      
      case 'stockQuantity':
        if (value === '') {
          newErrors.stockQuantity = 'Stock quantity is required';
        } else if (isNaN(value) || parseInt(value) < 0) {
          newErrors.stockQuantity = 'Stock quantity must be a valid positive number';
        } else if (parseInt(value) > 10000) {
          newErrors.stockQuantity = 'Stock quantity must be less than 10,000';
        } else {
          delete newErrors.stockQuantity;
        }
        break;
      
      case 'category':
        if (!value) {
          newErrors.category = 'Category is required';
        } else {
          delete newErrors.category;
        }
        break;
      
      case 'location':
        if (!value) {
          newErrors.location = 'Location is required';
        } else {
          delete newErrors.location;
        }
        break;
      
      case 'imageUrl':
        if (value && !isValidUrl(value)) {
          newErrors.imageUrl = 'Please enter a valid image URL';
        } else {
          delete newErrors.imageUrl;
        }
        break;
      
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    
    // Validate field on change
    if (touched[name]) {
      validateField(name, value);
    }
    
    // Update image preview
    if (name === 'imageUrl') {
      setImagePreview(value);
    }
  };

  // Image upload functions
  const handleImageUpload = async (file) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }
    
    setUploadingImage(true);
    setError('');
    
    try {
      // For now, we'll create a local object URL for preview
      // In production, you would upload to your backend server
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      setImageFile(file);
      setForm((f) => ({ ...f, imageUrl: objectUrl }));
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (err) {
      console.error('Image processing failed:', err);
      setError('Failed to process image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeImage = () => {
    setImagePreview('');
    setImageFile(null);
    setForm((f) => ({ ...f, imageUrl: '' }));
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  const onBlur = (e) => {
    const { name, value } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    validateField(name, value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isAllowed) return;
    
    // Mark all fields as touched
    const allTouched = Object.keys(form).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    // Validate all fields
    const isValid = Object.keys(form).every(key => validateField(key, form[key]));
    
    if (!isValid) {
      setError('Please fix the errors below before submitting');
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        imageUrl: form.imageUrl.trim() || undefined,
        category: form.category,
        stockQuantity: parseInt(form.stockQuantity),
        status: form.status,
      };
      await productAPI.create(payload, token);
      router.push('/products/my-products');
    } catch (err) {
      setError('Failed to create product. Please check your inputs or permissions.');
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return form.name && form.description && form.category && !errors.name && !errors.description && !errors.category;
      case 2:
        return form.price && form.stockQuantity && form.location && !errors.price && !errors.stockQuantity && !errors.location;
      case 3:
        return true; // Optional fields
      default:
        return false;
    }
  };

  if (!isAllowed) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4 text-center">
          <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">Only providers or admins can create products.</p>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Product</h1>
          <p className="text-gray-600">Fill in the details to add your product to the marketplace</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= step
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step}</span>
                  )}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-4 transition-all duration-300 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Basic Info</span>
            <span>Pricing & Stock</span>
            <span>Media & Settings</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <form onSubmit={onSubmit} className="p-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    Basic Information
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <div className="relative">
                    <input
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      onBlur={onBlur}
                      placeholder="Enter product name"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {touched.name && !errors.name && form.name && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                    )}
                  </div>
                  {touched.name && errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <div className="relative">
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={onChange}
                      onBlur={onBlur}
                      rows={4}
                      placeholder="Describe your product in detail..."
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                        errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                      {form.description.length}/1000
                    </div>
                  </div>
                  {touched.description && errors.description && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={form.category}
                      onChange={onChange}
                      onBlur={onBlur}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <Tag className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                  {touched.category && errors.category && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Pricing & Stock */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Pricing & Stock
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (Rs.) *
                    </label>
                    <div className="relative">
                      <input
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={onChange}
                        onBlur={onBlur}
                        placeholder="0.00"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {touched.price && errors.price && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.price}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <div className="relative">
                      <input
                        name="stockQuantity"
                        type="number"
                        min="0"
                        step="1"
                        value={form.stockQuantity}
                        onChange={onChange}
                        onBlur={onBlur}
                        placeholder="0"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.stockQuantity ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      <Hash className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {touched.stockQuantity && errors.stockQuantity && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.stockQuantity}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <div className="relative">
                    <select
                      name="location"
                      value={form.location}
                      onChange={onChange}
                      onBlur={onBlur}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.location ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select location</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                  {touched.location && errors.location && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Media & Settings */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-purple-600" />
                    Media & Settings
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image
                  </label>
                  
                  {/* Drag and Drop Upload Area */}
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                      dragActive
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    } ${errors.imageUrl ? 'border-red-300 bg-red-50' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    {uploadingImage ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-2" />
                        <p className="text-sm text-gray-600">Uploading image...</p>
                      </div>
                    ) : imagePreview ? (
                      <div className="space-y-4">
                        <div className="relative w-32 h-32 mx-auto border rounded-lg overflow-hidden">
                          <img
                            src={imagePreview}
                            alt="Product preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600">Click or drag to change image</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 p-4 rounded-full mb-4">
                          <Upload className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-lg font-medium text-gray-900 mb-2">Upload Product Image</p>
                        <p className="text-sm text-gray-600 mb-4">
                          Drag and drop an image here, or click to select
                        </p>
                        <div className="text-xs text-gray-500">
                          <p>Supports: JPG, PNG, GIF, WebP</p>
                          <p>Max size: 5MB</p>
                          <p className="text-orange-600 font-medium">Note: Image will be stored locally for preview</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {touched.imageUrl && errors.imageUrl && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.imageUrl}
                    </p>
                  )}
                </div>

                {/* Alternative: Image URL Input */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or enter image URL
                  </label>
                  <div className="relative">
                    <input
                      name="imageUrl"
                      value={form.imageUrl}
                      onChange={onChange}
                      onBlur={onBlur}
                      placeholder="https://example.com/image.jpg"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.imageUrl ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    <ImageIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    If you have an image URL, you can enter it here instead
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Status
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="ACTIVE"
                        checked={form.status === 'ACTIVE'}
                        onChange={onChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Active</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="INACTIVE"
                        checked={form.status === 'INACTIVE'}
                        onChange={onChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Inactive</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  router.push('/products/my-products');
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <div className="flex gap-3">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      prevStep();
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      nextStep();
                    }}
                    disabled={!isStepValid(currentStep)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting || !isStepValid(1) || !isStepValid(2)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Create Product
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


