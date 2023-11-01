import React from "react";
import { useState, useEffect, useRef } from 'react';
import BasicCard from '@mui/material/Card';
import './Borrow_Lists_Page.css';
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
import {Pagination, PaginationItem} from '@mui/material'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table';






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
    <AppBar position="fixed" sx={{ height: 300 }}>
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
        <div style={{ padding: '10px',paddingTop: '50px',paddingLeft: '230px', textAlign: 'left', color: '#fff' }}>
        코인플러그 대출 서비스는 대출 제안 목록들을 제시해 사용자들의 1대1 계약에 도움을 주며<br />
         성사된 계약은 nft 형태의 부채 정보가 있는 채권으로 만들어 구매할 수 있는 기회를 사용자들에게 제공합니다.<br />
          또한 원하는 토큰을 빌릴 수 있는 기회를 제공하는 등 다양한 DeFi서비스를 운영합니다.
      </div>
      </Container>
    </AppBar>
  );
}





// export function ListDividers() {
//   const style = {
//     width: '120%',
//     maxWidth: 1000,
//     bgcolor: 'background.paper',
//     border: '1px solid black'
//   };

//   const [page, setPage] = useState(1);

//   const itemsPerPage = 5;
//   const [items, setItems] = useState([
//     { text: "Id: B#1241 Address: 0x8a13b14c19a Amount: $3142 Deadline: 23/11/10" },
//     { text: "Id: B#2181 Address: 0x1c29a11b565 Amount: $8746 Deadline: 23/12/11" },
//     { text: "Id: B#3574 Address: 0x7c94c1a755c Amount: $6547 Deadline: 24/3/1" },
//     { text: "Id: B#9453 Address: 0x48ac89c87fa Amount: $5454 Deadline: 24/8/8" },
//     { text: "Id: B#4846 Address: 0x91ba7898f9c Amount: $7742 Deadline: 24/3/7" },
//     { text: "Id: B#9745 Address: 0x7845ac54c7b Amount: $4698 Deadline: 24/5/4" },
//     { text: "Id: B#4731 Address: 0x1b578acd88e Amount: $7412 Deadline: 24/4/5" },
//     { text: "Id: B#7510 Address: 0xab8e881c41b Amount: $1354 Deadline: 24/1/5" },
//     { text: "Id: B#3457 Address: 0x784c8ac8ba4 Amount: $7845 Deadline: 24/9/7" },
//     { text: "Id: B#8541 Address: 0x14ac514c56b Amount: $4459 Deadline: 24/1/4" },
//     { text: "Id: B#5641 Address: 0x4731c48b4ca Amount: $1894 Deadline: 24/7/7" },
//     { text: "Id: B#8412 Address: 0x4763bc87a6b Amount: $6212 Deadline: 24/3/6" },
    
    
    
//   ]);

//   const [openConfirmation, setOpenConfirmation] = useState(false); // 새로운 상태 변수 추가
//   const [selectedItemIndex, setSelectedItemIndex] = useState(null);

//   const handleChange = (event, value) => {
//     setPage(value);
//   };

//   const [open, setOpen] = useState(false);
//   const [openRepay, setOpenRepay] = useState(false);

//   const handleOpen = (idx) => {
//     setOpen(true);
//     setSelectedItemIndex(idx);  // 선택된 항목의 인덱스 저장
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   // 현재 선택된 항목의 인덱스를 저장하기 위한 상태

// // ...

// const handleConfirmationOpen = () => {
//   setOpen(false);
//   setOpenConfirmation(true);
// };

// const handleConfirmationClose = () => {
//   if (selectedItemIndex !== null) {
//     const newItems = [...items];  // items 배열 복제
//     newItems.splice((page - 1) * itemsPerPage + selectedItemIndex, 1);
//     setItems(newItems);  // 상태 갱신
//   }
//   setOpenConfirmation(false);
// };



// return (
//   <div>
//     <List sx={style} component="nav" aria-label="mailbox folders">
//       {items.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((item, idx) => (
//         <React.Fragment key={idx}>
//           <ListItem button>
//             <ListItemText 
//               primary={
//                 <>
//                   <span style={{ color: 'blue' }}>Id:</span> {item.text.split("Address:")[0].replace("Id:", "")}
//                   <span style={{ color: 'blue' }}>Address:</span> {item.text.split("Amount:")[0].replace("Id:" + item.text.split("Address:")[0].replace("Id:", ""), "")}
//                   <span style={{ color: 'blue' }}>Amount:</span> {item.text.split("Deadline:")[0].replace(item.text.split("Amount:")[0], "")}
//                   Deadline: {item.text.split("Deadline:")[1]}
//                 </>
//               } 
//             />
//             <Button variant="contained" color="primary" onClick={() => handleOpen(idx)}>
//               Borrow
//             </Button>
//           </ListItem>
//           {(idx < itemsPerPage - 1) && <Divider />}
//         </React.Fragment>
//       ))}
//     </List>


//       <Dialog
//   open={open}
//   onClose={handleClose}
// >
//   <DialogTitle>{"Borrow"}</DialogTitle>
//   <DialogContent>
//     <DialogContentText>
//      계속진행하시겠습니까?
//     </DialogContentText>
//   </DialogContent>
//   <DialogActions>
//     <Button onClick={handleClose} color="primary">
//       취소
//     </Button>
//     <Button onClick={handleConfirmationOpen} color="primary" autoFocus>
//       확인
//     </Button>
//   </DialogActions>
// </Dialog>

//       <Dialog
//   open={openConfirmation}
//   onClose={handleConfirmationClose}
// >
//   <DialogTitle>{"알림"}</DialogTitle>
//   <DialogContent>
//     <DialogContentText>
//      완료되었습니다!
//     </DialogContentText>
//   </DialogContent>
//   <DialogActions>
//     <Button onClick={handleConfirmationClose} color="primary" autoFocus>
//       닫기
//     </Button>
//   </DialogActions>
// </Dialog>

      

//       <Pagination 
//         count={Math.ceil(items.length / itemsPerPage)} 
//         page={page} 
//         onChange={handleChange}
//         renderItem={(item) => (
//           <PaginationItem
//             {...item}
//           />
//         )}
//       />
//     </div>
//   );
// }

function createData(Borrow_ID, Address, Amount, Deadline) {
  return {Borrow_ID, Address, Amount, Deadline};
}

const rows = [
  createData('B#1241', '0x8a13b14c19a', '$3142', '23/11/10'),
  createData('B#5579', '0x1c29a11b565', '$8746', '23/12/11'),
  createData('B#7641', '0x7c94c1a755c', '$6547', '24/11/10'),
  createData('B#4871', '0x78ac5697b4f', '$8912', '24/5/7'),
  createData('B#9785', '0xff789a4cb87', '$12684', '24/7/30'),
  
];

export function BasicTable() {
  return (
    <TableContainer component={Paper} sx={{ maxWidth: 900, height: 330, border: '1px solid black' }}>
      <Table sx={{ maxWidth: 900 }} aria-label="simple table">
      <TableHead>
  <TableRow>
    <TableCell sx={{ color: 'blue' }}>Borrow_ID</TableCell>
    <TableCell align="right" sx={{ color: 'blue' }}>Address</TableCell>
    <TableCell align="right" sx={{ color: 'blue' }}>Amount</TableCell>
    <TableCell align="right" sx={{ color: 'blue' }}>Deadline</TableCell>
    <TableCell align="center" sx={{ color: 'blue' }}>Action</TableCell> {/* 추가된 헤더 셀 */}
  </TableRow>
</TableHead>


        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.Borrow_ID}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.Borrow_ID}
              </TableCell>
              <TableCell align="right">{row.Address}</TableCell>
              <TableCell align="right">{row.Amount}</TableCell>
              <TableCell align="right">{row.Deadline}</TableCell>
              <TableCell align="center">
        <Button variant="contained" color="primary">
          Borrow
        </Button>
      </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}






export default function Deposit_Page() {

  
    return (
        <div className="App">
          
        
        <ResponsiveAppBar />
       
        <div className="container">
        {/* <ListDividers /> */}
        < BasicTable />
        
          
        

    </div>

    
      </div>
  );
}

