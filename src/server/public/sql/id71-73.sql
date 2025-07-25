INSERT INTO properties (
    title, price, pricePerSquareMeter, address, layout, area, floorInfo,
    structure, managementFee, areaOfUse, transportation, walkDistance, location, propertyType,
    yearBuilt, balconyArea, totalUnits, repairReserveFund, landLeaseFee,
    rightFee, depositGuarantee, maintenanceFees, otherFees, bicycleParking,
    bikeStorage, siteArea, pets, landRights, managementForm, landLawNotification,
    currentSituation, extraditionPossibleDate, transactionMode, propertyNumber,
    informationReleaseDate, nextScheduledUpdateDate, remarks, evaluationCertificate,
    parking, kitchen, bathToilet, facilitiesServices, others, images,
    -- New hierarchical area fields and zipcode
    zipcode, area_level_1, area_level_2, area_level_3, area_level_4, status,
    -- NEW FIELDS ADDED:
    direction, urbanPlanning, condominiumSalesCompany, constructionCompany,
    designCompany, managementCompany, buildingArea, landArea, accessSituation,
    buildingCoverageRatio, floorAreaRatio, estimatedRent, assumedYield,
    currentRent, currentYield, rentalStatus, numberOfUnitsInTheBuilding,
    exclusiveAreaOfEachResidence         
)
VALUES (
    'ブランズ千代田富士見',
    360000000,
    2999500,
    '東京都千代田区富士見１丁目',
    '2LDK',
    72.96,
    '7階 / 地上18階建',
    'RC',
    56700,
    '準工業地域',
    '東京メトロ東西線 九段下駅 徒歩5分, 東京メトロ南北線・有楽町線「飯田橋」駅徒歩８分、都営大江戸線「飯田橋」駅徒歩８分, 中央・総武緩行線 飯田橋駅 徒歩8分,東京メトロ東西線 飯田橋駅 徒歩6分',
    5,
    ST_SetSRID(ST_MakePoint(139.74860329822664,35.697847266481936), 4326),
    '新築マンション',
    '2025年01月築',
    12.61,
    69,
    15100,
    NULL,
    NULL,
    NULL,
    '管理費込み、インターネット使用料込み',
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
    '仲介',
    1122083505,
    '2025-05-29',
    '2025-06-12',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    'インターネット利用料 1,320円 / 月、スカパー使用料 385円 / 月, ・トランクルーム面積：０．２９平米は専有面積に含みます。 ・駐車場は専用使用権ではございません。管理会社に全部委託',
    ARRAY['/images/id71-1.jpg', '/images/id71-2.jpg', '/images/id71-3.jpg', '/images/id71-4.jpg', '/images/id71-5.jpg'],
    '102-0071',
    '首都圏',
    '東京都',
    '23区',
    '千代田区',
    'for sale',    
-- NEW FIELD VALUES (NULL for 中古マンション):
    NULL, -- direction
    NULL, -- urbanPlanning
    NULL, -- condominiumSalesCompany
    NULL, -- constructionCompany
    NULL, -- designCompany
    NULL, -- managementCompany
    NULL, -- buildingArea
    NULL, -- landArea
    NULL, -- accessSituation
    NULL, -- buildingCoverageRatio
    NULL, -- floorAreaRatio
    NULL, -- estimatedRent
    NULL, -- assumedYield
    NULL, -- currentRent
    NULL, -- currentYield
    NULL, -- rentalStatus
    NULL, -- numberOfUnitsInTheBuilding
    NULL  -- exclusiveAreaOfEachResidence     
),
(
    '新宿区若葉3丁目 戸建',
    120000000,
    2999500,
    '東京都新宿区若葉３丁目',
    '2SLDK',
    85.15,
    '7階 / 地上18階建',
    'RC',
    56700,
    '準工業地域',
    '中央・総武緩行線 信濃町駅 徒歩8分, 中央本線 四ツ谷駅 徒歩10分, 東京メトロ丸ノ内線 四谷三丁目駅 徒歩11分',
    8,
    ST_SetSRID(ST_MakePoint(139.7244885595173, 35.682146766984815), 4326),
    '中古戸建',
    '2009年11月築',
    12.61,
    69,
    15100,
    NULL,
    NULL,
    NULL,
    '管理費込み、インターネット使用料込み',
    NULL,
    '有',
    '有',
    NULL,
    '相談',
    '所有権',
    '全部委託／日勤',
    '届出不要',
    '居住中',
    '相談',
    '仲介',
    1122083505,
    '2025-05-29',
    '2025-06-12',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    '59.14㎡(約17.88坪), ※セットバック約7.7㎡を含む, ※別途私道約39.27㎡有 (共有持分 2/15)管理会社に全部委託',
    ARRAY['/images/id72-1.jpg', '/images/id72-2.jpg', '/images/id72-3.jpg', '/images/id72-4.jpg', '/images/id72-5.jpg'],
    '160-0011',
    '首都圏',
    '東京都',
    '23区',
    '新宿区',
    'for sale',    
-- NEW FIELD VALUES (NULL for 中古マンション):
    NULL, -- direction
    NULL, -- urbanPlanning
    NULL, -- condominiumSalesCompany
    NULL, -- constructionCompany
    NULL, -- designCompany
    NULL, -- managementCompany
    NULL, -- buildingArea
    NULL, -- landArea
    NULL, -- accessSituation
    NULL, -- buildingCoverageRatio
    NULL, -- floorAreaRatio
    NULL, -- estimatedRent
    NULL, -- assumedYield
    NULL, -- currentRent
    NULL, -- currentYield
    NULL, -- rentalStatus
    NULL, -- numberOfUnitsInTheBuilding
    NULL  -- exclusiveAreaOfEachResidence     
),
(
    '新宿区市谷加賀町1丁目 新築戸建',
    275800000,
    2999500,
    '東京都新宿区市谷加賀町１丁目',
    '3SLDK',
    143.85,
    '7階 / 地上18階建',
    'RC',
    56700,
    '準工業地域',
    '都営大江戸線 牛込柳町駅 徒歩6分, 東京メトロ南北線 市ケ谷駅 徒歩12分, 都営大江戸線 牛込神楽坂駅 徒歩9分',
    6,
    ST_SetSRID(ST_MakePoint(139.73048715341028, 35.697393504521024), 4326),
    '新築戸建',
    '2025年12月築（予定）',
    12.61,
    69,
    15100,
    NULL,
    NULL,
    NULL,
    '管理費込み、インターネット使用料込み',
    NULL,
    '有',
    '有',
    NULL,
    '相談',
    '所有権',
    '全部委託／日勤',
    '届出不要',
    '居住中',
    '相談',
    '仲介',
    1122083505,
    '2025-05-29',
    '2025-06-12',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    '建物面積には駐車場面積（１６．６０平米）を含む',
    ARRAY['/images/id73-1.jpg', '/images/id73-2.jpg', '/images/id73-3.jpg', '/images/id73-4.jpg', '/images/id73-5.jpg'],
    '160-0011',
    '首都圏',
    '東京都',
    '23区',
    '新宿区',
    'for sale',    
-- NEW FIELD VALUES (NULL for 中古マンション):
    NULL, -- direction
    NULL, -- urbanPlanning
    NULL, -- condominiumSalesCompany
    NULL, -- constructionCompany
    NULL, -- designCompany
    NULL, -- managementCompany
    NULL, -- buildingArea
    NULL, -- landArea
    NULL, -- accessSituation
    NULL, -- buildingCoverageRatio
    NULL, -- floorAreaRatio
    NULL, -- estimatedRent
    NULL, -- assumedYield
    NULL, -- currentRent
    NULL, -- currentYield
    NULL, -- rentalStatus
    NULL, -- numberOfUnitsInTheBuilding
    NULL  -- exclusiveAreaOfEachResidence     
);