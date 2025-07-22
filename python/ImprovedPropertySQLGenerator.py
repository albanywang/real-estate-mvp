#!/usr/bin/env python3

"""
Improved Property Data SQL Insert Generator with better Japanese OCR
"""

import re
import argparse
import sys
from datetime import datetime
from typing import Dict, Any, Optional
from PIL import Image, ImageEnhance, ImageFilter
import pytesseract
import cv2
import numpy as np

class ImprovedPropertySQLGenerator:
    def __init__(self):
        self.property_data = {}
        # Ensure Japanese is available
        try:
            available_langs = pytesseract.get_languages()
            print(f"Available OCR languages: {available_langs}")
            if 'jpn' not in available_langs:
                print("WARNING: Japanese language pack not installed!")
        except:
            print("Could not check available languages")

    def preprocess_image(self, image_path: str) -> list:
        """
        Preprocess image with multiple techniques and return list of processed images
        """
        print("Preprocessing image for better OCR...")
        
        # Open image
        original = Image.open(image_path)
        
        # Convert to numpy array
        img_array = np.array(original)
        
        processed_versions = []
        
        # Version 1: Original
        processed_versions.append(("original", original))
        
        # Version 2: Convert to grayscale and enhance contrast
        if len(img_array.shape) == 3:
            gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        else:
            gray = img_array
            
        # Enhance contrast
        contrast_enhanced = cv2.convertScaleAbs(gray, alpha=2.0, beta=0)
        processed_versions.append(("contrast", Image.fromarray(contrast_enhanced)))
        
        # Version 3: Threshold
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        processed_versions.append(("threshold", Image.fromarray(thresh)))
        
        # Version 4: Denoise
        try:
            denoised = cv2.fastNlMeansDenoising(gray)
            processed_versions.append(("denoised", Image.fromarray(denoised)))
        except:
            pass
        
        # Version 5: Adaptive threshold
        adaptive_thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
        processed_versions.append(("adaptive", Image.fromarray(adaptive_thresh)))
        
        # Version 6: Morphological operations
        kernel = np.ones((1,1), np.uint8)
        morph = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
        processed_versions.append(("morphological", Image.fromarray(morph)))
        
        return processed_versions

    def extract_text_from_image(self, image_path: str) -> str:
        """
        Extract text using multiple preprocessing methods and OCR configurations
        """
        print(f"Processing image: {image_path}")
        
        # Get preprocessed versions
        processed_images = self.preprocess_image(image_path)
        
        # OCR configurations to try
        ocr_configs = [
            # Japanese configurations
            {'lang': 'jpn', 'config': '--oem 3 --psm 6'},
            {'lang': 'jpn', 'config': '--oem 3 --psm 3'},
            {'lang': 'jpn', 'config': '--oem 3 --psm 4'},
            {'lang': 'jpn', 'config': '--oem 3 --psm 8'},
            {'lang': 'jpn', 'config': '--oem 3 --psm 11'},
            {'lang': 'jpn', 'config': '--oem 3 --psm 12'},
            {'lang': 'jpn', 'config': '--oem 3 --psm 13'},
            # Japanese vertical text
            {'lang': 'jpn_vert', 'config': '--oem 3 --psm 6'},
            {'lang': 'jpn_vert', 'config': '--oem 3 --psm 5'},
            # Combined
            {'lang': 'jpn+jpn_vert', 'config': '--oem 3 --psm 6'},
            # English as fallback
            {'lang': 'eng', 'config': '--oem 3 --psm 6'},
        ]
        
        best_text = ""
        best_score = 0
        results = []
        
        for img_name, img in processed_images:
            print(f"\nTrying preprocessing: {img_name}")
            
            for config in ocr_configs:
                try:
                    text = pytesseract.image_to_string(
                        img, 
                        lang=config['lang'], 
                        config=config['config']
                    )
                    
                    # Score the result
                    score = self.score_ocr_result(text)
                    
                    print(f"  {config['lang']} (PSM {config['config'].split('--psm ')[-1].split()[0]}): "
                          f"Score {score}, Length {len(text.strip())}")
                    
                    if score > best_score:
                        best_score = score
                        best_text = text
                        print(f"    ★ New best result!")
                    
                    results.append({
                        'preprocessing': img_name,
                        'config': config,
                        'text': text,
                        'score': score
                    })
                    
                except Exception as e:
                    print(f"  {config['lang']}: Failed - {e}")
                    continue
        
        print(f"\nBest OCR result (score: {best_score}):")
        print("=" * 50)
        print(repr(best_text))
        print("=" * 50)
        
        return best_text

    def score_ocr_result(self, text: str) -> int:
        """
        Score OCR result quality
        """
        if not text or not text.strip():
            return 0
        
        score = 0
        
        # Basic length score
        score += len(text.strip())
        
        # Japanese character bonus
        japanese_chars = 0
        for char in text:
            if ('\u3040' <= char <= '\u309F' or  # Hiragana
                '\u30A0' <= char <= '\u30FF' or  # Katakana
                '\u4E00' <= char <= '\u9FAF'):   # Kanji
                japanese_chars += 1
        
        score += japanese_chars * 3  # Bonus for Japanese characters
        
        # Penalty for too many garbage characters
        garbage_chars = len([c for c in text if c in 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' and 
                           not any('\u3040' <= neighbor <= '\u309F' or 
                                 '\u30A0' <= neighbor <= '\u30FF' or 
                                 '\u4E00' <= neighbor <= '\u9FAF' 
                                 for neighbor in text[max(0, text.index(c)-2):text.index(c)+3])])
        
        score -= garbage_chars * 2
        
        # Bonus for property-related keywords
        property_keywords = ['価格', '万円', '㎡', '階', '築', '駅', '分', '所在地', '間取り', 'LDK']
        for keyword in property_keywords:
            if keyword in text:
                score += 10
        
        return max(0, score)

    def parse_ocr_text_to_dict(self, ocr_text: str) -> Dict[str, str]:
        """
        Parse OCR text with improved Japanese text handling
        """
        data = {}
        lines = [line.strip() for line in ocr_text.split('\n') if line.strip()]
        
        print("\n=== Parsing OCR Text ===")
        for i, line in enumerate(lines):
            print(f"{i:2d}: {line}")
        
        # Enhanced field patterns for Japanese property listings
        field_patterns = {
            '価格': [
                r'価格[：:\s]*([0-9,，]+)万円',
                r'([0-9,，]+)万円',
                r'価格[：:\s]*(.+?)(?=万円)',
            ],
            '所在地': [
                r'所在地[：:\s]*(.+?)(?=\n|$)',
                r'住所[：:\s]*(.+?)(?=\n|$)',
                r'(東京都|神奈川県|埼玉県|千葉県|大阪府|京都府|兵庫県|愛知県|福岡県|北海道).*?[市区町村].*?[0-9０-９]+.*?[0-9０-９]+.*?[0-9０-９]+',
            ],
            '間取り': [
                r'間取り[：:\s]*([0-9０-９]+[SLDK]+)',
                r'([0-9０-９]+[SLDK]+)',
                r'間取り[：:\s]*(.+?)(?=\n|専有)',
            ],
            '専有面積': [
                r'専有面積[：:\s]*([0-9０-９.,，]+)㎡',
                r'([0-9０-９.,，]+)㎡',
                r'面積[：:\s]*([0-9０-９.,，]+)',
            ],
            '築年月': [
                r'築年月[：:\s]*([0-9０-９]{4})年([0-9０-９]{1,2})月',
                r'([0-9０-９]{4})年([0-9０-９]{1,2})月築',
                r'築[：:\s]*([0-9０-９]{4})年',
            ],
            '階数': [
                r'([0-9０-９]+)階',
                r'階数[：:\s]*([0-9０-９]+)',
            ],
            '交通': [
                r'交通[：:\s]*(.+?)(?=\n|専有|間取り)',
                r'(.*?駅.*?徒歩.*?分)',
                r'最寄[りり]?駅[：:\s]*(.+?)(?=\n|$)',
            ],
            '管理費': [
                r'管理費[：:\s]*([0-9,，]+)円',
                r'([0-9,，]+)円/月',
            ],
            '修繕積立金': [
                r'修繕積立金[：:\s]*([0-9,，]+)円',
                r'修繕費[：:\s]*([0-9,，]+)',
            ]
        }
        
        # Apply patterns
        full_text = ' '.join(lines)
        
        for field_name, patterns in field_patterns.items():
            for pattern in patterns:
                matches = re.finditer(pattern, full_text, re.IGNORECASE)
                for match in matches:
                    if match.groups():
                        # Join all groups or take the first meaningful one
                        if len(match.groups()) > 1:
                            value = ''.join(match.groups())
                        else:
                            value = match.group(1)
                        
                        if value and value.strip():
                            data[field_name] = value.strip()
                            print(f"✓ Found {field_name}: {value.strip()}")
                            break
                if field_name in data:
                    break
        
        # Try line-by-line parsing for missed fields
        for line in lines:
            # Look for colon-separated key-value pairs
            if '：' in line:
                parts = line.split('：', 1)
                if len(parts) == 2:
                    key = parts[0].strip()
                    value = parts[1].strip()
                    
                    # Map common variations
                    key_mapping = {
                        '価格': '価格',
                        'かかく': '価格',
                        '所在地': '所在地',
                        'しょざいち': '所在地',
                        '住所': '所在地',
                        '間取り': '間取り',
                        'まどり': '間取り',
                        '面積': '専有面積',
                        '専有面積': '専有面積',
                        '築年': '築年月',
                        '築年月': '築年月',
                    }
                    
                    mapped_key = key_mapping.get(key, key)
                    if value and mapped_key not in data:
                        data[mapped_key] = value
                        print(f"✓ Line parsing found {mapped_key}: {value}")
        
        print(f"\nExtracted {len(data)} fields:")
        for key, value in data.items():
            print(f"  {key}: {value}")
        
        return data

    # Keep the rest of your original parsing methods...
    def parse_property_data(self, data: Dict[str, str]) -> Dict[str, Any]:
        """Parse property data from the OCR results into structured format"""
        parsed = {}
        
        # Basic property information
        parsed['address'] = data.get('所在地', '').strip()
        parsed['price'] = self.parse_price(data.get('価格', ''))
        parsed['layout'] = data.get('間取り', '').strip()
        parsed['area'] = self.parse_area(data.get('専有面積', ''))
        parsed['year_built'] = self.parse_year(data.get('築年月', ''))
        parsed['floor_info'] = data.get('階数', '').strip()
        parsed['transportation'] = data.get('交通', '').strip()
        parsed['management_fee'] = self.parse_price(data.get('管理費', ''))
        parsed['repair_reserve_fund'] = self.parse_price(data.get('修繕積立金', ''))
        
        return parsed

    def parse_price(self, price_str: str) -> Optional[int]:
        """Parse price string to integer"""
        if not price_str or price_str == '-':
            return None
        
        # Clean the string
        price_str = re.sub(r'[,，\s]', '', price_str)
        match = re.search(r'([0-9０-９]+)', price_str)
        if match:
            # Convert full-width numbers to half-width
            number_str = match.group(1)
            number_str = number_str.translate(str.maketrans('０１２３４５６７８９', '0123456789'))
            price = int(number_str)
            if '万円' in price_str or '万' in price_str:
                return price * 10000
            return price
        return None

    def parse_area(self, area_str: str) -> Optional[float]:
        """Parse area string to float"""
        if not area_str or area_str == '-':
            return None
        
        # Clean and extract number
        area_str = re.sub(r'[,，\s]', '', area_str)
        match = re.search(r'([0-9０-９.．]+)', area_str)
        if match:
            number_str = match.group(1)
            number_str = number_str.translate(str.maketrans('０１２３４５６７８９．', '0123456789.'))
            return float(number_str)
        return None

    def parse_year(self, year_str: str) -> Optional[str]:
        """Parse year built string"""
        if not year_str or year_str == '-':
            return None
        
        # Convert full-width numbers
        year_str = year_str.translate(str.maketrans('０１２３４５６７８９', '0123456789'))
        match = re.search(r'(\d{4})年(\d{1,2})月', year_str)
        if match:
            year = match.group(1)
            month = match.group(2).zfill(2)
            return f"{year}-{month}-01"
        return None

    def generate_sql_insert(self, property_data: Dict[str, Any]) -> str:
        """Generate SQL INSERT statement"""
        # Use your existing SQL generation logic here
        # ... (keep your original method)
        
        def format_value(value):
            if value is None:
                return 'NULL'
            elif isinstance(value, str):
                escaped = value.replace("'", "''")
                return f"'{escaped}'"
            elif isinstance(value, (int, float)):
                return str(value)
            else:
                return f"'{str(value)}'"
        
        # Simple example - expand with your full SQL template
        return f"""
INSERT INTO properties (address, price, layout, area, year_built, transportation)
VALUES (
    {format_value(property_data.get('address'))},
    {format_value(property_data.get('price'))},
    {format_value(property_data.get('layout'))},
    {format_value(property_data.get('area'))},
    {format_value(property_data.get('year_built'))},
    {format_value(property_data.get('transportation'))}
);"""

    def process_screenshot(self, image_path: str, verbose: bool = False) -> str:
        """Main processing method"""
        print(f"Processing screenshot: {image_path}")
        
        # Extract text using improved OCR
        ocr_text = self.extract_text_from_image(image_path)
        
        if not ocr_text.strip():
            print("ERROR: No text could be extracted from the image!")
            return "-- No text extracted from image"
        
        # Parse structured data
        structured_data = self.parse_ocr_text_to_dict(ocr_text)
        
        if not structured_data:
            print("WARNING: No structured data could be parsed!")
            return "-- No structured data parsed"
        
        # Parse into final format
        parsed_data = self.parse_property_data(structured_data)
        
        # Generate SQL
        sql_insert = self.generate_sql_insert(parsed_data)
        
        return sql_insert

def main():
    parser = argparse.ArgumentParser(description='Generate SQL from Japanese property screenshots')
    parser.add_argument('screenshot', help='Path to screenshot image')
    parser.add_argument('-v', '--verbose', action='store_true', help='Verbose output')
    parser.add_argument('-o', '--output', help='Output file')
    
    args = parser.parse_args()
    
    try:
        generator = ImprovedPropertySQLGenerator()
        sql_result = generator.process_screenshot(args.screenshot, args.verbose)
        
        if args.output:
            with open(args.output, 'w', encoding='utf-8') as f:
                f.write(sql_result)
            print(f"SQL written to: {args.output}")
        else:
            print("\nGenerated SQL:")
            print("=" * 50)
            print(sql_result)
            
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()