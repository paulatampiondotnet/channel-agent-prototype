import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Box, Container } from '@mui/material';
import { ChannelAgentForm } from './ChannelAgentForm';

function App() {
  return (
    <Container sx={{ padding: '0 0 16px 0' }}>
      <Box>
        <ChannelAgentForm />
      </Box>
    </Container>
  );
}

export default App;
