import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";
import { cartStore } from "../store/store.js";
import authStore from "../store/store.js";

function Cart() {
  const currentUser = authStore((state) => state.currentUser);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [stockError, setStockError] = useState("");

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, {
          withCredentials: true,
        });
        const items = response.data.items.map((item) => ({
          id: item._id,
          productId: item.product?._id || "",
          name: item.product?.name || "Unknown",
          image: item.product?.image || "",
          price: item.product?.price || 0,
          quantity: item.quantity,
          stock: item.product?.stock || 0,
        }));
        setCartItems(items);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Please login to view your cart");
          navigate("/login");
        } else {
          setError("Failed to load cart items");
        }
        setLoading(false);
      }
    };
    fetchCart();
  }, [currentUser, navigate]);

  useEffect(() => {
    const newTotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(newTotal);
  }, [cartItems]);

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    const item = cartItems.find((item) => item.id === id);
    if (!item) return;

    if (newQuantity > item.stock) {
      setStockError(`Only ${item.stock} items available in stock`);
      setTimeout(() => setStockError(""), 3000);
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cart/update/${id}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, {
        withCredentials: true,
      });
      const items = response.data.items.map((item) => ({
        id: item._id,
        productId: item.product?._id || "",
        name: item.product?.name || "Unknown",
        image: item.product?.image || "",
        price: item.product?.price || 0,
        quantity: item.quantity,
        stock: item.product?.stock || 0,
      }));
      setCartItems(items);
      setStockError("");
    } catch (err) {
      setStockError("Failed to update quantity");
      setTimeout(() => setStockError(""), 3000);
    }
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/remove/${id}`, {
        withCredentials: true,
      });
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, {
        withCredentials: true,
      });
      const items = response.data.items.map((item) => ({
        id: item._id,
        productId: item.product?._id || "",
        name: item.product?.name || "Unknown",
        image: item.product?.image || "",
        price: item.product?.price || 0,
        quantity: item.quantity,
        stock: item.product?.stock || 0,
      }));
      setCartItems(items);
      cartStore.getState().fetchAndSetCartCount();
    } catch (err) {
      setStockError("Failed to remove item");
      setTimeout(() => setStockError(""), 3000);
    }
  };

  const handleCheckout = async () => {
    setCheckoutMessage("");
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        {},
        { withCredentials: true }
      );
      setCartItems([]);
      cartStore.getState().fetchAndSetCartCount(); 
      setCheckoutMessage("Order placed successfully! Redirecting to homepage...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setCheckoutMessage("Failed to place order.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <p>{error}</p>
          <Link to="/login" className="login-btn">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-content">
          <h2>{checkoutMessage || "Your Cart is Empty"}</h2>
          {!checkoutMessage && (
            <>
              <p>Looks like you haven't added anything to your cart yet.</p>
              <a href="/products" className="continue-shopping">
                Continue Shopping
              </a>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">Shopping Cart</h1>
        {stockError && (
          <div className="stock-error">
            <p>{stockError}</p>
          </div>
        )}
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image-container">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                  />
                </div>
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price">${item.price.toFixed(2)}</p>
                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="quantity-button"
                    >
                      −
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="quantity-button"
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  <p className="stock-info">Available: {item.stock}</p>
                  <Link to={`/product/${item.productId}`} className="view-details-button">
                    View Details
                  </Link>
                </div>
                <div className="cart-item-total">
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-content">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button className="checkout-button" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
              {checkoutMessage && (
                <div className="checkout-message">{checkoutMessage}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
