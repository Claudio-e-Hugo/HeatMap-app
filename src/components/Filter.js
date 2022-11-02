import React,{useState} from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import 'leaflet/dist/leaflet.css'
import '../App.css'
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

//day hours filter
const Intervals = [
    //60:00 to 08:00
    { value: 'Morning',hours: '06:00-12:00' },
    { value: 'Early evening',hours: '12:00-18:00' },
    { value: 'Afternoon',hours: '18:00,00:00' },
    { value: 'Night',hours: '00:00,06:00' },
];



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

    const [dayTime, setDayTime] = useState("All time");


    // <MenuItem value={[6,12]}>Morning</
    // {[12,20]}>Afternoon</
    // {[20,23]}>Early evening
    // {[0,6]}>Night</

    const changeHour = (event) => {
        setDayTime(event.target.value);

        if(event.target.value == "Morning") {
            props.setSelectedHours([0,12]);
        } else if(event.target.value == "Afternoon") {
            props.setSelectedHours([12,20]);
        } else if(event.target.value == "Early Evening") {
            props.setSelectedHours([20,23]);
        } else if(event.target.value == "Night") {
            props.setSelectedHours([0, 6]);
        } else if(event.target.value == "All time") {
            props.setSelectedHours("All time");
        }


        
        
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
    
    const handleChangeLoopMode = (event) => {
        if(event.target.checked){
            props.setLoopMode(true);
        } else {
            props.setLoopMode(false);
        }
    }
    
    const handleSwitchChange = (event) => {
        if(event.target.checked) {
            props.setMode('segmented');
            props.setPost([]);
        } else {
            props.setMode('coordinates');
            props.setPost([]);
        }
    }

    return (
            <div>
                <div class="container-fluid">
                    <div class="row">
                        <div class="col">
                            <div class="float-left">
                                <Card sx={{marginBottom:'10rem', minWidth: '100%', maxHeight: '90vh'}}>
                                    <CardContent>
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
                                                                    label="5G"
                                                                />
                                                                <FormControlLabel
                                                                    control={
                                                                    <Checkbox value="p3" onChange={handleChangeCheckBox}/>
                                                                    }
                                                                    label="P3"
                                                                />
                                                                <FormControlLabel
                                                                    control={
                                                                    <Checkbox value="p5" onChange={handleChangeCheckBox}/>
                                                                    }
                                                                    label="P5"
                                                                />
                                                                <FormControlLabel
                                                                    control={
                                                                    <Checkbox value="p35" onChange={handleChangeCheckBox}/>
                                                                    }
                                                                    label="P35"
                                                                />
                                                                <FormControlLabel
                                                                    control={
                                                                    <Checkbox value="p26" onChange={handleChangeCheckBox}/>
                                                                    }
                                                                    label="P26"
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
                                                    <div class="row">

                                                    <h1> Coordinates</h1>
                                                        <div class="col">
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
                                                                    label="5G"
                                                                />
                                                                <FormControlLabel
                                                                    control={
                                                                    <Checkbox value="p3" onChange={handleChangeCheckBox}/>
                                                                    }
                                                                    label="P3"
                                                                />
                                                                <FormControlLabel
                                                                    control={
                                                                    <Checkbox value="p5" onChange={handleChangeCheckBox}/>
                                                                    }
                                                                    label="P5"
                                                                />
                                                                <FormControlLabel
                                                                    control={
                                                                    <Checkbox value="p35" onChange={handleChangeCheckBox}/>
                                                                    }
                                                                    label="P35"
                                                                />
                                                                <FormControlLabel
                                                                    control={
                                                                    <Checkbox value="p26" onChange={handleChangeCheckBox}/>
                                                                    }
                                                                    label="P26"
                                                                />
                                                            </div>
                                                        </div>
                                                    <div class="col-md">

                                                        <FormControl variant="outlined">
                                                            <InputLabel id="demo-simple-select-outlined-label">Hours</InputLabel>
                                                            <Select
                                                                labelId="demo-simple-select-outlined-label"
                                                                id="demo-simple-select-outlined"
                                                                value={dayTime}
                                                                onChange={changeHour}
                                                                label="Hours"
                                                                sx={{width: 200}}
                                                            >

                                                            {/* <MenuItem value={[6,12]}>Morning</MenuItem>
                                                            <MenuItem value={[12,20]}>Afternoon</MenuItem>
                                                            <MenuItem value={[20,23]}>Early evening</MenuItem>
                                                            <MenuItem value={[0,6]}>Night</MenuItem>
                                                            <MenuItem value={'All time'}>All day</MenuItem> */}
                                                            <MenuItem value={"Morning"}>Morning</MenuItem>
                                                            <MenuItem value={"Afternoon"}>Afternoon</MenuItem>
                                                            <MenuItem value={"Early Evening"}>Early evening</MenuItem>
                                                            <MenuItem value={"Night"}>Night</MenuItem>
                                                            <MenuItem value={'All time'}>All day</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </div>

                                                    <div>
                                                    
                                                    <FormGroup>
                                                        <FormControlLabel
                                                            control={
                                                            <Checkbox value="loop" onChange={handleChangeLoopMode}/>
                                                            }
                                                            label="Loop Mode"
                                                        />
                                                    </FormGroup>
                                                    </div>

                                                </div>
                                                
                                        }
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                        
                        </div>
                    </div>
                </div>
        
    );
}

export default Filter;


