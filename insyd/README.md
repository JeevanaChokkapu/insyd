# Insyd Inventory Management System

A comprehensive inventory management solution for AEC (Architecture, Engineering, and Construction) material businesses. This system helps businesses gain visibility over their inventory levels, track SKU performance, and optimize their operations.

## Features

- **Real-time Inventory Tracking**: Track stock levels across all SKUs with real-time updates
- **SKU Management**: Add, edit, and delete SKUs with comprehensive product information
- **Stock Operations**: Record sales, adjust stock levels, and track damage/loss
- **Low Stock Alerts**: Automated alerts when stock falls below minimum levels
- **Dead Inventory Detection**: Identify products with no sales in 90+ days
- **Performance Analytics**: View top-selling SKUs and revenue metrics
- **Transaction History**: Complete audit trail of all inventory movements
- **Dashboard**: Overview of key metrics and alerts

## Tech Stack

- **Frontend**: Next.js 14 (React)
- **Backend**: Express.js (Node.js)
- **Database**: SQLite
- **Styling**: Custom CSS

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd insyd
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode

1. Start the backend server (in one terminal):
```bash
npm run dev:server
```
The server will run on `http://localhost:3001`

2. Start the Next.js frontend (in another terminal):
```bash
npm run dev
```
The frontend will run on `http://localhost:3000`

### Production Mode

1. Build the Next.js application:
```bash
npm run build
```

2. Start the backend server:
```bash
npm run server
```

3. Start the frontend:
```bash
npm start
```

## Project Structure

```
insyd/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Dashboard page
│   ├── inventory/         # Inventory pages
│   │   ├── page.tsx       # Inventory list
│   │   ├── new/          # Add new SKU
│   │   └── [id]/         # SKU detail and edit pages
│   ├── analytics/         # Analytics page
│   ├── transactions/      # Transactions page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── server/                # Express backend
│   ├── index.js          # Server entry point
│   └── inventory.db      # SQLite database (created automatically)
├── package.json          # Dependencies and scripts
├── next.config.js        # Next.js configuration
└── README.md            # This file
```

## API Endpoints

### SKUs
- `GET /api/skus` - Get all SKUs
- `GET /api/skus/:id` - Get single SKU
- `POST /api/skus` - Create new SKU
- `PUT /api/skus/:id` - Update SKU
- `DELETE /api/skus/:id` - Delete SKU

### Stock Operations
- `POST /api/skus/:id/adjust` - Adjust stock (add/remove)
- `POST /api/skus/:id/sell` - Record a sale
- `POST /api/skus/:id/damage` - Record damage/loss

### Analytics & Alerts
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/alerts/low-stock` - Get low stock alerts
- `GET /api/alerts/dead-inventory` - Get dead inventory items
- `GET /api/analytics/top-sellers` - Get top selling SKUs
- `GET /api/transactions` - Get transaction history

## Usage Guide

### Adding a New SKU

1. Navigate to Inventory → Add New SKU
2. Fill in the required fields (SKU Code and Product Name)
3. Set stock levels, pricing, and other details
4. Click "Create SKU"

### Recording a Sale

1. Go to Inventory → Select a SKU
2. Click "Record Sale"
3. Enter quantity and optional notes
4. Confirm the sale

### Adjusting Stock

1. Go to Inventory → Select a SKU
2. Click "Adjust Stock"
3. Choose Add or Remove
4. Enter quantity and notes
5. Confirm

### Viewing Analytics

1. Navigate to Analytics page
2. View top-selling SKUs ranked by sales volume
3. Review revenue metrics

### Checking Alerts

1. Dashboard shows low stock and dead inventory alerts
2. Low stock items are highlighted in red
3. Dead inventory shows items with no sales in 90+ days

## Database

The application uses SQLite for data storage. The database file (`inventory.db`) is automatically created in the `server/` directory on first run.

### Database Schema

- **skus**: Stores product/SKU information
- **transactions**: Records all stock movements
- **damage_loss**: Tracks damaged or lost inventory

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Set build command: `npm run build`
4. Set output directory: `.next`
5. Deploy

### Backend (Railway/Render)

1. Create new project on Railway or Render
2. Connect GitHub repository
3. Set start command: `node server/index.js`
4. Set environment variables if needed
5. Deploy

**Note**: For production, update the API URL in `next.config.js` to point to your deployed backend URL.

## Environment Variables

Create a `.env.local` file for local development:

```
PORT=3001
```

## Troubleshooting

### Database Issues
- If database errors occur, delete `server/inventory.db` and restart the server
- Ensure write permissions in the `server/` directory

### CORS Issues
- Ensure backend server is running before starting frontend
- Check that API URLs are correct in `next.config.js`

### Port Conflicts
- Change PORT in server/index.js if 3001 is in use
- Update next.config.js rewrites accordingly

## Future Enhancements

- User authentication and role-based access
- Multi-location inventory tracking
- Barcode/QR code scanning
- Advanced reporting and exports
- Integration with accounting software
- Mobile app
- Email/SMS alerts for low stock
- Demand forecasting

## License

This project is created for Insyd assignment purposes.

## Support

For issues or questions, please refer to the problem-solving document (`INVENTORY_SOLUTION_DOCUMENT.md`) for detailed solution explanations.

