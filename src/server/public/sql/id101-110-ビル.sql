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
    '千代田区外神田二丁目ビル',
    460000000,
    NULL,
    '東京都千代田区外神田２丁目',
    NULL,
    288.87,
    '鉄筋コンクリート造5階 地下1階建',
    'RC',
    NULL,
    '商業地域',
    '東京メトロ銀座線 末広町駅 徒歩4分, 中央・総武緩行線 御茶ノ水駅 徒歩9分',
    4,
    ST_SetSRID(ST_MakePoint(139.76846244907247, 35.70042168944045), 4326),
    'ビル',
    '1987年05月築',
    NULL,
    NULL,
    NULL,
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
    NULL,
    NULL,
    '賃貸中',
    '相談',
    '仲介',
    NULL,
    '2025-06-12',
    '2025-06-26',
    NULL,
    NULL,
    '有',
    NULL,
    NULL,
    NULL,
    '事務所・店舗仕様, 土地面積	66.11㎡(約19.99坪)',
    ARRAY['/images/id101-1.jpg', '/images/id101-2.jpg', '/images/id101-3.jpg', '/images/id101-4.jpg', '/images/id101-5.jpg'],
    '101-0021',
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
    -- Rental/Investment data
    4800000, -- estimatedRent (想定賃料年間: 40万/月)
    0.0304, -- assumedYield (想定利回り: 3.04%)
    NULL, -- currentRent (現行賃料年間: 空家のため無し)
    NULL, -- currentYield (現行利回り: 空家のため無し)
    'vacant', -- rentalStatus (賃貸状況: 空家)
    1, -- numberOfUnitsInTheBuilding (建物内の住戸数: 戸建なので1)
    185.50 -- exclusiveAreaOfEachResidence (各住戸の専有面積: 戸建なので全体面積)   
),
(
    '千代田区鍛冶町一丁目ビル',
    750000000,
    NULL,
    '東京都千代田区鍛冶町１丁目',
    NULL,
    199.7,
    '鉄筋コンクリート造3階建',
    'RC',
    NULL,
    '商業地域',
    '山手線 神田駅 徒歩2分',
    2,
    ST_SetSRID(ST_MakePoint(139.77116204165233,35.690063650051215), 4326),
    'ビル',
    '2024年03月築',
    NULL,
    NULL,
    NULL,
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
    NULL,
    NULL,
    '空家',
    '相談',
    '仲介',
    NULL,
    '2025-06-12',
    '2025-06-26',
    NULL,
    NULL,
    '有',
    NULL,
    NULL,
    NULL,
    '事務所仕様, 土地面積 104.85㎡(約31.71坪), 600%（前面道路幅員により２４０％に制限されます。）',
    ARRAY['/images/id102-1.jpg', '/images/id102-2.jpg', '/images/id102-3.jpg', '/images/id102-4.jpg', '/images/id102-5.jpg'],
    '101-0044',
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
    -- Rental/Investment data
    4200000, -- estimatedRent (想定賃料年間: 35万/月)
    0.0311, -- assumedYield (想定利回り: 3.11%)
    NULL, -- currentRent (現行賃料年間: 空家のため無し)
    NULL, -- currentYield (現行利回り: 空家のため無し)
    'vacant', -- rentalStatus (賃貸状況: 空家)
    1, -- numberOfUnitsInTheBuilding (建物内の住戸数: 戸建なので1)
    187.42 -- exclusiveAreaOfEachResidence (各住戸の専有面積: 戸建なので全体面積)    
),
(
    'ウィンド小伝馬町ビル',
    950000000,
    NULL,
    '東京都中央区日本橋小伝馬町',
    NULL,
    654.87,
    '鉄骨鉄筋コンクリート造8階建',
    'RC',
    NULL,
    '商業地域',
    '東京メトロ日比谷線 小伝馬町駅 徒歩2分, 総武本線 馬喰町駅 徒歩4分',
    2,
    ST_SetSRID(ST_MakePoint(139.77834058397943, 35.69153406593901), 4326),
    'ビル',
    '1972年03月築',
    NULL,
    NULL,
    NULL,
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
    NULL,
    NULL,
    '賃貸中',
    '相談',
    '仲介',
    NULL,
    '2025-06-20',
    '2025-07-04',
    NULL,
    NULL,
    '有',
    NULL,
    NULL,
    NULL,
    '事務所仕様, 土地面積 96.91㎡(約29.31坪), 店舗60.53㎡×1戸、事務所66.96㎡×7戸',
    ARRAY['/images/id103-1.jpg', '/images/id103-2.jpg', '/images/id103-3.jpg', '/images/id103-4.jpg', '/images/id103-5.jpg'],
    '103-0001',
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
    -- Rental/Investment data
    3000000, -- estimatedRent (想定賃料年間: 25万/月)
    0.0316, -- assumedYield (想定利回り: 3.16%)
    NULL, -- currentRent (現行賃料年間: 空家のため無し)
    NULL, -- currentYield (現行利回り: 空家のため無し)
    'available', -- rentalStatus (賃貸状況: 賃貸可能)
    1, -- numberOfUnitsInTheBuilding (建物内の住戸数: 戸建なので1)
    146.28 -- exclusiveAreaOfEachResidence (各住戸の専有面積: 戸建なので全体面積)    
),
(
    '東日本橋1丁目ビル',
    160000000,
    NULL,
    '東京都中央区東日本橋１丁目',
    NULL,
    132.48,
    '鉄筋コンクリート造5階 地下1階建',
    'RC',
    NULL,
    '商業地域',
    '都営浅草線 東日本橋駅 徒歩3分, 総武本線 馬喰町駅 徒歩9分, 都営新宿線 浜町駅 徒歩4分',
    3,
    ST_SetSRID(ST_MakePoint(139.78682297419886, 35.69180120188598), 4326),
    'ビル',
    '2024年03月築',
    NULL,
    NULL,
    NULL,
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
    NULL,
    NULL,
    '空家',
    '相談',
    '仲介',
    NULL,
    '2025-06-20',
    '2025-07-04',
    NULL,
    NULL,
    '有',
    NULL,
    NULL,
    NULL,
    '事務所仕様, 土地面積 30.77㎡(約9.3坪)',
    ARRAY['/images/id104-1.jpg', '/images/id104-2.jpg', '/images/id104-3.jpg', '/images/id104-4.jpg', '/images/id104-5.jpg'],
    '103-0004',
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
    -- Rental/Investment data
    7200000, -- estimatedRent (想定賃料年間: 60万/月)
    0.0242, -- assumedYield (想定利回り: 2.42%)
    NULL, -- currentRent (現行賃料年間: 空家のため無し)
    NULL, -- currentYield (現行利回り: 空家のため無し)
    'vacant', -- rentalStatus (賃貸状況: 空家)
    1, -- numberOfUnitsInTheBuilding (建物内の住戸数: 戸建なので1)
    158.47 -- exclusiveAreaOfEachResidence (各住戸の専有面積: 戸建なので全体面積)   
),
(
    '港区麻布十番2丁目ビル',
    1116000000,
    NULL,
    '東京都港区麻布十番２丁目',
    NULL,
    352.48,
    '鉄骨造7階建',
    'RC',
    NULL,
    '商業地域',
    '都営大江戸線 麻布十番駅 徒歩3分, 東京メトロ南北線 麻布十番駅 徒歩3分, 東京メトロ日比谷線 六本木駅 徒歩13分',
    3,
    ST_SetSRID(ST_MakePoint(139.73610617925854, 35.65501974739645), 4326),
    'ビル',
    '2009年03月築',
    NULL,
    NULL,
    NULL,
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
    NULL,
    NULL,
    '賃貸中',
    '相談',
    '仲介',
    NULL,
    '2025-06-19',
    '2025-07-03',
    NULL,
    NULL,
    '有',
    NULL,
    NULL,
    NULL,
    '賃貸中（賃貸借契約引継要）, 土地面積	103㎡(約31.15坪), 住戸数：1戸（民泊事業）, 住戸の専有面積：92.17平米',
    ARRAY['/images/id105-1.jpg', '/images/id105-2.jpg', '/images/id105-3.jpg', '/images/id105-4.jpg', '/images/id105-5.jpg'],
    '106-0045',
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
    -- Rental/Investment data
    5400000, -- estimatedRent (想定賃料年間: 45万/月)
    0.0292, -- assumedYield (想定利回り: 2.92%)
    NULL, -- currentRent (現行賃料年間: 空家のため無し)
    NULL, -- currentYield (現行利回り: 空家のため無し)
    'vacant', -- rentalStatus (賃貸状況: 空家)
    1, -- numberOfUnitsInTheBuilding (建物内の住戸数: 戸建なので1)
    148.12 -- exclusiveAreaOfEachResidence (各住戸の専有面積: 戸建なので全体面積)    
),
(
    'H・T南青山ビルディングⅢ',
    850000000,
    NULL,
    '東京都港区南青山７丁目',
    NULL,
    438.61,
    '鉄筋コンクリート造3階 地下1階建',
    'RC',
    NULL,
    '商業地域',
    '東京メトロ銀座線 表参道駅 徒歩14分, 東京メトロ日比谷線 広尾駅 徒歩12分, 東京メトロ日比谷線 六本木駅 徒歩15分',
    12,
    ST_SetSRID(ST_MakePoint(139.71725334991672, 35.65822202920041), 4326),
    'ビル',
    '1984年06月築',
    NULL,
    NULL,
    NULL,
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
    NULL,
    NULL,
    '賃貸中',
    '相談',
    '仲介',
    NULL,
    '2025-06-21',
    '2025-07-05',
    NULL,
    NULL,
    '有',
    NULL,
    NULL,
    NULL,
    '土地面積	151.79㎡(約45.91坪), 賃貸中（賃貸借契約引継要）, 収入額に賃料等の他、テナントより収受する電気料金（純収益）を含みます。',
    ARRAY['/images/id106-1.jpg', '/images/id106-2.jpg', '/images/id106-3.jpg', '/images/id106-4.jpg', '/images/id106-5.jpg'],
    '107-0062',
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
    -- Rental/Investment data
    7800000, -- estimatedRent (想定賃料年間: 65万/月)
    0.0347, -- assumedYield (想定利回り: 3.47%)
    7800000, -- currentRent (現行賃料年間: 65万/月 - 居住中なので自己使用評価)
    0.0347, -- currentYield (現行利回り: 3.47%)
    'occupied', -- rentalStatus (賃貸状況: 居住中)
    1, -- numberOfUnitsInTheBuilding (建物内の住戸数: 戸建なので1)
    229.68 -- exclusiveAreaOfEachResidence (各住戸の専有面積: 戸建なので全体面積)  
),
(
    '台東区浅草橋2丁目ビル',
    273000000,
    NULL,
    '東京都台東区浅草橋２丁目',
    NULL,
    317.04,
    '鉄骨造8階建',
    'RC',
    NULL,
    '商業地域',
    '都営浅草線 浅草橋駅 徒歩6分, 中央・総武緩行線 浅草橋駅 徒歩4分',
    4,
    ST_SetSRID(ST_MakePoint(139.7854697374368, 35.69954594157039), 4326),
    'ビル',
    '1990年07月築',
    NULL,
    NULL,
    NULL,
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
    NULL,
    NULL,
    '賃貸中',
    '相談',
    '仲介',
    NULL,
    '2025-06-12',
    '2025-06-26',
    NULL,
    NULL,
    '有',
    NULL,
    NULL,
    NULL,
    '土地面積	65.44㎡(約19.79坪), 賃貸中（賃貸借契約引継要）',
    ARRAY['/images/id107-1.jpg', '/images/id107-2.jpg', '/images/id107-3.jpg', '/images/id107-4.jpg', '/images/id107-5.jpg'],
    '111-0053',
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
    -- Rental/Investment data
    7800000, -- estimatedRent (想定賃料年間: 65万/月)
    0.0347, -- assumedYield (想定利回り: 3.47%)
    7800000, -- currentRent (現行賃料年間: 65万/月 - 居住中なので自己使用評価)
    0.0347, -- currentYield (現行利回り: 3.47%)
    'occupied', -- rentalStatus (賃貸状況: 居住中)
    1, -- numberOfUnitsInTheBuilding (建物内の住戸数: 戸建なので1)
    229.68 -- exclusiveAreaOfEachResidence (各住戸の専有面積: 戸建なので全体面積) 
),
(
    '台東区東上野5丁目 ビル',
    350000000,
    NULL,
    '東京都台東区東上野５丁目',
    NULL,
    232.13,
    '鉄骨造4階建',
    'RC',
    NULL,
    '商業地域',
    '東京メトロ銀座線 稲荷町駅 徒歩6分, 山手線 上野駅 徒歩8分, 東京メトロ日比谷線 上野駅 徒歩10分',
    6,
    ST_SetSRID(ST_MakePoint(139.78162985514302, 35.71346693314246), 4326),
    'ビル',
    '1978年03月築',
    NULL,
    NULL,
    NULL,
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
    NULL,
    NULL,
    '居住中',
    '相談',
    '仲介',
    NULL,
    '2025-06-22',
    '2025-07-06',
    NULL,
    NULL,
    '有',
    NULL,
    NULL,
    NULL,
    '土地面積	66.26㎡(約20.04坪), 2025年10月上旬以降）',
    ARRAY['/images/id108-1.jpg', '/images/id108-2.jpg', '/images/id108-3.jpg', '/images/id108-4.jpg', '/images/id108-5.jpg'],
    '110-0015',
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
    -- Rental/Investment data
    7800000, -- estimatedRent (想定賃料年間: 65万/月)
    0.0347, -- assumedYield (想定利回り: 3.47%)
    7800000, -- currentRent (現行賃料年間: 65万/月 - 居住中なので自己使用評価)
    0.0347, -- currentYield (現行利回り: 3.47%)
    'occupied', -- rentalStatus (賃貸状況: 居住中)
    1, -- numberOfUnitsInTheBuilding (建物内の住戸数: 戸建なので1)
    229.68 -- exclusiveAreaOfEachResidence (各住戸の専有面積: 戸建なので全体面積)  
),
(
    '墨田区緑三丁目ビル',
    278000000,
    NULL,
    '東京都墨田区緑３丁目',
    NULL,
    400.24,
    '鉄骨造4階建',
    'RC',
    NULL,
    '近隣商業地域',
    '中央・総武緩行線 錦糸町駅 徒歩15分',
    15,
    ST_SetSRID(ST_MakePoint(139.80447358532908, 35.694519209903305), 4326),
    'ビル',
    '1985年01月築',
    NULL,
    NULL,
    NULL,
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
    NULL,
    NULL,
    '賃貸中',
    '相談',
    '仲介',
    NULL,
    '2025-06-12',
    '2025-06-26',
    NULL,
    NULL,
    '有',
    NULL,
    NULL,
    NULL,
    '土地面積	137.07㎡(約41.46坪), 2025年10月上旬以降）, 賃貸中（賃貸借契約引継要）',
    ARRAY['/images/id109-1.jpg', '/images/id109-2.jpg', '/images/id109-3.jpg', '/images/id109-4.jpg', '/images/id109-5.jpg'],
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
    -- Rental/Investment data
    7800000, -- estimatedRent (想定賃料年間: 65万/月)
    0.0347, -- assumedYield (想定利回り: 3.47%)
    7800000, -- currentRent (現行賃料年間: 65万/月 - 居住中なので自己使用評価)
    0.0347, -- currentYield (現行利回り: 3.47%)
    'occupied', -- rentalStatus (賃貸状況: 居住中)
    1, -- numberOfUnitsInTheBuilding (建物内の住戸数: 戸建なので1)
    229.68 -- exclusiveAreaOfEachResidence (各住戸の専有面積: 戸建なので全体面積)  
),
(
    'AZ渋谷本町',
    1880000000,
    NULL,
    '東京都渋谷区本町２丁目',
    NULL,
    1595.69,
    '鉄筋コンクリート造5階 地下1階建',
    'RC',
    NULL,
    '第一種住居地域',
    '京王電鉄京王線 初台駅 徒歩5分',
    5,
    ST_SetSRID(ST_MakePoint(139.6832134676229, 35.684225222221215), 4326),
    'ビル',
    '1992年02月築',
    NULL,
    NULL,
    NULL,
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
    NULL,
    NULL,
    '賃貸中',
    '相談',
    '仲介',
    NULL,
    '2025-06-20',
    '2025-07-04',
    NULL,
    NULL,
    '有',
    NULL,
    NULL,
    NULL,
    '土地面積	557.17㎡(約168.54坪), 上記建物面積のうち地下室面積302.63㎡含む',
    ARRAY['/images/id110-1.jpg', '/images/id110-2.jpg', '/images/id110-3.jpg', '/images/id110-4.jpg', '/images/id110-5.jpg'],
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
    -- Rental/Investment data
    7800000, -- estimatedRent (想定賃料年間: 65万/月)
    0.0347, -- assumedYield (想定利回り: 3.47%)
    7800000, -- currentRent (現行賃料年間: 65万/月 - 居住中なので自己使用評価)
    0.0347, -- currentYield (現行利回り: 3.47%)
    'occupied', -- rentalStatus (賃貸状況: 居住中)
    1, -- numberOfUnitsInTheBuilding (建物内の住戸数: 戸建なので1)
    229.68 -- exclusiveAreaOfEachResidence (各住戸の専有面積: 戸建なので全体面積) 
);  