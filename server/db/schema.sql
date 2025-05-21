-- Enable PostGIS extension (run this once in your database if not already enabled)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create the properties table with location as a single Point
CREATE TABLE IF NOT EXISTS properties (
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
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indices for frequently searched fields
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_area ON properties(area);
CREATE INDEX idx_properties_propertyType ON properties(propertyType);
CREATE INDEX idx_properties_layout ON properties(layout);
CREATE INDEX idx_properties_location ON properties USING GIST (location);

-- Create a search function for properties
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
    searchYearBuilt VARCHAR DEFAULT NULL
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
    ORDER BY p.createdAt DESC;
END;
$$ LANGUAGE plpgsql;

-- Sample property data
INSERT INTO properties (
    title, price, pricePerSquareMeter, address, layout, area, floorInfo, 
    structure, managementFee, areaOfUse, transportation, location, propertyType, 
    yearBuilt, balconyArea, totalUnits, repairReserveFund, landLeaseFee, 
    rightFee, depositGuarantee, maintenanceFees, otherFees, bicycleParking, 
    bikeStorage, siteArea, pets, landRights, managementForm, landLawNotification, 
    currentSituation, extraditionPossibleDate, transactionMode, propertyNumber, 
    informationReleaseDate, nextScheduledUpdateDate, remarks, evaluationCertificate, 
    parking, kitchen, bathToilet, facilitiesServices, others, images
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
    ST_SetSRID(ST_MakePoint(139.787052, 35.656645), 4326), -- Single Point: [lng, lat]
    '中古マンション', 
    '2013年11月', 
    11.27, 
    883, 
    7860, 
    0, 
    0, 
    0, 
    'インターネット接続料: 2,200円/月、自治会費: 150円/月', 
    0, 
    '有', 
    '有', 
    '-', 
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
    ARRAY['/images/id1-1.jpg', '/images/id1-2.jpg', '/images/id1-3.jpg', '/images/id1-4.jpg', '/images/id1-5.jpg']
);