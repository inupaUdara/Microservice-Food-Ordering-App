"use client"

import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { setPageTitle } from "../../../store/themeConfigSlice"
import { getAllRestaurants } from "../../../services/restaurant/restaurant"
import { RestaurantsGrid } from "./Restaurant/RestaurantGrid"
import Loader from "../../Components/Loader"

const Restaurants = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(setPageTitle("Restaurants"))
  }, [dispatch])

  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleRestaurantClick = (id: string) => {
    navigate(`/restaurants/${id}`)
  }

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true)
        const data = await getAllRestaurants()

        // Enhance the data with mock information for UI demonstration
        // In a real app, this would come from the API
        const enhancedData = data.map((restaurant: any) => ({
          ...restaurant,
        //   cuisineType: getRandomCuisines(),
          priceRange: Math.floor(Math.random() * 4) + 1,
          openingHours: "10:00 AM - 10:00 PM",
          isOpen: Math.random() > 0.2, // 80% chance of being open
        }))

        setRestaurants(enhancedData)
        setError(null)
      } catch (error) {
        console.error("Error fetching restaurants:", error)
        setError("Failed to load restaurants. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [])

  // Helper function to generate random cuisine types for demo
//   const getRandomCuisines = () => {
//     const cuisines = [
//       "Italian",
//       "Mexican",
//       "Chinese",
//       "Japanese",
//       "Indian",
//       "Thai",
//       "American",
//       "French",
//       "Mediterranean",
//       "Greek",
//     ]
//     const count = Math.floor(Math.random() * 3) + 1
//     const selected = []

//     for (let i = 0; i < count; i++) {
//       const randomIndex = Math.floor(Math.random() * cuisines.length)
//       if (!selected.includes(cuisines[randomIndex])) {
//         selected.push(cuisines[randomIndex])
//       }
//     }

//     return selected
//   }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link to="/restaurants" className="text-blue-600 hover:underline">
            Browse
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Restaurants</span>
        </li>
      </ul>

      {/* Main content */}
      <RestaurantsGrid
        restaurants={restaurants}
        loading={loading}
        error={error}
        onRestaurantClick={handleRestaurantClick}
      />
    </div>
  )
}

export default Restaurants
