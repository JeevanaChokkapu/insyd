'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import '../globals.css';
const API_BASE_URL = "https://insyd-backend-oydv.onrender.com";

interface SKU {
  id: string;
  name: string;
  sku_code: string;
  category: string;
  unit: string;
  current_stock: number;
  min_stock_level: number;
  max_stock_level: number;
  unit_price: number;
  cost_price: number;
  supplier: string;
  location: string;
  description: string;
}

export default function InventoryPage() {
  const [skus, setSkus] = useState<SKU[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSKUs();
  }, []);

  const fetchSKUs = async () => {
    try {
      const response = await fetch('${API_BASE_URL}/api/skus');
      const data = await response.json();
      setSkus(data);
    } catch (error) {
      console.error('Error fetching SKUs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this SKU?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/skus/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchSKUs();
      } else {
        alert('Error deleting SKU');
      }
    } catch (error) {
      console.error('Error deleting SKU:', error);
      alert('Error deleting SKU');
    }
  };

  const filteredSKUs = skus.filter(
    (sku) =>
      sku.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sku.sku_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (current: number, min: number) => {
    if (current === 0) return { label: 'Out of Stock', class: 'badge-danger' };
    if (current <= min) return { label: 'Low Stock', class: 'badge-warning' };
    return { label: 'In Stock', class: 'badge-success' };
  };

  return (
    <div>
      <Header />
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', color: '#333' }}>Inventory</h1>
          <Link href="/inventory/new">
            <button className="btn btn-primary">Add New SKU</button>
          </Link>
        </div>

        <div className="card">
          <input
            type="text"
            placeholder="Search by name or SKU code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
        </div>

        {loading ? (
          <div className="loading">Loading inventory...</div>
        ) : filteredSKUs.length === 0 ? (
          <div className="card">
            <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              {searchTerm ? 'No SKUs found matching your search.' : 'No SKUs found. Add your first SKU to get started!'}
            </p>
          </div>
        ) : (
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>SKU Code</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Min Level</th>
                  <th>Unit Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSKUs.map((sku) => {
                  const status = getStockStatus(sku.current_stock, sku.min_stock_level);
                  return (
                    <tr key={sku.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: '600' }}>
                        {sku.sku_code}
                      </td>
                      <td>{sku.name}</td>
                      <td>{sku.category || '-'}</td>
                      <td>{sku.current_stock} {sku.unit}</td>
                      <td>{sku.min_stock_level}</td>
                      <td>₹{sku.unit_price.toFixed(2)}</td>
                      <td>
                        <span className={`badge ${status.class}`}>
                          {status.label}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Link href={`/inventory/${sku.id}`}>
                            <button className="btn btn-secondary btn-small">View</button>
                          </Link>
                          <Link href={`/inventory/${sku.id}/edit`}>
                            <button className="btn btn-primary btn-small">Edit</button>
                          </Link>
                          <button
                            className="btn btn-danger btn-small"
                            onClick={() => handleDelete(sku.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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

