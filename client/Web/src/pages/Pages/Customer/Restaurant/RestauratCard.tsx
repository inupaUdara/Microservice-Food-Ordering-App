"use client"

import { useState } from "react"
import { Star, MapPin, Clock, DollarSign, ChevronRight } from "lucide-react"

interface RestaurantCardProps {
  restaurant: {
    id: string
    restaurantName: string
    logo?: string
    restaurantAddress?: {
      city?: string
      state?: string
    }
    rating?: number
    cuisineType?: string[]
    priceRange?: number
    openingHours?: string
    isOpen?: boolean
  }
  onClick: (id: string) => void
}

export function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  const [imageError, setImageError] = useState(false)

  // Generate price indicators based on price range (1-4)
  const renderPriceRange = () => {
    const range = restaurant.priceRange || 2
    return (
      <div className="flex items-center text-gray-500">
        {[...Array(4)].map((_, i) => (
          <DollarSign key={i} size={14} className={`mr-0.5 ${i < range ? "text-gray-700" : "opacity-30"}`} />
        ))}
      </div>
    )
  }

  // Generate star rating
  const renderRating = () => {
    const rating = restaurant.rating || 0
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`fill-current ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    )
  }

  // Status badge classes
  const statusBadgeClasses = `absolute top-3 right-3 z-10 rounded-full px-2 py-1 text-xs font-medium ${
    restaurant.isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }`

  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md cursor-pointer"
      onClick={() => onClick(restaurant.id)}
    >
      {/* Restaurant status badge */}
      {restaurant.isOpen !== undefined && (
        <div className={statusBadgeClasses}>{restaurant.isOpen ? "Open" : "Closed"}</div>
      )}

      {/* Image container */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        {!imageError ? (
          <img
            src={restaurant.logo || "/assets/images/profile-28.jpeg"}
            alt={restaurant.restaurantName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <span className="text-2xl font-bold text-gray-400">{restaurant.restaurantName.charAt(0)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="font-bold text-xl truncate">{restaurant.restaurantName}</h3>
          <ChevronRight className="h-5 w-5 text-gray-500 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        {/* Location */}
        {restaurant.restaurantAddress && (
          <div className="mb-2 flex items-center text-sm text-gray-500">
            <MapPin className="mr-1 h-4 w-4" />
            <span>
              {restaurant.restaurantAddress.city}
              {restaurant.restaurantAddress.state && `, ${restaurant.restaurantAddress.state}`}
            </span>
          </div>
        )}

        {/* Hours */}
        {restaurant.openingHours && (
          <div className="mb-2 flex items-center text-sm text-gray-500">
            <Clock className="mr-1 h-4 w-4" />
            <span>{restaurant.openingHours}</span>
          </div>
        )}

        {/* Cuisine tags */}
        {restaurant.cuisineType && restaurant.cuisineType.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {restaurant.cuisineType.map((cuisine, index) => (
              <span
                key={index}
                className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
              >
                {cuisine}
              </span>
            ))}
          </div>
        )}

        {/* Footer with rating and price */}
        <div className="mt-3 flex items-center justify-between border-t pt-3">
          {renderRating()}
          {renderPriceRange()}
        </div>
      </div>
    </div>
  )
}
