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
    'アトラスシティ千歳烏山グランスイート杜ノ棟',
    148000000,
    2999500,
    '東京都世田谷区給田３丁目',
    '4LDK',
    84.15,
    '4階 / 地上4階建',
    'RC',
    18850,
    '準工業地域',
    '京王電鉄京王線 千歳烏山駅 徒歩9分, 京王電鉄京王線 仙川駅 徒歩13分',
    9,
    ST_SetSRID(ST_MakePoint(139.5926602625632,35.66617682081538), 4326),
    '新築マンション',
    '2025年08月築',
    5.94,
    248,
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
    '日勤',
    '届出不要',
    '空家',
    '相談',
    '仲介',
    1122083505,
    '2025-06-19',
    '2025-07-03',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    '管理会社に全部委託',
    ARRAY['/images/id93-1.jpg', '/images/id93-2.jpg', '/images/id93-3.jpg', '/images/id93-4.jpg', '/images/id93-5.jpg'],
    '157-0064',
    '首都圏',
    '東京都',
    '23区',
    '世田谷区',
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
),
(
    'プラウド二子玉川',
    199500000,
    2999500,
    '東京都世田谷区玉川１丁目',
    '3LDK',
    76.86,
    '9階 / 地上12階建',
    'RC',
    27670,
    '準工業地域',
    '東急田園都市線 二子玉川駅 徒歩2分',
    2,
    ST_SetSRID(ST_MakePoint(139.62686882209107, 35.61108947512658), 4326),
    '新築マンション',
    '2024年07月築',
    14.58,
    132,
    16830,
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
    '2025-06-09',
    '2025-06-23',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    'enecoQシステム料 1,694円 / 月, 管理会社に全部委託',
    ARRAY['/images/id94-1.jpg', '/images/id94-2.jpg', '/images/id94-3.jpg', '/images/id94-4.jpg', '/images/id94-5.jpg'],
    '158-0094',
    '首都圏',
    '東京都',
    '23区',
    '世田谷区',
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
),
(
    'プレミスト南平台',
    1200000000,
    2999500,
    '東京都渋谷区南平台町',
    '2LDK',
    143.44,
    '3階 / 地上4階建',
    'RC',
    125400,
    '準工業地域',
    '山手線 渋谷駅 徒歩10分, 東急東横線 代官山駅 徒歩11分',
    10,
    ST_SetSRID(ST_MakePoint(139.62686882209107, 35.61108947512658), 4326),
    '新築マンション',
    '2024年09月築',
    14.58,
    22,
    42300,
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
    '2025-06-20',
    '2025-07-04',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    'eインターネット使用料 1,815円 / 月、インターホンIoT料 330円 / 月, 管理会社に全部委託',
    ARRAY['/images/id95-1.jpg', '/images/id95-2.jpg', '/images/id95-3.jpg', '/images/id95-4.jpg', '/images/id95-5.jpg'],
    '150-0036',
    '首都圏',
    '東京都',
    '23区',
    '渋谷区',
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
),
(
    'プラウドタワー渋谷',
    428000000,
    2999500,
    '東京都渋谷区渋谷３丁目',
    '3LDK',
    78.09,
    '9階 / 地上26階建',
    'RC',
    37580,
    '準工業地域',
    '山手線 渋谷駅 徒歩7分, 東京メトロ半蔵門線 渋谷駅 徒歩5分',
    5,
    ST_SetSRID(ST_MakePoint(139.7069541802718, 35.65646484078198), 4326),
    '新築マンション',
    '2025年03月築',
    14.58,
    132,
    18870,
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
    '2025-06-10',
    '2025-06-24',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    'eインターネット使用料 1,815円 / 月、インターホンIoT料 330円 / 月, 管理会社に全部委託',
    ARRAY['/images/id96-1.jpg', '/images/id96-2.jpg', '/images/id96-3.jpg', '/images/id96-4.jpg', '/images/id96-5.jpg'],
    '150-0002',
    '首都圏',
    '東京都',
    '23区',
    '渋谷区',
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
),
(
    'パークシティ中野 ザ タワー ブリーズ',
    488000000,
    2999500,
    '東京都中野区中野４丁目',
    '2LDK',
    104.15,
    '20階 / 地上20階建',
    'RC',
    46560,
    '準工業地域',
    '中央本線 中野駅 徒歩8分, 中央・総武緩行線 中野駅 徒歩8分, 東京メトロ東西線 中野駅 徒歩8分',
    8,
    ST_SetSRID(ST_MakePoint(139.66181416070816, 35.70611550785688), 4326),
    '新築マンション',
    '2025年12月築（予定）',
    22.49,
    262,
    15620,
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
    '未完成',
    '相談',
    '仲介',
    1122083505,
    '2025-06-19',
    '2025-07-03',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    'インターネット使用料 1,155円 / 月, ペデストリアンデッキ（完成予定：2030年度）および西側南北自由通路（完成予定：2026年度）完成後は中野駅からブリーズまで徒歩5分となります。なお事業完了予定時期は遅れる場合がございます。',
    ARRAY['/images/id97-1.jpg', '/images/id97-2.jpg', '/images/id97-3.jpg', '/images/id97-4.jpg', '/images/id97-5.jpg'],
    '164-0001',
    '首都圏',
    '東京都',
    '23区',
    '中野区',
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
),
(
    'パークホームズ南池袋',
    158000000,
    2999500,
    '東京都豊島区南池袋１丁目',
    '2LDK',
    58.52,
    '13階 / 地上17階建',
    'RC',
    25750,
    '準工業地域',
    '山手線 池袋駅 徒歩7分, 東京メトロ有楽町線 池袋駅 徒歩7分, 東京メトロ丸ノ内線 池袋駅 徒歩7分',
    7,
    ST_SetSRID(ST_MakePoint(139.71129211905256, 35.723975212506225), 4326),
    '新築マンション',
    '2025年03月築',
    8,
    52,
    13750,
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
    '2025-06-15',
    '2025-06-29',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    'インターネット 1,045円 / 月, 管理会社に全部委託',
    ARRAY['/images/id98-1.jpg', '/images/id98-2.jpg', '/images/id98-3.jpg', '/images/id98-4.jpg', '/images/id98-5.jpg'],
    '171-0022',
    '首都圏',
    '東京都',
    '23区',
    '豊島区',
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
),
(
    'ザ・タワー十条',
    288000000,
    2999500,
    '東京都北区上十条２丁目',
    '3LDK',
    97.63,
    '38階 / 地上39階建',
    'RC',
    35040,
    '準工業地域',
    '埼京線 十条駅 徒歩1分, 京浜東北・根岸線 東十条駅 徒歩9分',
    1,
    ST_SetSRID(ST_MakePoint(139.72125853372674, 35.760354059167774), 4326),
    '新築マンション',
    '2024年10月築',
    20.07,
    578,
    9760,
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
    '2025-06-15',
    '2025-06-29',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    '※専有面積にはトランクルーム面積０．７７平米を含みます。【管理費内訳】全体：18,840円/月　住宅：16,200円/月, 【修繕積立金内訳】全体：1,950円/月　住宅：7,810円/月, 管理会社に全部委託',
    ARRAY['/images/id99-1.jpg', '/images/id99-2.jpg', '/images/id99-3.jpg', '/images/id99-4.jpg', '/images/id99-5.jpg'],
    '114-0034',
    '首都圏',
    '東京都',
    '23区',
    '北区',
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
),
(
    'シティテラス多摩川 C棟',
    56800000,
    2999500,
    '東京都調布市染地３丁目',
    '3LDK',
    63.8,
    '10階 / 地上12階建',
    'RC',
    15535,
    '準工業地域',
    '京王電鉄京王線 国領駅 徒歩22分, 小田急電鉄小田原線 狛江駅 徒歩20分',
    20,
    ST_SetSRID(ST_MakePoint(139.5620414490725, 35.637885079240654), 4326),
    '新築マンション',
    '2025年01月築',
    9.99,
    900,
    6540,
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
    '2025-06-20',
    '2025-07-04',
    '主要採光面：東向き,住友不動産建物サービス（株）',
    NULL,
    '有',
    'カウンターキッチン',
    'バス・トイレ別',
    'スカイラウンジ、温浴施設、フィットネス、ゲストスイート',
    '管理会社に全部委託',
    ARRAY['/images/id100-1.jpg', '/images/id100-2.jpg', '/images/id100-3.jpg', '/images/id100-4.jpg', '/images/id100-5.jpg'],
    '182-0023',
    '首都圏',
    '東京都',
    'その他市部',
    '調布市',
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
