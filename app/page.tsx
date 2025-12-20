'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from './config';
import './globals.css';


interface DashboardStats {
  total_skus: number;
  total_stock: number;
  total_inventory_value: number;
  low_stock_count: number;
  dead_inventory_count: number;
}

interface LowStockItem {
  id: string;
  name: string;
  sku_code: string;
  current_stock: number;
  min_stock_level: number;
}

interface DeadInventoryItem {
  id: string;
  name: string;
  sku_code: string;
  current_stock: number;
  days_since_sale: number;
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);
  const [deadInventory, setDeadInventory] = useState<DeadInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, lowStockRes, deadRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/dashboard/stats`),
        fetch(`${API_BASE_URL}/api/alerts/low-stock`),
        fetch(`${API_BASE_URL}/api/alerts/dead-inventory`)
      ]);

      const statsData = await statsRes.json();
      const lowStockData = await lowStockRes.json();
      const deadData = await deadRes.json();

      setStats(statsData);
      setLowStock(lowStockData);
      setDeadInventory(deadData.slice(0, 5)); // Show top 5
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container">
          <div className="loading">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container">
        <h1 style={{ marginBottom: '30px', fontSize: '32px', color: '#333' }}>
          Dashboard
        </h1>

        {/* Stats Grid */}
        {stats ? (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total SKUs</h3>
              <div className="value">{stats.total_skus || 0}</div>
              <div className="label">Active products</div>
            </div>
            <div className="stat-card">
              <h3>Total Stock</h3>
              <div className="value">{(stats.total_stock || 0).toLocaleString()}</div>
              <div className="label">Units in inventory</div>
            </div>
            <div className="stat-card">
              <h3>Inventory Value</h3>
              <div className="value">{formatCurrency(stats.total_inventory_value || 0)}</div>
              <div className="label">At cost price</div>
            </div>
            <div className="stat-card">
              <h3>Low Stock Alerts</h3>
              <div className="value" style={{ color: '#dc3545' }}>
                {stats.low_stock_count || 0}
              </div>
              <div className="label">Need reordering</div>
            </div>
            <div className="stat-card">
              <h3>Dead Inventory</h3>
              <div className="value" style={{ color: '#856404' }}>
                {stats.dead_inventory_count || 0}
              </div>
              <div className="label">No sales in 90+ days</div>
            </div>
          </div>
        ) : (
          <div className="card">
            <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              No data available. Add your first SKU to get started!
            </p>
          </div>
        )}

        {/* Alerts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
          {/* Low Stock Alerts */}
          <div className="card">
            <h2>Low Stock Alerts</h2>
            {lowStock.length === 0 ? (
              <p style={{ color: '#666' }}>No low stock items. All good!</p>
            ) : (
              <>
                <table className="table">
                  <thead>
                    <tr>
                      <th>SKU Code</th>
                      <th>Name</th>
                      <th>Current</th>
                      <th>Min Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStock.map((item) => (
                      <tr key={item.id}>
                        <td>{item.sku_code}</td>
                        <td>{item.name}</td>
                        <td>
                          <span className="badge badge-danger">
                            {item.current_stock}
                          </span>
                        </td>
                        <td>{item.min_stock_level}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Link href="/inventory" style={{ marginTop: '15px', display: 'inline-block' }}>
                  <button className="btn btn-primary btn-small">View All Inventory</button>
                </Link>
              </>
            )}
          </div>

          {/* Dead Inventory */}
          <div className="card">
            <h2>Dead Inventory</h2>
            {deadInventory.length === 0 ? (
              <p style={{ color: '#666' }}>No dead inventory items. Great!</p>
            ) : (
              <>
                <table className="table">
                  <thead>
                    <tr>
                      <th>SKU Code</th>
                      <th>Name</th>
                      <th>Stock</th>
                      <th>Days Since Sale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deadInventory.map((item) => (
                      <tr key={item.id}>
                        <td>{item.sku_code}</td>
                        <td>{item.name}</td>
                        <td>{item.current_stock}</td>
                        <td>
                          <span className="badge badge-warning">
                            {Math.round(item.days_since_sale)} days
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Link href="/inventory" style={{ marginTop: '15px', display: 'inline-block' }}>
                  <button className="btn btn-secondary btn-small">Review All</button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ marginTop: '30px' }}>
          <h2>Quick Actions</h2>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <Link href="/inventory">
              <button className="btn btn-primary">View All Inventory</button>
            </Link>
            <Link href="/inventory/new">
              <button className="btn btn-success">Add New SKU</button>
            </Link>
            <Link href="/analytics">
              <button className="btn btn-secondary">View Analytics</button>
            </Link>
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

