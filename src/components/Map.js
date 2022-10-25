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


const map_center = [40.6464534, -8.6536617];

// Lamp post's coordinates
const p15_coords = [40.64416, -8.65616];
const p19_coords = [40.64339, -8.65847];
const p3_coords = [40.64074, -8.65705];
const p5_coords = [40.64088, -8.65397];

const post_coords = {
    'p15': [40.64416, -8.65616],
    'p19' : [40.64339, -8.65847],
    'p3' : [40.64074, -8.65705],
    'p5' : [40.64088, -8.65397]
};


var segmented_data = null;
var coordinates_data = null;
var best_segmented_data = null;

//empty json object
var color="";

var center=[];

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

// var showLine = [];

function Map(props) {

    const [coords, setCoords] = useState({});
    const [showLine, setShowLine] = useState([]);

    useEffect(() => {
        fetch('/get_lines', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => 
            response.json().then(data => {
                console.log("get_lines");
                setCoords(data);
            })
        );
    }, []);

    useEffect(() => {
        fetch('/handle_segments', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => 
            response.json().then(data => {
                segmented_data = data[0];
                best_segmented_data = data[1];
                console.log("handle_segments");
                console.log(data);
            })
        );
    }, []);

    useEffect(() => {
        fetch('/get_json/', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => 
            response.json().then(data => {
                console.log("get_json");
                coordinates_data = data;
            })
        );
    }, []);


    function render_segmented_mode(segmented_data, best_segmented_data, post, selectedDataType, bestMode,hours) {
        if(!bestMode) {
            if (segmented_data != null) {
                return post.map((p) => {
                    var data_post = segmented_data[p];
                    
                    return Object.keys(data_post).map((segment) => {
                        var aux = segment.replace('[[', '').replace(']]', '').replace('[', '').replace(']', '').split(",").map(Number);
                        aux = [[ [aux[0], aux[1]], [aux[2], aux[3]] ]];
                        var values = data_post[segment];
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
                                        event.target.bindPopup("Bitrate: " + values.bitrate + " kbps on " + p).openPopup();
                                    }
                                    if(selectedDataType === "jitter"){
                                        event.target.bindPopup("Jitter: " + values.jitter + " ms on " + p).openPopup();
                                    }
                                    if(selectedDataType === "ploss"){
                                        event.target.bindPopup("Packet Loss: " + values.lost + " % on " + p).openPopup();
                                    }
                                    event.target.openPopup()},
                                    mouseout: (event) => event.target.closePopup(),
                                    
                                }}
                                />
                                )
                            })
                })
            }
        } else {
            if (best_segmented_data != null) {
                return Object.keys(best_segmented_data).map((segment) => {
                    var data = best_segmented_data[segment];
                    var aux = segment.replace('[[', '').replace(']]', '').replace('[', '').replace(']', '').split(",").map(Number);
                    aux = [[ [aux[0], aux[1]], [aux[2], aux[3]] ]];
                    var values = best_segmented_data[segment];
                    if(selectedDataType === "bitrate" ){
                        let x = coloringBitrate(data.bitrate, true);
                        if (x <= 120) {
                            color = "hsl(" + x + ", 100%, 50%)";
                        } else {
                            color = "hsl(" + 120 + ", 100%, 50%)";
                            
                        }
                        
                    } else if(selectedDataType === "jitter"){
                        let x=120 - data.jitter
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x) + ", 100%, 50%)";  
                    } else if(selectedDataType === "ploss"){ 
                        let x=120 - data.lost
                        if(x<0){
                            x=0;
                        }else if(x>120){
                            x=120;
                        }
                        color = "hsl(" + (x) + ", 100%, 50%)";  
                    }
                    
    
                    {
                        if (selectedDataType === 'bitrate') {
                            center = [best_segmented_data[segment].lat_bitrate, best_segmented_data[segment].long_bitrate]
                        } else if (selectedDataType === 'jitter') {
                            center = [best_segmented_data[segment].lat_jitter, best_segmented_data[segment].long_jitter]
                        } else if (selectedDataType === 'ploss') {
                            center = [best_segmented_data[segment].lat_lost, best_segmented_data[segment].long_lost]
                        }
                        
                    }

                    return (
                        <div>
                            <Polyline key={best_segmented_data[segment]} pathOptions={{ color: color }} positions={aux}
                                // eventHandlers={{
                                //     //check the heat value and show the popup with the right data                    

                                //     mouseover: (event) => {
                                //         if (selectedDataType === 'bitrate') {
                                //         } else if (selectedDataType === 'jitter') {
                                //         } else if (selectedDataType === 'ploss') {
                                //         }
                                //     },
                                //     mouseout: (event) => {
                                //     }
                                    
                                // }}
                                />
                            {
                                showLine != [] ?
                                <div>
                                        <CircleMarker
                                            center={center}
                                            radius={8}
                                            color={"black"}
                                            opacity={0.1}
                                            eventHandlers={{
                                                mouseover: (event) => {
                                                    if (selectedDataType === 'bitrate') {
                                                        event.target.bindPopup("Bitrate: " + values.bitrate + " kbps on " + best_segmented_data[segment].best_post_bitrate).openPopup();
                                                        if (best_segmented_data[segment].best_post_bitrate != 'cell') {
                                                            setShowLine([[best_segmented_data[segment].lat_bitrate, best_segmented_data[segment].long_bitrate], post_coords[best_segmented_data[segment].best_post_bitrate]]);
                                                        }
                                                    } else if (selectedDataType === 'jitter') {
                                                        event.target.bindPopup("Jitter: " + values.jitter + " ms on " + best_segmented_data[segment].best_post_jitter).openPopup();
                                                        if (best_segmented_data[segment].best_post_jitter != 'cell') {
                                                            setShowLine([[best_segmented_data[segment].lat_jitter, best_segmented_data[segment].long_jitter], post_coords[best_segmented_data[segment].best_post_jitter]]);
                                                        }
                                                    } else if (selectedDataType === 'ploss') {
                                                        event.target.bindPopup("Packet Loss: " + values.lost + " % on " + best_segmented_data[segment].best_post_lost).openPopup();
                                                        if (best_segmented_data[segment].best_post_lost != 'cell') {
                                                            setShowLine([[best_segmented_data[segment].lat_lost, best_segmented_data[segment].long_lost], post_coords[best_segmented_data[segment].best_post_lost]]);
                                                        }
                                                    }
                                                },
                                                mouseout: (event) => {
                                                    event.target.closePopup();
                                                    setShowLine([]);
                                                }
                                            }}
                                        />

                                        <Polyline
                                            positions={showLine}
                                            dashArray={3}
                                            color={"blue"}
                                            opacity={0.2}
                                        />
                                    </div>
                                :
                                null
                            }
                        </div>
                    )
                    
                });
            }
        }
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
                                    center={map_center}
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
                                    props.mode == 'segmented' ? 
                                    render_segmented_mode(segmented_data, best_segmented_data, props.post, props.selectedDataType, props.bestMode,props.hours)
                                    :
                                    render_coordinates_mode(coordinates_data, props.post, props.selectedDataType,props.hours) 
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
                                <Marker position={p3_coords} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
                                    <Popup>
                                        P 3
                                    </Popup>
                                </Marker>
                                <Marker position={p5_coords} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
                                    <Popup>
                                        P 5
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

// function render_segmented_mode(segmented_data, best_segmented_data, post, selectedDataType, bestMode) {
//     if(!bestMode) {
//         if (segmented_data != null) {
//             return post.map((p) => {
//                 var data_post = segmented_data[p];
//                 return Object.keys(data_post).map((segment) => {
//                     var aux = segment.replace('[[', '').replace(']]', '').replace('[', '').replace(']', '').split(",").map(Number);
//                     aux = [[ [aux[0], aux[1]], [aux[2], aux[3]] ]];
//                     var values = data_post[segment];
//                     //if radio button is selected, show the circles
//                     if (post.includes("cell")){
//                         if(selectedDataType === "bitrate" ){
//                             let x = coloringBitrate(values.bitrate, true);
//                             if (x <= 120) {
//                                 color = "hsl(" + x + ", 100%, 50%)";
//                             } else {
//                                 color = "hsl(" + 120 + ", 100%, 50%)";
                                
//                             }
//                         } else if(selectedDataType === "jitter"){
//                             let x=120 - values.jitter
//                             if(x<0){
//                                 x=0;
//                             }else if(x>120){
//                                 x=120;
//                             }
//                             color = "hsl(" + (x) + ", 100%, 50%)";  
//                         } else if(selectedDataType === "ploss"){ 
//                             let x=120 - values.lost
//                             if(x<0){
//                                 x=0;
//                             }else if(x>120){
//                                 x=120;
//                             }
//                             color = "hsl(" + (x) + ", 100%, 50%)";  
//                         }
//                     }else{
//                         if(selectedDataType === "bitrate" ){
//                             let x= (values.bitrate);
//                             if(x<0){
//                                 x=0;
//                             }else if(x>120){
//                                 x=120;
//                             }
//                             color = "hsl(" + (x*20) + ", 100%, 50%)";
//                         } else if(selectedDataType === "jitter"){
//                             let x=120 - values.jitter
//                             if(x<0){
//                                 x=0;
//                             }else if(x>120){
//                                 x=120;
//                             }
//                             color = "hsl(" + (x) + ", 100%, 50%)";  
//                         } else if(selectedDataType === "ploss"){ 
//                             let x=120 - values.lost
//                             if(x<0){
//                                 x=0;
//                             }else if(x>120){
//                                 x=120;
//                             }
//                             color = "hsl(" + (x) + ", 100%, 50%)";  
//                         }
//                     }
//                     return (
//                         <Polyline key={segment} pathOptions={{ color: color }} positions={aux}
//                             eventHandlers={{
//                                 //check the heat value and show the popup with the right data                    
//                                 mouseover: (event) => {
//                                     if(selectedDataType === "bitrate"){
//                                         event.target.bindPopup("Bitrate: " + values.bitrate + " kbps on " + p).openPopup();
//                                     }
//                                     if(selectedDataType === "jitter"){
//                                         event.target.bindPopup("Jitter: " + values.jitter + " ms on " + p).openPopup();
//                                     }
//                                     if(selectedDataType === "ploss"){
//                                         event.target.bindPopup("Packet Loss: " + values.lost + " % on " + p).openPopup();
//                                     }
//                                     event.target.openPopup()},
//                                 mouseout: (event) => event.target.closePopup(),
            
//                             }}
//                         />
//                     )
//                 })
//             })
//         }
//     } else {
//         if (best_segmented_data != null) {
//             return Object.keys(best_segmented_data).map((segment) => {
//                 var data = best_segmented_data[segment];

//                 var aux = segment.replace('[[', '').replace(']]', '').replace('[', '').replace(']', '').split(",").map(Number);
//                 aux = [[ [aux[0], aux[1]], [aux[2], aux[3]] ]];
//                 var values = best_segmented_data[segment];

//                 if(data.best_post == 'cell'){
//                     if(selectedDataType === "bitrate" ){
//                         let x = coloringBitrate(data.bitrate, true);
//                         if (x <= 120) {
//                             color = "hsl(" + x + ", 100%, 50%)";
//                         } else {
//                             color = "hsl(" + 120 + ", 100%, 50%)";
                            
//                         }
                    
//                     } else if(selectedDataType === "jitter"){
//                         let x=120 - data.jitter
//                         if(x<0){
//                             x=0;
//                         }else if(x>120){
//                             x=120;
//                         }
//                         color = "hsl(" + (x) + ", 100%, 50%)";  
//                     } else if(selectedDataType === "ploss"){ 
//                         let x=120 - data.lost
//                         if(x<0){
//                             x=0;
//                         }else if(x>120){
//                             x=120;
//                         }
//                         color = "hsl(" + (x) + ", 100%, 50%)";  
//                     }
//                 } else {
//                     if(selectedDataType === "bitrate" ){
//                         let x= (data.bitrate);
//                         if(x<0){
//                             x=0;
//                         }else if(x>120){
//                             x=120;
//                         }
//                         color = "hsl(" + (x*15) + ", 100%, 50%)";
//                     } else if(selectedDataType === "jitter"){
//                         let x=120 - data.jitter
//                         if(x<0){
//                             x=0;
//                         }else if(x>120){
//                             x=120;
//                         }
//                         color = "hsl(" + (x) + ", 100%, 50%)";  
//                     } else if(selectedDataType === "ploss"){ 
//                         let x=120 - data.lost
//                         if(x<0){
//                             x=0;
//                         }else if(x>120){
//                             x=120;
//                         }
//                         color = "hsl(" + (x) + ", 100%, 50%)";  
//                     }
//                 }

//                 return (
//                     <div>
//                         <Polyline key={best_segmented_data[segment]} pathOptions={{ color: color }} positions={aux}
//                             eventHandlers={{
//                                 //check the heat value and show the popup with the right data                    
//                                 mouseover: (event) => {
//                                     if(selectedDataType === "bitrate"){
//                                         event.target.bindPopup("Bitrate: " + values.bitrate + " kbps on " + best_segmented_data[segment].best_post).openPopup();
//                                     }
//                                     if(selectedDataType === "jitter"){
//                                         event.target.bindPopup("Jitter: " + values.jitter + " ms on " + best_segmented_data[segment].best_post).openPopup();
//                                     }
//                                     if(selectedDataType === "ploss"){
//                                         event.target.bindPopup("Packet Loss: " + values.lost + " % on " + best_segmented_data[segment].best_post).openPopup();
//                                     }
//                                     event.target.openPopup()},
//                                 mouseout: (event) => event.target.closePopup(),
            
//                             }}
//                         />
//                         <CircleMarker
//                             center={[best_segmented_data[segment].lat_bitrate, best_segmented_data[segment].long_bitrate]}
//                             radius={4}
//                             eventHandlers={{
//                                 mouseover: (event) => {
//                                     showLine = [center, [40.64416, -8.65616]];
//                                     console.log(showLine);
//                                 },
//                                 mouseout: (event) => {
//                                     showLine = [];
//                                     console.log(showLine);
//                                 }
//                             }}
//                         />
//                         {
//                             showLine != [] ?
//                                 <Polyline
//                                 positions={showLine}
//                                 />
//                             :
//                             null
//                         }
//                     </div>
//                 )
                
//             });
//         }
//     }
// }

function render_coordinates_mode(coordinates_data, post, selectedDataType,hours) {
    if (coordinates_data != null) {
        return post.map((p) => {
            var data_post = coordinates_data[p];
            console.log(hours);
            if (hours =='All time') {
                data_post = coordinates_data[p];
                console.log(data_post);
            }else{
                data_post = data_post.filter((d) => (d.hour > hours[0] && d.hour <= hours[1] ));
            }
            return data_post.map((segment) => {
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
                                event.target.bindPopup("Bitrate: " + segment.bitrate + " kbps on "+ p).openPopup();
                            }
                            if(selectedDataType === "jitter"){
                                event.target.bindPopup("Jitter: " + segment.jitter + " ms on "+ p).openPopup();
                            }
                            if(selectedDataType === "ploss"){
                                event.target.bindPopup("Packet Loss: " + segment.lost + " % on "+ p).openPopup();
                            }
                            event.target.openPopup()},
                        mouseout: (event) => event.target.closePopup(),
                    }}
                    >
                    </CircleMarker>

                );
                
            })
        })
    }
}

export default Map;
