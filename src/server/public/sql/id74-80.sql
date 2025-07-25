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
    zipcode, area_level_1, area_level_2, area_level_3, area_level_4, status     
)
VALUES (
    'メゾン岸谷',
    22800000,
    2999500,
    '神奈川県横浜市鶴見区岸谷４丁目',
    '3LDK',
    60.5,
    '1階 / 地上5階建',
    'RC',
    13220,
    '準工業地域',
    '京急本線 花月総持寺駅 徒歩10分, 京急本線 生麦駅 徒歩10分, 京浜東北・根岸線 鶴見駅 徒歩19分',
    10,
    ST_SetSRID(ST_MakePoint(139.66800083928624, 35.49938416355617), 4326),
    '中古マンション',
    '1976年10月築',
    6.6,
    157,
    18160,
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
    '管理会社に全部委託',
    ARRAY['/images/id74-1.jpg', '/images/id74-2.jpg', '/images/id74-3.jpg', '/images/id74-4.jpg', '/images/id74-5.jpg'],
    '230-0078',
    '首都圏',
    '神奈川県',
    '横浜市',
    '鶴見区',
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
    'アリュール鶴見東寺尾',
    42000000,
    2999500,
    '神奈川県横浜市鶴見区岸谷４丁目',
    '3LDK',
    60.5,
    '1階 / 地上5階建',
    'RC',
    13220,
    '準工業地域',
    '京急本線 花月総持寺駅 徒歩10分, 京急本線 生麦駅 徒歩10分, 京浜東北・根岸線 鶴見駅 徒歩19分',
    10,
    ST_SetSRID(ST_MakePoint(139.66800083928624, 35.49938416355617), 4326),
    '中古マンション',
    '1976年10月築',
    6.6,
    157,
    18160,
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
    '管理会社に全部委託',
    ARRAY['/images/id75-1.jpg', '/images/id75-2.jpg', '/images/id75-3.jpg', '/images/id75-4.jpg', '/images/id75-5.jpg'],
    '230-0078',
    '首都圏',
    '神奈川県',
    '横浜市',
    '鶴見区',
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
    'ライオンズマンション菊名第3',
    18900000,
    530000,
    '神奈川県横浜市鶴見区北寺尾７丁目',
    '1SLDK',
    52.65,
    '1階 / 地上5階建',
    '鉄筋コンクリート造',
    16300,
    'NULL',
    '東急東横線 菊名駅 徒歩14分, 横浜線 菊名駅 徒歩14分, 京浜東北・根岸線 鶴見駅 バス20分 上の宮中学 停歩1分',
    14,
    ST_SetSRID(ST_MakePoint(35.512463663315415, 139.641994915346), 4326), 
    '中古マンション',
    '1989年12月築',
    6.53,
    31,
    14690,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '有',
    '有',
    NULL,
    NULL,
    '所有権',
    '管理会社に全部委託',
    '届出不要',
    '空家',
    '相談',
    '仲介',
    NULL,
    '2025-06-08',
    '2025-06-22',
    '-',
    NULL,
    '空き無',
    'NULL',
    'NULL',
    'NULL',
    '-',
    ARRAY['/images/id76-1.jpg','/images/id76-2.jpg','/images/id76-3.jpg','/images/id76-4.jpg','/images/id76-5.jpg'],
    '230-0074',
    '首都圏',
    '神奈川県',
    '横浜市',
    '鶴見区',
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
    'ザ・パークハウス横浜新子安ガーデン',
    74800000,
    530000,
    '神奈川県横浜市神奈川区新子安１丁目',
    '3LDK',
    73.94,
    '2階 / 地上11階建',
    '鉄筋コンクリート造',
    17980,
    'NULL',
    '京浜東北・根岸線 新子安駅 徒歩5分, 京急本線 京急新子安駅 徒歩4分, 横浜線 大口駅 徒歩14分',
    5,
    ST_SetSRID(ST_MakePoint(35.512463663315415, 139.641994915346), 4326), 
    '中古マンション',
    '2015年01月築',
    12.4,
    497,
    20710,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '有',
    '有',
    NULL,
    NULL,
    '所有権',
    '管理会社に全部委託',
    '届出不要',
    '居住中',
    '相談',
    '仲介',
    NULL,
    '2025-06-16',
    '2025-06-29',
    '-',
    NULL,
    '空き無',
    'NULL',
    'NULL',
    'NULL',
    'インターネット利用料 814円 / 月、共視聴設備利用料 275円 / 月, 敷地内有 (賃貸) 空き：5台有り 月額 15,000円〜20,000円 (確認日：西暦2025年06月12日現在)',
    ARRAY['/images/id77-1.jpg','/images/id77-2.jpg','/images/id77-3.jpg','/images/id77-4.jpg','/images/id77-5.jpg'],
    '221-0013',
    '首都圏',
    '神奈川県',
    '横浜市',
    '神奈川区',
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
    'THE YOKOHAMA FRONT TOWER',
    214800000,
    530000,
    '神奈川県横浜市神奈川区鶴屋町１丁目',
    '3LDK',
    85.08,
    '14階 / 地上43階建',
    '鉄筋コンクリート造',
    17980,
    'NULL',
    '京浜東北・根岸線 横浜駅 徒歩3分,東急東横線 横浜駅 徒歩3分,京急本線 横浜駅 徒歩3分',
    3,
    ST_SetSRID(ST_MakePoint(139.6238101865095, 35.46886747579345), 4326), 
    '中古マンション',
    '2023年12月築',
    19.28,
    459,
    20710,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '有',
    '有',
    NULL,
    NULL,
    '所有権',
    '管理会社に全部委託',
    '届出不要',
    '居住中',
    '相談',
    '仲介',
    NULL,
    '2025-06-16',
    '2025-06-30',
    '-',
    NULL,
    '空き無',
    'NULL',
    'NULL',
    'NULL',
    'イ管理会社に全部委託',
    ARRAY['/images/id78-1.jpg','/images/id78-2.jpg','/images/id78-3.jpg','/images/id78-4.jpg','/images/id78-5.jpg'],
    '221-0835',
    '首都圏',
    '神奈川県',
    '横浜市',
    '神奈川区',
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
    '横浜南軽井沢パーク・ホームズ',
    69800000,
    530000,
    '神奈川県横浜市西区南軽井沢',
    '3LDK',
    105.74,
    '5階 / 地上5階建',
    '鉄筋コンクリート造',
    25380,
    'NULL',
    '横浜市ブルーライン 横浜駅 徒歩12分, 東海道本線（東京～熱海） 横浜駅 徒歩15分, 相模鉄道本線 横浜駅 徒歩14分',
    12,
    ST_SetSRID(ST_MakePoint(139.6238101865095, 35.46886747579345), 4326), 
    '中古マンション',
    '1987年05月築',
    65.61,
    23,
    26650,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '有',
    '有',
    NULL,
    NULL,
    '所有権',
    '管理会社に全部委託',
    '届出不要',
    '空家',
    '相談',
    '仲介',
    NULL,
    '2025-06-16',
    '2025-06-30',
    '-',
    NULL,
    '空き無',
    'NULL',
    'NULL',
    'NULL',
    '敷地内有 (賃貸) 空き：1台有り, 月額 23,400円 (確認日：西暦2025年06月15日現在), 管理会社に全部委託',
    ARRAY['/images/id79-1.jpg','/images/id79-2.jpg','/images/id79-3.jpg','/images/id79-4.jpg','/images/id79-5.jpg'],
    '220-0002',
    '首都圏',
    '神奈川県',
    '横浜市',
    '西区',
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
    'M.M.タワーズ ザ・イースト',
    122900000,
    530000,
    '神奈川県横浜市西区みなとみらい４丁目',
    '2LDK',
    70.54,
    '18階 / 地上30階建',
    '鉄筋コンクリート造',
    18800,
    'NULL',
    'みなとみらい線 みなとみらい駅 徒歩4分',
    4,
    ST_SetSRID(ST_MakePoint(139.63274391534597, 35.46077017145185), 4326), 
    '中古マンション',
    '2003年01月築',
    14.06,
    287,
    29600,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '有',
    '有',
    NULL,
    NULL,
    '所有権',
    '管理会社に全部委託',
    '届出不要',
    '空家',
    '相談',
    '仲介',
    NULL,
    '2025-06-16',
    '2025-06-30',
    '-',
    NULL,
    '空き無',
    'NULL',
    'NULL',
    'NULL',
    '敷地内有 (賃貸) 空き：1台有り, 月額 25,700円〜32,000円 (確認日：西暦2024年10月06日現在), 管理会社に全部委託',
    ARRAY['/images/id80-1.jpg','/images/id80-2.jpg','/images/id80-3.jpg','/images/id80-4.jpg','/images/id80-5.jpg'],
    '220-0012',
    '首都圏',
    '神奈川県',
    '横浜市',
    '西区',
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
