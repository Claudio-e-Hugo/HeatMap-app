import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function NavBar() {
    return ( 
        <Box marginBottom={5} sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Typography align="center" color="success" variant="h4" component="div" sx={{ flexGrow: 1 }}>
                    Imminence
                </Typography>
            </AppBar>
        </Box>
    );
}

export default NavBar;