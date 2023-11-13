import React from "react";
import { useState, useEffect, useRef } from 'react';
import BasicCard from '@mui/material/Card';
import './Borrow_Proposal_Page.css';
import { BrowserRouter as Router, Routes, Route, BrowserRouter, useNavigate, Link} from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import Navigator from './Navigator';
import Header from './Header';
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


export default function Borrow_Proposal_Page() {

  function Copyright() {
    return (
      <Typography variant="body2" color="text.secondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
        Coinplug
        </Link>{' '}
        {new Date().getFullYear()}.
      </Typography>
    );
  }
  
  let theme = createTheme({
    palette: {
      primary: {
        light: '#63ccff',
        main: '#009be5',
        dark: '#006db3',
      },
    },
    typography: {
      h5: {
        fontWeight: 500,
        fontSize: 26,
        letterSpacing: 0.5,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiTab: {
        defaultProps: {
          disableRipple: true,
        },
      },
    },
    mixins: {
      toolbar: {
        minHeight: 48,
      },
    },
  });
  
  theme = {
    ...theme,
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: '#081627',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
          contained: {
            boxShadow: 'none',
            '&:active': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            marginLeft: theme.spacing(1),
          },
          indicator: {
            height: 3,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
            backgroundColor: theme.palette.common.white,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            margin: '0 16px',
            minWidth: 0,
            padding: 0,
            [theme.breakpoints.up('md')]: {
              padding: 0,
              minWidth: 0,
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: theme.spacing(1),
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 4,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgb(255,255,255,0.15)',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              color: '#4fc3f7',
            },
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            fontSize: 14,
            fontWeight: theme.typography.fontWeightMedium,
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: 'inherit',
            minWidth: 'auto',
            marginRight: theme.spacing(2),
            '& svg': {
              fontSize: 20,
            },
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            width: 32,
            height: 32,
          },
        },
      },
    },
  };
  
  const drawerWidth = 256;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
      <ThemeProvider theme={theme}>
          <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
              {isSmUp ? null : (
                <Navigator
                  PaperProps={{ style: { width: drawerWidth } }}
                  variant="temporary"
                  open={mobileOpen}
                  onClose={handleDrawerToggle}
                />
              )}
              <Navigator
                PaperProps={{ style: { width: drawerWidth } }}
                sx={{ display: { sm: 'block', xs: 'none' } }}
              />
            </Box>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Header onDrawerToggle={handleDrawerToggle} title="Borrow_Proposal" />
                <Box component="main" sx={{ display: 'flex', py: 8, px: 4 }}>

        
        {/* <div style={{ display: 'flex', alignItems: 'center' }}>  */}
          {/* This div wraps both the Card and the TextField Boxes */}
          
          {/* Card */}
          <Card sx={{ maxWidth: 300, height: '350px', border: '0.5px solid black', margin: '1rem', marginTop: '-20px' }}>
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
      fullWidth
      label="Reserve for collateral"
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
    select 
    fullWidth 
    label="Loan Period(month)" 
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
      </Box>
              <Box component="footer" sx={{ p: 2, bgcolor: '#eaeff1' }}>
                <Copyright />
              </Box>
            </Box>
          </Box>
        </ThemeProvider>

    {/* </div> */}

    </div>
  );
}




