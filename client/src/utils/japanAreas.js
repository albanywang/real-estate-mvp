// src/utils/japanAreas.js

// Japan Administrative Areas
export const JapanRegion = {
  HOKKAIDO: '北海道地方',
  TOHOKU: '東北地方',
  KANTO: '関東地方',
  CHUBU: '中部地方',
  KANSAI: '関西地方',
  CHUGOKU: '中国地方',
  SHIKOKU: '四国地方',
  KYUSHU: '九州地方'
};

export const Prefecture = {
  // 北海道地方
  HOKKAIDO: '北海道',
  
  // 東北地方
  AOMORI: '青森県',
  IWATE: '岩手県',
  MIYAGI: '宮城県',
  AKITA: '秋田県',
  YAMAGATA: '山形県',
  FUKUSHIMA: '福島県',
  
  // 関東地方
  TOKYO: '東京都',
  KANAGAWA: '神奈川県',
  SAITAMA: '埼玉県',
  CHIBA: '千葉県',
  IBARAKI: '茨城県',
  TOCHIGI: '栃木県',
  GUNMA: '群馬県',
  
  // 中部地方
  NIIGATA: '新潟県',
  TOYAMA: '富山県',
  ISHIKAWA: '石川県',
  FUKUI: '福井県',
  YAMANASHI: '山梨県',
  NAGANO: '長野県',
  GIFU: '岐阜県',
  SHIZUOKA: '静岡県',
  AICHI: '愛知県',
  
  // 関西地方
  OSAKA: '大阪府',
  KYOTO: '京都府',
  HYOGO: '兵庫県',
  NARA: '奈良県',
  WAKAYAMA: '和歌山県',
  SHIGA: '滋賀県',
  MIE: '三重県',
  
  // 中国地方
  HIROSHIMA: '広島県',
  OKAYAMA: '岡山県',
  YAMAGUCHI: '山口県',
  TOTTORI: '鳥取県',
  SHIMANE: '島根県',
  
  // 四国地方
  TOKUSHIMA: '徳島県',
  KAGAWA: '香川県',
  EHIME: '愛媛県',
  KOCHI: '高知県',
  
  // 九州地方
  FUKUOKA: '福岡県',
  SAGA: '佐賀県',
  NAGASAKI: '長崎県',
  KUMAMOTO: '熊本県',
  OITA: '大分県',
  MIYAZAKI: '宮崎県',
  KAGOSHIMA: '鹿児島県',
  OKINAWA: '沖縄県'
};

// Tokyo Special Wards (23区)
export const TokyoWard = {
  CHIYODA: '千代田区',
  CHUO: '中央区',
  MINATO: '港区',
  SHINJUKU: '新宿区',
  BUNKYO: '文京区',
  TAITO: '台東区',
  SUMIDA: '墨田区',
  KOTO: '江東区',
  SHINAGAWA: '品川区',
  MEGURO: '目黒区',
  OTA: '大田区',
  SETAGAYA: '世田谷区',
  SHIBUYA: '渋谷区',
  NAKANO: '中野区',
  SUGINAMI: '杉並区',
  TOSHIMA: '豊島区',
  KITA: '北区',
  ARAKAWA: '荒川区',
  ITABASHI: '板橋区',
  NERIMA: '練馬区',
  ADACHI: '足立区',
  KATSUSHIKA: '葛飾区',
  EDOGAWA: '江戸川区'
};

// Major Cities for other prefectures
export const OsakaCity = {
  OSAKA_CITY: '大阪市',
  SAKAI: '堺市',
  HIGASHIOSAKA: '東大阪市',
  HIRAKATA: '枚方市',
  TOYONAKA: '豊中市',
  SUITA: '吹田市',
  TAKATSUKI: '高槻市',
  IBARAKI: '茨木市',
  YAO: '八尾市',
  NEYAGAWA: '寝屋川市'
};

// Hierarchical mapping structure
export const JapanAreaHierarchy = {
  [JapanRegion.KANTO]: {
    [Prefecture.TOKYO]: {
      '23区': Object.values(TokyoWard),
      '市部': ['八王子市', '立川市', '武蔵野市', '三鷹市', '青梅市', '府中市', '昭島市', '調布市', '町田市', '小金井市'],
      '郡部': ['西多摩郡', '大島町', '利島村', '新島村', '神津島村']
    },
    [Prefecture.KANAGAWA]: {
      '市': ['横浜市', '川崎市', '相模原市', '横須賀市', '平塚市', '鎌倉市', '藤沢市', '小田原市', '茅ヶ崎市', '逗子市'],
      '郡': ['三浦郡', '高座郡', '中郡', '足柄上郡', '足柄下郡', '愛甲郡']
    },
    [Prefecture.SAITAMA]: {
      '市': ['さいたま市', '川越市', '熊谷市', '川口市', '行田市', '秩父市', '所沢市', '飯能市', '加須市', '本庄市'],
      '郡': ['北足立郡', '入間郡', '比企郡', '秩父郡', '児玉郡', '大里郡', '南埼玉郡', '北葛飾郡']
    },
    [Prefecture.CHIBA]: {
      '市': ['千葉市', '銚子市', '市川市', '船橋市', '館山市', '木更津市', '松戸市', '野田市', '茂原市', '成田市'],
      '郡': ['印旛郡', '香取郡', '山武郡', '長生郡', '夷隅郡', '安房郡']
    }
  },
  [JapanRegion.KANSAI]: {
    [Prefecture.OSAKA]: {
      '市': Object.values(OsakaCity),
      '郡': ['三島郡', '豊能郡', '泉北郡', '泉南郡', '南河内郡']
    },
    [Prefecture.KYOTO]: {
      '市': ['京都市', '福知山市', '舞鶴市', '綾部市', '宇治市', '宮津市', '亀岡市', '城陽市', '向日市', '長岡京市'],
      '郡': ['乙訓郡', '久世郡', '綴喜郡', '相楽郡', '船井郡', '与謝郡']
    }
  }
  // Add more regions as needed
};

// Helper functions for dropdown usage
export const JapanAreaHelper = {
  getRegions() {
    return Object.values(JapanRegion);
  },
  
  getPrefecturesByRegion(region) {
    const regionMap = {
      [JapanRegion.HOKKAIDO]: [Prefecture.HOKKAIDO],
      [JapanRegion.TOHOKU]: [
        Prefecture.AOMORI, Prefecture.IWATE, Prefecture.MIYAGI, 
        Prefecture.AKITA, Prefecture.YAMAGATA, Prefecture.FUKUSHIMA
      ],
      [JapanRegion.KANTO]: [
        Prefecture.TOKYO, Prefecture.KANAGAWA, Prefecture.SAITAMA,
        Prefecture.CHIBA, Prefecture.IBARAKI, Prefecture.TOCHIGI, Prefecture.GUNMA
      ],
      [JapanRegion.CHUBU]: [
        Prefecture.NIIGATA, Prefecture.TOYAMA, Prefecture.ISHIKAWA, Prefecture.FUKUI,
        Prefecture.YAMANASHI, Prefecture.NAGANO, Prefecture.GIFU, Prefecture.SHIZUOKA, Prefecture.AICHI
      ],
      [JapanRegion.KANSAI]: [
        Prefecture.OSAKA, Prefecture.KYOTO, Prefecture.HYOGO,
        Prefecture.NARA, Prefecture.WAKAYAMA, Prefecture.SHIGA, Prefecture.MIE
      ],
      [JapanRegion.CHUGOKU]: [
        Prefecture.HIROSHIMA, Prefecture.OKAYAMA, Prefecture.YAMAGUCHI,
        Prefecture.TOTTORI, Prefecture.SHIMANE
      ],
      [JapanRegion.SHIKOKU]: [
        Prefecture.TOKUSHIMA, Prefecture.KAGAWA, Prefecture.EHIME, Prefecture.KOCHI
      ],
      [JapanRegion.KYUSHU]: [
        Prefecture.FUKUOKA, Prefecture.SAGA, Prefecture.NAGASAKI, Prefecture.KUMAMOTO,
        Prefecture.OITA, Prefecture.MIYAZAKI, Prefecture.KAGOSHIMA, Prefecture.OKINAWA
      ]
    };
    return regionMap[region] || [];
  },
  
  getSubdivisions(prefecture) {
    if (prefecture === Prefecture.TOKYO) {
      return ['23区', '市部', '郡部'];
    }
    return ['市', '郡'];
  },
  
  getTokyoWards() {
    return Object.values(TokyoWard);
  },
  
  getAreasByPrefectureAndType(prefecture, type) {
    const hierarchy = JapanAreaHierarchy;
    
    // Find the region containing this prefecture
    for (const region of Object.keys(hierarchy)) {
      if (hierarchy[region][prefecture]) {
        return hierarchy[region][prefecture][type] || [];
      }
    }
    return [];
  }
};

// Helper for dropdown components
export const JapanAreaDropdownHelper = {
  getRegionOptions() {
    return Object.entries(JapanRegion).map(([key, value]) => ({
      value: key,
      label: value
    }));
  },
  
  getPrefectureOptions(region) {
    if (!region) {
      return Object.entries(Prefecture).map(([key, value]) => ({
        value: key,
        label: value
      }));
    }
    
    return JapanAreaHelper.getPrefecturesByRegion(region).map(prefecture => ({
      value: prefecture,
      label: prefecture
    }));
  },
  
  getSubdivisionOptions(prefecture, subdivisionType) {
    const areas = JapanAreaHelper.getAreasByPrefectureAndType(prefecture, subdivisionType);
    return areas.map(area => ({
      value: area,
      label: area
    }));
  }
};

// Usage in Your Components

// In your React components
//import { 
//  JapanRegion, 
//  Prefecture, 
//  TokyoWard,
//  JapanAreaHelper,
//  JapanAreaDropdownHelper 
//} from '../utils/japanAreas';

// Example usage in a component
//const regions = JapanAreaDropdownHelper.getRegionOptions();
//const tokyoWards = JapanAreaHelper.getTokyoWards();