import React, { createContext, useContext } from 'react';

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  // We no longer need to load the Google Maps JS API.
  // We keep this context if other components still depend on it, 
  // but we set isLoaded to true and isInvalidKey to false.
  
  return (
    <MapContext.Provider value={{ isLoaded: true, loadError: null, isInvalidKey: false }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => useContext(MapContext);
