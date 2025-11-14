"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Property } from "@/data/mlsProperties";
import L from "leaflet";

// biome-ignore lint/performance/noDelete: This is a known workaround for a Leaflet bug with Webpack
// biome-ignore lint/suspicious/noExplicitAny: Required to access private property for Leaflet workaround
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl:
		"https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
	iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
	shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface MapProps {
	properties: Property[];
}

const PropertiesMap = ({ properties }: MapProps) => {
	return (
		<MapContainer
			center={[39.7392, -104.9903]}
			zoom={11}
			scrollWheelZoom={false}
			style={{ height: "500px", width: "100%" }}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{properties.map((property) => (
				<Marker key={property.id} position={[property.lat, property.lng]}>
					<Popup>
						<strong>{property.name}</strong>
						<br />
						{property.address}
						<br />
						Price: ${property.price.toLocaleString()}
						<br />
						{property.bedrooms} Bed, {property.bathrooms} Bath
					</Popup>
				</Marker>
			))}
		</MapContainer>
	);
};

export default PropertiesMap;
