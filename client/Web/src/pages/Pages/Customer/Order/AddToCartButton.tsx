import Swal from 'sweetalert2';
import { useCart } from '../../../../contexts/CartContext';

const AddToCartButton = ({ restaurantId, item, restaurant }: { restaurantId: string; item: any; restaurant: any }) => {
  const { dispatch } = useCart();

  const showAlert = async (type: number) => {
    if (type === 15) {
        const toast = Swal.mixin({
            toast: true,
            position: 'top-start',
            showConfirmButton: false,
            timer: 3000,
        });
        toast.fire({
            icon: 'success',
            title: 'Item added to cart successfully',
            padding: '10px 20px',
        });
    }
}

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        restaurantId,
        item: {
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image: item.image
        },
        restaurant
      }
    });
    showAlert(15);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="mt-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
    >
      Add to Cart
    </button>
  );
};

export default AddToCartButton;
