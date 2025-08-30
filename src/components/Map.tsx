'use client'

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Icon } from './ui/icons';

interface ChargingStation {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  available: boolean;
  fastCharging: boolean;
  network: string;
}

interface MapProps {
  stations: ChargingStation[];
  userLocation?: { lat: number; lng: number } | null;
  onStationSelect?: (station: ChargingStation) => void;
}

export function Map({ stations, userLocation, onStationSelect }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    const loadMap = async () => {
      try {
        const L = await import('leaflet');
        
        if (mapRef.current && !mapInstance) {
          // Initialize map
          const map = L.map(mapRef.current).setView([40.7128, -74.0060], 12);
          
          // Add tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          // Add user location marker
          if (userLocation) {
            const userMarker = L.marker([userLocation.lat, userLocation.lng])
              .addTo(map)
              .bindPopup('Your Location')
              .openPopup();
            
            // Center map on user location
            map.setView([userLocation.lat, userLocation.lng], 14);
          }

          // Add charging station markers
          stations.forEach(station => {
            const markerColor = station.available ? '#10b981' : '#ef4444';
            const marker = L.marker([station.location.lat, station.location.lng], {
              icon: L.divIcon({
                className: 'custom-marker',
                html: `
                  <div style="
                    background-color: ${markerColor};
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    cursor: pointer;
                  "></div>
                `,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
              })
            }).addTo(map);

            // Add popup with station info
            const popupContent = `
              <div style="min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-weight: bold;">${station.name}</h3>
                <p style="margin: 4px 0; font-size: 14px;">
                  <strong>Network:</strong> ${station.network}
                </p>
                <p style="margin: 4px 0; font-size: 14px;">
                  <strong>Status:</strong> 
                  <span style="color: ${station.available ? '#10b981' : '#ef4444'};">
                    ${station.available ? 'Available' : 'Occupied'}
                  </span>
                </p>
                <p style="margin: 4px 0; font-size: 14px;">
                  <strong>Type:</strong> ${station.fastCharging ? 'Fast Charging' : 'Standard'}
                </p>
                <p style="margin: 4px 0; font-size: 12px; color: #666;">
                  ${station.location.address}
                </p>
              </div>
            `;
            
            marker.bindPopup(popupContent);
            
            // Add click handler
            marker.on('click', () => {
              onStationSelect?.(station);
            });
          });

          setMapInstance(map);
          setIsMapLoaded(true);
        }
      } catch (error) {
        console.error('Error loading map:', error);
      }
    };

    loadMap();

    return () => {
      if (mapInstance) {
        mapInstance.remove();
        setMapInstance(null);
      }
    };
  }, [stations, userLocation, mapInstance, onStationSelect]);

  const centerOnUser = () => {
    if (mapInstance && userLocation) {
      mapInstance.setView([userLocation.lat, userLocation.lng], 14);
    }
  };

  const centerOnStations = () => {
    if (mapInstance && stations.length > 0) {
      const bounds = mapInstance.getBounds();
      stations.forEach(station => {
        bounds.extend([station.location.lat, station.location.lng]);
      });
      mapInstance.fitBounds(bounds, { padding: [20, 20] });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Charging Stations Map</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={centerOnUser}
              disabled={!userLocation}
            >
              <Icon name="mapPin" size={16} className="mr-2" />
              My Location
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={centerOnStations}
              disabled={stations.length === 0}
            >
              <Icon name="search" size={16} className="mr-2" />
              Show All
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapRef} 
          className="w-full h-96 rounded-lg border border-border"
          style={{ minHeight: '400px' }}
        >
          {!isMapLoaded && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-muted-foreground">Loading map...</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Map Legend */}
        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
            <span>Your Location</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
