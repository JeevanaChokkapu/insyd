const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;





// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://insyd1.vercel.app"
  ]
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database
const dbPath = path.join(__dirname, 'inventory.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // SKUs table
    db.run(`CREATE TABLE IF NOT EXISTS skus (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      sku_code TEXT UNIQUE NOT NULL,
      category TEXT,
      unit TEXT DEFAULT 'pcs',
      current_stock INTEGER DEFAULT 0,
      min_stock_level INTEGER DEFAULT 10,
      max_stock_level INTEGER DEFAULT 100,
      unit_price REAL DEFAULT 0,
      cost_price REAL DEFAULT 0,
      supplier TEXT,
      location TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_sold_date DATETIME,
      total_sold INTEGER DEFAULT 0
    )`);

    // Transactions table (for tracking stock movements)
    db.run(`CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      sku_id TEXT NOT NULL,
      type TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sku_id) REFERENCES skus(id)
    )`);

    // Damage/Loss tracking
    db.run(`CREATE TABLE IF NOT EXISTS damage_loss (
      id TEXT PRIMARY KEY,
      sku_id TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      reason TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sku_id) REFERENCES skus(id)
    )`);
  });
}

// Helper function to update SKU timestamp
function updateSkuTimestamp(skuId) {
  db.run('UPDATE skus SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [skuId]);
}

// Routes

// Get all SKUs
app.get('/api/skus', (req, res) => {
  db.all('SELECT * FROM skus ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single SKU
app.get('/api/skus/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM skus WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'SKU not found' });
      return;
    }
    res.json(row);
  });
});

// Create new SKU
app.post('/api/skus', (req, res) => {
  const {
    name,
    sku_code,
    category,
    unit,
    current_stock,
    min_stock_level,
    max_stock_level,
    unit_price,
    cost_price,
    supplier,
    location,
    description
  } = req.body;

  const id = uuidv4();

  db.run(
    `INSERT INTO skus (
      id, name, sku_code, category, unit, current_stock, 
      min_stock_level, max_stock_level, unit_price, cost_price, 
      supplier, location, description
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, name, sku_code, category || null, unit || 'pcs',
      current_stock || 0, min_stock_level || 10, max_stock_level || 100,
      unit_price || 0, cost_price || 0, supplier || null,
      location || null, description || null
    ],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id, message: 'SKU created successfully' });
    }
  );
});

// Update SKU
app.put('/api/skus/:id', (req, res) => {
  const { id } = req.params;
  const {
    name,
    sku_code,
    category,
    unit,
    current_stock,
    min_stock_level,
    max_stock_level,
    unit_price,
    cost_price,
    supplier,
    location,
    description
  } = req.body;

  db.run(
    `UPDATE skus SET 
      name = ?, sku_code = ?, category = ?, unit = ?, 
      current_stock = ?, min_stock_level = ?, max_stock_level = ?,
      unit_price = ?, cost_price = ?, supplier = ?, 
      location = ?, description = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`,
    [
      name, sku_code, category, unit, current_stock,
      min_stock_level, max_stock_level, unit_price, cost_price,
      supplier, location, description, id
    ],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'SKU not found' });
        return;
      }
      updateSkuTimestamp(id);
      res.json({ message: 'SKU updated successfully' });
    }
  );
});

// Delete SKU
app.delete('/api/skus/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM skus WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'SKU not found' });
      return;
    }
    res.json({ message: 'SKU deleted successfully' });
  });
});

// Stock adjustment (add/remove stock)
app.post('/api/skus/:id/adjust', (req, res) => {
  const { id } = req.params;
  const { quantity, type, notes } = req.body; // type: 'add' or 'remove'

  db.get('SELECT current_stock FROM skus WHERE id = ?', [id], (err, sku) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!sku) {
      res.status(404).json({ error: 'SKU not found' });
      return;
    }

    const newStock = type === 'add' 
      ? sku.current_stock + quantity 
      : Math.max(0, sku.current_stock - quantity);

    db.run(
      'UPDATE skus SET current_stock = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newStock, id],
      function(updateErr) {
        if (updateErr) {
          res.status(500).json({ error: updateErr.message });
          return;
        }

        // Record transaction
        const transactionId = uuidv4();
        db.run(
          'INSERT INTO transactions (id, sku_id, type, quantity, notes) VALUES (?, ?, ?, ?, ?)',
          [transactionId, id, type, quantity, notes || null],
          (transErr) => {
            if (transErr) {
              console.error('Error recording transaction:', transErr);
            }
          }
        );

        res.json({ 
          message: 'Stock adjusted successfully',
          newStock 
        });
      }
    );
  });
});

// Record sale
app.post('/api/skus/:id/sell', (req, res) => {
  const { id } = req.params;
  const { quantity, notes } = req.body;

  db.get('SELECT current_stock FROM skus WHERE id = ?', [id], (err, sku) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!sku) {
      res.status(404).json({ error: 'SKU not found' });
      return;
    }

    if (sku.current_stock < quantity) {
      res.status(400).json({ error: 'Insufficient stock' });
      return;
    }

    const newStock = sku.current_stock - quantity;

    db.run(
      `UPDATE skus SET 
        current_stock = ?, 
        total_sold = total_sold + ?,
        last_sold_date = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?`,
      [newStock, quantity, id],
      function(updateErr) {
        if (updateErr) {
          res.status(500).json({ error: updateErr.message });
          return;
        }

        // Record transaction
        const transactionId = uuidv4();
        db.run(
          'INSERT INTO transactions (id, sku_id, type, quantity, notes) VALUES (?, ?, ?, ?, ?)',
          [transactionId, id, 'sale', quantity, notes || null],
          (transErr) => {
            if (transErr) {
              console.error('Error recording transaction:', transErr);
            }
          }
        );

        res.json({ 
          message: 'Sale recorded successfully',
          newStock 
        });
      }
    );
  });
});

// Record damage/loss
app.post('/api/skus/:id/damage', (req, res) => {
  const { id } = req.params;
  const { quantity, reason, notes } = req.body;

  db.get('SELECT current_stock FROM skus WHERE id = ?', [id], (err, sku) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!sku) {
      res.status(404).json({ error: 'SKU not found' });
      return;
    }

    if (sku.current_stock < quantity) {
      res.status(400).json({ error: 'Insufficient stock' });
      return;
    }

    const newStock = sku.current_stock - quantity;

    db.run(
      'UPDATE skus SET current_stock = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newStock, id],
      function(updateErr) {
        if (updateErr) {
          res.status(500).json({ error: updateErr.message });
          return;
        }

        // Record damage/loss
        const damageId = uuidv4();
        db.run(
          'INSERT INTO damage_loss (id, sku_id, quantity, reason, notes) VALUES (?, ?, ?, ?, ?)',
          [damageId, id, quantity, reason, notes || null],
          (damageErr) => {
            if (damageErr) {
              res.status(500).json({ error: damageErr.message });
              return;
            }
            res.json({ 
              message: 'Damage/loss recorded successfully',
              newStock 
            });
          }
        );
      }
    );
  });
});

// Get the low stock alerts
app.get('/api/alerts/low-stock', (req, res) => {
  db.all(
    `SELECT id, name, sku_code, current_stock, min_stock_level 
     FROM skus 
     WHERE current_stock <= min_stock_level 
     ORDER BY current_stock ASC`,
    [],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Get the dead inventory (no sales in last 90 days)
app.get('/api/alerts/dead-inventory', (req, res) => {
  db.all(
    `SELECT id, name, sku_code, current_stock, last_sold_date, 
     (julianday('now') - julianday(COALESCE(last_sold_date, created_at))) as days_since_sale
     FROM skus 
     WHERE (last_sold_date IS NULL OR 
            (julianday('now') - julianday(last_sold_date)) > 90)
     AND current_stock > 0
     ORDER BY days_since_sale DESC`,
    [],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Get the dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
  db.get(
    `SELECT 
      COUNT(*) as total_skus,
      COALESCE(SUM(current_stock), 0) as total_stock,
      COALESCE(SUM(current_stock * cost_price), 0) as total_inventory_value,
      COUNT(CASE WHEN current_stock <= min_stock_level THEN 1 END) as low_stock_count
    FROM skus`,
    [],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      db.get(
        `SELECT COUNT(*) as dead_inventory_count
         FROM skus 
         WHERE (last_sold_date IS NULL OR 
                (julianday('now') - julianday(last_sold_date)) > 90)
         AND current_stock > 0`,
        [],
        (err2, deadRow) => {
          if (err2) {
            res.status(500).json({ error: err2.message });
            return;
          }

          res.json({
            total_skus: row.total_skus || 0,
            total_stock: row.total_stock || 0,
            total_inventory_value: row.total_inventory_value || 0,
            low_stock_count: row.low_stock_count || 0,
            dead_inventory_count: deadRow.dead_inventory_count || 0
          });
        }
      );
    }
  );
});

// Get the SKU performance (top sellers)
app.get('/api/analytics/top-sellers', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  db.all(
    `SELECT id, name, sku_code, total_sold, current_stock, 
     (total_sold * unit_price) as revenue
     FROM skus 
     WHERE total_sold > 0
     ORDER BY total_sold DESC 
     LIMIT ?`,
    [limit],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Get the transactions history
app.get('/api/transactions', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  db.all(
    `SELECT t.*, s.name as sku_name, s.sku_code 
     FROM transactions t
     JOIN skus s ON t.sku_id = s.id
     ORDER BY t.created_at DESC
     LIMIT ?`,
    [limit],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

