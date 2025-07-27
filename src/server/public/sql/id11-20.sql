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
    'ＴＨＥ　ＴＯＷＥＲＳ　ＤＡＩＢＡ', 
    215800000, 
    3401100, 
    '東京都港区台場２丁目', 
    '3LDK', 
    102.66, 
    '21階 / 地上33階建', 
    'RC', 
    32600, 
    '準工業地域', 
    'ゆりかもめ 「お台場海浜公園」駅 まで 徒歩2分 東京臨海高速鉄道 「東京テレポート」駅 まで 徒歩5分', 
    5,
    ST_SetSRID(ST_MakePoint(139.7805784660709,35.63022943867125), 4326), -- Single Point: [lng, lat]
    '中古マンション', 
    '2006年5月', 
    9.75, 
    246, 
    18680, 
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
    '2025-05-30', 
    '2025-06-06', 
    '主要採光面：北向き', 
    'インターネット料、自治会費、HARUMI FLAG CLUB会費', 
    '空無', 
    'カウンターキッチン', 
    '-', 
    'オール電化／電気温水器', 
    '専有面積の他に室外機置場面積３．６６平米有（使用料無償） ●自転車置場空有：月額１００円・２００円／台（令和７年１月１４日現在）原則１住戸につき１台（空がある場合２台目以降の使用可）●バイク置場空無：小型：月額１，０００円／台、大型：月額１，５００円／台（令和７年１月１４日現在）●トランクルーム空無：月額１６，０００円／区画（令和７年１月１４日現在）●本物件はＥＡＳＴ棟に存します●写真撮影：令和７年１月●管理員（週７日）月曜～日曜９：００～１７：３０●間取：３ＬＤＫ＋ＷＩＣ', 
    ARRAY['/images/id11-1.jpg', '/images/id11-2.jpg', '/images/id11-3.jpg', '/images/id11-4.jpg', '/images/id11-5.jpg'],
    '105-0021',
    '首都圏',
    '東京都',
    '23区',
    '港区',
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
    '東建ニューハイツ西新宿', 
    148000000, 
    3401100, 
    '東京都新宿区西新宿４丁目', 
    '4LDK', 
    104.38, 
    '12階 / 地上12階建', 
    'RC', 
    31460, 
    '準工業地域', 
    '東京都大江戸線 「西新宿五丁目」駅 まで 徒歩4分 東京地下鉄丸ノ内線 「西新宿」駅 まで 徒歩10分', 
    10,
    ST_SetSRID(ST_MakePoint(139.6875632790081,35.69080063336431), 4326), -- Single Point: [lng, lat]
    '中古マンション', 
    '1981年2月', 
    8.37, 
    157, 
    17310, 
    300, 
    NULL, 
    NULL, 
    'インターネット接続料: 2,200円/月、自治会費: 150円/月', 
    NULL, 
    '有', 
    '有', 
    NULL, 
    'ペット不可', 
    '所有権', 
    '全部委託／日勤', 
    '届出不要', 
    '賃貸中', 
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
    '駐車場等の空き状況につきましては、随時ご確認ください。月額賃料等388 000円にて賃貸中 普通借家契約　 契約期間：2023/7/15～2025/7/14', 
    ARRAY['/images/id12-1.jpg', '/images/id12-2.jpg', '/images/id12-3.jpg', '/images/id12-4.jpg', '/images/id12-5.jpg'],
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
    'シエン・コンドミニオ', 
    41800000, 
    3401100, 
    '東京都新宿区百人町２丁目', 
    '1K', 
    32.44, 
    '1階 / 地上6階建', 
    'RC', 
    9100, 
    '準工業地域', 
    '総武・中央緩行線 「大久保」駅 まで 徒歩5分 山手線 「新大久保」駅 まで 徒歩7分', 
    7,
    ST_SetSRID(ST_MakePoint(139.6976880292879, 35.70427784217023), 4326), -- Single Point: [lng, lat]
    '中古マンション', 
    '2000年11月', 
    12.07, 
    74, 
    7620, 
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
    '2025-05-30', 
    '2025-06-06', 
    '主要採光面：北向き', 
    'インターネット料、自治会費、HARUMI FLAG CLUB会費', 
    '空無', 
    'カウンターキッチン', 
    '-', 
    'オール電化／電気温水器', 
    '■水回り：2025年2月,キッチン、浴室、トイレ、洗面所、給湯器,■内装：2025年2月, 全面(床・壁・天井・建具)', 
    ARRAY['/images/id13-1.jpg', '/images/id13-2.jpg', '/images/id13-3.jpg', '/images/id13-4.jpg', '/images/id13-5.jpg'],
    '169-0073',
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
    'アールヴェール文京大塚公園', 
    139000000, 
    3401100, 
    '東京都文京区大塚５丁目', 
    '3LDK', 
    73.58, 
    '7階 / 地上14階建', 
    'RC', 
    12070, 
    '準工業地域', 
    '総武・中央緩行線 「大久保」駅 まで 徒歩5分 山手線 「新大久保」駅 まで 徒歩7分', 
    7,
    ST_SetSRID(ST_MakePoint(139.73136807290675,35.72393586454848), 4326), -- Single Point: [lng, lat]
    '中古マンション', 
    '1999年12月', 
    11.07, 
    79, 
    24060, 
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
    '2025-05-30', 
    '2025-06-06', 
    '主要採光面：北向き', 
    'インターネット料、自治会費、HARUMI FLAG CLUB会費', 
    '空無', 
    'カウンターキッチン', 
    '-', 
    'オール電化／電気温水器', 
    '■水回り：2025年2月,キッチン、浴室、トイレ、洗面所、給湯器,■内装：2025年2月, 全面(床・壁・天井・建具)', 
    ARRAY['/images/id14-1.jpg', '/images/id14-2.jpg', '/images/id14-3.jpg', '/images/id14-4.jpg', '/images/id14-5.jpg'],
    '112-0012',
    '首都圏',
    '東京都',
    '23区',
    '文京区',
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
    'アールヴェール文京白山', 
    119800000, 
    3401100, 
    '東京都文京区本駒込１丁目', 
    '3LDK', 
    80.16, 
    '7階 / 地上15階建', 
    'RC', 
    16100, 
    '準工業地域', 
    '東京地下鉄南北線 「本駒込」駅 まで 徒歩1分 東京都三田線 「白山」駅 まで 徒歩5分', 
    5,
    ST_SetSRID(ST_MakePoint(139.75424162318618,35.72354043648502), 4326), -- Single Point: [lng, lat]
    '中古マンション', 
    '1999年10月', 
    9.09, 
    85, 
    27180, 
    NULL, 
    NULL, 
    NULL, 
    'インターネット接続料: 2,200円/月、自治会費: 150円/月', 
    NULL, 
    '有', 
    '有', 
    NULL, 
    'ペット不可', 
    '所有権', 
    '全部委託／日勤', 
    '届出不要', 
    '居住中', 
    '相談', 
    '専任媒介', 
    1015229195, 
    '2025-05-30', 
    '2025-06-06', 
    '主要採光面：北向き', 
    '', 
    '空無', 
    'カウンターキッチン', 
    '-', 
    'オール電化／電気温水器', 
    '■水回り：2025年2月,キッチン、浴室、トイレ、洗面所、給湯器,■内装：2025年2月, 全面(床・壁・天井・建具)', 
    ARRAY['/images/id15-1.jpg', '/images/id15-2.jpg', '/images/id15-3.jpg', '/images/id15-4.jpg', '/images/id15-5.jpg'],
    '113-0021',
    '首都圏',
    '東京都',
    '23区',
    '文京区',
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
    'ランドステージ錦糸町２',
    199900000,
    2547436,
    '東京都墨田区太平4丁目1番1号',
    '2LDK',
    78.5,
    '29階 / 地上45階建',
    'RC',
    45600,
    '準工業地域',
    '東京メトロ半蔵門線 / 錦糸町駅 徒歩4分',
    4,
    ST_SetSRID(ST_MakePoint(139.8070975692615, 35.69448708237164), 4326),
    '中古マンション',
    '2006年2月',
    6.43,
    644,
    32500,
    28900,
    NULL,
    NULL,
    '管理費込み、修繕積立金: 28900円/月',
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
    1015229196,
    '2025-05-29',
    '2025-06-29',
    '高層階、錦糸公園眺望、オリナス直結',
    NULL,
    '有',
    'システムキッチン',
    'バス・トイレ別',
    'オートロック、宅配ボックス、エレベーター、フロントサービス',
    '24時間警備、ゲストルーム、フィットネス、スカイラウンジ',
    ARRAY['/images/id16-1.jpg', '/images/id16-2.jpg', '/images/id16-3.jpg', '/images/id16-4.jpg', '/images/id16-5.jpg'],
    '130-0012',
    '首都圏',
    '東京都',
    '23区',
    '墨田区',
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
    'センチュリーパークタワー 15階 3LDK',
    450000000,
    3891304,
    '東京都中央区佃2丁目1番2号',
    '3LDK',
    115.7,
    '15階 / 地上54階建',
    'SRC',
    68200,
    '準工業地域',
    '東京メトロ有楽町線 / 月島駅 徒歩8分',
    8,
    ST_SetSRID(ST_MakePoint(139.7850, 35.6701), 4326),
    '中古マンション',
    '1999年1月',
    12.5,
    756,
    80880,
    85670,
    NULL,
    NULL,
    'インターネット接続料: 2200円/月、自治会費: 150円/月',
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
    1015229197,
    '2025-05-29',
    '2025-06-29',
    '東京湾眺望、タワーマンション、リバーサイド',
    NULL,
    '有',
    'アイランドキッチン',
    'バス・トイレ別',
    'コンシェルジュ、ゲストルーム、ライブラリー、スポーツジム',
    '24時間有人管理、宅配ロッカー、ペット足洗い場',
    ARRAY['/images/id17-1.jpg', '/images/id17-2.jpg', '/images/id17-3.jpg', '/images/id17-4.jpg', '/images/id17-5.jpg'],
    '104-0051',
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
    'グランドタワー品川 8階 1LDK',
    72000000,
    1440000,
    '東京都品川区上大崎2丁目25番2号',
    '1LDK',
    50.0,
    '8階 / 地上42階建',
    'RC',
    22800,
    '商業地域',
    'JR山手線 / 目黒駅 徒歩3分',
    3,
    ST_SetSRID(ST_MakePoint(139.7157, 35.6339), 4326),
    '中古マンション',
    '2015年9月',
    8.2,
    428,
    35600,
    28400,
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
    '居住中',
    '相談',
    '専任媒介',
    1015229199,
    '2025-05-29',
    '2025-06-29',
    '駅近、コンパクト、投資用',
    NULL,
    '有',
    'システムキッチン',
    'ユニットバス',
    'オートロック、宅配ボックス、エレベーター',
    '管理人日勤、防犯カメラ',
    ARRAY['/images/id19-1.jpg', '/images/id19-2.jpg', '/images/id19-3.jpg', '/images/id19-4.jpg', '/images/id19-5.jpg'],
    '141-0021',
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
    'ザ・パークハウス新宿 35階 2SLDK',
    380000000,
    4863248,
    '東京都新宿区西新宿4丁目15番3号',
    '2SLDK',
    78.1,
    '35階 / 地上52階建',
    'SRC',
    58900,
    '商業地域',
    '都営大江戸線 / 西新宿五丁目駅 徒歩4分',
    4,
    ST_SetSRID(ST_MakePoint(139.6917, 35.6895), 4326),
    '中古マンション',
    '2020年7月',
    14.3,
    895,
    67800,
    45200,
    NULL,
    NULL,
    '管理費込み、光熱費一部込み',
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
    1015229200,
    '2025-05-29',
    '2025-06-29',
    '新宿高層階、夜景眺望、最新設備',
    NULL,
    '有',
    'アイランドキッチン',
    'バス・トイレ別',
    'スカイラウンジ、フィットネス、ゲストルーム、コンシェルジュ',
    '24時間セキュリティ、宅配ロッカー、クリーニング取次',
    ARRAY['/images/id20-1.jpg', '/images/id20-2.jpg', '/images/id20-3.jpg', '/images/id20-4.jpg', '/images/id20-5.jpg'],
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
);