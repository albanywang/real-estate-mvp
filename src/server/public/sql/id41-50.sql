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
    'シティタワーズ豊洲ザ・ツイン サウスタワー',
    199000000,
    2999500,
    '東京都江東区豊洲３丁目',
    '3LDK',
    86.65,
    '24階 / 地上48階建',
    'RC',
    21440,
    '準工業地域',
    '東京メトロ有楽町線 豊洲駅 徒歩4分, ゆりかもめ 豊洲駅 徒歩6分',
    6,
    ST_SetSRID(ST_MakePoint(139.79902357670514,35.65775190277236), 4326),
    '中古マンション',
    '2009年2月',
    5.21,
    602,
    27140,
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
    '24時間コンシェルジュ、ルームサービス、ハウスキーピング',
    ARRAY['/images/id41-1.jpg', '/images/id41-2.jpg', '/images/id41-3.jpg', '/images/id41-4.jpg', '/images/id41-5.jpg'],
    '135-0061',
    '首都圏',
    '東京都',
    '23区',
    '江東区',
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
    'ライオンズミレス蔵前',
    6280000,
    2999500,
    '東京都台東区駒形１丁目',
    '1LDK',
    35.6,
    '4階 / 地上15階建',
    'RC',
    13400,
    '準工業地域',
    '都営大江戸線 蔵前駅 徒歩2分, 都営浅草線 蔵前駅 徒歩4分',
    4,
    ST_SetSRID(ST_MakePoint(139.7931122454882, 35.705801994104405), 4326),
    '中古マンション',
    '2023年01月築',
    3.00,
    602,
    5200,
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
    '2025-05-26',
    '2025-06-09',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    '24時間コンシェルジュ、ルームサービス、ハウスキーピング',
    ARRAY['/images/id42-1.jpg', '/images/id42-2.jpg', '/images/id42-3.jpg', '/images/id42-4.jpg', '/images/id42-5.jpg'],
    '111-0043',
    '首都圏',
    '東京都',
    '23区',
    '台東区',
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
    'クレアホームズフラン東京三ノ輪Ⅱ',
    50000000,
    2999500,
    '東京都台東区三ノ輪１丁目',
    '1LDK',
    32.78,
    '3階 / 地上12階建',
    'RC',
    14400,
    '準工業地域',
    '東京メトロ日比谷線 三ノ輪駅 徒歩4分, 常磐線 南千住駅 徒歩12分, つくばエクスプレス 南千住駅 徒歩12分',
    12,
    ST_SetSRID(ST_MakePoint(139.79401790614241, 35.7281325127099), 4326),
    '中古マンション',
    '2023年07月',
    5.6,
    33,
    2950,
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
    '賃貸中',
    '相談',
    '仲介',
    1122083505,
    '2025-05-26',
    '2025-06-12',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    '24時間コンシェルジュ、ルームサービス、ハウスキーピング',
    ARRAY['/images/id43-1.jpg', '/images/id43-2.jpg', '/images/id43-3.jpg', '/images/id43-4.jpg', '/images/id43-5.jpg'],
    '110-0011',
    '首都圏',
    '東京都',
    '23区',
    '台東区',
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
    'リビオレゾン上野入谷ザ・テラス',
    44990000,
    2999500,
    '東京都台東区入谷２丁目',
    '1LDK',
    32.02,
    '14階 / 地上15階建',
    'RC',
    8860,
    '準工業地域',
    '東京メトロ日比谷線 入谷駅 徒歩6分, 山手線 鶯谷駅 徒歩13分, つくばエクスプレス 浅草駅 徒歩11分',
    11,
    ST_SetSRID(ST_MakePoint(139.7881313558237, 35.718988908509424), 4326),
    '中古マンション',
    '2021年08月築',
    3.61,
    98,
    2560,
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
    '2025-06-01',
    '2025-06-15',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    '24時間コンシェルジュ、ルームサービス、ハウスキーピング',
    ARRAY['/images/id44-1.jpg', '/images/id44-2.jpg', '/images/id44-3.jpg', '/images/id44-4.jpg', '/images/id44-5.jpg'],
    '110-0013',
    '首都圏',
    '東京都',
    '23区',
    '台東区',
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
    'ルフォン根岸三丁目',
    98000000,
    2999500,
    '東京都台東区根岸３丁目',
    '3LDK',
    66.84,
    '7階 / 地上15階建',
    'RC',
    12500,
    '準工業地域',
    '山手線 鶯谷駅 徒歩5分, 東京メトロ日比谷線 入谷駅 徒歩4分, 山手線 上野駅 徒歩12分',
    12,
    ST_SetSRID(ST_MakePoint(139.78198596080233, 35.72201435727541), 4326),
    '中古マンション',
    '2016年09月築',
    12,
    98,
    11370,
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
    '2025-05-22',
    '2025-06-05',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    '24時間コンシェルジュ、ルームサービス、ハウスキーピング',
    ARRAY['/images/id45-1.jpg', '/images/id45-2.jpg', '/images/id45-3.jpg', '/images/id45-4.jpg', '/images/id45-5.jpg'],
    '110-0003',
    '首都圏',
    '東京都',
    '23区',
    '台東区',
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
    'ライオンズマンション曳舟 5階',
    36990000,
    2999500,
    '東京都墨田区京島3丁目',
    '1LDK',
    48.72,
    '5階 / 地上8階建',
    'SRC',
    15800,
    '準工業地域',
    '京成押上線 京成曳舟駅 徒歩5分, 東武伊勢崎線 曳舟駅 徒歩8分, 東武亀戸線 小村井駅 徒歩15分, 東京メトロ半蔵門線 押上駅 徒歩15分, 東武伊勢崎線 とうきょうスカイツリー駅 徒歩17分, 東武伊勢崎線 東向島駅 徒歩18分',
    5,
    ST_SetSRID(ST_MakePoint(139.82144745582298,35.71602911997909), 4326),
    '中古マンション',
    '1982年6月',
    NULL,
    31,
    29720,
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
    '2025-06-02',
    '2025-06-16',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    '2ルーフバルコニー7.45平米 ご案内等の所要時間です。ご参考ください。 ・現地／物件見学（30分〜） ・ご希望条件のご相談（30分〜） ・資金計画のご相談（30分〜） ・会社案内（10分〜）',
    ARRAY['/images/id46-1.jpg', '/images/id46-2.jpg', '/images/id46-3.jpg', '/images/id46-4.jpg', '/images/id46-5.jpg'],
    '131-0046',
    '首都圏',
    '東京都',
    '23区',
    '墨田区',
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
    'パークホームズ錦糸町コンフォートプレミア',
    102800000,
    2999500,
    '東京都墨田区緑４丁目',
    '3LDK',
    73.29,
    '4階 / 地上10階建',
    'RC',
    20150,
    '準工業地域',
    '中央・総武緩行線 錦糸町駅 徒歩7分, 総武本線 錦糸町駅 徒歩7分, 東京メトロ半蔵門線 錦糸町駅 徒歩8分',
    7,
    ST_SetSRID(ST_MakePoint(139.808219823101, 35.69558652168625), 4326),
    '中古マンション',
    '2011年08月築',
    7,
    52,
    13190,
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
    '2025-06-02',
    '2025-06-16',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    'サービススペース面積３．４７平米',
    ARRAY['/images/id47-1.jpg', '/images/id47-2.jpg', '/images/id47-3.jpg', '/images/id47-4.jpg', '/images/id47-5.jpg'],
    '130-0021',
    '首都圏',
    '東京都',
    '23区',
    '墨田区',
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
    'ソプラタワー',
    167800000,
    2999500,
    '東京都目黒区青葉台３丁目',
    '3LDK',
    82.74,
    '15階 / 地上20階建',
    'RC',
    15700,
    '準工業地域',
    '東急田園都市線 池尻大橋駅 徒歩9分, 京王電鉄井の頭線 神泉駅 徒歩12分, 山手線 渋谷駅 徒歩20分',
    9,
    ST_SetSRID(ST_MakePoint(139.69001975595074, 35.65182625878956), 4326),
    '中古マンション',
    '1999年03月築',
    10.54,
    124,
    17800,
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
    '2025-06-02',
    '2025-06-16',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    '敷地内有 (所有権) 空き：3台有り, 月額 35,000円〜37,000円 (確認日：西暦2025年05月13日現在)',
    ARRAY['/images/id48-1.jpg', '/images/id48-2.jpg', '/images/id48-3.jpg', '/images/id48-4.jpg', '/images/id48-5.jpg'],
    '153-0042',
    '首都圏',
    '東京都',
    '23区',
    '目黒区',
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
    '秀和都立大レジデンス',
    48800000,
    2999500,
    '東京都目黒区中根２丁目',
    '1LDK',
    55.81,
    '6階 / 地上7階建',
    'RC',
    17600,
    '準工業地域',
    '東急東横線 都立大学駅 徒歩8分, 東急大井町線 緑が丘駅 徒歩10分, 東急目黒線 大岡山駅 徒歩12分',
    8,
    ST_SetSRID(ST_MakePoint(139.67853763076076, 35.61304732307788), 4326),
    '中古マンション',
    '1968年10月築',
    NULL,
    35,
    25300,
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
    '2025-06-02',
    '2025-06-16',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    '理事会役員に就任しない組合員は別途管理組合協力金（3000円/月）の徴収有。',
    ARRAY['/images/id49-1.jpg', '/images/id49-2.jpg', '/images/id49-3.jpg', '/images/id49-4.jpg', '/images/id49-5.jpg'],
    '152-0031',
    '首都圏',
    '東京都',
    '23区',
    '目黒区',
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
    'The目黒四季レジデンス',
    146900000,
    2999500,
    '東京都目黒区中央町２丁目',
    '2LDK',
    69.68,
    '5階 / 地上13階建',
    'RC',
    17700,
    '準工業地域',
    '東急東横線 学芸大学駅 徒歩10分, 東急東横線 祐天寺駅 徒歩10分, 山手線 目黒駅 バス12分 水道局目黒営業所前 停歩1分',
    10,
    ST_SetSRID(ST_MakePoint(139.69210527116476, 35.63204480032849), 4326),
    '中古マンション',
    '2005年11月築',
    10.05,
    176,
    24140,
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
    '2025-06-02',
    '2025-06-16',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    '理事会役員に就任しない組合員は別途管理組合協力金（3000円/月）の徴収有。',
    ARRAY['/images/id50-1.jpg', '/images/id50-2.jpg', '/images/id50-3.jpg', '/images/id50-4.jpg', '/images/id50-5.jpg'],
    '152-0031',
    '首都圏',
    '東京都',
    '23区',
    '目黒区',
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