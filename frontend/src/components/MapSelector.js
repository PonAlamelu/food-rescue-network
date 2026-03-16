import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapEvents = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const ChangeView = ({ center }) => {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
};

const MapSelector = ({ onLocationSelect, initialLat, initialLng }) => {
  const [position, setPosition] = useState(
    initialLat && initialLng ? [initialLat, initialLng] : [8.7139, 77.7567] // Default to Tirunelveli or similar
  );

  useEffect(() => {
    if (initialLat && initialLng) {
      setPosition([Number(initialLat), Number(initialLng)]);
    }
  }, [initialLat, initialLng]);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setPosition([lat, lng]);
          onLocationSelect(lat, lng);
        },
        () => alert("Unable to retrieve your location.")
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const onMapClick = (lat, lng) => {
    setPosition([lat, lng]);
    onLocationSelect(lat, lng);
  };

  return (
    <div className="flex flex-col h-full min-h-[300px]">
      <div className="flex justify-between items-center mb-2">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Click on map to set pickup point
        </p>
        <button 
          type="button" 
          onClick={handleGetCurrentLocation}
          className="text-[10px] font-black text-primary-600 hover:text-primary-700 uppercase tracking-widest underline"
        >
          Use Current Location
        </button>
      </div>
      <div className="flex-grow rounded-xl overflow-hidden border-2 border-gray-100 z-0 h-[300px]">
        <MapContainer 
          center={position} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeView center={position} />
          <Marker position={position} />
          <MapEvents onLocationSelect={onMapClick} />
        </MapContainer>
      </div>
    </div>
  );
};

export default React.memo(MapSelector);
