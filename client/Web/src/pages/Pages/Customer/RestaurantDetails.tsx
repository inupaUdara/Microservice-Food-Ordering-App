"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getRestaurantById } from "../../../services/restaurant/restaurant"
import Loader from "../../Components/Loader"
import { useDispatch, useSelector } from "react-redux"
import { setPageTitle } from "../../../store/themeConfigSlice"
import MenuDetails from "./MenuDetails"
import { getFeedbacksByRestaurantId } from "../../../services/feedback/feedback"
import type { IRootState } from "../../../store"
import { MapPin, Phone, Mail, User, Star, Calendar, ChevronLeft, Share2, Heart, MessageSquare } from "lucide-react"

const RestaurantDetails = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector((state: IRootState) => state.userConfig.currentUser)
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState<any>(null)
  const [feedbacks, setFeedbacks] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("details")
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (restaurant?.restaurantName) {
      dispatch(setPageTitle(restaurant.restaurantName))
    }
  }, [dispatch, restaurant])

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true)
        const data = await getRestaurantById(id)
        setRestaurant(data)
        setError(null)
      } catch (error) {
        console.error("Error fetching restaurant:", error)
        setError("Failed to load restaurant details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurant()
  }, [id])

  useEffect(() => {
    const fetchRestaurantReview = async () => {
      if (!restaurant) return
      try {
        setLoading(true)
        const data = await getFeedbacksByRestaurantId(restaurant.id)
        setFeedbacks(data)
        setError(null)
      } catch (error) {
        console.error("Error fetching feedback:", error)
        setError("Failed to load restaurant feedback. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurantReview()
  }, [restaurant])

  // Helper function to render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-1 font-medium">{rating.toFixed(1)}</span>
      </div>
    )
  }

  // Get day of week
  const getDayOfWeek = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[new Date().getDay()]
  }

  // Check if restaurant is open now
  const isOpenNow = () => {
    if (!restaurant?.openingHours) return false

    const today = getDayOfWeek()
    const currentHour = new Date().getHours()
    const todayHours = restaurant.openingHours.find((h: any) => h.day === today)

    if (!todayHours) return false

    const openHour = Number.parseInt(todayHours.open.split(":")[0])
    const closeHour = Number.parseInt(todayHours.close.split(":")[0])

    return currentHour >= openHour && currentHour < closeHour
  }

  if (loading) {
    return <Loader />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-red-100 p-3 mb-4">
          <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Error Loading Restaurant</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400 text-center max-w-md">{error}</p>
        <Link
          to="/restaurants"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Restaurants
        </Link>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-gray-100 p-3 mb-4">
          <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Restaurant Not Found</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400 text-center">
          The restaurant you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/restaurants"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Restaurants
        </Link>
      </div>
    )
  }

  return (
    <div className="pb-12">
      {/* Breadcrumb */}
      <ul className="flex space-x-2 rtl:space-x-reverse mb-6">
        <li>
          <Link to="/restaurants" className="text-primary hover:underline">
            Browse
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <Link to="/restaurants" className="text-primary hover:underline">
            Restaurants
          </Link>
        </li>
        {restaurant.restaurantName && (
          <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
            <span className="truncate">{restaurant.restaurantName}</span>
          </li>
        )}
      </ul>

      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10"></div>
        <div className="h-64 md:h-80 w-full bg-gray-200 dark:bg-gray-700">
          <img
            src={restaurant.coverImage || restaurant.logo || "/assets/images/profile-28.jpeg"}
            alt={restaurant.restaurantName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-lg border-4 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-800">
                <img
                  src={restaurant.logo || "/assets/images/profile-28.jpeg"}
                  alt={restaurant.restaurantName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">{restaurant.restaurantName}</h1>
                <div className="flex items-center mt-1 text-white/90">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {restaurant.restaurantAddress.city}, {restaurant.restaurantAddress.state}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                {isOpenNow() ? "Open Now" : "Closed"}
              </div>
              <div className="bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                <span className="font-medium">{restaurant.rating || "0"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b dark:border-gray-700 mb-8">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "details"
                ? "border-b-2 border-primary text-primary dark:text-primary-light"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("menu")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "menu"
                ? "border-b-2 border-primary text-primary dark:text-primary-light"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Menu
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "reviews"
                ? "border-b-2 border-primary text-primary dark:text-primary-light"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Reviews ({feedbacks?.length || 0})
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === "details" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="md:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 dark:text-white">About</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {restaurant.description ||
                  `${restaurant.restaurantName} offers a delightful dining experience with a variety of delicious dishes.
                                Visit us at our location in ${restaurant.restaurantAddress.city} and enjoy our warm hospitality.`}
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 dark:text-white">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium dark:text-white">Address</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {restaurant.restaurantAddress.street}, {restaurant.restaurantAddress.city},{" "}
                      {restaurant.restaurantAddress.state} {restaurant.restaurantAddress.zipCode}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium dark:text-white">Phone</h3>
                    <p className="text-gray-600 dark:text-gray-300">{restaurant.restaurantPhone}</p>
                  </div>
                </div>
                {restaurant.restaurantEmail && (
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium dark:text-white">Email</h3>
                      <p className="text-gray-600 dark:text-gray-300">{restaurant.restaurantEmail}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Owner Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 dark:text-white">Owner Information</h2>
              <div className="flex items-start">
                <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium dark:text-white">Owner</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {restaurant.owner.firstName} {restaurant.owner.lastName}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">{restaurant.owner.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Hours & Map */}
          <div className="space-y-8">
            {/* Opening Hours */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold dark:text-white">Opening Hours</h2>
                <div
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    isOpenNow()
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }`}
                >
                  {isOpenNow() ? "Open Now" : "Closed"}
                </div>
              </div>
              <div className="space-y-2">
                {restaurant.openingHours.map((hours: any) => (
                  <div
                    key={hours._id}
                    className={`flex justify-between py-2 ${
                      hours.day === getDayOfWeek()
                        ? "font-medium text-primary dark:text-primary-light"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    <span>{hours.day}</span>
                    <span>
                      {hours.open} - {hours.close}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Location (Placeholder) */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 dark:text-white">Location</h2>
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                {/* Map would go here - this is a placeholder */}
                <div className="w-full h-full flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <button className="w-full mt-4 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                Get Directions
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "menu" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <MenuDetails restaurant={restaurant} />
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold dark:text-white">Customer Reviews</h2>
          </div>

          {feedbacks?.length > 0 ? (
            <div className="space-y-6">
              {feedbacks.map((feedback: any) => (
                <div key={feedback._id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {feedback.anonymous ? (
                        <User className="h-5 w-5 text-gray-500" />
                      ) : (
                        <div className="w-full h-full bg-primary text-white flex items-center justify-center font-bold">
                          {feedback.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {feedback.anonymous ? "Anonymous" : feedback.name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(feedback.feedbackDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mb-2">{renderStarRating(feedback.rating)}</div>
                      <p className="text-gray-700 dark:text-gray-300">{feedback.message}</p>

                      {feedback.images?.length > 0 && (
                        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                          {feedback.images.map((image: string, index: number) => (
                            <div key={index} className="h-24 w-24 flex-shrink-0 rounded-md overflow-hidden">
                              <div className="w-full h-full bg-gray-200 dark:bg-gray-700"></div>
                              {/* Uncomment when images are available */}
                              {/* <img
                                                                src={`/uploads/feedbacks/${image}`}
                                                                alt="feedback"
                                                                className="w-full h-full object-cover"
                                                            /> */}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Reviews Yet</h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">Be the first to review this restaurant</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default RestaurantDetails
