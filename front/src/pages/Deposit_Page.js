import React from "react";
import { useState, useEffect, useRef, useContext } from 'react';
import BasicCard from '@mui/material/Card';
import './Deposit_Page.css';
import { MetaMaskContext } from './MetaMaskContext';
import { BrowserRouter as Router, Routes, Route, BrowserRouter, useNavigate, Link} from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import Navigator from './Navigator';
import Content from './Content';
import Header from './Header';
import Card from '@mui/material/Card';
import { TextField, Box, Button, Dialog, DialogTitle, InputAdornment } from '@mui/material';
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
import error_image from '../images/pngwing.com.png';
import checkmark_image from '../images/checkmark.png';

import { contractsAddr } from '../config/config';
const addrProviderABI = require("../contractAbis/interfaces/ILendingBoardAddressesProvider.sol/ILendingBoardAddressesProvider.json");
const stokenTokenABI = require("../contractAbis/SampleToken.sol/SampleToken.json");

const ethers = require('ethers');



const Deposit_Page = () => {
  const { account, connectWallet } = useContext(MetaMaskContext); 

  useEffect(() => {
    if (!account) {
        connectWallet();
    }
}, [account, connectWallet]);
  
  const [inputQuantity, setInputQuantity] = useState("");
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [maxQuantity, setMaxQuantity] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const isLengthInvalid = selectedCurrency.length !== 40;


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

  useEffect(() => {
    const selected = currencies.find(c => c.value === selectedCurrency);
    if (selected) {
      setMaxQuantity(selected.max);
    }
  }, [selectedCurrency, currencies]);

  const checkValues = async () => {
//    if (parseFloat(inputQuantity) > maxQuantity) {
//      setShowErrorDialog(true);  // 에러 팝업창 표시
//    } else {
      console.log(contractsAddr);
      console.log(account);
      console.log(window.ethereum.isConnected());
      console.log(window.ethereum.networkVersion, 'window.ethereum.networkVersion');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log(provider);
      const signer = await provider.getSigner();
      console.log('address:', await signer.getAddress());
      const stoken = new ethers.Contract(contractsAddr["STKNToken"], stokenTokenABI['abi'], signer);
      const approveAmount = ethers.utils.parseEther("3000");
      //console.log('address:', await stoken.signer.getAddress());
      stoken.approve(contractsAddr["LBCore"], approveAmount);
      const contract = new ethers.Contract(contractsAddr["LBAddrProvider"], addrProviderABI['abi'], provider);
      const feeProvider = await contract.getFeeProvider();
      console.log(feeProvider);

      setShowSuccessDialog(true);  // 성공 팝업창 표시
//    }
  }
  function Copyright() {
    return (
      <Typography variant="body2" color="text.secondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          Your Website
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


  return (
    <div className="App">

{account ? (
                <p>Connected Account: {account}</p>
            ) : (
                <div>
                    <p>메타마스크에 연결되어 있지 않습니다.</p>
                    <Button variant="contained" onClick={connectWallet}>메타마스크 연결</Button>
                </div>
            )}
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
                <Header onDrawerToggle={handleDrawerToggle} title="Deposit" />
              <Box component="main" sx={{ display: 'flex', py: 12, px: 4 }}>
                <Card
                  sx={{ maxWidth: 300, height: '350px', border: '0.5px solid black', margin: '1rem', marginTop: '-20px' }}
                >
                  <CardMedia
                    sx={{ height: 140 }}
                    image={bitcon_image}
                    title="bitcoin"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Deposit
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '1rem' }}>
                      예치할 자산의 종류와 양을 입력해 주세요
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      많은 자산을 예치할수록 이용할 수 있는 서비스의 종류가 다양해집니다.
                    </Typography>
                  </CardContent>
                </Card>
                <Box sx={{ width: 500, maxWidth: '100%', marginLeft: '2rem' }}>
                  <TextField
                    fullWidth
                    label="Currency"
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    style={{ marginBottom: '1rem' }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">0x</InputAdornment>,
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
                 
                  <Button onClick={checkValues} variant="contained" style={{ marginTop: '1rem' }}>
                    예치
                  </Button>
                </Box>
                {/* 에러 팝업창 */}
                <Dialog open={showErrorDialog} onClose={() => setShowErrorDialog(false)}>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                      sx={{ height: 200, '& img': { objectFit: 'cover' }}}
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
                      sx={{ height: 200, '& img': { objectFit: 'cover' }}}
                      image={checkmark_image}
                      title="checkmark"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        예치 성공!
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        예치가 완료되었습니다
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
export default Deposit_Page;
// const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
// const contractABI = [/* 스마트 컨트랙트 ABI */];
// const contractAddress = '/* 스마트 컨트랙트 주소 */';

// const contract = new web3.eth.Contract(contractABI, contractAddress);

// function App() {
//   const [deposits, setDeposits] = useState([]);

//   useEffect(() => {
//     contract.events.Deposit({
//       fromBlock: 0
//     }, (error, event) => {
//       if (error) {
//         console.error(error);
//       } else {
//         setDeposits(currentDeposits => [...currentDeposits, event.returnValues]);
//       }
//     });
//   }, []);

//   return (
//     <div>
//       <h1>Deposit Events</h1>
//       {deposits.map((deposit, index) => (
//         <div key={index}>
//           <p>Reserve: {deposit._reserve}</p>
//           <p>User: {deposit._user}</p>
//           <p>Amount: {deposit._amount}</p>
//           <p>Timestamp: {deposit._timestamp}</p>
//         </div>
//       
//     </div>
//   );
// }






