import { useEffect, useState } from 'react';
import { GraphQLClient } from 'graphql-request';

export const BASE_URL = process.env.NODE_ENV === 'production' ? 'prod-url' : 'http://localhost:4000/graphql';

const useClient = () => {
  const [idToken, setIdToken] = useState('');
  useEffect(() => {
    const idToken = window.gapi.auth2.getAuthInstance().currentUser.get().tokenObj.id_token;
    setIdToken(idToken);
  }, []);
  return new GraphQLClient(
    BASE_URL, {
      headers: {
        authorization: idToken
      }
    }
  );
};

export default useClient;