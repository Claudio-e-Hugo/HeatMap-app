import React,{useState, useEffect} from 'react';
import Map from './components/Map';
import './App.css';
import NavBar from './components/NavBar';
import Filter from './components/Filter';



export default function App() {
const [selectedHeat, setSelectedHeat] = useState('bitrate');
const [data, setData] = React.useState(null);
    useEffect(() => {
        console.log(selectedHeat);
    }, [selectedHeat])

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
                        <Filter setSelectedHeat={setSelectedHeat}/>
                        <Map selectedHeat={selectedHeat}/>
                    </div>
                </div>
            </div>
        </div>
    );
    
}