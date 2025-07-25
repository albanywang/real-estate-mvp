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
    'プラウドタワー渋谷 18階 3LDK',
    295000000,
    3289474,
    '東京都渋谷区恵比寿4丁目20番3号',
    '3LDK',
    89.7,
    '18階 / 地上39階建',
    'RC',
    48600,
    '商業地域',
    'JR山手線 / 恵比寿駅 徒歩6分',
    6,
    ST_SetSRID(ST_MakePoint(139.7109, 35.6467), 4326),
    '中古マンション',
    '2017年11月',
    11.8,
    512,
    52400,
    38900,
    NULL,
    NULL,
    '管理費込み、修繕積立金別途',
    NULL,
    '有',
    '有',
    NULL,
    '可',
    '所有権',
    '全部委託／日勤',
    '届出不要',
    '空家',
    '即時',
    '専任媒介',
    1015229201,
    '2025-05-29',
    '2025-06-29',
    '恵比寿駅近、南向き、リノベーション済み',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'ラウンジ、ゲストルーム、キッズルーム、宅配ボックス',
    'コンシェルジュ、24時間管理、クリーニング取次',
    ARRAY['/images/id21-1.jpg', '/images/id21-2.jpg', '/images/id21-3.jpg', '/images/id21-4.jpg', '/images/id21-5.jpg'],
    '150-0013',
    '首都圏',
    '東京都',
    '23区',
    '渋谷区',
    'for sale' ,
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
    'パークシティ中央湊 12階 2LDK',
    168000000,
    2133333,
    '東京都中央区湊1丁目5番2号',
    '2LDK',
    78.8,
    '12階 / 地上32階建',
    'RC',
    35200,
    '商業地域',
    '東京メトロ日比谷線 / 八丁堀駅 徒歩5分',
    5,
    ST_SetSRID(ST_MakePoint(139.7811, 35.6706), 4326),
    '中古マンション',
    '2019年3月',
    9.4,
    285,
    42800,
    31500,
    NULL,
    NULL,
    '管理費込み、インターネット使用料込み',
    NULL,
    '有',
    '有',
    NULL,
    '不可',
    '所有権',
    '全部委託／日勤',
    '届出不要',
    '居住中',
    '2025年8月',
    '専任媒介',
    1015229202,
    '2025-05-29',
    '2025-06-29',
    '東京駅徒歩圏、水辺立地、モダン設計',
    NULL,
    '有',
    'システムキッチン',
    'バス・トイレ別',
    'ラウンジ、フィットネス、ゲストルーム、宅配ボックス',
    '24時間管理、コンシェルジュ、クリーニング取次',
    ARRAY['/images/id22-1.jpg', '/images/id22-2.jpg', '/images/id22-3.jpg', '/images/id22-4.jpg', '/images/id22-5.jpg'],
    '104-0043',
    '首都圏',
    '東京都',
    '23区',
    '中央区',
    'for sale' ,
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
    'ザ・千代田麹町 25階 1SLDK',
    145000000,
    2535965,
    '東京都千代田区麹町3丁目5番2号',
    '1SLDK',
    57.2,
    '25階 / 地上36階建',
    'SRC',
    28900,
    '商業地域',
    '東京メトロ有楽町線 / 麹町駅 徒歩2分',
    2,
    ST_SetSRID(ST_MakePoint(139.7387, 35.6824), 4326),
    '中古マンション',
    '2021年4月',
    7.3,
    198,
    35600,
    25800,
    NULL,
    NULL,
    '管理費込み、修繕積立金別途',
    NULL,
    '有',
    '有',
    NULL,
    '不可',
    '所有権',
    '全部委託／日勤',
    '届出不要',
    '空家',
    '相談',
    '専任媒介',
    1015229203,
    '2025-05-29',
    '2025-06-29',
    '千代田区、高層階、皇居眺望',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、ゲストルーム、宅配ボックス、ジム',
    'コンシェルジュ、24時間セキュリティ、ハウスキーピング',
    ARRAY['/images/id23-1.jpg', '/images/id23-2.jpg', '/images/id23-3.jpg', '/images/id23-4.jpg', '/images/id23-5.jpg'],
    '102-0083',
    '首都圏',
    '東京都',
    '23区',
    '千代田区',
    'for sale' ,
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
    'グランドメゾン白金台 6階 4LDK',
    520000000,
    3734335,
    '東京都港区白金台4丁目10番8号',
    '4LDK',
    139.3,
    '6階 / 地上21階建',
    'RC',
    72500,
    '第一種住居地域',
    '東京メトロ南北線 / 白金台駅 徒歩3分',
    3,
    ST_SetSRID(ST_MakePoint(139.7286, 35.6424), 4326),
    '中古マンション',
    '2016年2月',
    16.2,
    89,
    58200,
    48900,
    NULL,
    NULL,
    '管理費込み、修繕積立金別途',
    NULL,
    '有',
    '有',
    NULL,
    '可',
    '所有権',
    '全部委託／日勤',
    '届出不要',
    '空家',
    '相談',
    '専任媒介',
    1015229204,
    '2025-05-29',
    '2025-06-29',
    '白金台低層高級、ファミリー向け、庭園眺望',
    NULL,
    '有',
    'アイランドキッチン',
    'バス・トイレ別',
    'ゲストルーム、ライブラリー、宅配ボックス、庭園',
    'コンシェルジュ、24時間管理、ハウスキーピング',
    ARRAY['/images/id24-1.jpg', '/images/id24-2.jpg', '/images/id24-3.jpg', '/images/id24-4.jpg', '/images/id24-5.jpg'],
    '102-0083',
    '首都圏',
    '東京都',
    '23区',
    '千代田区',
    'for sale' ,
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
    'ブリリア辰巳キャナルテラス 14階 3LDK',
    285000000,
    3356824,
    '東京都江東区辰巳2丁目1番58号',
    '3LDK',
    84.9,
    '14階 / 地上32階建',
    'RC',
    45800,
    '準工業地域',
    '東京メトロ有楽町線 / 辰巳駅 徒歩7分',
    7,
    ST_SetSRID(ST_MakePoint(139.8056, 35.6561), 4326),
    '中古マンション',
    '2018年8月',
    12.4,
    432,
    38900,
    32400,
    NULL,
    NULL,
    '管理費込み、修繕積立金別途',
    NULL,
    '有',
    '有',
    NULL,
    '相談',
    '所有権',
    '全部委託／日勤',
    '届出不要',
    '居住中',
    '2025年9月',
    '専任媒介',
    1015229205,
    '2025-05-29',
    '2025-06-29',
    '運河沿い、水辺眺望、子育て環境良好',
    NULL,
    '有',
    'システムキッチン',
    'バス・トイレ別',
    'キッズルーム、ゲストルーム、宅配ボックス、駐車場',
    '24時間管理、コンシェルジュ、防犯カメラ',
    ARRAY['/images/id25-1.jpg', '/images/id25-2.jpg', '/images/id25-3.jpg', '/images/id25-4.jpg', '/images/id25-5.jpg'],
    '135-0053',
    '首都圏',
    '東京都',
    '23区',
    '江東区',
    'for sale' ,
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
    'ブリリア門前仲町 20階 2LDK',
    158000000,
    2253521,
    '東京都江東区門前仲町1丁目4番8号',
    '2LDK',
    70.1,
    '20階 / 地上35階建',
    'RC',
    32600,
    '商業地域',
    '東京メトロ東西線 / 門前仲町駅 徒歩3分',
    3,
    ST_SetSRID(ST_MakePoint(139.7965, 35.6719), 4326),
    '中古マンション',
    '2022年6月',
    8.7,
    245,
    28900,
    22400,
    NULL,
    NULL,
    '管理費込み、インターネット使用料込み',
    NULL,
    '有',
    '有',
    NULL,
    '不可',
    '所有権',
    '全部委託／日勤',
    '届出不要',
    '空家',
    '即時',
    '専任媒介',
    1015229206,
    '2025-05-29',
    '2025-06-29',
    '門前仲町駅直結、高層階、東京スカイツリー眺望',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'ラウンジ、フィットネス、宅配ボックス、駐車場',
    'コンシェルジュ、24時間セキュリティ、クリーニング取次',
    ARRAY['/images/id26-1.jpg', '/images/id26-2.jpg', '/images/id26-3.jpg', '/images/id26-4.jpg', '/images/id26-5.jpg'],
    '135-0048',
    '首都圏',
    '東京都',
    '23区',
    '江東区',
    'for sale' ,
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
    'ザ・パークハウス西新宿タワー60 45階 1LDK',
    195000000,
    3947368,
    '東京都新宿区西新宿5丁目5番1号',
    '1LDK',
    49.4,
    '45階 / 地上60階建',
    'SRC',
    35800,
    '商業地域',
    '東京メトロ丸ノ内線 / 西新宿駅 徒歩4分',
    4,
    ST_SetSRID(ST_MakePoint(139.6896, 35.6936), 4326),
    '中古マンション',
    '2023年3月',
    6.2,
    954,
    42500,
    35200,
    NULL,
    NULL,
    '管理費込み、修繕積立金別途',
    NULL,
    '有',
    '有',
    NULL,
    '不可',
    '所有権',
    '全部委託／日勤',
    '届出不要',
    '空家',
    '相談',
    '専任媒介',
    1015229207,
    '2025-05-29',
    '2025-06-29',
    '日本最高層級、富士山眺望、プレミアム仕様',
    NULL,
    '有',
    'アイランドキッチン',
    'バス・トイレ別',
    'スカイラウンジ、フィットネス、温浴施設、ゲストスイート',
    '24時間コンシェルジュ、ルームサービス、ランドリー',
    ARRAY['/images/id27-1.jpg', '/images/id27-2.jpg', '/images/id27-3.jpg', '/images/id27-4.jpg', '/images/id27-5.jpg'],
    '160-0023',
    '首都圏',
    '東京都',
    '23区',
    '新宿区',
    'for sale' ,
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
    'ブリリア大井町ラヴィアンタワー 28階 3LDK',
    248000000,
    2574740,
    '東京都品川区大井1丁目47番1号',
    '3LDK',
    96.4,
    '28階 / 地上40階建',
    'RC',
    48900,
    '商業地域',
    'JR京浜東北線 / 大井町駅 徒歩5分',
    5,
    ST_SetSRID(ST_MakePoint(139.7305627311197,35.607608105896674), 4326),
    '中古マンション',
    '2019年11月',
    13.8,
    585,
    45200,
    38600,
    NULL,
    NULL,
    '管理費込み、修繕積立金別途',
    NULL,
    '有',
    '有',
    NULL,
    '可',
    '所有権',
    '全部委託／日勤',
    '届出不要',
    '居住中',
    '2025年10月',
    '専任媒介',
    1015229208,
    '2025-05-29',
    '2025-06-29',
    '大井町駅近、ファミリー向け、南向き眺望良好',
    NULL,
    '有',
    'システムキッチン',
    'バス・トイレ別',
    'キッズルーム、ラウンジ、ゲストルーム、宅配ボックス',
    'コンシェルジュ、24時間管理、クリーニング取次',
    ARRAY['/images/id28-1.jpg', '/images/id28-2.jpg', '/images/id28-3.jpg', '/images/id28-4.jpg', '/images/id28-5.jpg'],
    '140-0014',
    '首都圏',
    '東京都',
    '23区',
    '品川区',
    'for sale' ,
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
    'パークタワー晴海 32階 2SLDK',
    285000000,
    3846154,
    '東京都中央区晴海2丁目3番2号',
    '2SLDK',
    74.1,
    '32階 / 地上52階建',
    'SRC',
    38900,
    '準工業地域',
    '都営大江戸線 / 勝どき駅 徒歩8分',
    8,
    ST_SetSRID(ST_MakePoint(139.78815066123684,35.65730457830954), 4326),
    '中古マンション',
    '2024年1月',
    9.8,
    1418,
    52400,
    45800,
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
    '専任媒介',
    1015229209,
    '2025-05-29',
    '2025-06-29',
    '晴海最新タワー、東京湾眺望、レインボーブリッジビュー',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    '24時間コンシェルジュ、ルームサービス、ハウスキーピング',
    ARRAY['/images/id29-1.jpg', '/images/id29-2.jpg', '/images/id29-3.jpg', '/images/id29-4.jpg', '/images/id29-5.jpg'],
    '104-0053',
    '首都圏',
    '東京都',
    '23区',
    '中央区',
    'for sale' ,
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
('ブリリア銀座タワー 38階 2LDK', 425000000, 4946581, '東京都中央区銀座8丁目15番2号', '2LDK', 85.9, '38階 / 地上45階建', 'SRC', 65200, '商業地域', '東京メトロ銀座線 / 銀座駅 徒歩4分', 4, ST_SetSRID(ST_MakePoint(139.76143895569635,35.65438372664328), 4326), '中古マンション', '2020年12月', 10.5, 312, 68900, 58200, NULL, NULL, '管理費込み、修繕積立金別途', NULL, '有', '有', NULL, '不可', '所有権', '全部委託／日勤', '届出不要', '空家', '相談', '専任媒介', 1015229210, '2025-05-29', '2025-06-29', '銀座中心地、プレミアム立地、夜景眺望', NULL, '有', 'アイランドキッチン', 'バス・トイレ別', 'コンシェルジュ、スカイラウンジ、ゲストルーム、宅配ボックス', '24時間セキュリティ、ルームサービス、クリーニング取次', ARRAY['/images/id30-1.jpg', '/images/id30-2.jpg', '/images/id30-3.jpg', '/images/id30-4.jpg', '/images/id30-5.jpg'],     
    '104-0061',
    '首都圏',
    '東京都',
    '23区',
    '中央区',
    'for sale' ,
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



