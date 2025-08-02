# StatsOfIndia Backend API

A comprehensive REST API backend for the StatsOfIndia application built with Node.js, Express, and MongoDB.

## 🚀 Features

- **RESTful API** with comprehensive CRUD operations
- **MongoDB Integration** with Mongoose ODM
- **Data Validation** using Joi
- **Error Handling** with custom middleware
- **Rate Limiting** for API protection
- **CORS Support** for frontend integration
- **Security** with Helmet middleware
- **Logging** with Morgan
- **Compression** for better performance
- **Auto-seeding** of sample data

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🛠️ Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/stats-of-india
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start the server:**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## 🗄️ Database Setup

### Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The database will be created automatically when the server starts

### MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a cluster
3. Get your connection string
4. Update `MONGODB_URI_PROD` in your `.env` file

## 📊 API Endpoints

### States
- `GET /api/states` - Get all states with filtering
- `GET /api/states/:id` - Get state by ID
- `GET /api/states/region/:region` - Get states by region
- `GET /api/states/top/population` - Get top states by population
- `GET /api/states/top/area` - Get top states by area
- `GET /api/states/union-territories` - Get all union territories
- `POST /api/states` - Create new state
- `PUT /api/states/:id` - Update state
- `DELETE /api/states/:id` - Delete state

### Topics
- `GET /api/topics` - Get all topics
- `GET /api/topics/:id` - Get topic by ID
- `GET /api/topics/category/:category` - Get topics by category

### Statistics
- `GET /api/statistics` - Get all statistics with filtering and pagination
- `GET /api/statistics/latest/:topicId` - Get latest statistics for a topic
- `GET /api/statistics/top-performers/:topicId/:metricName` - Get top performers
- `GET /api/statistics/trend/:stateId/:topicId/:metricName` - Get trend data
- `GET /api/statistics/national-average/:topicId/:metricName` - Get national average
- `GET /api/statistics/compare/:topicId/:metricName` - Compare states
- `GET /api/statistics/state/:stateId` - Get statistics for a state
- `POST /api/statistics` - Create new statistic
- `PUT /api/statistics/:id` - Update statistic
- `DELETE /api/statistics/:id` - Delete statistic

### Fun Facts
- `GET /api/fun-facts` - Get all fun facts
- `GET /api/fun-facts/featured` - Get featured fun facts
- `GET /api/fun-facts/random` - Get random fun fact
- `GET /api/fun-facts/topic/:topicId` - Get fun facts by topic

### Comparisons
- `GET /api/comparisons/:topicId/:metricName` - Compare states for a metric

### Trends
- `GET /api/trends/:stateId/:topicId/:metricName` - Get trend data

## 🔧 Query Parameters

### States
- `region` - Filter by region (North, South, East, West, Central, Northeast)
- `isUT` - Filter by type (true for Union Territories, false for States)
- `sortBy` - Sort field (name, population, area, etc.)
- `sortOrder` - Sort order (asc, desc)
- `limit` - Limit number of results
- `search` - Search in name, capital, or region

### Statistics
- `state_id` - Filter by state ID
- `topic_id` - Filter by topic ID
- `year` - Filter by year
- `metric_name` - Filter by metric name
- `limit` - Limit number of results (default: 50)
- `page` - Page number for pagination (default: 1)
- `sortBy` - Sort field (default: year)
- `sortOrder` - Sort order (default: desc)

### Fun Facts
- `topic_id` - Filter by topic ID
- `category` - Filter by category
- `featured` - Filter featured facts only
- `limit` - Limit number of results (default: 20)

## 📝 Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "count": 10,
  "data": [...],
  "message": "Optional message"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

## 🗃️ Database Schema

### State
```javascript
{
  id: String (unique),
  name: String,
  isUT: Boolean,
  population: Number,
  area: Number,
  capital: String,
  region: String,
  established: Number,
  coordinates: { latitude: Number, longitude: Number },
  description: String,
  officialLanguage: String,
  majorCities: [String],
  gdp: Number,
  literacyRate: Number
}
```

### Topic
```javascript
{
  id: String (unique),
  name: String,
  icon: String,
  description: String,
  metrics: [String],
  color: String,
  category: String,
  isActive: Boolean,
  displayOrder: Number,
  dataSource: String,
  lastUpdated: Date,
  metadata: {
    totalStates: Number,
    dataPoints: Number,
    timeRange: { startYear: Number, endYear: Number }
  }
}
```

### Statistic
```javascript
{
  id: String (unique),
  state_id: String (ref: State),
  topic_id: String (ref: Topic),
  year: Number,
  value: Number,
  metric_name: String,
  unit: String,
  source: String,
  notes: String,
  confidence: Number,
  methodology: String,
  dataQuality: String,
  isEstimated: Boolean,
  previousValue: Number,
  changeFromPrevious: Number,
  changePercentage: Number
}
```

### FunFact
```javascript
{
  id: String (unique),
  topic_id: String (ref: Topic),
  fact_text: String,
  source: String,
  year: Number,
  is_featured: Boolean,
  category: String,
  tags: [String],
  relatedStates: [String],
  imageUrl: String,
  isActive: Boolean,
  displayOrder: Number
}
```

## 🔒 Security Features

- **Helmet** - Security headers
- **Rate Limiting** - API request limiting
- **CORS** - Cross-origin resource sharing
- **Input Validation** - Request data validation
- **Error Handling** - Comprehensive error management

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📈 Performance

- **Database Indexing** - Optimized queries with proper indexes
- **Compression** - Response compression for faster loading
- **Pagination** - Large dataset handling
- **Caching** - Ready for Redis integration

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI_PROD=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/stats-of-india
JWT_SECRET=your-jwt-secret-key-change-this-in-production
CORS_ORIGIN=https://your-frontend-domain.com
```

### PM2 (Recommended)
```bash
npm install -g pm2
pm2 start server.js --name "stats-of-india-api"
pm2 save
pm2 startup
```

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation at `/api` endpoint 