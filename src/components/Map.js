import React from 'react';
import {
    MapContainer,
    Polyline,
    TileLayer,
    Marker,
    CircleMarker,
    Tooltip,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import {Control, Icon} from 'leaflet'
import '../App.css'
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import Filter from './Filter';

//import Legend leaflet from 'leaflet';

const map_center = [40.643101, -8.649256];

// Lamp post's coordinates
const p15_coords = [40.64416, -8.65616];
const p19_coords = [40.64339, -8.65847];
const p3_coords = [40.64074, -8.65705];
const p5_coords = [40.64088, -8.65397];

const post_coords = {
    'p15': [40.64416, -8.65616],
    'p19' : [40.64339, -8.65847],
    'p3' : [40.64074, -8.65705],
    'p5' : [40.64088, -8.65397],
    'p35' : [40.63028, -8.65423],
    'p26' : [40.63848, -8.65147]
};


//day hours filter
const Intervals = {
    //60:00 to 08:00
    "0,12" : 'Morning',
    "12,20": 'Early evening',
    "20,23" : 'Afternoon',
    "0,6"  : 'Night',
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

    const [selectedDataType, setSelectedDataType] = useState('bitrate');
    const [post, setPost] = useState([]);
    const [mode, setMode] = useState('segmented');
    const [bestMode, setBestMode] = useState(false);
    const [loopMode, setLoopMode] = useState(false);
    const [hours,setSelectedHours]=useState('All time');

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
        fetch('/handle_segments', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => 
            response.json().then(data => {
                segmented_data = data[0];
                best_segmented_data = data[1];
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
                coordinates_data = data;
            })
        );
    }, []);


    const times_list = [[0,12], [12,20], [20,23], [0, 6]];
    var idx = 0;

    useEffect(() => {
        if(loopMode === true) {
            setSelectedHours(times_list[0]);
            const interval = setInterval(() => {
                setSelectedHours(times_list[idx++]);
                if(idx > times_list.length-1) {
                    idx = 0;
                }
                
            }, 5000);
            return () => clearInterval(interval);
        } else {
            setSelectedHours('All time');
            idx = 0;
        }
    }, [loopMode]);
    

    function render_segmented_mode(segmented_data, best_segmented_data, post, selectedDataType, bestMode, hours) {
        if(!bestMode) {
            if (segmented_data != null) {
                return post.map((p) => {
                    var data_post = segmented_data[p];
                    console.log(data_post);
                    return Object.keys(data_post).map((segment) => {
                        var aux = segment.replace('[[', '').replace(']]', '').replace('[', '').replace(']', '').split(",").map(Number);
                        aux = [[ [aux[0], aux[1]], [aux[2], aux[3]] ]];
                        var values = data_post[segment];
                        console.log(p);
                        //if radio button is selected, show the circles
                        if (p==="cell"){
                            
                            if(selectedDataType === "bitrate" ){
                                let x = coloring(data_post[segment].bitrate, selectedDataType,true);
                                
                                color = "hsl(" + x + ", 100%, 50%)";
                            } else if(selectedDataType === "jitter"){
                                let x=coloring(data_post[segment].jitter,selectedDataType,true);
                                console.log(x);
                                color = "hsl(" + x + ", 100%, 50%)";  
                            } else if(selectedDataType === "ploss"){ 
                                let x=coloring(data_post[segment].lost,selectedDataType,true);
                                color = "hsl(" + (x) + ", 100%, 50%)";  
                            }
                        }else{
                            if(selectedDataType === "bitrate" ){
                                let x = coloring(data_post[segment].bitrate, selectedDataType,false);
                                color = "hsl(" + x + ", 100%, 50%)";
                            } else if(selectedDataType === "jitter"){
                                let x=coloring(data_post[segment].jitter,selectedDataType,false);
                                console.log(x);
                                color = "hsl(" + x + ", 100%, 50%)";  
                            } else if(selectedDataType === "ploss"){ 
                                let x=coloring(data_post[segment].lost,selectedDataType,false);
                                color = "hsl(" + x + ", 100%, 50%)";  
                            }
                        }
                        return (
                            <Polyline key={segment} pathOptions={{ color: color }} positions={aux}
                            eventHandlers={{
                                //check the heat value and show the popup with the right data                    
                                mouseover: (event) => {
                                    if(selectedDataType === "bitrate"){
                                        event.target.bindPopup("Bitrate: " + values.bitrate + " Mbps on " + p).openPopup();
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
                        let cell=false;
                        if (best_segmented_data[segment].best_post_bitrate==="cell"){
                            cell=true;
                        }
                        let x = coloring(data.bitrate,selectedDataType, cell);
                        
                        color = "hsl(" + x + ", 100%, 50%)";
                      
                        
                    } else if(selectedDataType === "jitter"){
                        let cell=false;
                        if (best_segmented_data[segment].best_post_jitter==="cell"){
                            cell=true;
                        }
                        let x = coloring(data.jitter,selectedDataType, cell);
                        
                        color = "hsl(" + x + ", 100%, 50%)";
                       
                    } else if(selectedDataType === "ploss"){ 
                        let cell=false;
                        if (best_segmented_data[segment].best_post_lost==="cell"){
                            cell=true;
                        }
                        let x = coloring(data.lost,selectedDataType, cell);
                        
                        color = "hsl(" + x + ", 100%, 50%)";
                        
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
                                                        event.target.bindPopup("Bitrate: " + values.bitrate + " Mbps on " + best_segmented_data[segment].best_post_bitrate).openPopup();
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

    function legend(){
        if (selectedDataType === 'bitrate') {
            return (
                <Card style={{ width: '8rem',margin:'auto'}}>
                                    <div class='my-legend'>
                                        
                                        <div class='legend-scale' style={{marginTop:'1rem',visibility:selectedDataType=='bitrate'? "visible":"hidden"}}>
                                            <h6 style={{marginLeft:'1rem' }}>ITS-G5 Bitrate</h6>
                                                <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',  backgroundColor:'hsl(0, 100%, 50%)'}}></span>&#60;1 Mbps<br/>
                                                <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',  backgroundColor:'hsl(20, 100%, 50%)'}}></span>&#60;2 Mbps<br/>
                                                <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',  backgroundColor:'hsl(40, 100%, 50%)'}}></span>&#60;3 Mbps<br/>
                                                <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',  backgroundColor:'hsl(60, 100%, 50%)'}}></span>&#60;4 Mbps<br/>
                                                <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',  backgroundColor:'hsl(80, 100%, 50%)'}}></span>&#60;5 Mbps<br/>
                                                <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',  backgroundColor:'hsl(100, 100%, 50%)'}}></span>&#60;6 Mbps<br/>
                                                <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',  backgroundColor:'hsl(110, 100%, 50%)'}}></span>&#60;7 Mbps<br/>
                                                <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',  backgroundColor:'hsl(120, 100%, 50%)'}}></span>&ge;7 Mbps<br/>
                                        </div>
                                        
                                    </div>
                                       
                                </Card>
            )
        }else if(selectedDataType === 'jitter'){
                return (
                    <Card style={{ width: '10rem',height:'15rem',margin:'auto'}}>
                                    <div class='my-legend'>
                                    
                                        <div class='legend-scale' style={{marginTop:'1rem',visibility:selectedDataType=='jitter'? "visible":"hidden"}}>
                                            <h6 style={{marginLeft:'1rem' }}>ITS-G5 Jitter </h6>
                                                <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.2rem',  backgroundColor:'hsl(120, 100%, 50%)'}}></span>&#60;0.3 ms<br/>
                                                <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.2rem',  backgroundColor:'hsl(100, 100%, 50%)'}}></span>&#60;1 ms<br/>
                                                <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.2rem',  backgroundColor:'hsl(80, 100%, 50%)'}}></span>&#60;5 ms<br/>
                                                <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.2rem',  backgroundColor:'hsl(60, 100%, 50%)'}}></span>&#60;10 ms<br/>
                                                <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.2rem',  backgroundColor:'hsl(40, 100%, 50%)'}}></span>&#60;20 ms<br/>
                                                <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.2rem',  backgroundColor:'hsl(30, 100%, 50%)'}}></span>&#60;30 ms<br/>
                                                {/* <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',  backgroundColor:'hsl(110, 100%, 50%)'}}></span>&#60;7<br/> */}
                                                <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.2rem',  backgroundColor:'hsl(0, 100%, 50%)'}}></span>&ge;30 ms<br/>
                                        </div>
                                        
                                        
                                        
                                    </div>
                                       
                                </Card>
                )}else if(selectedDataType === 'ploss'){
                return (
                    <Card style={{ width: '10rem',height:'15rem',margin:'auto'}}>
                                    <div class='my-legend'>
                                        

                                        <div class='legend-scale' style={{marginTop:'1rem',visibility:selectedDataType=='ploss'? "visible":"hidden"}}>
                                            <h6 style={{marginLeft:'1rem' }}>ITS-G5 Packet Loss </h6>
                                                <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.5rem',  backgroundColor:'hsl(120, 100%, 50%)'}}></span>&#60;10%<br/>
                                                <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.5rem',  backgroundColor:'hsl(80, 100%, 50%)'}}></span>&#60;30%<br/>
                                                <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.5rem',  backgroundColor:'hsl(60, 100%, 50%)'}}></span>&#60;50%<br/>
                                                <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.5rem',  backgroundColor:'hsl(40, 100%, 50%)'}}></span>&#60;70%<br/>
                                                <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.5rem',  backgroundColor:'hsl(20, 100%, 50%)'}}></span>&#60;90%<br/>
                                                <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.5rem',  backgroundColor:'hsl(0, 100%, 50%)'}}></span>&ge;90%<br/>
                                                {/* <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',  backgroundColor:'hsl(110, 100%, 50%)'}}></span>&#60;7<br/> */}
                                                {/* <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',  backgroundColor:'hsl(120, 100%, 50%)'}}></span>&#60;8<br/> */}
                                        </div>
                                        
                                        
                                    </div>
                                       
                                </Card>
                )
            }

        }

    function cellLegend(){
        if(post.includes('cell') || bestMode===true){
            if (selectedDataType === 'bitrate') {
                return (
                    <Card style={{ width: '8rem',height:'15rem',marginLeft:'0'}}>
                                        <div class='my-legend'>
                                            
                                            <div class='legend-scale' style={{marginTop:'1rem',visibility:selectedDataType=='bitrate'? "visible":"hidden"}}>
                                                <h5 style={{marginLeft:'1rem' }}>5G Bitrate</h5>
                                                    <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.6rem',  backgroundColor:'hsl(180, 100%, 50%)'}}></span>&#60;20 Mbps<br/>
                                                    <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.6rem',  backgroundColor:'hsl(220, 100%, 50%)'}}></span>&#60;40 Mbps<br/>
                                                    <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.6rem',  backgroundColor:'hsl(260, 100%, 50%)'}}></span>&#60;60 Mbps<br/>
                                                    <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.6rem',  backgroundColor:'hsl(280, 100%, 50%)'}}></span>&#60;80 Mbps<br/>
                                                    <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.6rem',  backgroundColor:'hsl(300, 100%, 50%)'}}></span>&ge;80 Mbps<br/>
                                                    
                                            </div>
                                            
                                        </div>
                                        
                                    </Card>
                )
            }else if(selectedDataType === 'jitter'){
                    return (
                        <Card style={{ width: '10rem',height:'15rem',margin:'auto'}}>
                                        <div class='my-legend'>
                                        
                                            <div class='legend-scale' style={{marginTop:'1rem',visibility:selectedDataType=='jitter'? "visible":"hidden"}}>
                                                <h5 style={{marginLeft:'1rem' }}> 5G Jitter</h5>
                                                    <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.3rem',  backgroundColor:'hsl(180, 100%, 50%)'}}></span>&#60;0.3 ms<br/>
                                                    <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.3rem',  backgroundColor:'hsl(210, 100%, 50%)'}}></span>&#60;0.7 ms<br/>
                                                    {/* <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.3rem',  backgroundColor:'hsl(210, 100%, 50%)'}}></span>&#60;0.8 ms<br/> */}
                                                    <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.3rem',  backgroundColor:'hsl(240, 100%, 50%)'}}></span>&#60;1 ms<br/>
                                                    <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.3rem',  backgroundColor:'hsl(270, 100%, 50%)'}}></span>&#60;10 ms<br/>
                                                    <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.3rem',  backgroundColor:'hsl(290, 100%, 50%)'}}></span>&#60;100 ms<br/>
                                                    <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.3rem',  backgroundColor:'hsl(320, 100%, 50%)'}}></span>&ge;100 ms<br/>
                                                    
                                            </div>
                                            
                                            
                                            
                                        </div>
                                        
                                    </Card>
                    )}else if(selectedDataType === 'ploss'){
                    return (
                        <Card style={{ width: '10rem',height:'15rem',margin:'auto'}}>
                                        <div class='my-legend'>
                                            

                                            <div class='legend-scale' style={{marginTop:'1rem',visibility:selectedDataType=='ploss'? "visible":"hidden"}}>
                                                <h6 style={{marginLeft:'1rem' }}>5G Packet Loss</h6>
                                                    <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.5rem',  backgroundColor:'hsl(180, 100%, 50%)'}}></span>&#60;1%<br/>
                                                    <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.5rem',  backgroundColor:'hsl(220, 100%, 50%)'}}></span>&#60;10%<br/>
                                                    <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.5rem',  backgroundColor:'hsl(240, 100%, 50%)'}}></span>&#60;30%<br/>
                                                    <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.5rem',  backgroundColor:'hsl(260, 100%, 50%)'}}></span>&#60;50%<br/>
                                                    <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.5rem',  backgroundColor:'hsl(280, 100%, 50%)'}}></span>&#60;80%<br/>
                                                    <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',marginTop:'0.5rem',  backgroundColor:'hsl(300, 100%, 50%)'}}></span>&ge;80%<br/>
                                                    {/* <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',  backgroundColor:'hsl(110, 100%, 50%)'}}></span>&#60;7<br/> */}
                                                    {/* <span style={{display: 'inline-block', width: '15px', height: '15px', marginLeft: '1rem',marginRight: '0.5rem',  backgroundColor:'hsl(120, 100%, 50%)'}}></span>&#60;8<br/> */}
                                            </div>
                                            
                                            
                                        </div>
                                        
                                    </Card>
                    )
        }else{
            return (
                <div></div>
            )
        }
        }

    }
    

    

    return (
            <div>
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-sm-3">
                            <Filter setSelectedDataType={setSelectedDataType} setPost={setPost} post={post} setMode={setMode} setBestMode={setBestMode} mode={mode} bestMode={bestMode} setSelectedHours={setSelectedHours} hours={hours} setLoopMode={setLoopMode} />
                        </div>
                        <div class="col-sm-7">
                            <Card  sx={{marginBottom:'10rem', minWidth: '100%', maxHeight: '90vh'}}>
                                <CardContent>
                                <MapContainer when id="map-container"
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
                                    mode == 'segmented' ? 
                                    render_segmented_mode(segmented_data, best_segmented_data, post, selectedDataType, bestMode, hours)
                                    :
                                    render_coordinates_mode(coordinates_data, post, selectedDataType, loopMode, hours) 
                                }
                                
                                {
                                    Object.keys(post_coords).map((post_id) => {
                                        return (

                                            <Marker position={post_coords[post_id]}  icon={new Icon({iconUrl: props.pole, iconSize: [50, 50], iconAnchor: [22, 42]})} >
                                                <Tooltip position={post_coords[post_id]} offset={[0, 0]} opacity={0.8} permanent={true}>
                                                    <span>{post_id}</span>
                                                </Tooltip>
                                            </Marker>
                                        );
                                        
                                    })
                                }

                            </MapContainer>
                                </CardContent>
                            </Card> 
                        </div>
                        <div class="col-sm-1">
                            <div class="float-left">
                                {legend()}
                                
                            </div>
                            <div>
                                {
                                    loopMode == true ?
                                        <Card>
                                            <CardContent>
                                                <span>Day Interval: {Intervals[hours.toString()]}</span>
                                                <br></br>
                                                <span> Hours: [ {hours[0]}, {hours[1]} ]</span>
                                            </CardContent>
                                        </Card>
                                    :
                                        null
                                }
                            </div>
                        </div>
                        <div class="col-sm-1">
                            <div class="float-left">
                                {cellLegend()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          
    );
}


function coloring(x ,selectedDataType,cell) {
    let bitrate = 0;
    let jitter = 0;
    let ploss = 0;
     
        //lit blue is the best value and dark blue is the worst value
    if (cell){
        if (selectedDataType === 'bitrate') {
            if (x<20){
                bitrate=180;  
            }
            else if (x<40){
                bitrate= 220;
            }
            else if (x<60){
                bitrate= 260;
            }else if (x<80){
                bitrate=280;
            }else{
                bitrate= 300;
                
            }
        } else if (selectedDataType === 'jitter') {
            if (x<=0.3){
                jitter=180;        
            }
            else if (x<0.7){
                jitter= 210;
            }
            // else if (x<0.8){
            //     jitter= 240;
            // }
            else if (x<1){
                jitter= 240;  
             
            }else if(x<10) {
                jitter= 270;
            }
            else if(x<100){
                jitter= 290;
            }else{
                jitter= 320;
                
            }
        } else if (selectedDataType === 'ploss') {
            if (x<=1){
                
                ploss=180;
            }
            else if (x<10){
                
                ploss=220;
            }
            else if (x<30){
                ploss=240;
            }else if (x<50){
                
                ploss=260;
            }
            else if (x<80){
                
                ploss=280;
            
            }else{
                ploss=300;
            }
                
        }
    }else{
        if (selectedDataType === 'bitrate') {
            if (x<1){
                bitrate=0;
            }
            else if (x<2){
                bitrate= 20;
            }
            else if (x<3){
                bitrate= 40;
            }
            else if (x<4){
                bitrate= 60;
            }
            else if (x<5){
                bitrate= 80;
            }
            else if (x<6){
                bitrate= 100;
            }else if (x<7){
                bitrate= 110;
            }else{
                bitrate= 120;
            }
        } else if (selectedDataType === 'jitter') {
            if (x<=0.3){
                jitter=120;
            }else if (x<1){
                jitter=100;
            }else if(x<5){
                jitter=80;
            }else if (x<10){
                jitter=60;
            }else if(x<20){
                jitter=40;
            }else if(x<30){
                jitter=20;
            }else{
                jitter=0;
            }
        }else if (selectedDataType === 'ploss') {
            if (x<10){
                ploss=120;
            }else if (x<30){
                ploss=80;
            }else if (x<50){
                ploss=60;
            }else if (x<70){
                ploss=40;
            }else if (x<90){
                ploss=20;
            }else{
                ploss=0;
            }
        }
    }
    
    if (selectedDataType === 'bitrate') {
        
        return bitrate;
    } else if (selectedDataType === 'jitter') {
        return jitter;
    } else if (selectedDataType === 'ploss') {
        return ploss;
    }
    
}

function render_coordinates_mode(coordinates_data, post, selectedDataType, loopMode, hours) {

    if (coordinates_data != null) {

        return post.map((p) => {
            if(selectedDataType === 'bitrate') {
                var data_post = coordinates_data[p].sort((a,b) => a.bitrate > b.bitrate ? 1 : -1);
            } else if (selectedDataType === 'jitter') {
                var data_post = coordinates_data[p].sort((a,b) => a.jitter > b.jitter ? 1 : -1);
            } else if (selectedDataType == 'ploss') {
                var data_post = coordinates_data[p].sort((a,b) => a.lost > b.lost ? 1 : -1);
            }
            if (hours =='All time') {
                data_post = coordinates_data[p];
            }else{
                data_post = data_post.filter((d) => (d.hour > hours[0] && d.hour <= hours[1] ));
            }
            return data_post.map((segment) => {
                if (segment.post=="cell"){
                    if(selectedDataType === "bitrate" ){
                        let x = coloring(segment.bitrate, selectedDataType,true);
                        color = "hsl(" + x + ", 100%, 50%)";
                    } else if(selectedDataType === "jitter"){
                        let x=coloring(segment.jitter,selectedDataType,true);
                        color = "hsl(" + x + ", 100%, 50%)";  
                    } else if(selectedDataType === "ploss"){ 
                        let x=coloring(segment.lost,selectedDataType,true);
                        color = "hsl(" + (x) + ", 100%, 50%)";  
                    }
                    
                }else{
                    if(selectedDataType === "bitrate" ){
                        let x = coloring(segment.bitrate, selectedDataType,false);                     
                        color = "hsl(" + x + ", 100%, 50%)";
                    } else if(selectedDataType === "jitter"){
                        let x = coloring(segment.jitter, selectedDataType,false);
                        color = "hsl(" + x + ", 100%, 50%)";  
                    } else if(selectedDataType === "ploss"){ 
                        let x = coloring(segment.lost, selectedDataType,false);
                        color = "hsl(" + x + ", 100%, 50%)";
                    }
                }    
                
                return(
                    <CircleMarker center={[segment.lat, segment.long]} radius={2}
                    pathOptions={{ color: color }}
                    opacity={"10%"}
                    eventHandlers={{
                        //check the heat value and show the popup with the right data                         
                        mouseover: (event) => {
                            if(selectedDataType === "bitrate"){
                                event.target.bindPopup("Bitrate: " + segment.bitrate + " Mbps on "+ p).openPopup();
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
