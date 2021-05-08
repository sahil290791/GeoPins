import React, { useState, useEffect, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";

import Context from '../context';
import { useClient } from '../customHooks';
import { GET_PINS_QUERY } from '../graphql/queries';
import ReactMapGl, { NavigationControl, Marker } from 'react-map-gl';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import PinIcon from '../components/PinIcon';
import Blog from '../components/Blog';

const INITIAL_VIEWPORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13
}
const Map = ({ classes }) => {
  const client = useClient();
  const [viewPort, setViewPort] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition] = useState(null);
  const { state, dispatch } = useContext(Context);

  useEffect(() => {
    getPins();
    getUserPosition();
  }, []);

  const handleMapClick = (event) => {
    const { lngLat, leftButton } = event; 
    if (!leftButton) return;
    if (!state.draft) {
      dispatch({
        type: "CREATE_DRAFT",
      });
    }
    const [longitude, latitude] = lngLat;
      dispatch({
        type: "UPDATE_DRAFT_LOCATION",
        payload: {
          longitude,
          latitude
        }
      });
  }

  const getPins = async () => {
    const data = await client.request(GET_PINS_QUERY);
    dispatch({
      type: 'SET_PINS',
      payload: data.getPins
    });
  };

  const getUserPosition = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setViewPort({
          ...viewPort,
          latitude,
          longitude,
        });
        setUserPosition({
          latitude,
          longitude,
        });
      });
    }
  };

  return (<div className={classes.root}>
    <ReactMapGl
      width="100vw"
      mapStyle="mapbox://styles/mapbox/streets-v9"
      height="calc(100vh - 64px)"
      mapboxApiAccessToken={"pk.eyJ1Ijoic2FoaWwyOTA3OTEiLCJhIjoiY2tsMDd1a3poMGl3aTJ1bGJyem0waWt0ZiJ9.JodR8KBYBkuBaOutv7DK0g"}
      {...viewPort}
      onViewportChange={setViewPort}
      onClick={handleMapClick}
    >
      <div className={classes.navigationControl}>
        <NavigationControl onViewportChange={setViewPort} />
      </div>
      {userPosition ? (
        <div>
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="red" />
          </Marker>
        </div>
      ) : null}
      {
        state.draft && (
          <Marker
            latitude={state.draft.latitude}
            longitude={state.draft.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="hotpink" />
          </Marker>
        )
      }
      {state.pins && state.pins.map((pin) => (
        <Marker
          key={pin._id}
          latitude={pin.latitude}
          longitude={pin.longitude}
          offsetLeft={-19}
          offsetTop={-37}
        >
          <PinIcon size={40} color="darkblue" />
        </Marker>
          )
      )}
    </ReactMapGl>
    <Blog />
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
