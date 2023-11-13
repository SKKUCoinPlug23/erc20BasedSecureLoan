import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';


function Header(props) {
  const { onDrawerToggle, title } = props;

  return (
    <React.Fragment>
      <AppBar sx={{ backgroundColor: "#2E3D51" }} position="sticky" elevation={0}>

        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Grid sx={{ display: { sm: 'none', xs: 'block' } }} item>
             
            </Grid>
            <Grid item xs />
            <Grid item>
            </Grid>
            {/* 이부분에 메타마스크 구현 예정*/ }
            <Grid item>
              <IconButton color="inherit" sx={{ p: 0.5 }}>
                <Avatar src="/static/images/avatar/1.jpg" alt="My Avatar" />
              </IconButton>
            </Grid>
            {/* 이부분에 메타마스크 구현 예정*/ }
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        position="static"
        elevation={0}
        sx={{ backgroundColor: "#2E3D51", zIndex: 0 }} // 색상을 #2E3D51으로 수정
      >
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
                <Typography color="inherit" variant="h5" component="h1">
                    {title || "Coinplug"} 
                </Typography>
            </Grid>
            
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar component="div" position="static" elevation={0} sx={{ backgroundColor: "#2E3D51", zIndex: 0 }}>
        <Tabs value={0} textColor="inherit">
          {/* <Tab label="Users" />
          <Tab label="Sign-in method" />
          <Tab label="Templates" />
          <Tab label="Usage" /> */}
        </Tabs>
      </AppBar>
    </React.Fragment>
  );
}

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};

export default Header;