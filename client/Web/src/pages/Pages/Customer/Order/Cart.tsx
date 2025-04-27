import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../../contexts/CartContext';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid'

const Cart = () => {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();

  if (!cart.items.length) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item.productId} className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img
                src={item.image || '/placeholder-food.jpg'}
                alt={item.name}
                className="w-12 h-12 rounded-md object-cover"
              />
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-gray-500">${item.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => dispatch({
                  type: 'UPDATE_QUANTITY',
                  payload: { productId: item.productId, quantity: item.quantity - 1 }
                })}
                className="p-1 text-gray-500 hover:text-primary"
              >
                <MinusIcon className="w-4 h-4" />
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => dispatch({
                  type: 'UPDATE_QUANTITY',
                  payload: { productId: item.productId, quantity: item.quantity + 1 }
                })}
                className="p-1 text-gray-500 hover:text-primary"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between mb-2">
          <span>Subtotal:</span>
          <span>${cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span>Delivery Fee:</span>
          <span>${cart.deliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>${(cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + cart.deliveryFee).toFixed(2)}</span>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="w-full mt-4 bg-primary text-white py-2 rounded-md hover:bg-primary-dark"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
