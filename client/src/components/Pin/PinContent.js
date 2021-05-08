import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import format from "date-fns/format";

import Context from '../../context';
import Typography from "@material-ui/core/Typography";
import AccessTime from "@material-ui/icons/AccessTime";
import Face from "@material-ui/icons/Face";

const PinContent = ({ classes }) => {
  const { state } = useContext(Context);
  const { currentPin: { title, content, author, createdAt, comment } } = state;
  return (
    <div className={classes.root}>
      <Typography
        component="h2"
        variant="h4"
        color="primary"
        gutterBottom
      >
        {title}
      </Typography>
      <Typography
        className={classes.text}
        variant="h6"
        color="inherit"
        gutterBottom
        component="h3"
      >
        <Face className={classes.icon} /> {author.name}
      </Typography>
      <Typography className={classes.text} variant="subtitle2" color="inherit" gutterBottom>
        <AccessTime className={classes.icon} /> {format(Number(createdAt), "MMM Do, YYYY")}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {content}
      </Typography>
    </div>
  );
};

const styles = theme => ({
  root: {
    padding: "1em 0.5em",
    textAlign: "center",
    width: "100%"
  },
  icon: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  text: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default withStyles(styles)(PinContent);
