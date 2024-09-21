import React, { useState } from 'react';
import { TextField, Button, Typography, Paper } from '@mui/material';

function TipCalculator() {
  const [price, setPrice] = useState('');
  const [percentage, setPercentage] = useState(15);
  const [people, setPeople] = useState('');
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (price && percentage && people) {
      const tip = (price * (percentage / 100)).toFixed(2);
      const totalAmount = (parseFloat(price) + parseFloat(tip)).toFixed(2);
      const tipPerPerson = (tip / people).toFixed(2);
      const totalPerPerson = (totalAmount / people).toFixed(2);

      setResult({
        tip,
        totalAmount,
        tipPerPerson,
        totalPerPerson,
      });
    }
  };

  const handleClear = () => {
    setPrice('');
    setPercentage('');
    setPeople('');
    setResult(null);
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px', margin: '20px auto' }}>
      <Typography variant="h5" gutterBottom align="center">
        Tip Calculator
      </Typography>
      
      <TextField
        label="Price ($)"
        type="number"
        fullWidth
        variant="outlined"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={{ marginBottom: '15px' }}
      />

      <TextField
        label="Tip Percentage (%)"
        type="number"
        fullWidth
        variant="outlined"
        value={percentage}
        onChange={(e) => setPercentage(e.target.value)}
        style={{ marginBottom: '15px' }}
      />

      <TextField
        label="Number of People"
        type="number"
        fullWidth
        variant="outlined"
        value={people}
        onChange={(e) => setPeople(e.target.value)}
        style={{ marginBottom: '15px' }}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleCalculate}
        style={{ marginBottom: '10px' }}
      >
        Calculate
      </Button>

      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        onClick={handleClear}
      >
        Clear
      </Button>

      {result && (
        <Paper elevation={2} style={{ marginTop: '20px', padding: '15px' }}>
          <Typography variant="h6">Tip: ${result.tip}</Typography>
          <Typography variant="h6">Total Amount: ${result.totalAmount}</Typography>
          <Typography variant="h6">Tip Per Person: ${result.tipPerPerson}</Typography>
          <Typography variant="h6">Total Share Per Person: ${result.totalPerPerson}</Typography>
        </Paper>
      )}
    </Paper>
  );
}

export default TipCalculator;
