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
    'プレシス馬込ザ・テラス',
    72800000,
    2999500,
    '東京都大田区中馬込１丁目',
    '2SLDK',
    67.78,
    '2階 / 地上5階建',
    'RC',
    16062,
    '準工業地域',
    '都営浅草線 馬込駅 徒歩10分, 東急池上線 長原駅 徒歩15分, 東急大井町線 旗の台駅 徒歩17分',
    10,
    ST_SetSRID(ST_MakePoint(139.70405434723068, 35.59569491281995), 4326),
    '中古マンション',
    '2019年06月築',
    14.28,
    32,
    11280,
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
    '敷地内有 (賃貸) 空き：1台有り, 月額 21,000円〜25,000円 (確認日：西暦2025年06月05日現在)',
    ARRAY['/images/id51-1.jpg', '/images/id51-2.jpg', '/images/id51-3.jpg', '/images/id51-4.jpg', '/images/id51-5.jpg'],
    '143-0027',
    '首都圏',
    '東京都',
    '23区',
    '大田区',
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
    'エンゼルハイム南六郷第5',
    59800000,
    2999500,
    '東京都大田区南六郷１丁目',
    '3LDK',
    67.81,
    '5階 / 地上9階建',
    'RC',
    5420,
    '準工業地域',
    '京急本線 雑色駅 徒歩11分',
    11,
    ST_SetSRID(ST_MakePoint(139.72254972883516, 35.548551083090615), 4326),
    '中古マンション',
    '2001年03月築',
    14.28,
    73,
    18990,
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
    '敷地内有 (賃貸) 空き：1台有り, 月額 21,000円〜25,000円 (確認日：西暦2025年06月05日現在)',
    ARRAY['/images/id52-1.jpg', '/images/id52-2.jpg', '/images/id52-3.jpg', '/images/id52-4.jpg', '/images/id52-5.jpg'],
    '144-0045',
    '首都圏',
    '東京都',
    '23区',
    '大田区',
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
    'ダイナシティ新中野',
    49800000,
    2999500,
    '東京都中野区本町６丁目',
    '1LDK',
    33.95,
    '5階 / 地上13階建',
    'RC',
    8750,
    '準工業地域',
    '東京メトロ丸ノ内線 新中野駅 徒歩2分, 中央・総武緩行線 中野駅 徒歩13分',
    2,
    ST_SetSRID(ST_MakePoint(139.6665707619338, 35.697132852784975), 4326),
    '中古マンション',
    '2006年06月築',
    7.17,
    55,
    3060,
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
    '巡回',
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
    '敷管理会社に全部委託',
    ARRAY['/images/id53-1.jpg', '/images/id53-2.jpg', '/images/id53-3.jpg', '/images/id53-4.jpg', '/images/id53-5.jpg'],
    '164-0012',
    '首都圏',
    '東京都',
    '23区',
    '中野区',
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
    '西荻ニュースカイマンション',
    39800000,
    2999500,
    '東京都杉並区西荻南２丁目',
    '1LDK',
    48.77,
    '3階 / 地上8階建',
    'RC',
    11690,
    '準工業地域',
    '中央本線 西荻窪駅 徒歩6分, 中央・総武緩行線 西荻窪駅 徒歩6分',
    6,
    ST_SetSRID(ST_MakePoint(139.59959026129619, 35.7000048980323), 4326),
    '中古マンション',
    '1970年08月築',
    6.5,
    26,
    20110,
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
    '巡回',
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
    '敷管理会社に全部委託',
    ARRAY['/images/id54-1.jpg', '/images/id54-2.jpg', '/images/id54-3.jpg', '/images/id54-4.jpg', '/images/id54-5.jpg'],
    '167-0053',
    '首都圏',
    '東京都',
    '23区',
    '杉並区',
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
    '藤和南大塚コープ',
    35900000,
    2999500,
    '東京都豊島区南大塚１丁目',
    '1LDK',
    36.54,
    '6階 / 地上10階建',
    'RC',
    11340,
    '準工業地域',
    '山手線 大塚駅 徒歩4分',
    4,
    ST_SetSRID(ST_MakePoint(139.7305061888895, 35.73029586141452), 4326),
    '中古マンション',
    '1979年11月築',
    6.5,
    46,
    7875,
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
    '巡回',
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
    '※建物構造：鉄骨鉄筋コンクリート・鉄筋コンクリート造, ※総戸数46戸に管理人室1戸を含みます',
    ARRAY['/images/id55-1.jpg', '/images/id55-2.jpg', '/images/id55-3.jpg', '/images/id55-4.jpg', '/images/id55-5.jpg'],
    '170-0005',
    '首都圏',
    '東京都',
    '23区',
    '豊島区',
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
    'ブレシア東十条レジデンス',
    48000000,
    2999500,
    '東京都北区東十条２丁目',
    '2LDK',
    57.64,
    '1階 / 地上7階建',
    'RC',
    16800,
    '準工業地域',
    '京浜東北・根岸線 東十条駅 徒歩6分, 東京メトロ南北線 王子神谷駅 徒歩10分, 埼京線 十条駅 徒歩14分',
    6,
    ST_SetSRID(ST_MakePoint(139.7305061888895, 35.73029586141452), 4326),
    '中古マンション',
    '2009年09月築',
    26.15,
    50,
    6000,
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
    '巡回',
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
    'インターネット利用料 550円 / 月、セキュリティ費用 859円 / 月, 管理会社に全部委託',
    ARRAY['/images/id56-1.jpg', '/images/id56-2.jpg', '/images/id56-3.jpg', '/images/id56-4.jpg', '/images/id56-5.jpg'],
    '114-0001',
    '首都圏',
    '東京都',
    '23区',
    '北区',
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
    'デュオシティ西日暮里ステーシア',
    57800000,
    2999500,
    '東京都荒川区西日暮里５丁目',
    '1LDK',
    36.02,
    '12階 / 地上13階建',
    'RC',
    8635,
    '準工業地域',
    '山手線 西日暮里駅 徒歩2分, 東京メトロ千代田線 西日暮里駅 徒歩2分, 日暮里舎人ライナー 西日暮里駅 徒歩1分',
    2,
    ST_SetSRID(ST_MakePoint(139.76871100986864, 35.733919247182804), 4326),
    '中古マンション',
    '2013年08月築',
    14.9,
    48,
    7930,
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
    '巡回',
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
    '町内会費 200円 / 月、給湯器関連費 2,020円 / 月、インターネット 1,800円 / 月, 管理会社に全部委託',
    ARRAY['/images/id57-1.jpg', '/images/id57-2.jpg', '/images/id57-3.jpg', '/images/id57-4.jpg', '/images/id57-5.jpg'],
    '116-0013',
    '首都圏',
    '東京都',
    '23区',
    '荒川区',
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
    'ダイアパレス成増Ⅲ',
    54990000,
    2999500,
    '東京都練馬区旭町３丁目',
    '3LDK',
    65.68,
    '3階 / 地上7階建',
    'RC',
    10400,
    '準工業地域',
    '東京メトロ有楽町線 地下鉄成増駅 徒歩6分, 東京メトロ副都心線 地下鉄成増駅 徒歩6分, 東武東上線 成増駅 徒歩9分',
    6,
    ST_SetSRID(ST_MakePoint(139.6273815386705, 35.77596800687735), 4326),
    '中古マンション',
    '1996年07月築',
    9.29,
    53,
    8580,
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
    ARRAY['/images/id58-1.jpg', '/images/id58-2.jpg', '/images/id58-3.jpg', '/images/id58-4.jpg', '/images/id58-5.jpg'],
    '179-0071',
    '首都圏',
    '東京都',
    '23区',
    '練馬区',
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
    'リビオ北千住',
    49800000,
    2999500,
    '東京都足立区千住元町',
    '2LDK',
    76.08,
    '1階 / 地上11階建',
    'RC',
    10720,
    '準工業地域',
    '東京メトロ千代田線 北千住駅 徒歩20分, 常磐線 北千住駅 徒歩20分, 常磐線 北千住駅 バス8分 千住桜木 停歩3分',
    20,
    ST_SetSRID(ST_MakePoint(139.7905983360869, 35.75572732544266), 4326),
    '中古マンション',
    '2014年01月築',
    NULL,
    184,
    6840,
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
    '専用庭使用料 1,320円 / 月,  	※テラス面積：11.07平米, ※専用庭面積：26.44平米, 管理会社に全部委託',
    ARRAY['/images/id59-1.jpg', '/images/id59-2.jpg', '/images/id59-3.jpg', '/images/id59-4.jpg', '/images/id59-5.jpg'],
    '179-0071',
    '首都圏',
    '東京都',
    '23区',
    '足立区',
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
    'ダイアパレス立石',
    29990000,
    2999500,
    '東京都葛飾区東四つ木２丁目',
    '2LDK',
    59.91,
    '1階 / 地上13階建',
    'RC',
    8080,
    '準工業地域',
    '京成電鉄押上線 京成立石駅 徒歩15分, 京成電鉄押上線 四ツ木駅 徒歩15分, 中央・総武緩行線 新小岩駅 徒歩23分',
    15,
    ST_SetSRID(ST_MakePoint(139.8456230445306, 35.72931875584492), 4326),
    '中古マンション',
    '1988年02月築',
    8.38,
    196,
    10480,
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
    '空き有 月額1,800円,  	※専用庭面積：20.3平米, 管理会社に全部委託',
    ARRAY['/images/id60-1.jpg', '/images/id60-2.jpg', '/images/id60-3.jpg', '/images/id60-4.jpg', '/images/id60-5.jpg'],
    '124-0014',
    '首都圏',
    '東京都',
    '23区',
    '葛飾区',
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