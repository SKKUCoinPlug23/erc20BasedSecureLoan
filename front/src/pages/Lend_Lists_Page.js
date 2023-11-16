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
import { Pagination, PaginationItem, Grid } from "@mui/material";
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
  { ID: "L#1241", Address: "0x8a13b14c19a", Amount: "$3142", Date: "23/11/10" },
  { ID: "L#5579", Address: "0x1c29a11b565", Amount: "$8746", Date: "23/12/11"},
  { ID: "L#7641", Address: "0x7c94c1a755c", Amount: "$6547", Date: "24/11/10" },
  { ID: "L#4871", Address: "0x78ac5697b4f", Amount: "$8912", Date: "24/05/07" },
  { ID: "L#9785", Address: "0xff789a4cb87", Amount: "$12684", Date: "24/07/30" },
];
const columns = [
  { field: 'ID', headerName: 'ID', width: 100, headerClassName: 'boldHeader' },
  { field: 'Address', headerName: 'Address', width: 200, headerClassName: 'boldHeader' },
  { field: 'Amount', headerName: 'Amount', width: 250, headerClassName: 'boldHeader' },
  { field: 'Date', headerName: 'Date', width: 250, headerClassName: 'boldHeader' },
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
  const [open, setOpen] = useState(false);
  const [lendCompleteOpen, setLendCompleteOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleClickOpen = (row) => {
    setOpen(true);
    setSelectedRow(row);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLendCompleteOpen = () => {
    setLendCompleteOpen(true);
  };

  const handleLendCompleteClose = () => {
    setLendCompleteOpen(false);
  };

  const updatedColumns = columns.map((col) => {
    if (col.field === 'Lend') {
      return {
        ...col,
        renderCell: (params) => (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => handleClickOpen(params.row)}
          >
            Lend
          </Button>
        ),
      };
    }
    return col;
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={updatedColumns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        hideFooterSelectedRowCount
        getRowId={(row) => row.ID}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Lend"}</DialogTitle>
        <DialogContent>
          {selectedRow && (
            <Grid container spacing={2}>
              {Object.entries(selectedRow).map(([key, value], index) => (
                <Grid item xs={6} key={key}>
                  <Typography gutterBottom>
                    <span style={{ color: 'blue' }}>{key}</span>: {value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { handleClose(); handleLendCompleteOpen(); }} color="primary">
            진행
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={lendCompleteOpen} onClose={handleLendCompleteClose}>
        <DialogTitle>{"Lend Completed"}</DialogTitle>
        <DialogContent>
          <Typography>
            Lend has been completed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLendCompleteClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
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