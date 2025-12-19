'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import '../globals.css';

interface Transaction {
  id: string;
  sku_id: string;
  sku_name: string;
  sku_code: string;
  type: string;
  quantity: number;
  notes: string;
  created_at: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions?limit=100');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: { label: string; class: string } } = {
      add: { label: 'Stock Added', class: 'badge-success' },
      remove: { label: 'Stock Removed', class: 'badge-warning' },
      sale: { label: 'Sale', class: 'badge-info' },
    };
    return labels[type] || { label: type, class: 'badge-secondary' };
  };

  return (
    <div>
      <Header />
      <div className="container">
        <h1 style={{ marginBottom: '30px', fontSize: '32px', color: '#333' }}>
          Transaction History
        </h1>

        <div className="card">
          {loading ? (
            <div className="loading">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <p style={{ color: '#666', padding: '40px', textAlign: 'center' }}>
              No transactions found. Transactions will appear here when you add stock, record sales, or make adjustments.
            </p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>SKU Code</th>
                  <th>Product Name</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => {
                  const typeInfo = getTypeLabel(transaction.type);
                  return (
                    <tr key={transaction.id}>
                      <td>{formatDate(transaction.created_at)}</td>
                      <td style={{ fontFamily: 'monospace' }}>{transaction.sku_code}</td>
                      <td>{transaction.sku_name}</td>
                      <td>
                        <span className={`badge ${typeInfo.class}`}>
                          {typeInfo.label}
                        </span>
                      </td>
                      <td>
                        <strong>{transaction.quantity}</strong>
                      </td>
                      <td style={{ color: '#666', fontSize: '13px' }}>
                        {transaction.notes || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
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

