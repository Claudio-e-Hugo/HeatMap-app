import React from 'react';
import {
    MapContainer,
    Polyline,
    Popup,
    TileLayer,
    Marker,
    CircleMarker
} from 'react-leaflet';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import 'leaflet/dist/leaflet.css'
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
import '../App.css'
import '../data/lines1.json'
import {useEffect, useState} from 'react';
import { Container } from '@mui/system';


const center = [40.6464534, -8.6536617];

// Lamp post's coordinates
const p15_coords = [40.64416, -8.65616];
const p19_coords = [40.64339, -8.65847];

const coords = getLinesFromJson();

const p15_bitrate = getP15FromJson();

var color="";


function Map() {

    const [heat, setHeat] = useState("");
    
    useEffect(() => {
        console.log('Heat is now: ', heat);
    }, [heat]);

    const handleChange = (event) => {
        setHeat(event.target.value);
        console.log(heat);
    }
    return (
        <div>
            <MapContainer id="map-container"
                center={center}
                zoom={14}
                minZoom={15}
                maxZoom={28}
                style={{width: '80vw', height: '80vh'}}
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
                        //if radio button is selected, show the circles
                        if(heat === "bitrate"){
                            color = "hsl(" + (segment.bitrate*15) + ", 100%, 50%)";
                            console.log(segment.bitrate);
                        }
                        if(heat === "jitter"){
                            color = "hsl(" + ((120 - segment.jitter)) + ", 100%, 50%)";  
                            console.log(segment.jitter);
                        }
                        if(heat === "ploss"){ 
                            color = "hsl(" + ((120-segment.lost )) + ", 100%, 50%)";
                            console.log(segment.lost);
                        }
                        
                        return(
                            <CircleMarker center={[segment.lat, segment.long]} radius={2}
                            pathOptions={{ color: color }}
                            eventHandlers={{
                                //check the heat value and show the popup with the right data
                                
                                                            
                                mouseover: (event) => {
                                    if(heat === "bitrate"){
                                        event.target.bindPopup("Bitrate: " + segment.bitrate + " kbps").openPopup();
                                    }
                                    if(heat === "jitter"){
                                        event.target.bindPopup("Jitter: " + segment.jitter + " ms").openPopup();
                                    }
                                    if(heat === "ploss"){
                                        event.target.bindPopup("Packet Loss: " + segment.lost + " %").openPopup();
                                    }
                                    event.target.openPopup()},
                                mouseout: (event) => event.target.closePopup(),


                            }}
                            >
                                
                                {/* if(heat === "bitrate"){
                                    <Popup>{segment.bitrate}</Popup>
                                }
                                if(heat === "jitter"){
                                    <Popup>{segment.jitter}</Popup>
                                }
                                if(heat === "ploss"){
                                    <Popup>{segment.lost}</Popup>
                                } */}

                            </CircleMarker>

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
            
            <FormControl>
                <FormLabel id="info">Info</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue=""
                    name="radio-buttons-group"
                >
                    <FormControlLabel onChange={handleChange} value="bitrate" control={<Radio />} label="BitRate" />
                    <FormControlLabel onChange={handleChange} value="jitter" control={<Radio />} label="Jitter" />
                    <FormControlLabel onChange={handleChange} value="ploss" control={<Radio />} label="Packet Loss" />
                </RadioGroup>
            </FormControl>
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
