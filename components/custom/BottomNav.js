import { Home, ShoppingBag, User, Menu, ShoppingCart } from "lucide-react";
// import { Link, useLocation } from "react-router-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import "./css/BottomNav.css";

export default function BottomNav() {
  //   const location = useLocation();
  const pathname = usePathname();

  // Check if the path matches the current location
  const isActive = (path) => pathname === path;

  return (
    <nav className="nav-head">
      <div className="navhead-2">
        {/* Home */}
        <Link
          //   to="/"
          href="/"
          className={`navbtn ${
            isActive("/") ? "b-nav-active" : "b-nav-inactive"
          }`}
        >
          <Home size={24} />
          <span className="btn-text">Home</span>
        </Link>

        {/* Menu */}
        <Link
          //   to="/menu"
          href="/menu-pizza"
          className={`navbtn ${
            isActive("/menu-pizza") ? "b-nav-active" : "b-nav-inactive"
          }`}
        >
          <Menu size={24} />
          <span className="btn-text">Menu</span>
        </Link>

        <Link
          href="/cart"
          className={`navbtn ${
            isActive("/cart") ? "b-nav-active" : "b-nav-inactive"
          }`}
        >
          <ShoppingCart size={24} />
          <span className="btn-text">Cart</span>
        </Link>

        {/* Orders */}
        {/* <Link
          href="/orders"
          className={`navbtn ${
            isActive("/orders") ? "b-nav-active" : "b-nav-inactive"
          }`}
        >
          <ShoppingBag size={24} />
          <span className="btn-text">Orders</span>
        </Link> */}

        {/* Account */}
        {/* <Link
          to="/account"
          className={`navbtn ${
            isActive("/account") ? "text-yellow-400" : "text-gray-400"
          }`}
        >
          <User size={24} />
          <span className="text-xs mt-1">Account</span>
        </Link> */}

        <Link
          href="/login"
          className={`navbtn ${
            isActive("/user") ? "b-nav-active" : "b-nav-inactive"
          }`}
        >
          <User size={24} />
          <span className="btn-text">Account</span>
        </Link>
      </div>
    </nav>
  );
}
