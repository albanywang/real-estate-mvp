-- Enable PostGIS extension (run this once in your database if not already enabled)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Drop existing table and all dependencies
DROP TABLE IF EXISTS properties CASCADE;

-- Create the enhanced properties table with walkDistance field
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

-- Create composite index for hierarchical area searches
CREATE INDEX IF NOT EXISTS idx_properties_area_hierarchy ON properties(area_level_1, area_level_2, area_level_3, area_level_4);

-- Enhanced search function with walkDistance parameter
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
    searchAreaLevel1 VARCHAR DEFAULT NULL, -- 首都圏
    searchAreaLevel2 VARCHAR DEFAULT NULL, -- 東京都
    searchAreaLevel3 VARCHAR DEFAULT NULL, -- 23区
    searchAreaLevel4 VARCHAR DEFAULT NULL, -- 千代田区
    searchZipcode VARCHAR DEFAULT NULL,
    searchStatus VARCHAR DEFAULT NULL,
    -- Walk distance parameter
    maxWalkDistance INTEGER DEFAULT NULL
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

-- Sample property data with walkDistance field
INSERT INTO properties (
    title, price, pricePerSquareMeter, address, layout, area, floorInfo,
    structure, managementFee, areaOfUse, transportation, walkDistance, location, propertyType,
    yearBuilt, balconyArea, totalUnits, repairReserveFund, landLeaseFee,
    rightFee, depositGuarantee, maintenanceFees, otherFees, bicycleParking,
    bikeStorage, siteArea, pets, landRights, managementForm, landLawNotification,
    currentSituation, extraditionPossibleDate, transactionMode, propertyNumber,
    informationReleaseDate, nextScheduledUpdateDate, remarks, evaluationCertificate,
    parking, kitchen, bathToilet, facilitiesServices, others, images,
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
    -- Area hierarchy and zipcode data
    '104-0053',
    '首都圏',
    '東京都',
    '23区',
    '中央区',
    'for sale'
);


-- Example queries to test walkDistance functionality:

-- Query 1: Find properties within 5 minutes walk
-- SELECT id, title, walkDistance, transportation, address 
-- FROM properties 
-- WHERE walkDistance <= 5;

-- Query 2: Use the search function with walkDistance
-- SELECT * FROM search_properties(
--     maxWalkDistance := 10,
--     searchAreaLevel4 := '港区'
-- );

-- Query 3: Get statistics on walk distances
-- SELECT 
--     MIN(walkDistance) as min_walk,
--     MAX(walkDistance) as max_walk,
--     AVG(walkDistance)::INTEGER as avg_walk,
--     COUNT(*) as total_properties
-- FROM properties 
-- WHERE walkDistance IS NOT NULL;

-- Query 4: Group properties by walk distance ranges
-- SELECT 
--     CASE 
--         WHEN walkDistance <= 5 THEN '1-5 minutes'
--         WHEN walkDistance <= 10 THEN '6-10 minutes'
--         WHEN walkDistance <= 15 THEN '11-15 minutes'
--         WHEN walkDistance <= 20 THEN '16-20 minutes'
--         ELSE '20+ minutes'
--     END as walk_range,
--     COUNT(*) as property_count
-- FROM properties 
-- WHERE walkDistance IS NOT NULL
-- GROUP BY walk_range
-- ORDER BY MIN(walkDistance);