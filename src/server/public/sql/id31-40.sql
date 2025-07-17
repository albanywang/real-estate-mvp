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
VALUES 
    ('グランドメゾン六本木 15階 1SLDK', 185000000, 3365854, '東京都港区六本木3丁目2番1号', '1SLDK', 55.0, '15階 / 地上28階建', 'RC', 32800, '商業地域', '東京メトロ日比谷線 / 六本木駅 徒歩3分', 3, ST_SetSRID(ST_MakePoint(139.74001115937222,35.6684515229478), 4326), '中古マンション', '2018年7月', 7.8, 185, 45200, 38900, NULL, NULL, '管理費込み、修繕積立金別途', NULL, '有', '有', NULL, '不可', '所有権', '全部委託／日勤', '届出不要', '居住中', '2025年12月', '専任媒介', 1015229211, '2025-05-29', '2025-06-29', '六本木駅至近、投資・居住両用、夜景眺望', NULL, '有', 'システムキッチン', 'バス・トイレ別', 'ラウンジ、フィットネス、宅配ボックス、駐車場', 'コンシェルジュ、24時間管理、防犯カメラ', ARRAY['/images/id31-1.jpg', '/images/id31-2.jpg', '/images/id31-3.jpg', '/images/id31-4.jpg', '/images/id31-5.jpg'], '106-0032','首都圏', '東京都', '23区', '港区', 'for sale',    
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
    ('ザ・パークハウス青山 22階 3LDK', 580000000, 4666667, '東京都港区南青山2丁目26番1号', '3LDK', 124.3, '22階 / 地上41階建', 'SRC', 78900, '商業地域', '東京メトロ銀座線 / 外苑前駅 徒歩5分', 5, ST_SetSRID(ST_MakePoint(139.71570546365044,35.66278484268614), 4326), '中古マンション', '2021年9月', 15.2, 398, 82500, 65200, NULL, NULL, '管理費込み、修繕積立金別途', NULL, '有', '有', NULL, '可', '所有権', '全部委託／日勤', '届出不要', '空家', '相談', '専任媒介', 1015229212, '2025-05-29', '2025-06-29', '青山プレミアムエリア、皇居外苑眺望、最高級仕様', NULL, '有', 'アイランドキッチン', 'バス・トイレ別', 'スカイラウンジ、温浴施設、ゲストスイート、ワインセラー', '24時間コンシェルジュ、ルームサービス、ハウスキーピング', ARRAY['/images/id32-1.jpg', '/images/id32-2.jpg', '/images/id32-3.jpg', '/images/id32-4.jpg', '/images/id32-5.jpg'], '107-0062','首都圏', '東京都', '23区', '港区', 'for sale',    
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
    ('ブリリア東雲キャナルコート 19階 2LDK', 168000000, 2133333, '東京都江東区東雲1丁目9番22号', '2LDK', 78.8, '19階 / 地上32階建', 'RC', 38200, '準工業地域', 'りんかい線 / 東雲駅 徒歩6分', 6, ST_SetSRID(ST_MakePoint(139.8038018170604, 35.6488249471993), 4326), '中古マンション', '2019年4月', 9.7, 465, 42800, 35900, NULL, NULL, '管理費込み、修繕積立金別途', NULL, '有', '有', NULL, '相談', '所有権', '全部委託／日勤', '届出不要', '居住中', '2025年11月', '専任媒介', 1015229213, '2025-05-29', '2025-06-29', '運河沿い、豊洲市場近接、水辺立地', NULL, '有', 'カウンターキッチン', 'バス・トイレ別', 'ラウンジ、キッズルーム、宅配ボックス、駐車場', 'コンシェルジュ、24時間管理、防犯カメラ', ARRAY['/images/id33-1.jpg', '/images/id33-2.jpg', '/images/id33-3.jpg', '/images/id33-4.jpg', '/images/id33-5.jpg'], '135-0062','首都圏', '東京都', '23区', '江東区', 'for sale',    
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
    ('パークタワー芝公園 35階 4LDK', 720000000, 4500000, '東京都港区芝公園4丁目2番3号', '4LDK', 160.0, '35階 / 地上55階建', 'SRC', 95200, '第一種住居地域', '都営三田線 / 芝公園駅 徒歩2分', 2, ST_SetSRID(ST_MakePoint(139.74716058641621,35.65324898714101), 4326), '中古マンション', '2022年3月', 22.5, 884, 105800, 85600, NULL, NULL, '管理費込み、修繕積立金別途', NULL, '有', '有', NULL, '可', '所有権', '全部委託／日勤', '届出不要', '空家', '相談', '専任媒介', 1015229214, '2025-05-29', '2025-06-29', '東京タワー隣接、芝公園眺望、プレミアムファミリー向け', NULL, '有', 'アイランドキッチン', 'バス・トイレ別', 'スカイラウンジ、温浴施設、フィットネス、ゲストスイート', '24時間コンシェルジュ、ルームサービス、ハウスキーピング', ARRAY['/images/id34-1.jpg', '/images/id34-2.jpg', '/images/id34-3.jpg', '/images/id34-4.jpg', '/images/id34-5.jpg'], '105-0011','首都圏', '東京都', '23区', '港区', 'for sale',    
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
    ('ブリリア文京茗荷谷 12階 2SLDK', 138000000, 1840000, '東京都文京区小日向4丁目6番19号', '2SLDK', 75.0, '12階 / 地上24階建', 'RC', 28900, '第一種住居地域', '東京メトロ丸ノ内線 / 茗荷谷駅 徒歩4分', 4, ST_SetSRID(ST_MakePoint(139.73937535200497,35.71543693742566), 4326), '中古マンション', '2017年12月', 8.9, 198, 32500, 26800, NULL, NULL, '管理費込み、修繕積立金別途', NULL, '有', '有', NULL, '不可', '所有権', '全部委託／日勤', '届出不要', '空家', '即時', '専任媒介', 1015229215, '2025-05-29', '2025-06-29', '文教地区、閑静な住宅街、教育環境良好', NULL, '有', 'システムキッチン', 'バス・トイレ別', 'ゲストルーム、ライブラリー、宅配ボックス、駐車場', 'コンシェルジュ、24時間管理、防犯カメラ', ARRAY['/images/id35-1.jpg', '/images/id35-2.jpg', '/images/id35-3.jpg', '/images/id35-4.jpg', '/images/id35-5.jpg'], '112-0006','首都圏', '東京都', '23区', '文京区', 'for sale',    
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
    ('グランドメゾン赤坂 18階 1LDK', 165000000, 3125000, '東京都港区赤坂3丁目21番13号', '1LDK', 52.8, '18階 / 地上31階建', 'RC', 28600, '商業地域', '東京メトロ千代田線 / 赤坂駅 徒歩3分', 3, ST_SetSRID(ST_MakePoint(139.73281243111853,35.67801681446391), 4326), '中古マンション', '2019年8月', 6.5, 245, 38900, 32500, NULL, NULL, '管理費込み、修繕積立金別途', NULL, '有', '有', NULL, '不可', '所有権', '全部委託／日勤', '届出不要', '居住中', '2025年10月', '専任媒介', 1015229216, '2025-05-29', '2025-06-29', '赤坂中心地、官庁街近接、投資用', NULL, '有', 'カウンターキッチン', 'バス・トイレ別', 'ラウンジ、フィットネス、宅配ボックス、駐車場', 'コンシェルジュ、24時間管理、防犯カメラ', ARRAY['/images/id36-1.jpg', '/images/id36-2.jpg', '/images/id36-3.jpg', '/images/id36-4.jpg', '/images/id36-5.jpg'], '107-0052','首都圏', '東京都', '23区', '港区', 'for sale',    
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
    ('ザ・千代田番町 26階 3LDK', 385000000, 3942857, '東京都千代田区六番町2番地1', '3LDK', 97.7, '26階 / 地上34階建', 'SRC', 58900, '第一種住居地域', '東京メトロ有楽町線 / 市ケ谷駅 徒歩5分', 5, ST_SetSRID(ST_MakePoint(139.7385849604408,35.684334388536264), 4326), '中古マンション', '2020年6月', 13.2, 285, 52400, 45800, NULL, NULL, '管理費込み、修繕積立金別途', NULL, '有', '有', NULL, '相談', '所有権', '全部委託／日勤', '届出不要', '空家', '相談', '専任媒介', 1015229217, '2025-05-29', '2025-06-29', '番町エリア、皇居至近、閑静な住環境', NULL, '有', 'アイランドキッチン', 'バス・トイレ別', 'スカイラウンジ、ゲストルーム、ライブラリー、宅配ボックス', 'コンシェルジュ、24時間管理、ハウスキーピング', ARRAY['/images/id37-1.jpg', '/images/id37-2.jpg', '/images/id37-3.jpg', '/images/id37-4.jpg', '/images/id37-5.jpg'], '102-0085','首都圏', '東京都', '23区', '千代田区', 'for sale',    
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
    ('ブリリア大島小松川公園 14階 2LDK', 95000000, 1315789, '東京都江戸川区小松川2丁目3番5号', '2LDK', 72.2, '14階 / 地上28階建', 'RC', 25800, '第一種住居地域', '都営新宿線 / 東大島駅 徒歩9分', 9, ST_SetSRID(ST_MakePoint(139.84918255754454,35.695261350598834), 4326), '中古マンション', '2020年2月', 10.3, 358, 28900, 22400, NULL, NULL, '管理費込み、修繕積立金別途', NULL, '有', '有', NULL, '可', '所有権', '全部委託／日勤', '届出不要', '空家', '即時', '専任媒介', 1015229218, '2025-05-29', '2025-06-29', '小松川公園隣接、緑豊か、ファミリー向け', NULL, '有', 'システムキッチン', 'バス・トイレ別', 'キッズルーム、ラウンジ、宅配ボックス、駐車場', 'コンシェルジュ、24時間管理、防犯カメラ', ARRAY['/images/id38-1.jpg', '/images/id38-2.jpg', '/images/id38-3.jpg', '/images/id38-4.jpg', '/images/id38-5.jpg'], '132-0034','首都圏', '東京都', '23区', '江戸川区', 'for sale',    
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
    ('パークホームズ豊洲 21階 3LDK', 225000000, 2777778, '東京都江東区豊洲5丁目6番52号', '3LDK', 81.0, '21階 / 地上35階建', 'RC', 42800, '準工業地域', 'ゆりかもめ / 豊洲駅 徒歩4分', 4, ST_SetSRID(ST_MakePoint(139.79734509802583,35.65144378716352), 4326), '中古マンション', '2021年11月', 11.8, 485, 45200, 38600, NULL, NULL, '管理費込み、修繕積立金別途', NULL, '有', '有', NULL, '相談', '所有権', '全部委託／日勤', '届出不要', '居住中', '2025年12月', '専任媒介', 1015229219, '2025-05-29', '2025-06-29', '豊洲新興エリア、商業施設充実、利便性良好', NULL, '有', 'カウンターキッチン', 'バス・トイレ別', 'ラウンジ、フィットネス、ゲストルーム、宅配ボックス', 'コンシェルジュ、24時間管理、防犯カメラ', ARRAY['/images/id39-1.jpg', '/images/id39-2.jpg', '/images/id39-3.jpg', '/images/id39-4.jpg', '/images/id39-5.jpg'], '135-0061','首都圏', '東京都', '23区', '江東区', 'for sale',    
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
    ('シティタワーズ豊洲　ザ・ツイン　ノースタワー 48階 ２ＬＤＫ',
    398000000,
    2999500,
    '東京都江東区豊洲３丁目',
    '2LDK',
    132.69,
    '48階 / 地上48階建',
    'RC',
    21240,
    '準工業地域',
    '東京メトロ有楽町線 / 豊洲駅 徒歩4分, 新交通ゆりかもめ / 新豊洲駅 徒歩18分',
    18,
    ST_SetSRID(ST_MakePoint(139.79902357670514,35.65775190277236), 4326),
    '中古マンション',
    '2009年2月',
    22.38,
    1418,
    40460,
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
    '専任媒介',
    1122083505,
    '2025-02-22',
    '2025-06-09',
    '主要採光面：西向き,施工会社：鹿島建設（株）, 用途地域：工業地域, 利回り：2.11%, 年間予定賃料収入：839.78万円ノース棟・サウス棟からなる166ｍのツインタワーは豊洲のタワーマンション',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    '24時間コンシェルジュ、ルームサービス、ハウスキーピング',
    ARRAY['/images/id40-1.jpg', '/images/id40-2.jpg', '/images/id40-3.jpg', '/images/id40-4.jpg', '/images/id40-5.jpg'],
    '135-0061',
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
);