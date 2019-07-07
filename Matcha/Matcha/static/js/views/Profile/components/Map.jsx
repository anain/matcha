import React from "react"
import L from "leaflet"
import mapMarker from '../../../styles/images/map-marker.png'
import './map.css'

const style = {
  width: "100%",
  height: "300px",
  overflow: 'hidden'
};

class Map extends React.Component {
  componentDidMount() {
    this.map = L.map("map", {
      center: [this.props.markerPosition.lat, this.props.markerPosition.lng],
      zoom: 10,
      layers: [
        L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        })
      ]
    });
    const icon = L.icon({
        iconUrl: mapMarker,
        iconSize:     [50, 50],
        iconAnchor:   [25, 50],
    })
    this.marker = L.marker(this.props.markerPosition, {icon: icon}).addTo(this.map);
  }

  componentDidUpdate({ markerPosition }) {
    if (this.props.markerPosition !== markerPosition) {
      this.marker.setLatLng(this.props.markerPosition)
      this.map.panTo(new L.LatLng(this.props.markerPosition.lat, this.props.markerPosition.lng));
    }
  }

  render() {
    return <div id="map" style={style} />
  }
}

export default Map