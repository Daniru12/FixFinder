"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import axios from "axios";

const ServiceCard = ({
  id,
  name,
  category,
  image,
  location,
  price,
}) => {
  const [rating, setRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        // Fetch approved reviews for this service
        const res = await axios.get(`http://localhost:8080/reviews/service/${id}`);
        const reviews = res.data || [];
        setReviewCount(reviews.length);

        if (reviews.length > 0) {
          const avg =
          reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / reviews.length;
          setRating(avg);
        } else {
          setRating(0);
        }
      } catch (err) {
        console.error("Failed to fetch reviews for service:", err);
      }
    };

    fetchRating();
  }, [id]);

  return (
    <Link href={`/service/${id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
        {/* Image Section */}
        <div className="h-48 overflow-hidden relative">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 bg-teal-600 text-white text-xs font-semibold px-2 py-1 rounded">
            {category}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-800">{name}</h3>

          {/* Rating */}
          <div className="flex items-center mt-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < Math.floor(rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {rating.toFixed(1)} ({reviewCount} reviews)
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <MapPin size={14} className="mr-1" />
            {location}
          </div>

          {/* Price & Action Button */}
          <div className="mt-3 flex justify-between items-center">
            <span className="font-medium text-teal-600">{price}</span>
            <button
              type="button"
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition duration-200"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
