import './About.css';

function About() {
  return (
    <div className="about-container">
      <div className="about-content">
        <section className="about-hero">
          <h1>About ClothzyStore</h1>
          <p className="about-tagline">
            Your Fashion Destination for Quality and Style
          </p>
        </section>

        <section className="about-story">
          <h2>Our Story</h2>
          <p>
            Founded in 2024, Clothzy emerged from a simple yet powerful idea: to make quality fashion accessible to everyone. 
            What started as a small online store has grown into a beloved fashion destination, serving customers worldwide with 
            our commitment to quality, style, and exceptional service.
          </p>
        </section>

        <section className="about-mission">
          <h2>Our Mission</h2>
          <p>
            At Clothzy, we believe that everyone deserves to look and feel their best. Our mission is to provide 
            high-quality clothing that combines style, comfort, and affordability. We're committed to sustainable 
            practices and ethical manufacturing, ensuring that our success contributes positively to both our 
            customers and the environment.
          </p>
        </section>

        <section className="about-values">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Quality</h3>
              <p>We never compromise on the quality of our products, ensuring that every item meets our high standards.</p>
            </div>
            <div className="value-card">
              <h3>Sustainability</h3>
              <p>We're committed to reducing our environmental impact through sustainable practices and materials.</p>
            </div>
            <div className="value-card">
              <h3>Customer Focus</h3>
              <p>Your satisfaction is our priority. We're dedicated to providing exceptional service and support.</p>
            </div>
            <div className="value-card">
              <h3>Innovation</h3>
              <p>We continuously evolve our designs and processes to stay ahead of fashion trends and customer needs.</p>
            </div>
          </div>
        </section>

        
      </div>
    </div>
  );
}

export default About; 