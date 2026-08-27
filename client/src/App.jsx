import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import PrivateRoute from './components/PrivateRoute';

// Public Pages
import Home from './pages/Home/Home';
import Menu from './pages/Menu/Menu';
import Reservations from './pages/Reservations';
import Reviews from './pages/Reviews/Reviews';
import Feedback from './pages/Feedback/Feedback';
import Contact from './pages/Contact/Contact';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import OrderTracking from './pages/OrderTracking/OrderTracking';
import NotFound from './pages/NotFound';
import CustomerAuth from './pages/Customer/CustomerAuth';
import Profile from './pages/Customer/Profile';
import MyOrders from './pages/Customer/MyOrders';
import CustomerRoute from './components/CustomerRoute';

import ReviewsAdmin from './pages/Admin/ReviewsAdmin';
import FeedbackAdmin from './pages/Admin/FeedbackAdmin';
import MenuManagement from './components/Admin/MenuManagement';
import Orders from './pages/Admin/Orders';
import Dashboard from './pages/Admin/Dashboard';
import Analytics from './pages/Admin/Analytics';
import Customers from './pages/Admin/Customers';
import Staff from './pages/Admin/Staff';
import Categories from './pages/Admin/Categories';
import Deliveries from './pages/Admin/Deliveries';
import Payments from './pages/Admin/Payments';
import Login from './pages/Admin/Login';
import Setup from './pages/Admin/Setup';
import Settings from './pages/Admin/Settings';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Website */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="contact" element={<Contact />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="track/:orderId" element={<OrderTracking />} />
          <Route path="login" element={<CustomerAuth />} />
          <Route path="profile" element={<CustomerRoute><Profile /></CustomerRoute>} />
          <Route path="orders" element={<CustomerRoute><MyOrders /></CustomerRoute>} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/login" element={<CustomerAuth />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/setup" element={<Setup />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="customers" element={<Customers />} />
          <Route path="staff" element={<Staff />} />
          <Route path="deliveries" element={<Deliveries />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reviews" element={<ReviewsAdmin />} />
          <Route path="feedback" element={<FeedbackAdmin />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
