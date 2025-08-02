# StatsOfIndia 📊

A college project for exploring and analyzing statistics across Indian states and union territories. Built with React, TypeScript, Tailwind CSS, Node.js, Express, and MongoDB.

## 🚀 Features

### Frontend (React + TypeScript)
- **Modern UI/UX** with Tailwind CSS and Radix UI components
- **Dark/Light Theme** toggle with persistent preferences
- **Responsive Design** for all device sizes
- **Interactive Charts** using Recharts library
- **Real-time Data** from MongoDB backend
- **Dynamic Routing** with React Router
- **Type-safe** with TypeScript

### Backend (Node.js + Express + MongoDB)
- **RESTful API** with comprehensive CRUD operations
- **MongoDB Integration** with Mongoose ODM
- **Data Validation** using Joi
- **Rate Limiting** and security features
- **Auto-seeding** of sample data
- **Error Handling** with custom middleware

### Data Categories
- **Demographics** - Population, age distribution, gender ratio
- **Education** - Literacy rates, school enrollments, higher education
- **Economy** - GDP growth, per capita income, employment
- **Health** - Life expectancy, infant mortality, healthcare access
- **Agriculture** - Crop production, farmer statistics, exports

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

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

### 3. Frontend Setup
```bash
cd ..
npm install
```

### 4. Database Setup
Install MongoDB locally or use MongoDB Atlas cloud service.

## 🚀 Running the Application

### Start Backend
```bash
cd backend
npm run dev
```

### Start Frontend
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📊 API Endpoints

### Base URL: `http://localhost:5000/api`

#### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (Protected)

#### Datasets
- `GET /datasets` - Get all datasets
- `GET /datasets/:id` - Get dataset by ID
- `POST /datasets` - Create new dataset (Protected)
- `DELETE /datasets/:id` - Delete dataset (Protected)
- `GET /datasets/categories/:category` - Get datasets by category
- `GET /datasets/states/:state` - Get datasets by state
- `GET /datasets/popular` - Get popular datasets
- `GET /datasets/recent` - Get recent datasets
- `GET /datasets/search` - Search datasets
- `GET /datasets/:id/download/:fileId` - Download dataset file
- `POST /datasets/upload` - Upload dataset file (Protected)

## 🗃️ Database Schema

The project uses MongoDB with the following main collections:
- **Users**: User authentication and profiles
- **Datasets**: Statistical data files and metadata

## 🎨 Frontend Components

### Pages
- **Home** - Landing page with overview
- **Data Portal** - Browse and download datasets
- **Admin Dashboard** - Admin panel for data management

### Features
- **User Authentication** - Login/Register system
- **File Upload** - Upload CSV/PDF datasets
- **Data Management** - Admin dashboard for managing datasets
- **Responsive Design** - Works on all devices

## 🛡️ Security Features

- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API request limiting
- **Input Validation** - Request data validation
- **JWT Authentication** - Secure user authentication

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
npm test
```

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Data Sources** - Government of India statistics
- **Icons** - Lucide React
- **UI Components** - Radix UI
- **Charts** - Recharts
- **Styling** - Tailwind CSS

---

**Made with ❤️ for India's Statistics** 