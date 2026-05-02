// Spectral Index Calculations
// These are mathematical formulas applied to satellite imagery bands

/**
 * NDVI (Normalized Difference Vegetation Index)
 * Formula: (NIR - RED) / (NIR + RED)
 * Range: -1 to 1 (higher = more vegetation)
 */
export const calculateNDVI = (nirBand, redBand) => {
  if (!nirBand || !redBand) return null;
  
  const ndvi = (nirBand - redBand) / (nirBand + redBand);
  return Math.max(-1, Math.min(1, ndvi));
};

/**
 * NDWI (Normalized Difference Water Index)
 * Formula: (NIR - SWIR) / (NIR + SWIR)
 * Range: -1 to 1 (higher = more water)
 */
export const calculateNDWI = (nirBand, swirBand) => {
  if (!nirBand || !swirBand) return null;
  
  const ndwi = (nirBand - swirBand) / (nirBand + swirBand);
  return Math.max(-1, Math.min(1, ndwi));
};

/**
 * NDBI (Normalized Difference Built-up Index)
 * Formula: (SWIR - NIR) / (SWIR + NIR)
 * Range: -1 to 1 (higher = more built-up areas)
 */
export const calculateNDBI = (swirBand, nirBand) => {
  if (!swirBand || !nirBand) return null;
  
  const ndbi = (swirBand - nirBand) / (swirBand + nirBand);
  return Math.max(-1, Math.min(1, ndbi));
};

/**
 * NDMI (Normalized Difference Moisture Index)
 * Formula: (NIR - SWIR) / (NIR + SWIR)
 * Used for detecting moisture in soil/vegetation
 */
export const calculateNDMI = (nirBand, swirBand) => {
  if (!nirBand || !swirBand) return null;
  
  const ndmi = (nirBand - swirBand) / (nirBand + swirBand);
  return Math.max(-1, Math.min(1, ndmi));
};

/**
 * Classify NDVI values into vegetation categories
 */
export const classifyVegetation = (ndvi) => {
  if (ndvi < -0.1) return 'Water/Non-vegetated';
  if (ndvi < 0.1) return 'Barren/Built-up';
  if (ndvi < 0.3) return 'Sparse Vegetation';
  if (ndvi < 0.5) return 'Moderate Vegetation';
  return 'Dense Vegetation';
};

/**
 * Calculate confidence score based on multiple indices
 */
export const calculateConfidenceScore = (ndvi, ndwi, ndbi) => {
  let confidence = 50; // Base confidence
  
  if (ndvi && Math.abs(ndvi) > 0.3) confidence += 15;
  if (ndwi && Math.abs(ndwi) > 0.2) confidence += 15;
  if (ndbi && Math.abs(ndbi) > 0.1) confidence += 20;
  
  return Math.min(100, confidence);
};

export default {
  calculateNDVI,
  calculateNDWI,
  calculateNDBI,
  calculateNDMI,
  classifyVegetation,
  calculateConfidenceScore,
};
