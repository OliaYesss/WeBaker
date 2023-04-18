import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';

export function NavBar(props) {
  return (
    <>
      <div className="logo">
        <img src='/static/icons/icon128.png' height="23px" width="24px" />
        <Typography
          variant="h6"
          noWrap
          sx={{
            mr: 2,
            fontFamily: 'BlinkMacSystemFont',
            fontWeight: 450,
            letterSpacing: '.2rem'
          }}
        >
          Webaker
        </Typography>
      </div>

      <AppBar position="static">
        <Toolbar>
          {
            props.pages.map((page) => (
              <MenuItem key={page} onClick={() => props.onClick(page)}>
                <Typography variant="h6" component="div">{page}</Typography>
              </MenuItem>
            ))
          }
        </Toolbar>
      </AppBar>
    </>
  );
}
