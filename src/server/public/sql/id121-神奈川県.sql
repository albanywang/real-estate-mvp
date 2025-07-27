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
    'サングレイスヒルズ能見台',       -- title
    25800000,                                   -- 価格
    NULL,                                        --平米単価
    '神奈川県横浜市金沢区能見台６丁目',             --所在地
    '3LDK',                                       --間取り
    71.95,                                       --専有面積
    '2階 / 地上4階建',                           --階数 / 階建
    '鉄筋コンクリート造',                                         --建物構造
    8520,                                        --管理費
    '準工業地域',                                  --用途地域
    '京急本線 金沢文庫駅 バス11分 能見台六丁目 停歩2分, 京急本線 能見台駅 バス15分 能見台六丁目 停歩2分',  --交通
    2,                                             --徒歩
    ST_SetSRID(ST_MakePoint(139.6145248397014, 35.352221594798735), 4326), -- Single Point: [lng, lat]
    '中古マンション',                              --物件種別
    '1997年05月築',                                  --築年月
    8.77,                                        --バルコニー
    33,                                         --総戸数
    15030,                                       --修繕積立金
    NULL,                                        --借地期間
    NULL,                                        --権利金
    NULL,                                        --敷金 / 保証金
    NULL,                                        --維持費等
    NULL,                                        --その他費用
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
    '2025-07-24',                                --情報公開日
    '2025-08-07',                                --次回更新予定日
    '※専有部分賃貸、または６カ月以上不在時は管理組合協力金（月額：1,000円）が発生いたします。（不在翌月より発生）',   --備考
    NULL,                                        --evaluationCertificate
    NULL,                                       --駐車場
    NULL,                                       --キッチン
    NULL,                                        --バス・トイレ
    NULL,                                        --設備・サービス
    NULL,                                        --その他
    ARRAY['/images/id121-1.jpg', '/images/id121-2.jpg', '/images/id121-3.jpg', '/images/id121-4.jpg', '/images/id121-5.jpg'],
    -- New area hierarchy and zipcode data
    '236-0057',     -- Harumi area zipcode
    '首都圏',       --area_level_1
    '神奈川',       --area_level_2
    '横浜市',         --area_level_3
    '金沢区',       --area_level_4
    'for sale',     --status
    -- NEW FIELD VALUES (NULL for 中古マンション):
    '南東', -- direction
    NULL, -- urbanPlanning
    'グレイス住販（株） (新築分譲時における売主)', -- condominiumSalesCompany
    '東海興業（株）', -- constructionCompany
    NULL, -- designCompany
    '（株）京急リブコ', -- managementCompany
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
    'リヴァリエ B棟',       -- title
    71700000,                                   -- 価格
    NULL,                                        --平米単価
    '神奈川県川崎市川崎区港町',             --所在地
    '2LDK',                                       --間取り
    70.47,                                       --専有面積
    '26階 / 地上29階 地下1階建',                           --階数 / 階建
    '鉄筋コンクリート造',                                         --建物構造
    17870,                                        --管理費
    '準工業地域',                                  --用途地域
    '京急大師線 港町駅 徒歩2分, 京急本線 京急川崎駅 徒歩19分, 東海道本線（東京～熱海） 川崎駅 徒歩22分',  --交通
    2,                                             --徒歩
    ST_SetSRID(ST_MakePoint(139.71410585649264, 35.53594190002849), 4326), -- Single Point: [lng, lat]
    '中古マンション',                              --物件種別
    '2014年11月築',                                  --築年月
    12,                                        --バルコニー
    478,                                         --総戸数
    10710,                                       --修繕積立金
    NULL,                                        --借地期間
    NULL,                                        --権利金
    NULL,                                        --敷金 / 保証金
    NULL,                                        --維持費等
    NULL,                                        --その他費用
    '有',                                        --駐輪場
    '有',                                        --バイク置き場
    NULL,                                        --敷地面積
    '相談',                                       --ペット
    '所有権',                                     --土地権利
    '管理会社に全部委託',                              --管理形態
    NULL,                                   --国土法届出
    '居住中',                                       --現況
    '相談',                                       --引渡可能時期
    '仲介',                                   --取引態様
    NULL,                                  --物件番号 
    '2025-07-26',                                --情報公開日
    '2025-08-09',                                --次回更新予定日
    NULL,   --備考
    NULL,                                        --evaluationCertificate
    '敷地内有 (賃貸) 空き：41台有り, 月額 16,000円〜23,000円 (確認日：西暦2025年05月01日現在)',                                       --駐車場
    NULL,                                       --キッチン
    NULL,                                        --バス・トイレ
    NULL,                                        --設備・サービス
    'インターネット使用料 1,210円 / 月、フレンドリークラブ会費 300円 / 月',                                        --その他
    ARRAY['/images/id122-1.jpg', '/images/id122-2.jpg', '/images/id122-3.jpg', '/images/id122-4.jpg', '/images/id122-5.jpg'],
    -- New area hierarchy and zipcode data
    '210-0807',     -- Harumi area zipcode
    '首都圏',       --area_level_1
    '神奈川',       --area_level_2
    '川崎市',         --area_level_3
    '川崎区',       --area_level_4
    'for sale',     --status
    -- NEW FIELD VALUES (NULL for 中古マンション):
    '北東', -- direction
    NULL, -- urbanPlanning
    '京浜急行電鉄（株）、大和ハウス工業（株） (新築分譲時における売主)', -- condominiumSalesCompany
    '（株）大林組', -- constructionCompany
    '（株）大林組', -- designCompany
    '（株）レーベンコミュニティ', -- managementCompany
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
    'クレストプライムレジデンス アベニュー壱番街',       -- title
    64990000,                                   -- 価格
    NULL,                                        --平米単価
    '神奈川県川崎市幸区新小倉',             --所在地
    '2LDK',                                       --間取り
    80.49,                                       --専有面積
    '4階 / 地上15階 地下1階建',                           --階数 / 階建
    '鉄筋コンクリート造',                                         --建物構造
    16100,                                        --管理費
    '準工業地域',                                  --用途地域
    '南武線 矢向駅 徒歩9分, 横須賀線 新川崎駅 徒歩22分',  --交通
    9,                                             --徒歩
    ST_SetSRID(ST_MakePoint(139.67406170303528, 35.53860319633358), 4326), -- Single Point: [lng, lat]
    '中古マンション',                              --物件種別
    '2015年07月築',                                  --築年月
    10.2,                                        --バルコニー
    417,                                         --総戸数
    12500,                                       --修繕積立金
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
    '2025-07-21',                                --情報公開日
    '2025-08-04',                                --次回更新予定日
    'ポーチ面積：8.2平米',   --備考
    NULL,                                        --evaluationCertificate
    '敷地内有 (賃貸) 空き：30台有り, 月額 9,000円〜20,000円 (確認日：西暦2025年07月21日現在)',    --駐車場
    NULL,                                       --キッチン
    NULL,                                        --バス・トイレ
    NULL,                                        --設備・サービス
    'インターネット 1,470円 / 月',                                        --その他
    ARRAY['/images/id123-1.jpg', '/images/id123-2.jpg', '/images/id123-3.jpg', '/images/id123-4.jpg', '/images/id123-5.jpg'],
    -- New area hierarchy and zipcode data
    '212-0031',     -- Harumi area zipcode
    '首都圏',       --area_level_1
    '神奈川',       --area_level_2
    '川崎市',         --area_level_3
    '幸区',       --area_level_4
    'for sale',     --status
    -- NEW FIELD VALUES (NULL for 中古マンション):
    '南東', -- direction
    NULL, -- urbanPlanning
    '（株）ゴールドクレスト (新築分譲時における売主)', -- condominiumSalesCompany
    '五洋建設（株）', -- constructionCompany
    '（株）日建ハウジングシステム', -- designCompany
    '（株）ゴールドクレストコミュニティ', -- managementCompany
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
    'グランドメゾン元住吉 ノーステラス',       -- title
    81800000,                                   -- 価格
    NULL,                                        --平米単価
    '神奈川県川崎市中原区井田中ノ町',             --所在地
    '1LDK',                                       --間取り
    64.57,                                       --専有面積
    '4階 / 地上5階 地下1階建',                           --階数 / 階建
    '鉄筋コンクリート造',                                         --建物構造
    13700,                                        --管理費
    '準工業地域',                                  --用途地域
    '東急東横線 元住吉駅 徒歩9分, 東急目黒線 元住吉駅 徒歩9分',  --交通
    9,                                             --徒歩
    ST_SetSRID(ST_MakePoint(139.6473154490725, 35.56655809090372), 4326), -- Single Point: [lng, lat]
    '中古マンション',                              --物件種別
    '2017年11月築',                                  --築年月
    9.86,                                        --バルコニー
    144,                                         --総戸数
    13700,                                       --修繕積立金
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
    '2025年11月上旬以降',                                       --引渡可能時期
    '仲介',                                   --取引態様
    NULL,                                  --物件番号 
    '2025-07-26',                                --情報公開日
    '2025-08-09',                                --次回更新予定日
    NULL,   --備考
    NULL,                                        --evaluationCertificate
    '敷地内有 (賃貸) 空き：10台有り, 月額 16,000円〜20,000円 (確認日：西暦2025年07月25日現在)',    --駐車場
    NULL,                                       --キッチン
    NULL,                                        --バス・トイレ
    NULL,                                        --設備・サービス
    'SESシステム利用料 1,166円 / 月',                                        --その他
    ARRAY['/images/id124-1.jpg', '/images/id124-2.jpg', '/images/id124-3.jpg', '/images/id124-4.jpg', '/images/id124-5.jpg'],
    -- New area hierarchy and zipcode data
    '211-0036',     -- Harumi area zipcode
    '首都圏',       --area_level_1
    '神奈川',       --area_level_2
    '川崎市',         --area_level_3
    '中原区',       --area_level_4
    'for sale',     --status
    -- NEW FIELD VALUES (NULL for 中古マンション):
    '南', -- direction
    NULL, -- urbanPlanning
    '積水ハウス（株） (新築分譲時における売主)', -- condominiumSalesCompany
    '（株）長谷工コーポレーション', -- constructionCompany
    '（株）長谷工コーポレーション', -- designCompany
    '積水ハウスＧＭパートナーズ（株）', -- managementCompany
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
    'セボンコリネール エストエール',       -- title
    49990000,                                   -- 価格
    NULL,                                        --平米単価
    '神奈川県川崎市高津区久地４丁目',             --所在地
    '2SLDK',                                       --間取り
    72.45,                                       --専有面積
    '6階 / 地上7階 地下3階建',                           --階数 / 階建
    '鉄筋コンクリート造',                                         --建物構造
    11230,                                        --管理費
    '準工業地域',                                  --用途地域
    '南武線 久地駅 徒歩9分',  --交通
    9,                                             --徒歩
    ST_SetSRID(ST_MakePoint(139.60011234991669, 35.60889905522448), 4326), -- Single Point: [lng, lat]
    '中古マンション',                              --物件種別
    '2004年09月築',                                  --築年月
    12.6,                                        --バルコニー
    80,                                         --総戸数
    13260,                                       --修繕積立金
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
    '2025年11月上旬以降',                                       --引渡可能時期
    '仲介',                                   --取引態様
    NULL,                                  --物件番号 
    '2025-07-20',                                --情報公開日
    '2025-08-03',                                --次回更新予定日
    '※専用使用権, ・トランクルーム：無償, ・駐輪場：月額200円（原則1住戸1台、ステッカー貼付）',   --備考
    NULL,                                        --evaluationCertificate
    '空き無',    --駐車場
    NULL,                                       --キッチン
    NULL,                                        --バス・トイレ
    NULL,                                        --設備・サービス
    '専用駐輪場使用料 200円 / 月',                                        --その他
    ARRAY['/images/id125-1.jpg', '/images/id125-2.jpg', '/images/id125-3.jpg', '/images/id125-4.jpg', '/images/id125-5.jpg'],
    -- New area hierarchy and zipcode data
    '213-0032',     -- Harumi area zipcode
    '首都圏',       --area_level_1
    '神奈川',       --area_level_2
    '川崎市',         --area_level_3
    '高津区',       --area_level_4
    'for sale',     --status
    -- NEW FIELD VALUES (NULL for 中古マンション):
    '南西', -- direction
    NULL, -- urbanPlanning
    'セボン（株） (新築分譲時における売主)', -- condominiumSalesCompany
    '（新日石エンジニアリング（株）', -- constructionCompany
    '（株）柴田建築設計事務所', -- designCompany
    'ハイネス管理（株）', -- managementCompany
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
    'パークホームズ登戸ステーションアヴェニュー',       -- title
    79800000,                                   -- 価格
    NULL,                                        --平米単価
    '神奈川県川崎市多摩区登戸',             --所在地
    '2LDK',                                       --間取り
    56.7,                                       --専有面積
    '11階 / 地上15階建',                           --階数 / 階建
    '鉄筋コンクリート造',                                         --建物構造
    13210,                                        --管理費
    '準工業地域',                                  --用途地域
    '小田急電鉄小田原線 登戸駅 徒歩2分, 南武線 登戸駅 徒歩3分, 小田急電鉄小田原線 向ヶ丘遊園駅 徒歩7分',  --交通
    2,                                             --徒歩
    ST_SetSRID(ST_MakePoint(139.56856570438487, 35.62111098353919), 4326), -- Single Point: [lng, lat]
    '中古マンション',                              --物件種別
    '2022年12月築',                                  --築年月
    10.16,                                        --バルコニー
    53,                                         --総戸数
    10890,                                       --修繕積立金
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
    '相談',                                       --引渡可能時期
    '仲介',                                   --取引態様
    NULL,                                  --物件番号 
    '2025-07-24',                                --情報公開日
    '2025-08-07',                                --次回更新予定日
    NULL,   --備考
    NULL,                                        --evaluationCertificate
    '敷地内有 (賃貸) 空き：2台有り, 月額 16,000円〜25,000円 (確認日：西暦2025年06月12日現在)',    --駐車場
    NULL,                                       --キッチン
    NULL,                                        --バス・トイレ
    NULL,                                        --設備・サービス
    'インターネット等使用料 550円 / 月',                                        --その他
    ARRAY['/images/id126-1.jpg', '/images/id126-2.jpg', '/images/id126-3.jpg', '/images/id126-4.jpg', '/images/id126-5.jpg'],
    -- New area hierarchy and zipcode data
    '214-0014',     -- Harumi area zipcode
    '首都圏',       --area_level_1
    '神奈川',       --area_level_2
    '川崎市',         --area_level_3
    '多摩区',       --area_level_4
    'for sale',     --status
    -- NEW FIELD VALUES (NULL for 中古マンション):
    '南西', -- direction
    NULL, -- urbanPlanning
    '三井不動産レジデンシャル（株） (新築分譲時における売主)', -- condominiumSalesCompany
    '（東洋建設（株）', -- constructionCompany
    '（株）ＩＡＯ竹田設計', -- designCompany
    '三井不動産レジデンシャルサービス（株）', -- managementCompany
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
    'セザールたまプラーザ',       -- title
    36800000,                                   -- 価格
    NULL,                                        --平米単価
    '神奈川県川崎市宮前区犬蔵２丁目',             --所在地
    '2DK',                                       --間取り
    50.58,                                       --専有面積
    '5階 / 地上8階建',                           --階数 / 階建
    '鉄筋コンクリート造',                                         --建物構造
    13500,                                        --管理費
    '準工業地域',                                  --用途地域
    '東急田園都市線 たまプラーザ駅 徒歩14分',  --交通
    14,                                             --徒歩
    ST_SetSRID(ST_MakePoint(139.56420614485702, 35.58448885653708), 4326), -- Single Point: [lng, lat]
    '中古マンション',                              --物件種別
    '1991年07月築',                                  --築年月
    8.15,                                        --バルコニー
    19,                                         --総戸数
    12645,                                       --修繕積立金
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
    '2025-07-25',                                --情報公開日
    '2025-08-08',                                --次回更新予定日
    '※町内会費について＜単身者：年額1,200円＞＜家族世帯：年額2,400円＞',   --備考
    NULL,                                        --evaluationCertificate
    '空き無',    --駐車場
    NULL,                                       --キッチン
    NULL,                                        --バス・トイレ
    NULL,                                        --設備・サービス
    '町内会費 200円 / 月',                                        --その他
    ARRAY['/images/id127-1.jpg', '/images/id127-2.jpg', '/images/id127-3.jpg', '/images/id127-4.jpg', '/images/id127-5.jpg'],
    -- New area hierarchy and zipcode data
    '216-0011',     -- Harumi area zipcode
    '首都圏',       --area_level_1
    '神奈川',       --area_level_2
    '川崎市',         --area_level_3
    '宮前区',       --area_level_4
    'for sale',     --status
    -- NEW FIELD VALUES (NULL for 中古マンション):
    '北東', -- direction
    NULL, -- urbanPlanning
    '（株）セザール (新築分譲時における売主)', -- condominiumSalesCompany
    '東洋建設（株）', -- constructionCompany
    '（有）大倉建築事務所', -- designCompany
    '三井不動産レジデンシャルサービス（株）', -- managementCompany
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
    'エスポワール五月台',       -- title
    28800000,                                   -- 価格
    NULL,                                        --平米単価
    '神奈川県川崎市麻生区片平４丁目',             --所在地
    '3DK',                                       --間取り
    77.72,                                       --専有面積
    '1階 / 地上2階 地下1階建',                           --階数 / 階建
    '鉄筋コンクリート造',                                         --建物構造
    3617,                                        --管理費
    '準工業地域',                                  --用途地域
    '小田急電鉄小田原線 柿生駅 徒歩17分, 小田急電鉄多摩線 五月台駅 徒歩18分, 小田急電鉄小田原線 鶴川駅 バス7分 平和台幼稚園前 停歩5分',  --交通
    17,                                             --徒歩
    ST_SetSRID(ST_MakePoint(139.48712427976392, 35.59106718850745), 4326), -- Single Point: [lng, lat]
    '中古マンション',                              --物件種別
    '1993年11月築',                                  --築年月
    3.6,                                        --バルコニー
    19,                                         --総戸数
    11574,                                       --修繕積立金
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
    '2025-07-20',                                --情報公開日
    '2025-08-03',                                --次回更新予定日
    NULL,   --備考
    NULL,                                        --evaluationCertificate
    '空き無',    --駐車場
    NULL,                                       --キッチン
    NULL,                                        --バス・トイレ
    NULL,                                        --設備・サービス
    '専用使用料 1,992円 / 月',                                        --その他
    ARRAY['/images/id128-1.jpg', '/images/id128-2.jpg', '/images/id128-3.jpg', '/images/id128-4.jpg', '/images/id128-5.jpg'],
    -- New area hierarchy and zipcode data
    '215-0023',     -- Harumi area zipcode
    '首都圏',       --area_level_1
    '神奈川',       --area_level_2
    '川崎市',         --area_level_3
    '麻生区',       --area_level_4
    'for sale',     --status
    -- NEW FIELD VALUES (NULL for 中古マンション):
    '西', -- direction
    NULL, -- urbanPlanning
    '（株式会社青山メインランド (新築分譲時における売主)', -- condominiumSalesCompany
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
    'ミッドオアシスタワーズ レジデンス棟',       -- title
    54800000,                                   -- 価格
    NULL,                                        --平米単価
    '神奈川県相模原市緑区大山町',             --所在地
    '3LDK',                                       --間取り
    90.48,                                       --専有面積
    '1階 / 地上23階 地下1階建',                           --階数 / 階建
    '鉄筋コンクリート造',                                         --建物構造
    19060,                                        --管理費
    '準工業地域',                                  --用途地域
    '横浜線 橋本駅 徒歩11分,相模線 橋本駅 徒歩11分,京王電鉄相模原線 橋本駅 徒歩11分',  --交通
    17,                                             --徒歩
    ST_SetSRID(ST_MakePoint(139.35209490674538, 35.58914906016479), 4326), -- Single Point: [lng, lat]
    '中古マンション',                              --物件種別
    '2010年07月築',                                  --築年月
    27.65,                                        --バルコニー
    368,                                         --総戸数
    18490,                                       --修繕積立金
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
    '2025-07-18',                                --情報公開日
    '2025-08-01',                                --次回更新予定日
    NULL,   --備考
    NULL,                                        --evaluationCertificate
    '敷地内有 (賃貸) 空き：20台有り, 月額 2,500円〜11,500円 (確認日：西暦2025年07月11日現在)',    --駐車場
    NULL,                                       --キッチン
    NULL,                                        --バス・トイレ
    NULL,                                        --設備・サービス
    'インターネット利用料 1,265円 / 月、情報端末利用料 330円 / 月',                                        --その他
    ARRAY['/images/id129-1.jpg', '/images/id129-2.jpg', '/images/id129-3.jpg', '/images/id129-4.jpg', '/images/id129-5.jpg'],
    -- New area hierarchy and zipcode data
    '252-0146',     -- Harumi area zipcode
    '首都圏',       --area_level_1
    '神奈川',       --area_level_2
    '相模原市',         --area_level_3
    '緑区',       --area_level_4
    'for sale',     --status
    -- NEW FIELD VALUES (NULL for 中古マンション):
    '南西', -- direction
    NULL, -- urbanPlanning
    '三菱地所（株）、藤和不動産（株） (新築分譲時における売主)', -- condominiumSalesCompany
    '熊谷組', -- constructionCompany
    '（株）三菱地所設計', -- designCompany
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
    'モア・ステージ相模原・富士見',       -- title
    24800000,                                   -- 価格
    NULL,                                        --平米単価
    '神奈川県相模原市中央区富士見６丁目',             --所在地
    '3LDK',                                       --間取り
    64.77,                                       --専有面積
    '12階 / 地上14階 地下1階建',                           --階数 / 階建
    '鉄筋コンクリート造',                                         --建物構造
    12960,                                        --管理費
    '準工業地域',                                  --用途地域
    '横浜線 相模原駅 徒歩23分, 横浜線 相模原駅 バス10分 市民会館前 停歩3分, 横浜線 矢部駅 徒歩24分',  --交通
    17,                                             --徒歩
    ST_SetSRID(ST_MakePoint(139.37374890674533, 35.56898945854762), 4326), -- Single Point: [lng, lat]
    '中古マンション',                              --物件種別
    '1995年03月築',                                  --築年月
    23.82,                                        --バルコニー
    170,                                         --総戸数
    12310,                                       --修繕積立金
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
    '2025-07-26',                                --情報公開日
    '2025-08-09',                                --次回更新予定日
    NULL,   --備考
    NULL,                                        --evaluationCertificate
    '空き無',    --駐車場
    NULL,                                       --キッチン
    NULL,                                        --バス・トイレ
    NULL,                                        --設備・サービス
    NULL,                                        --その他
    ARRAY['/images/id130-1.jpg', '/images/id130-2.jpg', '/images/id130-3.jpg', '/images/id130-4.jpg', '/images/id130-5.jpg'],
    -- New area hierarchy and zipcode data
    '252-0236',     -- Harumi area zipcode
    '首都圏',       --area_level_1
    '神奈川',       --area_level_2
    '相模原市',         --area_level_3
    '中央区',       --area_level_4
    'for sale',     --status
    -- NEW FIELD VALUES (NULL for 中古マンション):
    '南東', -- direction
    NULL, -- urbanPlanning
    '（株）長谷工不動産、川崎製鉄（株） (新築分譲時における売主)', -- condominiumSalesCompany
    '長谷工コーポレーションエンジニアリング事業部', -- constructionCompany
    '（株）三菱地所設計', -- designCompany
    '株式会社長谷工コミュニティ', -- managementCompany
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