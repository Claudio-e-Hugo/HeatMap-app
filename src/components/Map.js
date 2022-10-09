import React from 'react';
import {
    MapContainer,
    Polyline,
    Popup,
    TileLayer,
    Marker,
    Circle,
    CircleMarker
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

const p15_bitrate = getP15FromJson();

function Map() {
    return (
        <div>
            <MapContainer id="map-container"
                center={center}
                zoom={14}
                minZoom={15}
                maxZoom={18}
                style={{width: '80vw', height: '80vh'}
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
                {
                    p15_bitrate.map((segment) => {
                        if(segment.bitrate < 1) {
                            return(
                                <CircleMarker center={[segment.lat, segment.long]} radius={1}
                                pathOptions={{ color: 'red' }}
                                eventHandlers={{
                                    mouseover: (event) => event.target.openPopup(),
                                }}
                                >
                                    <Popup>{segment.bitrate}</Popup>
                                </CircleMarker>
                            );
                        } else if(segment.bitrate > 6) {
                            return(
                                <CircleMarker center={[segment.lat, segment.long]} radius={1}
                                pathOptions={{ color: 'green' }}
                                eventHandlers={{
                                    mouseover: (event) => event.target.openPopup(),
                                }}
                                >
                                    <Popup
                                        onMouseOver = {event => event.target.openPopup()}
                                    >{segment.bitrate}</Popup>
                                </CircleMarker>
                            );
                        } else if(segment.bitrate >= 1 && segment.bitrate <= 3) {
                            return(
                                <CircleMarker center={[segment.lat, segment.long]} radius={1}
                                pathOptions={{ color: 'orange' }}
                                eventHandlers={{
                                    mouseover: (event) => event.target.openPopup(),
                                }}
                                >
                                    <Popup
                                        onMouseOver = {event => event.target.openPopup()}
                                    >{segment.bitrate}</Popup>
                                </CircleMarker>
                            );
                        } else {
                            return(
                                <CircleMarker center={[segment.lat, segment.long]} radius={1}
                                pathOptions={{ color: 'yellow' }}
                                eventHandlers={{
                                    mouseover: (event) => event.target.openPopup(),
                                }}
                                >
                                    <Popup
                                        onMouseOver = {event => event.target.openPopup()}
                                    >{segment.bitrate}</Popup>
                                </CircleMarker>
                            );
                        }
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

//loads the p15 data from json file
function getP15FromJson() {
    return require('../data/data_p15.json');
}

export default Map;