import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import image from './image.png';
import './styles.css';
import { useMapEvents } from 'react-leaflet';
import Register from "./components/Register";
import Login from "./components/Login"; // Import Login component

function LocationMarker({ setNewPlace }) {
  const map = useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      // Set the newPlace state with the clicked latitude and longitude
      setNewPlace({ lat: lat.toFixed(6), lng: lng.toFixed(6) });
    },
  });

  return null;
}

const App = () => {
  const [pins, setPins] = useState([]);
  const [selectedPinIndex, setSelectedPinIndex] = useState(null);
  const mapRef = useRef(null);
  const [newPlace, setNewPlace] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rating: "",
    username: currentUser
  });
  const [showRegister, setShowRegister] = useState(false); // Add state for showing register component
  const [showLogin, setShowLogin] = useState(false); // Add state for showing login component
  const latitude = 51.505;
  const longitude = -0.09;

  const myIcon = L.icon({
    iconUrl: image,
    iconSize: [30, 41],
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -41],
  });

  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<span key={i} className="star-filled">&#9733;</span>);
      } else {
        stars.push(<span key={i} className="star-empty">&#9734;</span>);
      }
    }
    return stars;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8800/api/pins");
        if (!response.ok) {
          throw new Error("Failed to fetch pins");
        }
        const data = await response.json();
        setPins(data);
        console.log(data)
      } catch (error) {
        console.error("Error fetching pins:", error.message);
      }
    };

    fetchData();

    // Check if "username" exists in localStorage and set it to currentUser state
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setCurrentUser(storedUsername);
    }
  }, []);

  const handleMarkerClick = (index) => {
    setSelectedPinIndex(index);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const { lat, lng } = newPlace;

    try {
      const response = await fetch("http://localhost:8800/api/pins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          lat: lat,
          long: lng,
          ratings: formData.rating,
          username: currentUser,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add pin");
      }

      setFormData({
        title: "",
        description: "",
        rating: "",
        user: "",
      });

      console.log("Pin added successfully");
    } catch (error) {
      console.error("Error adding pin:", error.message);
    }
  };


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to toggle the register component
  const toggleRegister = () => {
    setShowRegister(!showRegister);
  };

  // Function to toggle the login component
  const toggleLogin = () => {
    setShowLogin(!showLogin);
  };

  return (
    <>
      <div className="button-container">
        {!currentUser && <button className="login-button" onClick={toggleLogin}>Log in</button>}
        {currentUser && <button className="logout-button">Log out</button>}
        <button className="register-button" onClick={toggleRegister}>Register</button>
      </div>

      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        ref={mapRef}
        style={{ height: "100vh", width: "100vw" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pins.map((pin, index) => (
          <Marker key={index} position={[pin.lat, pin.long]} icon={myIcon} eventHandlers={{ click: () => handleMarkerClick(index) }}>
            {selectedPinIndex === index && (
              <Popup className="popup-content">
                <div>
                  <h3 className="title">{pin.title}</h3>
                  <p className="description">{pin.description}</p>
                  <div className="rating">{renderStarRating(pin.ratings)}</div>
                  <p className="username">Pinned By : {pin.username}</p>
                </div>
              </Popup>
            )}
            <div style={{ color: pin.username === currentUser ? 'red' : 'blue' }}>
              &#x25CF;
            </div>
          </Marker>
        ))}
        <LocationMarker setNewPlace={setNewPlace} />
        {newPlace && (
          <Marker position={[newPlace.lat, newPlace.lng]} icon={myIcon}>
            <Popup closeButton={true} closeOnClick={false} onClose={() => setNewPlace(null)}>
              <div className="popup-form">
                <h4>Add New Place</h4>
                <form className="form" onSubmit={handleFormSubmit}>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Title"
                  />
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                  ></textarea>
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="1"
                    max="5"
                    placeholder="Rating (1-5)"
                  />
                  <button type="submit" className="submit-button">Submit</button>
                </form>
              </div>
            </Popup>
          </Marker>
        )}

        {showRegister && <Register onClose={toggleRegister} />}

        {showLogin && <Login onClose={toggleLogin} />}
      </MapContainer>
    </>
  );
};

export default App;
