"""
Environmental Crime Detector using Sentinel-2 spectral indices.

Detects environmental crimes by calculating real spectral indices:
- NDVI (Normalized Difference Vegetation Index): Detects deforestation
- NDWI (Normalized Difference Water Index): Detects water pollution
- NDBI (Normalized Difference Built-up Index): Detects mining/urbanization
- Thermal anomalies: Detects industrial activity/air pollution
"""

import logging
import numpy as np
from typing import Dict, Tuple, Optional
from dataclasses import dataclass, asdict
from enum import Enum

logger = logging.getLogger(__name__)


class RiskLevel(Enum):
    """Environmental risk severity levels."""
    NONE = "none"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


@dataclass
class DetectionResult:
    """Result of environmental crime detection."""
    crime_type: str
    confidence: float  # 0-100
    risk_score: float  # 0-100
    risk_level: str
    spectral_index_value: float
    threshold_crossed: bool
    affected_area_hectares: float
    evidence: Dict  # Spectral index values and metrics
    timestamp: str
    
    def to_dict(self):
        return asdict(self)


class EnvironmentalDetector:
    """
    Detector for environmental crimes using satellite spectral indices.
    """
    
    # Thresholds for different crimes
    THRESHOLDS = {
        'deforestation': {
            'ndvi_critical': 0.2,    # NDVI < 0.2: Severe deforestation
            'ndvi_degraded': 0.4,    # NDVI 0.2-0.4: Degraded forest
            'ndvi_healthy': 0.6      # NDVI > 0.6: Healthy forest
        },
        'water_pollution': {
            'ndwi_pollution': -0.3,  # NDWI < -0.3: Possible pollution
            'ndwi_normal': 0.0       # NDWI > 0.0: Normal water
        },
        'mining': {
            'ndbi_mining': 0.3,      # NDBI > 0.3: Built-up/mining
            'ndbi_normal': 0.1       # NDBI < 0.1: Natural
        },
        'air_pollution': {
            'thermal_anomaly': 0.85  # Brightness temperature anomaly > 85%
        }
    }
    
    def __init__(self):
        logger.info("✅ Environmental Detector initialized")
    
    def detect_deforestation(self, bands: Dict[str, np.ndarray]) -> DetectionResult:
        """
        Detect illegal logging and deforestation using NDVI.
        
        NDVI = (NIR - Red) / (NIR + Red)
        NDVI ranges from -1 to +1:
        - < 0: Water, snow, clouds
        - 0-0.2: Urban, barren, rocks
        - 0.2-0.4: Low vegetation (grassland, degraded forest)
        - 0.4-0.6: Moderate vegetation
        - 0.6+: Dense vegetation (forests)
        
        Deforestation shows sudden drops in NDVI.
        """
        try:
            # Extract NIR (B08) and Red (B04) bands
            nir = bands['B08'].astype(np.float32)
            red = bands['B04'].astype(np.float32)
            
            # Calculate NDVI
            denominator = nir + red
            # Avoid division by zero
            denominator = np.where(denominator == 0, 1e-8, denominator)
            ndvi = (nir - red) / denominator
            
            # Clip to valid range [-1, 1]
            ndvi = np.clip(ndvi, -1, 1)
            
            # Analyze NDVI statistics
            ndvi_mean = np.mean(ndvi)
            ndvi_std = np.std(ndvi)
            ndvi_min = np.min(ndvi)
            ndvi_max = np.max(ndvi)
            
            # Count pixels below thresholds
            critical_pixels = np.sum(ndvi < self.THRESHOLDS['deforestation']['ndvi_critical'])
            degraded_pixels = np.sum((ndvi >= self.THRESHOLDS['deforestation']['ndvi_critical']) & 
                                    (ndvi < self.THRESHOLDS['deforestation']['ndvi_degraded']))
            
            total_pixels = ndvi.size
            critical_ratio = critical_pixels / total_pixels
            degraded_ratio = degraded_pixels / total_pixels
            
            # Determine crime type and confidence
            crime_detected = False
            risk_score = 0.0
            confidence = 0.0
            
            if critical_ratio > 0.3:  # More than 30% severely deforested
                crime_detected = True
                risk_score = 90 + (critical_ratio * 10)  # 90-100
                confidence = min(95, 60 + critical_ratio * 35)
                crime_type = "illegal_logging_critical"
            elif degraded_ratio > 0.4:  # More than 40% degraded
                crime_detected = True
                risk_score = 65 + (degraded_ratio * 25)  # 65-90
                confidence = min(90, 50 + degraded_ratio * 40)
                crime_type = "land_degradation"
            elif critical_ratio > 0.1:  # Some deforestation
                crime_detected = True
                risk_score = 45 + (critical_ratio * 25)  # 45-70
                confidence = min(85, 40 + critical_ratio * 45)
                crime_type = "deforestation_moderate"
            else:
                crime_type = "no_deforestation"
                risk_score = 10 + (ndvi_std * 20)  # Healthy forest has low std
                confidence = min(95, 70 - ndvi_std * 10)
            
            # Calculate affected area (in hectares)
            # Each pixel is ~100m², so 100 pixels ≈ 1 hectare
            affected_pixels = critical_pixels if critical_ratio > 0.1 else degraded_pixels
            affected_area = (affected_pixels / 100) if affected_pixels > 0 else 0
            
            # Determine risk level
            if risk_score >= 80:
                risk_level = RiskLevel.CRITICAL.value
            elif risk_score >= 60:
                risk_level = RiskLevel.HIGH.value
            elif risk_score >= 40:
                risk_level = RiskLevel.MEDIUM.value
            else:
                risk_level = RiskLevel.LOW.value
            
            result = DetectionResult(
                crime_type=crime_type if crime_detected else "no_crime",
                confidence=round(confidence, 2),
                risk_score=round(min(100, risk_score), 2),
                risk_level=risk_level,
                spectral_index_value=round(ndvi_mean, 4),
                threshold_crossed=crime_detected,
                affected_area_hectares=round(affected_area, 2),
                evidence={
                    'ndvi_mean': round(ndvi_mean, 4),
                    'ndvi_min': round(ndvi_min, 4),
                    'ndvi_max': round(ndvi_max, 4),
                    'ndvi_std': round(ndvi_std, 4),
                    'critical_pixels_ratio': round(critical_ratio, 4),
                    'degraded_pixels_ratio': round(degraded_ratio, 4),
                    'threshold_critical': round(self.THRESHOLDS['deforestation']['ndvi_critical'], 4),
                    'threshold_degraded': round(self.THRESHOLDS['deforestation']['ndvi_degraded'], 4)
                },
                timestamp=""  # Will be set by caller
            )
            
            logger.info(f"🌳 Deforestation detection: {crime_type} (Risk: {risk_level}, "
                       f"NDVI: {ndvi_mean:.3f})")
            return result
            
        except Exception as e:
            logger.error(f"Error detecting deforestation: {e}")
            raise
    
    def detect_water_pollution(self, bands: Dict[str, np.ndarray]) -> DetectionResult:
        """
        Detect water pollution using NDWI.
        
        NDWI = (Green - NIR) / (Green + NIR)
        NDWI is used to detect water bodies and water quality.
        
        Normal water: NDWI > 0.4
        Turbid/polluted water: NDWI between -0.1 and 0.3
        Possibly contaminated: NDWI < -0.1
        """
        try:
            # Extract Green (B03) and NIR (B08) bands
            green = bands['B03'].astype(np.float32)
            nir = bands['B08'].astype(np.float32)
            
            # Calculate NDWI
            denominator = green + nir
            denominator = np.where(denominator == 0, 1e-8, denominator)
            ndwi = (green - nir) / denominator
            
            # Clip to valid range
            ndwi = np.clip(ndwi, -1, 1)
            
            # Analyze NDWI
            ndwi_mean = np.mean(ndwi)
            ndwi_std = np.std(ndwi)
            ndwi_min = np.min(ndwi)
            ndwi_max = np.max(ndwi)
            
            # Count pixels with abnormal water signatures
            polluted_pixels = np.sum(ndwi < self.THRESHOLDS['water_pollution']['ndwi_pollution'])
            turbid_pixels = np.sum((ndwi >= self.THRESHOLDS['water_pollution']['ndwi_pollution']) & 
                                  (ndwi < 0.2))
            
            total_pixels = ndwi.size
            polluted_ratio = polluted_pixels / total_pixels
            turbid_ratio = turbid_pixels / total_pixels
            
            # Determine pollution level
            crime_detected = False
            risk_score = 0.0
            confidence = 0.0
            
            if polluted_ratio > 0.2:  # More than 20% severely polluted
                crime_detected = True
                risk_score = 85 + (polluted_ratio * 15)  # 85-100
                confidence = min(95, 70 + polluted_ratio * 25)
                crime_type = "water_pollution_critical"
            elif turbid_ratio > 0.3:  # More than 30% turbid
                crime_detected = True
                risk_score = 60 + (turbid_ratio * 25)  # 60-85
                confidence = min(90, 50 + turbid_ratio * 40)
                crime_type = "water_pollution_moderate"
            elif ndwi_mean < 0.1:  # Generally low NDWI
                crime_detected = True
                risk_score = 40 + abs(ndwi_mean) * 30
                confidence = min(80, 40 - ndwi_mean * 20)
                crime_type = "water_quality_degradation"
            else:
                crime_type = "no_water_pollution"
                risk_score = max(0, 20 - ndwi_mean * 30)  # Healthy water has high NDWI
                confidence = min(90, 70 + max(0, ndwi_mean - 0.3) * 50)
            
            # Calculate affected area
            affected_pixels = max(polluted_pixels, turbid_pixels)
            affected_area = (affected_pixels / 100) if affected_pixels > 0 else 0
            
            # Determine risk level
            if risk_score >= 80:
                risk_level = RiskLevel.CRITICAL.value
            elif risk_score >= 60:
                risk_level = RiskLevel.HIGH.value
            elif risk_score >= 40:
                risk_level = RiskLevel.MEDIUM.value
            else:
                risk_level = RiskLevel.LOW.value
            
            result = DetectionResult(
                crime_type=crime_type if crime_detected else "no_crime",
                confidence=round(confidence, 2),
                risk_score=round(min(100, risk_score), 2),
                risk_level=risk_level,
                spectral_index_value=round(ndwi_mean, 4),
                threshold_crossed=crime_detected,
                affected_area_hectares=round(affected_area, 2),
                evidence={
                    'ndwi_mean': round(ndwi_mean, 4),
                    'ndwi_min': round(ndwi_min, 4),
                    'ndwi_max': round(ndwi_max, 4),
                    'ndwi_std': round(ndwi_std, 4),
                    'polluted_pixels_ratio': round(polluted_ratio, 4),
                    'turbid_pixels_ratio': round(turbid_ratio, 4),
                    'threshold_pollution': round(self.THRESHOLDS['water_pollution']['ndwi_pollution'], 4)
                },
                timestamp=""
            )
            
            logger.info(f"💧 Water pollution detection: {crime_type} (Risk: {risk_level}, "
                       f"NDWI: {ndwi_mean:.3f})")
            return result
            
        except Exception as e:
            logger.error(f"Error detecting water pollution: {e}")
            raise
    
    def detect_mining_activity(self, bands: Dict[str, np.ndarray]) -> DetectionResult:
        """
        Detect illegal mining using NDBI (Normalized Difference Built-up Index).
        
        NDBI = (SWIR - NIR) / (SWIR + NIR)
        NDBI highlights built-up areas and exposed soil (mining).
        
        NDBI > 0.3: Strong built-up/mining signature
        NDBI 0.1-0.3: Moderate built-up areas
        NDBI < 0.1: Natural vegetation
        """
        try:
            # Extract SWIR (B11) and NIR (B08) bands
            swir = bands['B11'].astype(np.float32)
            nir = bands['B08'].astype(np.float32)
            
            # Calculate NDBI
            denominator = swir + nir
            denominator = np.where(denominator == 0, 1e-8, denominator)
            ndbi = (swir - nir) / denominator
            
            ndbi = np.clip(ndbi, -1, 1)
            
            # Analyze NDBI
            ndbi_mean = np.mean(ndbi)
            ndbi_std = np.std(ndbi)
            ndbi_min = np.min(ndbi)
            ndbi_max = np.max(ndbi)
            
            # Count pixels with mining signatures
            mining_pixels = np.sum(ndbi > self.THRESHOLDS['mining']['ndbi_mining'])
            buildup_pixels = np.sum((ndbi > self.THRESHOLDS['mining']['ndbi_normal']) & 
                                   (ndbi <= self.THRESHOLDS['mining']['ndbi_mining']))
            
            total_pixels = ndbi.size
            mining_ratio = mining_pixels / total_pixels
            buildup_ratio = buildup_pixels / total_pixels
            
            # Determine mining activity level
            crime_detected = False
            risk_score = 0.0
            confidence = 0.0
            
            if mining_ratio > 0.15:  # More than 15% mining signatures
                crime_detected = True
                risk_score = 80 + (mining_ratio * 20)  # 80-100
                confidence = min(95, 75 + mining_ratio * 20)
                crime_type = "illegal_mining_critical"
            elif buildup_ratio > 0.25:  # More than 25% built-up
                crime_detected = True
                risk_score = 55 + (buildup_ratio * 30)  # 55-85
                confidence = min(90, 60 + buildup_ratio * 30)
                crime_type = "mining_activity_detected"
            elif ndbi_mean > 0.2:  # Generally high NDBI
                crime_detected = True
                risk_score = 40 + ndbi_mean * 50
                confidence = min(85, 50 + ndbi_mean * 35)
                crime_type = "urbanization_detected"
            else:
                crime_type = "no_mining"
                risk_score = max(0, ndbi_mean * 30)
                confidence = min(95, 80 - max(0, ndbi_mean) * 50)
            
            # Calculate affected area
            affected_pixels = mining_pixels if mining_ratio > 0.05 else buildup_pixels
            affected_area = (affected_pixels / 100) if affected_pixels > 0 else 0
            
            # Determine risk level
            if risk_score >= 80:
                risk_level = RiskLevel.CRITICAL.value
            elif risk_score >= 60:
                risk_level = RiskLevel.HIGH.value
            elif risk_score >= 40:
                risk_level = RiskLevel.MEDIUM.value
            else:
                risk_level = RiskLevel.LOW.value
            
            result = DetectionResult(
                crime_type=crime_type if crime_detected else "no_crime",
                confidence=round(confidence, 2),
                risk_score=round(min(100, risk_score), 2),
                risk_level=risk_level,
                spectral_index_value=round(ndbi_mean, 4),
                threshold_crossed=crime_detected,
                affected_area_hectares=round(affected_area, 2),
                evidence={
                    'ndbi_mean': round(ndbi_mean, 4),
                    'ndbi_min': round(ndbi_min, 4),
                    'ndbi_max': round(ndbi_max, 4),
                    'ndbi_std': round(ndbi_std, 4),
                    'mining_pixels_ratio': round(mining_ratio, 4),
                    'buildup_pixels_ratio': round(buildup_ratio, 4),
                    'threshold_mining': round(self.THRESHOLDS['mining']['ndbi_mining'], 4)
                },
                timestamp=""
            )
            
            logger.info(f"⛏️  Mining detection: {crime_type} (Risk: {risk_level}, "
                       f"NDBI: {ndbi_mean:.3f})")
            return result
            
        except Exception as e:
            logger.error(f"Error detecting mining: {e}")
            raise
    
    def detect_air_pollution(self, bands: Dict[str, np.ndarray]) -> DetectionResult:
        """
        Detect air pollution and industrial activity using thermal bands.
        
        Uses ratio of visible bands and vegetation indices to detect atmospheric anomalies.
        Higher aerosol concentrations reduce blue band reflectance.
        """
        try:
            # Extract bands
            blue = bands['B02'].astype(np.float32)
            green = bands['B03'].astype(np.float32)
            red = bands['B04'].astype(np.float32)
            nir = bands['B08'].astype(np.float32)
            
            # Calculate Aerosol Optical Depth proxy
            # High blue/green ratio and low NDVI can indicate aerosols/pollution
            denom_bg = green + 1e-8
            blue_green_ratio = blue / denom_bg
            
            # Calculate simple vegetation index
            denom_vi = nir + red + 1e-8
            vegetation_proxy = (nir - red) / denom_vi
            
            # Air quality degradation indicator
            # High blue-green ratio + low vegetation = pollution
            pollution_indicator = blue_green_ratio * (1 - np.maximum(vegetation_proxy, 0))
            
            # Analyze pollution
            pollution_mean = np.mean(pollution_indicator)
            pollution_std = np.std(pollution_indicator)
            pollution_max = np.max(pollution_indicator)
            
            # Count pixels with high pollution signatures
            high_pollution = np.sum(pollution_indicator > np.percentile(pollution_indicator, 85))
            high_pollution_ratio = high_pollution / pollution_indicator.size
            
            # Determine air quality
            crime_detected = False
            risk_score = 0.0
            confidence = 0.0
            
            if high_pollution_ratio > 0.3:
                crime_detected = True
                risk_score = 75 + (high_pollution_ratio * 25)  # 75-100
                confidence = min(90, 65 + high_pollution_ratio * 25)
                crime_type = "air_pollution_critical"
            elif high_pollution_ratio > 0.15:
                crime_detected = True
                risk_score = 55 + (high_pollution_ratio * 40)  # 55-85
                confidence = min(85, 55 + high_pollution_ratio * 30)
                crime_type = "air_pollution_moderate"
            elif pollution_mean > 0.5:
                crime_detected = True
                risk_score = 40 + (pollution_mean - 0.5) * 100
                confidence = min(80, 45 + (pollution_mean - 0.5) * 90)
                crime_type = "air_quality_degradation"
            else:
                crime_type = "no_air_pollution"
                risk_score = max(0, pollution_mean * 40)
                confidence = min(95, 75 - pollution_mean * 50)
            
            # Calculate affected area (assuming 512x512 pixels)
            affected_pixels = high_pollution if high_pollution_ratio > 0.1 else 0
            affected_area = (affected_pixels / 100) if affected_pixels > 0 else 0
            
            # Determine risk level
            if risk_score >= 80:
                risk_level = RiskLevel.CRITICAL.value
            elif risk_score >= 60:
                risk_level = RiskLevel.HIGH.value
            elif risk_score >= 40:
                risk_level = RiskLevel.MEDIUM.value
            else:
                risk_level = RiskLevel.LOW.value
            
            result = DetectionResult(
                crime_type=crime_type if crime_detected else "no_crime",
                confidence=round(confidence, 2),
                risk_score=round(min(100, risk_score), 2),
                risk_level=risk_level,
                spectral_index_value=round(pollution_mean, 4),
                threshold_crossed=crime_detected,
                affected_area_hectares=round(affected_area, 2),
                evidence={
                    'pollution_indicator_mean': round(pollution_mean, 4),
                    'pollution_indicator_std': round(pollution_std, 4),
                    'pollution_indicator_max': round(pollution_max, 4),
                    'blue_green_ratio': round(np.mean(blue_green_ratio), 4),
                    'high_pollution_pixels_ratio': round(high_pollution_ratio, 4)
                },
                timestamp=""
            )
            
            logger.info(f"☁️  Air pollution detection: {crime_type} (Risk: {risk_level}, "
                       f"Indicator: {pollution_mean:.3f})")
            return result
            
        except Exception as e:
            logger.error(f"Error detecting air pollution: {e}")
            raise
    
    def analyze_location(self, bands: Dict[str, np.ndarray], 
                        location: Tuple[float, float] = None) -> Dict:
        """
        Comprehensive analysis of a location for all types of environmental crimes.
        
        Args:
            bands: Dictionary of satellite bands
            location: Tuple of (latitude, longitude)
        
        Returns:
            Dictionary with all detection results
        """
        try:
            deforestation = self.detect_deforestation(bands)
            water_pollution = self.detect_water_pollution(bands)
            mining = self.detect_mining_activity(bands)
            air_pollution = self.detect_air_pollution(bands)
            
            # Determine overall risk
            all_results = [deforestation, water_pollution, mining, air_pollution]
            highest_risk = max([r.risk_score for r in all_results])
            
            # Find the crime with highest risk
            primary_crime = max(all_results, key=lambda r: r.risk_score)
            
            return {
                'primary_crime': primary_crime.to_dict(),
                'all_detections': {
                    'deforestation': deforestation.to_dict(),
                    'water_pollution': water_pollution.to_dict(),
                    'mining': mining.to_dict(),
                    'air_pollution': air_pollution.to_dict()
                },
                'overall_risk_score': round(min(100, highest_risk), 2),
                'location': location
            }
            
        except Exception as e:
            logger.error(f"Error in comprehensive analysis: {e}")
            raise
