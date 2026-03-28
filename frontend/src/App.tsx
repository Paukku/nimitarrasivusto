import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'

// Placeholder-sivut (tulevat EPIC 5:ssä)
function EditorPage() {
  return <div><h1>Muokkausnäkymä (EditorPage)</h1></div>;
}

function CartPage() {
  return <div><h1>OstoskorI (CartPage)</h1></div>;
}

function CheckoutPage() {
  return <div><h1>Checkout (CheckoutPage)</h1></div>;
}

function ConfirmationPage() {
  return <div><h1>Vahvistus (ConfirmationPage)</h1></div>;
}

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
