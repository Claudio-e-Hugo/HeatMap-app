import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PropaneSharp } from '@mui/icons-material';

function NavBar(props) {
    return ( 
        <Box marginBottom={5} sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ bgcolor: "#FFFF" }}>
                
                <div class="row">
                    <div class="col-4 my-auto">
                    
                        <img src={props.it} style={{width: "50%", marginLeft:"6rem"}}/>
                    </div>
                    <div class="col-4 my-auto" >
                        <img src={props.logo} style={{width: "50%", marginLeft:"6rem"}} ></img>
                    </div>
                    <div class="col-4 my-auto">
                        {/* align img to the right */}
                        <img class="ml-5" src={props.wavecom} style={{width: "50%", marginLeft:"6rem"}}></img>
                    </div>
                </div>
                
            </AppBar>
        </Box>
    );
}

export default NavBar;