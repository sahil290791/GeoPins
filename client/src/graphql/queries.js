export const ME_QUERY = `
  {
    me {
      _id
      name
      email
      picture
    }
  }
`;

export const GET_PINS_QUERY = `
  {
    getPins {
      _id
      createdAt
      title
      image
      content
      latitude
      longitude
      author {
        _id
        picture
        name
      }
      comments {
        text
        createdAt
        author {
          _id
          name
          picture
        }
      }
    }
  }
`;