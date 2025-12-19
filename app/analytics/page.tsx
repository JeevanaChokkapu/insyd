'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import '../globals.css';
const API_BASE_URL = "https://insyd-backend-oydv.onrender.com";


interface TopSeller {
  id: string;
  name: string;
  sku_code: string;
  total_sold: number;
  current_stock: number;
  revenue: number;
}

export default function AnalyticsPage() {
  const [topSellers, setTopSellers] = useState<TopSeller[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopSellers();
  }, []);

  const fetchTopSellers = async () => {
    try {
      const response = await fetch('${API_BASE_URL}/api/analytics/top-sellers?limit=20');
      const data = await response.json();
      setTopSellers(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div>
      <Header />
      <div className="container">
        <h1 style={{ marginBottom: '30px', fontSize: '32px', color: '#333' }}>
          Analytics & Performance
        </h1>

        <div className="card">
          <h2>Top Selling SKUs</h2>
          {loading ? (
            <div className="loading">Loading analytics...</div>
          ) : topSellers.length === 0 ? (
            <p style={{ color: '#666', padding: '20px', textAlign: 'center' }}>
              No sales data available yet. Start recording sales to see analytics.
            </p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>SKU Code</th>
                  <th>Product Name</th>
                  <th>Total Sold</th>
                  <th>Current Stock</th>
                  <th>Revenue</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {topSellers.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      <span className="badge badge-info" style={{ fontSize: '14px', padding: '6px 10px' }}>
                        #{index + 1}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace' }}>{item.sku_code}</td>
                    <td>{item.name}</td>
                    <td>
                      <strong>{item.total_sold}</strong>
                    </td>
                    <td>{item.current_stock}</td>
                    <td>
                      <strong style={{ color: '#28a745' }}>
                        {formatCurrency(item.revenue)}
                      </strong>
                    </td>
                    <td>
                      <Link href={`/inventory/${item.id}`}>
                        <button className="btn btn-secondary btn-small">View</button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card" style={{ marginTop: '30px' }}>
          <h2>Performance Insights</h2>
          <div style={{ padding: '20px' }}>
            <p style={{ color: '#666', marginBottom: '15px' }}>
              <strong>What this data tells you:</strong>
            </p>
            <ul style={{ color: '#666', lineHeight: '1.8', paddingLeft: '20px' }}>
              <li>Top sellers help identify your best-performing products</li>
              <li>Focus inventory investment on high-demand SKUs</li>
              <li>Consider discontinuing products with zero or low sales</li>
              <li>Use revenue data to optimize pricing strategies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="header">
      <div className="container">
        <h1>Insyd Inventory Management</h1>
        <nav className="nav">
          <Link href="/">Dashboard</Link>
          <Link href="/inventory">Inventory</Link>
          <Link href="/analytics">Analytics</Link>
          <Link href="/transactions">Transactions</Link>
        </nav>
      </div>
    </div>
  );
}

