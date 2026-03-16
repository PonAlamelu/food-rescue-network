import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

const DonationMap = ({ donations, onMarkerClick }) => {
  // Filter donations that have valid location coordinates
  const validDonations = donations.filter(d => 
    d.location && 
    d.location.coordinates && 
    d.location.coordinates.length === 2
  );

  // Default center if no donations are present (e.g., Tirunelveli)
  const defaultCenter = [8.7139, 77.7567];
  
  // Try to center on the first donation if available
  const center = validDonations.length > 0 
    ? [validDonations[0].location.coordinates[1], validDonations[0].location.coordinates[0]]
    : defaultCenter;

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-gray-900">Donation Map</h3>
          <p className="text-sm font-medium text-gray-400">Find surplus food near you</p>
        </div>
        <div className="px-4 py-2 bg-primary-50 rounded-2xl">
          <span className="text-xs font-black text-primary-600 uppercase tracking-widest">
            {validDonations.length} Available
          </span>
        </div>
      </div>
      
      <div className="h-[400px] w-full z-0">
        <MapContainer 
          center={center} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {validDonations.map((donation) => (
            <Marker 
              key={donation._id} 
              position={[donation.location.coordinates[1], donation.location.coordinates[0]]}
            >
              <Popup className="custom-popup">
                <div className="p-1">
                  <h4 className="font-black text-gray-900 mb-1">{donation.description}</h4>
                  <p className="text-xs font-bold text-gray-500 mb-2">{donation.quantity}</p>
                  <p className="text-[10px] text-gray-400 mb-3">{donation.pickupLocation}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onMarkerClick(donation._id)}
                      className="flex-1 bg-primary-600 text-white text-[10px] font-black py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      REQUEST
                    </button>
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${donation.location.coordinates[1]},${donation.location.coordinates[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gray-100 text-gray-900 text-[10px] font-black py-2 rounded-lg hover:bg-gray-200 transition-colors text-center"
                    >
                      DIRECTIONS
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default React.memo(DonationMap);
