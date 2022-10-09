import React from 'react';
import {
    MapContainer,
    Polyline,
    Popup,
    TileLayer,
    Marker
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
import '../App.css'
import '../data/lines1.json'

const center = [40.6464534, -8.6536617];

// Lamp post's coordinates
const p15_coords = [40.64416, -8.65616];
const p19_coords = [40.64339, -8.65847];

const coords = getLinesFromJson();

function Map() {
    return (
        <div>
            <MapContainer id="map-container"
                center={center}
                zoom={17}
                minZoom={15}
                maxZoom={18}
                style={{width: '100vw', height: '100vh'}
                }
                >
                <TileLayer
                    url='https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=GCrdp2KFceg0vK7Ifepx'
                />

                {
                    Object.keys(coords).map((street) => {
                        return(
                            <Polyline key={street} color={"black"} opacity={"50%"} positions={coords[street]}></Polyline>
                        );
                    })

                }
                <Marker position={p15_coords} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
                    <Popup>
                        P 15
                    </Popup>
                </Marker>
                <Marker position={p19_coords} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
                    <Popup>
                        P 19
                    </Popup>
                </Marker>
            </MapContainer>

        </div>
    );
}

// loads the street data from json file
function getLinesFromJson() {
    return require('../data/lines1.json');
}

export default Map;