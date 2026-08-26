import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '8px'
};

const defaultCenter = {
  lat: -1.286389, // Default to Nairobi
  lng: 36.817223
};

const libraries = ['places'];

const GoogleMapPicker = ({ onLocationSelect, initialLocation }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || "",
    libraries
  });

  const [map, setMap] = useState(null);
  const [markerPos, setMarkerPos] = useState(initialLocation || defaultCenter);
  const [address, setAddress] = useState('');

  const onLoad = useCallback(function callback(mapInstance) {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const handleMapClick = useCallback(async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPos({ lat, lng });
    await reverseGeocode(lat, lng);
  }, []);

  const reverseGeocode = async (lat, lng) => {
    if (!window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    try {
      const response = await geocoder.geocode({ location: { lat, lng } });
      if (response.results && response.results[0]) {
        const formattedAddress = response.results[0].formatted_address;
        setAddress(formattedAddress);
        onLocationSelect({
          latitude: lat,
          longitude: lng,
          formattedAddress: formattedAddress
        });
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      onLocationSelect({
        latitude: lat,
        longitude: lng,
        formattedAddress: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
      });
    }
  };

  const searchAddress = async () => {
    if (!window.google || !address.trim()) return;

    const geocoder = new window.google.maps.Geocoder();
    try {
      const response = await geocoder.geocode({ address: address.trim() });
      if (response.results && response.results[0]) {
        const result = response.results[0];
        const lat = result.geometry.location.lat();
        const lng = result.geometry.location.lng();
        const formattedAddress = result.formatted_address || address.trim();

        setMarkerPos({ lat, lng });
        setAddress(formattedAddress);
        if (map) {
          map.panTo({ lat, lng });
          map.setZoom(15);
        }

        onLocationSelect({
          latitude: lat,
          longitude: lng,
          formattedAddress
        });
      }
    } catch (error) {
      console.error("Address search error:", error);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMarkerPos({ lat, lng });
          if (map) {
            map.panTo({ lat, lng });
            map.setZoom(15);
          }
          await reverseGeocode(lat, lng);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Could not get your location. Please check your browser permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  if (!apiKey) {
    return (
      <div className="alert alert-danger mb-3">
        <strong>Configuration Error:</strong> Google Maps API key is missing. Please check your .env file.
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="alert alert-danger mb-3">
        <strong>Error loading Google Maps:</strong> {loadError.message || "Please check your connection, API key, and billing status."}
      </div>
    );
  }

  if (!isLoaded) {
    return <div className="d-flex justify-content-center p-4"><div className="spinner-border text-warning"></div></div>;
  }

  return (
    <div className="google-map-picker mb-3">
      <div className="d-flex flex-column gap-2 mb-3">
        <div className="position-relative">
          <div className="input-group">
            <input
              type="text"
              placeholder="Search for a location..."
              className="form-control bg-dark text-white border-secondary"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  searchAddress();
                }
              }}
            />
            <button
              type="button"
              className="btn btn-outline-secondary border-secondary"
              onClick={searchAddress}
              aria-label="Search location"
            >
              <FaSearch />
            </button>
          </div>
        </div>
        <button 
          type="button" 
          className="btn btn-outline-warning w-100 d-flex justify-content-center align-items-center gap-2"
          onClick={getCurrentLocation}
        >
          <FaMapMarkerAlt /> Use My Current Location
        </button>
      </div>

      <div className="border border-secondary rounded overflow-hidden">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={markerPos}
          zoom={13}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          <Marker 
            position={markerPos} 
            draggable={true}
            onDragEnd={handleMapClick}
          />
        </GoogleMap>
      </div>
      
      {address && (
        <div className="mt-2 small text-muted">
          <strong>Selected:</strong> {address}
        </div>
      )}
    </div>
  );
};

export default GoogleMapPicker;
