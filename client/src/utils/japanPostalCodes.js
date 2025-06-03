// src/utils/japanPostalCodes.js

// Japan Postal Code Ranges by Prefecture
export const PostalCodeRanges = {
  // 北海道地方
  HOKKAIDO: {
    prefecture: '北海道',
    range: '010-0000 ~ 099-9999',
    prefectureCode: '01'
  },
  
  // 東北地方
  AOMORI: {
    prefecture: '青森県',
    range: '030-0000 ~ 039-9999',
    prefectureCode: '02'
  },
  IWATE: {
    prefecture: '岩手県',
    range: '020-0000 ~ 029-9999',
    prefectureCode: '03'
  },
  MIYAGI: {
    prefecture: '宮城県',
    range: '980-0000 ~ 989-9999',
    prefectureCode: '04'
  },
  AKITA: {
    prefecture: '秋田県',
    range: '010-0000 ~ 019-9999',
    prefectureCode: '05'
  },
  YAMAGATA: {
    prefecture: '山形県',
    range: '990-0000 ~ 999-9999',
    prefectureCode: '06'
  },
  FUKUSHIMA: {
    prefecture: '福島県',
    range: '960-0000 ~ 979-9999',
    prefectureCode: '07'
  },
  
  // 関東地方
  IBARAKI: {
    prefecture: '茨城県',
    range: '300-0000 ~ 319-9999',
    prefectureCode: '08'
  },
  TOCHIGI: {
    prefecture: '栃木県',
    range: '320-0000 ~ 329-9999',
    prefectureCode: '09'
  },
  GUNMA: {
    prefecture: '群馬県',
    range: '370-0000 ~ 379-9999',
    prefectureCode: '10'
  },
  SAITAMA: {
    prefecture: '埼玉県',
    range: '330-0000 ~ 369-9999',
    prefectureCode: '11'
  },
  CHIBA: {
    prefecture: '千葉県',
    range: '260-0000 ~ 299-9999',
    prefectureCode: '12'
  },
  TOKYO: {
    prefecture: '東京都',
    range: '100-0000 ~ 199-9999',
    prefectureCode: '13'
  },
  KANAGAWA: {
    prefecture: '神奈川県',
    range: '210-0000 ~ 259-9999',
    prefectureCode: '14'
  },
  
  // 中部地方
  NIIGATA: {
    prefecture: '新潟県',
    range: '940-0000 ~ 959-9999',
    prefectureCode: '15'
  },
  TOYAMA: {
    prefecture: '富山県',
    range: '930-0000 ~ 939-9999',
    prefectureCode: '16'
  },
  ISHIKAWA: {
    prefecture: '石川県',
    range: '920-0000 ~ 929-9999',
    prefectureCode: '17'
  },
  FUKUI: {
    prefecture: '福井県',
    range: '910-0000 ~ 919-9999',
    prefectureCode: '18'
  },
  YAMANASHI: {
    prefecture: '山梨県',
    range: '400-0000 ~ 409-9999',
    prefectureCode: '19'
  },
  NAGANO: {
    prefecture: '長野県',
    range: '380-0000 ~ 399-9999',
    prefectureCode: '20'
  },
  GIFU: {
    prefecture: '岐阜県',
    range: '500-0000 ~ 509-9999',
    prefectureCode: '21'
  },
  SHIZUOKA: {
    prefecture: '静岡県',
    range: '410-0000 ~ 439-9999',
    prefectureCode: '22'
  },
  AICHI: {
    prefecture: '愛知県',
    range: '440-0000 ~ 499-9999',
    prefectureCode: '23'
  },
  
  // 関西地方
  MIE: {
    prefecture: '三重県',
    range: '510-0000 ~ 519-9999',
    prefectureCode: '24'
  },
  SHIGA: {
    prefecture: '滋賀県',
    range: '520-0000 ~ 529-9999',
    prefectureCode: '25'
  },
  KYOTO: {
    prefecture: '京都府',
    range: '600-0000 ~ 629-9999',
    prefectureCode: '26'
  },
  OSAKA: {
    prefecture: '大阪府',
    range: '530-0000 ~ 599-9999',
    prefectureCode: '27'
  },
  HYOGO: {
    prefecture: '兵庫県',
    range: '650-0000 ~ 679-9999',
    prefectureCode: '28'
  },
  NARA: {
    prefecture: '奈良県',
    range: '630-0000 ~ 639-9999',
    prefectureCode: '29'
  },
  WAKAYAMA: {
    prefecture: '和歌山県',
    range: '640-0000 ~ 649-9999',
    prefectureCode: '30'
  },
  
  // 中国地方
  TOTTORI: {
    prefecture: '鳥取県',
    range: '680-0000 ~ 689-9999',
    prefectureCode: '31'
  },
  SHIMANE: {
    prefecture: '島根県',
    range: '690-0000 ~ 699-9999',
    prefectureCode: '32'
  },
  OKAYAMA: {
    prefecture: '岡山県',
    range: '700-0000 ~ 719-9999',
    prefectureCode: '33'
  },
  HIROSHIMA: {
    prefecture: '広島県',
    range: '720-0000 ~ 739-9999',
    prefectureCode: '34'
  },
  YAMAGUCHI: {
    prefecture: '山口県',
    range: '740-0000 ~ 759-9999',
    prefectureCode: '35'
  },
  
  // 四国地方
  TOKUSHIMA: {
    prefecture: '徳島県',
    range: '770-0000 ~ 779-9999',
    prefectureCode: '36'
  },
  KAGAWA: {
    prefecture: '香川県',
    range: '760-0000 ~ 769-9999',
    prefectureCode: '37'
  },
  EHIME: {
    prefecture: '愛媛県',
    range: '790-0000 ~ 799-9999',
    prefectureCode: '38'
  },
  KOCHI: {
    prefecture: '高知県',
    range: '780-0000 ~ 789-9999',
    prefectureCode: '39'
  },
  
  // 九州地方
  FUKUOKA: {
    prefecture: '福岡県',
    range: '800-0000 ~ 839-9999',
    prefectureCode: '40'
  },
  SAGA: {
    prefecture: '佐賀県',
    range: '840-0000 ~ 849-9999',
    prefectureCode: '41'
  },
  NAGASAKI: {
    prefecture: '長崎県',
    range: '850-0000 ~ 859-9999',
    prefectureCode: '42'
  },
  KUMAMOTO: {
    prefecture: '熊本県',
    range: '860-0000 ~ 869-9999',
    prefectureCode: '43'
  },
  OITA: {
    prefecture: '大分県',
    range: '870-0000 ~ 879-9999',
    prefectureCode: '44'
  },
  MIYAZAKI: {
    prefecture: '宮崎県',
    range: '880-0000 ~ 889-9999',
    prefectureCode: '45'
  },
  KAGOSHIMA: {
    prefecture: '鹿児島県',
    range: '890-0000 ~ 899-9999',
    prefectureCode: '46'
  },
  OKINAWA: {
    prefecture: '沖縄県',
    range: '900-0000 ~ 909-9999',
    prefectureCode: '47'
  }
};

// Major Cities Postal Codes
export const MajorCityPostalCodes = {
  // Tokyo 23 Wards
  TOKYO_WARDS: {
    '千代田区': ['100-0000', '102-0000'],
    '中央区': ['103-0000', '104-0000'],
    '港区': ['105-0000', '108-0000'],
    '新宿区': ['160-0000', '169-0000'],
    '文京区': ['112-0000', '113-0000'],
    '台東区': ['110-0000', '111-0000'],
    '墨田区': ['130-0000', '131-0000'],
    '江東区': ['135-0000', '136-0000'],
    '品川区': ['140-0000', '142-0000'],
    '目黒区': ['152-0000', '153-0000'],
    '大田区': ['143-0000', '146-0000'],
    '世田谷区': ['154-0000', '158-0000'],
    '渋谷区': ['150-0000', '151-0000'],
    '中野区': ['164-0000', '165-0000'],
    '杉並区': ['166-0000', '168-0000'],
    '豊島区': ['170-0000', '171-0000'],
    '北区': ['114-0000', '115-0000'],
    '荒川区': ['116-0000', '116-0000'],
    '板橋区': ['173-0000', '175-0000'],
    '練馬区': ['176-0000', '179-0000'],
    '足立区': ['120-0000', '123-0000'],
    '葛飾区': ['124-0000', '125-0000'],
    '江戸川区': ['132-0000', '134-0000']
  },
  
  // Major Cities
  MAJOR_CITIES: {
    '札幌市': ['060-0000', '007-0000'],
    '仙台市': ['980-0000', '982-0000'],
    '横浜市': ['220-0000', '247-0000'],
    '川崎市': ['210-0000', '215-0000'],
    '名古屋市': ['460-0000', '468-0000'],
    '京都市': ['600-0000', '612-0000'],
    '大阪市': ['530-0000', '559-0000'],
    '神戸市': ['650-0000', '658-0000'],
    '広島市': ['730-0000', '739-0000'],
    '福岡市': ['810-0000', '819-0000'],
    '北九州市': ['800-0000', '808-0000']
  }
};

// Postal Code Helper Functions
export const PostalCodeHelper = {
  // Get postal code range by prefecture name
  getPostalCodeByPrefecture(prefectureName) {
    const entry = Object.values(PostalCodeRanges).find(
      item => item.prefecture === prefectureName
    );
    return entry ? entry.range : null;
  },
  
  // Get prefecture by postal code
  getPrefectureByPostalCode(postalCode) {
    const code = postalCode.replace('-', '').substring(0, 3);
    const codeNum = parseInt(code);
    
    for (const [key, value] of Object.entries(PostalCodeRanges)) {
      const [start, end] = value.range.split(' ~ ');
      const startNum = parseInt(start.replace('-', '').substring(0, 3));
      const endNum = parseInt(end.replace('-', '').substring(0, 3));
      
      if (codeNum >= startNum && codeNum <= endNum) {
        return value.prefecture;
      }
    }
    return null;
  },
  
  // Validate postal code format
  isValidPostalCode(postalCode) {
    const regex = /^\d{3}-\d{4}$/;
    return regex.test(postalCode);
  },
  
  // Format postal code
  formatPostalCode(postalCode) {
    const cleaned = postalCode.replace(/\D/g, '');
    if (cleaned.length === 7) {
      return `${cleaned.substring(0, 3)}-${cleaned.substring(3)}`;
    }
    return postalCode;
  },
  
  // Get all postal codes for dropdown
  getAllPostalCodeRanges() {
    return Object.entries(PostalCodeRanges).map(([key, value]) => ({
      prefecture: value.prefecture,
      range: value.range,
      code: key
    }));
  },
  
  // Get Tokyo ward postal codes
  getTokyoWardPostalCodes() {
    return MajorCityPostalCodes.TOKYO_WARDS;
  },
  
  // Get major city postal codes
  getMajorCityPostalCodes() {
    return MajorCityPostalCodes.MAJOR_CITIES;
  },
  
  // Search postal code by city name
  searchPostalCodeByCity(cityName) {
    const tokyoWards = MajorCityPostalCodes.TOKYO_WARDS[cityName];
    if (tokyoWards) return tokyoWards;
    
    const majorCity = MajorCityPostalCodes.MAJOR_CITIES[cityName];
    if (majorCity) return majorCity;
    
    return null;
  }
};

// Dropdown helper for postal codes
export const PostalCodeDropdownHelper = {
  // Get prefecture options with postal codes
  getPrefecturePostalOptions() {
    return Object.entries(PostalCodeRanges).map(([key, value]) => ({
      value: key,
      label: `${value.prefecture} (${value.range})`,
      prefecture: value.prefecture,
      range: value.range,
      code: value.prefectureCode
    }));
  },
  
  // Get Tokyo ward options with postal codes
  getTokyoWardPostalOptions() {
    return Object.entries(MajorCityPostalCodes.TOKYO_WARDS).map(([ward, codes]) => ({
      value: ward,
      label: `${ward} (${codes[0]} ~ ${codes[1] || codes[0]})`,
      postalCodes: codes
    }));
  },
  
  // Get major city options with postal codes
  getMajorCityPostalOptions() {
    return Object.entries(MajorCityPostalCodes.MAJOR_CITIES).map(([city, codes]) => ({
      value: city,
      label: `${city} (${codes[0]} ~ ${codes[1] || codes[0]})`,
      postalCodes: codes
    }));
  }
};


// Usage Examples:

//import { 
//  PostalCodeHelper, 
//  PostalCodeDropdownHelper,
//  PostalCodeRanges 
//} from '../utils/japanPostalCodes';

// Get postal code range for Tokyo
//const tokyoRange = PostalCodeHelper.getPostalCodeByPrefecture('東京都');
// Returns: "100-0000 ~ 199-9999"

// Find prefecture by postal code
//const prefecture = PostalCodeHelper.getPrefectureByPostalCode('130-0001');
// Returns: "東京都" (because 130-0001 is in Sumida-ku)

// Validate postal code
//const isValid = PostalCodeHelper.isValidPostalCode('130-0001'); // true

// Get dropdown options
//const prefectures = PostalCodeDropdownHelper.getPrefecturePostalOptions();
//const tokyoWards = PostalCodeDropdownHelper.getTokyoWardPostalOptions();