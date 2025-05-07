import { useCart } from '../../../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getRestaurantById } from '../../../../services/restaurant/restaurant';
import { createOrder } from '../../../../services/order/order';
import Loader from '../../../Components/Loader';
import { createPaymentIntent } from '../../../../services/payment/payment';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../../store';
import { calculateDistance, calculateFee, geocodeAddress } from '../../../../services/location/mapService';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { cart, dispatch } = useCart();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cardReady, setCardReady] = useState(false);
    const currentUser = useSelector((state: IRootState) => state.userConfig.currentUser);
    const cardElementRef = useRef<typeof CardElement | null>(null);
    const [calculatingDelivery, setCalculatingDelivery] = useState(false);
    const [deliveryError, setDeliveryError] = useState<string | null>(null);

    const [shippingAddress, setShippingAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Sri Lanka',
    });

    // In CheckoutForm component
    useEffect(() => {
        const calculateDeliveryFee = async () => {
            if (!restaurant || !shippingAddress.street || !shippingAddress.city || !shippingAddress.country) {
                dispatch({
                    type: 'UPDATE_DELIVERY_FEE',
                    payload: { distance: 0, deliveryFee: 5 },
                });
                return;
            }

            try {
                setCalculatingDelivery(true);
                setDeliveryError(null);

                // Construct simpler address
                const restaurantAddress = [restaurant.restaurantAddress.street, restaurant.restaurantAddress.city, restaurant.restaurantAddress.country].filter(Boolean).join(', ');

                const customerAddress = [shippingAddress.street, shippingAddress.city, shippingAddress.country].filter(Boolean).join(', ');

                // Add timeout between requests
                await new Promise((resolve) => setTimeout(resolve, 1000));

                const [restaurantCoords, customerCoords] = await Promise.all([geocodeAddress(restaurantAddress), geocodeAddress(customerAddress)]);

                // Calculate distance
                const distance = calculateDistance(restaurantCoords.lat, restaurantCoords.lng, customerCoords.lat, customerCoords.lng);

                // More realistic delivery fee calculation
                const deliveryFee = calculateFee(distance);

                dispatch({
                    type: 'UPDATE_DELIVERY_FEE',
                    payload: {
                        distance: Math.round(distance * 10) / 10,
                        deliveryFee,
                    },
                });
            } catch (error) {
                console.error('Delivery calculation error:', error);
                setDeliveryError('Estimated delivery fee may not be accurate');
                dispatch({
                    type: 'UPDATE_DELIVERY_FEE',
                    payload: { distance: 0, deliveryFee: 8 }, // Average default
                });
            } finally {
                setCalculatingDelivery(false);
            }
        };

        // Add proper debouncing
        const debounceTimer = setTimeout(calculateDeliveryFee, 2000);
        return () => clearTimeout(debounceTimer);
    }, [shippingAddress, restaurant, dispatch]);

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const data = await getRestaurantById(cart.restaurantId!);
                setRestaurant(data);
            } catch (err) {
                setError('Failed to load restaurant details');
            } finally {
                setLoading(false);
            }
        };

        if (cart.restaurantId) {
            fetchRestaurant();
        } else {
            navigate('/restaurants');
            setLoading(false);
        }
    }, [cart.restaurantId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
    
        if (!stripe || !elements || !cardReady) {
            setError('Payment system is not ready. Please try again.');
            return;
        }
    
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setError('Card details are not properly initialized');
            return;
        }
    
        try {
            if (!currentUser) {
                throw new Error('User is not logged in');
            }
    
            const requiredFields = [shippingAddress.street, shippingAddress.city, shippingAddress.state, shippingAddress.zipCode, shippingAddress.country];
    
            if (requiredFields.some((field) => !field.trim())) {
                throw new Error('Please fill in all shipping address fields');
            }
    
            setProcessing(true);
    
            // Concatenate firstName and lastName to form the full name
            const fullName = `${currentUser.firstName} ${currentUser.lastName}`;
    
            const paymentResponse = await createPaymentIntent(cart.grandTotal, currentUser.id, {
                name: fullName,  // Pass full name here
                email: currentUser.email,
                phone: currentUser.phone,
                shippingAddress, // Make sure this includes the full address
            });
    
            if (!paymentResponse.data?.clientSecret) {
                throw new Error('Failed to initialize payment');
            }
    
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(paymentResponse.data.clientSecret, {
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
                        name: fullName,  // Pass full name for billing details
                        email: currentUser.email,
                        phone: currentUser.phone,
                    },
                },
            });
    
            if (stripeError) {
                throw new Error(stripeError.message || 'Payment authorization failed');
            }
    
            if (paymentIntent?.status === 'succeeded') {
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
                    customerName: fullName, // Use full name here
                    customerEmail: currentUser.email,
                    customerPhone: '+94764874911',
                    customerName: currentUser.firstName,
                };
    
                const orderResponse = await createOrder(orderData);
    
                if (!orderResponse) {
                    throw new Error('Order creation failed');
                }
    
                dispatch({ type: 'CLEAR_CART' });
                navigate('/ongoing-orders');
            }
        } catch (err: any) {
            console.error('Checkout error:', err);
            setError(err.response?.data?.message || err.message || 'Payment processing failed');
        } finally {
            setProcessing(false);
        }
    };
    
    

    if (loading) return <Loader />;

    return (
        <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

                {restaurant && (
                    <div className="mb-6">
                        <h3 className="font-semibold text-lg mb-2">Restaurant Details</h3>
                        <div className="flex items-center">
                            <img src={restaurant.logo} alt={restaurant.restaurantName} className="w-16 h-16 rounded-full mr-4" />
                            <div>
                                <p className="font-medium">{restaurant.restaurantName}</p>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {restaurant.restaurantAddress?.city}, {restaurant.restaurantAddress?.state}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-2">Your Order</h3>
                    {cart.items.map((item) => (
                        <div key={item.productId} className="flex justify-between items-center py-2">
                            <div className="flex items-center">
                                <span className="mr-2">{item.quantity}x</span>
                                <span>{item.name}</span>
                            </div>
                            <span>${(item.quantity * item.price).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                        <span>Subtotal:</span>
                        <span>${cart.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Delivery Fee:</span>
                        <span>
                            ${cart.deliveryFee.toFixed(2)}
                            {cart.distance !== undefined && <span className="text-sm text-gray-500 ml-2">({cart.distance.toFixed(1)} km)</span>}
                        </span>
                    </div>
                    <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>${cart.grandTotal.toFixed(2)}</span>
                    </div>
                    {calculatingDelivery && <div className="text-sm text-gray-500 mt-2">Calculating delivery fee...</div>}
                    {deliveryError && <div className="text-sm text-red-500 mt-2">{deliveryError}</div>}
                </div>
            </div>
            {/* Payment Form Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-6">Payment Details</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Shipping Address Fields */}
                    <div>
                        <label className="block mb-1">Street Address</label>
                        <input
                            required
                            className="w-full p-2 border rounded"
                            value={shippingAddress.street}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                            onBlur={(e) => {
                                // Trigger calculation when user finishes typing
                                if (e.target.value.trim()) {
                                    const timer = setTimeout(() => {
                                        // Force state update
                                        setShippingAddress((prev) => ({ ...prev }));
                                    }, 1000);
                                    return () => clearTimeout(timer);
                                }
                            }}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1">City</label>
                            <input
                                required
                                className="w-full p-2 border rounded"
                                value={shippingAddress.city}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                onBlur={(e) => {
                                    // Trigger calculation when user finishes typing
                                    if (e.target.value.trim()) {
                                        const timer = setTimeout(() => {
                                            // Force state update
                                            setShippingAddress((prev) => ({ ...prev }));
                                        }, 1000);
                                        return () => clearTimeout(timer);
                                    }
                                }}
                            />
                        </div>
                        <div>
                            <label className="block mb-1">State</label>
                            <input
                                required
                                className="w-full p-2 border rounded"
                                value={shippingAddress.state}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                                onBlur={(e) => {
                                    // Trigger calculation when user finishes typing
                                    if (e.target.value.trim()) {
                                        const timer = setTimeout(() => {
                                            // Force state update
                                            setShippingAddress((prev) => ({ ...prev }));
                                        }, 1000);
                                        return () => clearTimeout(timer);
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1">Zip Code</label>
                            <input
                                required
                                className="w-full p-2 border rounded"
                                value={shippingAddress.zipCode}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                                onBlur={(e) => {
                                    // Trigger calculation when user finishes typing
                                    if (e.target.value.trim()) {
                                        const timer = setTimeout(() => {
                                            // Force state update
                                            setShippingAddress((prev) => ({ ...prev }));
                                        }, 1000);
                                        return () => clearTimeout(timer);
                                    }
                                }}
                            />
                        </div>
                        {/* <div>
                            <label className="block mb-1">Country</label>
                            <input
                                required
                                className="w-full p-2 border rounded"
                                value={shippingAddress.country}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                                // Add this to your address inputs
                                onBlur={(e) => {
                                    // Trigger calculation when user finishes typing
                                    if (e.target.value.trim()) {
                                        const timer = setTimeout(() => {
                                            // Force state update
                                            setShippingAddress((prev) => ({ ...prev }));
                                        }, 1000);
                                        return () => clearTimeout(timer);
                                    }
                                }}
                            />
                        </div> */}
                    </div>

                    <div className="mt-4">
                        <label className="block mb-2">Card Details</label>
                        <div className="p-3 border rounded">
                        <CardElement
                                ref={cardElementRef}
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#424770',
                                            '::placeholder': {
                                                color: '#aab7c4',
                                            },
                                            backgroundColor: 'transparent',
                                        },
                                        invalid: {
                                            color: '#e53e3e',
                                        },
                                    },
                                    hidePostalCode: true,
                                }}
                                onReady={() => setCardReady(true)}
                                onChange={(e) => {
                                    setCardReady(e.complete);
                                    if (e.error) {
                                        setError(e.error.message);
                                    } else {
                                        setError(null);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

                    <button
                        type="submit"
                        disabled={!stripe || !cardReady || processing}
                        className={`w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-all ${!stripe || !cardReady || processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {processing ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            `Pay $${cart.grandTotal.toFixed(2)}`
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

const CheckoutPage = () => (
    <Elements stripe={stripePromise}>
        <CheckoutForm />
    </Elements>
);

export default CheckoutPage;
