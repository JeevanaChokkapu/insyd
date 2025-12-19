'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

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

export default function SKUDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [sku, setSku] = useState<SKU | null>(null);
  const [loading, setLoading] = useState(true);
  const [adjustQuantity, setAdjustQuantity] = useState('');
  const [adjustType, setAdjustType] = useState<'add' | 'remove'>('add');
  const [adjustNotes, setAdjustNotes] = useState('');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellQuantity, setSellQuantity] = useState('');
  const [sellNotes, setSellNotes] = useState('');
  const [showDamageModal, setShowDamageModal] = useState(false);
  const [damageQuantity, setDamageQuantity] = useState('');
  const [damageReason, setDamageReason] = useState('');
  const [damageNotes, setDamageNotes] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchSKU(params.id as string);
    }
  }, [params.id]);

  const fetchSKU = async (id: string) => {
    try {
      const response = await fetch(`/api/skus/${id}`);
      if (response.ok) {
        const data = await response.json();
        setSku(data);
      } else {
        alert('SKU not found');
        router.push('/inventory');
      }
    } catch (error) {
      console.error('Error fetching SKU:', error);
      alert('Error loading SKU');
    } finally {
      setLoading(false);
    }
  };

  const handleStockAdjust = async () => {
    const qty = parseInt(adjustQuantity);
    if (!qty || qty <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    try {
      const response = await fetch(`/api/skus/${params.id}/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity: qty,
          type: adjustType,
          notes: adjustNotes,
        }),
      });

      if (response.ok) {
        fetchSKU(params.id as string);
        setShowAdjustModal(false);
        setAdjustQuantity('');
        setAdjustNotes('');
      } else {
        alert('Error adjusting stock');
      }
    } catch (error) {
      console.error('Error adjusting stock:', error);
      alert('Error adjusting stock');
    }
  };

  const handleSell = async () => {
    const qty = parseInt(sellQuantity);
    if (!qty || qty <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    if (sku && qty > sku.current_stock) {
      alert('Insufficient stock');
      return;
    }

    try {
      const response = await fetch(`/api/skus/${params.id}/sell`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity: qty,
          notes: sellNotes,
        }),
      });

      if (response.ok) {
        fetchSKU(params.id as string);
        setShowSellModal(false);
        setSellQuantity('');
        setSellNotes('');
      } else {
        const error = await response.json();
        alert(error.error || 'Error recording sale');
      }
    } catch (error) {
      console.error('Error recording sale:', error);
      alert('Error recording sale');
    }
  };

  const handleDamage = async () => {
    const qty = parseInt(damageQuantity);
    if (!qty || qty <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    if (!damageReason.trim()) {
      alert('Please enter a reason');
      return;
    }

    if (sku && qty > sku.current_stock) {
      alert('Insufficient stock');
      return;
    }

    try {
      const response = await fetch(`/api/skus/${params.id}/damage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity: qty,
          reason: damageReason,
          notes: damageNotes,
        }),
      });

      if (response.ok) {
        fetchSKU(params.id as string);
        setShowDamageModal(false);
        setDamageQuantity('');
        setDamageReason('');
        setDamageNotes('');
      } else {
        const error = await response.json();
        alert(error.error || 'Error recording damage');
      }
    } catch (error) {
      console.error('Error recording damage:', error);
      alert('Error recording damage');
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (!sku) {
    return null;
  }

  const stockStatus = sku.current_stock === 0
    ? { label: 'Out of Stock', class: 'badge-danger' }
    : sku.current_stock <= sku.min_stock_level
    ? { label: 'Low Stock', class: 'badge-warning' }
    : { label: 'In Stock', class: 'badge-success' };

  return (
    <div>
      <Header />
      <div className="container">
        <div style={{ marginBottom: '20px' }}>
          <Link href="/inventory" style={{ color: '#667eea', textDecoration: 'underline' }}>
            ← Back to Inventory
          </Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', color: '#333' }}>{sku.name}</h1>
          <Link href={`/inventory/${sku.id}/edit`}>
            <button className="btn btn-primary">Edit SKU</button>
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          <div className="card">
            <h2>Product Details</h2>
            <table className="table">
              <tbody>
                <tr>
                  <td style={{ fontWeight: '600', width: '200px' }}>SKU Code</td>
                  <td style={{ fontFamily: 'monospace' }}>{sku.sku_code}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '600' }}>Category</td>
                  <td>{sku.category || '-'}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '600' }}>Unit</td>
                  <td>{sku.unit}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '600' }}>Current Stock</td>
                  <td>
                    <span className={`badge ${stockStatus.class}`} style={{ fontSize: '14px', padding: '6px 12px' }}>
                      {sku.current_stock} {sku.unit}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '600' }}>Min Stock Level</td>
                  <td>{sku.min_stock_level} {sku.unit}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '600' }}>Max Stock Level</td>
                  <td>{sku.max_stock_level} {sku.unit}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '600' }}>Unit Price</td>
                  <td>₹{sku.unit_price.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '600' }}>Cost Price</td>
                  <td>₹{sku.cost_price.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '600' }}>Supplier</td>
                  <td>{sku.supplier || '-'}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '600' }}>Location</td>
                  <td>{sku.location || '-'}</td>
                </tr>
                {sku.description && (
                  <tr>
                    <td style={{ fontWeight: '600' }}>Description</td>
                    <td>{sku.description}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div>
            <div className="card">
              <h2>Quick Actions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  className="btn btn-success"
                  onClick={() => setShowSellModal(true)}
                  disabled={sku.current_stock === 0}
                >
                  Record Sale
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowAdjustModal(true)}
                >
                  Adjust Stock
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => setShowDamageModal(true)}
                  disabled={sku.current_stock === 0}
                >
                  Record Damage/Loss
                </button>
              </div>
            </div>

            {sku.current_stock <= sku.min_stock_level && (
              <div className="alert alert-warning" style={{ marginTop: '20px' }}>
                ⚠️ Low stock alert! Current stock is below minimum level.
              </div>
            )}
          </div>
        </div>

        {/* Adjust Stock Modal */}
        {showAdjustModal && (
          <div className="modal" onClick={() => setShowAdjustModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Adjust Stock</h2>
                <button className="close-btn" onClick={() => setShowAdjustModal(false)}>×</button>
              </div>
              <div className="form-group">
                <label>Type</label>
                <select value={adjustType} onChange={(e) => setAdjustType(e.target.value as 'add' | 'remove')}>
                  <option value="add">Add Stock</option>
                  <option value="remove">Remove Stock</option>
                </select>
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(e.target.value)}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  placeholder="Optional notes"
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button className="btn btn-primary" onClick={handleStockAdjust}>Confirm</button>
                <button className="btn btn-secondary" onClick={() => setShowAdjustModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Sell Modal */}
        {showSellModal && (
          <div className="modal" onClick={() => setShowSellModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Record Sale</h2>
                <button className="close-btn" onClick={() => setShowSellModal(false)}>×</button>
              </div>
              <div className="form-group">
                <label>Quantity (Available: {sku.current_stock} {sku.unit})</label>
                <input
                  type="number"
                  value={sellQuantity}
                  onChange={(e) => setSellQuantity(e.target.value)}
                  min="1"
                  max={sku.current_stock}
                  required
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={sellNotes}
                  onChange={(e) => setSellNotes(e.target.value)}
                  placeholder="Optional notes"
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button className="btn btn-success" onClick={handleSell}>Record Sale</button>
                <button className="btn btn-secondary" onClick={() => setShowSellModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Damage Modal */}
        {showDamageModal && (
          <div className="modal" onClick={() => setShowDamageModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Record Damage/Loss</h2>
                <button className="close-btn" onClick={() => setShowDamageModal(false)}>×</button>
              </div>
              <div className="form-group">
                <label>Quantity (Available: {sku.current_stock} {sku.unit})</label>
                <input
                  type="number"
                  value={damageQuantity}
                  onChange={(e) => setDamageQuantity(e.target.value)}
                  min="1"
                  max={sku.current_stock}
                  required
                />
              </div>
              <div className="form-group">
                <label>Reason *</label>
                <select
                  value={damageReason}
                  onChange={(e) => setDamageReason(e.target.value)}
                  required
                >
                  <option value="">Select reason</option>
                  <option value="damaged">Damaged</option>
                  <option value="expired">Expired</option>
                  <option value="theft">Theft</option>
                  <option value="lost">Lost</option>
                  <option value="defective">Defective</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={damageNotes}
                  onChange={(e) => setDamageNotes(e.target.value)}
                  placeholder="Additional details"
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button className="btn btn-danger" onClick={handleDamage}>Record</button>
                <button className="btn btn-secondary" onClick={() => setShowDamageModal(false)}>Cancel</button>
              </div>
            </div>
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

