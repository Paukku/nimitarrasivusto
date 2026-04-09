import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EditorPage } from './pages/EditorPage/EditorPage';
import { CartPage } from './pages/CartPage/CartPage';
import { CheckoutPage } from './pages/CheckoutPage/CheckoutPage';
import { ConfirmationPage } from './pages/ConfirmationPage/ConfirmationPage';
import './App.css'

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EditorPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/confirmation/:orderId" element={<ConfirmationPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App
