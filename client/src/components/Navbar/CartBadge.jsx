import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const CartBadge = ({ count }) => {
  return (
    <Link to="/cart" className="nav-icon-btn mx-2 text-decoration-none">
      <FaShoppingCart />
      {count > 0 && (
        <span 
          className="position-absolute translate-middle badge rounded-pill bg-danger"
          style={{ top: '5px', right: '-15px', fontSize: '0.65rem' }}
        >
          {count}
        </span>
      )}
    </Link>
  );
};

export default CartBadge;
