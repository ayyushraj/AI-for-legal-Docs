import React from 'react';
import { ChakraProvider, CSSReset, Box, Button, Link as ChakraLink, VStack } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// import './App.css';

// import LegalTemplates from './pages/LegalTemplates';
import OcrSummarizer from './pages/ocrComponent';
// import LegalChatbot from './pages/LegalChatbot';

const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <CSSReset />
        <Box className="App" minH="100vh" display="flex" justifyContent="center" alignItems="center">
          <VStack spacing={4}>
            <Link to="/legal-templates">
              <ChakraLink>
                <Button colorScheme="blue" size="lg">
                  Legal Templates
                </Button>
              </ChakraLink>
            </Link>
            <Link to="/ocr-summarizer">
              <ChakraLink>
                <Button colorScheme="blue" size="lg">
                  OCR Summarizer
                </Button>
              </ChakraLink>
            </Link>
            <Link to="/legal-chatbot">
              <ChakraLink>
                <Button colorScheme="blue" size="lg">
                  Legal Chatbot
                </Button>
              </ChakraLink>
            </Link>
          </VStack>
          <Routes>
            <Route path="/ocr-summarizer" element={<OcrSummarizer/>} />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
};

export default App;