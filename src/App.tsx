import React from 'react';
import './App.css';
import { Box, Container } from '@mui/material';
import { SnackbarProvider } from 'notistack';

import { 
  ChannelAgentForm
} from './components/channel-agent-form/ChannelAgentForm';

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Container sx={{ padding: '0 0 16px 0' }}>
        <Box>
          <ChannelAgentForm />
        </Box>
      </Container>
    </SnackbarProvider>
  );
}

export default App;
