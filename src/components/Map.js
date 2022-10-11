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
import Checkbox from '@mui/material/Checkbox';


const center = [40.6464534, -8.6536617];

// Lamp post's coordinates
const p15_coords = [40.64416, -8.65616];
const p19_coords = [40.64339, -8.65847];

const coords = getLinesFromJson();

const p15_bitrate = getP15FromJson();
const p19_bitrate = getP19FromJson();

var color="";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const post = "p15";

function Map() {

    const [heat, setHeat] = useState("");
    const [post, setPost] = useState([]);
    
    useEffect(() => {
        console.log('Heat is now: ', heat);
    }, [heat]);

    const handleChange = (event) => {
        setHeat(event.target.value);
        // console.log(heat);
    }

    const handleChangeCheckBox = (event) => {
        const currentIndex = post.indexOf(event);
        const newPost = [...post];
        if(currentIndex === -1) {
            newPost.push(event);
        } else {
            newPost.splice(currentIndex, 1);
        }
        setPost(newPost);
        console.log(post);
    }
    
    return (
        <div>
            <div class="container-fluid">
            <div class="row">
                <div class="col-sm-1">
                    <div class="float-left">
                        <FormControl>
                            <FormLabel id="info">Info</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="bitrate"
                                name="radio-buttons-group"
                            >
                                <FormControlLabel onChange={handleChange} value="bitrate" control={<Radio />} label="BitRate" />
                                <FormControlLabel onChange={handleChange} value="jitter" control={<Radio />} label="Jitter" />
                                <FormControlLabel onChange={handleChange} value="ploss" control={<Radio />} label="Packet Loss" />
                            </RadioGroup>
                        </FormControl>
                        <div>
                        <FormControlLabel
                            control={
                            <Checkbox value="p15" onChange={handleChangeCheckBox}/>
                            }
                            label="P15"
                        />
                        <FormControlLabel
                            control={
                            <Checkbox value="p19" onChange={handleChangeCheckBox}/>
                            }
                            label="P19"
                        />
                        </div>
                    </div>
                </div>
                <div class="col-sm-8">
                    <MapContainer id="map-container"
                        center={center}
                        zoom={14}
                        minZoom={15}
                        maxZoom={28}
                        style={{width: '60vw', height: '60vh'}}
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
                            post == "p15" ? 
                            p15_bitrate.map((segment) => {
                                //if radio button is selected, show the circles
                                if(heat === "bitrate"){
                                    color = "hsl(" + (segment.bitrate*15) + ", 100%, 50%)";
                                    // console.log(segment.bitrate);
                                } else if(heat === "jitter"){
                                    color = "hsl(" + ((120 - segment.jitter)) + ", 100%, 50%)";  
                                    // console.log(segment.jitter);
                                } else if(heat === "ploss"){ 
                                    color = "hsl(" + ((120-segment.lost )) + ", 100%, 50%)";
                                    // console.log(segment.lost);
                                } else {
                                    color = "hsl(" + (segment.bitrate*15) + ", 100%, 50%)";
                                    // console.log(segment.bitrate);
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
                            :
                            p19_bitrate.map((segment) => {
                                //if radio button is selected, show the circles
                                if(heat === "bitrate"){
                                    color = "hsl(" + (segment.bitrate*15) + ", 100%, 50%)";
                                    // console.log(segment.bitrate);
                                } else if(heat === "jitter"){
                                    color = "hsl(" + ((120 - segment.jitter)) + ", 100%, 50%)";  
                                    // console.log(segment.jitter);
                                } else if(heat === "ploss"){ 
                                    color = "hsl(" + ((120-segment.lost )) + ", 100%, 50%)";
                                    // console.log(segment.lost);
                                } else {
                                    color = "hsl(" + (segment.bitrate*15) + ", 100%, 50%)";
                                    // console.log(segment.bitrate);
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
                </div>

            </div>
        </div>
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

//loads the p19 data from json file
function getP19FromJson() {
    return require('../data/data_p19.json');
}

export default Map;
