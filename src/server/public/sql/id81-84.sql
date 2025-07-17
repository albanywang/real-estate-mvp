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
    '横濱ユーロタワー',
    139000000,
    2999500,
    '神奈川県横浜市中区山下町',
    '2LDK',
    75.2,
    '15階 / 地上27階建',
    'RC',
    33610,
    '準工業地域',
    'みなとみらい線 元町・中華街駅 徒歩3分, みなとみらい線 日本大通り駅 徒歩6分, 京浜東北・根岸線 石川町駅 徒歩12分',
    3,
    ST_SetSRID(ST_MakePoint(139.646820915346, 35.444480594599824), 4326),
    '中古マンション',
    '2004年08月築',
    12.5,
    97,
    21210,
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
    '日勤',
    '届出不要',
    '空家',
    '相談',
    '仲介',
    1122083505,
    '2025-06-15',
    '2025-06-29',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    '敷地内有 (賃貸) 空き：1台有り, 月額 0円 (確認日：西暦2025年01月05日現在)インターネット 935円 / 月, 管理会社に全部委託',
    ARRAY['/images/id81-1.jpg', '/images/id81-2.jpg', '/images/id81-3.jpg', '/images/id81-4.jpg', '/images/id81-5.jpg'],
    '231-0023',
    '首都圏',
    '神奈川県',
    '横浜市',
    '中区',
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
    'ワコーレロイヤルヒルズ横浜蒔田',
    23800000,
    2999500,
    '神奈川県横浜市南区蒔田町',
    '2LDK',
    50,
    '7階 / 地上9階建',
    'RC',
    8800,
    '準工業地域',
    '横浜市ブルーライン 蒔田駅 徒歩15分',
    15,
    ST_SetSRID(ST_MakePoint(139.6136698981445, 35.42448913694229), 4326),
    '中古マンション',
    '1992年09月築',
    6.91,
    161,
    11440,
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
    '日勤',
    '届出不要',
    '空家',
    '相談',
    '仲介',
    1122083505,
    '2025-06-14',
    '2025-06-28',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    '管理会社に全部委託',
    ARRAY['/images/id82-1.jpg', '/images/id82-2.jpg', '/images/id82-3.jpg', '/images/id82-4.jpg', '/images/id82-5.jpg'],
    '232-0016',
    '首都圏',
    '神奈川県',
    '横浜市',
    '南区',
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
    'グレーシアテラス東戸塚',
    30990000,
    2999500,
    '神奈川県横浜市保土ケ谷区権太坂１丁目',
    '3LDK',
    81.97,
    '4階 / 地上7階建',
    'RC',
    12900,
    '準工業地域',
    '横須賀線 東戸塚駅 バス10分 境木中学校前 停歩8分, 横須賀線 東戸塚駅 徒歩27分',
    27,
    ST_SetSRID(ST_MakePoint(139.56881257672998, 35.44192133263444), 4326),
    '中古マンション',
    '2009年02月築',
    13.4,
    90,
    17220,
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
    '日勤',
    '届出不要',
    '空家',
    '相談',
    '仲介',
    1122083505,
    '2025-06-13',
    '2025-06-27',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    '敷地内有 (賃貸) 空き：1台有り, 月額 4,500円〜12,000円 (確認日：西暦2024年09月30日現在), 管理会社に全部委託',
    ARRAY['/images/id83-1.jpg', '/images/id83-2.jpg', '/images/id83-3.jpg', '/images/id83-4.jpg', '/images/id83-5.jpg'],
    '240-0026',
    '首都圏',
    '神奈川県',
    '横浜市',
    '保土ケ谷区',
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
    'ヒルトップ横濱根岸 セントラルコート',
    38800000,
    2999500,
    '神奈川県横浜市磯子区丸山１丁目',
    '4LDK',
    105.82,
    '7階 / 地上8階建',
    'RC',
    14700,
    '準工業地域',
    '横浜市ブルーライン 蒔田駅 徒歩19分, 京浜東北・根岸線 根岸駅 バス18分 磯子フラット 停歩2分',
    19,
    ST_SetSRID(ST_MakePoint(139.61902201720147, 35.42348654307343), 4326),
    '中古マンション',
    '1990年08月築',
    22.92,
    279,
    15890,
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
    '日勤',
    '届出不要',
    '空家',
    '相談',
    '仲介',
    1122083505,
    '2025-06-16',
    '2025-06-30',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    'ルーフバルコニー使用料 500円 / 月, 管理会社に全部委託',
    ARRAY['/images/id84-1.jpg', '/images/id84-2.jpg', '/images/id84-3.jpg', '/images/id84-4.jpg', '/images/id84-5.jpg'],
    '235-0011',
    '首都圏',
    '神奈川県',
    '横浜市',
    '磯子区',
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
