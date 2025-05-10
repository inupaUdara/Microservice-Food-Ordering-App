"use client"

import { useState, useRef, useEffect } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { RestaurantCard } from "./RestauratCard"

interface Restaurant {
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

interface RestaurantsGridProps {
  restaurants: Restaurant[]
  loading: boolean
  error: string | null
  onRestaurantClick: (id: string) => void
}

export function RestaurantsGrid({ restaurants, loading, error, onRestaurantClick }: RestaurantsGridProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("rating")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)

  // Close filter panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Filter restaurants based on search term
  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.restaurantAddress?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.restaurantAddress?.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisineType?.some((cuisine) => cuisine.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Sort restaurants based on selected option
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return (b.rating || 0) - (a.rating || 0)
      case "name":
        return a.restaurantName.localeCompare(b.restaurantName)
      case "priceAsc":
        return (a.priceRange || 0) - (b.priceRange || 0)
      case "priceDesc":
        return (b.priceRange || 0) - (a.priceRange || 0)
      default:
        return 0
    }
  })

  // Loading skeletons
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-10 w-[250px] bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-[120px] bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <div className="h-48 w-full rounded-xl bg-gray-200 animate-pulse"></div>
              <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded"></div>
              <div className="flex justify-between">
                <div className="h-4 w-1/4 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-1/4 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="rounded-full bg-red-100 p-3">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">Error Loading Restaurants</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    )
  }

  // Empty state
  if (restaurants.length === 0 || filteredRestaurants.length === 0) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="rounded-full bg-gray-100 p-3">
          <svg
            className="h-6 w-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No Restaurants Found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {searchTerm ? "Try adjusting your search criteria." : "There are no restaurants available at the moment."}
        </p>
        {searchTerm && (
          <button
            className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => setSearchTerm("")}
          >
            Clear Search
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and filter bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search restaurants, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-8 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="rating">Highest Rated</option>
              <option value="name">Name (A-Z)</option>
              {/* <option value="priceAsc">Price (Low to High)</option>
              <option value="priceDesc">Price (High to Low)</option> */}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Filter Restaurants</h3>
                    <button onClick={() => setIsFilterOpen(false)} className="rounded-full p-1 hover:bg-gray-100">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Additional filter options can be implemented here based on available data (cuisine types, price
                      ranges, etc.)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500">
        Showing {sortedRestaurants.length} of {restaurants.length} restaurants
      </div>

      {/* Restaurant grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {sortedRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} onClick={onRestaurantClick} />
        ))}
      </div>
    </div>
  )
}
