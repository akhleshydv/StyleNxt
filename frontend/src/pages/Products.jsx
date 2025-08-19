import { useState, useEffect } from 'react';
import axios from 'axios';
import './Products.css';
import { Link, useNavigate } from 'react-router-dom';
import { cartStore } from "../store/store.js";
import authStore from "../store/store.js";

function Products() {
  const currentUser = authStore((state) => state.currentUser);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartMessage, setCartMessage] = useState('');
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    if (!currentUser) return;
    
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, { withCredentials: true });
      const items = response.data.items.map(item => ({
        id: item._id,
        productId: item.product?._id,
        quantity: item.quantity,
      }));
      setCartItems(items);
    } catch (err) {
      // Handle authentication errors silently
      if (err.response?.status !== 401) {
        console.error("Error fetching cart:", err);
      }
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`, { timeout: 30000 });
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
    fetchCart();
  }, [currentUser]);

  const handleAddToCart = async (productId, event) => {
    event.preventDefault(); // Prevent navigation to product detail
    
    if (!currentUser) {
      setCartMessage('Please login to add items to cart');
      setTimeout(() => setCartMessage(''), 2000);
      navigate('/login');
      return;
    }

    setCartMessage('');
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/add`,
        { productId, quantity: 1 },
        { withCredentials: true }
      );
      setCartMessage('Product added to cart!');
      fetchCart();
      cartStore.getState().fetchAndSetCartCount();
      setTimeout(() => setCartMessage(''), 2000);
    } catch (err) {
      const msg =
        err.response?.data?.message === 'Authentication required'
          ? 'Please log in to add to cart.'
          : 'Failed to add to cart.';
      setCartMessage(msg);
      setTimeout(() => setCartMessage(''), 2000);
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
          <div className="error-content">
            <div className="error-icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="error-text">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-container" style={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 8px'
      }}>
        <h2 style={{
          textAlign: 'center',
          margin: '1rem 0',
          fontSize: '1.5rem',
          fontWeight: '600'
        }}>Our Collection</h2>
        {cartMessage && (
          <div className="cart-message">
            <span className="cart-message-text">{cartMessage}</span>
          </div>
        )}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
          padding: '0',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {products.map((product) => (
            <Link 
              to={`/product/${product._id}`} 
              key={product._id}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block'
              }}
            >
              <div style={{
                background: '#ffffff',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease'
              }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '133%',
                  overflow: 'hidden'
                }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                </div>
                <div style={{
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}>
                  <h3 style={{
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    color: '#333',
                    margin: 0,
                    lineHeight: '1.2'
                  }}>{product.name}</h3>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '2px'
                  }}>
                    <span style={{
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: '#000'
                    }}>Rs.{product.price}</span>
                    <span style={{
                      fontSize: '0.65rem',
                      color: '#4CAF50'
                    }}>In Stock: {product.stock}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style>
        {`
          .products-page {
            min-height: 100vh;
            background-color: #fff;
            padding: 1rem 0;
          }

          @media (min-width: 768px) {
            .products-container {
              padding: 0 20px !important;
            }
            .products-container > div {
              grid-template-columns: repeat(5, 1fr) !important;
              gap: 20px !important;
            }
          }

          .cart-message {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #1a1a1a;
            color: #ffffff;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease;
          }

          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          a:hover > div {
            transform: translateY(-4px);
          }

          a:hover img {
            transform: scale(1.05);
          }
        `}
      </style>
    </div>
  );
}

export default Products; 