import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from './config/wagmi';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Challenge } from './pages/Challenge';
import { Passport } from './pages/Passport';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="flex flex-col min-h-screen bg-background text-text selection:bg-primary/30">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/challenge" element={<Challenge />} />
                <Route path="/passport/:address" element={<Passport />} />
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
