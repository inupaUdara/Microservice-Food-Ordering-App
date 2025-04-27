import { useCart } from '../../../../contexts/CartContext';
import IconShoppingCart from '../../../../components/Icon/IconShoppingCart';

import { Link } from 'react-router-dom';
import Dropdown from '../../../../components/Dropdown';
import IconXCircle from '../../../../components/Icon/IconXCircle';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../../store';

const CartIcon = () => {
  const { cart, dispatch } = useCart();
  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

  return (
    <div className="dropdown shrink-0">
      <Dropdown
        offset={[0, 8]}
        placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
        btnClassName="relative block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
        button={
          <span>
            <IconShoppingCart />
            {cart.items.length > 0 && (
              <span className="flex absolute w-3 h-3 ltr:right-0 rtl:left-0 top-0">
                <span className="animate-ping absolute ltr:-left-[3px] rtl:-right-[3px] -top-[3px] inline-flex h-full w-full rounded-full bg-primary/50 opacity-75"></span>
                <span className="relative inline-flex rounded-full w-[6px] h-[6px] bg-primary"></span>
              </span>
            )}
          </span>
        }
      >
        <ul className="!py-0 text-dark dark:text-white-dark w-[300px] sm:w-[350px] divide-y dark:divide-white/10">
          <li onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center px-4 py-2 justify-between font-semibold">
              <h4 className="text-lg">Shopping Cart</h4>
              {cart.items.length > 0 && <span className="badge bg-primary/80">{cart.items.length} Items</span>}
            </div>
          </li>
          {cart.items.length > 0 ? (
            <>
              {cart.items.map((item) => (
                <li key={item.productId} className="dark:text-white-light/90" onClick={(e) => e.stopPropagation()}>
                  <div className="group flex items-center px-4 py-2">
                    <div className="grid place-content-center rounded">
                      <div className="w-12 h-12 relative">
                        <img
                          className="w-12 h-12 rounded-full object-cover"
                          src={item.image || '/assets/images/food-placeholder.png'}
                          alt={item.name}
                        />
                      </div>
                    </div>
                    <div className="ltr:pl-3 rtl:pr-3 flex flex-auto">
                      <div className="ltr:pr-3 rtl:pl-3 flex-1">
                        <h6 className="font-medium">{item.name}</h6>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-300">
                            {item.quantity} x ${item.price.toFixed(2)}
                          </span>
                          <span className="text-xs font-semibold">
                            ${(item.quantity * item.price).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="ltr:ml-auto rtl:mr-auto text-neutral-300 hover:text-danger opacity-0 group-hover:opacity-100"
                        onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.productId })}
                      >
                        <IconXCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
              <li>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold">Subtotal:</span>
                    <span className="font-semibold">${cart.total.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to="/cart"
                      className="btn btn-outline-primary btn-small flex-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Cart
                    </Link>
                    <Link
                      to="/checkout"
                      className="btn btn-primary btn-small flex-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              </li>
            </>
          ) : (
            <li onClick={(e) => e.stopPropagation()}>
              <button type="button" className="!grid place-content-center hover:!bg-transparent text-lg min-h-[200px]">
                <div className="mx-auto ring-4 ring-primary/30 rounded-full mb-4 text-primary">
                  <IconShoppingCart className="w-10 h-10" />
                </div>
                Your cart is empty
              </button>
            </li>
          )}
        </ul>
      </Dropdown>
    </div>
  );
};

export default CartIcon;
