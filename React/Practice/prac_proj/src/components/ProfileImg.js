import React from 'react';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import Fab from '@material-ui/core/Fab';
import { green, pink } from '@material-ui/core/colors';
import { useSelector, useDispatch } from "react-redux";
import * as actions from '../actions/user'

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
  
}))(Badge);

const SmallAvatar = withStyles((theme) => ({
  root: {
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  },
}))(Avatar);

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  large: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
  green: {
    color: '#fff',
    backgroundColor: green[500],
  },
  mid: {
  margin : 'auto',
  },
}));

export default function BadgeAvatars(props) {
  const classes = useStyles();

  const hiddenFileInput = React.useRef(null);

  const dispatch = useDispatch();

  const handleEdit = () =>{
    hiddenFileInput.current.click();
  }

  const handleChange = (event) =>{

    const fileUploaded = event.target.files[0];

    console.log(fileUploaded)

    dispatch(actions.UploadImage('6094ec41b59cc30d28a3e5c6',fileUploaded))

  }

  return (
    <div className={classes.root}>
      {/* <StyledBadge
        overlap="circle"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        variant="dot"
      >
        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
      </StyledBadge> */}
      <Badge
      className = {classes.mid}
        overlap="circle"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
    //     badgeContent={ <Avatar className={classes.green}>
    //     <EditIcon />
    //   </Avatar>}

    badgeContent={<Fab color="secondary" aria-label="edit" onClick={handleEdit}>
    <EditIcon />
    </Fab>}



      >
          <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{display: 'none'}} 
      />
        <Avatar alt="Travis Howard" src={props.image} className={classes.large} />
      </Badge>
    </div>
  );
}
