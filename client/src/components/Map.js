import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";

import ReactMapGl, { NavigationControl } from 'react-map-gl';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

const INITIAL_VIEWPORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13
}
const Map = ({ classes }) => {
  const [viewPort, setViewPort] = useState(INITIAL_VIEWPORT);
  return (<div className={classes.root}>
    <ReactMapGl
      width="100vw"
      mapStyle="mapbox://styles/mapbox/streets-v9"
      height="calc(100vh - 64px)"
      mapboxApiAccessToken={"pk.eyJ1Ijoic2FoaWwyOTA3OTEiLCJhIjoiY2tsMDd1a3poMGl3aTJ1bGJyem0waWt0ZiJ9.JodR8KBYBkuBaOutv7DK0g"}
      {...viewPort}
      onViewportChange={setViewPort}
    >
      <div className={classes.navigationControl}>
        <NavigationControl onViewportChange={setViewPort} />
      </div>
    </ReactMapGl>
  </div>);
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
