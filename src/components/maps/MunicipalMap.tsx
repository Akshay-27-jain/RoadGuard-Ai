import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { ComplaintsAPI } from '@/services/api';

// Fix standard Leaflet icon paths in Vite bundlers
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export interface MapComplaintItem {
  id: string;
  complaint_ref: string;
  location?: {
    coordinates: [number, number]; // [lng, lat]
  };
  address_text?: string;
  ward?: string;
  status: string;
  image_url?: string;
  ai_assessment?: {
    damage_label?: string;
    severity_label?: string;
    priority_score?: number;
  };
}

interface MunicipalMapProps {
  complaints?: MapComplaintItem[];
  center?: [number, number]; // [lat, lng]
  zoom?: number;
  height?: string;
  onSelectComplaint?: (complaint: MapComplaintItem) => void;
  interactiveSelectMode?: boolean;
  onCoordinatesSelected?: (coords: { lat: number; lng: number }) => void;
  onLocationSelected?: (location: {
    lat: number;
    lng: number;
    address_text: string;
    ward: string;
  }) => void;
  selectedCoords?: { lat: number; lng: number } | null;
}

export const MunicipalMap: React.FC<MunicipalMapProps> = ({
  complaints = [],
  center = [18.5204, 73.8567], // Default Pune / Municipal Coordinates
  zoom = 13,
  height = '420px',
  onSelectComplaint,
  interactiveSelectMode = false,
  onCoordinatesSelected,
  onLocationSelected,
  selectedCoords,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const pinMarkerRef = useRef<L.Marker | null>(null);

  const [isLocating, setIsLocating] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Reverse geocode and broadcast
  const handleReverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      setIsGeocoding(true);
      try {
        const res = await ComplaintsAPI.reverseGeocode(lat, lng);
        const data = res.data;
        setResolvedAddress(data.address_text);
        if (onLocationSelected) {
          onLocationSelected({
            lat,
            lng,
            address_text: data.address_text,
            ward: data.ward || 'Ward 4 - Central',
          });
        }
      } catch (err) {
        const fallback = `Road near (${lat.toFixed(5)}, ${lng.toFixed(5)})`;
        setResolvedAddress(fallback);
        if (onLocationSelected) {
          onLocationSelected({
            lat,
            lng,
            address_text: fallback,
            ward: 'Ward 4 - Central',
          });
        }
      } finally {
        setIsGeocoding(false);
      }
    },
    [onLocationSelected]
  );

  // Move or create the interactive pin
  const setPinAt = useCallback(
    (lat: number, lng: number, triggerReverse = true) => {
      if (!mapInstanceRef.current) return;
      const map = mapInstanceRef.current;

      if (pinMarkerRef.current) {
        pinMarkerRef.current.setLatLng([lat, lng]);
      } else {
        const marker = L.marker([lat, lng], { draggable: true }).addTo(map);

        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          if (onCoordinatesSelected) {
            onCoordinatesSelected({ lat: pos.lat, lng: pos.lng });
          }
          handleReverseGeocode(pos.lat, pos.lng);
        });

        pinMarkerRef.current = marker;
      }

      if (triggerReverse) {
        handleReverseGeocode(lat, lng);
      }
    },
    [handleReverseGeocode, onCoordinatesSelected]
  );

  // Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: true,
      });

      // OpenStreetMap standard tile layer (100% free, no API key required)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;

      // Handle Map Click in Interactive Mode
      if (interactiveSelectMode) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          const lat = e.latlng.lat;
          const lng = e.latlng.lng;
          if (onCoordinatesSelected) {
            onCoordinatesSelected({ lat, lng });
          }
          setPinAt(lat, lng, true);
        });
      }

      // Handle Leaflet LocationFound event
      map.on('locationfound', (e: L.LocationEvent) => {
        setIsLocating(false);
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        map.setView([lat, lng], 16);

        if (onCoordinatesSelected) {
          onCoordinatesSelected({ lat, lng });
        }
        setPinAt(lat, lng, true);
      });

      map.on('locationerror', () => {
        setIsLocating(false);
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [interactiveSelectMode, onCoordinatesSelected, setPinAt]);

  // Sync external selectedCoords prop
  useEffect(() => {
    if (!mapInstanceRef.current || !interactiveSelectMode) return;
    if (selectedCoords) {
      setPinAt(selectedCoords.lat, selectedCoords.lng, false);
      mapInstanceRef.current.panTo([selectedCoords.lat, selectedCoords.lng]);
    } else if (pinMarkerRef.current) {
      pinMarkerRef.current.remove();
      pinMarkerRef.current = null;
    }
  }, [selectedCoords, interactiveSelectMode, setPinAt]);

  // Leaflet API: Take Current Location
  const handleLocateMe = () => {
    if (!mapInstanceRef.current) return;
    setIsLocating(true);
    mapInstanceRef.current.locate({
      setView: true,
      maxZoom: 16,
      enableHighAccuracy: true,
      timeout: 10000,
    });
  };

  // Render complaint markers for overview / GIS map
  useEffect(() => {
    if (!markersLayerRef.current || !mapInstanceRef.current) return;
    const layer = markersLayerRef.current;
    layer.clearLayers();

    complaints.forEach((c) => {
      const coords = c.location?.coordinates;
      if (!coords || coords.length < 2) return;
      const [lng, lat] = coords;

      const severity = c.ai_assessment?.severity_label || 'Medium';
      const status = c.status;

      let color = '#2563EB'; // default Medium (Links blue)
      if (severity === 'Critical') color = '#DC2626'; // Critical red
      else if (severity === 'High') color = '#D97706'; // Warning amber
      else if (severity === 'Low') color = '#13856B'; // Primary teal

      if (status === 'RESOLVED') color = '#13856B'; // Primary teal

      const circle = L.circleMarker([lat, lng], {
        radius: 8,
        fillColor: color,
        color: '#FFFFFF',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.85,
      });

      const popupHtml = `
        <div style="font-family: inherit; font-size: 11px; max-width: 200px;">
          <div style="font-weight: 700; color: #13856B; font-family: monospace;">${c.complaint_ref}</div>
          <div style="font-weight: 600; color: #172B3A; margin-top: 2px;">${c.ai_assessment?.damage_label || 'Road Defect'}</div>
          <div style="margin-top: 4px; display: flex; gap: 4px; align-items: center;">
            <span style="background: ${color}20; color: ${color}; padding: 1px 6px; border-radius: 4px; font-weight: 600;">${severity}</span>
            <span style="color: #64748B;">• Priority ${c.ai_assessment?.priority_score || '—'}/100</span>
          </div>
          <div style="color: #64748B; margin-top: 4px;">${c.address_text || c.ward || 'Municipal site'}</div>
          <div style="margin-top: 4px; font-weight: 600; color: #172B3A;">Status: ${status}</div>
        </div>
      `;

      circle.bindPopup(popupHtml);

      if (onSelectComplaint) {
        circle.on('click', () => onSelectComplaint(c));
      }

      circle.addTo(layer);
    });
  }, [complaints, onSelectComplaint]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-2xs">
      {/* Leaflet Container */}
      <div ref={mapContainerRef} style={{ height, width: '100%', zIndex: 10 }} />

      {/* Interactive Controls Overlay */}
      {interactiveSelectMode && (
        <>
          {/* Floating Action Button: Take Location via Leaflet */}
          <div className="absolute top-3 right-3 z-20">
            <button
              type="button"
              onClick={handleLocateMe}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[#13856B] border border-emerald-200 text-xs font-semibold shadow-md hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer"
            >
              {isLocating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Locating via GPS...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Take My Location</span>
                </>
              )}
            </button>
          </div>

          {/* Bottom Banner with Address & Hint */}
          <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-[#E2E8F0] text-xs shadow-sm">
            <div className="flex items-center gap-2 truncate">
              <MapPin className="w-4 h-4 text-[#13856B] shrink-0" />
              {isGeocoding ? (
                <span className="text-[#64748B] flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Resolving road address...
                </span>
              ) : resolvedAddress ? (
                <span className="font-medium text-[#172B3A] truncate">
                  {resolvedAddress}
                </span>
              ) : (
                <span className="text-[#64748B]">Click map or use 'Take My Location'</span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-mono shrink-0">
              Drag pin to adjust
            </span>
          </div>
        </>
      )}
    </div>
  );
};
