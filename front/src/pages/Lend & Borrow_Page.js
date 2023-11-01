import React from "react";
import { useState, useEffect, useRef } from 'react';
import BasicCard from '@mui/material/Card';
import './Lend & Borrow_Page.css';
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

const pages = ['Deposit', 'Lend&Borrow', 'My page'];
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

export default function Main_page() {

  // const renderCard = (title, subtitle, text) => (
  //   <div style={{ flex: '1 1 calc(20% - 16px)' }}>
  //     <Card className="card" sx={{ width: '100%', border: '2px solid black', marginBottom: '16px' }}>
  //       <CardContent>
  //         <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
  //           {title}
  //         </Typography>
  //         <Typography variant="h5" component="div">
  //           Lend Lists
  //         </Typography>
  //         <Typography sx={{ mb: 1.5 }} color="text.secondary">
  //           {subtitle}
  //         </Typography>
  //         <Typography variant="body2">  
  //           {text}
  //           <br />
  //           {'"Coinplug"'}
  //         </Typography>
  //       </CardContent>
  //       <CardActions sx={{ justifyContent: 'center', paddingBottom: '16px' }}>
  //         <Button 
  //             size="medium" 
  //             color="primary" 
  //             component={Link} 
  //             to="/Lend_Lists_Page"
  //             sx={{
  //               border: '2px solid deepskyblue', 
  //               borderRadius: '4px', 
  //               padding: '4px 24px', 
  //               backgroundColor: 'deepskyblue',
  //               color: 'white',
  //               '&:hover': {
  //                 backgroundColor: 'deepskyblue',
  //                 color: 'white'
  //               }
  //             }}
  //         >
  //             버튼
  //         </Button>        
  //       </CardActions>
  //     </Card>
  //   </div>
  // );



    return (
        <div className="App">
        
        <ResponsiveAppBar />
        {/* <div className="container" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '16px' }}>
      {renderCard("자금을 예치해보세요.", "A Token, Plug Token", "예치를 통해 다양한 서비스를 사용해 보세요.")}
      {renderCard("대출을 제안해보세요.", "B Token, Plug Token", "대출제안 등 다양한 서비스를 사용해 보세요.")}
      {renderCard("내 자산을 확인해 보세요.", "C Token, Plug Token", "내 제안목록 등을 살펴보고 확인해 보세요.")}
      {renderCard("거래를 시작해보세요.", "D Token, Plug Token", "거래를 통해 다양한 서비스를 경험해 보세요.")}
      {renderCard("투자를 해보세요.", "E Token, Plug Token", "투자를 통해 다양한 이익을 얻어 보세요.")}
    </div> */}

<div className="grid-container">
          
          <Card className="card" >
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            자금을 예치해보세요.
          </Typography>
          <Typography variant="h5" component="div">
            Lend
          </Typography>
          <Typography variant="body2">  
            Lend 목록들을 살펴보세요
            <br />
            {'"Coinplug"'}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center', paddingBottom: '16px' }}>
          <Button 
              size="medium" 
              color="primary" 
              component={Link} 
              to="/Lend_Lists_Page"
              sx={{
                border: '2px solid deepskyblue', 
                borderRadius: '4px', 
                padding: '4px 24px', 
                backgroundColor: 'deepskyblue',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'deepskyblue',
                  color: 'white'
                }
              }}
          >
              이동하기
          </Button>        
        </CardActions>
  </Card>
  
  
  
  <Card className="card">
      <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              대출을 제안해보세요.
          </Typography>
          <Typography variant="h5" component="div">
              Borrow
          </Typography>
          <Typography variant="body2">
              Borrow 목록들을 살펴보세요
              <br />
              {'"Coinplug"'}
          </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center' }}>
          <Button 
              size="medium" 
              color="primary" 
              component={Link} 
              to="/Borrow_Lists_Page"
              sx={{
                  border: '2px solid deepskyblue', 
                  borderRadius: '4px', 
                  padding: '4px 24px', 
                  backgroundColor: 'deepskyblue',
                  color: 'white',
                  '&:hover': {
                      backgroundColor: 'deepskyblue',
                      color: 'white'
                  }
              }}
          >
              이동하기
          </Button> 
      </CardActions>
  </Card>
  
      <Card className="card" >
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            내 자산을 확인해 보세요.
          </Typography>
          <Typography variant="h5" component="div">
            Lend Proposal
          </Typography>
          <Typography variant="body2">
            대출제안 목록을 살펴보세요.
            <br />
            {'"Coinplug"'}
          </Typography>
        </CardContent>
        <CardActions  sx={{ justifyContent: 'center' }}>
        <Button 
              size="medium" 
              color="primary" 
              component={Link} 
              to="/Lend_Proposal_Page"
              sx={{
                border: '2px solid deepskyblue', 
                borderRadius: '4px', 
                padding: '4px 24px', 
                backgroundColor: 'deepskyblue',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'deepskyblue',
                  color: 'white'
                }
              }}
          >
              이동하기
          </Button> 
        </CardActions>
      </Card>

      <Card className="card" >
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            내 자산을 확인해 보세요.
          </Typography>
          <Typography variant="h5" component="div">
            Borrow Proposal
          </Typography>
          <Typography variant="body2">
            대출제안 목록들을 살펴보세요.
            <br />
            {'"Coinplug"'}
          </Typography>
        </CardContent>
        <CardActions  sx={{ justifyContent: 'center' }}>
        <Button 
              size="medium" 
              color="primary" 
              component={Link} 
              to="/Borrow_Proposal_Page"
              sx={{
                border: '2px solid deepskyblue', 
                borderRadius: '4px', 
                padding: '4px 24px', 
                backgroundColor: 'deepskyblue',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'deepskyblue',
                  color: 'white'
                }
              }}
          >
              이동하기
          </Button> 
        </CardActions>
      </Card>

      <Card className="large-card" >
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            내 자산을 확인해 보세요.
          </Typography>
          <Typography variant="h5" component="div">
            Liquidation
          </Typography>
          <Typography variant="body2">
            청산제안들을 살펴보세요.
            <br />
            {'"Coinplug"'}
          </Typography>
        </CardContent>
        <CardActions  sx={{ justifyContent: 'center' }}>
        <Button 
              size="medium" 
              color="primary" 
              component={Link} 
              to="/Liquidation_Lists_Page"
              sx={{
                border: '2px solid deepskyblue', 
                borderRadius: '4px', 
                padding: '4px 24px', 
                backgroundColor: 'deepskyblue',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'deepskyblue',
                  color: 'white'
                }
              }}
          >
              이동하기
          </Button> 
        </CardActions>
      </Card>
  
  
      </div>
        
</div>
  );
}
