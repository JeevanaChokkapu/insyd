'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { showToast } from '../../../components/Toast';
import { API_BASE_URL } from '../../../config';


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

export default function EditSKUPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<SKU | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchSKU(params.id as string);
    }
  }, [params.id]);

  const fetchSKU = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/skus/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      } else {
        showToast('SKU not found', 'error');
        router.push('/inventory');
      }
    } catch (error) {
      console.error('Error fetching SKU:', error);
      showToast('Error loading SKU', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'current_stock' || name === 'min_stock_level' || name === 'max_stock_level' || name === 'unit_price' || name === 'cost_price'
        ? parseFloat(value) || 0
        : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/skus/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast('SKU updated successfully', 'success');
        setTimeout(() => {
          router.push(`/inventory/${formData.id}`);
        }, 1000);
      } else {
        const error = await response.json();
        showToast(error.error || 'Error updating SKU', 'error');
      }
    } catch (error) {
      console.error('Error updating SKU:', error);
      showToast('Error updating SKU', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) {
    return (
      <div>
        <Header />
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container">
        <div style={{ marginBottom: '20px' }}>
          <Link href={`/inventory/${formData.id}`} style={{ color: '#667eea', textDecoration: 'underline' }}>
             Back to SKU Details
          </Link>
        </div>

        <h1 style={{ marginBottom: '30px', fontSize: '32px', color: '#333' }}>
          Edit SKU
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
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category || ''}
                  onChange={handleChange}
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
                  value={formData.supplier || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link href={`/inventory/${formData.id}`}>
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

