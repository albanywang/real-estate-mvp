-- Enable PostGIS extension (run this once in your database if not already enabled)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Drop existing table and all dependencies
DROP TABLE IF EXISTS properties CASCADE;

-- Create the enhanced properties table with all new fields
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    pricePerSquareMeter DECIMAL(12, 2),
    address VARCHAR(255) NOT NULL,
    layout VARCHAR(100), -- Japanese-style layout format (e.g., 3LDK)
    area DECIMAL(10, 2) NOT NULL, -- Area in square meters
    floorInfo VARCHAR(255), -- Floor information
    structure VARCHAR(50), -- Building structure (e.g., "RC" for reinforced concrete)
    managementFee DECIMAL(10, 2),
    areaOfUse VARCHAR(100), -- Land use designation
    transportation TEXT, -- Transit information
    walkDistance INTEGER CHECK (walkDistance > 0), -- Walking distance in minutes
    location GEOMETRY(POINT, 4326), -- Single geospatial Point (WGS84)
    propertyType VARCHAR(100), -- Property type (e.g., "中古マンション" for used condominium)
    yearBuilt VARCHAR(50), -- Year and month of construction
    balconyArea DECIMAL(10, 2), -- Balcony area in square meters
    totalUnits INTEGER, -- Total number of units in the building
    repairReserveFund DECIMAL(10, 2), -- Monthly repair reserve fund
    landLeaseFee DECIMAL(10, 2), -- Land lease fee
    rightFee DECIMAL(10, 2), -- Right fee
    depositGuarantee DECIMAL(10, 2), -- Deposit guarantee
    maintenanceFees TEXT, -- Additional maintenance fees
    otherFees DECIMAL(10, 2), -- Other fees
    bicycleParking VARCHAR(50), -- Bicycle parking availability
    bikeStorage VARCHAR(50), -- Motorcycle storage availability
    siteArea VARCHAR(100), -- Total site area
    pets VARCHAR(50), -- Pet policy
    landRights VARCHAR(100), -- Land rights (e.g., "所有権" for ownership)
    managementForm VARCHAR(100), -- Management form
    landLawNotification VARCHAR(100), -- Land law notification
    currentSituation VARCHAR(100), -- Current occupancy status
    extraditionPossibleDate VARCHAR(100), -- Available date
    transactionMode VARCHAR(100), -- Transaction mode
    propertyNumber BIGINT, -- Property identification number
    informationReleaseDate DATE, -- Information release date
    nextScheduledUpdateDate DATE, -- Next update date
    remarks TEXT, -- General remarks
    evaluationCertificate TEXT, -- Certification information
    parking VARCHAR(100), -- Parking availability
    kitchen VARCHAR(100), -- Kitchen type
    bathToilet VARCHAR(100), -- Bath and toilet information
    facilitiesServices TEXT, -- Available facilities and services
    others TEXT, -- Other features
    images TEXT[], -- Array of image URLs or paths
    
    -- NEW FIELDS ADDED:
    direction VARCHAR(100), -- Property direction/orientation (e.g., "South-facing", "北向き")
    urbanPlanning VARCHAR(200), -- Urban planning designation
    condominiumSalesCompany VARCHAR(200), -- Condominium sales company
    constructionCompany VARCHAR(200), -- Construction company
    designCompany VARCHAR(200), -- Design company  
    managementCompany VARCHAR(200), -- Management company
    buildingArea DECIMAL(10, 2), -- Building area in square meters
    landArea DECIMAL(10, 2), -- Land area in square meters
    accessSituation TEXT, -- Access situation details
    buildingCoverageRatio DECIMAL(5, 2), -- Building coverage ratio as percentage
    floorAreaRatio DECIMAL(5, 2), -- Floor area ratio as percentage
    estimatedRent DECIMAL(10, 2), -- Estimated monthly rent
    assumedYield DECIMAL(5, 4), -- Assumed yield as decimal (e.g., 0.0350 for 3.5%)
    currentRent DECIMAL(10, 2), -- Current monthly rent
    currentYield DECIMAL(5, 4), -- Current yield as decimal (e.g., 0.0420 for 4.2%)
    rentalStatus VARCHAR(50), -- Rental status (e.g., "vacant", "occupied", "available")
    numberOfUnitsInTheBuilding INTEGER, -- Number of units in the building
    exclusiveAreaOfEachResidence DECIMAL(10, 2), -- Exclusive area of each residence
    
    -- Hierarchical area columns and zipcode
    zipcode VARCHAR(8), -- Format: NNN-NNNN
    area_level_1 VARCHAR(50), -- 首都圏 (Metropolitan area)
    area_level_2 VARCHAR(50), -- 東京都 (Prefecture)
    area_level_3 VARCHAR(50), -- 23区 (Special ward area)
    area_level_4 VARCHAR(50), -- 千代田区 (Specific ward/city)
    status VARCHAR(20) DEFAULT 'for sale' CHECK (status IN ('for sale', 'for rent', 'sold')), -- Property status
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indices for frequently searched fields
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_area ON properties(area);
CREATE INDEX IF NOT EXISTS idx_properties_propertyType ON properties(propertyType);
CREATE INDEX IF NOT EXISTS idx_properties_layout ON properties(layout);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_properties_walkDistance ON properties(walkDistance);

-- Create indices for area columns and zipcode
CREATE INDEX IF NOT EXISTS idx_properties_zipcode ON properties(zipcode);
CREATE INDEX IF NOT EXISTS idx_properties_area_level_1 ON properties(area_level_1);
CREATE INDEX IF NOT EXISTS idx_properties_area_level_2 ON properties(area_level_2);
CREATE INDEX IF NOT EXISTS idx_properties_area_level_3 ON properties(area_level_3);
CREATE INDEX IF NOT EXISTS idx_properties_area_level_4 ON properties(area_level_4);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);

-- Create indices for new financial/rental fields
CREATE INDEX IF NOT EXISTS idx_properties_estimatedRent ON properties(estimatedRent);
CREATE INDEX IF NOT EXISTS idx_properties_currentRent ON properties(currentRent);
CREATE INDEX IF NOT EXISTS idx_properties_assumedYield ON properties(assumedYield);
CREATE INDEX IF NOT EXISTS idx_properties_currentYield ON properties(currentYield);
CREATE INDEX IF NOT EXISTS idx_properties_rentalStatus ON properties(rentalStatus);

-- Create composite index for hierarchical area searches
CREATE INDEX IF NOT EXISTS idx_properties_area_hierarchy ON properties(area_level_1, area_level_2, area_level_3, area_level_4);

-- Enhanced search function with new fields
CREATE OR REPLACE FUNCTION search_properties(
    searchTitle VARCHAR DEFAULT NULL,
    minPrice DECIMAL DEFAULT NULL,
    maxPrice DECIMAL DEFAULT NULL,
    searchAddress VARCHAR DEFAULT NULL,
    searchLayout VARCHAR DEFAULT NULL,
    minArea DECIMAL DEFAULT NULL,
    maxArea DECIMAL DEFAULT NULL,
    searchPropertyType VARCHAR DEFAULT NULL,
    petsAllowed BOOLEAN DEFAULT NULL,
    searchTransportation VARCHAR DEFAULT NULL,
    searchYearBuilt VARCHAR DEFAULT NULL,
    -- Area hierarchy parameters
    searchAreaLevel1 VARCHAR DEFAULT NULL,
    searchAreaLevel2 VARCHAR DEFAULT NULL,
    searchAreaLevel3 VARCHAR DEFAULT NULL,
    searchAreaLevel4 VARCHAR DEFAULT NULL,
    searchZipcode VARCHAR DEFAULT NULL,
    searchStatus VARCHAR DEFAULT NULL,
    -- Walk distance parameter
    maxWalkDistance INTEGER DEFAULT NULL,
    -- New search parameters
    searchDirection VARCHAR DEFAULT NULL,
    searchUrbanPlanning VARCHAR DEFAULT NULL,
    minEstimatedRent DECIMAL DEFAULT NULL,
    maxEstimatedRent DECIMAL DEFAULT NULL,
    minAssumedYield DECIMAL DEFAULT NULL,
    maxAssumedYield DECIMAL DEFAULT NULL,
    searchRentalStatus VARCHAR DEFAULT NULL
)
RETURNS SETOF properties AS $$
BEGIN
    RETURN QUERY 
    SELECT *
    FROM properties p
    WHERE 
        (searchTitle IS NULL OR p.title ILIKE '%' || searchTitle || '%')
        AND (minPrice IS NULL OR p.price >= minPrice)
        AND (maxPrice IS NULL OR p.price <= maxPrice)
        AND (searchAddress IS NULL OR p.address ILIKE '%' || searchAddress || '%')
        AND (searchLayout IS NULL OR p.layout = searchLayout)
        AND (minArea IS NULL OR p.area >= minArea)
        AND (maxArea IS NULL OR p.area <= maxArea)
        AND (searchPropertyType IS NULL OR p.propertyType = searchPropertyType)
        AND (petsAllowed IS NULL OR (petsAllowed = TRUE AND p.pets IN ('可', '相談')))
        AND (searchTransportation IS NULL OR p.transportation ILIKE '%' || searchTransportation || '%')
        AND (searchYearBuilt IS NULL OR p.yearBuilt ILIKE '%' || searchYearBuilt || '%')
        -- Area hierarchy filters
        AND (searchAreaLevel1 IS NULL OR p.area_level_1 = searchAreaLevel1)
        AND (searchAreaLevel2 IS NULL OR p.area_level_2 = searchAreaLevel2)
        AND (searchAreaLevel3 IS NULL OR p.area_level_3 = searchAreaLevel3)
        AND (searchAreaLevel4 IS NULL OR p.area_level_4 = searchAreaLevel4)
        AND (searchZipcode IS NULL OR p.zipcode = searchZipcode)
        AND (searchStatus IS NULL OR p.status = searchStatus)
        -- Walk distance filter
        AND (maxWalkDistance IS NULL OR p.walkDistance <= maxWalkDistance)
        -- New filters
        AND (searchDirection IS NULL OR p.direction ILIKE '%' || searchDirection || '%')
        AND (searchUrbanPlanning IS NULL OR p.urbanPlanning ILIKE '%' || searchUrbanPlanning || '%')
        AND (minEstimatedRent IS NULL OR p.estimatedRent >= minEstimatedRent)
        AND (maxEstimatedRent IS NULL OR p.estimatedRent <= maxEstimatedRent)
        AND (minAssumedYield IS NULL OR p.assumedYield >= minAssumedYield)
        AND (maxAssumedYield IS NULL OR p.assumedYield <= maxAssumedYield)
        AND (searchRentalStatus IS NULL OR p.rentalStatus = searchRentalStatus)
    ORDER BY p.createdAt DESC;
END;
$$ LANGUAGE plpgsql;

-- Helper function to get unique values for each area level
CREATE OR REPLACE FUNCTION get_area_options(area_level INTEGER)
RETURNS TABLE(area_value VARCHAR) AS $$
BEGIN
    CASE area_level
        WHEN 1 THEN
            RETURN QUERY SELECT DISTINCT p.area_level_1 FROM properties p WHERE p.area_level_1 IS NOT NULL ORDER BY p.area_level_1;
        WHEN 2 THEN
            RETURN QUERY SELECT DISTINCT p.area_level_2 FROM properties p WHERE p.area_level_2 IS NOT NULL ORDER BY p.area_level_2;
        WHEN 3 THEN
            RETURN QUERY SELECT DISTINCT p.area_level_3 FROM properties p WHERE p.area_level_3 IS NOT NULL ORDER BY p.area_level_3;
        WHEN 4 THEN
            RETURN QUERY SELECT DISTINCT p.area_level_4 FROM properties p WHERE p.area_level_4 IS NOT NULL ORDER BY p.area_level_4;
        ELSE
            RETURN;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to get hierarchical area options based on parent selection
CREATE OR REPLACE FUNCTION get_hierarchical_area_options(
    parent_level INTEGER,
    parent_value VARCHAR DEFAULT NULL
)
RETURNS TABLE(area_value VARCHAR) AS $$
BEGIN
    CASE parent_level
        WHEN 1 THEN
            RETURN QUERY 
            SELECT DISTINCT p.area_level_2 
            FROM properties p 
            WHERE p.area_level_2 IS NOT NULL 
            AND (parent_value IS NULL OR p.area_level_1 = parent_value)
            ORDER BY p.area_level_2;
        WHEN 2 THEN
            RETURN QUERY 
            SELECT DISTINCT p.area_level_3 
            FROM properties p 
            WHERE p.area_level_3 IS NOT NULL 
            AND (parent_value IS NULL OR p.area_level_2 = parent_value)
            ORDER BY p.area_level_3;
        WHEN 3 THEN
            RETURN QUERY 
            SELECT DISTINCT p.area_level_4 
            FROM properties p 
            WHERE p.area_level_4 IS NOT NULL 
            AND (parent_value IS NULL OR p.area_level_3 = parent_value)
            ORDER BY p.area_level_4;
        ELSE
            RETURN;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Sample property data with all new fields
INSERT INTO properties (
    title, price, pricePerSquareMeter, address, layout, area, floorInfo,
    structure, managementFee, areaOfUse, transportation, walkDistance, location, propertyType,
    yearBuilt, balconyArea, totalUnits, repairReserveFund, landLeaseFee,
    rightFee, depositGuarantee, maintenanceFees, otherFees, bicycleParking,
    bikeStorage, siteArea, pets, landRights, managementForm, landLawNotification,
    currentSituation, extraditionPossibleDate, transactionMode, propertyNumber,
    informationReleaseDate, nextScheduledUpdateDate, remarks, evaluationCertificate,
    parking, kitchen, bathToilet, facilitiesServices, others, images,
    -- New fields
    direction, urbanPlanning, condominiumSalesCompany, constructionCompany,
    designCompany, managementCompany, buildingArea, landArea, accessSituation,
    buildingCoverageRatio, floorAreaRatio, estimatedRent, assumedYield,
    currentRent, currentYield, rentalStatus, numberOfUnitsInTheBuilding,
    exclusiveAreaOfEachResidence,
    -- Area hierarchy and zipcode
    zipcode, area_level_1, area_level_2, area_level_3, area_level_4, status
)
VALUES (
    'ザ・パークハウス晴海タワーズ クロノレジデンス',
    139800000,
    1899973,
    '東京都中央区晴海２丁目',
    '3LDK',
    73.58,
    '地上49階・地下2階建 29階部分',
    'RC',
    22050,
    '準工業地域',
    '東京都大江戸線 「勝どき」駅 徒歩12分, 東京都大江戸線 「月島」駅 徒歩15分, 東京地下鉄有楽町線 「月島」駅 徒歩15分',
    12, -- walkDistance in minutes
    ST_SetSRID(ST_MakePoint(139.787052, 35.656645), 4326),
    '中古マンション',
    '2013年11月',
    11.27,
    883,
    7860,
    NULL,
    NULL,
    NULL,
    'インターネット接続料: 2,200円/月、自治会費: 150円/月',
    NULL,
    '有',
    '有',
    NULL,
    '相談',
    '所有権',
    '全部委託／日勤',
    '届出不要',
    '空家',
    '相談',
    '専任媒介',
    1011352391,
    '2025-04-04',
    '2025-05-19',
    '主要採光面：北向き, 施工会社：（株）大林組, 用途地域：準工業',
    '長期優良住宅認定通知書, 長期優良住宅認定通知書あり',
    '空無',
    'カウンターキッチン',
    '-',
    '全居室収納、ウォークインクローゼット、収納スペース、室内洗濯機置場、シューズインクローゼット、都市ガス',
    'ペット用施設、キッズルーム、フィットネス施設、共用パーティルーム、エレベーター',
    ARRAY['/images/id1-1.jpg', '/images/id1-2.jpg', '/images/id1-3.jpg', '/images/id1-4.jpg', '/images/id1-5.jpg'],
    -- New field values
    '北向き', -- direction
    '準工業地域', -- urbanPlanning
    '三井不動産レジデンシャル株式会社', -- condominiumSalesCompany
    '株式会社大林組', -- constructionCompany
    '株式会社日建設計', -- designCompany
    '三井不動産レジデンシャルサービス株式会社', -- managementCompany
    73.58, -- buildingArea
    NULL, -- landArea (for condominiums)
    '東京都大江戸線勝どき駅より徒歩12分。晴海通り沿いの好立地', -- accessSituation
    NULL, -- buildingCoverageRatio (for condominiums)
    NULL, -- floorAreaRatio (for condominiums)
    280000, -- estimatedRent
    0.0240, -- assumedYield (2.4%)
    NULL, -- currentRent
    NULL, -- currentYield
    'vacant', -- rentalStatus
    883, -- numberOfUnitsInTheBuilding
    73.58, -- exclusiveAreaOfEachResidence
    -- Area hierarchy and zipcode data
    '104-0053',
    '首都圏',
    '東京都',
    '23区',
    '中央区',
    'for sale'
);

-- Example queries to test new fields:

-- Query 1: Find properties with high yield potential
-- SELECT title, price, estimatedRent, assumedYield, direction
-- FROM properties 
-- WHERE assumedYield > 0.02
-- ORDER BY assumedYield DESC;

-- Query 2: Search properties by direction
-- SELECT * FROM search_properties(searchDirection := '南向き');

-- Query 3: Find properties by rental status
-- SELECT * FROM search_properties(searchRentalStatus := 'vacant');

-- Query 4: Search by yield range
-- SELECT * FROM search_properties(
--     minAssumedYield := 0.015,
--     maxAssumedYield := 0.030
-- );

-- Query 5: Get yield statistics
-- SELECT 
--     AVG(assumedYield) as avg_yield,
--     MIN(assumedYield) as min_yield,
--     MAX(assumedYield) as max_yield,
--     COUNT(*) as total_properties
-- FROM properties 
-- WHERE assumedYield IS NOT NULL;