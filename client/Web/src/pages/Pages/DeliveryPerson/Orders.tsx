"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import DriverDashboard from "./Location/DriverDashboard"
import { getDeliveryByDriverId, updateDeliveryStatus } from "../../../services/delivery/delivery"
import { getOrderById } from "../../../services/order/order"
import Loader from "../../Components/Loader"
import { useSelector } from "react-redux"
import type { IRootState } from "../../../store"
import L from "leaflet"
import "leaflet-routing-machine"
import "leaflet/dist/leaflet.css"
import "leaflet-routing-machine/dist/leaflet-routing-machine.css"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { MapPin, Navigation, Package, Truck, CheckCircle, AlertCircle, X, AlertTriangle } from "lucide-react"

// Fix for default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

// Custom marker icons
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

interface Location {
  latitude: number
  longitude: number
}

interface Delivery {
  pickupLocation: Location
  deliveryLocation: Location
  _id: string
  orderId: string
  driverId: string
  status: string
  estimatedTime: number
  createdAt: string
}

const Orders = () => {
  const [delivery, setDelivery] = useState<Delivery | null>(null)
  const [currentUserLocation, setCurrentUserLocation] = useState<Location | null>(null)
  const currentUser = useSelector((state: IRootState) => state.userConfig.currentUser)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [order, setOrder] = useState<any>(null)
  const [showMap, setShowMap] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [routeError, setRouteError] = useState(false)

  // Use refs to prevent infinite loops
  const mapRef = useRef<L.Map | null>(null)
  const routingControlRef = useRef<any>(null)
  const markersRef = useRef<L.Marker[]>([])
  const polylineRef = useRef<L.Polyline | null>(null)

  // Fetch deliveries
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const data = await getDeliveryByDriverId(currentUser?.driverProfile?._id)
        setDelivery(data)
      } catch (err) {
        setError("Failed to fetch deliveries")
      } finally {
        setLoading(false)
      }
    }

    if (currentUser?.driverProfile?._id) {
      fetchDeliveries()
    }
  }, [currentUser?.driverProfile?._id])

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      if (!delivery?.orderId) return

      try {
        setLoading(true)
        const data = await getOrderById(delivery.orderId)
        setOrder(data)
        setError("")
      } catch (error) {
        console.error("Error fetching order:", error)
        setError("Failed to load order details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (delivery?.orderId) {
      fetchOrder()
    }
  }, [delivery])

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value)
    setIsConfirmOpen(true) // Open confirmation modal
  }

  const handleConfirmUpdate = () => {
    if (!selectedStatus || !delivery) return

    setUpdatingStatus(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }

        try {
          await updateDeliveryStatus(delivery._id, selectedStatus, location)
          alert("Delivery status updated successfully")
          window.location.reload() // or re-fetch delivery if you want smoother update
        } catch (error) {
          console.error("Error updating status:", error)
          alert("Failed to update delivery status")
        } finally {
          setUpdatingStatus(false)
          setIsConfirmOpen(false)
        }
      },
      (error) => {
        console.error("Error fetching location:", error)
        alert("Could not fetch current location.")
        setUpdatingStatus(false)
      },
    )
  }

  // Fetch current user location using Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (err) => {
          console.error("Error fetching user location:", err)
          setError("Unable to fetch current location. Using default location.")
          // Fallback to a default location (e.g., city center)
          setCurrentUserLocation({ latitude: 51.505, longitude: -0.09 })
        },
      )
    } else {
      setError("Geolocation is not supported by this browser.")
    }
  }, [])

  // Format time
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  // Function to fetch route from GraphHopper API
  const fetchRouteFromGraphHopper = async (
    points: [number, number][],
  ): Promise<{ coordinates: [number, number][]; distance: number; time: number } | null> => {
    try {
      // Format points for GraphHopper API (longitude,latitude format)
      const pointsParam = points.map((p) => `point=${p[1]},${p[0]}`).join("&")

      // Make request to GraphHopper API
      const response = await fetch(
        `https://graphhopper.com/api/1/route?${pointsParam}&vehicle=car&locale=en&calc_points=true&key=3a1095e8-b1c9-4d0a-a4b2-ae9bd72e1b62`,
      )

      if (!response.ok) {
        throw new Error(`GraphHopper API error: ${response.status}`)
      }

      const data = await response.json()

      if (!data.paths || data.paths.length === 0) {
        throw new Error("No route found")
      }

      // Extract route coordinates (convert from encoded polyline)
      const path = data.paths[0]
      const pointsFromPath = L.Polyline.fromEncoded(path.points).getLatLngs()

      // Convert to [lat, lng] format
      const coordinates = pointsFromPath.map((p: any) => [p.lat, p.lng] as [number, number])

      return {
        coordinates,
        distance: path.distance,
        time: path.time / 1000, // Convert from milliseconds to seconds
      }
    } catch (error) {
      console.error("Error fetching route from GraphHopper:", error)
      return null
    }
  }

  // Function to fetch route from OSRM API
  const fetchRouteFromOSRM = async (
    points: [number, number][],
  ): Promise<{ coordinates: [number, number][]; distance: number; time: number } | null> => {
    try {
      // Format coordinates for OSRM API (longitude,latitude format)
      const coordinates = points.map((p) => `${p[1]},${p[0]}`).join(";")

      // Make request to OSRM API
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`,
      )

      if (!response.ok) {
        throw new Error(`OSRM API error: ${response.status}`)
      }

      const data = await response.json()

      if (!data.routes || data.routes.length === 0) {
        throw new Error("No route found")
      }

      // Extract route coordinates
      const route = data.routes[0]
      const routeCoordinates = route.geometry.coordinates.map(
        (coord: [number, number]) => [coord[1], coord[0]] as [number, number],
      )

      return {
        coordinates: routeCoordinates,
        distance: route.distance,
        time: route.duration,
      }
    } catch (error) {
      console.error("Error fetching route from OSRM:", error)
      return null
    }
  }

  // Function to fetch route from multiple providers with fallback
  const fetchRouteWithFallback = async (points: [number, number][]) => {
    // Try GraphHopper first
    const graphHopperRoute = await fetchRouteFromGraphHopper(points)
    if (graphHopperRoute) {
      return graphHopperRoute
    }

    // If GraphHopper fails, try OSRM
    const osrmRoute = await fetchRouteFromOSRM(points)
    if (osrmRoute) {
      return osrmRoute
    }

    // If all routing services fail, return null
    return null
  }

  // Initialize map when showMap is true and required data is available
  useEffect(() => {
    // Only initialize the map if showMap is true and we have all required data
    if (showMap && delivery && order && currentUserLocation && !mapRef.current) {
      // Create map instance
      const map = L.map("map").setView([currentUserLocation.latitude, currentUserLocation.longitude], 13)
      mapRef.current = map

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      // Add markers with custom icons
      const currentLocationMarker = L.marker([currentUserLocation.latitude, currentUserLocation.longitude], {
        icon: createCustomIcon("#3b82f6"), // blue for current location
      })
        .addTo(map)
        .bindPopup("Current Location")
        .openPopup()

      const pickupMarker = L.marker([delivery.pickupLocation.latitude, delivery.pickupLocation.longitude], {
        icon: createCustomIcon("#10b981"), // green for pickup
      })
        .addTo(map)
        .bindPopup(`Pickup: ${order.restaurant.address.street}, ${order.restaurant.address.city}`)

      const deliveryMarker = L.marker([delivery.deliveryLocation.latitude, delivery.deliveryLocation.longitude], {
        icon: createCustomIcon("#ef4444"), // red for delivery
      })
        .addTo(map)
        .bindPopup(`Delivery: ${order.shippingAddress.street}, ${order.shippingAddress.city}`)

      // Store markers in ref for cleanup
      markersRef.current = [currentLocationMarker, pickupMarker, deliveryMarker]

      // Fit bounds to show all markers
      const bounds = L.latLngBounds([
        [currentUserLocation.latitude, currentUserLocation.longitude],
        [delivery.pickupLocation.latitude, delivery.pickupLocation.longitude],
        [delivery.deliveryLocation.latitude, delivery.deliveryLocation.longitude],
      ])
      map.fitBounds(bounds, { padding: [50, 50] })

      // Define route points
      const routePoints: [number, number][] = [
        [currentUserLocation.latitude, currentUserLocation.longitude],
        [delivery.pickupLocation.latitude, delivery.pickupLocation.longitude],
        [delivery.deliveryLocation.latitude, delivery.deliveryLocation.longitude],
      ]

      // Add a temporary straight line while we fetch the route
      const tempLine = L.polyline(routePoints as L.LatLngExpression[], {
        color: "#6366f1",
        weight: 3,
        opacity: 0.5,
        dashArray: "5, 5",
      }).addTo(map)

      // Fetch route with fallback
      fetchRouteWithFallback(routePoints).then((routeData) => {
        // Remove temporary line
        map.removeLayer(tempLine)

        if (routeData) {
          // Add the actual route
          const routeLine = L.polyline(routeData.coordinates as L.LatLngExpression[], {
            color: "#6366f1",
            weight: 5,
            opacity: 0.8,
          }).addTo(map)

          polylineRef.current = routeLine

          // Add distance and time info
          const distanceKm = (routeData.distance / 1000).toFixed(1)
          const timeMin = Math.round(routeData.time / 60)

          // Add route info to the map
          const routeInfoDiv = L.DomUtil.create("div", "route-info")
          routeInfoDiv.innerHTML = `
            <div class="bg-white p-2 rounded shadow-md text-sm">
              <div><strong>Distance:</strong> ${distanceKm} km</div>
              <div><strong>Est. Time:</strong> ${timeMin} min</div>
            </div>
          `
          const routeInfoControl = L.control({ position: "bottomleft" })
          routeInfoControl.onAdd = () => routeInfoDiv
          routeInfoControl.addTo(map)

          setRouteError(false)
        } else {
          // If route fetching failed, show a fallback straight line
          const fallbackLine = L.polyline(routePoints as L.LatLngExpression[], {
            color: "#6366f1",
            weight: 4,
            opacity: 0.7,
            dashArray: "10, 10",
          }).addTo(map)

          polylineRef.current = fallbackLine
          setRouteError(true)
        }
      })
    }

    // Cleanup function to remove the map when component unmounts or showMap becomes false
    return () => {
      if (mapRef.current) {
        // Clean up markers
        if (markersRef.current.length > 0) {
          markersRef.current.forEach((marker) => {
            if (mapRef.current) mapRef.current.removeLayer(marker)
          })
          markersRef.current = []
        }

        // Clean up polyline
        if (polylineRef.current) {
          if (mapRef.current) mapRef.current.removeLayer(polylineRef.current)
          polylineRef.current = null
        }

        // Remove map
        mapRef.current.remove()
        mapRef.current = null
      }
      if (routingControlRef.current) {
        routingControlRef.current = null
      }
    }
  }, [showMap, delivery, order, currentUserLocation])

  const getStatusBadgeColor = (status: string) => {
    const statusMap: Record<string, string> = {
      assigned: "bg-amber-100 text-amber-800 border-amber-200",
      "picked-up": "bg-blue-100 text-blue-800 border-blue-200",
      "in-transit": "bg-indigo-100 text-indigo-800 border-indigo-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
    }
    return statusMap[status] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "assigned":
        return <Package className="w-4 h-4" />
      case "picked-up":
        return <CheckCircle className="w-4 h-4" />
      case "in-transit":
        return <Truck className="w-4 h-4" />
      case "delivered":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="p-4 text-gray-600">
        <Loader />
      </div>
    )
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <DriverDashboard />
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Active Delivery</h1>

        {delivery ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Delivery Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 lg:col-span-1">
              <div className="mb-4 flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold mb-1 text-gray-800">
                    Order #{delivery.orderId.substring(0, 8)}
                  </h2>
                  <div className="flex items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm flex items-center gap-1.5 border ${getStatusBadgeColor(
                        delivery.status,
                      )}`}
                    >
                      {getStatusIcon(delivery.status)}
                      {delivery.status}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(delivery.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              <div className="space-y-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <MapPin className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 mb-1">Pickup Location</h3>
                      <p className="text-sm text-gray-600 mb-1">{order?.restaurant.name || "Restaurant"}</p>
                      <p className="text-sm text-gray-600">
                        {order?.restaurant.address.street}
                        <br />
                        {order?.restaurant.address.city}, {order?.restaurant.address.state}{" "}
                        {order?.restaurant.address.zipCode}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Navigation className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 mb-1">Delivery Location</h3>
                      <p className="text-sm text-gray-600 mb-1">{order?.user?.name || "Customer"}</p>
                      <p className="text-sm text-gray-600">
                        {order?.shippingAddress.street}
                        <br />
                        {order?.shippingAddress.city}, {order?.shippingAddress.state} {order?.shippingAddress.zipCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-sm mb-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <p className="text-blue-700">Estimated Time:</p>
                </div>
                <div>
                  <p className="font-medium text-blue-800">{formatTime(delivery.estimatedTime)}</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">Update Status:</label>
                <select
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  className="border border-gray-300 rounded-lg px-4 py-2.5 w-full bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Status</option>
                  <option value="picked-up">Picked Up</option>
                  <option value="in-transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              {/* Button to toggle map view */}
              <button
                onClick={() => setShowMap(!showMap)}
                className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                {showMap ? <X className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                {showMap ? "Hide Map" : "View Map"}
              </button>
            </div>

            {/* Map Container */}
            <div className={`lg:col-span-2 ${showMap ? "block" : "hidden"}`}>
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Delivery Route</h2>

                {routeError && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-amber-700">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <p className="text-sm">Could not fetch detailed route. Showing approximate path instead.</p>
                  </div>
                )}

                <div className="relative h-[500px] rounded-lg overflow-hidden border border-gray-200">
                  {!mapRef.current && showMap && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                  )}
                  <div id="map" className="h-full w-full"></div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>Your Location</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Pickup Point</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>Delivery Point</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Active Deliveries</h3>
              <p className="text-gray-500 max-w-md">
                You don't have any active deliveries at the moment. New delivery assignments will appear here.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal - Using Transition for better animation */}
      <Transition appear show={isConfirmOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsConfirmOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Confirm Status Update
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to update the delivery status to{" "}
                      <span className="font-semibold">{selectedStatus}</span>?
                    </p>
                  </div>

                  <div className="mt-6 flex gap-3 justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsConfirmOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleConfirmUpdate}
                      disabled={updatingStatus}
                    >
                      {updatingStatus ? "Updating..." : "Confirm Update"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default Orders
