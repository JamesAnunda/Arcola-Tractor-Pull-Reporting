# Installation and Setup Guide

This guide provides detailed instructions for setting up the Arcola Tractor Pull Invenotry Mangement application on your system.

## System Requirements

- Node.js (version 16.x or higher)
- npm (v7 or higher) or yarn
- Internet connection for Square API integration
- Square Developer Account

## Basic Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/square-inventory-manager.git
cd square-inventory-manager
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

### 3. Environment Setup

Create a `.env` file in the root directory with the following variables:

```
# Square API Configuration
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_LOCATION_ID=your_square_location_id

# Application Configuration
PORT=5000
NODE_ENV=production
```

### 4. Starting the Application

For development:
```bash
npm run dev
```

For production:
```bash
npm run build
npm start
```

The application will be available at http://localhost:5000 (or the port you specified).

## Square API Integration

### 1. Create a Square Developer Account

- Visit [Square Developer Portal](https://developer.squareup.com/)
- Sign up for a developer account or log in with your existing Square account

### 2. Create a New Application

- From the Square Developer Dashboard, click "Create Your First Application"
- Name your application (e.g., "My Inventory Manager")
- Select the appropriate application type (usually Web)

### 3. Get Your Credentials

- Once your application is created, navigate to the "Credentials" tab
- For development, use the "Sandbox Access Token" to test integration
- For production, use the "Production Access Token"

### 4. Find Your Location ID

- Go to the "Locations" tab in the Square Developer Dashboard
- Copy the Location ID for the business location you want to connect to

### 5. Configure Your Application

- Add your Access Token and Location ID to the `.env` file as shown above

## Storage Configuration

By default, the application uses in-memory storage for development purposes. For production use, consider implementing a persistent database solution.

## Security Considerations

- Never share your Square Access Token
- Add your `.env` file to `.gitignore` to prevent it from being committed to version control
- Rotate your Access Tokens periodically
- Use HTTPS in production environments

## Troubleshooting

### API Connection Issues

If you're having trouble connecting to the Square API:

1. Verify your Access Token and Location ID are correct
2. Check if your Square account has the necessary permissions
3. Ensure your internet connection is stable
4. Check the Square API status at [Square Status Page](https://status.developer.squareup.com/)

### Application Startup Problems

If the application fails to start:

1. Ensure all dependencies are installed correctly
2. Verify your Node.js version is compatible
3. Check for error messages in the console
4. Verify the required environment variables are set

## Next Steps

After installation:

1. Add your initial inventory items
2. Configure categories and reorder points
3. Set up user accounts if needed
4. Perform your first inventory count to verify the system