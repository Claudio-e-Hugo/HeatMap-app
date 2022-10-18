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
import {useEffect, useState} from 'react';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';


const center = [40.6464534, -8.6536617];

// Lamp post's coordinates
const p15_coords = [40.64416, -8.65616];
const p19_coords = [40.64339, -8.65847];

// const coords = getLinesFromJson();

var p15 = null;
var p19 = null;
var cell = null;

//empty json object
var color="";

// swipe drawer variables
const drawerBleeding = 46;

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor:
    theme.palette.mode === 'light' ? grey[100] : theme.palette.background.secondary,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));


function Map({selectedHeat}) {
    console.log({selectedHeat});
    
    const [post, setPost] = useState([]);
    const [coords, setCoords] = useState({}); 

    useEffect(() => {
        fetch('/get_lines', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => 
            response.json().then(data => {
                setCoords(data);
            })
        );
    }, []);

    useEffect(() => {
        const arg = {"post": "p15"};
        fetch('/handle_segments', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(arg)
        }).then(response => 
            response.json().then(data => {
                p15 = data;
            })
        );
    }, []);

    // useEffect(() => {
    //     const arg = {"post" : "p15"};
    //     fetch('/get_json/', {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify(arg)
    //     }).then(response => 
    //         response.json().then(data => {
    //             p15 = data;
    //         })
    //     );
    // }, []);

    // useEffect(() => {
    //     const arg = {"post" : "p19"};
        
    //     fetch('/get_json/', {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify(arg)
    //     }).then(response => 
    //         response.json().then(data => {
    //             p19 = data;
    //         })
    //     );
    // })

    // useEffect(() => {
    //     const arg = {"post" : "cell"};
        
    //     fetch('/get_json/', {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify(arg)
    //     }).then(response => 
    //         response.json().then(data => {
    //             cell = data;
    //         })
    //     );
    // })
    
    
    var data_p15;
    var data_p19;
    var data_cell;

    if (post.includes("p15")) {
        data_p15=p15;
    } else {
        data_p15=null;
    }
    if (post.includes("p19")) {
        data_p19=p19;
    } else {
        data_p19=null;
    }
    if(post.includes("cell")) {
        data_cell=cell;
    } else {
        data_cell=null;
    }
    if (!post.includes("p15") && !post.includes("p19") && !post.includes("cell")){
        data_p15=p15;
        // data_p19=p19;
    }

    // swipe drawer variables
    
  
    // This is used only for the example
    const container = window !== undefined ? () => window().document.body : undefined;

    return (
            <div>
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-sm-1">
                            <div class="float-left">
                                
                            </div>
                        </div>
                        <div class="col-sm-8">
                            <Card  sx={{     marginBottom:'10rem', minWidth: '80vw', maxHeight: '90vh'}}>
                                <CardContent>
                                <MapContainer id="map-container"
                                center={center}
                                zoom={14}
                                minZoom={16}
                                maxZoom={19}
                                style={{width: '100%', height: '82vh', padding: '50'}}
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
                                    data_p15 != null ? 
                                    Object.keys(data_p15).map((segment) => {
                                        
                                        var aux = segment.replace('[[', '').replace(']]', '').replace('[', '').replace(']', '').split(",").map(Number);
                                        aux = [[ [aux[0], aux[1]], [aux[2], aux[3]] ]];
                                        
                                        var values = data_p15[segment];

                                        //if radio button is selected, show the circles
                                        if (post.includes("cell")){
                                            // console.log("INCLUDES CELL");
                                            if(selectedHeat === "bitrate" ){
                                                // let x= (120-segment.bitrate);
                                                // let x = (120/segment.bitreate)*15;
                                                let x = coloringBitrate(segment.bitrate, true);
                                                if (x <= 120) {
                                                    color = "hsl(" + x + ", 100%, 50%)";
                                                } else {
                                                    color = "hsl(" + 120 + ", 100%, 50%)";
                                                    
                                                }
                                            
                                            } else if(selectedHeat === "jitter"){
                                                let x=120 - segment.jitter
                                                if(x<0){
                                                    x=0;
                                                }else if(x>120){
                                                    x=120;
                                                }
                                                color = "hsl(" + (x) + ", 100%, 50%)";  
                                            } else if(selectedHeat === "ploss"){ 
                                                let x=120 - segment.lost
                                                if(x<0){
                                                    x=0;
                                                }else if(x>120){
                                                    x=120;
                                                }
                                                color = "hsl(" + (x) + ", 100%, 50%)";  
                                                // console.log(segment.lost);
                                            }

                                        }else{
                                     
                                            if(selectedHeat === "bitrate" ){
                                                let x= (values.bitrate);
                                                if(x<0){
                                                    x=0;
                                                }else if(x>120){
                                                    x=120;
                                                }
                                                color = "hsl(" + (x*20) + ", 100%, 50%)";
                                                

                                                // console.log(segment.bitrate);
                                            } else if(selectedHeat === "jitter"){
                                                let x=120 - segment.jitter
                                                if(x<0){
                                                    x=0;
                                                }else if(x>120){
                                                    x=120;
                                                }
                                                color = "hsl(" + (x) + ", 100%, 50%)";  
                                            } else if(selectedHeat === "ploss"){ 
                                                let x=120 - segment.lost
                                                if(x<0){
                                                    x=0;
                                                }else if(x>120){
                                                    x=120;
                                                }
                                                color = "hsl(" + (x) + ", 100%, 50%)";  
                                                // console.log(segment.lost);
                                            }
                                        
                                        }
                                        
                                        return (
                                            <Polyline key={segment} pathOptions={{ color: color }} positions={aux}
                                                eventHandlers={{
                                                    //check the heat value and show the popup with the right data
                                                    
                                                                                
                                                    mouseover: (event) => {
                                                        if(selectedHeat === "bitrate"){
                                                            event.target.bindPopup("Bitrate: " + values.bitrate + " kbps on P15").openPopup();
                                                        }
                                                        if(selectedHeat === "jitter"){
                                                            event.target.bindPopup("Jitter: " + segment.jitter + " ms on P15").openPopup();
                                                        }
                                                        if(selectedHeat === "ploss"){
                                                            event.target.bindPopup("Packet Loss: " + segment.lost + " % on P15").openPopup();
                                                        }
                                                        event.target.openPopup()},
                                                    mouseout: (event) => event.target.closePopup(),


                                                }}
                                            />
                                        );
                                    })
                                    :
                                    null
                                }

                                {/*                                 
                                {
                                    data_p15 != null ? 
                                    data_p15.map((segment) => {
                                        //if radio button is selected, show the circles
                                        if (post.includes("cell")){
                                            if(heat === "bitrate" ){
                                                // let x= (120-segment.bitrate);
                                                // let x = (120/segment.bitreate)*15;
                                                let x = coloringBitrate(segment.bitrate, true);
                                                if (x <= 120) {
                                                    color = "hsl(" + x + ", 100%, 50%)";
                                                } else {
                                                    color = "hsl(" + 120 + ", 100%, 50%)";
                                                    
                                                }
                                            
                                            } else if(heat === "jitter"){
                                                let x=120 - segment.jitter
                                                if(x<0){
                                                    x=0;
                                                }else if(x>120){
                                                    x=120;
                                                }
                                                color = "hsl(" + (x) + ", 100%, 50%)";  
                                            } else if(heat === "ploss"){ 
                                                let x=120 - segment.lost
                                                if(x<0){
                                                    x=0;
                                                }else if(x>120){
                                                    x=120;
                                                }
                                                color = "hsl(" + (x) + ", 100%, 50%)";  
                                                // console.log(segment.lost);
                                            }

                                        }else{
                                            if(heat === "bitrate" ){
                                                // console.log("not cell");
                                                let x= (segment.bitrate);
                                                if(x<0){
                                                    x=0;
                                                }else if(x>120){
                                                    x=120;
                                                }
                                                color = "hsl(" + (x*15) + ", 100%, 50%)";
                                                // console.log(segment.bitrate);
                                            } else if(heat === "jitter"){
                                                let x=120 - segment.jitter
                                                if(x<0){
                                                    x=0;
                                                }else if(x>120){
                                                    x=120;
                                                }
                                                color = "hsl(" + (x) + ", 100%, 50%)";  
                                            } else if(heat === "ploss"){ 
                                                let x=120 - segment.lost
                                                if(x<0){
                                                    x=0;
                                                }else if(x>120){
                                                    x=120;
                                                }
                                                color = "hsl(" + (x) + ", 100%, 50%)";  
                                                // console.log(segment.lost);
                                            }
                                        
                                        }    
                                        
                                        
                                        return(
                                            //escalate circles verticaly based on the color

                                        
                                            

                                            <CircleMarker center={[segment.lat, segment.long]} radius={2}
                                            pathOptions={{ color: color }}
                                            opacity={"15%"}
                                            eventHandlers={{
                                                //check the heat value and show the popup with the right data
                                                
                                                                            
                                                mouseover: (event) => {
                                                    if(heat === "bitrate"){
                                                        event.target.bindPopup("Bitrate: " + segment.bitrate + " kbps on P15").openPopup();
                                                    }
                                                    if(heat === "jitter"){
                                                        event.target.bindPopup("Jitter: " + segment.jitter + " ms on P15").openPopup();
                                                    }
                                                    if(heat === "ploss"){
                                                        event.target.bindPopup("Packet Loss: " + segment.lost + " % on P15").openPopup();
                                                    }
                                                    event.target.openPopup()},
                                                mouseout: (event) => event.target.closePopup(),


                                            }}
                                            >
                                            </CircleMarker>

                                        );
                                        
                                    })
                                    :
                                    null
                                }
                                {
                                    data_p19 != null ? 
                                    data_p19.map((segment) => {
                                        //if radio button is selected, show the circles
                                        if (post.includes("cell")){
                                            
                                            if(heat === "bitrate" ){
                                                let x = coloringBitrate(segment.bitrate, true);
                                                if (x <= 120) {
                                                    color = "hsl(" + x + ", 100%, 50%)";
                                                } else {
                                                    color = "hsl(" + 120 + ", 100%, 50%)";
                                                    
                                                }
                                            } else if(heat === "jitter"){
                                                let x=120 - segment.jitter
                                                if(x<0){
                                                    x=0;
                                                }else if(x>120){
                                                    x=120;
                                                }
                                                color = "hsl(" + (x) + ", 100%, 50%)";  
                                            } else if(heat === "ploss"){ 
                                                let x=120 - segment.lost
                                                if(x<0){
                                                    x=0;
                                                }else if(x>120){
                                                    x=120;
                                                }
                                                color = "hsl(" + (x) + ", 100%, 50%)";  
                                            }

                                        }else{
                                            if(heat === "bitrate" ){
                                                let x= (segment.bitrate);
                                                if(x<0){
                                                    x=0;
                                                }else if(x>120){
                                                    x=120;
                                                }
                                                color = "hsl(" + (x*15) + ", 100%, 50%)";
                                            } else if(heat === "jitter"){
                                                let x=120 - segment.jitter
                                                if(x<0){
                                                    x=0;
                                                }else if(x>120){
                                                    x=120;
                                                }
                                                color = "hsl(" + (x) + ", 100%, 50%)";  
                                            } else if(heat === "ploss"){ 
                                                let x=120 - segment.lost
                                                if(x<0){
                                                    x=0;
                                                }else if(x>120){
                                                    x=120;
                                                }
                                                color = "hsl(" + (x) + ", 100%, 50%)";  
                                            }
                                        
                                        }    
                                        
                                        
                                        return(
                                            //escalate circles verticaly based on the color

                                        
                                            

                                            <CircleMarker center={[segment.lat, segment.long]} radius={2}
                                            pathOptions={{ color: color }}
                                            opacity={"15%"}
                                            eventHandlers={{
                                                //check the heat value and show the popup with the right data
                                                
                                                                            
                                                mouseover: (event) => {
                                                    if(heat === "bitrate"){
                                                        event.target.bindPopup("Bitrate: " + segment.bitrate + " kbps on P19").openPopup();
                                                    }
                                                    if(heat === "jitter"){
                                                        event.target.bindPopup("Jitter: " + segment.jitter + " ms on P19").openPopup();
                                                    }
                                                    if(heat === "ploss"){
                                                        event.target.bindPopup("Packet Loss: " + segment.lost + " % on P19").openPopup();
                                                    }
                                                    event.target.openPopup()},
                                                mouseout: (event) => event.target.closePopup(),


                                            }}
                                            >
                                            </CircleMarker>

                                        );
                                        
                                    })
                                    :
                                    null
                                }

                                {
                                    data_cell != null ? 
                                    data_cell.map((segment) => {
                                        //if radio button is selected, show the circles
                                        if (post.includes("cell")){
                                            
                                            if(heat === "bitrate" ){
                                                let x = coloringBitrate(segment.bitrate, true);
                                                if (x <= 120) {
                                                    color = "hsl(" + x + ", 100%, 50%)";
                                                } else {
                                                    color = "hsl(" + 120 + ", 100%, 50%)";
                                                    
                                                }
                                            } else if(heat === "jitter"){
                                                let x=120 - segment.jitter
                                                if(x<0){
                                                    x=0;
                                                }else if(x>120){
                                                    x=120;
                                                }
                                                color = "hsl(" + (x) + ", 100%, 50%)";  
                                            } else if(heat === "ploss"){ 
                                                let x=120 - segment.lost
                                                if(x<0){
                                                    x=0;
                                                }else if(x>120){
                                                    x=120;
                                                }
                                                color = "hsl(" + (x) + ", 100%, 50%)";  
                                            }

                                        }else{
                                            if(heat === "bitrate" ){
                                                let x= (segment.bitrate);
                                                if(x<0){
                                                    x=0;
                                                }else if(x>120){
                                                    x=120;
                                                }
                                                color = "hsl(" + (x*15) + ", 100%, 50%)";
                                            } else if(heat === "jitter"){
                                                let x=120 - segment.jitter
                                                if(x<0){
                                                    x=0;
                                                }else if(x>120){
                                                    x=120;
                                                }
                                                color = "hsl(" + (x) + ", 100%, 50%)";  
                                            } else if(heat === "ploss"){ 
                                                let x=120 - segment.lost
                                                if(x<0){
                                                    x=0;
                                                }else if(x>120){
                                                    x=120;
                                                }
                                                color = "hsl(" + (x) + ", 100%, 50%)";  
                                            }
                                        
                                        }    
                                        
                                        
                                        return(
                                            //escalate circles verticaly based on the color
                                        
                                            <CircleMarker center={[segment.lat, segment.long]} radius={2}
                                            pathOptions={{ color: color }}
                                            opacity={"15%"}
                                            eventHandlers={{
                                                //check the heat value and show the popup with the right data
                                                
                                                                            
                                                mouseover: (event) => {
                                                    if(heat === "bitrate"){
                                                        event.target.bindPopup("Bitrate: " + segment.bitrate + " kbps on Cell").openPopup();
                                                    }
                                                    if(heat === "jitter"){
                                                        event.target.bindPopup("Jitter: " + segment.jitter + " ms on Cell").openPopup();
                                                    }
                                                    if(heat === "ploss"){
                                                        event.target.bindPopup("Packet Loss: " + segment.lost + " % on Cell").openPopup();
                                                    }
                                                    event.target.openPopup()},
                                                mouseout: (event) => event.target.closePopup(),


                                            }}
                                            >
                                            </CircleMarker>

                                        );
                                        
                                    })
                                    :
                                    null
                                } */}

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
                                </CardContent>
                            </Card>                          
                        </div>

                        </div>
                    </div>
                </div>
        
    );
}

// // loads the street data from json file
// function getLinesFromJson() {
//     return require('../data/lines1.json');
// }

// //loads the p15 data from json file
// function getP15FromJson() {
//     return require('../data/data_p15.json');
// }

// //loads the p19 data from json file
// function getP19FromJson() {
//     return require('../data/data_p19.json');
// }

// //loads the cell data from json file
// function getCellFromJson() {
//     return require('../data/data_cell.json');
// }

function coloringBitrate(x ,withCell) {
    if (withCell) {
        if (x < 1) {
                                        
                                            

            return 20;
        } else if (x >= 5 && x < 10) {
            return 40;
        } else if (x >= 10 && x < 15) {
            return 60;
        } else if (x >= 15 && x < 20) {
            return 85
        } else if (x >= 20 && x < 25) {
            return 95;
        } else {
            return 120;
        }
    }
}

export default Map;
