import React, { useState, useEffect, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import differenceInMinutes from "date-fns/difference_in_minutes";
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import { Subscription } from "react-apollo";

import Context from '../context';
import { useClient } from '../customHooks';
import { GET_PINS_QUERY } from '../graphql/queries';
import { DELETE_PIN_MUTATION } from '../graphql/mutations';
import { PIN_ADDED_SUBSCRIPTION, PIN_DELETED_SUBSCRIPTION, PIN_UPDATED_SUBSCRIPTION } from '../graphql/subscriptions';
import ReactMapGl, { NavigationControl, Marker, Popup } from 'react-map-gl';
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
  const mobileSize = useMediaQuery('(max-width: 650px)');
  const client = useClient();
  const [viewPort, setViewPort] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition] = useState(null);
  const [popup, setPopup] = useState(null);
  const { state, dispatch } = useContext(Context);

  useEffect(() => {
    getPins();
    getUserPosition();
  }, []);

  useEffect(() => {
    const pinExists = popup && state.pins.findIndex((pin) => pin._id === popup._id) > -1;
    if (!pinExists) {
      setPopup(null);
    } 
  }, [state.pins.length]);

  const handleSelectPin = (pin) => {
    setPopup(pin);
    dispatch({
      type: "SET_PIN",
      payload: pin,
    })
  };

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

  const handleDeletePin = async(pin) => {
    const variables = {
      pinId: pin._id
    };
    await client.request(DELETE_PIN_MUTATION, variables);
    setPopup(null);
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

  const highlightNewPin = (pin) => {
    const isNewPin = differenceInMinutes(Date.now(), Number(pin.createdAt)) <= 30;
    return isNewPin ? "limegreen" : "darkblue";
  };

  const isAuthUser = (pin) => state.currentUser._id === pin.author._id;

  return (<div className={mobileSize ? classes.rootMobile : classes.root}>
    <ReactMapGl
      width="100vw"
      scrollZoom={!mobileSize}
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
          <PinIcon onClick={() => handleSelectPin(pin)} size={40} color={highlightNewPin(pin)} />
        </Marker>
          )
      )}
      {
        popup && (
          <Popup
            anchor="top"
            latitude={popup.latitude}
            longitude={popup.longitude}
            closeOnClick={false}
            onClose={() => setPopup(null)}
          >
            <img
              src={popup.image} className={classes.popupImage}
              alt={popup.title}
            />
            <div className={classes.popupTab}>
              <Typography>
                {popup.latitude.toFixed(6)}, {popup.longitude.toFixed(6)}
              </Typography>
              {isAuthUser(popup) && (
                <Button onClick={() => handleDeletePin(popup)}>
                  <DeleteIcon className={classes.deleteIcon}/>
                </Button>
              )}
            </div>
          </Popup>
        )
      }
    </ReactMapGl>
    <Subscription
      subscription={PIN_ADDED_SUBSCRIPTION}
      onSubscriptionData={({ subscriptionData }) => {
        const { pinAdded } = subscriptionData.data;
        dispatch({
          type: "CREATE_PIN",
          payload: pinAdded
        });
      }}
    />
    <Subscription
      subscription={PIN_DELETED_SUBSCRIPTION}
      onSubscriptionData={({ subscriptionData }) => {
        const { pinDeleted } = subscriptionData.data;
        dispatch({
          type: 'DELETE_PIN',
          payload: pinDeleted,
        });
      }}
    />
    <Subscription
      subscription={PIN_UPDATED_SUBSCRIPTION}
      onSubscriptionData={({ subscriptionData }) => {
        const { pinUpdated } = subscriptionData.data;
        dispatch({
          type: "CREATE_COMMENT",
          payload: pinUpdated
        });
      }}
    />
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
