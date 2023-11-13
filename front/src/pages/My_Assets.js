import React from "react";
import { useState, useEffect, useRef } from 'react';
import BasicCard from '@mui/material/Card';
import './My_page.css';
import { BrowserRouter as Router, Routes, Route, BrowserRouter, useNavigate, Link } from 'react-router-dom';
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
import {Pagination, PaginationItem, Tabs, Tab} from '@mui/material';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination'
import CssBaseline from '@mui/material/CssBaseline';
import Navigator from './Navigator';
import Header from './Header';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


export function VerticalTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const createData = (Asset_type, Address, Amount, Price) => {
    return { Asset_type, Address, Amount, Price };
  };
  const createData_1 = (Coin_Received, Coin_Paid, Type, Price) => {
    return { Coin_Received, Coin_Paid, Type, Price };
  };

  

  const rowsTab1 = [
    createData('Bitcoin', '0x8a13b14c19a', '1.25', '$3142'),
    createData('Ethereum', '0x1c29a11b565', '17.11', '$5489'),
    createData('XRP', '0x7c94c1a755c', '478.1', '$8486'),
    createData('SToken', '0x78ac5697b4f', '84.35', '$568'),
    createData('AToken', '0xff789a4cb87', '78.46', '$104'),
    
  ];

  const rowsTab2 = [
    createData_1('Bitcoin', 'Ethereum', 'LendProposal', '$9310'),
    createData_1('Bitcoin', 'PlugToken', 'LendProposal', '$5687'),
    createData_1('AToken', 'Ethereum', 'LendProposal', '$7814'),
    createData_1('PlugToken', 'AToken', 'LendProposal', '$879'),
    createData_1('PlugToken', 'Ethereum', 'BorrowProposal', '$77'),
    createData_1('Bitcoin', 'Ethereum', 'BorrowProposal', '$6879')
  ];

  // const rowsTab3 = [
  //   createData('Item1', 408, 3.2),
  //   createData('Item2', 237, 9.0),
  //   createData('Item3', 375, 0.0),
  //   createData('Item4', 518, 26.0),
  // ];

  const renderTableTab1 = (rows) => (
    <TableContainer component={Paper} style={{ width: '800px', height: '320px', border: '0.5px solid black' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{color: 'blue', width: '100px'}}>Asset Type</TableCell>
            <TableCell align="right" style={{color: 'blue', width: '100px'}}>Address</TableCell>
            <TableCell align="right" style={{color: 'blue', width: '100px'}}>Amount</TableCell>
            <TableCell align="right" style={{color: 'blue', width: '100px'}}>Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.Asset_type}>
              <TableCell>{row.Asset_type}</TableCell>
              <TableCell align="right">{row.Address}</TableCell>
              <TableCell align="right">{row.Amount}</TableCell>
              <TableCell align="right">{row.Price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
  
  const renderTableTab2 = (rows) => (
    <TableContainer component={Paper} style={{ width: '800px', height: '320px', border: '0.5px solid black' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{color: 'blue', width: '100px'}}>Coin Received</TableCell>
            <TableCell align="right" style={{color: 'blue', width: '100px'}}>Coin Paid</TableCell>
            <TableCell align="right" style={{color: 'blue', width: '100px'}}>Type</TableCell>
            <TableCell align="right" style={{color: 'blue', width: '100px'}}>Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.Coin_Received}>
              <TableCell>{row.Coin_Received}</TableCell>
              <TableCell align="right">{row.Coin_Paid}</TableCell>
              <TableCell align="right">{row.Type}</TableCell>
              <TableCell align="right">{row.Price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <div style={{ display: 'flex', height: 500, marginLeft: '-200px',marginTop: '-148px'}}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        style={{ borderRight: `1px solid rgba(0, 0, 0, 0.12)` }}
      >
        <Tab label="Assets" />
        <Tab label="My_Proposals" />
        {/* <Tab label="Tab 3" /> */}
      </Tabs>
      <div style={{ flexGrow: 1, padding: '5rem' }}>
        {value === 0 && renderTableTab1(rowsTab1)}
        {value === 1 && renderTableTab2(rowsTab2)}
      </div>
    </div>
  );
}


function createData(Asset_type, Address, Amount, Price) {
  return {Asset_type, Address, Amount, Price};
}

const rows = [
  createData('Bitcoin', '0x8a13b14c19a', '1.25', '$3142'),
  createData('Ethereum', '0x1c29a11b565', '17.11', '$5489'),
  createData('XRP', '0x7c94c1a755c', '478.1', '$8486'),
  createData('SToken', '0x78ac5697b4f', '84.35', '$568'),
  createData('AToken', '0xff789a4cb87', '78.46', '$104'),
  
];

export function BasicTable() {
  return (
    <TableContainer component={Paper} sx={{ maxWidth: 700, height: 330, border: '1px solid black' }}>
      <Table sx={{ maxWidth: 700 }} aria-label="simple table">
      <TableHead>
  <TableRow>
    <TableCell sx={{ color: 'blue' }}>Asset_type</TableCell>
    <TableCell align="right" sx={{ color: 'blue' }}>Address</TableCell>
    <TableCell align="right" sx={{ color: 'blue' }}>Amount</TableCell>
    <TableCell align="right" sx={{ color: 'blue' }}>Price</TableCell>
  </TableRow>
</TableHead>


        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.Asset_type}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.Asset_type}
              </TableCell>
              <TableCell align="right">{row.Address}</TableCell>
              <TableCell align="right">{row.Amount}</TableCell>
              <TableCell align="right">{row.Price}</TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

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
            <Box component="main" sx={{ flex: 1, py: 10, px: 18, bgcolor: '#eaeff1' }}>
              <BasicTable />
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

