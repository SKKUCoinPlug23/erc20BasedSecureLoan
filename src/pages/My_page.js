import React from "react";
import { useState, useEffect, useRef } from 'react';
import BasicCard from '@mui/material/Card';
import './My_page.css';
import { BrowserRouter as Router, Routes, Route, BrowserRouter, useNavigate, Link} from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import CardMedia from '@mui/material/CardMedia';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Pagination} from '@mui/material';








const pages = ['Deposit', 'Lend&Borrow', 'Tokens', 'My page'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  

  

  

  return (
    <AppBar position="fixed" sx={{ height: 300 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              // fontFamily: 'monospace',
              fontWeight: 700,
              // letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Coinplug
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} 
                onClick={handleCloseNavMenu}
                >
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, paddingLeft: 10 }}>
          {pages.map((page) => (
        <Button
          key={page}
          onClick={handleCloseNavMenu}
          sx={{ my: 2, ml:2, mr: 2, color: 'white', display: 'block' }}
        >
          {page}
        </Button>
        ))}
        </Box>


          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
        <div style={{ padding: '10px',paddingTop: '50px',paddingLeft: '230px', textAlign: 'left', color: '#fff' }}>
        코인플러그 대출 서비스는 대출 제안 목록들을 제시해 사용자들의 1대1 계약에 도움을 주며<br />
         성사된 계약은 nft 형태의 부채 정보가 있는 채권으로 만들어 구매할 수 있는 기회를 사용자들에게 제공합니다.<br />
          또한 원하는 토큰을 빌릴 수 있는 기회를 제공하는 등 다양한 DeFi서비스를 운영합니다.
      </div>
      </Container>
    </AppBar>
  );
}

export function BasicAccordion() {
  return (
    <div>
     <Accordion sx={{minwidth: 500, border: '1px solid black'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>대출ID: B#1241 </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <div>
    <Typography component="span" sx={{ color: 'blue' }}>Address:</Typography>
    <Typography component="span" sx={{ marginRight: 4 }}> 0x8a13b14c19a</Typography>
    <Typography component="span" sx={{ color: 'blue' }}>Amount:</Typography>
    <Typography component="span" sx={{ marginRight: 4 }}> $3142</Typography>
    <Typography component="span" sx={{ color: 'blue' }}>Redemption deadline:</Typography>
    <Typography component="span"> 23/11/10</Typography>
  </div>
  <Button size="small" color="primary" component={Link} to="/Deposit_Page">
    repay
  </Button>
</AccordionDetails>

      </Accordion>
      <Accordion sx={{border: '1px solid black'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>대출ID: B#3819 </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <div>
    <Typography component="span" sx={{ color: 'blue' }}>Address:</Typography>
    <Typography component="span" sx={{ marginRight: 4 }}> 0x8a13b14c19a</Typography>
    <Typography component="span" sx={{ color: 'blue' }}>Amount:</Typography>
    <Typography component="span" sx={{ marginRight: 4 }}> $3142</Typography>
    <Typography component="span" sx={{ color: 'blue' }}>Redemption deadline:</Typography>
    <Typography component="span"> 23/11/10</Typography>
  </div>
  <Button size="small" color="primary" component={Link} to="/Deposit_Page">
    repay
  </Button>
</AccordionDetails>

      </Accordion>
      <Accordion sx={{border: '1px solid black'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>대출ID: B#3819 </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <div>
    <Typography component="span" sx={{ color: 'blue' }}>Address:</Typography>
    <Typography component="span" sx={{ marginRight: 4 }}> 0x8a13b14c19a</Typography>
    <Typography component="span" sx={{ color: 'blue' }}>Amount:</Typography>
    <Typography component="span" sx={{ marginRight: 4 }}> $3142</Typography>
    <Typography component="span" sx={{ color: 'blue' }}>Redemption deadline:</Typography>
    <Typography component="span"> 23/11/10</Typography>
  </div>
  <Button size="small" color="primary" component={Link} to="/Deposit_Page">
    repay
  </Button>
</AccordionDetails>

      </Accordion><Accordion sx={{border: '1px solid black'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>대출ID: B#3819 </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <div>
    <Typography component="span" sx={{ color: 'blue' }}>Address:</Typography>
    <Typography component="span" sx={{ marginRight: 4 }}> 0x8a13b14c19a</Typography>
    <Typography component="span" sx={{ color: 'blue' }}>Amount:</Typography>
    <Typography component="span" sx={{ marginRight: 4 }}> $3142</Typography>
    <Typography component="span" sx={{ color: 'blue' }}>Redemption deadline:</Typography>
    <Typography component="span"> 23/11/10</Typography>
  </div>
  <Button size="small" color="primary" component={Link} to="/Deposit_Page">
    repay
  </Button>
</AccordionDetails>

      </Accordion><Accordion sx={{border: '1px solid black'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>대출ID: B#3819 </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <div>
    <Typography component="span" sx={{ color: 'blue' }}>Address:</Typography>
    <Typography component="span" sx={{ marginRight: 4 }}> 0x8a13b14c19a</Typography>
    <Typography component="span" sx={{ color: 'blue' }}>Amount:</Typography>
    <Typography component="span" sx={{ marginRight: 4 }}> $3142</Typography>
    <Typography component="span" sx={{ color: 'blue' }}>Redemption deadline:</Typography>
    <Typography component="span"> 23/11/10</Typography>
  </div>
  <Button size="small" color="primary" component={Link} to="/Deposit_Page">
    repay
  </Button>
</AccordionDetails>

      </Accordion><Accordion sx={{border: '1px solid black'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>대출ID: B#3819 </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <div>
    <Typography component="span" sx={{ color: 'blue' }}>Address:</Typography>
    <Typography component="span" sx={{ marginRight: 4 }}> 0x8a13b14c19a</Typography>
    <Typography component="span" sx={{ color: 'blue' }}>Amount:</Typography>
    <Typography component="span" sx={{ marginRight: 4 }}> $3142</Typography>
    <Typography component="span" sx={{ color: 'blue' }}>Redemption deadline:</Typography>
    <Typography component="span"> 23/11/10</Typography>
  </div>
  <Button size="small" color="primary" component={Link} to="/Deposit_Page">
    repay
  </Button>
</AccordionDetails>

      </Accordion>
    </div>
  );

}



export function ListDividers() {

  const style = {
    width: '100%',
    maxWidth: 760,
    bgcolor: 'skyblue',
    border: '2px solid black',
    marginRight: 12,
  };


 
  return (
    
    <List sx={style} component="nav" aria-label="mailbox folders">
      <ListItem button>

        <ListItemText primary="Address" />
        <div style={{ color: 'red' }}>repay</div>
      </ListItem>
      <Divider />
      <ListItem button divider>
        <ListItemText primary="Address" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Address" />
      </ListItem>
      <Divider light />
      <ListItem button>
        <ListItemText primary="Address" />
        
      </ListItem>
      <Divider light />
      <ListItem button>
        <ListItemText primary="Address" />
        
      </ListItem>
      <Divider light />
      <ListItem button>
        <ListItemText primary="Address" />
        
      </ListItem>
      <Divider light />
      <ListItem button>
        <ListItemText primary="Address" />
        
      </ListItem>
    </List>
    
  );
}

export default function Deposit_Page() {

  
    return (
        <div className="App">
          
        
        <ResponsiveAppBar />
       
        <div className="container">
        <BasicAccordion />
        <Card className="card" sx={{ minWidth: 275, minHeight: 355, border: '2px solid black', display: 'flex', flexDirection: 'column'}}>
        <CardContent sx={{ flex: 1 }}>
        
        <Typography variant="h5" component="div" sx={{ marginTop: 7, fontSize: '2rem' }}>
          Redeem
        </Typography>
        <Typography sx={{ mb: 1.5, marginTop: 4}} color="text.secondary">
          A Token, Plug Token, S Token
        </Typography>
        <Typography variant="body2" sx={{marginTop: 6}}>  
          다양한 자산들의 종류와 현재 가치를 확인해 보세요
        
        </Typography>
        </CardContent>
  <CardActions sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 'auto' }}>
    <Button size="small" color="primary" component={Link} to="/Deposit_Page">
      내 자산 확인하러 가기
    </Button>
  </CardActions>
    </Card>
          
        

    </div>

    
      </div>
  );
}

