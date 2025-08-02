const mongoose = require('mongoose');
const Dataset = require('../models/Dataset');
const User = require('../models/User');
require('dotenv').config();

const sampleDatasets = [
  // Demographics Datasets
  {
    title: "Population Census 2021 - Complete Data",
    description: "Comprehensive population data including age distribution, gender ratios, literacy rates, and demographic indicators for all states and union territories of India.",
    category: "demographics",
    subcategory: "population",
    state: "all-india",
    year: 2021,
    source: "Census of India",
    sourceUrl: "https://censusindia.gov.in",
    tags: ["population", "census", "demographics", "2021"],
    metadata: {
      totalRecords: 1400000000,
      updateFrequency: "decennial",
      coverage: "national",
      timeSeries: true,
      timeRange: { start: 1951, end: 2021 }
    },
    dataQuality: "verified"
  },
  {
    title: "State-wise Population Density 2023",
    description: "Population density statistics for all Indian states with area calculations and urban-rural distribution.",
    category: "demographics",
    subcategory: "density",
    state: "all-india",
    year: 2023,
    source: "Ministry of Home Affairs",
    sourceUrl: "https://mha.gov.in",
    tags: ["density", "population", "states"],
    metadata: {
      totalRecords: 28,
      updateFrequency: "yearly",
      coverage: "state"
    },
    dataQuality: "verified"
  },

  // Education Datasets
  {
    title: "Literacy Rates by State 2023",
    description: "Literacy statistics across all states including male-female literacy rates, rural-urban distribution, and educational attainment levels.",
    category: "education",
    subcategory: "literacy",
    state: "all-india",
    year: 2023,
    source: "Ministry of Education",
    sourceUrl: "https://education.gov.in",
    tags: ["literacy", "education", "states"],
    metadata: {
      totalRecords: 28,
      updateFrequency: "yearly",
      coverage: "state"
    },
    dataQuality: "verified"
  },
  {
    title: "School Enrollment Statistics 2023",
    description: "Primary, secondary, and higher secondary school enrollment data with dropout rates and gender-wise distribution.",
    category: "education",
    subcategory: "enrollment",
    state: "maharashtra",
    year: 2023,
    source: "Maharashtra Education Department",
    sourceUrl: "https://maharashtra.gov.in",
    tags: ["enrollment", "schools", "education"],
    metadata: {
      totalRecords: 50000,
      updateFrequency: "quarterly",
      coverage: "state"
    },
    dataQuality: "verified"
  },

  // Economy Datasets
  {
    title: "GDP Growth by State 2023-24",
    description: "Gross Domestic Product growth rates, per capita income, and economic indicators for all Indian states.",
    category: "economy",
    subcategory: "gdp",
    state: "all-india",
    year: 2024,
    source: "Ministry of Statistics and Programme Implementation",
    sourceUrl: "https://mospi.gov.in",
    tags: ["gdp", "economy", "growth"],
    metadata: {
      totalRecords: 28,
      updateFrequency: "quarterly",
      coverage: "state"
    },
    dataQuality: "verified"
  },
  {
    title: "Employment Statistics 2023",
    description: "Employment data including unemployment rates, sector-wise employment, and labor force participation rates.",
    category: "economy",
    subcategory: "employment",
    state: "karnataka",
    year: 2023,
    source: "Karnataka Labor Department",
    sourceUrl: "https://karnataka.gov.in",
    tags: ["employment", "labor", "unemployment"],
    metadata: {
      totalRecords: 15000,
      updateFrequency: "monthly",
      coverage: "state"
    },
    dataQuality: "verified"
  },

  // Healthcare Datasets
  {
    title: "Healthcare Facilities Survey 2023",
    description: "Comprehensive survey of hospitals, clinics, medical colleges, and healthcare infrastructure across states.",
    category: "health",
    subcategory: "facilities",
    state: "delhi",
    year: 2023,
    source: "Delhi Health Department",
    sourceUrl: "https://delhi.gov.in",
    tags: ["healthcare", "hospitals", "facilities"],
    metadata: {
      totalRecords: 2500,
      updateFrequency: "yearly",
      coverage: "state"
    },
    dataQuality: "verified"
  },
  {
    title: "Disease Prevalence Statistics 2023",
    description: "Prevalence of major diseases, vaccination coverage, and public health indicators by state.",
    category: "health",
    subcategory: "diseases",
    state: "kerala",
    year: 2023,
    source: "Kerala Health Department",
    sourceUrl: "https://kerala.gov.in",
    tags: ["diseases", "health", "vaccination"],
    metadata: {
      totalRecords: 8000,
      updateFrequency: "monthly",
      coverage: "state"
    },
    dataQuality: "verified"
  },

  // Agriculture Datasets
  {
    title: "Crop Production Data 2023",
    description: "Agricultural production statistics including crop yields, area under cultivation, and production trends.",
    category: "agriculture",
    subcategory: "production",
    state: "punjab",
    year: 2023,
    source: "Punjab Agriculture Department",
    sourceUrl: "https://punjab.gov.in",
    tags: ["agriculture", "crops", "production"],
    metadata: {
      totalRecords: 12000,
      updateFrequency: "seasonal",
      coverage: "state"
    },
    dataQuality: "verified"
  },
  {
    title: "Land Use Statistics 2023",
    description: "Land use patterns, irrigation coverage, and agricultural land distribution across states.",
    category: "agriculture",
    subcategory: "land-use",
    state: "gujarat",
    year: 2023,
    source: "Gujarat Agriculture Department",
    sourceUrl: "https://gujarat.gov.in",
    tags: ["land-use", "irrigation", "agriculture"],
    metadata: {
      totalRecords: 5000,
      updateFrequency: "yearly",
      coverage: "state"
    },
    dataQuality: "verified"
  },

  // Infrastructure Datasets
  {
    title: "Road Network Statistics 2023",
    description: "Road infrastructure data including highway length, road density, and connectivity statistics.",
    category: "infrastructure",
    subcategory: "roads",
    state: "tamil-nadu",
    year: 2023,
    source: "Tamil Nadu PWD",
    sourceUrl: "https://tamilnadu.gov.in",
    tags: ["roads", "infrastructure", "connectivity"],
    metadata: {
      totalRecords: 3500,
      updateFrequency: "yearly",
      coverage: "state"
    },
    dataQuality: "verified"
  },
  {
    title: "Electricity Coverage Data 2023",
    description: "Electrification statistics including household electrification, power generation, and distribution data.",
    category: "infrastructure",
    subcategory: "electricity",
    state: "andhra-pradesh",
    year: 2023,
    source: "Andhra Pradesh Energy Department",
    sourceUrl: "https://andhrapradesh.gov.in",
    tags: ["electricity", "power", "infrastructure"],
    metadata: {
      totalRecords: 8000,
      updateFrequency: "monthly",
      coverage: "state"
    },
    dataQuality: "verified"
  }
];

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stats-of-india');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedDatasets = async () => {
  try {
    console.log('Starting dataset seeding...');

    // Find or create a default admin user
    let adminUser = await User.findOne({ email: 'admin@statsofindia.com' });
    if (!adminUser) {
      adminUser = new User({
        fullName: 'Admin User',
        email: 'admin@statsofindia.com',
        password: 'Admin123!',
        role: 'admin',
        organization: 'StatsOfIndia'
      });
      await adminUser.save();
      console.log('Created admin user');
    }

    // Clear existing datasets
    await Dataset.deleteMany({});
    console.log('Cleared existing datasets');

    // Create datasets with admin user as creator
    const datasets = sampleDatasets.map(dataset => ({
      ...dataset,
      createdBy: adminUser._id,
      approvedBy: adminUser._id,
      approvedAt: new Date(),
      files: [
        {
          fileName: `${dataset.title.toLowerCase().replace(/\s+/g, '-')}.csv`,
          originalName: `${dataset.title}.csv`,
          fileType: 'csv',
          fileSize: Math.floor(Math.random() * 5000000) + 100000, // 100KB to 5MB
          filePath: `/uploads/datasets/${dataset.title.toLowerCase().replace(/\s+/g, '-')}.csv`,
          mimeType: 'text/csv',
          isActive: true,
          downloadCount: Math.floor(Math.random() * 100)
        },
        {
          fileName: `${dataset.title.toLowerCase().replace(/\s+/g, '-')}.pdf`,
          originalName: `${dataset.title}.pdf`,
          fileType: 'pdf',
          fileSize: Math.floor(Math.random() * 10000000) + 500000, // 500KB to 10MB
          filePath: `/uploads/datasets/${dataset.title.toLowerCase().replace(/\s+/g, '-')}.pdf`,
          mimeType: 'application/pdf',
          isActive: true,
          downloadCount: Math.floor(Math.random() * 50)
        }
      ],
      statistics: {
        downloadCount: Math.floor(Math.random() * 500),
        viewCount: Math.floor(Math.random() * 2000),
        rating: {
          average: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
          count: Math.floor(Math.random() * 100)
        }
      }
    }));

    await Dataset.insertMany(datasets);
    console.log(`Seeded ${datasets.length} datasets successfully`);

    // Create uploads directory if it doesn't exist
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(__dirname, '../uploads/datasets');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('Created uploads directory');
    }

    console.log('Dataset seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Dataset seeding error:', error);
    process.exit(1);
  }
};

// Run seeding
if (require.main === module) {
  connectDB().then(() => {
    seedDatasets();
  });
}

module.exports = { seedDatasets }; 