import React from "react";
import { useState, useEffect, useRef } from "react";
import BasicCard from "@mui/material/Card";
import "./Lend_Lists_Page.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
  useNavigate,
  Link,
} from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import Navigator from './Navigator';
import Header from './Header';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { DataGrid } from '@mui/x-data-grid';
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import CardMedia from "@mui/material/CardMedia";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Pagination, PaginationItem } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";


const rows = [
  { id: "L#1241", address: "0x8a13b14c19a", Amount: "$3142", date: "23/11/10" },
  { id: "L#5579", address: "0x1c29a11b565", Amount: "$8746", date: "23/12/11"},
  { id: "L#7641", address: "0x7c94c1a755c", Amount: "$6547", date: "24/11/10" },
  { id: "L#4871", address: "0x78ac5697b4f", Amount: "$8912", date: "24/05/07" },
  { id: "L#9785", address: "0xff789a4cb87", Amount: "$12684", date: "24/07/30" },
];
const columns = [
  { field: 'id', headerName: 'ID', width: 100, headerClassName: 'boldHeader' },
  { field: 'address', headerName: 'Address', width: 200, headerClassName: 'boldHeader' },
  { field: 'Amount', headerName: 'Amount', width: 250, headerClassName: 'boldHeader' },
  { field: 'date', headerName: 'Date', width: 250, headerClassName: 'boldHeader' },
  {
    field: 'Lend',
    headerName: 'Lend',
    sortable: false,
    width: 150,
    headerClassName: 'boldHeader',
    renderCell: (params) => (
      <Button variant="contained" color="primary">
        Lend
      </Button>
    ),
  },
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
          if (col.field === 'Lend') {
            return {
              ...col,
              renderCell: (params) => (
                <>
                  <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Lend
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

export default function Lend_List_Page_Page() {
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
            <Header onDrawerToggle={handleDrawerToggle} title="Lend" />
            <Box component="main" sx={{ display: 'flex', py: 12, px: 4, ml: 10 }}>
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