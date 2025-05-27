// api/propertyRoutes.js
import express from 'express';
import propertyModel from '../data/propertyModel.js'; // Add .js extension
const router = express.Router();

// Get all properties with filtering
router.get('/properties', async (req, res) => {
  try {
    const {
      title,
      minPrice,
      maxPrice,
      address,
      layout,
      minArea,
      maxArea,
      propertyType,
      petsAllowed,
      transportation,
      yearBuilt
    } = req.query;

    // Parse boolean values
    const parsedPetsAllowed = petsAllowed ? petsAllowed === 'true' : null;
    
    const filters = {
      title,
      minPrice,
      maxPrice,
      address,
      layout,
      minArea,
      maxArea,
      propertyType,
      petsAllowed: parsedPetsAllowed,
      transportation,
      yearBuilt
    };
    
    const properties = await propertyModel.getProperties(filters);
    res.json(properties);
  } catch (error) {
    console.error('Error searching properties:', error);
    res.status(500).json({ error: 'An error occurred while searching properties' });
  }
});

// Get property by ID
router.get('/properties/:id', async (req, res) => {
  try {
    const property = await propertyModel.getPropertyById(req.params.id);
    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(error.message === 'Property not found' ? 404 : 500)
      .json({ error: error.message || 'An error occurred while fetching the property' });
  }
});

// Create a new property
router.post('/properties', async (req, res) => {
  try {
    const property = await propertyModel.createProperty(req.body);
    res.status(201).json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'An error occurred while creating the property' });
  }
});

// Update a property
router.put('/properties/:id', async (req, res) => {
  try {
    const property = await propertyModel.updateProperty(req.params.id, req.body);
    res.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(error.message === 'Property not found' ? 404 : 500)
      .json({ error: error.message || 'An error occurred while updating the property' });
  }
});

// Delete a property
router.delete('/properties/:id', async (req, res) => {
  try {
    const property = await propertyModel.deleteProperty(req.params.id);
    res.json({ message: 'Property deleted successfully', property });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(error.message === 'Property not found' ? 404 : 500)
      .json({ error: error.message || 'An error occurred while deleting the property' });
  }
});

// Get available property layouts
router.get('/layouts', async (req, res) => {
  try {
    const layouts = await propertyModel.getLayouts();
    res.json(layouts);
  } catch (error) {
    console.error('Error fetching layouts:', error);
    res.status(500).json({ error: 'An error occurred while fetching layouts' });
  }
});

// Get available property types
router.get('/property-types', async (req, res) => {
  try {
    const types = await propertyModel.getPropertyTypes();
    res.json(types);
  } catch (error) {
    console.error('Error fetching property types:', error);
    res.status(500).json({ error: 'An error occurred while fetching property types' });
  }
});

export default router;