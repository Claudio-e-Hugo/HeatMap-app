import React,{useState} from 'react';
import Map from './components/Map';
import './App.css';
import NavBar from './components/NavBar';
import Filter from './components/Filter';
import logo from './imgs/imminence.png';
import it from './imgs/it.png';
import wavecom from './imgs/wavecom.png';
import pole from './imgs/pole.png';

export default function App() {
    const [selectedDataType, setSelectedDataType] = useState('bitrate');
    const [post, setPost] = useState([]);
    const [mode, setMode] = useState('segmented');
    const [bestMode, setBestMode] = useState(false);
    const [loopMode, setLoopMode] = useState(false);
    const [hours,setSelectedHours]=useState('All time');

    return (
        <div class="main-div"
        style={{
            backgroundColor: '#e3f2fd'
        }}
        >
            <div>
                <div class="row">
                    <NavBar logo={logo} it={it} wavecom={wavecom}/>
                </div>
                <div class="row">
                    <div class="col">
                        {/* <Filter setSelectedDataType={setSelectedDataType} setPost={setPost} post={post} setMode={setMode} setBestMode={setBestMode} mode={mode} bestMode={bestMode} setSelectedHours={setSelectedHours} hours={hours} /> */}
                        <Map pole={pole} > </Map>
                    </div>
                </div>
            </div>
        </div>
    );
    
}