"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setPageTitle } from "../../../../store/themeConfigSlice"
import { Link, useNavigate } from "react-router-dom"
import { getAllUserOrders } from "../../../../services/order/order"
import Loader from "../../../Components/Loader"
import { useWebSocket } from "../../../../utils/socket"
import type { IRootState } from "../../../../store"

const OngoingOrders = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentUser = useSelector((state: IRootState) => state.userConfig.currentUser)
  const { messages } = useWebSocket(currentUser && currentUser.id)

  // Add state for active tab
  const [activeTab, setActiveTab] = useState("ongoing")

  useEffect(() => {
    dispatch(setPageTitle("My Orders"))
  }, [dispatch])

  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await getAllUserOrders()
        console.log("Response:", response)
        // Make sure the response contains the orders array
        const ordersData = response?.orders || response?.data?.orders || response
        setOrders(Array.isArray(ordersData) ? ordersData : [])
        setError(null)
      } catch (error) {
        console.error("Error fetching orders:", error)
        setError("Failed to load orders. Please try again later.")
        setOrders([]) // Ensure orders is always an array
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => {
    const status = (order.status || "").toLowerCase()

    switch (activeTab) {
      case "ongoing":
        return ["pending", "confirmed", "preparing", "out_for_delivery"].includes(status)
      case "delivered":
        return status === "delivered"
      case "cancelled":
        return status === "cancelled"
      default:
        return true // 'all' tab shows everything
    }
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Count orders by status for badge numbers
  const getOrderCounts = () => {
    const counts = {
      all: orders.length,
      ongoing: 0,
      delivered: 0,
      cancelled: 0,
    }

    orders.forEach((order) => {
      const status = (order.status || "").toLowerCase()
      if (["pending", "confirmed", "preparing", "out_for_delivery"].includes(status)) {
        counts.ongoing++
      } else if (status === "delivered") {
        counts.delivered++
      } else if (status === "cancelled") {
        counts.cancelled++
      }
    })

    return counts
  }

  const orderCounts = getOrderCounts()

  if (loading) return <Loader />
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link to="/ongoing-orders" className="text-primary hover:underline">
            Orders
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span> My Orders</span>
        </li>
      </ul>

      {/* Order Status Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mt-6">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-t-lg ${
                activeTab === "all"
                  ? "border-b-2 border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              All Orders
              <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">
                {orderCounts.all}
              </span>
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setActiveTab("ongoing")}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-t-lg ${
                activeTab === "ongoing"
                  ? "border-b-2 border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Ongoing
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                {orderCounts.ongoing}
              </span>
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setActiveTab("delivered")}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-t-lg ${
                activeTab === "delivered"
                  ? "border-b-2 border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Delivered
              <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                {orderCounts.delivered}
              </span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("cancelled")}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-t-lg ${
                activeTab === "cancelled"
                  ? "border-b-2 border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Cancelled
              <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
                {orderCounts.cancelled}
              </span>
            </button>
          </li>
        </ul>
      </div>

      <div className="pt-5">
        {!filteredOrders || filteredOrders.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-gray-500 text-lg mb-4">
              {activeTab === "all" ? "No orders found" : `No ${activeTab} orders found`}
            </div>
            <Link
              to="/restaurants"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                onClick={() => navigate(`/ongoing-orders/${order._id}`)}
                className="bg-white shadow rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div>
                    <h3 className="font-semibold dark:text-white">
                      Order #{order._id?.substring(18, 24)?.toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {order.createdAt ? formatDate(order.createdAt) : "Date not available"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.status || "pending")}`}>
                      {order.status?.replace(/_/g, " ") || "Pending"}
                    </span>
                    <span className="font-bold text-primary">{formatCurrency(order.grandTotal || 0)}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {order.products?.length || 0} item{order.products?.length !== 1 ? "s" : ""} •{" "}
                    {order.shippingAddress?.city || "Location not specified"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OngoingOrders
