# Square Inventory Manager

A comprehensive inventory management system that connects to Square API to track and manage inventory for food, drinks, and merchandise. This application helps businesses manage their stock levels, view purchase history, and track sales trends.

## Features

- **Dashboard Overview**: Get a quick visual summary of your inventory metrics and sales data
- **Category Management**: Separate tracking for Food, Drinks, and Merchandise items
- **Inventory Count**: Dedicated feature for performing and recording inventory counts
- **Low Stock Alerts**: Visual indicators for items that need to be restocked
- **Purchase History**: Track and analyze past purchases integrated with Square API
- **Reports**: Generate detailed reports on inventory and sales performance
- **Square API Integration**: Sync your inventory data with Square POS system

## Technology Stack

- **Frontend**: React with TypeScript, Tailwind CSS, and Shadcn UI components
- **Backend**: Express.js with TypeScript
- **State Management**: React Query for server state, React hooks for local state
- **Styling**: Tailwind CSS with customized theme
- **Data Validation**: Zod for schema validation
- **API Integration**: Square API

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Square Developer Account (for API integration)

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/square-inventory-manager.git
cd square-inventory-manager
```

2. Install dependencies
```
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_LOCATION_ID=your_square_location_id
```

4. Start the development server
```
npm run dev
```

The application will be available at http://localhost:5000

## Usage Guide

### Dashboard

The dashboard provides a high-level overview of your inventory status and recent sales data. Key metrics include:
- Revenue by category (Food, Drinks, Merchandise)
- Low stock item count
- Recent activity feed

### Inventory Management

Navigate to specific category pages (Food, Drinks, Merchandise) to:
- View all items in that category
- Add new inventory items
- Edit existing items (price, description, stock levels)
- Delete items

### Inventory Count

The Inventory Count feature allows you to:
1. Initialize counts based on current inventory levels
2. Update quantities for each item
3. Save all changes in a single batch operation
4. Filter items by category
5. Search for specific items by name or SKU

### Reports

Generate and export reports for:
- Sales history
- Inventory valuation
- Stock movement
- Category performance

## Square API Integration

This application connects with Square's API to:
- Fetch real-time purchase data
- Sync inventory levels
- Update product information

To set up the Square integration:
1. Create a developer account at https://developer.squareup.com
2. Create an application in the Square Developer Dashboard
3. Get your Access Token and Location ID
4. Add these to your environment variables

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact [your-email@example.com](mailto:your-email@example.com)