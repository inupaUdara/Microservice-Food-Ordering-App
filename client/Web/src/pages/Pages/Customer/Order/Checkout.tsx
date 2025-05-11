import type React from "react"

import { useCart } from "../../../../contexts/CartContext"
import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { getRestaurantById } from "../../../../services/restaurant/restaurant"
import { createOrder } from "../../../../services/order/order"
import Loader from "../../../Components/Loader"
import { createPaymentIntent } from "../../../../services/payment/payment"
import { useSelector } from "react-redux"
import type { IRootState } from "../../../../store"
import { calculateDistance, calculateFee, geocodeAddress } from "../../../../services/location/mapService"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!)

const CheckoutForm = () => {
  const stripe = useStripe()
  const elements = useElements()
  const { cart, dispatch } = useCart()
  const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardReady, setCardReady] = useState(false)
  const currentUser = useSelector((state: IRootState) => state.userConfig.currentUser)
  const cardElementRef = useRef<typeof CardElement | null>(null)
  const [calculatingDelivery, setCalculatingDelivery] = useState(false)
  const [deliveryError, setDeliveryError] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card")

  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Sri Lanka",
  })

  // In CheckoutForm component
  useEffect(() => {
    const calculateDeliveryFee = async () => {
      if (!restaurant || !shippingAddress.street || !shippingAddress.city || !shippingAddress.country) {
        dispatch({
          type: "UPDATE_DELIVERY_FEE",
          payload: { distance: 0, deliveryFee: 5 },
        })
        return
      }

      try {
        setCalculatingDelivery(true)
        setDeliveryError(null)

        // Construct simpler address
        const restaurantAddress = [
          restaurant.restaurantAddress.street,
          restaurant.restaurantAddress.city,
          restaurant.restaurantAddress.country,
        ]
          .filter(Boolean)
          .join(", ")

        const customerAddress = [shippingAddress.street, shippingAddress.city, shippingAddress.country]
          .filter(Boolean)
          .join(", ")

        // Add timeout between requests
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const [restaurantCoords, customerCoords] = await Promise.all([
          geocodeAddress(restaurantAddress),
          geocodeAddress(customerAddress),
        ])

        // Calculate distance
        const distance = calculateDistance(
          restaurantCoords.lat,
          restaurantCoords.lng,
          customerCoords.lat,
          customerCoords.lng,
        )

        // More realistic delivery fee calculation
        const deliveryFee = calculateFee(distance)

        dispatch({
          type: "UPDATE_DELIVERY_FEE",
          payload: {
            distance: Math.round(distance * 10) / 10,
            deliveryFee,
          },
        })
      } catch (error) {
        console.error("Delivery calculation error:", error)
        setDeliveryError("Estimated delivery fee may not be accurate")
        dispatch({
          type: "UPDATE_DELIVERY_FEE",
          payload: { distance: 0, deliveryFee: 8 }, // Average default
        })
      } finally {
        setCalculatingDelivery(false)
      }
    }

    // Add proper debouncing
    const debounceTimer = setTimeout(calculateDeliveryFee, 2000)
    return () => clearTimeout(debounceTimer)
  }, [shippingAddress, restaurant, dispatch])

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const data = await getRestaurantById(cart.restaurantId!)
        setRestaurant(data)
      } catch (err) {
        setError("Failed to load restaurant details")
      } finally {
        setLoading(false)
      }
    }

    if (cart.restaurantId) {
      fetchRestaurant()
    } else {
      navigate("/restaurants")
      setLoading(false)
    }
  }, [cart.restaurantId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (paymentMethod === "card" && (!stripe || !elements || !cardReady)) {
      setError("Payment system is not ready. Please try again.")
      return
    }

    try {
      if (!currentUser) {
        throw new Error("User is not logged in")
      }

      const requiredFields = [
        shippingAddress.street,
        shippingAddress.city,
        shippingAddress.state,
        shippingAddress.zipCode,
        shippingAddress.country,
      ]

      if (requiredFields.some((field) => !field.trim())) {
        throw new Error("Please fill in all shipping address fields")
      }

      setProcessing(true)

      // Concatenate firstName and lastName to form the full name
      const fullName = `${currentUser.firstName} ${currentUser.lastName}`

      if (paymentMethod === "card") {
        const cardElement = elements!.getElement(CardElement)
        if (!cardElement) {
          throw new Error("Card details are not properly initialized")
        }

        const paymentResponse = await createPaymentIntent(cart.grandTotal, currentUser.id, {
          name: fullName, // Pass full name here
          email: currentUser.email,
          phone: currentUser.phone,
          shippingAddress, // Make sure this includes the full address
        })

        if (!paymentResponse.data?.clientSecret) {
          throw new Error("Failed to initialize payment")
        }

        const { error: stripeError, paymentIntent } = await stripe!.confirmCardPayment(
          paymentResponse.data.clientSecret,
          {
            payment_method: {
              card: cardElement,
              billing_details: {
                address: {
                  line1: shippingAddress.street,
                  city: shippingAddress.city,
                  state: shippingAddress.state,
                  postal_code: shippingAddress.zipCode,
                  country: "LK",
                },
                name: fullName, // Pass full name for billing details
                email: currentUser.email,
                phone: currentUser.phone,
              },
            },
          },
        )

        if (stripeError) {
          throw new Error(stripeError.message || "Payment authorization failed")
        }

        if (paymentIntent?.status === "succeeded") {
          const orderData = {
            restaurantId: cart.restaurantId!,
            products: cart.items.map((item) => ({
              productId: item.productId,
              name: item.name,
              image: item.image,
              quantity: item.quantity,
              price: item.price,
            })),
            totalAmount: cart.total,
            deliveryFee: cart.deliveryFee,
            grandTotal: cart.grandTotal,
            shippingAddress,
            paymentId: paymentIntent.id,
            paymentMethod: "card",
            customerName: fullName, // Use full name here
            customerEmail: currentUser.email,
            customerPhone: currentUser.phone || "+94764874911",
          }

          const orderResponse = await createOrder(orderData)

          if (!orderResponse) {
            throw new Error("Order creation failed")
          }

          dispatch({ type: "CLEAR_CART" })
          navigate("/thank-you", { state: { order: orderResponse } })

        }
      } else {
        // Cash on delivery
        const orderData = {
          restaurantId: cart.restaurantId!,
          products: cart.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            image: item.image,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: cart.total,
          deliveryFee: cart.deliveryFee,
          grandTotal: cart.grandTotal,
          shippingAddress,
          paymentMethod: "cash",
          customerName: fullName,
          customerEmail: currentUser.email,
          customerPhone: currentUser.phone || "+94764874911",
        }

        const orderResponse = await createOrder(orderData)

        if (!orderResponse) {
          throw new Error("Order creation failed")
        }

        dispatch({ type: "CLEAR_CART" })
        navigate("/thank-you", { state: { order: orderResponse } })

      }
    } catch (err: any) {
      console.error("Checkout error:", err)
      setError(err.response?.data?.message || err.message || "Payment processing failed")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Checkout</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Complete your order by providing your delivery and payment details
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Order Summary Section */}
        <div className="lg:col-span-5 lg:order-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden sticky top-8">
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Order Summary</h2>
            </div>

            <div className="p-6">
              {restaurant && (
                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden mr-4 flex-shrink-0">
                      <img
                        src={restaurant.logo || "/assets/images/placeholder.png"}
                        alt={restaurant.restaurantName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/assets/images/placeholder.png"
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">{restaurant.restaurantName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {restaurant.restaurantAddress?.city}, {restaurant.restaurantAddress?.state}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Your Items</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {cart.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                    >
                      <div className="flex items-center">
                        <span className="w-6 h-6 flex items-center justify-center bg-primary/10 text-primary rounded-full text-xs font-medium mr-3">
                          {item.quantity}
                        </span>
                        <span className="text-gray-800 dark:text-white">{item.name}</span>
                      </div>
                      <span className="font-medium text-gray-800 dark:text-white">
                        ${(item.quantity * item.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal:</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <span>Delivery Fee:</span>
                    {calculatingDelivery && (
                      <div className="ml-2 w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                    )}
                  </div>
                  <div>
                    <span>${cart.deliveryFee.toFixed(2)}</span>
                    {cart.distance !== undefined && (
                      <span className="text-xs text-gray-500 ml-2">({cart.distance.toFixed(1)} km)</span>
                    )}
                  </div>
                </div>
                {deliveryError && <div className="text-xs text-amber-500 mt-1">{deliveryError}</div>}
                <div className="flex justify-between text-lg font-bold text-gray-800 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Total:</span>
                  <span>${cart.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form Section */}
        <div className="lg:col-span-7 lg:order-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Delivery & Payment</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Delivery Address</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Street Address
                    </label>
                    <input
                      id="street"
                      type="text"
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="123 Main St"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        City
                      </label>
                      <input
                        id="city"
                        type="text"
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Colombo"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Province
                      </label>
                      <input
                        id="state"
                        type="text"
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Western"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="zipCode"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Postal Code
                      </label>
                      <input
                        id="zipCode"
                        type="text"
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="10100"
                        value={shippingAddress.zipCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Country
                      </label>
                      <input
                        id="country"
                        type="text"
                        required
                        disabled
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed"
                        value={shippingAddress.country}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Payment Method</h3>
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <div
                      className={`flex-1 p-4 border rounded-lg cursor-pointer transition-all ${
                        paymentMethod === "card"
                          ? "border-primary bg-primary/5 dark:bg-primary/10"
                          : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                      }`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                            paymentMethod === "card" ? "border-primary" : "border-gray-400 dark:border-gray-500"
                          }`}
                        >
                          {paymentMethod === "card" && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">Credit / Debit Card</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Pay securely with your card</p>
                        </div>
                      </div>
                    </div>
                    {/* <div
                      className={`flex-1 p-4 border rounded-lg cursor-pointer transition-all ${
                        paymentMethod === "cash"
                          ? "border-primary bg-primary/5 dark:bg-primary/10"
                          : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                      }`}
                      onClick={() => setPaymentMethod("cash")}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                            paymentMethod === "cash" ? "border-primary" : "border-gray-400 dark:border-gray-500"
                          }`}
                        >
                          {paymentMethod === "cash" && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">Cash on Delivery</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Pay when your order arrives</p>
                        </div>
                      </div>
                    </div> */}
                  </div>

                  {paymentMethod === "card" && (
                    <div className="mt-4">
                      <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                        <div className="mb-2">
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Card Information
                            </label>
                            <div className="flex space-x-2">
                              <img src="/assets/images/card-visa.svg" alt="Visa" className="h-6" />
                              <img src="/assets/images/card-mastercard.svg" alt="Mastercard" className="h-6" />
                              <img src="/assets/images/card-americanexpress.svg" alt="Amex" className="h-6" />
                            </div>
                          </div>
                          <div className="p-3 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-500 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                            <CardElement
                              ref={cardElementRef}
                              options={{
                                style: {
                                  base: {
                                    fontSize: "16px",
                                    color: "#424770",
                                    "::placeholder": {
                                      color: "#aab7c4",
                                    },
                                    backgroundColor: "transparent",
                                  },
                                  invalid: {
                                    color: "#e53e3e",
                                  },
                                },
                                hidePostalCode: true,
                              }}
                              onReady={() => setCardReady(true)}
                              onChange={(e) => {
                                setCardReady(e.complete)
                                if (e.error) {
                                  setError(e.error.message)
                                } else {
                                  setError(null)
                                }
                              }}
                            />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Your card information is encrypted and secure. We never store your full card details.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="p-4 mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-400">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={paymentMethod === "card" ? !stripe || !cardReady || processing : processing}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
                  (paymentMethod === "card" && (!stripe || !cardReady || processing)) || processing
                    ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                    : "bg-primary hover:bg-primary-dark"
                }`}
              >
                {processing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Complete Order • $${cart.grandTotal.toFixed(2)}`
                )}
              </button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                By completing this order, you agree to our{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

const CheckoutPage = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
)

export default CheckoutPage
