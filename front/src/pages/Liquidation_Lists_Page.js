import React from "react";
import { useState, useEffect, useRef } from 'react';
import BasicCard from '@mui/material/Card';
import './Liquidation_Lists_Page.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Dialog, DialogTitle, DialogActions, Link, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import Navigator from './Navigator';
import Header from './Header';




const pages = ['Deposit', 'Lend&Borrow', 'My page'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];


// InformationCard 컴포넌트
export function InformationCard({ totalProfit, maxProfit, rowCount }) {
  return (
    <Card sx={{ minWidth: 275, width: '1000px', height: '60px', border: '1px solid #000', marginBottom: '20px', marginTop: '-160px' }}>
      <CardContent style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography color='black' sx={{ fontSize: 18 }}>
          Data Grid Rows: {rowCount}
        </Typography>
        <Typography color='black' sx={{ fontSize: 18, margin: '40 100px' }}>
          Maximum Profit: ${maxProfit.toFixed(2)}
        </Typography>
        <Typography style={{ color: 'black', fontSize: '18px' }}>
          Total Profit: ${totalProfit.toFixed(2)}
        </Typography>
      </CardContent>
    </Card>
  );
}


const columns = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'Coin_Paid', headerName: 'Coin_Paid', width: 200 },
  { field: 'Coin_Received', headerName: 'Coin_Received', width: 250 },
  
{
  field: 'Total_Profit',
  headerName: 'Total_Profit',
 
  
  width: 250
},
{
    field: 'liquidation',
    headerName: 'Liquidation',
    sortable: false,
    width: 150,
    renderCell: (params) => (
      <Button variant="contained" color="primary">
        Liquidation
      </Button>
    ),
  },
];

const rows = [
  { id: 1, Coin_Received: 'Bitcoin', Coin_Paid: 'Ethereum', age: 35, Total_Profit: 103.89 },
  { id: 2, Coin_Received: 'PlugToken', Coin_Paid: 'AToken', age: 42, Total_Profit: 74.47 },
  { id: 3, Coin_Received: 'SToken', Coin_Paid: 'SToken', age: 45, Total_Profit: 62.78 },
  { id: 4, Coin_Received: 'PlugToken', Coin_Paid: 'AToken', age: 16, Total_Profit: 147.34 },
  { id: 5, Coin_Received: 'Bitcoin', Coin_Paid: 'Ethereum', age: 47, Total_Profit: 200.97 },
  { id: 6, Coin_Received: 'Bitcoin', Coin_Paid: 'SToken', age: 14, Total_Profit: 36.09 },
  { id: 7, Coin_Received: 'AToken', Coin_Paid: 'PlugToken', age: 44, Total_Profit: 94.69 },
  { id: 8, Coin_Received: 'Ethereum', Coin_Paid: 'Ethereum', age: 36, Total_Profit: 456.14 },
  { id: 9, Coin_Received: 'SToken', Coin_Paid: 'AToken', age: 65, Total_Profit: 784.71 },
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
                  <Dialog
  open={open}
  onClose={handleClose}
  slotProps={{
    backdrop: {
      style: {
        backgroundColor: 'rgba(0, 0, 0, 0.0)', // 원하는 스타일 적용
      },
    },
  }}
>
                    <DialogTitle>{"진행하시겠습니까?"}</DialogTitle>
                    <DialogActions>
                      <Button onClick={handleClose} color="primary">
                        아니오
                      </Button>
                      <Button onClick={handleClose} color="primary" autoFocus>
                        예
                      </Button>
                    </DialogActions>
                  </Dialog>
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







export default function Liquidation_List_Page_Page() {
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
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <CssBaseline />
          <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
            {!isSmUp && (
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
            <Header onDrawerToggle={handleDrawerToggle} title="Liquidation" />
            <Box component="main" sx={{ display: 'flex', py: 12, px: 4, ml: { xs: 1, sm: 3, md: 5 } }}>
  <DataTable />
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

