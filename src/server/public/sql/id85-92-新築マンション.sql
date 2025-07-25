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
    'THE TOYOMI TOWER MARINE&SKY 東ウイング',
    318000000,
    2999500,
    '東京都中央区豊海町',
    '3LDK',
    88.95,
    '30階 / 地上53階建',
    'RC',
    35770,
    '準工業地域',
    '都営大江戸線 勝どき駅 徒歩10分',
    10,
    ST_SetSRID(ST_MakePoint(139.77055606747243, 35.65386828225163), 4326),
    '新築マンション',
    '2026年11月築（予定）',
    6.56,
    2046,
    15550,
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
    '常勤',
    '届出不要',
    '未完成',
    '相談',
    '仲介',
    1122083505,
    '2025-06-07',
    '2025-06-21',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    'インターネット使用料 715円 / 月, ※専有防災倉庫面積0.93平米 ※上記建物構造欄に「鉄筋コンクリート造」とありますが、正しくは「鉄筋コンクリート造一部鉄骨造」となります。',
    ARRAY['/images/id85-1.jpg', '/images/id85-2.jpg', '/images/id85-3.jpg', '/images/id85-4.jpg', '/images/id85-5.jpg'],
    '104-0055',
    '首都圏',
    '東京都',
    '23区',
    '中央区',
    'for sale',    
-- NEW FIELD VALUES (NULL for 中古マンション):
    NULL, -- direction
    NULL, -- urbanPlanning
    '住友不動産株式会社', -- condominiumSalesCompany
    '住友不動産株式会社', -- constructionCompany
    '株式会社日建設計', -- designCompany
    '住友不動産建物サービス株式会社', -- managementCompany
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
    'THE TOYOMI TOWER MARINE&SKY 西ウイング',
    310000000,
    2999500,
    '東京都中央区豊海町',
    '3LDK',
    84.1,
    '24階 / 地上53階建',
    'RC',
    33840,
    '準工業地域',
    '都営大江戸線 勝どき駅 徒歩10分',
    10,
    ST_SetSRID(ST_MakePoint(139.77017693587004, 35.65375400241585), 4326),
    '新築マンション',
    '2026年11月築（予定）',
    7.34,
    2046,
    14710,
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
    '常勤',
    '届出不要',
    '未完成',
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
    '※2026年11月下旬竣工予定です。※建築確認上は地上54階建です。※上記建物構造欄正しくは「鉄筋コンクリート造一部鉄骨造」です。※分譲時売主によるアフターサービスの承継はできません。',
    ARRAY['/images/id86-1.jpg', '/images/id86-2.jpg', '/images/id86-3.jpg', '/images/id86-4.jpg', '/images/id86-5.jpg'],
    '104-0055',
    '首都圏',
    '東京都',
    '23区',
    '中央区',
    'for sale',    
-- NEW FIELD VALUES (NULL for 中古マンション):
    NULL, -- direction
    NULL, -- urbanPlanning
    '住友不動産株式会社', -- condominiumSalesCompany
    '住友不動産株式会社', -- constructionCompany
    '株式会社日建設計', -- designCompany
    '住友不動産建物サービス株式会社', -- managementCompany
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
    'WORLD TOWER RESIDENCE',
    199800000,
    2999500,
    '東京都港区浜松町２丁目',
    '1LDK',
    40.3,
    '15階 / 地上46階建',
    'RC',
    29570,
    '準工業地域',
    '山手線 浜松町駅 徒歩2分, 東京モノレール モノレール浜松町駅 徒歩3分, 都営大江戸線 大門駅 徒歩4分',
    2,
    ST_SetSRID(ST_MakePoint(139.75617552641793,35.654770564701174), 4326),
    '新築マンション',
    '2024年11月築',
    7.8,
    389,
    8750,
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
    'インターネット使用料 1,430円 / 月、住宅共用施設予約システム使用料 1,100円 / 月, 管理会社に全部委託',
    ARRAY['/images/id87-1.jpg', '/images/id87-2.jpg', '/images/id87-3.jpg', '/images/id87-4.jpg', '/images/id87-5.jpg'],
    '105-0013',
    '首都圏',
    '東京都',
    '23区',
    '港区',
    'for sale',    
-- NEW FIELD VALUES (NULL for 中古マンション):
    NULL, -- direction
    NULL, -- urbanPlanning
    '住友不動産株式会社', -- condominiumSalesCompany
    '住友不動産株式会社', -- constructionCompany
    '株式会社日建設計', -- designCompany
    '住友不動産建物サービス株式会社', -- managementCompany
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
    '三田ガーデンヒルズ パークマンション棟',
    998000000,
    2999500,
    '東京都港区三田１丁目',
    '2LDK',
    103.17,
    '2階 / 地上14階建',
    'RC',
    149808,
    '準工業地域',
    '東京メトロ南北線 麻布十番駅 徒歩7分, 都営大江戸線 麻布十番駅 徒歩7分, 都営三田線 芝公園駅 徒歩11分',
    7,
    ST_SetSRID(ST_MakePoint(139.74095342329653,35.652784896595676), 4326),
    '新築マンション',
    '2024年12月築',
    12.01,
    1002,
    35180,
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
    '2025-06-11',
    '2025-06-25',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    '駐車場専用使用料 68,000円 / 月、トランクルーム使用料 4,590円 / 月、インターネット接続料 1,430円 / 月, 専有面積にトランクルーム面積0.71平米を含みます。 管理会社に全部委託',
    ARRAY['/images/id88-1.jpg', '/images/id88-2.jpg', '/images/id88-3.jpg', '/images/id88-4.jpg', '/images/id88-5.jpg'],
    '108-0073',
    '首都圏',
    '東京都',
    '23区',
    '港区',
    'for sale',    
-- NEW FIELD VALUES (NULL for 中古マンション):
    NULL, -- direction
    NULL, -- urbanPlanning
    '住友不動産株式会社', -- condominiumSalesCompany
    '住友不動産株式会社', -- constructionCompany
    '株式会社日建設計', -- designCompany
    '住友不動産建物サービス株式会社', -- managementCompany
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
    'パークシティ高田馬場',
    199000000,
    2999500,
    '東京都新宿区高田馬場４丁目',
    '3LDK',
    78.78,
    '8階 / 地上13階建',
    'RC',
    28990,
    '準工業地域',
    '山手線 高田馬場駅 徒歩7分, 東京メトロ東西線 高田馬場駅 徒歩7分, 西武新宿線 高田馬場駅 徒歩7分',
    7,
    ST_SetSRID(ST_MakePoint(139.6983141865055, 35.711260750837525), 4326),
    '新築マンション',
    '2025年06月築',
    8.37,
    325,
    13630,
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
    '2025-06-12',
    '2025-06-26',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    '三井不動産レジデンシャル㈱ (新築分譲時における売主)。 管理会社に全部委託',
    ARRAY['/images/id89-1.jpg', '/images/id89-2.jpg', '/images/id89-3.jpg', '/images/id89-4.jpg', '/images/id89-5.jpg'],
    '169-0075',
    '首都圏',
    '東京都',
    '23区',
    '新宿区',
    'for sale',    
-- NEW FIELD VALUES (NULL for 中古マンション):
    NULL, -- direction
    NULL, -- urbanPlanning
    '住友不動産株式会社', -- condominiumSalesCompany
    '住友不動産株式会社', -- constructionCompany
    '株式会社日建設計', -- designCompany
    '住友不動産建物サービス株式会社', -- managementCompany
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
    'パークタワー西新宿',
    120000000,
    2999500,
    '東京都新宿区西新宿５丁目',
    '1LDK',
    42.83,
    '8階 / 地上40階建',
    'RC',
    19280,
    '準工業地域',
    '都営大江戸線 西新宿五丁目駅 徒歩6分, 東京メトロ丸ノ内線 西新宿駅 徒歩10分, 山手線 新宿駅 徒歩18分',
    6,
    ST_SetSRID(ST_MakePoint(139.6863088981538, 35.693207561504614), 4326),
    '新築マンション',
    '2024年11月築',
    7.08,
    470,
    6420,
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
    '2025-06-12',
    '2025-06-26',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    '敷地内有 (賃貸) 空き：10台有り, 月額 33,500円〜52,000円 (確認日：西暦2025年05月19日現在) 管理会社に全部委託',
    ARRAY['/images/id90-1.jpg', '/images/id90-2.jpg', '/images/id90-3.jpg', '/images/id90-4.jpg', '/images/id90-5.jpg'],
    '160-0023',
    '首都圏',
    '東京都',
    '23区',
    '新宿区',
    'for sale',    
-- NEW FIELD VALUES (NULL for 中古マンション):
    NULL, -- direction
    NULL, -- urbanPlanning
    '住友不動産株式会社', -- condominiumSalesCompany
    '住友不動産株式会社', -- constructionCompany
    '株式会社日建設計', -- designCompany
    '住友不動産建物サービス株式会社', -- managementCompany
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
    'ルジェンテ小石川播磨坂',
    168000000,
    2999500,
    '東京都文京区小石川４丁目',
    '2LDK',
    53.72,
    '4階 / 地上10階建',
    'RC',
    34700,
    '準工業地域',
    '東京メトロ丸ノ内線 茗荷谷駅 徒歩10分',
    10,
    ST_SetSRID(ST_MakePoint(139.7439074748572, 35.716943265171636), 4326),
    '新築マンション',
    '2025年04月築',
    7.08,
    470,
    9300,
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
    '2025-06-12',
    '2025-06-26',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    'インターネットサービス利用料 1,320円 / 月、個別宅配ボックス利用料 220円 / 月, 管理会社に全部委託',
    ARRAY['/images/id91-1.jpg', '/images/id91-2.jpg', '/images/id91-3.jpg', '/images/id91-4.jpg', '/images/id91-5.jpg'],
    '112-0002',
    '首都圏',
    '東京都',
    '23区',
    '文京区',
    'for sale',    
-- NEW FIELD VALUES (NULL for 中古マンション):
    NULL, -- direction
    NULL, -- urbanPlanning
    '住友不動産株式会社', -- condominiumSalesCompany
    '住友不動産株式会社', -- constructionCompany
    '株式会社日建設計', -- designCompany
    '住友不動産建物サービス株式会社', -- managementCompany
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
    'Brillia目黒大橋',
    153000000,
    2999500,
    '東京都目黒区大橋２丁目',
    '2LDK',
    58,
    '2階 / 地上5階建',
    'RC',
    20940,
    '準工業地域',
    '東急田園都市線 池尻大橋駅 徒歩5分',
    5,
    ST_SetSRID(ST_MakePoint(139.6861869325276, 35.652570050560925), 4326),
    '新築マンション',
    '2025年02月築',
    27.13,
    470,
    6440,
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
    '2025-06-06',
    '2025-06-20',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    'インターネット 1,441円 / 月, 管理会社に全部委託',
    ARRAY['/images/id92-1.jpg', '/images/id92-2.jpg', '/images/id92-3.jpg', '/images/id92-4.jpg', '/images/id92-5.jpg'],
    '153-0044',
    '首都圏',
    '東京都',
    '23区',
    '目黒区',
    'for sale',    
-- NEW FIELD VALUES (NULL for 中古マンション):
    NULL, -- direction
    NULL, -- urbanPlanning
    '三井不動産レジデンシャル株式会社', -- condominiumSalesCompany
    '株式会社大林組', -- constructionCompany
    '株式会社日建設計', -- designCompany
    '三井不動産レジデンシャルサービス株式会社', -- managementCompany
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
