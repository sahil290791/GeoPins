import React, { useState, useContext } from "react";
import axios from 'axios';
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";

import { useClient } from '../../customHooks';
import Context from '../../context';
import { CREATE_PIN_MUTATION } from '../../graphql/mutations';

const CreatePin = ({ classes }) => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const client = useClient();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { state, dispatch } = useContext(Context);

  const handleImageUplaod = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "geopins");
    data.append("cloud_name", "dg8dtnfam");
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dg8dtnfam/image/upload",
      data
    );
    return response.data.url;
  };

  const handleSubmit = async (e) => {
    try {
      setSubmitting(true);
      e.preventDefault();
      const url = await handleImageUplaod();
      
      const variables = {
        title,
        image: url,
        content,
        ...state.draft
      };
      const { createPin } = await client.request(CREATE_PIN_MUTATION, variables);
      handleDeleteDraft(e);
      dispatch({
        type: 'CREATE_PIN',
        payload: createPin
      });
    } catch (error) {
      setSubmitting(false);
      console.log("Error creating Pin", error);
    }
  };

  const handleDeleteDraft = (e) => {
    e.preventDefault();
    setContent("");
    setImage("");
    setTitle("");
    dispatch({
      type: "DELETE_DRAFT"
    });
  };

  return (
    <form className={classes.form}>
      <Typography
        className={classes.alignCenter}
        color="secondary"
        component="h2"
        variant="h4"
      >
        <LandscapeIcon className={classes.iconLarge}/> Pin Location
      </Typography>
      <div>
        <TextField
          name="title"
          label="title"
          placeholder="Insert pin title"
          onChange={e => setTitle(e.target.value)}
        />
        <input
          accept="img/*"
          id="image"
          type="file"
          className={classes.input}
          onChange={e => setImage(e.target.files[0])}
        />
        <label htmlFor="image">
          <Button
            component="span"
            size="small"
            style={{ color: image && "green" }}
            className={classes.button}
          >
            <AddAPhotoIcon />
          </Button>
        </label>
      </div>
      <div className={classes.contentField}>
        <TextField
          name="content"
          label="content"
          multiline
          rows={6}
          margin="normal"
          fullWidth
          variant="outlined"
          onChange={e => setContent(e.target.value)}
        />
      </div>
      <div>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={handleDeleteDraft}
        >
          <ClearIcon className={classes.leftIcon} />
          Discard
        </Button>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          disabled={!title.trim() || !content.trim() || !image || submitting }
          onClick={handleSubmit}
        >
          Submit
          <SaveIcon className={classes.rightIcon} />
        </Button>
      </div>
    </form>
  )
};

const styles = theme => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing.unit
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "95%"
  },
  input: {
    display: "none"
  },
  alignCenter: {
    display: "flex",
    alignItems: "center"
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0
  }
});

export default withStyles(styles)(CreatePin);
