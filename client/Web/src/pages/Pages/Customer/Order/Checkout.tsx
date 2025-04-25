import { useCart } from '../../../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const CheckoutPage = () => {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const orderData = {
      restaurantId: cart.restaurantId,
      products: cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      deliveryFee: cart.deliveryFee,
      grandTotal: cart.grandTotal,
      shippingAddress
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) throw new Error('Order failed');

      dispatch({ type: 'CLEAR_CART' });
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Street Address</label>
          <input
            required
            className="w-full p-2 border rounded"
            value={shippingAddress.street}
            onChange={e => setShippingAddress({...shippingAddress, street: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">City</label>
            <input
              required
              className="w-full p-2 border rounded"
              value={shippingAddress.city}
              onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})}
            />
          </div>
          <div>
            <label className="block mb-1">State</label>
            <input
              required
              className="w-full p-2 border rounded"
              value={shippingAddress.state}
              onChange={e => setShippingAddress({...shippingAddress, state: e.target.value})}
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
              onChange={e => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
            />
          </div>
          <div>
            <label className="block mb-1">Country</label>
            <input
              required
              className="w-full p-2 border rounded"
              value={shippingAddress.country}
              onChange={e => setShippingAddress({...shippingAddress, country: e.target.value})}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
