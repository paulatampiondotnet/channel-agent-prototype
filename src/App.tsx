import React from 'react';
import './App.css';
import './jost.css';
import { Box, Container, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';

import { 
  ChannelAgentForm
} from './components/channel-agent-form/ChannelAgentForm';
import { getTheme } from './utils/theme';

function App() {
  const theme = getTheme();
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <Container sx={{ padding: '0 0 16px 0' }}>
          <Box>
            <ChannelAgentForm />
          </Box>
        </Container>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
