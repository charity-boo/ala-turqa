import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import PrivateRoute from './components/PrivateRoute';

// Public Pages
import Home from './pages/Home/Home';
import Menu from './pages/Menu/Menu';
import Reservations from './pages/Reservations';
import Gallery from './pages/Gallery/Gallery';
import Reviews from './pages/Reviews/Reviews';
import Feedback from './pages/Feedback/Feedback';
import Contact from './pages/Contact/Contact';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import OrderSuccess from './pages/OrderSuccess/OrderSuccess';
import NotFound from './pages/NotFound';
import ReviewsAdmin from './pages/Admin/ReviewsAdmin';
import FeedbackAdmin from './pages/Admin/FeedbackAdmin';
import MenuManagement from './components/Admin/MenuManagement';
import Orders from './pages/Admin/Orders';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Website */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="contact" element={<Contact />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success" element={<OrderSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Dashboard */}
        <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
          <Route path="menu" element={<MenuManagement />} />
          <Route path="orders" element={<Orders />} />
          <Route path="reviews" element={<ReviewsAdmin />} />
          <Route path="feedback" element={<FeedbackAdmin />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
