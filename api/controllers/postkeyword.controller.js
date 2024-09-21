import axios from 'axios';
import natural from 'natural';
import googleTrends from 'google-trends-api';

// Function to fetch keyword suggestions from Google (using Google Autocomplete)
const fetchGoogleSuggestions = async (keyword) => {
  try {
    const response = await axios.get(
      `http://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(keyword)}`
    );
    const suggestions = response.data[1];
    return suggestions;
  } catch (error) {
    console.error('Error fetching Google suggestions:', error.message);
    return [];
  }
};

// Function to fetch related terms using NLP
const generateNlpKeywords = (keyword) => {
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(keyword);

  const variations = [];
  tokens.forEach((token, index) => {
    const prefix = tokens.slice(0, index).join(' ');
    const suffix = tokens.slice(index + 1).join(' ');
    if (prefix) variations.push(prefix);
    if (suffix) variations.push(suffix);
    variations.push(`${prefix} ${suffix}`.trim());
  });

  // Add simple synonyms and related terms using WordNet
  const wordnet = new natural.WordNet();
  const synonyms = [];

  tokens.forEach((token) => {
    wordnet.lookup(token, (results) => {
      results.forEach((result) => {
        result.synonyms.forEach((synonym) => {
          if (!tokens.includes(synonym)) {
            synonyms.push(synonym);
          }
        });
      });
    });
  });

  return Array.from(new Set([...variations, ...synonyms]));
};

// Function to fetch trend data from Google Trends API
const fetchTrendsData = async (keywords) => {
  const trendsDataPromises = keywords.map(async (keyword) => {
    try {
      const trendsData = await googleTrends.interestOverTime({
        keyword,
        startTime: new Date('2022-01-01'),
        endTime: new Date(),
        geo: 'US',
      });
      const parsedData = JSON.parse(trendsData);
      const trendPoints = parsedData.default.timelineData.map((data) => ({
        date: data.formattedTime,
        value: data.value[0],
      }));

      return { keyword, trend: trendPoints };
    } catch (error) {
      console.error(`Error fetching trends for ${keyword}:`, error.message);
      return { keyword, trend: [] }; // Return an empty trend array if there's an error
    }
  });

  return Promise.all(trendsDataPromises);
};

// Controller function to generate keywords
export const generateKeywords = async (req, res) => {
  try {
    const { seedKeyword } = req.body;
    if (!seedKeyword) {
      return res.status(400).json({ message: 'Seed keyword is required.' });
    }

    const googleSuggestions = await fetchGoogleSuggestions(seedKeyword);
    const nlpKeywords = generateNlpKeywords(seedKeyword);
    const allKeywords = Array.from(new Set([...googleSuggestions, ...nlpKeywords]));

    // Fetch trend data for each keyword
    const trendData = await fetchTrendsData(allKeywords);

    res.status(200).json({
      keywords: trendData, // Send keywords along with their trend data
    });
  } catch (error) {
    console.error('Error generating keywords:', error.message);
    res.status(500).json({ message: 'Error generating keywords.', error: error.message });
  }
};


