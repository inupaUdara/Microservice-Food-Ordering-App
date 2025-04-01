import React from 'react'
import { Link } from 'react-router-dom'
import QuantityControl from '../helper/QuantityControl'

const CartSection = () => {
    return (
        <section className="cart py-80">
            <div className="container container-lg">
                <div className="row gy-4">
                    <div className="col-xl-9 col-lg-8">
                        <div className="cart-table border border-gray-100 rounded-8 px-40 py-48">
                            <div className="overflow-x-auto scroll-sm scroll-sm-horizontal">
                                <table className="table style-three">
                                    <thead>
                                        <tr>
                                            <th className="h6 mb-0 text-lg fw-bold">Delete</th>
                                            <th className="h6 mb-0 text-lg fw-bold">Product Name</th>
                                            <th className="h6 mb-0 text-lg fw-bold">Price</th>
                                            <th className="h6 mb-0 text-lg fw-bold">Quantity</th>
                                            <th className="h6 mb-0 text-lg fw-bold">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="remove-tr-btn flex-align gap-12 hover-text-danger-600"
                                                >
                                                    <i className="ph ph-x-circle text-2xl d-flex" />
                                                    Remove
                                                </button>
                                            </td>
                                            <td>
                                                <div className="table-product d-flex align-items-center gap-24">
                                                    <Link
                                                        to="/product-details-two"
                                                        className="table-product__thumb border border-gray-100 rounded-8 flex-center "
                                                    >
                                                        <img
                                                            src="assets/images/thumbs/product-two-img1.png"
                                                            alt=""
                                                        />
                                                    </Link>
                                                    <div className="table-product__content text-start">
                                                        <h6 className="title text-lg fw-semibold mb-8">
                                                            <Link
                                                                to="/product-details"
                                                                className="link text-line-2"
                                                                tabIndex={0}
                                                            >
                                                                Taylor Farms Broccoli Florets Vegetables
                                                            </Link>
                                                        </h6>
                                                        <div className="flex-align gap-16 mb-16">
                                                            <div className="flex-align gap-6">
                                                                <span className="text-md fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-md fw-semibold text-gray-900">
                                                                    4.8
                                                                </span>
                                                            </div>
                                                            <span className="text-sm fw-medium text-gray-200">
                                                                |
                                                            </span>
                                                            <span className="text-neutral-600 text-sm">
                                                                128 Reviews
                                                            </span>
                                                        </div>
                                                        <div className="flex-align gap-16">
                                                            <Link
                                                                to="/cart"
                                                                className="product-card__cart btn bg-gray-50 text-heading text-sm hover-bg-main-600 hover-text-white py-7 px-8 rounded-8 flex-center gap-8 fw-medium"
                                                            >
                                                                Camera
                                                            </Link>
                                                            <Link
                                                                to="/cart"
                                                                className="product-card__cart btn bg-gray-50 text-heading text-sm hover-bg-main-600 hover-text-white py-7 px-8 rounded-8 flex-center gap-8 fw-medium"
                                                            >
                                                                Videos
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-lg h6 mb-0 fw-semibold">$125.00</span>
                                            </td>
                                            <td>
                                                <QuantityControl initialQuantity={1} />
                                            </td>
                                            <td>
                                                <span className="text-lg h6 mb-0 fw-semibold">$125.00</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="remove-tr-btn flex-align gap-12 hover-text-danger-600"
                                                >
                                                    <i className="ph ph-x-circle text-2xl d-flex" />
                                                    Remove
                                                </button>
                                            </td>
                                            <td>
                                                <div className="table-product d-flex align-items-center gap-24">
                                                    <Link
                                                        to="/product-details-two"
                                                        className="table-product__thumb border border-gray-100 rounded-8 flex-center "
                                                    >
                                                        <img
                                                            src="assets/images/thumbs/product-two-img2.png"
                                                            alt=""
                                                        />
                                                    </Link>
                                                    <div className="table-product__content text-start">
                                                        <h6 className="title text-lg fw-semibold mb-8">
                                                            <Link
                                                                to="/product-details"
                                                                className="link text-line-2"
                                                                tabIndex={0}
                                                            >
                                                                Taylor Farms Broccoli Florets Vegetables
                                                            </Link>
                                                        </h6>
                                                        <div className="flex-align gap-16 mb-16">
                                                            <div className="flex-align gap-6">
                                                                <span className="text-md fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-md fw-semibold text-gray-900">
                                                                    4.8
                                                                </span>
                                                            </div>
                                                            <span className="text-sm fw-medium text-gray-200">
                                                                |
                                                            </span>
                                                            <span className="text-neutral-600 text-sm">
                                                                128 Reviews
                                                            </span>
                                                        </div>
                                                        <div className="flex-align gap-16">
                                                            <Link
                                                                to="/cart"
                                                                className="product-card__cart btn bg-gray-50 text-heading text-sm hover-bg-main-600 hover-text-white py-7 px-8 rounded-8 flex-center gap-8 fw-medium"
                                                            >
                                                                Camera
                                                            </Link>
                                                            <Link
                                                                to="/cart"
                                                                className="product-card__cart btn bg-gray-50 text-heading text-sm hover-bg-main-600 hover-text-white py-7 px-8 rounded-8 flex-center gap-8 fw-medium"
                                                            >
                                                                Videos
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-lg h6 mb-0 fw-semibold">$125.00</span>
                                            </td>
                                            <td>
                                                <QuantityControl initialQuantity={1} />
                                            </td>
                                            <td>
                                                <span className="text-lg h6 mb-0 fw-semibold">$125.00</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="remove-tr-btn flex-align gap-12 hover-text-danger-600"
                                                >
                                                    <i className="ph ph-x-circle text-2xl d-flex" />
                                                    Remove
                                                </button>
                                            </td>
                                            <td>
                                                <div className="table-product d-flex align-items-center gap-24">
                                                    <Link
                                                        to="/product-details-two"
                                                        className="table-product__thumb border border-gray-100 rounded-8 flex-center "
                                                    >
                                                        <img
                                                            src="assets/images/thumbs/product-two-img3.png"
                                                            alt=""
                                                        />
                                                    </Link>
                                                    <div className="table-product__content text-start">
                                                        <h6 className="title text-lg fw-semibold mb-8">
                                                            <Link
                                                                to="/product-details"
                                                                className="link text-line-2"
                                                                tabIndex={0}
                                                            >
                                                                Taylor Farms Broccoli Florets Vegetables
                                                            </Link>
                                                        </h6>
                                                        <div className="flex-align gap-16 mb-16">
                                                            <div className="flex-align gap-6">
                                                                <span className="text-md fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-md fw-semibold text-gray-900">
                                                                    4.8
                                                                </span>
                                                            </div>
                                                            <span className="text-sm fw-medium text-gray-200">
                                                                |
                                                            </span>
                                                            <span className="text-neutral-600 text-sm">
                                                                128 Reviews
                                                            </span>
                                                        </div>
                                                        <div className="flex-align gap-16">
                                                            <Link
                                                                to="/cart"
                                                                className="product-card__cart btn bg-gray-50 text-heading text-sm hover-bg-main-600 hover-text-white py-7 px-8 rounded-8 flex-center gap-8 fw-medium"
                                                            >
                                                                Camera
                                                            </Link>
                                                            <Link
                                                                to="/cart"
                                                                className="product-card__cart btn bg-gray-50 text-heading text-sm hover-bg-main-600 hover-text-white py-7 px-8 rounded-8 flex-center gap-8 fw-medium"
                                                            >
                                                                Videos
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-lg h6 mb-0 fw-semibold">$125.00</span>
                                            </td>
                                            <td>
                                                <QuantityControl initialQuantity={1} />
                                            </td>
                                            <td>
                                                <span className="text-lg h6 mb-0 fw-semibold">$125.00</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="remove-tr-btn flex-align gap-12 hover-text-danger-600"
                                                >
                                                    <i className="ph ph-x-circle text-2xl d-flex" />
                                                    Remove
                                                </button>
                                            </td>
                                            <td>
                                                <div className="table-product d-flex align-items-center gap-24">
                                                    <Link
                                                        to="/product-details-two"
                                                        className="table-product__thumb border border-gray-100 rounded-8 flex-center "
                                                    >
                                                        <img
                                                            src="assets/images/thumbs/product-two-img4.png"
                                                            alt=""
                                                        />
                                                    </Link>
                                                    <div className="table-product__content text-start">
                                                        <h6 className="title text-lg fw-semibold mb-8">
                                                            <Link
                                                                to="/product-details"
                                                                className="link text-line-2"
                                                                tabIndex={0}
                                                            >
                                                                Taylor Farms Broccoli Florets Vegetables
                                                            </Link>
                                                        </h6>
                                                        <div className="flex-align gap-16 mb-16">
                                                            <div className="flex-align gap-6">
                                                                <span className="text-md fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-md fw-semibold text-gray-900">
                                                                    4.8
                                                                </span>
                                                            </div>
                                                            <span className="text-sm fw-medium text-gray-200">
                                                                |
                                                            </span>
                                                            <span className="text-neutral-600 text-sm">
                                                                128 Reviews
                                                            </span>
                                                        </div>
                                                        <div className="flex-align gap-16">
                                                            <Link
                                                                to="/cart"
                                                                className="product-card__cart btn bg-gray-50 text-heading text-sm hover-bg-main-600 hover-text-white py-7 px-8 rounded-8 flex-center gap-8 fw-medium"
                                                            >
                                                                Camera
                                                            </Link>
                                                            <Link
                                                                to="/cart"
                                                                className="product-card__cart btn bg-gray-50 text-heading text-sm hover-bg-main-600 hover-text-white py-7 px-8 rounded-8 flex-center gap-8 fw-medium"
                                                            >
                                                                Videos
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-lg h6 mb-0 fw-semibold">$125.00</span>
                                            </td>
                                            <td>
                                                <QuantityControl initialQuantity={1} />
                                            </td>
                                            <td>
                                                <span className="text-lg h6 mb-0 fw-semibold">$125.00</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex-between flex-wrap gap-16 mt-16">
                                <div className="flex-align gap-16">
                                    <input
                                        type="text"
                                        className="common-input"
                                        placeholder="Coupon Code"
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-main py-18 w-100 rounded-8"
                                    >
                                        Apply Coupon
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    className="text-lg text-gray-500 hover-text-main-600"
                                >
                                    Update Cart
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-4">
                        <div className="cart-sidebar border border-gray-100 rounded-8 px-24 py-40">
                            <h6 className="text-xl mb-32">Cart Totals</h6>
                            <div className="bg-color-three rounded-8 p-24">
                                <div className="mb-32 flex-between gap-8">
                                    <span className="text-gray-900 font-heading-two">Subtotal</span>
                                    <span className="text-gray-900 fw-semibold">$250.00</span>
                                </div>
                                <div className="mb-32 flex-between gap-8">
                                    <span className="text-gray-900 font-heading-two">
                                        Extimated Delivery
                                    </span>
                                    <span className="text-gray-900 fw-semibold">Free</span>
                                </div>
                                <div className="mb-0 flex-between gap-8">
                                    <span className="text-gray-900 font-heading-two">
                                        Extimated Taxs
                                    </span>
                                    <span className="text-gray-900 fw-semibold">USD 10.00</span>
                                </div>
                            </div>
                            <div className="bg-color-three rounded-8 p-24 mt-24">
                                <div className="flex-between gap-8">
                                    <span className="text-gray-900 text-xl fw-semibold">Total</span>
                                    <span className="text-gray-900 text-xl fw-semibold">$250.00</span>
                                </div>
                            </div>
                            <Link
                                to="/checkout"
                                className="btn btn-main mt-40 py-18 w-100 rounded-8"
                            >
                                Proceed to checkout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default CartSection