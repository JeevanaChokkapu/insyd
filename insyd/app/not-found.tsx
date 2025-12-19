import Link from 'next/link';
import './globals.css';

export default function NotFound() {
  return (
    <div>
      <div className="header">
        <div className="container">
          <h1>Insyd Inventory Management</h1>
        </div>
      </div>
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>404</h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
            Page not found
          </p>
          <Link href="/">
            <button className="btn btn-primary">Go to Dashboard</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

