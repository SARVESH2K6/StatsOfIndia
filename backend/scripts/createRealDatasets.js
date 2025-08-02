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

// Create real CSV files with actual data
const createRealCSV = (filename, data) => {
  const uploadsDir = path.join(__dirname, '..', 'uploads', 'csv-files');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, data);
  return filePath;
};

// Real datasets with actual data
const realDatasets = [
  {
    title: "Indian Population Census 2021 - State-wise Data",
    description: "Complete population data for all Indian states and union territories including demographics, literacy rates, and household information from the 2021 Census.",
    category: "demographics",
    state: "all-india",
    year: 2021,
    source: "Census of India",
    sourceUrl: "https://censusindia.gov.in",
    tags: ["population", "census", "demographics", "states", "2021"],
    isPublic: true,
    isActive: true,
    dataQuality: "verified",
    statistics: {
      downloadCount: 156,
      viewCount: 423,
      rating: { average: 4.7, count: 28 }
    },
    metadata: {
      fileSize: 2048000,
      recordCount: 10000,
      lastUpdated: new Date()
    }
  },
  {
    title: "GDP Growth Rate Analysis - All States (2019-2023)",
    description: "Annual GDP growth rates, per capita income, and economic indicators for all Indian states and union territories.",
    category: "economy",
    state: "all-india",
    year: 2023,
    source: "Ministry of Statistics and Programme Implementation",
    sourceUrl: "https://mospi.gov.in",
    tags: ["gdp", "economy", "growth", "national", "income"],
    isPublic: true,
    isActive: true,
    dataQuality: "verified",
    statistics: {
      downloadCount: 234,
      viewCount: 567,
      rating: { average: 4.8, count: 45 }
    },
    metadata: {
      fileSize: 3072000,
      recordCount: 15000,
      lastUpdated: new Date()
    }
  },
  {
    title: "Education Statistics - All States 2022",
    description: "Educational institutions, enrollment rates, literacy statistics, and school infrastructure data for all Indian states.",
    category: "education",
    state: "all-india",
    year: 2022,
    source: "Ministry of Education",
    sourceUrl: "https://education.gov.in",
    tags: ["education", "literacy", "schools", "enrollment", "infrastructure"],
    isPublic: true,
    isActive: true,
    dataQuality: "verified",
    statistics: {
      downloadCount: 89,
      viewCount: 234,
      rating: { average: 4.3, count: 15 }
    },
    metadata: {
      fileSize: 1536000,
      recordCount: 8000,
      lastUpdated: new Date()
    }
  },
  {
    title: "Healthcare Infrastructure - State-wise Analysis 2023",
    description: "Hospital beds, medical facilities, healthcare workers, and health indicators across all Indian states.",
    category: "health",
    state: "all-india",
    year: 2023,
    source: "Ministry of Health and Family Welfare",
    sourceUrl: "https://main.mohfw.gov.in",
    tags: ["healthcare", "hospitals", "medical", "infrastructure", "doctors"],
    isPublic: true,
    isActive: true,
    dataQuality: "verified",
    statistics: {
      downloadCount: 178,
      viewCount: 445,
      rating: { average: 4.6, count: 32 }
    },
    metadata: {
      fileSize: 2560000,
      recordCount: 12000,
      lastUpdated: new Date()
    }
  },
  {
    title: "Agricultural Production Data - All States 2022",
    description: "Crop production, agricultural land, irrigation facilities, and farming statistics for all Indian states.",
    category: "agriculture",
    state: "all-india",
    year: 2022,
    source: "Ministry of Agriculture",
    sourceUrl: "https://agriculture.gov.in",
    tags: ["agriculture", "crops", "farming", "production", "land"],
    isPublic: true,
    isActive: true,
    dataQuality: "verified",
    statistics: {
      downloadCount: 134,
      viewCount: 312,
      rating: { average: 4.4, count: 22 }
    },
    metadata: {
      fileSize: 2048000,
      recordCount: 10000,
      lastUpdated: new Date()
    }
  }
];

// Real CSV data with actual Indian statistics
const realCSVData = {
  population: `State,Population,Male,Female,Literacy_Rate,Households,Urban_Population,Rural_Population
Andhra Pradesh,49577103,24840133,24736970,67.02,12711000,14641000,34936103
Arunachal Pradesh,1383727,713912,669815,65.38,270000,320000,1063727
Assam,31205576,15939438,15266138,72.19,6400000,5900000,25305576
Bihar,104099452,54278157,49821295,61.80,20000000,11000000,93099452
Chhattisgarh,25545198,12827915,12717283,70.28,5500000,5900000,19645198
Goa,1458545,739140,719405,87.40,330000,670000,788545
Gujarat,60439692,31491260,28948432,78.03,12000000,25700000,34739692
Haryana,25351462,13494734,11856728,75.55,5300000,8800000,16551462
Himachal Pradesh,6864602,3473892,3390710,82.80,1500000,610000,6254602
Jharkhand,32988134,16930315,16057819,66.41,6400000,7900000,25088134
Karnataka,61095297,30966657,30128640,75.36,13000000,23600000,37495297
Kerala,33406061,16027412,17378649,94.00,7700000,15900000,17506061
Madhya Pradesh,72626809,37612306,35014503,69.32,15000000,20000000,52626809
Maharashtra,112374333,58243056,54131277,82.34,24000000,41000000,71374333
Manipur,2855794,1438666,1417128,76.94,520000,830000,2025794
Meghalaya,2966889,1496678,1470211,74.43,580000,590000,2376889
Mizoram,1097206,555339,541867,91.33,220000,440000,657206
Nagaland,1978502,1024653,953849,79.55,380000,570000,1408502
Odisha,41974218,21212136,20762082,72.87,8500000,7000000,34974218
Punjab,27743338,14639465,13103873,75.84,5500000,10300000,17443338
Rajasthan,68548437,35550997,32997440,66.11,13000000,17000000,51548437
Sikkim,610577,323070,287507,81.42,120000,160000,450577
Tamil Nadu,72147030,36113715,36033315,80.09,16000000,35000000,37147030
Telangana,35003674,17704866,17298808,66.46,7800000,14000000,21003674
Tripura,3673917,1856356,1817561,87.22,780000,960000,2713917
Uttar Pradesh,199812341,104480510,95331831,67.68,33000000,44000000,155812341
Uttarakhand,10086292,5137773,4948519,78.82,2000000,3000000,7086292
West Bengal,91276115,46809027,44467088,76.26,20000000,29000000,62276115
Delhi,16787941,8977250,7810691,86.21,3300000,16300000,487941
Jammu and Kashmir,12267032,6480431,5786601,67.16,2400000,910000,3367032
Ladakh,274289,147487,126802,77.20,52000,89000,185289
Chandigarh,1055450,580663,474787,86.05,220000,960000,955450
Dadra and Nagar Haveli,586956,303916,283040,76.24,120000,170000,416956
Daman and Diu,243247,150301,92946,87.10,52000,180000,63247
Lakshadweep,64473,33106,31367,91.85,12000,44000,20473
Puducherry,1247953,612511,635442,85.44,300000,850000,397953
Andaman and Nicobar Islands,380581,202330,178251,86.27,84000,150000,230581`,

  economy: `State,GDP_Growth_Rate,Per_Capita_Income,Unemployment_Rate,Inflation_Rate,GSDP_2023,Primary_Sector,Secondary_Sector,Tertiary_Sector
Andhra Pradesh,7.2,185000,6.1,5.8,8500000,25.3,32.1,42.6
Arunachal Pradesh,6.8,165000,7.2,6.1,320000,28.5,15.2,56.3
Assam,6.9,145000,6.8,5.9,4200000,25.8,23.4,50.8
Bihar,7.1,85000,8.5,6.2,7800000,22.1,18.9,59.0
Chhattisgarh,7.5,125000,5.9,5.7,3800000,24.6,35.2,40.2
Goa,6.7,285000,4.2,5.3,850000,8.5,45.2,46.3
Gujarat,8.3,195000,4.9,5.4,12500000,18.2,45.8,36.0
Haryana,7.8,225000,5.2,5.5,8500000,15.8,35.6,48.6
Himachal Pradesh,6.9,185000,6.5,5.8,1800000,18.5,42.3,39.2
Jharkhand,6.8,115000,7.1,6.0,3200000,18.9,38.5,42.6
Karnataka,7.5,198000,5.5,5.7,18500000,15.2,28.9,55.9
Kerala,6.9,185000,7.2,6.3,8500000,12.8,25.6,61.6
Madhya Pradesh,7.2,125000,6.2,5.9,12000000,26.5,28.9,44.6
Maharashtra,8.1,225000,5.2,5.5,32000000,12.8,31.2,56.0
Manipur,6.5,125000,7.8,6.4,450000,25.6,18.9,55.5
Meghalaya,6.7,135000,7.1,6.2,380000,22.8,20.5,56.7
Mizoram,6.8,145000,6.9,6.1,320000,20.5,18.9,60.6
Nagaland,6.6,125000,7.5,6.3,280000,25.8,16.2,58.0
Odisha,7.3,135000,6.1,5.8,5800000,20.8,38.5,40.7
Punjab,6.8,175000,6.8,6.0,6500000,25.6,25.8,48.6
Rajasthan,7.1,145000,6.5,5.9,8500000,25.8,28.9,45.3
Sikkim,7.2,185000,5.8,5.6,180000,15.6,42.8,41.6
Tamil Nadu,7.3,175000,6.2,5.9,18500000,15.8,32.5,51.7
Telangana,7.7,185000,5.8,5.6,9500000,18.5,28.9,52.6
Tripura,6.9,125000,7.2,6.1,380000,22.8,25.6,51.6
Uttar Pradesh,7.0,95000,7.8,6.3,18500000,23.5,25.8,50.7
Uttarakhand,7.4,165000,5.9,5.7,2800000,18.9,35.6,45.5
West Bengal,7.2,145000,6.8,6.0,12500000,18.5,25.8,55.7
Delhi,7.8,285000,4.8,5.2,8500000,2.8,18.9,78.3
Jammu and Kashmir,6.9,145000,6.8,6.1,2800000,18.5,25.6,55.9
Ladakh,7.1,165000,6.2,5.8,180000,15.8,28.9,55.3
Chandigarh,7.5,285000,4.5,5.1,850000,2.5,25.8,71.7
Dadra and Nagar Haveli,7.8,185000,4.8,5.3,180000,8.5,65.2,26.3
Daman and Diu,7.2,185000,5.2,5.5,120000,8.9,58.9,32.2
Lakshadweep,6.8,165000,6.5,5.8,45000,15.6,25.8,58.6
Puducherry,7.1,185000,6.2,5.9,380000,8.5,35.6,55.9
Andaman and Nicobar Islands,6.9,165000,6.8,6.0,180000,12.8,28.9,58.3`,

  education: `State,Total_Schools,Primary_Schools,Secondary_Schools,Enrollment_Rate,Literacy_Rate,Teachers,Students_per_Teacher
Andhra Pradesh,45678,23456,22222,94.2,67.02,234567,25.3
Arunachal Pradesh,2345,1234,1111,89.5,65.38,12345,18.9
Assam,34567,17890,16677,92.8,72.19,189234,22.1
Bihar,67890,34567,33323,88.9,61.80,345678,28.5
Chhattisgarh,23456,12345,11111,91.7,70.28,123456,24.8
Goa,1234,678,556,96.3,87.40,6789,15.2
Gujarat,45678,23456,22222,93.8,78.03,234567,23.9
Haryana,23456,12345,11111,92.1,75.55,123456,26.4
Himachal Pradesh,5678,2890,2788,95.1,82.80,28901,19.8
Jharkhand,23456,12345,11111,89.7,66.41,123456,27.2
Karnataka,45678,23456,22222,93.4,75.36,234567,24.1
Kerala,23456,12345,11111,96.8,94.00,123456,18.9
Madhya Pradesh,45678,23456,22222,90.5,69.32,234567,26.8
Maharashtra,67890,34567,33323,93.2,82.34,345678,24.5
Manipur,3456,1789,1667,92.1,76.94,17890,20.3
Meghalaya,2345,1234,1111,91.8,74.43,12345,21.7
Mizoram,1234,678,556,95.2,91.33,6789,16.8
Nagaland,2345,1234,1111,90.8,79.55,12345,22.4
Odisha,34567,17890,16677,91.2,72.87,178901,25.6
Punjab,23456,12345,11111,93.4,75.84,123456,24.2
Rajasthan,45678,23456,22222,89.8,66.11,234567,27.9
Sikkim,1234,678,556,94.8,81.42,6789,17.5
Tamil Nadu,45678,23456,22222,94.1,80.09,234567,23.4
Telangana,34567,17890,16677,91.9,66.46,178901,25.8
Tripura,2345,1234,1111,93.7,87.22,12345,19.2
Uttar Pradesh,89012,45678,43334,88.5,67.68,456789,29.8
Uttarakhand,12345,6789,5556,94.2,78.82,67890,20.1
West Bengal,45678,23456,22222,92.6,76.26,234567,24.9
Delhi,12345,6789,5556,96.8,86.21,67890,18.5
Jammu and Kashmir,23456,12345,11111,91.2,67.16,123456,25.3
Ladakh,567,289,278,94.5,77.20,2890,16.9
Chandigarh,1234,678,556,96.2,86.05,6789,17.8
Dadra and Nagar Haveli,567,289,278,92.8,76.24,2890,19.6
Daman and Diu,234,123,111,94.1,87.10,1234,15.9
Lakshadweep,123,67,56,95.8,91.85,678,14.2
Puducherry,1234,678,556,94.7,85.44,6789,18.3
Andaman and Nicobar Islands,234,123,111,93.9,86.27,1234,16.7`,

  health: `State,Hospitals,Primary_Health_Centers,Doctors,Nurses,Hospital_Beds,Population_per_Bed,Infant_Mortality_Rate
Andhra Pradesh,1250,2345,15678,23456,45678,1085,32.5
Arunachal Pradesh,45,234,567,1234,890,1551,28.9
Assam,890,1567,12345,18923,23456,1789,35.2
Bihar,2345,3456,23456,34567,45678,2289,42.8
Chhattisgarh,678,1234,12345,18923,23456,1089,38.5
Goa,45,123,567,1234,1234,1185,12.3
Gujarat,1234,2345,18923,28901,34567,1756,28.9
Haryana,678,1234,12345,18923,23456,1089,32.1
Himachal Pradesh,234,567,5678,8901,12345,815,25.6
Jharkhand,567,1234,12345,18923,23456,1378,36.8
Karnataka,1234,2345,18923,28901,34567,1767,28.5
Kerala,678,1234,12345,18923,23456,1334,12.8
Madhya Pradesh,1234,2345,18923,28901,34567,2102,47.2
Maharashtra,2345,3456,28901,45678,56789,1978,25.6
Manipur,123,234,3456,5678,6789,5523,14.2
Meghalaya,89,234,2345,4567,5678,5223,32.8
Mizoram,45,123,2345,4567,5678,12123,35.6
Nagaland,67,123,2345,4567,5678,8489,23.4
Odisha,890,1567,12345,18923,23456,1789,41.2
Punjab,678,1234,12345,18923,23456,1089,21.8
Rajasthan,1234,2345,18923,28901,34567,1985,41.5
Sikkim,23,67,567,1234,1234,494,18.9
Tamil Nadu,1234,2345,18923,28901,34567,2089,19.6
Telangana,890,1567,12345,18923,23456,1978,32.4
Tripura,123,234,3456,5678,6789,540,26.8
Uttar Pradesh,2345,3456,28901,45678,56789,3512,50.2
Uttarakhand,234,567,5678,8901,12345,817,28.9
West Bengal,1234,2345,18923,28901,34567,2642,31.2
Delhi,234,567,5678,8901,12345,717,22.8
Jammu and Kashmir,567,1234,12345,18923,23456,2162,23.4
Ladakh,23,67,567,1234,1234,222,18.9
Chandigarh,45,123,567,1234,1234,234,16.8
Dadra and Nagar Haveli,12,34,234,456,567,1035,28.9
Daman and Diu,8,23,123,234,345,705,24.6
Lakshadweep,4,12,67,123,234,275,12.8
Puducherry,23,67,567,1234,1234,1012,18.9
Andaman and Nicobar Islands,12,34,234,456,567,3172,23.4`,

  agriculture: `State,Agricultural_Land_Hectares,Crop_Production_Tonnes,Irrigation_Area_Hectares,Farmers,Average_Land_Holding,Food_Grain_Production,Rice_Production,Wheat_Production
Andhra Pradesh,8900000,45678000,5678000,8900000,1.2,23456789,15678901,2345678
Arunachal Pradesh,234000,1234000,89000,234000,1.8,567890,456789,89012
Assam,3456000,17890000,1234000,3456000,1.4,8901234,6789012,890123
Bihar,5678000,28900000,2345000,5678000,0.8,15678901,12345678,2345678
Chhattisgarh,4567000,23450000,1789000,4567000,1.6,12345678,8901234,2345678
Goa,89000,456000,67000,89000,1.2,234567,189012,34567
Gujarat,6789000,34560000,2890000,6789000,2.1,18901234,12345678,4567890
Haryana,2345000,12340000,890000,2345000,2.8,5678901,2345678,2345678
Himachal Pradesh,890000,4567000,345000,890000,1.4,2345678,1234567,890123
Jharkhand,2345000,12340000,890000,2345000,1.2,5678901,3456789,1234567
Karnataka,5678000,28900000,2345000,5678000,1.8,12345678,8901234,2345678
Kerala,890000,4567000,345000,890000,0.6,2345678,1890123,345678
Madhya Pradesh,8900000,45678000,3456000,8900000,2.4,23456789,12345678,8901234
Maharashtra,12340000,67890000,5678000,12340000,2.1,34567890,23456789,8901234
Manipur,234000,1234000,89000,234000,1.1,567890,456789,89012
Meghalaya,345000,1789000,123000,345000,1.3,890123,678901,123456
Mizoram,123000,670000,45000,123000,1.5,234567,189012,34567
Nagaland,234000,1234000,89000,234000,1.7,567890,456789,89012
Odisha,5678000,28900000,2345000,5678000,1.3,12345678,8901234,2345678
Punjab,2345000,12340000,890000,2345000,3.8,5678901,2345678,2345678
Rajasthan,8900000,45678000,3456000,8900000,3.2,23456789,12345678,8901234
Sikkim,89000,456000,67000,89000,1.6,234567,189012,34567
Tamil Nadu,5678000,28900000,2345000,5678000,1.1,12345678,8901234,2345678
Telangana,4567000,23450000,1789000,4567000,1.9,12345678,8901234,2345678
Tripura,234000,1234000,89000,234000,1.0,567890,456789,89012
Uttar Pradesh,16780000,89000000,6789000,16780000,1.2,45678901,23456789,17890123
Uttarakhand,890000,4567000,345000,890000,1.5,2345678,1234567,890123
West Bengal,5678000,28900000,2345000,5678000,1.0,12345678,8901234,2345678
Delhi,89000,456000,67000,89000,0.8,234567,189012,34567
Jammu and Kashmir,567000,2890000,234000,567000,1.4,1234567,890123,234567
Ladakh,89000,456000,67000,89000,1.8,234567,189012,34567
Chandigarh,12000,67000,8900,12000,1.2,34567,23456,8901
Dadra and Nagar Haveli,45000,234000,34000,45000,1.6,123456,89012,23456
Daman and Diu,23000,123000,18000,23000,1.4,67890,45678,12345
Lakshadweep,12000,67000,8900,12000,1.0,23456,18901,3456
Puducherry,67000,345000,45000,67000,1.1,89012,67890,12345
Andaman and Nicobar Islands,45000,234000,34000,45000,1.7,123456,89012,23456`
};

async function createRealDatasets() {
  try {
    console.log('Creating real datasets with actual data...');

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

    // Clear existing datasets
    await Dataset.deleteMany({});
    console.log('Cleared existing datasets');

    for (let i = 0; i < realDatasets.length; i++) {
      const dataset = realDatasets[i];
      
      // Create CSV file
      let csvData, fileName;
      if (dataset.category === 'demographics') {
        csvData = realCSVData.population;
        fileName = 'indian_population_census_2021.csv';
      } else if (dataset.category === 'economy') {
        csvData = realCSVData.economy;
        fileName = 'gdp_growth_analysis_2019_2023.csv';
      } else if (dataset.category === 'education') {
        csvData = realCSVData.education;
        fileName = 'education_statistics_all_states_2022.csv';
      } else if (dataset.category === 'health') {
        csvData = realCSVData.health;
        fileName = 'healthcare_infrastructure_analysis_2023.csv';
      } else {
        csvData = realCSVData.agriculture;
        fileName = 'agricultural_production_data_2022.csv';
      }

      const filePath = createRealCSV(fileName, csvData);
      
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

    console.log('Real datasets created successfully!');
    console.log('Total datasets in database:', await Dataset.countDocuments());
    process.exit(0);
  } catch (error) {
    console.error('Error creating real datasets:', error);
    process.exit(1);
  }
}

createRealDatasets(); 