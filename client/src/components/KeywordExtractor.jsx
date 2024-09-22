import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  CircularProgress
} from '@mui/material';
import ExtractIcon from '@mui/icons-material/Extension';
import { removeStopwords } from 'stopword';
import { Helmet } from "react-helmet";

const customStopWords = ['not', 'when', , 'two' ,'but', 'they', 'you' , 'your' ,'and' ,'can' ,'the' , 'more' , 'with' , 'for' , 'that', 'this' ,'which' , 'their' , 'how',
    'help' , 'between' , 'post' , 'blog' , 'are' , 'into' , 'often' ,'will' , 'use' , 'out' , 'also' , 'user' , 'have' ,
    'them' , 'people' , 'like' , 'both' , 'some' , 'may' , 'its'
]; // Add your custom stopwords here

function KeywordExtractor() {
  const [inputText, setInputText] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const extractKeywords = () => {
    if (!inputText.trim()) {
      setError('Please enter some text to extract keywords from.');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      try {
        const words = inputText.toLowerCase().match(/\b\w+\b/g) || [];
        
        // Combine default stopwords with custom stopwords
        const filteredWords = removeStopwords(words, customStopWords);

        const wordFrequency = {};
        filteredWords.forEach(word => {
          if (word.length > 2) { // Ensuring words longer than 2 characters
            wordFrequency[word] = (wordFrequency[word] || 0) + 1;
          }
        });

        const sortedKeywords = Object.entries(wordFrequency)
          .sort((a, b) => b[1] - a[1])
          .map(([word, frequency]) => ({ word, frequency }));

        setKeywords(sortedKeywords);
        setIsLoading(false);
      } catch (err) {
        setError('An error occurred while extracting keywords.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '600px', margin: '20px auto' }}>
       <Helmet>
    <title>Extract Keywords from Text Instantly</title>
    <meta name="description" content="Use our keyword extractor tool to quickly extract 
    keywords from any text. Enhance your SEO strategy by identifying important keywords for content optimization"/>
    <meta name="robots" content="index, follow" />
    <meta name="googlebot" content="index, follow" />
    <link rel="canonical" href="https://www.pluseup.com/keyword-extractor" />
   </Helmet>
      <Typography variant="h5" gutterBottom>
        Frequency and Keyword Extractor
      </Typography>
      <TextField
        label="Enter your text here"
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={extractKeywords}
        disabled={isLoading}
        startIcon={isLoading ? <CircularProgress size={24} /> : <ExtractIcon />}
        style={{ marginTop: '10px' }}
      >
        {isLoading ? 'Extracting...' : 'Extract Keywords'}
      </Button>
      {error && (
        <Typography color="error" style={{ marginTop: '10px' }}>
          {error}
        </Typography>
      )}
      {keywords.length > 0 && (
        <TableContainer component={Paper} style={{ marginTop: '20px' ,maxHeight : '300px' , overflowY: 'auto'}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Keyword</strong></TableCell>
                <TableCell><strong>Frequency</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {keywords.map((keyword, index) => (
                <TableRow key={index}>
                  <TableCell>{keyword.word}</TableCell>
                  <TableCell>{keyword.frequency}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}

export default KeywordExtractor;
