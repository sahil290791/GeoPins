import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import { GraphQLClient } from "graphql-request";
import { GoogleLogin } from "react-google-login";
import Typography from "@material-ui/core/Typography";

import { ME_QUERY } from '../../graphql/queries';
import Context from '../../context.js';

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);
  const onSuccess = async (user) => {
    try {
      const idToken = user.getAuthResponse().id_token; 
      const client = new GraphQLClient('http://localhost:4000/graphql', {
        headers: {
          authorization: idToken
        }
      });
      const data = await client.request(ME_QUERY);
      dispatch({
        type: "LOGIN_USER",
        payload: data.me
      });
      dispatch({
        type: "IS_LOGGED_IN",
        payload: user.isSignedIn(),
      });
    } catch(err) {
      onFailure(err);
    }
  };
  const onFailure = err => {
    console.log('Error logging in', err);
  };
  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
        style={{
          color: "rgb(66,133,244)"
        }}
      >
        Welcome
      </Typography>
      <GoogleLogin
        clientId="1483210302-a6vnpkbslg6e794j8i68590th654tgcd.apps.googleusercontent.com"
        onSuccess={onSuccess}
        isSignedIn
        onFailure={onFailure}
        theme="dark"
        buttonText="Login with Google"
      />
    </div>
  );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
