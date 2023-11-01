import React from "react";
import { useState, useEffect, useRef } from 'react';
import BasicCard from '@mui/material/Card';
import './Liquidation_Lists_Page.css';
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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Dialog, DialogTitle, DialogActions } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';






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
    <AppBar position="fixed" sx={{ height: 170 }}>
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
        <div style={{ padding: '10px',paddingTop: '20px',paddingLeft: '230px', textAlign: 'left', color: '#fff' }}>
        코인플러그 대출 서비스는 대출 제안 목록들을 제시해 사용자들의 1대1 계약에 도움을 주며<br />
         성사된 계약은 nft 형태의 부채 정보가 있는 채권으로 만들어 구매할 수 있는 기회를 사용자들에게 제공합니다.<br />
          또한 원하는 토큰을 빌릴 수 있는 기회를 제공하는 등 다양한 DeFi서비스를 운영합니다.
      </div>
      </Container>
    </AppBar>
  );
}


// InformationCard 컴포넌트
export function InformationCard({ totalProfit, maxProfit, rowCount }) {
  return (
    <Card sx={{ minWidth: 275, width: '1000px', height: '60px', border: '1px solid #000', marginBottom: '30px', marginTop: '-130px' }}>
      <CardContent style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography color='black' sx={{ fontSize: 18 }}>
          제안 개수: {rowCount}
        </Typography>
        <Typography color='black' sx={{ fontSize: 18, margin: '40 100px' }}>
          최대금액: ${maxProfit.toFixed(2)}
        </Typography>
        <Typography style={{ color: 'black', fontSize: '18px' }}>
          총 제안 금액: ${totalProfit.toFixed(2)}
        </Typography>
      </CardContent>
    </Card>
  );
}


const columns = [
  { field: 'id', headerName: 'ID', width: 150 },
  { field: 'Coin_Paid', headerName: '구분', width: 300 },
  { field: 'Coin_Received', headerName: '자산 종류', width: 300 },
  
{
  field: 'Total_Profit',
  headerName: '금액',
 
  
  width: 250
},

];

const rows = [
  { id: 1, Coin_Received: 'Bitcoin', Coin_Paid: 'LendProposal', age: 35, Total_Profit: 103.89 },
  { id: 2, Coin_Received: 'PlugToken', Coin_Paid: 'LendProposal', age: 42, Total_Profit: 74.47 },
  { id: 3, Coin_Received: 'SToken', Coin_Paid: 'LendProposal', age: 45, Total_Profit: 62.78 },
  { id: 4, Coin_Received: 'PlugToken', Coin_Paid: 'LendProposal', age: 16, Total_Profit: 147.34 },
  { id: 5, Coin_Received: 'Bitcoin', Coin_Paid: 'LendProposal', age: 47, Total_Profit: 200.97 },
  { id: 6, Coin_Received: 'Bitcoin', Coin_Paid: 'BorrowProposal', age: 14, Total_Profit: 36.09 },
  { id: 7, Coin_Received: 'AToken', Coin_Paid: 'BorrowProposal', age: 44, Total_Profit: 94.69 },
  { id: 8, Coin_Received: 'Ethereum', Coin_Paid: 'BorrowProposal', age: 36, Total_Profit: 456.14 },
  { id: 9, Coin_Received: 'SToken', Coin_Paid: 'BorrowProposal', age: 65, Total_Profit: 784.71 },
];





export function DataTable() {
  const totalProfitSum = rows.reduce((sum, row) => sum + row.Total_Profit, 0);
const [open, setOpen] = React.useState(false);

const handleClickOpen = () => {
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
};

  return (
    <div style={{ height: 400, width: '100%', width: '1000px' }}>
      <DataGrid
      columnWidth={200}
        rows={rows}
        columns={columns.map((col) => {
          if (col.field === 'liquidation') {
            return {
              ...col,
              renderCell: (params) => (
                <>
                  <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Liquidation
                  </Button>
                 
                </>
              )
            };
          }
          return col;
        })}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        hideFooterSelectedRowCount
      />
    </div>
  );
}







export default function Deposit_Page() {
  const totalProfit = rows.reduce((acc, curr) => acc + curr.Total_Profit, 0);
  const maxProfit = Math.max(...rows.map(row => row.Total_Profit));
  const rowCount = rows.length;

  return (
    <div className="App">
      <ResponsiveAppBar />
      <div className="container" style={{ display: 'flex', flexDirection: 'column' }}>
        <InformationCard totalProfit={totalProfit} maxProfit={maxProfit} rowCount={rowCount} />
        <DataTable />
      </div>
    </div>
  );
}

