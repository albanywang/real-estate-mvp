-- Sample property data
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
    'センチュリーパークタワー 50階 ４ＬＤＫ', 
    598000000, 
    3401100, 
    '東京都中央区佃２丁目', 
    '4LDK', 
    175.83, 
    '50階 / 地上54階建', 
    'RC', 
    60700, 
    '準工業地域', 
    '東京メトロ有楽町線 / 月島駅 徒歩9分 東京メトロ有楽町線 / 月島駅 徒歩9分', 
    9,
    ST_SetSRID(ST_MakePoint(139.7850, 35.6701), 4326), -- Single Point: [lng, lat]
    '中古マンション', 
    '1999年1月', 
    8.40, 
    756, 
    80880, 
    81670, 
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
    1015229195, 
    '2025-04-26', 
    '2025-06-10', 
    '主要採光面：北向き, 施工会社：（株）大林組, 用途地域：準工業', 
    '長期優良住宅認定通知書, 長期優良住宅認定通知書あり', 
    '空無', 
    'カウンターキッチン', 
    '-', 
    '全居室収納、ウォークインクローゼット、床暖房、トランクルーム、オートロック、モニター付インターホン、ディンプルキー、防犯カメラ、都市ガス、ケーブルTV', 
    '主要採光面：南向き,用途地域：商業地域,駐車場空状況：2025年4月確認リフォーム：(室内フルリフォーム中(2025年5月上旬完成予定))管理形態：全部委託／・熱料金：変動費（使用相当分の料金が別途かかります）', 
    ARRAY['/images/id2-1.jpg', '/images/id2-2.jpg', '/images/id2-3.jpg', '/images/id2-4.jpg', '/images/id2-5.jpg'],
    -- New area hierarchy and zipcode data
    '104-0051', -- Harumi area zipcode
    '首都圏',
    '東京都',
    '23区',
    '中央区',
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
    '東京ツインパークス　ライトウイング', 
    498000000, 
    3401100, 
    '東京都港区東新橋１丁目', 
    '2LDK', 
    99.10, 
    '42階 / 地上47階建', 
    'RC', 
    36700, 
    '準工業地域', 
    '東京都大江戸線 「汐留」駅 まで 徒歩3分 山手線 「浜松町」駅 まで 徒歩7分', 
    3,
    ST_SetSRID(ST_MakePoint(139.76024876736125, 35.66059974713901), 4326), -- Single Point: [lng, lat]
    '中古マンション', 
    '2002年9月', 
    6.28, 
    424, 
    30620, 
    8455, 
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
    '居住中', 
    '相談', 
    '専任媒介', 
    1015229195, 
    '2025-05-29', 
    '2025-06-05', 
    '主要採光面：北向き, 施工会社：（株）大林組, 用途地域：準工業', 
    '長期優良住宅認定通知書, 長期優良住宅認定通知書あり', 
    '空無', 
    'カウンターキッチン', 
    '-', 
    '全居室収納、ウォークインクローゼット、床暖房、トランクルーム、オートロック、モニター付インターホン、ディンプルキー、防犯カメラ、都市ガス、ケーブルTV', 
    '日勤管理 ・掲載中の家具・什器は販売価格に含まれません', 
    ARRAY['/images/id3-1.jpg', '/images/id3-2.jpg', '/images/id3-3.jpg', '/images/id3-4.jpg', '/images/id3-5.jpg'],
    -- New area hierarchy and zipcode data
    '105-0021', -- Harumi area zipcode
    '首都圏',
    '東京都',
    '23区',
    '港区',
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
    '六本木ヒルズレジデンスB棟', 
    492000000, 
    3401100, 
    '東京都港区六本木６丁目', 
    '2LDK', 
    89.59, 
    '5階 / 地上43階建', 
    'RC', 
    72650, 
    '準工業地域', 
    '東京地下鉄日比谷線 「六本木」駅 まで 徒歩6分 東京都大江戸線 「麻布十番」駅 まで 徒歩10分',
    10, 
    ST_SetSRID(ST_MakePoint(139.72957203298222, 35.659029582092316), 4326), -- Single Point: [lng, lat]
    '中古マンション', 
    '2003年4月', 
    5.19, 
    333, 
    40082, 
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
    '賃貸中', 
    '相談', 
    '専任媒介', 
    1015229195, 
    '2025-05-29', 
    '2025-06-05', 
    '主要採光面：北向き, 施工会社：（株）大林組, 用途地域：準工業', 
    '長期優良住宅認定通知書, 長期優良住宅認定通知書あり', 
    '空無', 
    'カウンターキッチン', 
    '-', 
    '全居室収納、ウォークインクローゼット、床暖房、トランクルーム、オートロック、モニター付インターホン、ディンプルキー、防犯カメラ、都市ガス、ケーブルTV', 
    '共有持分：46560／100000000・バルコニー面積は平面図上で測定した面積であり、おおよその表示です。 駐車場空状況：2025年4月確認 565000円', 
    ARRAY['/images/id4-1.jpg', '/images/id4-2.jpg', '/images/id4-3.jpg', '/images/id4-4.jpg', '/images/id4-5.jpg'],
    '105-0021',
    '首都圏',
    '東京都',
    '23区',
    '港区',
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
    'パークコート麻布十番ザ・タワー', 
    428000000, 
    3401100, 
    '東京都港区三田１丁目', 
    '3LDK', 
    89.69, 
    '27階 / 地上36階建', 
    'RC', 
    32440, 
    '準工業地域', 
    '東京地下鉄南北線 「麻布十番」駅 まで 徒歩3分 東京都大江戸線 「麻布十番」駅 まで 徒歩3分', 
    3,
    ST_SetSRID(ST_MakePoint(139.73985472133614,35.65463430793352), 4326), -- Single Point: [lng, lat]
    '中古マンション', 
    '2010年5月', 
    8.04, 
    440, 
    18360, 
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
    '居住中', 
    '相談', 
    '専任媒介', 
    1015229195, 
    '2025-05-29', 
    '2025-06-05', 
    '主要採光面：北向き, 施工会社：（株）大林組, 用途地域：準工業', 
    '長期優良住宅認定通知書, 長期優良住宅認定通知書あり', 
    '空無', 
    'カウンターキッチン', 
    '-', 
    '全居室収納、ウォークインクローゼット、床暖房、トランクルーム、オートロック、モニター付インターホン、ディンプルキー、防犯カメラ、都市ガス、ケーブルTV', 
    '駐輪場使用料：月額300円　　・バイク置き場使用料：月額2，000-3，000円／用途地域2：第二種住居地域', 
    ARRAY['/images/id5-1.jpg', '/images/id5-2.jpg', '/images/id5-3.jpg', '/images/id5-4.jpg', '/images/id5-5.jpg'],
    '105-0021',
    '首都圏',
    '東京都',
    '23区',
    '港区',
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
    'ＴＨＥ　ＲＯＰＰＯＮＧＩ　ＴＯＫＹＯ', 
    529900000, 
    3401100, 
    '東京都港区六本木３丁目', 
    '2LDK', 
    104.40, 
    '37階 / 地上39階建', 
    'RC', 
    43210, 
    '準工業地域', 
    '東京地下鉄日比谷線 「六本木」駅 まで 徒歩3分 東京地下鉄南北線 「六本木一丁目」駅 まで 徒歩6分', 
    6,
    ST_SetSRID(ST_MakePoint(139.735074, 35.66447297370981), 4326), -- Single Point: [lng, lat]
    '中古マンション', 
    '2011年11月', 
    8.04, 
    611, 
    11320, 
    NULL, 
    NULL, 
    NULL, 
    'インターネット接続料: 2,200円/月、自治会費: 150円/月', 
    NULL, 
    '有', 
    '有', 
    NULL, 
    'ペット可', 
    '所有権', 
    '全部委託／日勤', 
    '届出不要', 
    '空家', 
    '相談', 
    '専任媒介', 
    1015229195, 
    '2025-05-29', 
    '2025-06-05', 
    '主要採光面：北向き', 
    '長期優良住宅認定通知書, 長期優良住宅認定通知書あり', 
    '空無', 
    'カウンターキッチン', 
    '-', 
    'オール電化／電気温水器', 
    '※家具・調度品等は販売価格に含まれておりません。', 
    ARRAY['/images/id6-1.jpg', '/images/id6-2.jpg', '/images/id6-3.jpg', '/images/id6-4.jpg', '/images/id6-5.jpg'],
    '105-0021',
    '首都圏',
    '東京都',
    '23区',
    '港区',
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
    'Ｂｒｉｌｌｉａ銀座ｉｄ', 
    64990000, 
    3401100, 
    '東京都中央区銀座２丁目', 
    '1K', 
    26.73, 
    '14階 / 地上14階建', 
    'RC', 
    9100, 
    '準工業地域', 
    '東京都浅草線 「東銀座」駅 まで 徒歩3分 東京地下鉄銀座線 「銀座」駅 まで 徒歩6分', 
    6,
    ST_SetSRID(ST_MakePoint(139.7716951057149, 35.67004812969985), 4326), -- Single Point: [lng, lat]
    '中古マンション', 
    '2004年10月', 
    5.95, 
    160, 
    1980, 
    NULL, 
    NULL, 
    NULL, 
    'インターネット接続料: 2,200円/月、自治会費: 150円/月', 
    NULL, 
    '有', 
    '有', 
    NULL, 
    'ペット可', 
    '所有権', 
    '全部委託／日勤', 
    '届出不要', 
    '居住中', 
    '相談', 
    '専任媒介', 
    1015229195, 
    '2025-05-29', 
    '2025-06-05', 
    '主要採光面：北向き', 
    '長期優良住宅認定通知書, 長期優良住宅認定通知書あり', 
    '空無', 
    'カウンターキッチン', 
    '-', 
    'オール電化／電気温水器', 
    '※上記壁芯面積はトランクルーム面積（約０．２８平米）を含みます', 
    ARRAY['/images/id7-1.jpg', '/images/id7-2.jpg', '/images/id7-3.jpg', '/images/id7-4.jpg', '/images/id7-5.jpg'],
    '104-0051',
    '首都圏',
    '東京都',
    '23区',
    '中央区',
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
    'ＨＡＲＵＭＩ　ＦＬＡＧ　ＳＵＮ　ＶＩＬＬＡＧＥＦ棟', 
    197000000, 
    3401100, 
    '東京都中央区晴海５丁目', 
    '3LDK', 
    86.45, 
    '13階 / 地上18階建', 
    'RC', 
    26280, 
    '準工業地域', 
    '東京都大江戸線 「勝どき」駅 まで 徒歩17分', 
    17,
    ST_SetSRID(ST_MakePoint(139.77309119865183,35.65011062484388), 4326), -- Single Point: [lng, lat]
    '中古マンション', 
    '2023年11月', 
    21.35, 
    194, 
    12620, 
    3350, 
    NULL, 
    NULL, 
    'インターネット接続料: 2,200円/月、自治会費: 150円/月', 
    NULL, 
    '有', 
    '有', 
    NULL, 
    'ペット可', 
    '所有権', 
    '全部委託／日勤', 
    '届出不要', 
    '居住中', 
    '相談', 
    '専任媒介', 
    1015229195, 
    '2025-05-29', 
    '2025-06-05', 
    '主要採光面：北向き', 
    'インターネット料、自治会費、HARUMI FLAG CLUB会費', 
    '空無', 
    'カウンターキッチン', 
    '-', 
    'オール電化／電気温水器', 
    '日勤管理 掲載中の家具・什器および内装費用等は販売価格に含まれません', 
    ARRAY['/images/id8-1.jpg', '/images/id8-2.jpg', '/images/id8-3.jpg', '/images/id8-4.jpg', '/images/id8-5.jpg'],
    '104-0051',
    '首都圏',
    '東京都',
    '23区',
    '中央区',
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
    '白金ザ・スカイ　西棟', 
    222000000, 
    3401100, 
    '東京都港区白金１丁目', 
    '2LDK', 
    55.88, 
    '14階 / 地上45階建', 
    'RC', 
    21592, 
    '準工業地域', 
    '東京地下鉄南北線 「白金高輪」駅 まで 徒歩3分 東京都三田線 「白金高輪」駅 まで 徒歩3分', 
    3,
    ST_SetSRID(ST_MakePoint(139.73416295627342,35.64640510689863), 4326), -- Single Point: [lng, lat]
    '中古マンション', 
    '2023年2月', 
    6.20, 
    1247, 
    7210, 
    NULL, 
    NULL, 
    NULL, 
    'インターネット接続料: 2,200円/月、自治会費: 150円/月', 
    NULL, 
    '有', 
    '有', 
    NULL, 
    'ペット可', 
    '所有権', 
    '全部委託／日勤', 
    '届出不要', 
    '居住中', 
    '相談', 
    '専任媒介', 
    1015229195, 
    '2025-05-29', 
    '2025-06-05', 
    '主要採光面：北向き', 
    'インターネット料、自治会費、HARUMI FLAG CLUB会費', 
    '空無', 
    'カウンターキッチン', 
    '-', 
    'オール電化／電気温水器', 
    '※総戸数：１２４７戸※記載内容と現況が異なる場合は現況を優先とさせていただきます。※専有面積にはトランクルーム面積０．６４平米を含みます。', 
    ARRAY['/images/id9-1.jpg', '/images/id9-2.jpg', '/images/id9-3.jpg', '/images/id9-4.jpg', '/images/id9-5.jpg'],
    '105-0021',
    '首都圏',
    '東京都',
    '23区',
    '港区',
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
    '品川Vタワー', 
    184800000, 
    3401100, 
    '東京都港区港南２丁目', 
    '2LDK', 
    61.21, 
    '9階 / 地上43階建', 
    'RC', 
    20100, 
    '準工業地域', 
    '東京地下鉄南北線 「白金高輪」駅 まで 徒歩3分 東京都三田線 「白金高輪」駅 まで 徒歩3分', 
    3,
    ST_SetSRID(ST_MakePoint(139.74096167715788,35.625384789934486), 4326), -- Single Point: [lng, lat]
    '中古マンション', 
    '2003年3月', 
    4.57, 
    650, 
    16340, 
    1320, 
    NULL, 
    NULL, 
    'インターネット接続料: 2,200円/月、自治会費: 150円/月', 
    NULL, 
    '有', 
    '有', 
    NULL, 
    'ペット可', 
    '所有権', 
    '全部委託／日勤', 
    '届出不要', 
    '空家', 
    '相談', 
    '専任媒介', 
    1015229195, 
    '2025-05-30', 
    '2025-06-06', 
    '主要採光面：北向き', 
    'インターネット料、自治会費、HARUMI FLAG CLUB会費', 
    '空無', 
    'カウンターキッチン', 
    '-', 
    'オール電化／電気温水器', 
    '・インターネット使用料は2025年4月分より1，265円になります。', 
    ARRAY['/images/id10-1.jpg', '/images/id10-2.jpg', '/images/id10-3.jpg', '/images/id10-4.jpg', '/images/id10-5.jpg'],
    '105-0021',
    '首都圏',
    '東京都',
    '23区',
    '港区',
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