'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { showToast } from '../../components/Toast';
import { API_BASE_URL } from '../../config';
import '../../globals.css';

export default function NewSKUPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku_code: '',
    category: '',
    unit: 'pcs',
    current_stock: 0,
    min_stock_level: 10,
    max_stock_level: 100,
    unit_price: 0,
    cost_price: 0,
    supplier: '',
    location: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'current_stock' || name === 'min_stock_level' || name === 'max_stock_level' || name === 'unit_price' || name === 'cost_price'
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/skus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast('SKU created successfully!', 'success');
        setTimeout(() => {
          router.push('/inventory');
        }, 1000);
      } else {
        const error = await response.json();
        showToast(error.error || 'Error creating SKU', 'error');
      }
    } catch (error) {
      console.error('Error creating SKU:', error);
      showToast('Error creating SKU. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="container">
        <h1 style={{ marginBottom: '30px', fontSize: '32px', color: '#333' }}>
          Add New SKU
        </h1>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>SKU Code *</label>
                <input
                  type="text"
                  name="sku_code"
                  value={formData.sku_code}
                  onChange={handleChange}
                  required
                  placeholder="e.g., MAT-001"
                />
              </div>
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Premium Cement"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Building Materials"
                />
              </div>
              <div className="form-group">
                <label>Unit</label>
                <select name="unit" value={formData.unit} onChange={handleChange}>
                  <option value="pcs">Pieces</option>
                  <option value="kg">Kilograms</option>
                  <option value="m">Meters</option>
                  <option value="sqm">Square Meters</option>
                  <option value="cbm">Cubic Meters</option>
                  <option value="box">Box</option>
                  <option value="pack">Pack</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Current Stock</label>
                <input
                  type="number"
                  name="current_stock"
                  value={formData.current_stock}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Min Stock Level</label>
                <input
                  type="number"
                  name="min_stock_level"
                  value={formData.min_stock_level}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Max Stock Level</label>
                <input
                  type="number"
                  name="max_stock_level"
                  value={formData.max_stock_level}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Unit Price (₹)</label>
                <input
                  type="number"
                  name="unit_price"
                  value={formData.unit_price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Cost Price (₹)</label>
                <input
                  type="number"
                  name="cost_price"
                  value={formData.cost_price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Supplier</label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  placeholder="Supplier name"
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Warehouse location"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Additional notes or description"
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create SKU'}
              </button>
              <Link href="/inventory">
                <button type="button" className="btn btn-secondary">
                  Cancel
                </button>
              </Link>
            </div>
          </form>
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

