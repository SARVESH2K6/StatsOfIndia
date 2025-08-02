const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import models
const Dataset = require('../models/Dataset');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stats-of-india')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create sample CSV files
const createSampleCSV = (filename, data) => {
  const uploadsDir = path.join(__dirname, '..', 'uploads', 'csv-files');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, data);
  return filePath;
};

// Sample datasets
const sampleDatasets = [
  {
    title: "Population Census 2021 - Maharashtra",
    description: "Complete population data for Maharashtra state including demographics, literacy rates, and household information.",
    category: "demographics",
    state: "maharashtra",
    year: 2021,
    source: "Census of India",
    sourceUrl: "https://censusindia.gov.in",
    tags: ["population", "census", "demographics", "maharashtra"],
    isPublic: true,
    isActive: true,
    dataQuality: "verified",
    statistics: {
      downloadCount: 45,
      viewCount: 120,
      rating: { average: 4.5, count: 12 }
    },
    metadata: {
      fileSize: 1024000,
      recordCount: 5000,
      lastUpdated: new Date()
    }
  },
  {
    title: "GDP Growth Rate - All India (2019-2023)",
    description: "Annual GDP growth rates and economic indicators for all states and union territories.",
    category: "economy",
    state: "all-india",
    year: 2023,
    source: "Ministry of Statistics and Programme Implementation",
    sourceUrl: "https://mospi.gov.in",
    tags: ["gdp", "economy", "growth", "national"],
    isPublic: true,
    isActive: true,
    dataQuality: "verified",
    statistics: {
      downloadCount: 78,
      viewCount: 234,
      rating: { average: 4.8, count: 25 }
    },
    metadata: {
      fileSize: 2048000,
      recordCount: 8000,
      lastUpdated: new Date()
    }
  },
  {
    title: "Education Statistics - Delhi 2022",
    description: "Educational institutions, enrollment rates, and literacy statistics for Delhi.",
    category: "education",
    state: "delhi",
    year: 2022,
    source: "Ministry of Education",
    sourceUrl: "https://education.gov.in",
    tags: ["education", "literacy", "schools", "delhi"],
    isPublic: true,
    isActive: true,
    dataQuality: "verified",
    statistics: {
      downloadCount: 32,
      viewCount: 89,
      rating: { average: 4.2, count: 8 }
    },
    metadata: {
      fileSize: 512000,
      recordCount: 2000,
      lastUpdated: new Date()
    }
  }
];

// Sample CSV data
const sampleCSVData = {
  population: `State,District,Population,Male,Female,Literacy_Rate,Households
Maharashtra,Mumbai,12442373,6521896,5920477,89.21,2845000
Maharashtra,Pune,9426941,4852341,4574600,87.19,2100000
Maharashtra,Nagpur,4977779,2545678,2432101,88.39,1150000
Maharashtra,Thane,11060148,5723456,5336692,85.56,2450000
Maharashtra,Nashik,6107187,3156789,2950398,82.31,1350000
Maharashtra,Aurangabad,3701282,1923456,1777826,79.85,820000
Maharashtra,Solapur,4317756,2234567,2083189,77.72,950000
Maharashtra,Kolhapur,3876001,1987654,1888347,81.77,860000
Maharashtra,Sangli,2822143,1456789,1365354,78.92,625000
Maharashtra,Satara,3003914,1545678,1458236,80.12,665000`,

  economy: `Year,State,GDP_Growth_Rate,Per_Capita_Income,Unemployment_Rate,Inflation_Rate
2023,All India,7.2,185000,6.1,5.8
2023,Maharashtra,8.1,225000,5.2,5.5
2023,Delhi,7.8,285000,4.8,5.2
2023,Karnataka,7.5,198000,5.5,5.7
2023,Tamil Nadu,7.3,175000,6.2,5.9
2023,Gujarat,8.3,195000,4.9,5.4
2023,Telangana,7.7,185000,5.8,5.6
2023,Andhra Pradesh,7.1,165000,6.5,6.1
2023,Kerala,6.9,185000,7.2,6.3
2023,Punjab,6.8,175000,6.8,6.0`,

  education: `District,Total_Schools,Primary_Schools,Secondary_Schools,Enrollment_Rate,Literacy_Rate
Central Delhi,245,89,156,94.2,89.5
North Delhi,312,134,178,92.8,87.3
South Delhi,298,112,186,95.1,91.2
East Delhi,267,98,169,91.7,85.9
West Delhi,289,123,166,93.4,88.7
North West Delhi,334,145,189,92.1,86.4
South West Delhi,301,118,183,94.8,90.1
New Delhi,156,67,89,96.3,93.8
Shahdara,278,105,173,90.5,84.2
Dwarka,245,98,147,93.7,89.6`
};

async function createSampleData() {
  try {
    console.log('Creating sample datasets...');

    // Create or find an admin user
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      adminUser = new User({
        fullName: 'Admin User',
        email: 'admin@statsofindia.com',
        password: 'admin123',
        role: 'admin',
        isActive: true
      });
      await adminUser.save();
      console.log('Created admin user');
    }

    for (let i = 0; i < sampleDatasets.length; i++) {
      const dataset = sampleDatasets[i];
      
      // Create CSV file
      let csvData, fileName;
      if (dataset.category === 'demographics') {
        csvData = sampleCSVData.population;
        fileName = 'population_maharashtra_2021.csv';
      } else if (dataset.category === 'economy') {
        csvData = sampleCSVData.economy;
        fileName = 'gdp_growth_all_india_2023.csv';
      } else {
        csvData = sampleCSVData.education;
        fileName = 'education_delhi_2022.csv';
      }

      const filePath = createSampleCSV(fileName, csvData);
      
      // Create dataset with file
      const newDataset = new Dataset({
        ...dataset,
        createdBy: adminUser._id,
        files: [{
          originalName: fileName,
          fileName: fileName,
          filePath: path.relative(path.join(__dirname, '..'), filePath),
          fileType: 'csv',
          fileSize: fs.statSync(filePath).size,
          mimeType: 'text/csv',
          uploadedAt: new Date(),
          isActive: true,
          downloadCount: 0
        }]
      });

      await newDataset.save();
      console.log(`Created dataset: ${dataset.title}`);
    }

    console.log('Sample data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating sample data:', error);
    process.exit(1);
  }
}

createSampleData(); 