# Order Book Server

This project provides a server for an order book application. It uses Node.js, Express, and Socket.io to connect to Binance WebSocket streams and broadcast order book and ticker updates to connected clients.

## Installation

1. Clone the repository:
    ```
    git clone https://github.com/yourusername/order-book-server.git
    ```
2. Change to the project directory:
    ```
    cd order-book-server
    ```
3. Install dependencies:
    ```
    npm install
    ```

## Usage

1. Start the server:
    ```
    npm start
    ```

2. The server will be running on port 4000. You can change the port by setting the `PORT` environment variable.

## Configuration

Create a `.env` file in the root directory of your project and add any necessary configuration variables. For example:
```
PORT=4000
ALLOWED_ORIGINS=https://order-book-two.vercel.app
```

## Endpoints

- **POST /api/setcoin**
  - Description: Switch the current coin being tracked.
  - Request Body:
    ```json
    {
      "coinID": "btcusdt"
    }
    ```
  - Response: `200 OK` with a message indicating the switched coin.

- **GET /**
  - Description: Returns a motivational quote.

## WebSocket Events

### Client to Server

- **changeCoin**
  - Description: Change the coin for which updates are being received.
  - Data: `string` - Coin ID (e.g., "btcusdt").

### Server to Client

- **orderBookUpdate**
  - Description: Order book updates from Binance.
  - Data: `Object` - Order book data.

- **tickerUpdate**
  - Description: Ticker updates from Binance.
  - Data: `Object` - Ticker data.

## Directory Structure
```
├── config
│ ├── config.js # Configuration settings
├── helper
│ ├── disconnect.js # Handles disconnection logic
│ ├── heartBeatServices.js # Manages WebSocket heartbeat
│ ├── orderBookHelper.js # Helper functions for managing order book data
├── node_modules
├── services
│ ├── bookService.js # Handles order book WebSocket connections
│ ├── indexServices.js # Switches the coin and manages connections
│ ├── tickerService.js # Handles ticker WebSocket connections
│ ├── urlBuilder.js # Builds URLs for WebSocket connections
├── .env # Environment variables
├── .gitignore # Files and directories to ignore in git
├── index.js # Main entry point of the application
├── package-lock.json # Lockfile for npm dependencies
├── package.json # Project dependencies and scripts
├── vercel.json # Vercel configuration
└── README.md # Project documentation
```

## Thanks

Thank you for using the Order Book Server! We hope it helps you build something great. If you have any feedback or suggestions, feel free to reach out.
