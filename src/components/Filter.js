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


function Filter(props,{setselectedHeat}) {
    
    const [heat, setHeat] = useState("bitrate");
    const [post, setPost] = useState([]);

    const [coords, setCoords] = useState({}); 

    // useEffect(() => {
    //     fetch('/get_lines', {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json"
    //         }
    //     }).then(response => 
    //         response.json().then(data => {
    //             setCoords(data);
    //         })
    //     );
    // }, []);

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
    
    useEffect(() => {
        // console.log('Heat is now: ', heat);
        
    }, [heat]);

    useEffect(() => {
        console.log('Post is now: ', post);
    }, [post]);

    const handleChange = (event) => {
        setHeat(event.target.value);
        console.log("Heat is now: ", event.target.value);
        setselectedHeat(event.target.value);
        
    }

    const handleChangeCheckBox = (event) => {
        //if check add to post array
        if(event.target.checked){
            setPost([...post, event.target.value]);
        }
        //if uncheck remove from post array
        else{
            setPost(post.filter(item => item !== event.target.value));
        }
    }
    
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
    const { window } = props;
    const [open, setOpen] = React.useState(false);
  
    const toggleDrawer = (newOpen) => () => {
      setOpen(newOpen);
    };
  
    // This is used only for the example
    const container = window !== undefined ? () => window().document.body : undefined;

    return (
            <div>
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-sm-1">
                            <div class="float-left">
                                <Root onMouseEnter={toggleDrawer(true)} >
                                    <CssBaseline />
                                    
                                    <Global                                        
                                        
                                        styles={{
                                        '.MuiDrawer-root > .MuiPaper-root': {
                                            height: `calc(50% - ${drawerBleeding}px)`,
                                            overflow: 'visible',
                                            
                                        },
                                        }}
                                    />
                                    <SwipeableDrawer
                                        
                                        container={container}
                                        anchor="bottom"
                                        open={open}
                                        onClose={toggleDrawer(false)}
                                        onOpen={toggleDrawer(true)}
                                        swipeAreaWidth={drawerBleeding}
                                        disableSwipeToOpen={false}
                                        
                                        ModalProps={{
                                        keepMounted: true,
                                        }}
                                    >
                                        <StyledBox onMouseLeave={toggleDrawer(false)}
                                        sx={{
                                            
                                            position: 'absolute',
                                            top: -drawerBleeding,
                                            borderTopLeftRadius: 8,
                                            borderTopRightRadius: 8,
                                            visibility: 'visible',
                                            right: 0,
                                            left: 0,
                                        }}
                                        >
                                        <Puller  />
                                        <Typography align="center" sx={{ p: 2, color: 'text.secondary'}}><b>Filters</b></Typography>
                                        </StyledBox>
                                        <StyledBox
                                        onMouseOver={toggleDrawer(true)}
                                        sx={{
                                            px: 2,
                                            pb: 2,
                                            height: '100%',
                                            overflow: 'auto',
                                        }}
                                        >
                                            
                                            <FormControl>
                                                <FormLabel id="info">Filters</FormLabel>
                                                <RadioGroup
                                                    aria-labelledby="demo-radio-buttons-group-label"
                                                    defaultValue="bitrate"
                                                    name="radio-buttons-group"
                                                >
                                                    <FormControlLabel onChange={handleChange} value="bitrate" control={<Radio />} label="BitRate" />
                                                    <FormControlLabel onChange={handleChange} value="jitter"  control={<Radio />} label="Jitter" />
                                                    <FormControlLabel onChange={handleChange} value="ploss"   control={<Radio />} label="Packet Loss" />
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
                                                <FormControlLabel
                                                    control={
                                                    <Checkbox value="cell" onChange={handleChangeCheckBox}/>
                                                    }
                                                    label="Cell"
                                                />
                                            </div>
                                        </StyledBox>
                                    </SwipeableDrawer>
                                </Root>
                            </div>
                        </div>
                        
                        </div>
                    </div>
                </div>
        
    );
}

export default Filter;


