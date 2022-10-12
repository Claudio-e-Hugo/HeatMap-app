import React from 'react';
import Map from './components/Map';
import './App.css';
import NavBar from './components/NavBar';



export default function App() {

    return (
        <div class="main-div"
        style={{
            backgroundColor: '#e3f2fd'
        }}
        >
            <div>
                <div class="row">
                    <NavBar/>
                </div>
                <div class="row">
                    <div class="col">
                        <Map/>
                    </div>
                </div>
            </div>
        </div>
    );
    
}