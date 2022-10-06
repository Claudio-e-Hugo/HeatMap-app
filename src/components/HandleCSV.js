import React from 'react';
import Papa from 'papaparse';

class HandleCSV extends React.Component {
    render() { 
        return (
            this.parseCoordinatesFromCsv(this.props)
        );
    }

    parseCoordinatesFromCsv(props) {
        // console.log(props.fileName);
    }
}
 
export default HandleCSV;