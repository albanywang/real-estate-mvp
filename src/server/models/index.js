// models/index.js - Main export file
// This is where you put the main export statement
// This is model part of MVC design pattern that handle data and buiness logic
// The Model represents the data structure, database schema, and business logic for interacting with data 
// (e.g., properties in a real estate app). It defines how data is stored, validated, and manipulated
import { Property } from './Property.js';
import { PropertySearch } from './PropertySearch.js';
import { PropertyStatistics } from './PropertyStatistics.js';
import { PropertyCollection } from './PropertyCollection.js';
import { PropertyValidators } from './PropertyValidators.js';
import { PropertyFactory } from './PropertyFactory.js';
import { PropertyBuilder } from './PropertyBuilder.js';
import { PropertyEnums } from './PropertyEnums.js';

// Export all models and utilities
export {
  Property,
  PropertySearch,
  PropertyStatistics,
  PropertyCollection,
  PropertyValidators,
  PropertyFactory,
  PropertyBuilder,
  PropertyEnums
};

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * How to import in your application files:
 */

// Option 1: Import everything from index
// import { Property, PropertySearch, PropertyFactory } from './models/index.js';

// Option 2: Import specific classes from individual files
// import { Property } from './models/Property.js';
// import { PropertySearch } from './models/PropertySearch.js';
// import { PropertyFactory } from './models/PropertyFactory.js';

// Option 3: Import all as namespace (if using default export in index)
// import * as Models from './models/index.js';
// const property = new Models.Property(data);

/**
 * In your routes (example):
 */
// routes/PropertyRoutes.js
// import { Property, PropertyFactory, PropertySearch } from '../models/index.js';
// 
// router.post('/properties', async (req, res) => {
//   const property = PropertyFactory.fromFormData(req.body, req.files);
//   const validation = property.validate();
//   // ... rest of route logic
// });

/**
 * In your services (example):
 */
// services/PropertyService.js
// import { Property, PropertyCollection, PropertyStatistics } from '../models/index.js';
// 
// class PropertyService {
//   async getProperties(filters) {
//     const results = await this.repository.findAll(filters);
//     return new PropertyCollection(results);
//   }
// }

/**
 * Recommended project structure:
 */
/*
your-project/
├── models/
│   ├── index.js              <- Main export file (put your export here)
│   ├── Property.js
│   ├── PropertySearch.js
│   ├── PropertyStatistics.js
│   ├── PropertyCollection.js
│   ├── PropertyValidators.js
│   ├── PropertyFactory.js
│   ├── PropertyBuilder.js
│   └── PropertyEnums.js
├── data/
│   └── PropertyRepository.js
├── api/
│   └── PropertyService.js
├── routes/
│   └── PropertyRoutes.js
└── utils/
    └── db.js
*/