import React, { useState } from 'react';
import { 
  Button, 
  TextField, 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogActions, 
  IconButton, 
  CircularProgress,
  Tabs,
  Tab,
  Box,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Helmet } from "react-helmet";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function LSIKeywordGenerator() {
  const [seedKeyword, setSeedKeyword] = useState('');
  const [lsiKeywords, setLsiKeywords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const generateKeywords = async () => {
    if (!seedKeyword.trim()) {
      setError('Please provide a valid seed keyword.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seedKeyword }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch keyword data.');
      }

      const data = await response.json();
      setLsiKeywords(data.keywords);
      setIsModalOpen(true);
    } catch (err) {
      setError('Failed to generate keywords.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
     <Helmet>
    <title>LSI Keyword Generator</title>
    <meta name="description" content="Generate find Google autocomplete suggestions for effective SEO. 
    Use our LSI keyword generator to boost your content strategy and rankings."/>
    <meta name="robots" content="index, follow" />
    <meta name="googlebot" content="index, follow" />
    <link rel="canonical" href="https://www.pluseup.com/generate-keywords" />
   </Helmet>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Find Great Keywords Using Google Autocomplete</h1>
      <TextField
        label="Seed Keyword"
        variant="outlined"
        fullWidth
        value={seedKeyword}
        onChange={(e) => setSeedKeyword(e.target.value)}
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={generateKeywords}
        disabled={isLoading}
        fullWidth
        startIcon={isLoading ? <CircularProgress size={24} /> : <SearchIcon />}
        style={{ marginTop: '20px' }}
      >
        {isLoading ? 'Generating...' : 'Generate Keywords'}
      </Button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Keywords and Trends for "{seedKeyword}"
          <IconButton
            aria-label="close"
            onClick={() => setIsModalOpen(false)}
            style={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="keyword and trends tabs">
            <Tab label="Keywords" />
            <Tab label="Trends" />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '16px' }}>
              {lsiKeywords.map((item, index) => (
                <Typography key={index} variant="body1" gutterBottom>
                  {item.keyword}
                </Typography>
              ))}
            </div>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '16px' }}>
              {lsiKeywords.map((item, index) => (
                <div key={index} style={{ marginBottom: '32px' }}>
                  <Typography variant="h6" gutterBottom>{item.keyword}</Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={item.trend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          </TabPanel>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} color="primary" startIcon={<CloseIcon />}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}