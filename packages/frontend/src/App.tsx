import React, { FC, ReactElement } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import {
  QueryClientProvider,
  QueryClient,
} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { customTheme } from './theme/customTheme';
import { Dashboard } from './pages/dashboard/dashboard';

// Create a client
const queryClient = new QueryClient();

const App: FC = (): ReactElement => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <Dashboard />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
