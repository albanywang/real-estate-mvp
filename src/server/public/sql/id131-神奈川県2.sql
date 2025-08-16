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
    'ライフレビュー相模の丘',       -- title
    20500000,                                   -- 価格
    NULL,                                        --平米単価
    '神奈川県相模原市南区磯部',             --所在地
    '4LDK',                                       --間取り
    90.59,                                       --専有面積
    '6階 / 地上6階建',                           --階数 / 階建
    '鉄筋コンクリート造',                                         --建物構造
    16200,                                        --管理費
    '準工業地域',                                  --用途地域
    '相模線 相武台下駅 徒歩16分, 相模線 相武台下駅 バス3分 新磯まちづくりセンター前 停歩5分, 相模線 下溝駅 徒歩25分',  --交通
    16,                                             --徒歩
    ST_SetSRID(ST_MakePoint(139.38822838160854, 35.50302449365519), 4326), -- Single Point: [lng, lat]
    '中古マンション',                              --物件種別
    '2009年01月築',                                  --築年月
    12.86,                                        --バルコニー
    65,                                         --総戸数
    10000,                                       --修繕積立金
    NULL,                                        --借地期間
    NULL,                                        --権利金
    NULL,                                        --敷金 / 保証金
    NULL,                                        --維持費等
    NULL,                 --その他費用
    '有',                                        --駐輪場
    '有',                                        --バイク置き場
    NULL,                                        --敷地面積
    '相談',                                       --ペット
    '所有権',                                     --土地権利
    '管理会社に全部委託',                              --管理形態
    NULL,                                   --国土法届出
    '居住中',                                       --現況
    '即時',                                       --引渡可能時期
    '仲介',                                   --取引態様
    NULL,                                  --物件番号 
    '2025-07-26',                                --情報公開日
    '2025-08-09',                                --次回更新予定日
    NULL,   --備考
    NULL,                                        --evaluationCertificate
    '敷地内有 (賃貸) 空き：3台有り, 月額 0円 (確認日：西暦2025年02月01日現在)',    --駐車場
    NULL,                                       --キッチン
    NULL,                                        --バス・トイレ
    NULL,                                        --設備・サービス
    NULL,                                        --その他
    ARRAY['/images/id131-1.jpg', '/images/id131-2.jpg', '/images/id131-3.jpg', '/images/id131-4.jpg', '/images/id131-5.jpg'],
    -- New area hierarchy and zipcode data
    '252-0327',     -- Harumi area zipcode
    '首都圏',       --area_level_1
    '神奈川',       --area_level_2
    '相模原市',         --area_level_3
    '南区',       --area_level_4
    'for sale',     --status
    -- NEW FIELD VALUES (NULL for 中古マンション):
    '南', -- direction
    NULL, -- urbanPlanning
    '（株）リビングライフ (新築分譲時における売主)', -- 分譲会社
    '朝日建設（株）', -- 施工会社
    '朝日建設（株）１級建築士事務所', -- 設計会社
    '（株）リビングコミュニティ', -- 管理会社
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
    '小川町臨海マンション',       -- title
    26990000,                                   -- 価格
    NULL,                                        --平米単価
    '神奈川県横須賀市小川町',             --所在地
    '3LDK',                                       --間取り
    66,                                       --専有面積
    '6階 / 地上13階建',                           --階数 / 階建
    '鉄筋コンクリート造',                                         --建物構造
    11700,                                        --管理費
    '準工業地域',                                  --用途地域
    '京急本線 横須賀中央駅 徒歩11分',  --交通
    11,                                             --徒歩
    ST_SetSRID(ST_MakePoint(139.67300261839145, 35.28330362099386), 4326), -- Single Point: [lng, lat]
    '中古マンション',                              --物件種別
    '1975年03月築',                                  --築年月
    6.76,                                        --バルコニー
    58,                                         --総戸数
    10850,                                       --修繕積立金
    NULL,                                        --借地期間
    NULL,                                        --権利金
    NULL,                                        --敷金 / 保証金
    NULL,                                        --維持費等
    NULL,                 --その他費用
    '有',                                        --駐輪場
    '有',                                        --バイク置き場
    NULL,                                        --敷地面積
    '相談',                                       --ペット
    '所有権',                                     --土地権利
    '自主管理',                              --管理形態
    NULL,                                   --国土法届出
    '空家',                                       --現況
    '即時',                                       --引渡可能時期
    '仲介',                                   --取引態様
    NULL,                                  --物件番号 
    '2025-08-08',                                --情報公開日
    '2025-08-22',                                --次回更新予定日
    NULL,   --備考
    NULL,                                        --evaluationCertificate
    '敷地内有 (賃貸) 空き：1台有り, 月額 13,000円 (確認日：西暦2025年08月08日現在)',    --駐車場
    NULL,                                       --キッチン
    NULL,                                        --バス・トイレ
    NULL,                                        --設備・サービス
    NULL,                                        --その他
    ARRAY['/images/id132-1.jpg', '/images/id132-2.jpg', '/images/id132-3.jpg', '/images/id132-4.jpg', '/images/id132-5.jpg'],
    -- New area hierarchy and zipcode data
    '238-0004',     -- Harumi area zipcode
    '首都圏',       --area_level_1
    '神奈川',       --area_level_2
    '横須賀市',         --area_level_3
    '小川町',       --area_level_4
    'for sale',     --status
    -- NEW FIELD VALUES (NULL for 中古マンション):
    '南', -- direction
    NULL, -- urbanPlanning
    '（有）古木土地 (新築分譲時における売主)', -- 分譲会社
    '日成工事（株）', -- 施工会社
    '日成工事（株）', -- 設計会社
    NULL, -- 管理会社
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
    'グレーシア湘南平塚海岸',       -- title
    41800000,                                   -- 価格
    NULL,                                        --平米単価
    '神奈川県平塚市龍城ケ丘',             --所在地
    '3LDK',                                       --間取り
    73.2,                                       --専有面積
    '1階 / 地上5階建',                           --階数 / 階建
    '鉄筋コンクリート造',                                         --建物構造
    18260,                                        --管理費
    '準工業地域',                                  --用途地域
    '東海道本線（東京～熱海） 平塚駅 徒歩19分',  --交通
    19,                                             --徒歩
    ST_SetSRID(ST_MakePoint(139.34631161839147, 35.31647674699067), 4326), -- Single Point: [lng, lat]
    '中古マンション',                              --物件種別
    '2023年01月築',                                  --築年月
    12,                                        --バルコニー
    100,                                         --総戸数
    4400,                                       --修繕積立金
    NULL,                                        --借地期間
    NULL,                                        --権利金
    NULL,                                        --敷金 / 保証金
    NULL,                                        --維持費等
    'ガス給湯器リース料 2,310円 / 月、インターネット 825円 / 月',                 --その他費用
    '有',                                        --駐輪場
    '有',                                        --バイク置き場
    NULL,                                        --敷地面積
    '相談',                                       --ペット
    '所有権',                                     --土地権利
    '管理会社に全部委託',                              --管理形態
    NULL,                                   --国土法届出
    '空家',                                       --現況
    '即時',                                       --引渡可能時期
    '仲介',                                   --取引態様
    NULL,                                  --物件番号 
    '2025-08-07',                                --情報公開日
    '2025-08-21',                                --次回更新予定日
    '準防火地域/第二種高度地区',   --備考
    NULL,                                        --evaluationCertificate
    NULL,    --駐車場
    NULL,                                       --キッチン
    NULL,                                        --バス・トイレ
    NULL,                                        --設備・サービス
    NULL,                                        --その他
    ARRAY['/images/id133-1.jpg', '/images/id133-2.jpg', '/images/id133-3.jpg', '/images/id133-4.jpg', '/images/id133-5.jpg'],
    -- New area hierarchy and zipcode data
    '254-0814',     -- Harumi area zipcode
    '首都圏',       --area_level_1
    '神奈川',       --area_level_2
    '平塚市',         --area_level_3
    '龍城ケ丘',       --area_level_4
    'for sale',     --status
    -- NEW FIELD VALUES (NULL for 中古マンション):
    '東', -- direction
    NULL, -- urbanPlanning
    '㈱相鉄不動産㈱ (新築分譲時における売主)', -- 分譲会社
    '㈱長谷工コーポレーション', -- 施工会社
    '㈱長谷工コーポレーション', -- 設計会社
    NULL, -- 管理会社
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
    '東急ドエル・シーサイドコート鎌倉由比ケ浜',       -- title
    79800000,                                   -- 価格
    NULL,                                        --平米単価
    '神奈川県鎌倉市長谷２丁目',             --所在地
    '4LDK',                                       --間取り
    106.35,                                       --専有面積
    '2階 / 地上4階 地下1階建',                           --階数 / 階建
    '鉄筋コンクリート造',                                         --建物構造
    17200,                                        --管理費
    '準工業地域',                                  --用途地域
    '江ノ島電鉄 長谷駅 徒歩5分, 江ノ島電鉄 由比ヶ浜駅 徒歩6分',  --交通
    5,                                             --徒歩
    ST_SetSRID(ST_MakePoint(139.5387857374309, 35.310815132554794), 4326), -- Single Point: [lng, lat]
    '中古マンション',                              --物件種別
    '2001年06月築',                                  --築年月
    9.36,                                        --バルコニー
    55,                                         --総戸数
    26590,                                       --修繕積立金
    NULL,                                        --借地期間
    NULL,                                        --権利金
    NULL,                                        --敷金 / 保証金
    NULL,                                        --維持費等
    NULL,                 --その他費用
    '有',                                        --駐輪場
    '有',                                        --バイク置き場
    NULL,                                        --敷地面積
    '相談',                                       --ペット
    '所有権',                                     --土地権利
    '管理会社に全部委託',                              --管理形態
    NULL,                                   --国土法届出
    '空家',                                       --現況
    '即時',                                       --引渡可能時期
    '仲介',                                   --取引態様
    NULL,                                  --物件番号 
    '2025-08-07',                                --情報公開日
    '2025-08-21',                                --次回更新予定日
    NULL,   --備考
    NULL,                                        --evaluationCertificate
    '敷地内有 (賃貸) 空き：1台有り, 月額 15,000円〜23,000円 (確認日：西暦2024年06月05日現在)',    --駐車場
    NULL,                                       --キッチン
    NULL,                                        --バス・トイレ
    NULL,                                        --設備・サービス
    NULL,                                        --その他
    ARRAY['/images/id134-1.jpg', '/images/id134-2.jpg', '/images/id134-3.jpg', '/images/id134-4.jpg', '/images/id134-5.jpg'],
    -- New area hierarchy and zipcode data
    '248-0016',     -- Harumi area zipcode
    '首都圏',       --area_level_1
    '神奈川',       --area_level_2
    '鎌倉市',         --area_level_3
    '長谷',       --area_level_4
    'for sale',     --status
    -- NEW FIELD VALUES (NULL for 中古マンション):
    '南西', -- direction
    NULL, -- urbanPlanning
    '東急不動産（株） (新築分譲時における売主)', -- 分譲会社
    '（株）奥村組', -- 施工会社
    '（株）佐藤清建築設計事務所', -- 設計会社
    '（株）東急コミュニティ', -- 管理会社
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
    '日神パレステージ湘南藤沢',       -- title
    38990000,                                   -- 価格
    NULL,                                        --平米単価
    '神奈川県藤沢市大鋸３丁目',             --所在地
    '3LDK',                                       --間取り
    67.51,                                       --専有面積
    '1階 / 地上7階建',                           --階数 / 階建
    '鉄筋コンクリート造',                                         --建物構造
    13320,                                        --管理費
    '準工業地域',                                  --用途地域
    '東海道本線（東京～熱海） 藤沢駅 バス9分 山王神社前 停歩2分, 東海道本線（東京～熱海） 藤沢駅 徒歩13分, 小田急電鉄江ノ島線 藤沢駅 徒歩15分',  --交通
    13,                                             --徒歩
    ST_SetSRID(ST_MakePoint(139.48995617791115, 35.34659486862608), 4326), -- Single Point: [lng, lat]
    '中古マンション',                              --物件種別
    '2000年06月築',                                  --築年月
    NULL,                                        --バルコニー
    61,                                         --総戸数
    12810,                                       --修繕積立金
    NULL,                                        --借地期間
    NULL,                                        --権利金
    NULL,                                        --敷金 / 保証金
    NULL,                                        --維持費等
    '専用庭使用料 260円 / 月',                 --その他費用
    '有',                                        --駐輪場
    '有',                                        --バイク置き場
    NULL,                                        --敷地面積
    '相談',                                       --ペット
    '所有権',                                     --土地権利
    '管理会社に全部委託',                              --管理形態
    NULL,                                   --国土法届出
    '空家',                                       --現況
    '即時',                                       --引渡可能時期
    '仲介',                                   --取引態様
    NULL,                                  --物件番号 
    '2025-08-07',                                --情報公開日
    '2025-08-21',                                --次回更新予定日
    NULL,   --備考
    NULL,                                        --evaluationCertificate
    NULL,    --駐車場
    NULL,                                       --キッチン
    NULL,                                        --バス・トイレ
    NULL,                                        --設備・サービス
    NULL,                                        --その他
    ARRAY['/images/id135-1.jpg', '/images/id135-2.jpg', '/images/id135-3.jpg', '/images/id135-4.jpg', '/images/id135-5.jpg'],
    -- New area hierarchy and zipcode data
    '251-0002',     -- Harumi area zipcode
    '首都圏',       --area_level_1
    '神奈川',       --area_level_2
    '藤沢市',         --area_level_3
    '大鋸',       --area_level_4
    'for sale',     --status
    -- NEW FIELD VALUES (NULL for 中古マンション):
    '南東', -- direction
    NULL, -- urbanPlanning
    '日神不動産（株） (新築分譲時における売主)', -- 分譲会社
    '不動建設（株）', -- 施工会社
    '（株）邑設計', -- 設計会社
    NULL, -- 管理会社
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
    '城山ハイム',       -- title
    22900000,                                   -- 価格
    NULL,                                        --平米単価
    '神奈川県藤沢市大鋸３丁目',             --所在地
    '3LDK',                                       --間取り
    70.5,                                       --専有面積
    '2階 / 地上9階建',                           --階数 / 階建
    '鉄筋コンクリート造',                                         --建物構造
    8900,                                        --管理費
    '準工業地域',                                  --用途地域
    '東海道本線（東京～熱海） 小田原駅 徒歩8分',  --交通
    8,                                             --徒歩
    ST_SetSRID(ST_MakePoint(139.14965126256908, 35.25584379532848), 4326), -- Single Point: [lng, lat]
    '中古マンション',                              --物件種別
    '1980年03月築',                                  --築年月
    9.99,                                        --バルコニー
    62,                                         --総戸数
    14500,                                       --修繕積立金
    NULL,                                        --借地期間
    NULL,                                        --権利金
    NULL,                                        --敷金 / 保証金
    NULL,                                        --維持費等
    NULL,                 --その他費用
    '有',                                        --駐輪場
    '有',                                        --バイク置き場
    NULL,                                        --敷地面積
    '相談',                                       --ペット
    '所有権',                                     --土地権利
    '管理会社に全部委託',                              --管理形態
    NULL,                                   --国土法届出
    '空家',                                       --現況
    '即時',                                       --引渡可能時期
    '仲介',                                   --取引態様
    NULL,                                  --物件番号 
    '2025-08-07',                                --情報公開日
    '2025-08-21',                                --次回更新予定日
    NULL,   --備考
    NULL,                                        --evaluationCertificate
    NULL,    --駐車場
    NULL,                                       --キッチン
    NULL,                                        --バス・トイレ
    NULL,                                        --設備・サービス
    NULL,                                        --その他
    ARRAY['/images/id136-1.jpg', '/images/id136-2.jpg', '/images/id136-3.jpg', '/images/id136-4.jpg', '/images/id136-5.jpg'],
    -- New area hierarchy and zipcode data
    '250-0045',     -- Harumi area zipcode
    '首都圏',       --area_level_1
    '神奈川',       --area_level_2
    '小田原市',         --area_level_3
    '城山３丁目',       --area_level_4
    'for sale',     --status
    -- NEW FIELD VALUES (NULL for 中古マンション):
    '南西', -- direction
    NULL, -- urbanPlanning
    '特殊法人日本勤労者住宅協会 (新築分譲時における売主)', -- 分譲会社
    '安藤建設㈱', -- 施工会社
    '㈱東洋建築事務所', -- 設計会社
    '㈱ライフポート西洋', -- 管理会社
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
    'クリオ茅ヶ崎中海岸グランヴィラ',       -- title
    64800000,                                   -- 価格
    NULL,                                        --平米単価
    '神奈川県茅ヶ崎市中海岸３丁目',             --所在地
    '3LDK',                                       --間取り
    68.8,                                       --専有面積
    '3階 / 地上4階建',                           --階数 / 階建
    '鉄筋コンクリート造',                                         --建物構造
    13070,                                        --管理費
    '準工業地域',                                  --用途地域
    '東海道本線（東京～熱海） 茅ケ崎駅 徒歩15分, 相模線 茅ケ崎駅 徒歩15分',  --交通
    15,                                             --徒歩
    ST_SetSRID(ST_MakePoint(139.40215768585855, 35.32140936139428), 4326), -- Single Point: [lng, lat]
    '中古マンション',                              --物件種別
    '2023年05月築',                                  --築年月
    10.8,                                        --バルコニー
    87,                                         --総戸数
    4820,                                       --修繕積立金
    NULL,                                        --借地期間
    NULL,                                        --権利金
    NULL,                                        --敷金 / 保証金
    NULL,                                        --維持費等
    NULL,                 --その他費用
    '有',                                        --駐輪場
    '有',                                        --バイク置き場
    NULL,                                        --敷地面積
    '相談',                                       --ペット
    '所有権',                                     --土地権利
    '管理会社に全部委託',                              --管理形態
    NULL,                                   --国土法届出
    '空家',                                       --現況
    '即時',                                       --引渡可能時期
    '仲介',                                   --取引態様
    NULL,                                  --物件番号 
    '2025-08-04',                                --情報公開日
    '2025-08-18',                                --次回更新予定日
    '※１ペット：小型犬・猫飼育可（成長時の体重12キログラム程度まで、1住戸につき合計2匹まで）',   --備考
    NULL,                                        --evaluationCertificate
    '空き無',    --駐車場
    NULL,                                       --キッチン
    NULL,                                        --バス・トイレ
    NULL,                                        --設備・サービス
    NULL,                                        --その他
    ARRAY['/images/id137-1.jpg', '/images/id137-2.jpg', '/images/id137-3.jpg', '/images/id137-4.jpg', '/images/id137-5.jpg'],
    -- New area hierarchy and zipcode data
    '253-0055',     -- Harumi area zipcode
    '首都圏',       --area_level_1
    '神奈川',       --area_level_2
    '茅ヶ崎市',         --area_level_3
    '中海岸３丁目',       --area_level_4
    'for sale',     --status
    -- NEW FIELD VALUES (NULL for 中古マンション):
    '南東', -- direction
    NULL, -- urbanPlanning
    '明和地所㈱ (新築分譲時における売主)', -- 分譲会社
    '多田建設㈱', -- 施工会社
    '㈱明建築設計事務所', -- 設計会社
    NULL, -- 管理会社
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
    '逗子マリーナ厚生用建物 2号棟',       -- title
    49900000,                                   -- 価格
    NULL,                                        --平米単価
    '神奈川県逗子市小坪５丁目',             --所在地
    '2LDK',                                       --間取り
    62.35,                                       --専有面積
    '3階 / 地上12階 地下1階建',                           --階数 / 階建
    '鉄筋コンクリート造',                                         --建物構造
    20050,                                        --管理費
    '準工業地域',                                  --用途地域
    '横須賀線 鎌倉駅 バス14分 リビエラ逗子マリーナ前 停歩4分',  --交通
    14,                                             --徒歩
    ST_SetSRID(ST_MakePoint(139.5527818220888, 35.29726116077857), 4326), -- Single Point: [lng, lat]
    '中古マンション',                              --物件種別
    '1973年04月築',                                  --築年月
    4.35,                                        --バルコニー
    78,                                         --総戸数
    27820,                                       --修繕積立金
    NULL,                                        --借地期間
    NULL,                                        --権利金
    NULL,                                        --敷金 / 保証金
    NULL,                                        --維持費等
    NULL,                 --その他費用
    '有',                                        --駐輪場
    '有',                                        --バイク置き場
    NULL,                                        --敷地面積
    '相談',                                       --ペット
    '所有権',                                     --土地権利
    '管理会社に全部委託',                              --管理形態
    NULL,                                   --国土法届出
    '空家',                                       --現況
    '相談',                                       --引渡可能時期
    '仲介',                                   --取引態様
    NULL,                                  --物件番号 
    '2025-08-16',                                --情報公開日
    '2025-08-30',                                --次回更新予定日
    '※１ペット：小型犬・猫飼育可（成長時の体重12キログラム程度まで、1住戸につき合計2匹まで）',   --備考
    NULL,                                        --evaluationCertificate
    '敷地内有 (賃貸) 空き：1台有り, 月額 8,800円 (確認日：西暦2025年06月01日現在)',    --駐車場
    NULL,                                       --キッチン
    NULL,                                        --バス・トイレ
    NULL,                                        --設備・サービス
    NULL,                                        --その他
    ARRAY['/images/id138-1.jpg', '/images/id138-2.jpg', '/images/id138-3.jpg', '/images/id138-4.jpg', '/images/id138-5.jpg'],
    -- New area hierarchy and zipcode data
    '249-0008',     -- Harumi area zipcode
    '首都圏',       --area_level_1
    '神奈川',       --area_level_2
    '逗子市',         --area_level_3
    '小坪５丁目',       --area_level_4
    'for sale',     --status
    -- NEW FIELD VALUES (NULL for 中古マンション):
    '北西', -- direction
    NULL, -- urbanPlanning
    '太洋不動産興業 (新築分譲時における売主)', -- 分譲会社
    '竹中工務店', -- 施工会社
    NULL, -- 設計会社
    '株式会社リビエラリゾート', -- 管理会社
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
    'シーボニアマンション A棟',       -- title
    27000000,                                   -- 価格
    NULL,                                        --平米単価
    '神奈川県三浦市三崎町小網代',             --所在地
    '1LDK',                                       --間取り
    35.15,                                       --専有面積
    '4階 / 地上10階建',                           --階数 / 階建
    '鉄筋コンクリート造',                                         --建物構造
    10932,                                        --管理費
    '準工業地域',                                  --用途地域
    '京急久里浜線 三崎口駅 バス14分 シーボニア入口 停歩5分',  --交通
    14,                                             --徒歩
    ST_SetSRID(ST_MakePoint(139.62043775462175, 35.162242012086374), 4326), -- Single Point: [lng, lat]
    '中古マンション',                              --物件種別
    '1970年11月築',                                  --築年月
    NULL,                                        --バルコニー
    140,                                         --総戸数
    12800,                                       --修繕積立金
    NULL,                                        --借地期間
    NULL,                                        --権利金
    NULL,                                        --敷金 / 保証金
    NULL,                                        --維持費等
    NULL,                 --その他費用
    '有',                                        --駐輪場
    '有',                                        --バイク置き場
    NULL,                                        --敷地面積
    '相談',                                       --ペット
    '所有権',                                     --土地権利
    '管理会社に一部委託',                              --管理形態
    NULL,                                   --国土法届出
    '空家',                                       --現況
    '相談',                                       --引渡可能時期
    '仲介',                                   --取引態様
    NULL,                                  --物件番号 
    '2025-08-07',                                --情報公開日
    '2025-08-21',                                --次回更新予定日
    '※１ペット：小型犬・猫飼育可（成長時の体重12キログラム程度まで、1住戸につき合計2匹まで）',   --備考
    NULL,                                        --evaluationCertificate
    NULL,    --駐車場
    NULL,                                       --キッチン
    NULL,                                        --バス・トイレ
    NULL,                                        --設備・サービス
    NULL,                                        --その他
    ARRAY['/images/id139-1.jpg', '/images/id139-2.jpg', '/images/id139-3.jpg', '/images/id139-4.jpg', '/images/id139-5.jpg'],
    -- New area hierarchy and zipcode data
    '238-0225',     -- Harumi area zipcode
    '首都圏',       --area_level_1
    '神奈川',       --area_level_2
    '三浦市',         --area_level_3
    '三崎町',       --area_level_4
    'for sale',     --status
    -- NEW FIELD VALUES (NULL for 中古マンション):
    '北', -- direction
    NULL, -- urbanPlanning
    'パンパシフィック・エンタープライズ（株） (新築分譲時における売主)', -- 分譲会社
    '（株）大林組', -- 施工会社
    NULL, -- 設計会社
    '（株）リビエラリゾート', -- 管理会社
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
    'ミサワホームズ本厚木',       -- title
    48800000,                                   -- 価格
    NULL,                                        --平米単価
    '神奈川県厚木市厚木町',             --所在地
    '4LDK',                                       --間取り
    89.43,                                       --専有面積
    '12階 / 地上14階建',                           --階数 / 階建
    '鉄筋コンクリート造',                                         --建物構造
    8800,                                        --管理費
    '準工業地域',                                  --用途地域
    '小田急電鉄小田原線 本厚木駅 徒歩6分',  --交通
    6,                                             --徒歩
    ST_SetSRID(ST_MakePoint(139.3696526355822, 35.44163837042681), 4326), -- Single Point: [lng, lat]
    '中古マンション',                              --物件種別
    '1998年11月築',                                  --築年月
    14.62,                                        --バルコニー
    69,                                         --総戸数
    17980,                                       --修繕積立金
    NULL,                                        --借地期間
    NULL,                                        --権利金
    NULL,                                        --敷金 / 保証金
    NULL,                                        --維持費等
    NULL,                 --その他費用
    '有',                                        --駐輪場
    '有',                                        --バイク置き場
    NULL,                                        --敷地面積
    '相談',                                       --ペット
    '所有権',                                     --土地権利
    '管理会社に一部委託',                              --管理形態
    NULL,                                   --国土法届出
    '空家',                                       --現況
    '2025年08月下旬以降',                                       --引渡可能時期
    '仲介',                                   --取引態様
    NULL,                                  --物件番号 
    '2025-08-08',                                --情報公開日
    '2025-08-22',                                --次回更新予定日
    NULL,   --備考
    NULL,                                        --evaluationCertificate
    '敷地内有 (賃貸) 空き：16台有り, 月額 15,000円〜17,000円 (確認日：西暦2025年04月26日現在)',    --駐車場
    NULL,                                       --キッチン
    NULL,                                        --バス・トイレ
    NULL,                                        --設備・サービス
    NULL,                                        --その他
    ARRAY['/images/id140-1.jpg', '/images/id140-2.jpg', '/images/id140-3.jpg', '/images/id140-4.jpg', '/images/id140-5.jpg'],
    -- New area hierarchy and zipcode data
    '243-0011',     -- Harumi area zipcode
    '首都圏',       --area_level_1
    '神奈川',       --area_level_2
    '厚木市',         --area_level_3
    '厚木町',       --area_level_4
    'for sale',     --status
    -- NEW FIELD VALUES (NULL for 中古マンション):
    '南', -- direction
    NULL, -- urbanPlanning
    'ミサワバン（株） (新築分譲時における売主)', -- 分譲会社
    '東急建設（株）', -- 施工会社
    '東急建設（株）', -- 設計会社
    '株式会社東急コミュニティー', -- 管理会社
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
