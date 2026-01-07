# Odoo Mobile Application

Mobile application for interacting with Odoo 17.0 ERP system

## Features

- Secure authentication with Odoo server
- Dashboard with key metrics
- Access to various Odoo modules
- Record listing and detail views
- Offline session management
- Responsive UI for mobile devices
## Technology Stack
- React Native
- JavaScript/ES6
- Axios for API communication
- React Navigation for routing
- AsyncStorage for local storage
- Odoo XML-RPC API

## Project Structure

```
odoo-mobile-app/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # App screens
│   ├── utils/          # Utility functions
│   ├── config/         # Configuration files
│   └── navigation/     # Navigation structure
├── docs/               # Documentation files
├── assets/             # Images and other assets
└── App.js              # Main application entry point
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure the server URL in `src/config/api.config.js` if needed

4. Run the application:
   ```bash
   # For Android
   npx react-native run-android
   
   # For iOS
   npx react-native run-ios
   ```

## Configuration

The application can be configured by modifying the settings in `src/config/api.config.js`:

- `baseURL`: The URL of your Odoo server
- `timeout`: Request timeout in milliseconds
- `defaultPageSize`: Number of records to fetch per request

## Testing

Please refer to the [Testing Guide](./docs/testing_guide.md).

## API Integration

The application communicates with Odoo through the XML-RPC API. The main API client is located in `src/utils/OdooAPI.js` and provides methods for:

- Authentication
- Data retrieval (search_read, search_count)
- Data modification (create, write, unlink)
- Session management

## Authentication Flow

1. User enters credentials on the login screen
2. Application sends authentication request to Odoo server
3. Upon successful authentication, session information is stored locally
4. Session information is used for subsequent API requests
5. On logout, session information is cleared

## Security Considerations

- All API communication is done via HTTPS
- User credentials are not stored locally
- Session tokens have limited lifetime
- Network requests have timeout protection

## Future Enhancements

- Push notifications
- Offline data synchronization
- File attachment support
- Multi-language support
- Advanced search functionality
- Barcode scanning
