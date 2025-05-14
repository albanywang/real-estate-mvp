-- property_schema.sql
-- This file should be used to create your database tables for properties

CREATE TABLE IF NOT EXISTS properties  (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    price_per_square_meter DECIMAL(12, 2),
    address VARCHAR(255) NOT NULL,
    layout VARCHAR(100), -- Japanese-style layout format (e.g., 3LDK)
    area DECIMAL(10, 2) NOT NULL, -- Area in square meters
    floor_info VARCHAR(255), -- Floor information
    structure VARCHAR(50), -- Building structure (e.g., "RC" for reinforced concrete)
    management_fee DECIMAL(10, 2),
    area_of_use VARCHAR(100), -- Land use designation
    transportation TEXT, -- Transit information
    location POINT, -- Geographic coordinates [latitude, longitude]
    property_type VARCHAR(100), -- Property type (e.g., "中古マンション" for used condominium)
    year_built VARCHAR(50), -- Year and month of construction
    balcony_area DECIMAL(10, 2), -- Balcony area in square meters
    total_units INTEGER, -- Total number of units in the building
    repair_reserve_fund DECIMAL(10, 2), -- Monthly repair reserve fund
    land_lease_fee DECIMAL(10, 2), -- Land lease fee
    right_fee DECIMAL(10, 2), -- Right fee
    deposit_guarantee DECIMAL(10, 2), -- Deposit guarantee
    maintenance_fees TEXT, -- Additional maintenance fees
    other_fees DECIMAL(10, 2), -- Other fees
    bicycle_parking VARCHAR(50), -- Bicycle parking availability
    bike_storage VARCHAR(50), -- Motorcycle storage availability
    site_area VARCHAR(100), -- Total site area
    pets VARCHAR(50), -- Pet policy
    land_rights VARCHAR(100), -- Land rights (e.g., "所有権" for ownership)
    management_form VARCHAR(100), -- Management form
    land_law_notification VARCHAR(100), -- Land law notification
    current_situation VARCHAR(100), -- Current occupancy status
    extradition_possible_date VARCHAR(100), -- Available date
    transaction_mode VARCHAR(100), -- Transaction mode
    property_number BIGINT, -- Property identification number
    information_release_date DATE, -- Information release date
    next_scheduled_update_date DATE, -- Next update date
    remarks TEXT, -- General remarks
    evaluation_certificate TEXT, -- Certification information
    parking VARCHAR(100), -- Parking availability
    kitchen VARCHAR(100), -- Kitchen type
    bath_toilet VARCHAR(100), -- Bath and toilet information
    facilities_services TEXT, -- Available facilities and services
    others TEXT, -- Other features
    images TEXT[], -- Array of image URLs or paths
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indices for frequently searched fields
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_area ON properties(area);
CREATE INDEX idx_properties_property_type ON properties(property_type);
CREATE INDEX idx_properties_layout ON properties(layout);

-- Create a search function for properties
CREATE OR REPLACE FUNCTION search_properties(
    search_title VARCHAR DEFAULT NULL,
    min_price DECIMAL DEFAULT NULL,
    max_price DECIMAL DEFAULT NULL,
    search_address VARCHAR DEFAULT NULL,
    search_layout VARCHAR DEFAULT NULL,
    min_area DECIMAL DEFAULT NULL,
    max_area DECIMAL DEFAULT NULL,
    search_property_type VARCHAR DEFAULT NULL,
    pets_allowed BOOLEAN DEFAULT NULL,
    search_transportation VARCHAR DEFAULT NULL,
    search_year_built VARCHAR DEFAULT NULL
)
RETURNS SETOF properties AS $$
BEGIN
    RETURN QUERY 
    SELECT *
    FROM properties p
    WHERE 
        (search_title IS NULL OR p.title ILIKE '%' || search_title || '%')
        AND (min_price IS NULL OR p.price >= min_price)
        AND (max_price IS NULL OR p.price <= max_price)
        AND (search_address IS NULL OR p.address ILIKE '%' || search_address || '%')
        AND (search_layout IS NULL OR p.layout = search_layout)
        AND (min_area IS NULL OR p.area >= min_area)
        AND (max_area IS NULL OR p.area <= max_area)
        AND (search_property_type IS NULL OR p.property_type = search_property_type)
        AND (pets_allowed IS NULL OR (pets_allowed = TRUE AND p.pets IN ('可', '相談')))
        AND (search_transportation IS NULL OR p.transportation ILIKE '%' || search_transportation || '%')
        AND (search_year_built IS NULL OR p.year_built ILIKE '%' || search_year_built || '%')
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

