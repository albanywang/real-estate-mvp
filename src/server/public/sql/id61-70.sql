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
    '成増ハウス',
    65800000,
    2999500,
    '東京都板橋区成増１丁目',
    '4LDK',
    89.85,
    '4階 / 地上10階建',
    'RC',
    13220,
    '準工業地域',
    '東京メトロ有楽町線 地下鉄成増駅 徒歩6分, 東京メトロ副都心線 地下鉄成増駅 徒歩6分, 東武東上線 成増駅 徒歩9分',
    6,
    ST_SetSRID(ST_MakePoint(139.62595963685754, 35.77801966104001), 4326),
    '中古マンション',
    '2019年06月築',
    18.41,
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
    '管理会社に全部委託',
    ARRAY['/images/id61-1.jpg', '/images/id61-2.jpg', '/images/id61-3.jpg', '/images/id61-4.jpg', '/images/id61-5.jpg'],
    '175-0094',
    '首都圏',
    '東京都',
    '23区',
    '板橋区',
    ,
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
    'リビオシティ・ルネ葛西',
    58800000,
    2999500,
    '東京都江戸川区東葛西９丁目',
    '3LDK',
    68.15,
    '11階 / 地上14階建',
    'RC',
    11900,
    '準工業地域',
    '東京メトロ東西線 葛西駅 徒歩19分, 東京メトロ東西線 葛西駅 バス7分 東葛西八丁目 停歩2分, 京葉線 葛西臨海公園駅 バス14分 東葛西八丁目 停歩1分',
    19,
    ST_SetSRID(ST_MakePoint(139.88165205156068,35.655029764438204), 4326),
    '中古マンション',
    '2019年06月築',
    11.1,
    439,
    8180,
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
    'インターネット使用料 605円 / 月、コミュニティクラブ会費 500円 / 月, 管理会社に全部委託',
    ARRAY['/images/id62-1.jpg', '/images/id62-2.jpg', '/images/id62-3.jpg', '/images/id62-4.jpg', '/images/id62-5.jpg'],
    '134-0084',
    '首都圏',
    '東京都',
    '23区',
    '江戸川区',
    ,
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
    'プレシス八王子',
    44800000,
    2999500,
    '東京都八王子市寺町',
    '3LDK',
    68.05,
    '2階 / 地上15階建',
    'RC',
    10140,
    '準工業地域',
    '中央本線 八王子駅 徒歩6分, 京王電鉄京王線 京王八王子駅 徒歩10分',
    6,
    ST_SetSRID(ST_MakePoint(139.33446774885599,35.65721502170917), 4326),
    '中古マンション',
    '2014年02月築',
    8.32,
    70,
    11980,
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
    '2025-05-29',
    '2025-06-12',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    '敷地内有 (所有権) 空き：1台有り, 月額 20,000円〜23,000円 (確認日：西暦2025年06月05日現在), 管理会社に全部委託',
    ARRAY['/images/id63-1.jpg', '/images/id63-2.jpg', '/images/id63-3.jpg', '/images/id63-4.jpg', '/images/id63-5.jpg'],
    '192-0073',
    '首都圏',
    '東京都',
    '市部',
    '八王子市',
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
    'ラ・シード立川セレンシア',
    20800000,
    2999500,
    '東京都立川市錦町１丁目',
    '1K',
    21.39,
    '7階 / 地上8階建',
    'RC',
    8795,
    '準工業地域',
    '中央本線 立川駅 徒歩7分, 多摩モノレール 立川南駅 徒歩8分, 南武線 西国立駅 徒歩10分',
    7,
    ST_SetSRID(ST_MakePoint(139.41833435582413, 35.69718189533199), 4326),
    '中古マンション',
    '2009年08月築',
    3.87,
    33,
    11980,
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
    '賃貸中',
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
    '賃貸中（賃貸借契約引継要）, 管理会社に全部委託',
    ARRAY['/images/id64-1.jpg', '/images/id64-2.jpg', '/images/id64-3.jpg', '/images/id64-4.jpg', '/images/id64-5.jpg'],
    '190-0022',
    '首都圏',
    '東京都',
    '市部',
    '立川市',
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
    '吉祥寺オリンピックマンション',
    60980000,
    2999500,
    '東京都武蔵野市吉祥寺南町２丁目',
    '2LDK',
    59.82,
    '4階 / 地上5階建',
    'RC',
    17340,
    '準工業地域',
    '中中央本線 吉祥寺駅 徒歩6分, 京王電鉄井の頭線 吉祥寺駅 徒歩6分',
    6,
    ST_SetSRID(ST_MakePoint(139.5841938134945, 35.70079613787586), 4326),
    '中古マンション',
    '1982年04月築',
    5.24,
    33,
    14590,
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
    '2025-05-29',
    '2025-06-12',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    '管理会社に全部委託',
    ARRAY['/images/id65-1.jpg', '/images/id65-2.jpg', '/images/id65-3.jpg', '/images/id65-4.jpg', '/images/id65-5.jpg'],
    '180-0003',
    '首都圏',
    '東京都',
    '市部',
    '武蔵野市', 
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
    'プラウドシティ吉祥寺',
    85800000,
    2999500,
    '東京都三鷹市下連雀５丁目',
    '2LDK',
    70.66,
    '6階 / 地上8階建',
    'RC',
    1850,
    '準工業地域',
    '中央本線 吉祥寺駅 バス12分 プラウドシティ吉祥寺 停歩1分, 中央本線 三鷹駅 バス11分 プラウドシティ吉祥寺 停歩1分, 京王電鉄井の頭線 井の頭公園駅 徒歩20分',
    20,
    ST_SetSRID(ST_MakePoint(139.57210648105757, 35.689386456455736), 4326),
    '中古マンション',
    '2020年10月築',
    11.72,
    682,
    9680,
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
    'コミュニティ形成費 200円 / 月、enecoQシステム料金 1,606円 / 月, 管理会社に全部委託',
    ARRAY['/images/id66-1.jpg', '/images/id66-2.jpg', '/images/id66-3.jpg', '/images/id66-4.jpg', '/images/id66-5.jpg'],
    '181-0013',
    '首都圏',
    '東京都',
    '市部',
    '三鷹市',
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
    'カサーレ青梅末広町',
    36800000,
    2999500,
    '東京都青梅市末広町２丁目',
    '3LDK',
    83.71,
    '9階 / 地上10階建',
    'RC',
    9100,
    '準工業地域',
    '青梅線 小作駅 徒歩10分',
    10,
    ST_SetSRID(ST_MakePoint(139.30919299999996,35.77853286161059), 4326),
    '中古マンション',
    '2016年01月築',
    11.15,
    682,
    10890,
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
    'スカパーJAST施設利用料 486円 / 月、インターネット利用料 950円 / 月, 管理会社に全部委託',
    ARRAY['/images/id67-1.jpg', '/images/id67-2.jpg', '/images/id67-3.jpg', '/images/id67-4.jpg', '/images/id67-5.jpg'],
    '198-0025',
    '首都圏',
    '東京都',
    '市部',
    '青梅市',
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
    'ルイシャトレ府中是政',
    32800000,
    2999500,
    '東京都府中市是政４丁目',
    '3LDK',
    75.16,
    '2階 / 地上8階建',
    'RC',
    11750,
    '準工業地域',
    '西武多摩川線 競艇場前駅 徒歩7分, 西武多摩川線 是政駅 徒歩13分, 京王電鉄京王線 多磨霊園駅 徒歩15分',
    7,
    ST_SetSRID(ST_MakePoint(139.4962855423295, 35.65898381335241), 4326),
    '中古マンション',
    '2006年08月築',
    10.72,
    94,
    9160,
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
    'インターネット使用料 1,760円 / 月, 管理会社に全部委託',
    ARRAY['/images/id68-1.jpg', '/images/id68-2.jpg', '/images/id68-3.jpg', '/images/id68-4.jpg', '/images/id68-5.jpg'],
    '183-0013',
    '首都圏',
    '東京都',
    '市部',
    '府中市',
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
    'ライオンズ東中神',
    52800000,
    2999500,
    '東京都昭島市玉川町３丁目',
    '3LDK',
    100.9,
    '7階 / 地上7階建',
    'RC',
    18590,
    '準工業地域',
    '青梅線 東中神駅 徒歩6分',
    6,
    ST_SetSRID(ST_MakePoint(139.4962855423295, 35.65898381335241), 4326),
    '中古マンション',
    '2006年11月築',
    7.51,
    34,
    35920,
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
    'ルーフバルコニー使用料 630円 / 月, ルーフバルコニー: 31.44, 敷地内有 (賃貸) 空き：1台有り月額 10,000円〜12,000円 (確認日：西暦2024年10月17日現在), 管理会社に全部委託',
    ARRAY['/images/id69-1.jpg', '/images/id69-2.jpg', '/images/id69-3.jpg', '/images/id69-4.jpg', '/images/id69-5.jpg'],
    '196-0034',
    '首都圏',
    '東京都',
    '市部',
    '昭島市',
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
    'フォルスコート調布染地公園',
    39800000,
    2999500,
    '東京都昭島市玉川町３丁目',
    '3LDK',
    100.9,
    '7階 / 地上7階建',
    'RC',
    18590,
    '準工業地域',
    '青梅線 東中神駅 徒歩6分',
    6,
    ST_SetSRID(ST_MakePoint(139.4962855423295, 35.65898381335241), 4326),
    '中古マンション',
    '2006年11月築',
    7.51,
    34,
    35920,
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
    'ルーフバルコニー使用料 630円 / 月, ルーフバルコニー: 31.44, 敷地内有 (賃貸) 空き：1台有り月額 10,000円〜12,000円 (確認日：西暦2024年10月17日現在), 管理会社に全部委託',
    ARRAY['/images/id69-1.jpg', '/images/id69-2.jpg', '/images/id69-3.jpg', '/images/id69-4.jpg', '/images/id69-5.jpg'],
    '196-0034',
    '首都圏',
    '東京都',
    '市部',
    '昭島市',
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