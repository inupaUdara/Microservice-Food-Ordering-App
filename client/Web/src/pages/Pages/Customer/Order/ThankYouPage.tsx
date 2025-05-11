"use client"

import { useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import type { IRootState } from "../../../../store"

const ThankYouPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const order = location.state?.order

  const currentUser = useSelector((state: IRootState) => state.userConfig.currentUser)

  useEffect(() => {
    if (!order) navigate("/")
  }, [order, navigate])

  if (!order) return null

  const customerName = order.customerName || `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim()
  const customerEmail = order.customerEmail || currentUser?.email || ""
  const customerPhone = order.customerPhone || currentUser?.phone || ""
  const shipping = order.shippingAddress
  const orderId = order._id || "D8NQXIKYJ"
  const orderDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-white">
      {/* Confirmation Header */}
      <div className="mb-8 flex items-center">
        <div className="w-14 h-14 rounded-full bg-cyan-500 flex items-center justify-center mr-4 shadow-md animate-appear">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="animate-slide-in">
          <div className="text-gray-500 text-sm font-medium">Confirmation #{orderId}</div>
          <h1 className="text-2xl font-bold text-gray-800">
            Thank you, {currentUser?.firstName || customerName.split(" ")[0] || "Customer"}!
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Order Status Banner */}
          <div className="bg-green-50 border border-green-100 rounded-lg p-5 mb-6 animate-fade-in">
            <div className="flex items-start">
              <div className="bg-green-100 rounded-full p-2 mr-4">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Your order is confirmed</h2>
                <p className="text-gray-600">You'll receive a confirmation email with your order number shortly.</p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="border border-gray-200 rounded-lg overflow-hidden animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Order details</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-3 mb-6">
                    <p className="text-sm text-gray-600">{customerEmail}</p>
                    <p className="text-sm text-gray-600">{customerPhone}</p>
                  </div>

                  {/* Shipping Address */}
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Shipping address
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-800">{customerName}</p>
                    <p className="text-sm text-gray-600">{shipping.street}</p>
                    <p className="text-sm text-gray-600">{shipping.city}, {shipping.state} {shipping.zipCode}</p>
                    <p className="text-sm text-gray-600">{shipping.country}</p>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h13v13H3V3zm13 8h5l3 4v3h-8v-7zm-2 7a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Delivary method
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-3 mb-6">
                    
                    <p className="text-sm text-gray-600 mt-1">Standard Shipping</p>
                  </div>

                  {/* Billing Address */}
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Billing address
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-800">{customerName}</p>
                    <p className="text-sm text-gray-600">{shipping.street}</p>
                    <p className="text-sm text-gray-600">{shipping.city}, {shipping.state} {shipping.zipCode}</p>
                    <p className="text-sm text-gray-600">{shipping.country}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="border border-gray-200 rounded-lg overflow-hidden sticky top-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Order summary</h2>
              <p className="text-xs text-gray-500 mt-1">Placed on {orderDate}</p>
            </div>
            <div className="p-6">
              {/* Products */}
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                {order.products.map((item, index) => (
                  <div key={item.productId || index} className="flex items-start pb-4 border-b border-gray-100 group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <div className="relative mr-3 flex-shrink-0">
                      <div className="w-16 h-16 bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm group-hover:shadow transition-shadow">
                        <img
                          src={item.image || "/assets/images/placeholder.png"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/assets/images/placeholder.png"
                          }}
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs shadow-sm">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        LKR {item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-800">Rs {item.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">Rs {order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Rs {order.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-200 mt-2">
                  <span className="font-semibold text-gray-800 text-base">Total</span>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">LKR</div>
                    <div className="font-bold text-gray-800 text-lg">Rs {order.grandTotal.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 flex flex-col md:flex-row justify-between items-center border-t border-gray-200 pt-8 animate-fade-in" style={{ animationDelay: "0.5s" }}>
        <div className="mb-6 md:mb-0 flex items-center">
          <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-gray-500">Need help? </span>
          <a href="/restaurants" className="text-sm text-cyan-500 hover:text-cyan-600 ml-1 hover:underline transition-colors">
            Contact us
          </a>
        </div>
        <button
          onClick={() => navigate("/restaurants")}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-8 py-3 rounded-lg transition-all shadow-sm hover:shadow transform hover:-translate-y-0.5 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Continue shopping
        </button>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes appear {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-appear {
          animation: appear 0.4s ease-out forwards;
        }

        .animate-slide-in {
          animation: slideIn 0.4s ease-out forwards;
        }

        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default ThankYouPage
