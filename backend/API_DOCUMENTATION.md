# StatsOfIndia API Documentation

## Overview
The StatsOfIndia API provides comprehensive access to statistical data for all Indian states and union territories across multiple sectors for years 2019-2025.

## Base URL
```
http://localhost:5000/api
```

## Data Structure

### States/Union Territories
- **37 total**: 28 states + 9 union territories
- **Regions**: North, South, East, West, Central, Northeast
- **Data includes**: Population, area, GDP, literacy rate, major cities, etc.

### Sectors/Topics
- **10 sectors**: Agriculture, Education, Healthcare, Infrastructure, Economy, Tourism, Environment, Technology, Public Safety, Manufacturing
- **Each sector has 5 metrics** with realistic data and trends

### Time Range
- **Years**: 2019, 2020, 2021, 2022, 2023, 2024, 2025
- **Data points**: 12,950 total statistics

## Core Endpoints

### 1. Get All Statistics
```
GET /api/statistics
```

**Query Parameters:**
- `state_id` - Filter by state ID
- `topic_id` - Filter by topic/sector ID
- `year` - Filter by year
- `metric_name` - Filter by metric name
- `limit` - Number of results (default: 50)
- `page` - Page number (default: 1)
- `sortBy` - Sort field (default: 'year')
- `sortOrder` - Sort order: 'asc' or 'desc' (default: 'desc')

**Example:**
```bash
GET /api/statistics?state_id=maharashtra&topic_id=education&year=2023&limit=10
```

### 2. Get Comprehensive Data for State and Sector
```
GET /api/statistics/comprehensive/:stateId/:topicId
```

**Parameters:**
- `stateId` - State/UT ID (e.g., 'maharashtra', 'delhi')
- `topicId` - Topic/Sector ID (e.g., 'education', 'healthcare')

**Query Parameters:**
- `startYear` - Start year (default: 2019)
- `endYear` - End year (default: 2025)

**Example:**
```bash
GET /api/statistics/comprehensive/maharashtra/education?startYear=2020&endYear=2024
```

**Response:**
```json
{
  "success": true,
  "state": {
    "name": "Maharashtra",
    "region": "West",
    "capital": "Mumbai"
  },
  "topic": {
    "name": "Education",
    "icon": "📚",
    "category": "Human Development"
  },
  "years": [2020, 2021, 2022, 2023, 2024],
  "metrics": [
    {
      "metric": "Literacy Rate",
      "unit": "%",
      "data": {
        "2020": { "value": 82.5, "confidence": 92, "isEstimated": false },
        "2021": { "value": 83.1, "confidence": 91, "isEstimated": false },
        "2022": { "value": 83.7, "confidence": 90, "isEstimated": false },
        "2023": { "value": 84.2, "confidence": 89, "isEstimated": false },
        "2024": { "value": 84.8, "confidence": 88, "isEstimated": true }
      }
    }
  ]
}
```

### 3. Get Sector Overview Across All States
```
GET /api/statistics/sector-overview/:topicId
```

**Parameters:**
- `topicId` - Topic/Sector ID

**Query Parameters:**
- `year` - Year for data (default: 2023)

**Example:**
```bash
GET /api/statistics/sector-overview/healthcare?year=2023
```

**Response:**
```json
{
  "success": true,
  "topic": {
    "name": "Healthcare",
    "icon": "🏥",
    "category": "Human Development"
  },
  "year": 2023,
  "states": [
    {
      "state": {
        "name": "Maharashtra",
        "region": "West",
        "capital": "Mumbai"
      },
      "metrics": {
        "Hospital Beds": { "value": 125000, "unit": "beds", "confidence": 88 },
        "Doctor-Patient Ratio": { "value": 0.0012, "unit": "ratio", "confidence": 85 }
      }
    }
  ]
}
```

### 4. Get State Dashboard (All Sectors)
```
GET /api/statistics/state-dashboard/:stateId
```

**Parameters:**
- `stateId` - State/UT ID

**Query Parameters:**
- `year` - Year for data (default: 2023)

**Example:**
```bash
GET /api/statistics/state-dashboard/karnataka?year=2023
```

### 5. Get Available Years
```
GET /api/statistics/years
```

**Response:**
```json
{
  "success": true,
  "years": [2019, 2020, 2021, 2022, 2023, 2024, 2025]
}
```

### 6. Get Metrics for a Topic
```
GET /api/statistics/metrics/:topicId
```

**Example:**
```bash
GET /api/statistics/metrics/agriculture
```

**Response:**
```json
{
  "success": true,
  "topicId": "agriculture",
  "metrics": [
    "Agricultural GDP",
    "Crop Production",
    "Farmer Income",
    "Irrigation Coverage",
    "Land Holdings"
  ]
}
```

## State and Topic Endpoints

### Get All States
```
GET /api/states
```

### Get State by ID
```
GET /api/states/:id
```

### Get All Topics/Sectors
```
GET /api/topics
```

### Get Topic by ID
```
GET /api/topics/:id
```

## Data Categories

### 1. Agriculture 🌾
- Crop Production (tons)
- Agricultural GDP (₹ crore)
- Irrigation Coverage (hectares)
- Farmer Income (₹)
- Land Holdings (hectares)

### 2. Education 📚
- Literacy Rate (%)
- School Enrollment (students)
- Teacher-Student Ratio (ratio)
- Higher Education (students)
- Digital Literacy (%)

### 3. Healthcare 🏥
- Hospital Beds (beds)
- Doctor-Patient Ratio (ratio)
- Life Expectancy (years)
- Infant Mortality (per 1000)
- Healthcare Spending (₹ crore)

### 4. Infrastructure 🏗️
- Road Length (km)
- Electricity Coverage (%)
- Internet Penetration (%)
- Railway Network (km)
- Airports (count)

### 5. Economy 💰
- GDP Growth (%)
- Per Capita Income (₹)
- Employment Rate (%)
- Industrial Output (₹ crore)
- Foreign Investment (₹ crore)

### 6. Tourism 🏛️
- Tourist Arrivals (visitors)
- Hotel Rooms (rooms)
- Heritage Sites (sites)
- Tourism Revenue (₹ crore)
- Employment in Tourism (people)

### 7. Environment 🌿
- Forest Cover (sq km)
- Air Quality Index (AQI)
- Waste Management (%)
- Renewable Energy (MW)
- Water Quality (index)

### 8. Technology 💻
- Digital Literacy (%)
- IT Companies (companies)
- Startup Ecosystem (startups)
- E-Governance (%)
- Mobile Penetration (%)

### 9. Public Safety 🛡️
- Crime Rate (per 100000)
- Police Personnel (personnel)
- Road Accidents (accidents)
- Fire Stations (stations)
- Emergency Response (%)

### 10. Manufacturing 🏭
- Industrial Output (₹ crore)
- Factory Count (factories)
- Employment in Manufacturing (people)
- Export Value (₹ crore)
- Investment (₹ crore)

## State IDs Reference

### Major States
- `andhra-pradesh`, `arunachal-pradesh`, `assam`, `bihar`, `chhattisgarh`
- `goa`, `gujarat`, `haryana`, `himachal-pradesh`, `jharkhand`
- `karnataka`, `kerala`, `madhya-pradesh`, `maharashtra`, `manipur`
- `meghalaya`, `mizoram`, `nagaland`, `odisha`, `punjab`
- `rajasthan`, `sikkim`, `tamil-nadu`, `telangana`, `tripura`
- `uttar-pradesh`, `uttarakhand`, `west-bengal`

### Union Territories
- `andaman-nicobar`, `chandigarh`, `dadra-nagar-haveli`, `daman-diu`
- `delhi`, `jammu-kashmir`, `ladakh`, `lakshadweep`, `puducherry`

## Topic IDs Reference
- `agriculture`, `education`, `healthcare`, `infrastructure`
- `economy`, `tourism`, `environment`, `technology`
- `public-safety`, `manufacturing`

## Usage Examples

### 1. Get Education Data for Maharashtra (2020-2024)
```bash
curl "http://localhost:5000/api/statistics/comprehensive/maharashtra/education?startYear=2020&endYear=2024"
```

### 2. Compare Healthcare Across All States (2023)
```bash
curl "http://localhost:5000/api/statistics/sector-overview/healthcare?year=2023"
```

### 3. Get Karnataka's Complete Dashboard (2023)
```bash
curl "http://localhost:5000/api/statistics/state-dashboard/karnataka?year=2023"
```

### 4. Get Top 10 States by GDP Growth (2023)
```bash
curl "http://localhost:5000/api/statistics/top-performers/economy/GDP%20Growth?year=2023&limit=10"
```

### 5. Get Trend Data for Delhi's Infrastructure (2019-2025)
```bash
curl "http://localhost:5000/api/statistics/trend/delhi/infrastructure/Road%20Length?startYear=2019&endYear=2025"
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

Common HTTP Status Codes:
- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Data Quality Notes

- **Historical Data (2019-2023)**: Based on realistic government statistics
- **Projected Data (2024-2025)**: Estimated based on trends and growth patterns
- **Confidence Levels**: Range from 85-100% for historical data, 70-85% for projections
- **Data Sources**: Government of India Statistical Yearbook (simulated) 