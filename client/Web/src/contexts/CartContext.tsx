import React, { createContext, useContext, useReducer } from 'react';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  restaurantId: string | null;
  items: CartItem[];
  total: number;
  deliveryFee: number;
  grandTotal: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { restaurantId: string; item: CartItem } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  cart: CartState;
  dispatch: React.Dispatch<CartAction>;
}>({
  cart: {
    restaurantId: null,
    items: [],
    total: 0,
    deliveryFee: 5,
    grandTotal: 5,
  },
  dispatch: () => null,
});

// Helper function to calculate totals
const calculateTotals = (items: CartItem[], deliveryFee: number) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const grandTotal = total + deliveryFee;
  return { total, grandTotal };
};

function cartReducer(state: CartState, action: CartAction): CartState {
  let newItems = [...state.items];

  switch (action.type) {
    case 'ADD_ITEM': {
      if (state.restaurantId && state.restaurantId !== action.payload.restaurantId) {
        alert('You can only order from one restaurant at a time. Please clear your cart first.');
        return state;
      }

      const existingIndex = newItems.findIndex(
        item => item.productId === action.payload.item.productId
      );

      if (existingIndex > -1) {
        newItems[existingIndex].quantity += action.payload.item.quantity;
      } else {
        newItems.push(action.payload.item);
      }

      const { total, grandTotal } = calculateTotals(newItems, state.deliveryFee);
      return {
        ...state,
        restaurantId: action.payload.restaurantId,
        items: newItems,
        total,
        grandTotal,
      };
    }

    case 'UPDATE_QUANTITY': {
      newItems = newItems
        .map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
        .filter(item => item.quantity > 0);

      const { total, grandTotal } = calculateTotals(newItems, state.deliveryFee);
      return {
        ...state,
        items: newItems,
        total,
        grandTotal,
      };
    }

    case 'REMOVE_ITEM': {
      newItems = newItems.filter(item => item.productId !== action.payload);
      const { total, grandTotal } = calculateTotals(newItems, state.deliveryFee);
      return {
        ...state,
        items: newItems,
        total,
        grandTotal,
      };
    }

    case 'CLEAR_CART': {
      return {
        restaurantId: null,
        items: [],
        total: 0,
        deliveryFee: 5,
        grandTotal: 5,
      };
    }

    default:
      return state;
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, {
    restaurantId: null,
    items: [],
    total: 0,
    deliveryFee: 5,
    grandTotal: 5,
  });

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
