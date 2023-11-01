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
        <div style={{ padding: '10px',paddingTop: '30px',paddingLeft: '230px', textAlign: 'left', color: '#fff' }}>
        코인플러그 대출 서비스는 대출 제안 목록들을 제시해 사용자들의 1대1 계약에 도움을 주며<br />
         성사된 계약은 nft 형태의 부채 정보가 있는 채권으로 만들어 구매할 수 있는 기회를 사용자들에게 제공합니다.<br />
          또한 원하는 토큰을 빌릴 수 있는 기회를 제공하는 등 다양한 DeFi서비스를 운영합니다.
      </div>
      </Container>
    </AppBar>
  );
}


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

export function RepayCard() {
  return(
  <Card className="card" sx={{ minWidth: 275, minHeight: 355, border: '2px solid black', marginRight: 10, display: 'flex', flexDirection: 'column'}}>
        <CardContent sx={{ flex: 1 }}>
        
        <Typography variant="h5" component="div" sx={{ marginTop: 7, fontSize: '2rem' }}>
          My Proposals
        </Typography>
        <Typography sx={{ mb: 1.5, marginTop: 4}} color="text.secondary">
          Lend & Borrow
        </Typography>
        <Typography variant="body2" sx={{marginTop: 6}}>  
          내 제안내역들을 살펴보세요.
        
        </Typography>
        </CardContent>
  <CardActions sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 'auto' }}>
    <Button size="small" color="primary" component={Link} to="/My_Proposals">
      내 제안 내역 살펴보기
    </Button>
  </CardActions>
    </Card>
  )
}






export default function Deposit_Page() {

  
    return (
        <div className="App">
          
        
        <ResponsiveAppBar />
       
        <div className="container">
        {/* <RepayCard />
        <BasicTable /> */}
        < VerticalTabs />
        
        
        
          
        

    </div>

    
      </div>
  );
}

