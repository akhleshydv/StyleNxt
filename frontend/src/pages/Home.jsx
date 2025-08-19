import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";
import authStore from "../store/store.js";

function Home() {
  const currentUser = authStore((state) => state.currentUser);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`, { timeout: 30000 });
        setProducts(response.data.slice(0, 10));
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title" style={{ animation: "slideInUp 0.5s ease-out forwards" }}>Welcome to Clothzy Store</h1>
            <p className="hero-description" style={{ animation: "slideInUp 0.5s ease-out 0.2s forwards", opacity: 0 }}>
              Discover amazing products at great prices. Shop now and enjoy our
              wide selection of items.
            </p>
            <div className="hero-buttons" style={{ animation: "slideInUp 0.5s ease-out 0.4s forwards", opacity: 0 }}>
              <Link to="/products" className="hero-button primary">
                Shop Now
              </Link>
              <Link to="/products" className="hero-button secondary">
                View Collection
              </Link>
            </div>
          </div>
          <div className="hero-image" style={{ animation: "fadeIn 1s ease-in-out forwards" }}>
            <img src="https://chlothzy.shop/assets/hero_img-uMuzwHEB.png" alt="Clothzy Hero" />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products" style={{
        width: '100%',
        margin: '0 auto'
      }}>
        <div className="featured-products-container" style={{
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 8px'
        }}>
          <h2 className="section-title" style={{
            textAlign: 'center',
            margin: '1rem 0',
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>All Products</h2>
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : error ? (
            <div className="error-container">
              <div className="error-message">{error}</div>
            </div>
          ) : (
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
          )}
          <style>
            {`
              @media (min-width: 768px) {
                .featured-products-container {
                  width: 100%;
                  max-width: 1400px;
                  margin: 0 auto;
                  padding: 0 20px;
                }
                .featured-products-container > div {
                  grid-template-columns: repeat(5, 1fr) !important;
                  gap: 20px !important;
                  padding: 0 !important;
                }
              }

              @media (max-width: 767px) {
                .featured-products-container {
                  width: 100%;
                  padding: 0 8px;
                }
                .featured-products-container > div {
                  grid-template-columns: repeat(2, 1fr) !important;
                  gap: 8px !important;
                  padding: 0 !important;
                  box-sizing: border-box !important;
                }
                .section-title {
                  font-size: 1.25rem !important;
                  margin: 1rem 0 !important;
                  text-align: center;
                }
              }

              /* Hover Effects */
              .featured-products a:hover > div {
                transform: translateY(-4px);
              }

              .featured-products a:hover img {
                transform: scale(1.05);
              }
            `}
          </style>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="feature-title">Quality Products</h3>
              <p className="feature-description">
                We offer only the best quality products for our customers.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="feature-title">Fast Delivery</h3>
              <p className="feature-description">
                Quick and reliable delivery to your doorstep.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="feature-title">Easy Shopping</h3>
              <p className="feature-description">
                Simple and secure shopping experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="categories-container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            <Link to="/products" className="category-card">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1adWTqo23A94wcByxX7EO0v0801VvjUO4TuJAcKaPdeKXH11RvU5YXOqJxWal_S62xE0&usqp=CAU"
                alt="Category 1"
              />
              <div className="category-content">
                <h3>New Arrivals</h3>
                <span>Shop Now</span>
              </div>
            </Link>
            <Link to="/products" className="category-card">
              <img
                src="https://hips.hearstapps.com/hmg-prod/images/pritika-swarup-wearing-a-brown-blusa-white-shoes-and-black-news-photo-1672741251.jpg?crop=0.668xw:1.00xh;0,0&resize=640:*"
                alt="Category 2"
              />
              <div className="category-content">
                <h3>Best Sellers</h3>
                <span>Shop Now</span>
              </div>
            </Link>
            <Link to="/products" className="category-card">
              <img
                src="https://southernscholar.com/cdn/shop/articles/Men_s-Summer-Fashion-613288.jpg?v=1708105317&width=1100"
                alt="Category 3"
              />
              <div className="category-content">
                <h3>Special Offers</h3>
                <span>Shop Now</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
