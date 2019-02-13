import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import { GraphQLClient } from "graphql-request";
import { GoogleLogin } from "react-google-login";
import Context from '../../context.js';
// import Typography from "@material-ui/core/Typography";

const ME_QUERY = `
  {
    me {
      _id
      name
      email
      picture
    }
  }
`;

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);
  const onSuccess = async (user) => {
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
  };
  return <GoogleLogin
      clientId="1483210302-a6vnpkbslg6e794j8i68590th654tgcd.apps.googleusercontent.com"
      onSuccess={onSuccess}
      isSignedIn
    />;
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
