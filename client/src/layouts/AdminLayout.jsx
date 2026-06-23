import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#111' }}>
      {/* Sidebar Placeholder */}
      <aside className="bg-dark-secondary text-white p-3" style={{ width: '250px', borderRight: '1px solid rgba(201, 162, 39, 0.2)' }}>
        <h4 className="text-gold mb-4">Admin Panel</h4>
        <nav className="nav flex-column">
          <a className="nav-link text-white" href="/admin">Dashboard</a>
          <a className="nav-link text-white" href="/admin/menu">Menu</a>
          <a className="nav-link text-white" href="/admin/orders">Orders</a>
          <a className="nav-link text-white" href="/admin/reviews">Reviews</a>
          <a className="nav-link text-white" href="/admin/feedback">Feedback</a>
          <a className="nav-link text-white mt-4 pt-4 border-top border-secondary" href="/">Back to Site</a>
        </nav>
      </aside>
      
      <main className="flex-grow-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
