import React from 'react';
import Map from './components/Map';
import './App.css';


export default function App() {

    return (
        <div class="container">
            <div class="row">
                {/* <div class="col-sm-1">
                </div> */}
                <div class="col">
                    <Map/>
                </div>
                {/* <div class="col-sm-1">
                </div> */}
            </div>
        </div>
    );
    
}