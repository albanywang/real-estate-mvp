import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Import helpers and icons from the map component
// In a real application, these would be in separate utility files
import L from 'leaflet';

// Fix for default markers not showing in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Format price with commas and $ sign
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(price);
};

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [user, setUser] = useState(null); // In a real app, this would come from auth context
  const [isSaved, setIsSaved] = useState(false);

  // Fetch property data
  useEffect(() => {
    const fetchPropertyDetail = async () => {
      setLoading(true);
      try {
        // In a real app, you'd get the user from auth context
        // For this example, we'll assume user_id 1
        const userId = user?.id || 1;
        
        const response = await axios.get(`/api/properties/${id}?user_id=${userId}`);
        setProperty(response.data.data);
        
        // Check if property is saved
        if (user) {
          try {
            const savedResponse = await axios.get(`/api/properties/saved/${userId}`);
            const savedProperties = savedResponse.data.data;
            setIsSaved(savedProperties.some(p => p.property_id === parseInt(id)));
          } catch (err) {
            console.error('Error checking saved status:', err);
          }
        }
      } catch (err) {
        console.error('Error fetching property details:', err);
        setError('Failed to load property details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetail();
  }, [id, user]);

  // Toggle saved status
  const toggleSaved = async () => {
    if (!user) {
      // Redirect to login or show login modal
      return;
    }

    try {
      if (isSaved) {
        await axios.delete(`/api/properties/${id}/save`, {
          data: { user_id: user.id }
        });
      } else {
        await axios.post(`/api/properties/${id}/save`, {
          user_id: user.id
        });
      }
      
      setIsSaved(!isSaved);
    } catch (err) {
      console.error('Error toggling saved status:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading property details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!property) {
    return <div className="not-found">Property not found</div>;
  }

  return (
    <div className="property-detail-container">
      <div className="property-detail-header">
        <div className="property-detail-title">
          <h1>{property.title}</h1>
          <p className="property-detail-address">
            {property.street_address}, {property.city}, {property.state} {property.zip_code}
          </p>
        </div>
        
        <div className="property-detail-actions">
          <div className="property-detail-price">{formatPrice(property.price)}</div>
          <button 
            className={`save-button ${isSaved ? 'saved' : ''}`}
            onClick={toggleSaved}
          >
            {isSaved ? 'Saved ★' : 'Save ☆'}
          </button>
        </div>
      </div>
      
      <div className="property-detail-gallery">
        <div className="gallery-main">
          {property.images && property.images.length > 0 && (
            <img 
              src={property.images[activeImage].image_url} 
              alt={`Property ${activeImage + 1}`} 
              className="main-image"
            />
          )}
        </div>
        
        <div className="gallery-thumbnails">
          {property.images && property.images.map((image, index) => (
            <div 
              key={image.image_id} 
              className={`thumbnail ${index === activeImage ? 'active' : ''}`}
              onClick={() => setActiveImage(index)}
            >
              <img src={image.image_url} alt={`Thumbnail ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
      
      <div className="property-detail-content">
        <div className="property-detail-info">
          <div className="property-overview">
            <h2>Overview</h2>
            <div className="property-specs">
              <div className="spec">
                <div className="spec-value">{property.bedrooms}</div>
                <div className="spec-label">Bedrooms</div>
              </div>
              <div className="spec">
                <div className="spec-value">{property.bathrooms}</div>
                <div className="spec-label">Bathrooms</div>
              </div>
              <div className="spec">
                <div className="spec-value">{property.square_feet}</div>
                <div className="spec-label">Square Feet</div>
              </div>
              <div className="spec">
                <div className="spec-value">{property.year_built}</div>
                <div className="spec-label">Year Built</div>
              </div>
              <div className="spec">
                <div className="spec-value">{property.lot_size?.toFixed(2) || 'N/A'}</div>
                <div className="spec-label">Lot Size (acres)</div>
              </div>
              <div className="spec">
                <div className="spec-value">{property.property_type}</div>
                <div className="spec-label">Type</div>
              </div>
            </div>
          </div>
          
          <div className="property-description">
            <h2>Description</h2>
            <p>{property.description}</p>
          </div>
          
          <div className="property-features">
            <h2>Features</h2>
            <ul className="features-list">
              {property.features && property.features.map((feature, index) => (
                <li key={index} className="feature-item">{feature}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="property-detail-sidebar">
          <div className="agent-info">
            <h3>Listing Agent</h3>
            {property.agent && (
              <div className="agent-card">
                <div className="agent-avatar">
                  {/* Placeholder for agent photo, in a real app would use property.agent.photo_url */}
                  <div className="avatar-placeholder">
                    {property.agent.first_name.charAt(0)}{property.agent.last_name.charAt(0)}
                  </div>
                </div>
                <div className="agent-details">
                  <div className="agent-name">{property.agent.first_name} {property.agent.last_name}</div>
                  <div className="agent-contact">
                    <a href={`mailto:${property.agent.email}`}>{property.agent.email}</a>
                    <a href={`tel:${property.agent.phone}`}>{property.agent.phone}</a>
                  </div>
                </div>
              </div>
            )}
            
            <div className="contact-buttons">
              <button className="contact-button email">Email Agent</button>
              <button className="contact-button call">Call Agent</button>
              <button className="contact-button tour">Schedule Tour</button>
            </div>
          </div>
          
          <div className="property-map-container">
            <h3>Location</h3>
            <div className="property-map">
              <MapContainer 
                center={[property.latitude, property.longitude]} 
                zoom={15} 
                style={{ height: '250px', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[property.latitude, property.longitude]}>
                  <Popup>
                    {property.street_address}<br />
                    {property.city}, {property.state} {property.zip_code}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
            <p className="neighborhood-info">
              <strong>Neighborhood:</strong> {property.neighborhood}
            </p>
          </div>
        </div>
      </div>
      
      {property.nearby_properties && property.nearby_properties.length > 0 && (
        <div className="nearby-properties">
          <h2>Nearby Properties</h2>
          <div className="nearby-properties-grid">
            {property.nearby_properties.map(nearbyProperty => (
              <Link 
                to={`/properties/${nearbyProperty.property_id}`} 
                key={nearbyProperty.property_id}
                className="nearby-property-card"
              >
                <div className="nearby-property-image">
                  <img 
                    src={nearbyProperty.primary_image} 
                    alt={nearbyProperty.title} 
                  />
                </div>
                <div className="nearby-property-details">
                  <h3>{nearbyProperty.title}</h3>
                  <div className="nearby-property-price">
                    {formatPrice(nearbyProperty.price)}
                  </div>
                  <div className="nearby-property-specs">
                    {nearbyProperty.bedrooms} BD | {nearbyProperty.bathrooms} BA
                  </div>
                  <div className="nearby-property-distance">
                    {(nearbyProperty.distance / 1609.34).toFixed(1)} miles away
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Add CSS for styling the property detail page
const PropertyDetailCSS = `
  .property-detail-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .property-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
  }
  
  .property-detail-title h1 {
    margin: 0 0 10px 0;
    font-size: 32px;
    font-weight: 600;
  }
  
  .property-detail-address {
    color: #6e84a3;
    font-size: 16px;
    margin: 0;
  }
  
  .property-detail-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  
  .property-detail-price {
    font-size: 28px;
    font-weight: 700;
    color: #2c7be5;
    margin-bottom: 10px;
  }
  
  .save-button {
    background-color: white;
    border: 1px solid #2c7be5;
    color: #2c7be5;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s;
  }
  
  .save-button:hover {
    background-color: #edf2f9;
  }
  
  .save-button.saved {
    background-color: #2c7be5;
    color: white;
  }
  
  .property-detail-gallery {
    margin-bottom: 30px;
  }
  
  .gallery-main {
    width: 100%;
    height: 500px;
    margin-bottom: 10px;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .main-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .gallery-thumbnails {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 10px;
  }
  
  .thumbnail {
    width: 100px;
    height: 75px;
    flex-shrink: 0;
    cursor: pointer;
    border-radius: 4px;
    overflow: hidden;
    border: 2px solid transparent;
    transition: all 0.2s;
  }
  
  .thumbnail.active {
    border-color: #2c7be5;
  }
  
  .thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .property-detail-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 30px;
  }
  
  .property-overview {
    margin-bottom: 30px;
  }
  
  .property-specs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  
  .spec {
    text-align: center;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 6px;
  }
  
  .spec-value {
    font-size: 24px;
    font-weight: 600;
    color: #2c7be5;
    margin-bottom: 5px;
  }
  
  .spec-label {
    font-size: 14px;
    color: #6e84a3;
  }
  
  .property-description {
    margin-bottom: 30px;
  }
  
  .property-description p {
    line-height: 1.6;
    color: #3b506c;
  }
  
  .features-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding-left: 0;
    list-style-type: none;
  }
  
  .feature-item {
    padding: 8px 12px;
    background-color: #edf2f9;
    border-radius: 4px;
    color: #2c7be5;
    font-size: 14px;
  }
  
  .feature-item::before {
    content: "✓";
    margin-right: 8px;
    color: #00d97e;
  }
  
  .property-detail-sidebar {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
  
  .agent-info, .property-map-container {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
  }
  
  .agent-info h3, .property-map-container h3 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 18px;
  }
  
  .agent-card {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .agent-avatar {
    margin-right: 15px;
  }
  
  .avatar-placeholder {
    width: 60px;
    height: 60px;
    background-color: #2c7be5;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 600;
  }
  
  .agent-name {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 5px;
  }
  
  .agent-contact {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .agent-contact a {
    color: #2c7be5;
    text-decoration: none;
  }
  
  .contact-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .contact-button {
    padding: 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  .contact-button.email {
    background-color: #2c7be5;
    color: white;
  }
  
  .contact-button.call {
    background-color: #00d97e;
    color: white;
  }
  
  .contact-button.tour {
    background-color: white;
    border: 1px solid #2c7be5;
    color: #2c7be5;
  }
  
  .property-map {
    margin-bottom: 15px;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .neighborhood-info {
    margin: 0;
    color: #3b506c;
  }
  
  .nearby-properties {
    margin-top: 40px;
  }
  
  .nearby-properties h2 {
    margin-bottom: 20px;
  }
  
  .nearby-properties-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .nearby-property-card {
    display: block;
    text-decoration: none;
    color: inherit;
    border: 1px solid #e3e6f0;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.2s;
  }
  
  .nearby-property-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  .nearby-property-image {
    height: 180px;
  }
  
  .nearby-property-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .nearby-property-details {
    padding: 15px;
  }
  
  .nearby-property-details h3 {
    margin: 0 0 10px 0;
    font-size: 18px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .nearby-property-price {
    font-size: 20px;
    font-weight: 600;
    color: #2c7be5;
    margin-bottom: 5px;
  }
  
  .nearby-property-specs {
    color: #6e84a3;
    margin-bottom: 5px;
  }
  
  .nearby-property-distance {
    font-size: 14px;
    color: #6e84a3;
  }
  
  /* Responsive styles */
  @media (max-width: 768px) {
    .property-detail-header {
      flex-direction: column;
    }
    
    .property-detail-actions {
      align-items: flex-start;
      margin-top: 15px;
    }
    
    .property-detail-content {
      grid-template-columns: 1fr;
    }
    
    .gallery-main {
      height: 300px;
    }
    
    .features-list {
      grid-template-columns: 1fr;
    }
  }
`;

// Add the CSS to the document
const styleElement = document.createElement('style');
styleElement.innerHTML = PropertyDetailCSS;
document.head.appendChild(styleElement);

export default PropertyDetail;