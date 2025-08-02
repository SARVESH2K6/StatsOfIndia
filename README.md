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
- **Crime & Safety** - Crime rates, safety indices, law enforcement
- **Education** - Literacy rates, school enrollments, higher education
- **Tourism** - Tourist arrivals, revenue, heritage sites
- **Agriculture** - Crop production, farmer statistics, exports
- **Health** - Life expectancy, infant mortality, healthcare access
- **Economy** - GDP growth, per capita income, employment

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

#### States
- `GET /states` - Get all states with filtering
- `GET /states/:id` - Get state by ID
- `GET /states/region/:region` - Get states by region
- `GET /states/top/population` - Get top states by population
- `GET /states/top/area` - Get top states by area
- `GET /states/union-territories` - Get all union territories

#### Topics
- `GET /topics` - Get all topics
- `GET /topics/:id` - Get topic by ID
- `GET /topics/category/:category` - Get topics by category

#### Statistics
- `GET /statistics` - Get all statistics with filtering and pagination
- `GET /statistics/latest/:topicId` - Get latest statistics for a topic
- `GET /statistics/top-performers/:topicId/:metricName` - Get top performers
- `GET /statistics/trend/:stateId/:topicId/:metricName` - Get trend data
- `GET /statistics/national-average/:topicId/:metricName` - Get national average
- `GET /statistics/compare/:topicId/:metricName` - Compare states
- `GET /statistics/state/:stateId` - Get statistics for a state

#### Fun Facts
- `GET /fun-facts` - Get all fun facts
- `GET /fun-facts/featured` - Get featured fun facts
- `GET /fun-facts/random` - Get random fun fact
- `GET /fun-facts/topic/:topicId` - Get fun facts by topic

## 🗃️ Database Schema

The project uses MongoDB with the following main collections:
- **States**: State and union territory information
- **Topics**: Different categories of statistics
- **Statistics**: Actual data values
- **FunFacts**: Interesting facts about states

## 🎨 Frontend Components

### Pages
- **Home** - Landing page with overview
- **Statistics** - Detailed statistics with charts
- **Comparison** - Compare states across metrics
- **Admin Dashboard** - Admin panel for data management

### Features
- **Theme Toggle** - Dark/light mode
- **Interactive Charts** - Data visualizations
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