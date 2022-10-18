import React,{useState} from 'react';
import Map from './components/Map';
import './App.css';
import NavBar from './components/NavBar';
import Filter from './components/Filter';



export default function App() {
const [selectedheat, setselectedHeat] = useState('bitrate');
const [data, setData] = React.useState(null);
useEffect(() => {
    console.log(selectedheat);
  }, [selectedheat])

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
                        <Filter setselectedHeat={setselectedHeat}/>
                        <Map selectedheat={selectedheat}/>
                    </div>
                </div>
            </div>
        </div>
    );
    
}