import React from "react";
import { useState, useEffect, useRef } from 'react';
import BasicCard from '@mui/material/Card';
import './Borrow_Proposal_Page.css';
import { BrowserRouter as Router, Routes, Route, BrowserRouter, useNavigate, Link} from 'react-router-dom';

import Card from '@mui/material/Card';
import { TextField, Box, Button, Dialog, DialogTitle,  InputAdornment } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

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

import bitcon_image from '../images/bitcoin.jpg';
import error_image from '../images/pngwing.com.png'
import checkmark_image from '../images/checkmark.png'







const pages = ['Deposit', 'Lend&Borrow', 'My page'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

 



  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (page) => {
    if (page === 'My page') {
        navigate('/My_page');
    }
    // 메뉴를 닫는 로직 (예: 상태 변경)
};

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  

  

  return (
    <AppBar position="fixed" sx={{ height: 200 }}>
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
            onClick={() => handleCloseNavMenu(page)}
            sx={{ my: 2, ml: 2, mr: 2, color: 'white', display: 'block' }}
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
        <div style={{ padding: '10px',paddingTop: '30px',paddingLeft: '230px', textAlign: 'left', color: '#fff' }}>
        코인플러그 대출 서비스는 대출 제안 목록들을 제시해 사용자들의 1대1 계약에 도움을 주며<br />
         성사된 계약은 nft 형태의 부채 정보가 있는 채권으로 만들어 구매할 수 있는 기회를 사용자들에게 제공합니다.<br />
          또한 원하는 토큰을 빌릴 수 있는 기회를 제공하는 등 다양한 DeFi서비스를 운영합니다.
      </div>
      </Container>
    </AppBar>
  );
}

export default function Deposit_Page() {
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [inputQuantity, setInputQuantity] = useState("");
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [maxQuantity, setMaxQuantity] = useState(0);
  const [loanPeriod, setLoanPeriod] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [totalProfit, setTotalProfit] = useState('');
  const isLengthInvalid = selectedCurrency.length !== 32;

  const currencies = [
    {
      value: 'PlugToken',
      label: 'PlugToken',
      max: 1000,
    },
    {
      value: 'SToken',
      label: 'SToken',
      max: 800,
    },
    {
      value: 'BTC',
      label: '฿',
      max: 10,
    },
    {
      value: 'AToken',
      label: 'AToken',
      max: 5000,
    },
  ];

  const quantityOptions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' }
];



  useEffect(() => {
    const selected = currencies.find(c => c.value === selectedCurrency);
    if (selected) {
      setMaxQuantity(selected.max);
    }
  }, [selectedCurrency, currencies]);

  const checkValues = () => {
    if (parseFloat(inputQuantity) > maxQuantity) {
      setShowErrorDialog(true);  // 에러 팝업창 표시
    } else {
      setShowSuccessDialog(true);  // 성공 팝업창 표시
    }
  }

  useEffect(() => {
    if (inputQuantity && interestRate && loanPeriod) {
        const profit = inputQuantity * Math.pow((1 + parseFloat(interestRate) / 100), parseFloat(loanPeriod));
        setTotalProfit(profit.toFixed(2));
    }
}, [inputQuantity, interestRate, loanPeriod]);



  return (
    <div className="App">
      <ResponsiveAppBar />
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '10rem', marginTop: '250px' }}>

        
        <div style={{ display: 'flex', alignItems: 'center' }}> 
          {/* This div wraps both the Card and the TextField Boxes */}
          
          {/* Card */}
          <Card sx={{ maxWidth: 300, height: '350px', border: '2px solid black', margin: '1rem', marginTop: '-20px' }}>
            <CardMedia
              sx={{ height: 140 }}
              image={bitcon_image}
              title="bitcoin"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                BorrowProposal
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '1rem' }}>
                대출을 제안할 자산의 종류를 입력해 주세요.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                인기가 많은 자산을 제안할수록 제안수락 시간이 빨라집니다. 
              </Typography>
            </CardContent>
          </Card>

          {/* TextField Boxes */}
          <Box
        sx={{
          width: 500,
          maxWidth: '100%',
          marginLeft: '2rem'
        }}
      >
        <TextField
      fullWidth
      label="Currency"
      value={selectedCurrency}
      onChange={(e) => setSelectedCurrency(e.target.value)}
      style={{ marginBottom: '1rem' }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">0x</InputAdornment>
        ),
      }}
      error={isLengthInvalid}
      helperText={isLengthInvalid ? '32자리가 아닙니다!' : ''}
    />
        
        <TextField 
    fullWidth 
    label="Quantity" 
    value={inputQuantity} 
    onChange={(e) => setInputQuantity(e.target.value)}
    style={{ marginBottom: '1rem' }}
/>

<TextField 
    select 
    fullWidth 
    label="Loan Period" 
    value={loanPeriod}   
    onChange={(e) => setLoanPeriod(e.target.value)}
    style={{ marginBottom: '1rem' }}
>
    {quantityOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>
            {option.label}
        </MenuItem>
    ))}
</TextField>


<TextField 
            fullWidth 
            label="A monthly interest rate"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            style={{ marginBottom: '1rem' }}
        />
    
    <TextField 
            fullWidth 
            label="Total Profit"
            value={totalProfit}
            
        />

        <Button onClick={checkValues} variant="contained" style={{ marginTop: '1rem' }}>
          제안
        </Button>
      </Box>

      {/* 에러 팝업창 */}
      <Dialog open={showErrorDialog} onClose={() => setShowErrorDialog(false)}>
        <Card sx={{ maxWidth: 345 }}>
        <CardMedia
  sx={{ height: 200, '& img': { objectFit: 'cover' }}} // or 'contain'
  image={error_image}
  title="error"
/>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              오류 발생!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              입력한 수량이 최대 수량을 초과하였습니다.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => setShowErrorDialog(false)}>닫기</Button>
          </CardActions>
        </Card>
      </Dialog>

      {/* 성공 팝업창 */}
      <Dialog open={showSuccessDialog} onClose={() => setShowSuccessDialog(false)}>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
  sx={{ height: 200, '& img': { objectFit: 'cover' }}} // or 'contain'
  image={checkmark_image}
  title="checkmark"
/>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              제안 성공!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              제안이 완료되었습니다
            </Typography>
          </CardContent>
          <CardActions>
          <Button size="small" onClick={() => setShowSuccessDialog(false)}>닫기</Button>
          </CardActions>
        </Card>
      </Dialog>

    </div>

      </div>
    </div>
  );
}




