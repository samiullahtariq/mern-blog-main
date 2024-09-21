import React from 'react';
import {ListItem, ListItemIcon, ListItemText, Paper, Typography, Grid } from '@mui/material';
import TipIcon from '@mui/icons-material/AttachMoney'; 
import KeywordIcon from '@mui/icons-material/Extension';
import { Link } from 'react-router-dom';

function Tools() {
  const tools = [
    {
      name: 'Tip Calculator',
      icon: <TipIcon />,
      path: '/tip-calculator',
    },
    {
      name: 'Keyword Extractor',
      icon: <KeywordIcon />,
      path: '/keyword-extractor',
    },
    {
      name: 'LSI Keyword Generator', 
      icon: <KeywordIcon/>,
      path: '/generate-keywords',
    },
  ];

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '800px', margin: '20px auto'}}>
      <Typography variant="h5" gutterBottom align="center">
        Tools
      </Typography>
      <Grid container spacing={2}>
        {tools.map((tool, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <ListItem
              component={Link}
              to={tool.path}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <ListItemIcon style={{ fontSize: '40px', margin: '0 auto' }}>
                {tool.icon}
              </ListItemIcon>
              <ListItemText primary={tool.name} style={{ marginTop: '10px' }} />
            </ListItem>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

export default Tools;
