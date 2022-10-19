import React from 'react';
import {
    MapContainer,
    Polyline,
    Popup,
    TileLayer,
    Marker,
    CircleMarker
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
import '../App.css'
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';


const center = [40.6464534, -8.6536617];

// Lamp post's coordinates
const p15_coords = [40.64416, -8.65616];
const p19_coords = [40.64339, -8.65847];

// const coords = getLinesFromJson();

var p15_segmented = null;
var p19_segmented = null;
var cell_segmented = null;
var p15_coordinates = null;
var p19_coordinates = null;
var cell_coordinates = null;

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


function Map(props) {

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
                p15_segmented = data;
            })
        );
    }, []);


    useEffect(() => {
        const arg = {"post": "p19"};
        fetch('/handle_segments', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(arg)
        }).then(response => 
            response.json().then(data => {
                p19_segmented = data;
            })
        );
    }, []);

    useEffect(() => {
        const arg = {"post": "cell"};
        fetch('/handle_segments', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(arg)
        }).then(response => 
            response.json().then(data => {
                cell_segmented = data;
            })
        );
    }, []);

    useEffect(() => {
        const arg = {"post" : "p15"};
        fetch('/get_json/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(arg)
        }).then(response => 
            response.json().then(data => {
                p15_coordinates = data;
            })
        );
    }, []);

    useEffect(() => {
        const arg = {"post" : "p19"};
        
        fetch('/get_json/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(arg)
        }).then(response => 
            response.json().then(data => {
                p19_coordinates = data;
            })
        );
    })

    useEffect(() => {
        const arg = {"post" : "cell"};
        
        fetch('/get_json/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(arg)
        }).then(response => 
            response.json().then(data => {
                cell_coordinates = data;
            })
        );
    })
    
    var data_p15_segmented;
    var data_p19_segmented;
    var data_cell_segmented;
    var data_p15_coordinates;
    var data_p19_coordinates;
    var data_cell_coordinates;

    if (props.post.includes("p15")) {
        data_p15_segmented=p15_segmented;
        data_p15_coordinates=p15_coordinates;
    } else {
        data_p15_segmented=null;
        data_p15_coordinates=null;
    }
    if (props.post.includes("p19")) {
        data_p19_segmented=p19_segmented;
        data_p19_coordinates=p19_coordinates;
    } else {
        data_p19_segmented=null;
        data_p19_coordinates=null;
    }
    if(props.post.includes("cell")) {
        data_cell_segmented=cell_segmented;
        data_cell_coordinates=cell_coordinates;
    } else {
        data_cell_segmented=null;
        data_cell_coordinates=null;
    }
    if (!props.post.includes("p15") && !props.post.includes("p19") && !props.post.includes("cell")){
        data_p15_segmented=p15_segmented;
        data_p15_coordinates=p15_coordinates;
        data_p19_segmented=p19_segmented;
        data_p19_coordinates=p19_coordinates;
    }
  
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

                                { render_p15(data_p15_segmented, data_p15_coordinates, props.post, props.selectedDataType, props.mode) }
                                { render_p19(data_p19_segmented, data_p19_coordinates, props.post, props.selectedDataType, props.mode) }
                                { render_cell(data_cell_segmented, data_cell_coordinates, props.post, props.selectedDataType, props.mode) }

                                

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

function render_p15(data_p15_segmented, data_p15_coordinates, post, selectedDataType, mode) {
    if (mode == 'segmented') {
        if (data_p15_segmented != null) {
            return Object.keys(data_p15_segmented).map((segment) => {
                var aux = segment.replace('[[', '').replace(']]', '').replace('[', '').replace(']', '').split(",").map(Number);
                aux = [[ [aux[0], aux[1]], [aux[2], aux[3]] ]];
                
                var values = data_p15_segmented[segment];

                //if radio button is selected, show the circles
                if (post.includes("cell")){
                    if(selectedDataType === "bitrate" ){
                        let x = coloringBitrate(values.bitrate, true);
                        if (x <= 120) {
                            color = "hsl(" + x + ", 100%, 50%)";
                        } else {
                            color = "hsl(" + 120 + ", 100%, 50%)";
                            
                        }
                    
                    } else if(selectedDataType === "jitter"){
                        let x=120 - values.jitter
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x) + ", 100%, 50%)";  
                    } else if(selectedDataType === "ploss"){ 
                        let x=120 - values.lost
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x) + ", 100%, 50%)";  
                    }

                }else{
                    if(selectedDataType === "bitrate" ){
                        let x= (values.bitrate);
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x*20) + ", 100%, 50%)";
                    } else if(selectedDataType === "jitter"){
                        let x=120 - values.jitter
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x) + ", 100%, 50%)";  
                    } else if(selectedDataType === "ploss"){ 
                        let x=120 - values.lost
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x) + ", 100%, 50%)";  
                    }
                
                }
                
                return (
                    <Polyline key={segment} pathOptions={{ color: color }} positions={aux}
                        eventHandlers={{
                            //check the heat value and show the popup with the right data                    
                            mouseover: (event) => {
                                if(selectedDataType === "bitrate"){
                                    event.target.bindPopup("Bitrate: " + values.bitrate + " kbps on P15").openPopup();
                                }
                                if(selectedDataType === "jitter"){
                                    event.target.bindPopup("Jitter: " + values.jitter + " ms on P15").openPopup();
                                }
                                if(selectedDataType === "ploss"){
                                    event.target.bindPopup("Packet Loss: " + values.lost + " % on P15").openPopup();
                                }
                                event.target.openPopup()},
                            mouseout: (event) => event.target.closePopup(),

                        }}
                    />
                )
            })
        }
    } else {
        if (data_p15_coordinates != null) {
            return data_p15_coordinates.map((segment) => {
                if (post.includes("cell")){
                    if(selectedDataType === "bitrate" ){
                        let x = coloringBitrate(segment.bitrate, true);
                        if (x <= 120) {
                            color = "hsl(" + x + ", 100%, 50%)";
                        } else {
                            color = "hsl(" + 120 + ", 100%, 50%)";
                            
                        }
                    
                    } else if(selectedDataType === "jitter"){
                        let x=120 - segment.jitter
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x) + ", 100%, 50%)";  
                    } else if(selectedDataType === "ploss"){ 
                        let x=120 - segment.lost
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x) + ", 100%, 50%)";  
                    }

                }else{
                    if(selectedDataType === "bitrate" ){
                        let x= (segment.bitrate);
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x*15) + ", 100%, 50%)";
                    } else if(selectedDataType === "jitter"){
                        let x=120 - segment.jitter
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x) + ", 100%, 50%)";  
                    } else if(selectedDataType === "ploss"){ 
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
                    <CircleMarker center={[segment.lat, segment.long]} radius={2}
                    pathOptions={{ color: color }}
                    opacity={"15%"}
                    eventHandlers={{
                        //check the heat value and show the popup with the right data
                        
                                                    
                        mouseover: (event) => {
                            if(selectedDataType === "bitrate"){
                                event.target.bindPopup("Bitrate: " + segment.bitrate + " kbps on P15").openPopup();
                            }
                            if(selectedDataType === "jitter"){
                                event.target.bindPopup("Jitter: " + segment.jitter + " ms on P15").openPopup();
                            }
                            if(selectedDataType === "ploss"){
                                event.target.bindPopup("Packet Loss: " + segment.lost + " % on P15").openPopup();
                            }
                            event.target.openPopup()},
                        mouseout: (event) => event.target.closePopup(),


                    }}
                    >
                    </CircleMarker>

                );
                
            })
        }
    }

}

function render_p19(data_p19_segmented, data_p19_coordinates, post, selectedDataType, mode) {
    if (mode == 'segmented') {
        if (data_p19_segmented != null) {
            return Object.keys(data_p19_segmented).map((segment) => {
                var aux = segment.replace('[[', '').replace(']]', '').replace('[', '').replace(']', '').split(",").map(Number);
                aux = [[ [aux[0], aux[1]], [aux[2], aux[3]] ]];
                
                var values = data_p19_segmented[segment];

                //if radio button is selected, show the circles
                if (post.includes("cell")){
                    if(selectedDataType === "bitrate" ){
                        let x = coloringBitrate(values.bitrate, true);
                        if (x <= 120) {
                            color = "hsl(" + x + ", 100%, 50%)";
                        } else {
                            color = "hsl(" + 120 + ", 100%, 50%)";
                            
                        }
                    
                    } else if(selectedDataType === "jitter"){
                        let x=120 - values.jitter
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x) + ", 100%, 50%)";  
                    } else if(selectedDataType === "ploss"){ 
                        let x=120 - values.lost
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x) + ", 100%, 50%)";  
                    }

                }else{
                    if(selectedDataType === "bitrate" ){
                        let x= (values.bitrate);
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x*20) + ", 100%, 50%)";
                    } else if(selectedDataType === "jitter"){
                        let x=120 - values.jitter
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x) + ", 100%, 50%)";  
                    } else if(selectedDataType === "ploss"){ 
                        let x=120 - values.lost
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x) + ", 100%, 50%)";  
                    }
                
                }
                
                return (
                    <Polyline key={segment} pathOptions={{ color: color }} positions={aux}
                        eventHandlers={{
                            //check the heat value and show the popup with the right data                    
                            mouseover: (event) => {
                                if(selectedDataType === "bitrate"){
                                    event.target.bindPopup("Bitrate: " + values.bitrate + " kbps on P19").openPopup();
                                }
                                if(selectedDataType === "jitter"){
                                    event.target.bindPopup("Jitter: " + values.jitter + " ms on P19").openPopup();
                                }
                                if(selectedDataType === "ploss"){
                                    event.target.bindPopup("Packet Loss: " + values.lost + " % on P19").openPopup();
                                }
                                event.target.openPopup()},
                            mouseout: (event) => event.target.closePopup(),

                        }}
                    />
                )
            })
        }
    } else {
        if (data_p19_coordinates != null) {
            return data_p19_coordinates.map((segment) => {
                if (post.includes("cell")){
                    if(selectedDataType === "bitrate" ){
                        let x = coloringBitrate(segment.bitrate, true);
                        if (x <= 120) {
                            color = "hsl(" + x + ", 100%, 50%)";
                        } else {
                            color = "hsl(" + 120 + ", 100%, 50%)";
                            
                        }
                    
                    } else if(selectedDataType === "jitter"){
                        let x=120 - segment.jitter
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x) + ", 100%, 50%)";  
                    } else if(selectedDataType === "ploss"){ 
                        let x=120 - segment.lost
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x) + ", 100%, 50%)";  
                    }

                }else{
                    if(selectedDataType === "bitrate" ){
                        let x= (segment.bitrate);
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x*15) + ", 100%, 50%)";
                    } else if(selectedDataType === "jitter"){
                        let x=120 - segment.jitter
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x) + ", 100%, 50%)";  
                    } else if(selectedDataType === "ploss"){ 
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
                    <CircleMarker center={[segment.lat, segment.long]} radius={2}
                    pathOptions={{ color: color }}
                    opacity={"15%"}
                    eventHandlers={{
                        //check the heat value and show the popup with the right data
                        
                                                    
                        mouseover: (event) => {
                            if(selectedDataType === "bitrate"){
                                event.target.bindPopup("Bitrate: " + segment.bitrate + " kbps on P19").openPopup();
                            }
                            if(selectedDataType === "jitter"){
                                event.target.bindPopup("Jitter: " + segment.jitter + " ms on P19").openPopup();
                            }
                            if(selectedDataType === "ploss"){
                                event.target.bindPopup("Packet Loss: " + segment.lost + " % on P19").openPopup();
                            }
                            event.target.openPopup()},
                        mouseout: (event) => event.target.closePopup(),


                    }}
                    >
                    </CircleMarker>

                );
                
            })
        }
    }
}

function render_cell(data_cell_segmented, data_cell_coordinates, post, selectedDataType, mode) {
    if (mode == 'segmented') {
        if (data_cell_segmented != null) {
            return Object.keys(data_cell_segmented).map((segment) => {
                var aux = segment.replace('[[', '').replace(']]', '').replace('[', '').replace(']', '').split(",").map(Number);
                aux = [[ [aux[0], aux[1]], [aux[2], aux[3]] ]];
                
                var values = data_cell_segmented[segment];

                //if radio button is selected, show the circles
                if (post.includes("cell")){
                    if(selectedDataType === "bitrate" ){
                        let x = coloringBitrate(values.bitrate, true);
                        if (x <= 120) {
                            color = "hsl(" + x + ", 100%, 50%)";
                        } else {
                            color = "hsl(" + 120 + ", 100%, 50%)";
                            
                        }
                    
                    } else if(selectedDataType === "jitter"){
                        let x=120 - values.jitter
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x) + ", 100%, 50%)";  
                    } else if(selectedDataType === "ploss"){ 
                        let x=120 - values.lost
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x) + ", 100%, 50%)";  
                    }

                }else{
                    if(selectedDataType === "bitrate" ){
                        let x= (values.bitrate);
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x*20) + ", 100%, 50%)";
                    } else if(selectedDataType === "jitter"){
                        let x=120 - values.jitter
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x) + ", 100%, 50%)";  
                    } else if(selectedDataType === "ploss"){ 
                        let x=120 - values.lost
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x) + ", 100%, 50%)";  
                    }
                
                }
                
                return (
                    <Polyline key={segment} pathOptions={{ color: color }} positions={aux}
                        eventHandlers={{
                            //check the heat value and show the popup with the right data                    
                            mouseover: (event) => {
                                if(selectedDataType === "bitrate"){
                                    event.target.bindPopup("Bitrate: " + values.bitrate + " kbps on P19").openPopup();
                                }
                                if(selectedDataType === "jitter"){
                                    event.target.bindPopup("Jitter: " + values.jitter + " ms on P19").openPopup();
                                }
                                if(selectedDataType === "ploss"){
                                    event.target.bindPopup("Packet Loss: " + values.lost + " % on P19").openPopup();
                                }
                                event.target.openPopup()},
                            mouseout: (event) => event.target.closePopup(),

                        }}
                    />
                )
            })
        }
    } else {
        if (data_cell_coordinates != null) {
            return data_cell_coordinates.map((segment) => {
                if (post.includes("cell")){
                    if(selectedDataType === "bitrate" ){
                        let x = coloringBitrate(segment.bitrate, true);
                        if (x <= 120) {
                            color = "hsl(" + x + ", 100%, 50%)";
                        } else {
                            color = "hsl(" + 120 + ", 100%, 50%)";
                            
                        }
                    
                    } else if(selectedDataType === "jitter"){
                        let x=120 - segment.jitter
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x) + ", 100%, 50%)";  
                    } else if(selectedDataType === "ploss"){ 
                        let x=120 - segment.lost
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x) + ", 100%, 50%)";  
                    }

                }else{
                    if(selectedDataType === "bitrate" ){
                        let x= (segment.bitrate);
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x*15) + ", 100%, 50%)";
                    } else if(selectedDataType === "jitter"){
                        let x=120 - segment.jitter
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x) + ", 100%, 50%)";  
                    } else if(selectedDataType === "ploss"){ 
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
                    <CircleMarker center={[segment.lat, segment.long]} radius={2}
                    pathOptions={{ color: color }}
                    opacity={"15%"}
                    eventHandlers={{
                        //check the heat value and show the popup with the right data
                        
                                                    
                        mouseover: (event) => {
                            if(selectedDataType === "bitrate"){
                                event.target.bindPopup("Bitrate: " + segment.bitrate + " kbps on Cell").openPopup();
                            }
                            if(selectedDataType === "jitter"){
                                event.target.bindPopup("Jitter: " + segment.jitter + " ms on Cell").openPopup();
                            }
                            if(selectedDataType === "ploss"){
                                event.target.bindPopup("Packet Loss: " + segment.lost + " % on Cell").openPopup();
                            }
                            event.target.openPopup()},
                        mouseout: (event) => event.target.closePopup(),


                    }}
                    >
                    </CircleMarker>

                );
                
            })
        }
    }
}

export default Map;
