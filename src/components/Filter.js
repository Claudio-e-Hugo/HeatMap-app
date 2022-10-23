import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import 'leaflet/dist/leaflet.css'
import '../App.css'
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';

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


function Filter(props) {

    const handleChange = (event) => {
        // props.setDataType(event.target.value);
        props.setSelectedDataType(event.target.value);
    }

    const handleChangeCheckBox = (event) => {
        //if check add to post array
        if(event.target.checked){
            props.setPost([...props.post, event.target.value]);
        }
        //if uncheck remove from post array
        else{
            props.setPost(props.post.filter(item => item !== event.target.value));
        }
    }

    const handleChangeBestMode = (event) => {
        if(event.target.checked){
            props.setBestMode(true);

        } else {
            props.setBestMode(false);
        }
    }

    const handleSwitchChange = (event) => {
        if(event.target.checked) {
            props.setMode('segmented');
            console.log(props.mode);
        } else {
            props.setMode('coordinates');
            console.log(props.mode);
        }
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
                                            <FormGroup>
                                                <FormControlLabel control={<Switch onChange={handleSwitchChange} defaultChecked />} label="Mode" />
                                            </FormGroup>
                                            {
                                                props.mode == 'segmented' ?
                                                    <div>
                                                        <h1>Segmented</h1>
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
                                                        
                                                        {
                                                            props.bestMode == false ? 
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
                                                            :
                                                            null
                                                        }
                                                        
                                                        
                                                        <div>
                                                        
                                                        <FormGroup>
                                                            <FormControlLabel
                                                                control={
                                                                <Checkbox value="best_mode" onChange={handleChangeBestMode}/>
                                                                }
                                                                label="Best Mode"
                                                            />
                                                        </FormGroup>
                                                        </div>
                                                    </div>
                                                :
                                                     <div>
                                                        <h1> Coordinates</h1>
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
                                                    </div>
                                            }
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


