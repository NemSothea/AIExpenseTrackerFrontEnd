# AI Expense Tracker 📱💰

<div align="center">

![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Swift](https://img.shields.io/badge/Swift-FA7343?style=for-the-badge&logo=swift&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

**An intelligent expense management application powered by AI**

[Features](#-features) • [Installation](#-installation) • [API Docs](#-api-documentation)• [Team](#-team)

</div>

## 🚀 Overview

AI Expense Tracker is a comprehensive financial management solution that leverages artificial intelligence to simplify expense tracking. The application features a robust Spring Boot backend, native iOS mobile app, and responsive web dashboard.

### 🎯 Key Highlights
- **AI-Powered**: Automatic receipt scanning and expense categorization
- **Multi-Platform**: iOS app + Web dashboard with real-time sync
- **Voice Control**: Hands-free expense creation via voice commands
- **Smart Analytics**: Interactive charts and spending insights

## ✨ Features

### 🤖 Core Capabilities
| Feature | Description | Status |
|---------|-------------|---------|
| 📝 Manual Expense Entry | Traditional form-based expense logging | 🧑🏻‍💻 Completed |
| 📷 Receipt OCR Scanning | AI-powered receipt scanning with automatic data extraction | 🧑🏻‍💻 Completed |
| 🎤 Voice Input | Natural language expense creation via voice commands | 🧑🏻‍💻 Completed |
| 🏷️ AI Categorization | Machine learning-based automatic expense categorization | 🧑🏻‍💻 Completed |
| 📊 Data Visualization | Interactive charts and spending analytics |🧑🏻‍💻 Completed |
| 🔐 Secure Authentication | JWT + OAuth2 with role-based access control | 🧑🏻‍💻 Completed |

### 🔧 Technical Features
- **Backend**: Spring Boot with RESTful APIs
- **Database**: PostgreSQL with optimized queries
- **Mobile**: Native iOS app built with SwiftUI
- **Web**: React dashboard with Tailwind CSS
- **Security**: JWT authentication with secure credential storage

## 🏗️ System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   iOS Mobile    │ ◄──│  Spring Boot     │ ──►│  PostgreSQL     │
│    (SwiftUI)    │    │   Backend API    │    │   Database      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│   Web Dashboard │    │  AI Services     │
│    (React)      │    │ (OCR, ML, Voice) │
└─────────────────┘    └──────────────────┘
```

## 📥 Installation

### Prerequisites
- **Java 21+**
- **PostgreSQL 12+**
- **Xcode 15+** (for iOS development)
- **Node.js 18+** (for web dashboard)
- **Maven 3.6+**

### 🗄️ Database Setup

1. **Create Database**:
```sql
CREATE DATABASE aiexpensedb;
```

2. **Create Users Table**:
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    contact_number VARCHAR(10) UNIQUE,
    role VARCHAR(50),
    enabled BOOLEAN DEFAULT TRUE,
    
    -- Constraints
    CHECK (char_length(name) >= 2 AND char_length(name) <= 20),
    CHECK (char_length(password) >= 5),
    CHECK (contact_number ~ '^[0-9]{10}$')
);
```

### ⚙️ Backend Setup

```bash
# Clone the repository
git clone https://github.com/NemSothea/AIExpenseTrackerBackEnd.git
cd AIExpenseTrackerBackEnd

# Configure database connection
# Edit src/main/resources/application.properties

# Run the application
mvn spring-boot:run
```

### 🌐 Frontend Setup

```bash
# Clone frontend repository
git clone https://github.com/NemSothea/AIExpenseTrackerFrontend.git
cd AIExpenseTrackerFrontend

# Create environment file
echo "VITE_BASE_URL=https://localhost:5173" > .env

# Install dependencies
npm install

# Start development server
npm run dev
```

### 📱 iOS App Setup

1. **Open in Xcode**:
```bash
git clone https://github.com/NemSothea/AI-Expense-Tracker.git
open AI-Expense-Tracker/AIExapenseTracker.xcodeproj
```

2. **Configure API Endpoint**:
   - Update `API_BASE_URL` in `NetworkManager.swift`
   - Configure bundle identifier and signing certificates

3. **Build and Run**:
   - Select target device/simulator
   - Press `Cmd + R` to build and run

## 📚 API Documentation
###  ✌️ Process Flow
![Process Flow](https://github.com/NemSothea/AIExpenseTrackerFrontEnd/blob/main/src/assets/Images/Process_Flow_Web_Application.png)

### 👌 Web Application
![Process Flow](https://github.com/NemSothea/AIExpenseTrackerFrontEnd/blob/main/src/assets/Images/FrontEndImage.png)


### Base URL
```
http://localhost:8080
```

### 🔐 Authentication Endpoints

#### Register New User
**POST** `/auth/signup`
```json
{
  "name": "Sothea",
  "email": "sothea@example.com",
  "password": "secret123",
  "contact": "0123456789",
  "role": "ROLE_CUSTOMER"
}
```

#### User Login
**POST** `/auth/login`
```json
{
  "email": "sothea@example.com",
  "password": "secret123"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "sothea@example.com"
}
```

### 💰 Expense Management

#### Get All Expenses
**GET** `/api/expenses`
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8080/api/expenses
```

#### Create New Expense
**POST** `/api/expenses`
```json
{
  "amount": 29.99,
  "description": "Lunch at restaurant",
  "category": "Food & Dining",
  "date": "2024-12-19",
  "paymentMethod": "Credit Card"
}
```

#### Update Expense
**PUT** `/api/expenses/{id}`

#### Delete Expense
**DELETE** `/api/expenses/{id}`

### 📊 Categories

#### Get All Categories
**GET** `/api/categories`

### 🔍 Interactive API Docs
Access Swagger UI at: http://localhost:8080/swagger-ui/index.html

## 🎯 Usage Guide

### Adding Expenses

1. **Manual Entry**:
   - Tap the "+" button on main screen
   - Fill in expense details (amount, category, date, description)
   - Save to automatically categorize with AI

2. **Receipt Scanning**:
   - Select "Scan Receipt" option
   - Capture receipt using device camera
   - AI extracts amount, merchant, and date automatically
   - Review and confirm details

3. **Voice Input**:
   - Tap microphone icon
   - Speak expense details naturally: "I spent $15 on lunch today"
   - AI processes and creates expense entry

### Viewing and Managing

- **Dashboard**: View spending overview with interactive charts
- **Expense List**: Scroll through all expenses with sort/filter options
- **Search**: Find specific expenses by description or merchant
- **Categories**: View spending breakdown by category

### Advanced Features

- **Smart Filtering**: Filter by date range, category, amount
- **Data Export**: Export expenses to CSV format
- **Budget Alerts**: Set monthly budgets and receive notifications
- **Multi-Currency**: Support for different currencies

## 👥 Team

| Role | Member | Responsibilities |
|------|--------|------------------|
| **Project Lead** | Sothea | iOS development, Spring Boot API, AI integration |
| **Database Architect** | Pisey | PostgreSQL design, query optimization, data integrity |
| **UI/UX Designer** | Seyha | Application design, web dashboard development |
| **Documentation Lead** | Srey Nich | Documentation, presentations, demo preparation |

## 🛠️ Development

### Project Structure
```
AI-Expense-Tracker/
├── backend/                 # Spring Boot application
│   ├── src/main/java/
│   ├── src/main/resources/
│   └── pom.xml
├── ios/                    # iOS SwiftUI application
│   ├── Models/
│   ├── Views/
│   ├── ViewModels/
│   └── Utilities/
└── frontend/              # React web dashboard
    ├── src/
    ├── public/
    └── package.json
```

### Building from Source

#### Backend
```bash
cd backend
mvn clean package
java -jar target/expense-tracker-1.0.0.jar
```

#### iOS
```bash
cd ios
xcodebuild -workspace AIExapenseTracker.xcworkspace -scheme AIExapenseTracker
```

#### Frontend
```bash
cd frontend
npm run build
npm start
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Commit Message Guidelines
- Use descriptive commit messages
- Include relevant emojis for better readability:
  - 🎨: Code structure/format improvements
  - 🐛: Bug fixes
  - ✨: New features
  - 📝: Documentation updates
  - 🔧: Configuration changes

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Check PostgreSQL is running: `pg_isready`
- Verify database credentials in `application.properties`
- Ensure port 8080 is available

**iOS build failures:**
- Clean build folder: `Shift + Cmd + K`
- Reset package caches: `File > Packages > Reset Package Caches`
- Check signing certificates and bundle identifier

**Frontend connection issues:**
- Verify backend is running on port 8080
- Check `VITE_BASE_URL` in `.env` file
- Clear browser cache or try incognito mode

### Logs and Debugging

**Backend logs:** `tail -f logs/application.log`  
**iOS debugging:** Use Xcode debug console  
**Frontend debugging:** Browser developer tools  

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for AI/ML capabilities
- **Spring Boot** community for excellent documentation
- **SwiftUI** team for modern iOS development framework
- **PostgreSQL** for reliable database performance

## 📞 Support

- **Backend Issues**: [Create Issue](https://github.com/NemSothea/AIExpenseTrackerBackEnd/issues)
- **iOS App Issues**: [Create Issue](https://github.com/NemSothea/AI-Expense-Tracker/issues)
- **Frontend Issues**: [Create Issue](https://github.com/NemSothea/AIExpenseTrackerFrontend/issues)

## 🔗 Links

- **Main Repository**: [AI Expense Tracker](https://github.com/NemSothea/AI-Expense-Tracker)
- **Backend API**: [Spring Boot Backend](https://github.com/NemSothea/AIExpenseTrackerBackEnd)
- **Web Dashboard**: [React Frontend](https://github.com/NemSothea/AIExpenseTrackerFrontend)
- **OpenAI Platform**: [API Keys](https://platform.openai.com/settings/organization/api-keys)

---

<div align="center">

**Made with ❤️ by the AI Expense Tracker Team**

*Simplifying financial management through AI power*

</div>
