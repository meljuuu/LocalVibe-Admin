"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

import L from "leaflet";

// Dynamically import Leaflet components with no SSR
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const { decryptData } = require("../../../utils/encryption");

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const Map = ({ users, center }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div>Loading map...</div>;
  }

  return (
    <div style={{ height: "500px", width: "100%" }}>
      {typeof window !== "undefined" && (
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {users.map((user) => {
            if (user.latitude && user.longitude) {
              return (
                <Marker
                  key={user._id}
                  position={[user.latitude, user.longitude]}
                >
                  <Popup>
                    <div>
                      <h3>{user.name}</h3>
                      <p>{decryptData(user.email)}</p>
                      {user.avatar && (
                        <img
                          src={user.avatar.url}
                          alt={`${user.name}'s avatar`}
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                          }}
                        />
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}
        </MapContainer>
      )}
    </div>
  );
};

export default Map;
