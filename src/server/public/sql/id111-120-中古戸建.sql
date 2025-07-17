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
    '港区南青山4丁目 戸建',
    550000000,
    NULL,
    '東京都港区南青山４丁目',
    '4LDK',
    170.34,
    '木造3階建',
    '木造',
    NULL,
    '第二種中高層住居専用地域',
    '東京メトロ半蔵門線 表参道駅 徒歩8分, 東京メトロ銀座線 外苑前駅 徒歩11分',
    8,
    ST_SetSRID(ST_MakePoint(139.7188821634074, 35.66544202768211), 4326),
    '中古戸建',
    '2013年03月築',
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
    '前面道路幅員による容積率制限：１６０％',
    ARRAY['/images/id111-1.jpg', '/images/id111-2.jpg', '/images/id111-3.jpg', '/images/id111-4.jpg', '/images/id111-5.jpg'],
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
    -- House-specific data
    125.30, -- buildingArea (建物面積)
    185.50, -- landArea (土地面積)
    '南側幅員6m公道', -- accessSituation (接道状況)
    60.00, -- buildingCoverageRatio (建ぺい率 60%)
    150.00, -- floorAreaRatio (容積率 150%)
    NULL, -- estimatedRent
    NULL, -- assumedYield
    NULL, -- currentRent
    NULL, -- currentYield
    NULL, -- rentalStatus
    NULL, -- numberOfUnitsInTheBuilding
    NULL  -- exclusiveAreaOfEachResidence     
),
(
    '西麻布四丁目戸建',
    230000000,
    NULL,
    '東京都港区西麻布４丁目',
    '3LDK',
    94.26,
    '木造3階建',
    '木造',
    NULL,
    '第二種中高層住居専用地域',
    '東京メトロ日比谷線 広尾駅 徒歩6分, 都営大江戸線 六本木駅 徒歩15分',
    6,
    ST_SetSRID(ST_MakePoint(139.72104099139963, 35.657823835861564), 4326),
    '中古戸建',
    '2000年02月築',
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
    '2025-06-09',
    '2025-06-23',
    NULL,
    NULL,
    '有',
    NULL,
    NULL,
    NULL,
    '前面道路の容積率制限有',
    ARRAY['/images/id112-1.jpg', '/images/id112-2.jpg', '/images/id112-3.jpg', '/images/id112-4.jpg', '/images/id112-5.jpg'],
    '106-0031',
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
    -- House-specific data
    118.75, -- buildingArea (建物面積)
    187.42, -- landArea (土地面積)
    '東側幅員6m公道、南側幅員4m公道', -- accessSituation (接道状況)
    50.00, -- buildingCoverageRatio (建ぺい率 50%)
    100.00, -- floorAreaRatio (容積率 100%)
    NULL, -- estimatedRent
    NULL, -- assumedYield
    NULL, -- currentRent
    NULL, -- currentYield
    NULL, -- rentalStatus
    NULL, -- numberOfUnitsInTheBuilding
    NULL  -- exclusiveAreaOfEachResidence     
),
(
    '港区高輪1丁目',
    298000000,
    NULL,
    '東京都港区高輪１丁目',
    '4LDK',
    158.47,
    '木造3階建',
    '木造',
    NULL,
    '第二種中高層住居専用地域',
    '東京メトロ南北線 白金高輪駅 徒歩7分',
    7,
    ST_SetSRID(ST_MakePoint(139.73501650606184, 35.640284851471534), 4326),
    '中古戸建',
    '2018年07月築',
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
    '2025-06-12',
    '2025-06-26',
    NULL,
    NULL,
    '有',
    NULL,
    NULL,
    NULL,
    '土地面積 72.37㎡(約21.89坪)',
    ARRAY['/images/id113-1.jpg', '/images/id113-2.jpg', '/images/id113-3.jpg', '/images/id113-4.jpg', '/images/id113-5.jpg'],
    '108-0074',
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
    -- House-specific data
    105.50, -- buildingArea (建物面積)
    146.28, -- landArea (土地面積)
    '北側幅員5m公道', -- accessSituation (接道状況)
    60.00, -- buildingCoverageRatio (建ぺい率 60%)
    200.00, -- floorAreaRatio (容積率 200%)
    NULL, -- estimatedRent
    NULL, -- assumedYield
    NULL, -- currentRent
    NULL, -- currentYield
    NULL, -- rentalStatus
    NULL, -- numberOfUnitsInTheBuilding
    NULL  -- exclusiveAreaOfEachResidence     
),
(
    '新宿区西落合4丁目 戸建',
    164800000,
    NULL,
    '東京都新宿区西落合４丁目',
    '2LDK',
    104.51,
    '木造2階建',
    '木造',
    NULL,
    '第一種低層住居専用地域',
    '都営大江戸線 落合南長崎駅 徒歩10分, 西武池袋・豊島線 東長崎駅 徒歩9分',
    9,
    ST_SetSRID(ST_MakePoint(139.6786486871841,35.72716435733369), 4326),
    '中古戸建',
    '2024年02月築',
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
    '2025-06-15',
    '2025-06-29',
    NULL,
    NULL,
    '有',
    NULL,
    NULL,
    NULL,
    '土地面積 108.74㎡(約32.89坪)',
    ARRAY['/images/id114-1.jpg', '/images/id114-2.jpg', '/images/id114-3.jpg', '/images/id114-4.jpg', '/images/id114-5.jpg'],
    '161-0031',
    '首都圏',
    '東京都',
    '23区',
    '新宿区',
    'for sale',    
-- NEW FIELD VALUES (NULL for 中古マンション):
    NULL, -- direction
    NULL, -- urbanPlanning
    NULL, -- condominiumSalesCompany
    NULL, -- constructionCompany
    NULL, -- designCompany
    NULL, -- managementCompany
    -- House-specific data
    158.47, -- buildingArea (建物面積)
    72.37, -- landArea (土地面積)
    '西側幅員6m公道', -- accessSituation (接道状況)
    80.00, -- buildingCoverageRatio (建ぺい率 80%)
    400.00, -- floorAreaRatio (容積率 400%)
    NULL, -- estimatedRent
    NULL, -- assumedYield
    NULL, -- currentRent
    NULL, -- currentYield
    NULL, -- rentalStatus
    NULL, -- numberOfUnitsInTheBuilding
    NULL  -- exclusiveAreaOfEachResidence     
),
(
    '新宿6丁目 戸建',
    158000000,
    NULL,
    '東京都新宿区新宿６丁目',
    '2SLDK',
    101.37,
    '木造3階建',
    '木造',
    NULL,
    '第一種低層住居専用地域',
    '都営大江戸線 東新宿駅 徒歩7分, 東京メトロ副都心線 東新宿駅 徒歩7分, 東京メトロ丸ノ内線 新宿三丁目駅 徒歩12分',
    7,
    ST_SetSRID(ST_MakePoint(139.7092869397973, 35.69536435660881), 4326),
    '中古戸建',
    '2022年04月築',
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
    '2025-06-08',
    '2025-06-22',
    NULL,
    NULL,
    '有',
    NULL,
    NULL,
    NULL,
    '土地面積  	63.4㎡(約19.17坪), ※土地面積は協定部分約０．７平米を含みます。※建物面積は備蓄倉庫約１．４４平米を含みます。',
    ARRAY['/images/id115-1.jpg', '/images/id115-2.jpg', '/images/id115-3.jpg', '/images/id115-4.jpg', '/images/id115-5.jpg'],
    '160-0022',
    '首都圏',
    '東京都',
    '23区',
    '新宿区',
    'for sale',    
-- NEW FIELD VALUES (NULL for 中古マンション):
    NULL, -- direction
    NULL, -- urbanPlanning
    NULL, -- condominiumSalesCompany
    NULL, -- constructionCompany
    NULL, -- designCompany
    NULL, -- managementCompany
    -- House-specific data
    148.12, -- buildingArea (建物面積)
    98.52, -- landArea (土地面積)
    '南側幅員8m公道', -- accessSituation (接道状況)
    80.00, -- buildingCoverageRatio (建ぺい率 80%)
    500.00, -- floorAreaRatio (容積率 500%)
    NULL, -- estimatedRent
    NULL, -- assumedYield
    NULL, -- currentRent
    NULL, -- currentYield
    NULL, -- rentalStatus
    NULL, -- numberOfUnitsInTheBuilding
    NULL  -- exclusiveAreaOfEachResidence     
),
(
    '新宿区中落合2丁目 戸建',
    120000000,
    NULL,
    '東京都新宿区中落合２丁目',
    '4LDK',
    148.07,
    '木造2階 地下1階建',
    '木造',
    NULL,
    '第一種低層住居専用地域',
    '西武新宿線 下落合駅 徒歩6分, 西武池袋・豊島線 椎名町駅 徒歩12分, 都営大江戸線 中井駅 徒歩14分',
    6,
    ST_SetSRID(ST_MakePoint(139.69261306020272, 35.7196685667038), 4326),
    '中古戸建',
    '2000年07月築',
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
    '2025-06-15',
    '2025-06-29',
    NULL,
    NULL,
    '有',
    NULL,
    NULL,
    NULL,
    '土地面積  	107.34㎡(約32.47坪), ※土地面積は協定部分約０．７平米を含みます。※建物面積は備蓄倉庫約１．４４平米を含みます。',
    ARRAY['/images/id116-1.jpg', '/images/id116-2.jpg', '/images/id116-3.jpg', '/images/id116-4.jpg', '/images/id116-5.jpg'],
    '161-0032',
    '首都圏',
    '東京都',
    '23区',
    '新宿区',
    'for sale',    
-- NEW FIELD VALUES (NULL for 中古マンション):
    NULL, -- direction
    NULL, -- urbanPlanning
    NULL, -- condominiumSalesCompany
    NULL, -- constructionCompany
    NULL, -- designCompany
    NULL, -- managementCompany
    -- House-specific data
    229.68, -- buildingArea (建物面積)
    250.18, -- landArea (土地面積)
    '東側幅員8m公道、南側幅員6m公道', -- accessSituation (接道状況)
    50.00, -- buildingCoverageRatio (建ぺい率 50%)
    100.00, -- floorAreaRatio (容積率 100%)
    NULL, -- estimatedRent
    NULL, -- assumedYield
    NULL, -- currentRent
    NULL, -- currentYield
    NULL, -- rentalStatus
    NULL, -- numberOfUnitsInTheBuilding
    NULL  -- exclusiveAreaOfEachResidence     
),
(
    '新宿区西新宿四丁目 借地権付き戸建',
    54800000,
    NULL,
    '東京都新宿区西新宿４丁目',
    '2SLDK',
    76.87,
    '木造3階建',
    '木造',
    NULL,
    '第二種住居地域',
    '都営大江戸線 西新宿五丁目駅 徒歩3分, 東京メトロ丸ノ内線 中野坂上駅 徒歩16分, 京王電鉄京王線 初台駅 徒歩17分',
    3,
    ST_SetSRID(ST_MakePoint(139.6881310774035, 35.68736007539066), 4326),
    '中古戸建',
    '2014年07月築',
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
    '旧法借地権（賃借権）',
    NULL,
    NULL,
    '居住中',
    '相談',
    '仲介',
    NULL,
    '2025-06-17',
    '2025-07-01',
    NULL,
    NULL,
    '有',
    NULL,
    NULL,
    NULL,
    '土地面積  	48.41㎡(約14.64坪), 旧法借地権（賃借権） 借地期間・借地料(月額) 2034年08月まで 15,160円。',
    ARRAY['/images/id117-1.jpg', '/images/id117-2.jpg', '/images/id117-3.jpg', '/images/id117-4.jpg', '/images/id117-5.jpg'],
    '160-0023',
    '首都圏',
    '東京都',
    '23区',
    '新宿区',
    'for sale',    
-- NEW FIELD VALUES (NULL for 中古マンション):
    NULL, -- direction
    NULL, -- urbanPlanning
    NULL, -- condominiumSalesCompany
    NULL, -- constructionCompany
    NULL, -- designCompany
    NULL, -- managementCompany
    -- House-specific data
    229.68, -- buildingArea (建物面積)
    250.18, -- landArea (土地面積)
    '東側幅員8m公道、南側幅員6m公道', -- accessSituation (接道状況)
    50.00, -- buildingCoverageRatio (建ぺい率 50%)
    100.00, -- floorAreaRatio (容積率 100%)
    NULL, -- estimatedRent
    NULL, -- assumedYield
    NULL, -- currentRent
    NULL, -- currentYield
    NULL, -- rentalStatus
    NULL, -- numberOfUnitsInTheBuilding
    NULL  -- exclusiveAreaOfEachResidence     
),
(
    '北新宿1丁目 戸建',
    26800000,
    NULL,
    '東京都新宿区北新宿１丁目',
    '2SLDK',
    109.87,
    '軽量鉄骨造2階建',
    '木造',
    NULL,
    '第二種住居地域',
    '中央・総武緩行線 大久保駅 徒歩9分, 山手線 新大久保駅 徒歩12分, 東京メトロ丸ノ内線 西新宿駅 徒歩11分',
    9,
    ST_SetSRID(ST_MakePoint(139.6881310774035, 35.68736007539066), 4326),
    '中古戸建',
    '2009年12月築',
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
    '土地面積  	164.2㎡(約49.67坪)',
    ARRAY['/images/id118-1.jpg', '/images/id118-2.jpg', '/images/id118-3.jpg', '/images/id118-4.jpg', '/images/id118-5.jpg'],
    '169-0074',
    '首都圏',
    '東京都',
    '23区',
    '新宿区',
    'for sale',    
-- NEW FIELD VALUES (NULL for 中古マンション):
    NULL, -- direction
    NULL, -- urbanPlanning
    NULL, -- condominiumSalesCompany
    NULL, -- constructionCompany
    NULL, -- designCompany
    NULL, -- managementCompany
    -- House-specific data
    229.68, -- buildingArea (建物面積)
    250.18, -- landArea (土地面積)
    '東側幅員8m公道、南側幅員6m公道', -- accessSituation (接道状況)
    50.00, -- buildingCoverageRatio (建ぺい率 50%)
    100.00, -- floorAreaRatio (容積率 100%)
    NULL, -- estimatedRent
    NULL, -- assumedYield
    NULL, -- currentRent
    NULL, -- currentYield
    NULL, -- rentalStatus
    NULL, -- numberOfUnitsInTheBuilding
    NULL  -- exclusiveAreaOfEachResidence     
),
(
    '本駒込5丁目 戸建',
    104800000,
    NULL,
    '東京都文京区本駒込５丁目',
    '3LDK',
    76.5,
    '鉄骨造3階建',
    '鉄骨造',
    NULL,
    '第一種住居地域',
    '山手線 駒込駅 徒歩9分, 東京メトロ南北線 駒込駅 徒歩9分',
    9,
    ST_SetSRID(ST_MakePoint(139.75142297419885, 35.732934991328804), 4326),
    '中古戸建',
    '1991年02月築',
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
    '2025-06-16',
    '2025-06-30',
    NULL,
    NULL,
    '有',
    NULL,
    NULL,
    NULL,
    '土地面積  	45.8㎡(約13.85坪), 記載の建物面積の他、増築未登記部分有り（４階和室）',
    ARRAY['/images/id119-1.jpg', '/images/id119-2.jpg', '/images/id119-3.jpg', '/images/id119-4.jpg', '/images/id119-5.jpg'],
    '113-0021',
    '首都圏',
    '東京都',
    '23区',
    '文京区',
    'for sale',    
-- NEW FIELD VALUES (NULL for 中古マンション):
    NULL, -- direction
    NULL, -- urbanPlanning
    NULL, -- condominiumSalesCompany
    NULL, -- constructionCompany
    NULL, -- designCompany
    NULL, -- managementCompany
    -- House-specific data
    229.68, -- buildingArea (建物面積)
    250.18, -- landArea (土地面積)
    '東側幅員8m公道、南側幅員6m公道', -- accessSituation (接道状況)
    50.00, -- buildingCoverageRatio (建ぺい率 50%)
    100.00, -- floorAreaRatio (容積率 100%)
    NULL, -- estimatedRent
    NULL, -- assumedYield
    NULL, -- currentRent
    NULL, -- currentYield
    NULL, -- rentalStatus
    NULL, -- numberOfUnitsInTheBuilding
    NULL  -- exclusiveAreaOfEachResidence     
),
(
    '千駄木5丁目 戸建',
    93000000,
    NULL,
    '東京都文京区千駄木５丁目',
    '3LDK',
    66.26,
    '木造3階建',
    '木造',
    NULL,
    '第一種中高層住居専用地域',
    '東京メトロ千代田線 千駄木駅 徒歩8分, 東京メトロ南北線 本駒込駅 徒歩9分',
    8,
    ST_SetSRID(ST_MakePoint(139.75837624536243, 35.726900228846176), 4326),
    '中古戸建',
    '2015年05月築',
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
    '土地面積  	54.69㎡(約16.54坪), ※上記土地面積には、隅切り部分約1.0平米が含まれております。',
    ARRAY['/images/id120-1.jpg', '/images/id120-2.jpg', '/images/id120-3.jpg', '/images/id120-4.jpg', '/images/id120-5.jpg'],
    '113-0022',
    '首都圏',
    '東京都',
    '23区',
    '文京区',
    'for sale',    
-- NEW FIELD VALUES (NULL for 中古マンション):
    NULL, -- direction
    NULL, -- urbanPlanning
    NULL, -- condominiumSalesCompany
    NULL, -- constructionCompany
    NULL, -- designCompany
    NULL, -- managementCompany
    -- House-specific data
    229.68, -- buildingArea (建物面積)
    250.18, -- landArea (土地面積)
    '東側幅員8m公道、南側幅員6m公道', -- accessSituation (接道状況)
    50.00, -- buildingCoverageRatio (建ぺい率 50%)
    100.00, -- floorAreaRatio (容積率 100%)
    NULL, -- estimatedRent
    NULL, -- assumedYield
    NULL, -- currentRent
    NULL, -- currentYield
    NULL, -- rentalStatus
    NULL, -- numberOfUnitsInTheBuilding
    NULL  -- exclusiveAreaOfEachResidence     
);