import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getOrderById } from "../../../../services/order/order"
import Loader from "../../../Components/Loader"
import { getDeliveryByOrderId } from "../../../../services/delivery/delivery"
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import FeedbackForm from "./FeedbackForm"
import L from "leaflet"

// Create custom marker icons to fix the default marker issue
// This is needed because the default Leaflet markers often don't display correctly
const createCustomIcon = (iconUrl: string) => {
  return L.icon({
    iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
}

// Define marker icons
const markerIcons = {
  pickup: createCustomIcon("https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png"),
  delivery: createCustomIcon("https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png"),
}

const OrderDetails = () => {
  const { id } = useParams()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [delivery, setDelivery] = useState<any>(null)
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([])
  const [routeLoading, setRouteLoading] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const data = await getOrderById(id)
        setOrder(data)
        setError(null)

        try {
          const deliveryData = await getDeliveryByOrderId(id)
          setDelivery(deliveryData)

          // Fetch the route once we have delivery data
          if (deliveryData) {
            fetchRoute(
              [deliveryData.pickupLocation.latitude, deliveryData.pickupLocation.longitude],
              [deliveryData.deliveryLocation.latitude, deliveryData.deliveryLocation.longitude],
            )
          }
        } catch (deliveryError) {
          console.warn("No delivery found for this order or error fetching delivery.", deliveryError)
          setDelivery(null) // if not found, keep it null
        }
      } catch (error) {
        console.error("Error fetching order:", error)
        setError("Failed to load order details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  // Function to fetch route using OSRM
  const fetchRoute = async (start: [number, number], end: [number, number]) => {
    try {
      setRouteLoading(true)
      // Format coordinates for OSRM API: longitude,latitude
      const startCoord = `${start[1]},${start[0]}`
      const endCoord = `${end[1]},${end[0]}`

      // Call OSRM API to get route
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startCoord};${endCoord}?overview=full&geometries=geojson`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch route")
      }

      const data = await response.json()

      if (data.routes && data.routes.length > 0) {
        // Extract coordinates from the route
        const coordinates = data.routes[0].geometry.coordinates.map(
          (coord: [number, number]) => [coord[1], coord[0]] as [number, number],
        )
        setRouteCoordinates(coordinates)
      }
    } catch (error) {
      console.error("Error fetching route:", error)
      // Fallback to straight line if route fetching fails
      setRouteCoordinates([start, end])
    } finally {
      setRouteLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-purple-100 text-purple-800",
      out_for_delivery: "bg-orange-100 text-orange-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    }
    return statusMap[status.toLowerCase()] || "bg-gray-100 text-gray-800"
  }

  const getStatusSteps = (status: string) => {
    const steps = [
      { id: "pending", label: "Order Placed", completed: true },
      { id: "confirmed", label: "Order Confirmed", completed: status !== "pending" },
      {
        id: "preparing",
        label: "Preparing",
        completed: ["preparing", "out_for_delivery", "delivered"].includes(status),
      },
      { id: "out_for_delivery", label: "On the way", completed: ["out_for_delivery", "delivered"].includes(status) },
      { id: "delivered", label: "Delivered", completed: status === "delivered" },
    ]
    return steps
  }

  if (loading) return <Loader />
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>
  if (!order) return <div className="text-center py-10">Order not found</div>

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link to="/ongoing-orders" className="text-primary hover:underline">
            Orders
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <Link to="/ongoing-orders" className="text-primary hover:underline">
            Ongoing Orders
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Order #{order._id.substring(18, 24).toUpperCase()}</span>
        </li>
      </ul>
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white shadow rounded-lg dark:bg-[#191e3a] overflow-hidden">
          {/* Order Header */}
          <div className="p-6 border-b dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold dark:text-white">
                  Order #{order._id.substring(18, 24).toUpperCase()}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">Placed on {formatDate(order.createdAt)}</p>
              </div>
              <span className={`px-4 py-2 rounded-full font-medium ${getStatusColor(order.status)}`}>
                {order.status.replace(/_/g, " ")}
              </span>
            </div>
          </div>

          {/* Order Progress */}
          <div className="p-6 border-b dark:border-gray-700">
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 transform -translate-y-1/2"></div>
              <div className="relative flex justify-between">
                {getStatusSteps(order.status).map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`text-xs mt-2 text-center ${step.completed ? "text-primary font-medium" : "text-gray-500"}`}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6">
            <h2 className="text-lg font-semibold dark:text-white mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.products.map((product: any) => (
                <div key={product._id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded flex items-center justify-center mr-4">
                      <span className="text-gray-500">IMG</span>
                    </div>
                    <div>
                      <h3 className="font-medium dark:text-white">{product.name}</h3>
                      <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(product.price)}</p>
                    <p className="text-sm text-gray-500">Total: {formatCurrency(product.price * product.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-8 border-t dark:border-gray-700 pt-6">
              <h2 className="text-lg font-semibold dark:text-white mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Delivery Fee</span>
                  <span>{formatCurrency(order.deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t dark:border-gray-700 mt-2">
                  <span className="dark:text-white">Total</span>
                  <span className="text-primary">{formatCurrency(order.grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="mt-8 border-t dark:border-gray-700 pt-6">
              <h2 className="text-lg font-semibold dark:text-white mb-4">Delivery Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium dark:text-white mb-2">Restaurant Details</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {order.restaurant.name}
                    <br />
                    {order.shippingAddress.phone}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium dark:text-white mb-2">Shipping Address</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {order.shippingAddress.street}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    <br />
                    {order.shippingAddress.country}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium dark:text-white mb-2">Contact Information</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="block">Phone: {order.userPhone || "Not provided"}</span>
                    <span className="block">Email: {order.userEmail || "Not provided"}</span>
                  </p>
                </div>
              </div>
            </div>
            {/* Delivery Details (if delivery exists) */}
            {delivery && (
              <div className="mt-8 border-t dark:border-gray-700 pt-6">
                <h2 className="text-lg font-semibold dark:text-white mb-4">Delivery Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium dark:text-white mb-2">Estimated Time</h3>
                    <p className="text-gray-600 dark:text-gray-300">{delivery.estimatedTime} minutes</p>
                  </div>
                  <div>
                    <h3 className="font-medium dark:text-white mb-2">Delivery Status</h3>
                    <p className="text-gray-600 dark:text-gray-300">{delivery.status}</p>
                  </div>
                </div>
              </div>
            )}
            {delivery && (
              <div className="mt-8 border-t dark:border-gray-700 pt-6">
                <h2 className="text-lg font-semibold dark:text-white mb-4">Delivery Route</h2>
                <div className="h-96 w-full relative">
                  {routeLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  )}
                  <MapContainer
                    center={[delivery.pickupLocation.latitude, delivery.pickupLocation.longitude]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    <Marker
                      position={[delivery.pickupLocation.latitude, delivery.pickupLocation.longitude]}
                      icon={markerIcons.pickup}
                    >
                      <Popup>
                        <strong>Pickup Location</strong>
                        <br />
                        {order.restaurant.name}
                      </Popup>
                    </Marker>
                    <Marker
                      position={[delivery.deliveryLocation.latitude, delivery.deliveryLocation.longitude]}
                      icon={markerIcons.delivery}
                    >
                      <Popup>
                        <strong>Delivery Location</strong>
                        <br />
                        {order.shippingAddress.street}, {order.shippingAddress.city}
                      </Popup>
                    </Marker>

                    {/* Display the route */}
                    {routeCoordinates.length > 0 && (
                      <Polyline positions={routeCoordinates} color="#3388ff" weight={5} opacity={0.7} />
                    )}
                  </MapContainer>
                </div>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {routeCoordinates.length > 0
                    ? "Showing actual driving route between pickup and delivery locations."
                    : "Route information is loading or unavailable. Showing direct line."}
                </div>
              </div>
            )}

            {order.status === "delivered" && (
              <FeedbackForm orderId={order._id} restaurantId={order.restaurantId} userId={order.userId} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
