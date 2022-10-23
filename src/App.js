import React,{useState, useEffect} from 'react';
import Map from './components/Map';
import './App.css';
import NavBar from './components/NavBar';
import Filter from './components/Filter';

export default function App() {
    const [selectedDataType, setSelectedDataType] = useState('bitrate');
    const [post, setPost] = useState([]);
    const [mode, setMode] = useState('segmented');
    const [bestMode, setBestMode] = useState(false);

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
                        <Filter setSelectedDataType={setSelectedDataType} setPost={setPost} post={post} setMode={setMode} setBestMode={setBestMode} mode={mode} bestMode={bestMode} />
                        <Map selectedDataType={selectedDataType} post={post} mode={mode} bestMode={bestMode} />
                    </div>
                </div>
            </div>
        </div>
    );
    
}