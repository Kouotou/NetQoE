# DrivePulse - Mobile Drive Test Application

A comprehensive React Native mobile application for conducting cellular network drive tests. Built with Expo and designed for real-time network quality monitoring and QoE assessment.

## 🚀 Features

### Core Functionality
- **Real-Time Network Monitoring**: Track RSSI, RSRP, SINR, and other cellular KPIs
- **Multi-Technology Support**: Monitor 2G, 3G, 4G/LTE networks
- **QoE Rating System**: Rate network experience with 1-5 MOS scale
- **Speed Testing**: Measure download/upload speeds and latency
- **GPS Tracking**: Geo-tag all measurements with precise location data
- **Offline-First Architecture**: Local data caching with background sync
- **Interactive Maps**: Visualize signal strength on geographic maps
- **Session History**: View past drive test sessions with detailed analytics
- **Data Export**: Export session data as CSV for external analysis

### Technical Features
- **Clean Architecture**: MVVM pattern with separation of concerns
- **Context API**: Global state management for authentication and network data
- **Secure Authentication**: JWT-based authentication with AsyncStorage
- **Location Services**: GPS tracking for geo-tagged measurements
- **Background Processing**: Continuous monitoring even when app is backgrounded
- **Responsive UI**: Adaptive design for various screen sizes
- **Dark Mode Support**: Automatic theme switching

## 📋 Prerequisites

Before setting up DrivePulse, ensure you have the following installed:

### Required Software
- **Node.js**: Version 18.x or higher ([Download](https://nodejs.org/))
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: For cloning the repository ([Download](https://git-scm.com/))

### For Android Development
- **Android Studio**: Latest version ([Download](https://developer.android.com/studio))
- **Android SDK**: API Level 33 or higher
- **Java Development Kit (JDK)**: Version 17 or higher

### For iOS Development (macOS only)
- **Xcode**: Latest version from Mac App Store
- **CocoaPods**: Install via `sudo gem install cocoapods`
- **iOS Simulator**: Included with Xcode

## 🛠️ Installation & Setup

### Step 1: Install Node.js

#### Windows
1. Download the Windows installer from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the setup wizard
3. Verify installation:
```bash
node --version
npm --version
```

#### macOS
```bash
# Using Homebrew
brew install node

# Verify installation
node --version
npm --version
```

#### Linux (Ubuntu/Debian)
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 2: Clone the Repository

```bash
git clone https://github.com/Kouotou/NetQoE.git
cd NetQoE/DrivePulse
```

### Step 3: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Expo SDK (~54.0)
- React Native (0.81.5)
- React Navigation
- Expo Location, Maps, and other native modules
- UI libraries (React Native Paper, Lucide icons)

### Step 4: Configure Backend Connection

Update the API base URL in `services/api.ts`:

```typescript
const API_BASE_URL = 'http://YOUR_BACKEND_IP:8000';
```

Replace `YOUR_BACKEND_IP` with:
- `localhost` or `127.0.0.1` for local development
- Your computer's local IP (e.g., `192.168.1.100`) for testing on physical devices
- Your production server URL for deployment

### Step 5: Start the Development Server

```bash
npx expo start
```

Or use the npm script:
```bash
npm start
```

You'll see a QR code and several options to run the app.

## 📱 Running the App

### Option 1: Expo Go (Quickest - Recommended for Testing)

1. Install Expo Go on your device:
   - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS](https://apps.apple.com/app/expo-go/id982107779)

2. Scan the QR code from the terminal with:
   - **Android**: Expo Go app
   - **iOS**: Camera app (opens in Expo Go)

3. The app will load on your device

### Option 2: Android Emulator

1. Open Android Studio
2. Go to **Tools > Device Manager**
3. Create a new virtual device (Pixel 5 recommended)
4. Start the emulator
5. In the terminal, press `a` to open in Android emulator

Or run:
```bash
npm run android
```

### Option 3: iOS Simulator (macOS only)

1. Ensure Xcode is installed
2. In the terminal, press `i` to open in iOS simulator

Or run:
```bash
npm run ios
```

### Option 4: Physical Device (Development Build)

For full native features and better performance:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Build for Android
eas build --platform android --profile development

# Build for iOS
eas build --platform ios --profile development
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
API_BASE_URL=http://192.168.1.100:8000
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### App Configuration

Edit `app.json` to customize:
- App name and slug
- Icon and splash screen
- Permissions (location, network state)
- Build settings

## 📂 Project Structure

```
DrivePulse/
├── app/                      # Expo Router screens
│   ├── (tabs)/              # Tab navigation screens
│   │   ├── index.tsx        # Dashboard (Home)
│   │   ├── speed.tsx        # Speed Test
│   │   ├── map.tsx          # Map View
│   │   ├── log.tsx          # Session History
│   │   └── settings.tsx     # Settings
│   ├── login.tsx            # Login screen
│   ├── signup.tsx           # Registration screen
│   └── splashScreen.tsx     # Splash screen
├── components/              # Reusable UI components
│   ├── ui/                  # Base UI components
│   └── ProtectedRoute.tsx   # Auth guard
├── contexts/                # React Context providers
│   ├── AuthContext.tsx      # Authentication state
│   └── NetworkContext.tsx   # Network selection state
├── services/                # Business logic & API
│   ├── api.ts              # Backend API client
│   ├── authStorage.ts      # Secure token storage
│   ├── networkService.ts   # Network measurement logic
│   ├── locationService.ts  # GPS tracking
│   └── speedTestService.ts # Speed test logic
├── styles/                  # Screen-specific styles
├── constants/               # App constants & theme
├── assets/                  # Images, icons, fonts
└── package.json            # Dependencies
```

## 🎯 Usage Guide

### First Time Setup

1. **Launch the app** - You'll see the splash screen
2. **Sign Up** - Create an account with email and password
3. **Login** - Authenticate with your credentials
4. **Grant Permissions** - Allow location access for geo-tagged measurements

### Running a Drive Test

1. **Start Session** - The app automatically starts a session on login
2. **Select Network** - Choose 2G, 3G, or 4G from the dashboard
3. **Monitor Metrics** - Watch real-time RSSI, RSRP, SINR values
4. **Rate QoE** - Tap 1-5 to rate your experience
5. **Run Speed Tests** - Navigate to Speed tab for throughput tests
6. **View Map** - Check signal coverage on the Map tab
7. **End Session** - Tap "End Session" when done

### Viewing Results

- **Session Log**: View all past sessions with statistics
- **Map View**: See signal strength heatmap
- **Export Data**: Download CSV from backend analytics endpoint

## 🔍 Troubleshooting

### Common Issues

**App won't start**
```bash
# Clear cache and restart
npx expo start -c
```

**Can't connect to backend**
- Ensure backend is running on port 8000
- Check firewall settings
- Use local IP address, not localhost, for physical devices
- Verify API_BASE_URL in `services/api.ts`

**Location not working**
- Grant location permissions in device settings
- Enable GPS/Location Services
- For iOS simulator, use Debug > Location > Custom Location

**Build errors**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

**Android emulator slow**
- Enable hardware acceleration in BIOS
- Allocate more RAM to emulator (4GB+)
- Use x86_64 system image

## 📦 Building for Production

### Android APK

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure build
eas build:configure

# Build APK
eas build --platform android --profile production
```

### iOS App

```bash
# Build for App Store
eas build --platform ios --profile production
```

## 🔐 Security Notes

- JWT tokens are stored securely in AsyncStorage
- All API requests use HTTPS in production
- Passwords are hashed with bcrypt on backend
- Location data is only collected with user consent

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the NetQoE crowdsourced network monitoring initiative.

## 🆘 Support

For issues and questions:
- Open an issue on GitHub
- Check the [Expo documentation](https://docs.expo.dev/)
- Review the [React Native docs](https://reactnative.dev/)

## 🔗 Related Projects

- **Backend**: See `Drivepulse_backend/` for FastAPI server setup
- **NetQoE Android**: Native Android implementation

---

**Made with ❤️ for better network quality monitoring**
