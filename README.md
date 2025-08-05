# StatsOfIndia 📊

A comprehensive statistics platform for exploring and analyzing data across Indian states and union territories. Built with modern web technologies to provide an intuitive interface for accessing government statistics and demographic data.

## 🌟 Features

### 📱 User Interface
- **Modern Design** with Tailwind CSS and Shadcn UI components
- **Dark/Light Theme** toggle with persistent preferences
- **Responsive Design** optimized for all device sizes
- **Interactive Charts** and data visualizations
- **Real-time Search** and filtering capabilities
- **Type-safe** development with TypeScript

### 🔐 Authentication & Security
- **JWT-based Authentication** with secure token management
- **Email Verification** with OTP system
- **Role-based Access Control** (User/Admin)
- **Password Security** with bcrypt hashing
- **CORS Protection** and rate limiting

### 📊 Data Management
- **Multi-format Support** (CSV, PDF datasets)
- **Category-based Organization** (Demographics, Economy, Education, Health, Agriculture)
- **State-wise Filtering** for all Indian states and territories
- **Advanced Search** with multiple criteria
- **Bookmark System** for favorite datasets
- **Download Tracking** and history

### 🛠️ Admin Features
- **Dataset Upload** with metadata management
- **Content Management** for datasets and categories
- **User Management** and analytics
- **Data Quality Control** and validation
- **Bulk Operations** for efficient management

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn UI** for components
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Nodemailer** for email services
- **Multer** for file uploads

### Development Tools
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Git** for version control

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud)
- **npm** or **yarn** package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/StatsOfIndia.git
cd StatsOfIndia
```

### 2. Backend Setup
```bash
cd backend
npm install
cp env.example .env
```

Configure your `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stats-of-india
JWT_SECRET=your-secret-key
GMAIL_APP_PASSWORD=your-gmail-app-password
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup
```bash
cd ..
npm install
```

### 4. Database Setup
Install MongoDB locally or use MongoDB Atlas cloud service.

## 🚀 Running the Application

### Development Mode

**Start Backend:**
```bash
cd backend
npm run dev
```

**Start Frontend:**
```bash
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

### Production Mode

**Build Frontend:**
```bash
npm run build
```

**Start Production Server:**
```bash
cd backend
npm start
```

## 📊 API Documentation

### Base URL: `http://localhost:5000/api`

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/login` | User login |
| `POST` | `/auth/verify-otp` | Verify email OTP |
| `GET` | `/auth/me` | Get current user (Protected) |
| `PUT` | `/auth/profile` | Update user profile (Protected) |
| `PUT` | `/auth/change-password` | Change password (Protected) |

### Dataset Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/datasets` | Get all datasets |
| `GET` | `/datasets/:id` | Get dataset by ID |
| `POST` | `/datasets/upload` | Upload dataset (Protected) |
| `DELETE` | `/datasets/:id` | Delete dataset (Protected) |
| `GET` | `/datasets/categories/:category` | Get by category |
| `GET` | `/datasets/states/:state` | Get by state |
| `GET` | `/datasets/search` | Search datasets |
| `GET` | `/datasets/:id/download/:fileId` | Download file |

### User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/datasets/:id/bookmark` | Add bookmark (Protected) |
| `DELETE` | `/datasets/:id/bookmark` | Remove bookmark (Protected) |
| `GET` | `/users/downloads` | Get download history (Protected) |
| `GET` | `/users/searches` | Get search history (Protected) |

## 🗃️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  fullName: String,
  phone: String,
  organization: String,
  role: String, // 'user' or 'admin'
  isVerified: Boolean,
  preferences: {
    dataCategories: [String]
  },
  bookmarks: [ObjectId],
  downloadHistory: [ObjectId],
  searchHistory: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Datasets Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  state: String,
  year: Number,
  source: String,
  sourceUrl: String,
  tags: [String],
  files: [{
    fileName: String,
    fileType: String,
    fileSize: Number,
    downloadCount: Number
  }],
  statistics: {
    downloadCount: Number,
    viewCount: Number,
    rating: {
      average: Number,
      count: Number
    }
  },
  isPublic: Boolean,
  isActive: Boolean,
  uploadedBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Frontend Architecture

### Pages
- **Home** - Landing page with overview and navigation
- **Data Portal** - Browse, search, and download datasets
- **Dashboard** - User profile, history, and preferences
- **Admin Dashboard** - Dataset and user management
- **Login/Register** - Authentication pages

### Components
- **Navigation** - Header with theme toggle and user menu
- **Dataset Cards** - Display dataset information
- **Search Filters** - Advanced search functionality
- **Upload Form** - Dataset upload interface
- **Charts** - Data visualization components

## 🛡️ Security Features

- **JWT Authentication** with secure token storage
- **Password Hashing** using bcrypt
- **Input Validation** with Joi schemas
- **CORS Protection** for cross-origin requests
- **Rate Limiting** to prevent abuse
- **File Upload Security** with type and size validation
- **Email Verification** with OTP system

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
npm test

# E2E tests (if configured)
npm run test:e2e
```

## 📦 Deployment

### Environment Variables
Set the following environment variables for production:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secure-jwt-secret
GMAIL_APP_PASSWORD=your-gmail-app-password
FRONTEND_URL=https://your-domain.com
CORS_ORIGIN=https://your-domain.com
```

### Build Commands
```bash
# Build frontend
npm run build

# Start production server
cd backend
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Data Sources** - Government of India statistics and datasets
- **Icons** - Lucide React icon library
- **UI Components** - Shadcn UI component library
- **Styling** - Tailwind CSS framework
- **Charts** - Recharts library for data visualization

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in the `/docs` folder

---

**Made with ❤️ for India's Statistics**

*Empowering data-driven decisions through accessible statistics* 