import React from "react";
import './My_page.css';
import { BrowserRouter as Router, Routes, Route, BrowserRouter, useNavigate, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Navigator from './Navigator';
import Header from './Header';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { CardActionArea } from '@mui/material';
import nft1 from '../images/nft1.jpg'
import nft2 from '../images/nft2.jpg'
import nft3 from '../images/nft3.jpg'
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

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


  export function ActionAreaCard1() {
    return (
      <Card sx={{ Width: 500 }}>
        <CardActionArea>
        <CardMedia
                    sx={{ height: 240 }}
                    image={nft1}
                    title="nft1"
                  />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              NFT#231
            </Typography>
            <Typography variant="body2" color="text.secondary">
            This nft is being traded with Contract as a bond.<br />
            borrower: User#2259<br /> Amount: 13.3 <br />
            Due Date: 25/09/12<br /> Contract time stamp: 23/10/13<br />
            InterestRate: 13.5%<br /> Payback amount minus fee: 12.1
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }  

  export function ActionAreaCard2() {
    return (
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
        <CardMedia
                    sx={{ height: 240 }}
                    image={nft2}
                    title="nft2"
                  />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              NFT#156
            </Typography>
            <Typography variant="body2" color="text.secondary">
            This nft is being traded with Contract as a bond.<br />
            borrower: User#2259<br /> Amount: 13.3 <br />
            Due Date: 25/09/12<br /> Contract time stamp: 23/10/13<br />
            InterestRate: 13.5%<br /> Payback amount minus fee: 12.1
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }  

  export function ActionAreaCard3() {
    return (
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
        <CardMedia
                    sx={{ height: 240 }}
                    image={nft3}
                    title="nft3"
                  />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              NFT#931
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This nft is being traded with Contract as a bond.<br />
            borrower: User#2259<br /> Amount: 13.3 <br />
            Due Date: 25/09/12<br /> Contract time stamp: 23/10/13<br />
            InterestRate: 13.5%<br /> Payback amount minus fee: 12.1
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }  





export default function My_Assets_Page() {
        const [mobileOpen, setMobileOpen] = React.useState(false);
        const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
      
        const handleDrawerToggle = () => {
          setMobileOpen(!mobileOpen);
        };

  
    return (
        <div className="App">
          <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <CssBaseline />
          <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          >
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
            <Header onDrawerToggle={handleDrawerToggle} />
            <Box component="main" sx={{ flex: 1, p: 3, bgcolor: '#eaeff1', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
  <ActionAreaCard1 />
  <ActionAreaCard2 />
  <ActionAreaCard3 />
</Box>

            <Box component="footer" sx={{ p: 2, bgcolor: '#eaeff1' }}>
              <Copyright />
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    
       

    
      </div>
  );
}

