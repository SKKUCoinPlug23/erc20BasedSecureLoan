import * as React from 'react';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import DnsRoundedIcon from '@mui/icons-material/DnsRounded';
import PermMediaOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActual';
import PublicIcon from '@mui/icons-material/Public';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import TimerIcon from '@mui/icons-material/Timer';
import SettingsIcon from '@mui/icons-material/Settings';
import PhonelinkSetupIcon from '@mui/icons-material/PhonelinkSetup';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';



const categories = [
  {
    id: 'Services',
    children: [
      
      { id: 'Deposit', icon: <DnsRoundedIcon /> },
      { id: 'Lend', icon: <PermMediaOutlinedIcon /> },
      { id: 'Borrow', icon: <PublicIcon /> },
      { id: 'Lend Proposal', icon: <SettingsEthernetIcon /> },
      { id: 'Borrow Proposal', icon: <SettingsInputComponentIcon /> },
      { id: 'Liquidation', icon: <SettingsEthernetIcon /> },
    ],
  },
  {
    id: 'User Info',
    children: [
      { id: 'My Assets', icon: <SettingsIcon /> },
      { id: 'My Proposal', icon: <TimerIcon /> },
      { id: 'NFTs', icon: <PhonelinkSetupIcon /> },
    ],
  },
];

const item = {
  py: '2px',
  px: 3,
  color: 'rgba(255, 255, 255, 0.7)',
  '&:hover, &:focus': {
    bgcolor: 'rgba(255, 255, 255, 0.08)',
  },
};

const itemCategory = {
  boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
  py: 1.5,
  px: 3,
};

export default function Navigator(props) {
  const { ...other } = props;
  const theme = useTheme();

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
      <Box sx={{ bgcolor: '#101F33' }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
            <ListItem disablePadding>
              <ListItemButton sx={{ ...item, bgcolor: '#101F33' }}>
                <ListItemIcon>
                  <HomeIcon sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary="Coinplug" sx={{ color: '#fff' }} />
              </ListItemButton>
            </ListItem>
          </Link>
        
        </Box>
        
        {categories.map(({ id, children }) => (
  <Box key={id} sx={{ bgcolor: '#101F33' }}>
    <ListItem sx={{ py: 2, px: 3 }}>
      <ListItemText sx={{ color: '#fff' }}>{id}</ListItemText>
    </ListItem>
    {children.map(({ id: childId, icon, active }) => (
  <ListItem disablePadding key={childId}>
    <Link 
      to={
        childId === 'Deposit' ? "/Deposit_Page" :
        childId === 'Lend' ? "/Lend_Lists_Page" :
        childId === 'Borrow' ? "/Borrow_Lists_Page" :
        childId === 'Lend Proposal' ? "/Lend_Proposal_Page" :
        childId === 'Borrow Proposal' ? "/Borrow_Proposal_Page" :
        childId === 'My Assets' ? "/My_Assets" :
        childId === 'My Proposal' ? "/My_Proposals":
        childId === 'NFTs' ? "/NFT_Page":
        childId === 'Liquidation' ? "/Liquidation_Lists_Page":
        childId === 'MainPage' ? "/":
    
        
        "#"  // Default fallback (if you don't want a default link, you can remove this)
      }
      style={{ textDecoration: 'none' }}
    >
      <ListItemButton selected={active} sx={item}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>{childId}</ListItemText>
      </ListItemButton>
    </Link>
  </ListItem>
))}

    <Divider sx={{ mt: 2 }} />
  </Box>
))}
      </List>
    </Drawer>
  );
}