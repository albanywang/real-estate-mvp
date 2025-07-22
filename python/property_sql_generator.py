#!/usr/bin/env python3

"""

Property Data SQL Insert Generator

Parses Japanese real estate listing data from screenshot images and generates SQL INSERT statements

"""

 

import re

import argparse

import sys

from datetime import datetime

from typing import Dict, Any, Optional

from PIL import Image

import pytesseract

 

class PropertySQLGenerator:

    def __init__(self):

        self.property_data = {}

       

    def extract_text_from_image(self, image_path: str) -> str:

        """

        Extract text from image using OCR (Tesseract)

        """

        try:

            # Open the image

            image = Image.open(image_path)

           

            # Use Tesseract OCR with Japanese language support

            # You may need to install Japanese language data for tesseract

            custom_config = r'--oem 3 --psm 6'

           

            # Try Japanese first, then fallback to default

            try:

                text = pytesseract.image_to_string(image, lang='jpn', config=custom_config)

            except:

                print("Warning: Japanese OCR failed, trying default language...")

                text = pytesseract.image_to_string(image, config=custom_config)

           

            return text

           

        except FileNotFoundError:

            print(f"Error: Image file '{image_path}' not found.")

            sys.exit(1)

        except Exception as e:

            print(f"Error processing image: {str(e)}")

            sys.exit(1)

   

    def parse_ocr_text_to_dict(self, ocr_text: str) -> Dict[str, str]:

        """

        Parse OCR text into structured dictionary

        Looking for key-value pairs in the Japanese property listing format

        """

        data = {}

        lines = ocr_text.strip().split('\n')

       

        # Common Japanese property listing fields to look for

        field_patterns = {

            '所在地': r'所在地[：:\s]*(.+?)(?=\n|$)',

            '価格': r'価格[：:\s]*(.+?)(?=\n|万円)',

            '交通': r'交通[：:\s]*(.+?)(?=\n|駅)',

            '修繕積立金': r'修繕積立金[：:\s]*(.+?)(?=\n|円)',

            'その他費用': r'その他費用[：:\s]*(.+?)(?=\n|$)',

            '間取り': r'間取り[：:\s]*(.+?)(?=\n|$)',

            '専有面積': r'専有面積[：:\s]*(.+?)(?=\n|㎡|m)',

            '築年月': r'築年月[：:\s]*(.+?)(?=\n|築)',

            '階数': r'階数[／/]?構造[：:\s]*(.+?)(?=\n|階)',

            '向き': r'向き[：:\s]*(.+?)(?=\n|$)',

            'バルコニー': r'バルコニー[：:\s]*(.+?)(?=\n|㎡|m)',

            '現況': r'現況[：:\s]*(.+?)(?=\n|$)',

            '駐車場': r'駐車場[：:\s]*(.+?)(?=\n|$)',

            '建物構造': r'建物構造[：:\s]*(.+?)(?=\n|造)',

            '総戸数': r'総戸数[：:\s]*(.+?)(?=\n|戸)',

            '管理会社': r'管理会社[：:\s]*(.+?)(?=\n|$)',

            '管理形態': r'管理形態[：:\s]*(.+?)(?=\n|$)',

            '土地権利': r'土地権利[：:\s]*(.+?)(?=\n|$)',

            '取引態様': r'取引態様[：:\s]*(.+?)(?=\n|$)',

            '更新日': r'更新日[：:\s]*(.+?)(?=\n|日)',

            '次回更新予定': r'次回更新予定[：:\s]*(.+?)(?=\n|日)',

            '物件番号': r'物件番号[：:\s]*(.+?)(?=\n|$)'

        }

       

        # Try to extract each field using regex patterns

        full_text = ' '.join(lines)

       

        for field_name, pattern in field_patterns.items():

            match = re.search(pattern, full_text, re.IGNORECASE | re.MULTILINE)

            if match:

                data[field_name] = match.group(1).strip()

       

        # Additional parsing for fields that might be on multiple lines or have special formatting

        self._parse_complex_fields(lines, data)

       

        return data

   

    def _parse_complex_fields(self, lines: list, data: dict):

        """

        Parse complex fields that might span multiple lines or have special formatting

        """

        # Try to find price if not found by regex

        if '価格' not in data:

            for line in lines:

                if '万円' in line and any(char.isdigit() for char in line):

                    price_match = re.search(r'(\d+(?:,\d+)*(?:\.\d+)?)万円', line)

                    if price_match:

                        data['価格'] = price_match.group(1) + '万円'

                        break

       

        # Try to find area if not found by regex

        if '専有面積' not in data:

            for line in lines:

                if '㎡' in line or 'm²' in line:

                    area_match = re.search(r'(\d+(?:\.\d+)?)(?:㎡|m²)', line)

                    if area_match:

                        data['専有面積'] = area_match.group(1) + '㎡'

                        break

       

        # Try to find layout (間取り) - look for patterns like 3LDK, 2DK, etc.

        if '間取り' not in data:

            for line in lines:

                layout_match = re.search(r'(\d+(?:S?LDK|DK|K|R))', line)

                if layout_match:

                    data['間取り'] = layout_match.group(1)

                    break

   

    def parse_property_data(self, data: Dict[str, str]) -> Dict[str, Any]:

        """

        Parse property data from the OCR results into structured format

        """

        parsed = {}

       

        # Basic property information

        parsed['address'] = data.get('所在地', '').strip()

        parsed['price'] = self.parse_price(data.get('価格', ''))

        parsed['layout'] = data.get('間取り', '').strip()

        parsed['area'] = self.parse_area(data.get('専有面積', ''))

        parsed['year_built'] = self.parse_year(data.get('築年月', ''))

        parsed['floor_info'] = data.get('階数', '').strip()

        parsed['direction'] = data.get('向き', '').strip()

        parsed['balcony_area'] = self.parse_balcony_area(data.get('バルコニー', ''))

        parsed['current_situation'] = data.get('現況', '').strip()

        parsed['structure'] = data.get('建物構造', '').strip()

        parsed['total_units'] = self.parse_units(data.get('総戸数', ''))

        parsed['management_company'] = data.get('管理会社', '').strip()

        parsed['management_form'] = data.get('管理形態', '').strip()

        parsed['land_rights'] = data.get('土地権利', '').strip()

        parsed['transaction_mode'] = data.get('取引態様', '').strip()

        parsed['information_release_date'] = self.parse_date(data.get('更新日', ''))

        parsed['next_scheduled_update_date'] = self.parse_date(data.get('次回更新予定', ''))

        parsed['property_number'] = data.get('物件番号', '').strip()

       

        # Transportation info

        parsed['transportation'] = data.get('交通', '').strip()

       

        # Management fees and costs

        parsed['repair_reserve_fund'] = self.parse_price(data.get('修繕積立金', ''))

        parsed['other_fees'] = data.get('その他費用', '').strip()

       

        # Parse address components for hierarchical structure

        address_parts = self.parse_address_hierarchy(parsed['address'])

        parsed.update(address_parts)

       

        return parsed

   

    def parse_price(self, price_str: str) -> Optional[int]:

        """Parse price string to integer (remove 万円, convert to yen)"""

        if not price_str or price_str == '-':

            return None

       

        # Remove commas and extract number

        price_str = re.sub(r'[,，]', '', price_str)

        match = re.search(r'(\d+(?:\.\d+)?)', price_str)

        if match:

            price = float(match.group(1))

            if '万円' in price_str:

                return int(price * 10000)  # Convert 万円 to yen

            return int(price)

        return None

   

    def parse_area(self, area_str: str) -> Optional[float]:

        """Parse area string to float"""

        if not area_str or area_str == '-':

            return None

       

        # Extract number before m²

        match = re.search(r'(\d+(?:\.\d+)?)(?:m|㎡)', area_str)

        if match:

            return float(match.group(1))

        return None

   

    def parse_balcony_area(self, balcony_str: str) -> Optional[float]:

        """Parse balcony area string to float"""

        if not balcony_str or balcony_str == '-':

            return None

       

        match = re.search(r'(\d+(?:\.\d+)?)(?:m|㎡)', balcony_str)

        if match:

            return float(match.group(1))

        return None

   

    def parse_year(self, year_str: str) -> Optional[str]:

        """Parse year built string"""

        if not year_str or year_str == '-':

            return None

       

        # Extract year from format like "1994年04月築"

        match = re.search(r'(\d{4})年(\d{1,2})月', year_str)

        if match:

            year = match.group(1)

            month = match.group(2).zfill(2)

            return f"{year}-{month}-01"

        return None

   

    def parse_units(self, units_str: str) -> Optional[int]:

        """Parse total units string"""

        if not units_str or units_str == '-':

            return None

       

        match = re.search(r'(\d+)', units_str)

        if match:

            return int(match.group(1))

        return None

   

    def parse_date(self, date_str: str) -> Optional[str]:

        """Parse date string to ISO format"""

        if not date_str or date_str == '-':

            return None

       

        # Parse format like "2025年07月21日"

        match = re.search(r'(\d{4})年(\d{1,2})月(\d{1,2})日', date_str)

        if match:

            year = match.group(1)

            month = match.group(2).zfill(2)

            day = match.group(3).zfill(2)

            return f"{year}-{month}-{day}"

        return None

   

    def parse_address_hierarchy(self, address: str) -> Dict[str, Optional[str]]:

        """Parse Japanese address into hierarchical components"""

        if not address:

            return {

                'zipcode': None,

                'area_level_1': None,

                'area_level_2': None,

                'area_level_3': None,

                'area_level_4': None

            }

       

        parts = {

            'zipcode': None,  # Not available in this format

            'area_level_1': '関東地方',  # Default region for this area

            'area_level_2': None,  # Prefecture

            'area_level_3': None,  # City

            'area_level_4': None   # District/Area

        }

       

        # Extract prefecture (県)

        if '県' in address:

            pref_match = re.search(r'([^県]+県)', address)

            if pref_match:

                parts['area_level_2'] = pref_match.group(1)

       

        # Extract city (市)

        if '市' in address:

            city_match = re.search(r'([^市]+市)', address)

            if city_match:

                parts['area_level_3'] = city_match.group(1)

       

        # Extract ward/district (区)

        if '区' in address:

            ward_match = re.search(r'([^区]+区)', address)

            if ward_match:

                parts['area_level_4'] = ward_match.group(1)

       

        return parts

   

    def generate_sql_insert(self, property_data: Dict[str, Any]) -> str:

        """Generate SQL INSERT statement from parsed property data"""

       

        sql_template = """

INSERT INTO properties (

    title, price, pricePerSquareMeter, address, layout, area, floorInfo,

    structure, managementFee, areaOfUse, transportation, walkDistance, location, propertyType,

    yearBuilt, balconyArea, totalUnits, repairReserveFund, landLeaseFee,

    rightFee, depositGuarantee, maintenanceFees, otherFees, bicycleParking,

    bikeStorage, siteArea, pets, landRights, managementForm, landLawNotification,

    currentSituation, extraditionPossibleDate, transactionMode, propertyNumber,

    informationReleaseDate, nextScheduledUpdateDate, remarks, evaluationCertificate,

    parking, kitchen, bathToilet, facilitiesServices, others, images,

    zipcode, area_level_1, area_level_2, area_level_3, area_level_4, status,

    direction, urbanPlanning, condominiumSalesCompany, constructionCompany,

    designCompany, managementCompany, buildingArea, landArea, accessSituation,

    buildingCoverageRatio, floorAreaRatio, estimatedRent, assumedYield,

    currentRent, currentYield, rentalStatus, numberOfUnitsInTheBuilding,

    exclusiveAreaOfEachResidence         

)

VALUES (

    {title},

    {price},

    {price_per_sqm},

    {address},

    {layout},

    {area},

    {floor_info},

    {structure},

    {management_fee},

    {area_of_use},

    {transportation},

    {walk_distance},

    {location},

    {property_type},

    {year_built},

    {balcony_area},

    {total_units},

    {repair_reserve_fund},

    {land_lease_fee},

    {right_fee},

    {deposit_guarantee},

    {maintenance_fees},

    {other_fees},

    {bicycle_parking},

    {bike_storage},

    {site_area},

    {pets},

    {land_rights},

    {management_form},

    {land_law_notification},

    {current_situation},

    {extradition_possible_date},

    {transaction_mode},

    {property_number},

    {information_release_date},

    {next_scheduled_update_date},

    {remarks},

    {evaluation_certificate},

    {parking},

    {kitchen},

    {bath_toilet},

    {facilities_services},

    {others},

    {images},

    {zipcode},

    {area_level_1},

    {area_level_2},

    {area_level_3},

    {area_level_4},

    {status},

    {direction},

    {urban_planning},

    {condominium_sales_company},

    {construction_company},

    {design_company},

    {management_company},

    {building_area},

    {land_area},

    {access_situation},

    {building_coverage_ratio},

    {floor_area_ratio},

    {estimated_rent},

    {assumed_yield},

    {current_rent},

    {current_yield},

    {rental_status},

    {number_of_units_in_building},

    {exclusive_area_of_each_residence}

);"""

 

        # Format values safely for SQL

        def format_value(value):

            if value is None:

                return 'NULL'

            elif isinstance(value, str):

                # Escape single quotes and wrap in quotes

                escaped = value.replace("'", "''")

                return f"'{escaped}'"

            elif isinstance(value, (int, float)):

                return str(value)

            else:

                return f"'{str(value)}'"

       

        # Calculate price per square meter if both price and area are available

        price_per_sqm = None

        if property_data.get('price') and property_data.get('area'):

            price_per_sqm = int(property_data['price'] / property_data['area'])

       

        values = {

            'title': format_value('物件名未指定'),  # Title not usually in screenshot

            'price': format_value(property_data.get('price')),

            'price_per_sqm': format_value(price_per_sqm),

            'address': format_value(property_data.get('address')),

            'layout': format_value(property_data.get('layout')),

            'area': format_value(property_data.get('area')),

            'floor_info': format_value(property_data.get('floor_info')),

            'structure': format_value(property_data.get('structure')),

            'management_fee': format_value(None),

            'area_of_use': format_value(None),

            'transportation': format_value(property_data.get('transportation')),

            'walk_distance': format_value(None),

            'location': format_value('NULL'),  # PostGIS point would go here

            'property_type': format_value('中古マンション'),

            'year_built': format_value(property_data.get('year_built')),

            'balcony_area': format_value(property_data.get('balcony_area')),

            'total_units': format_value(property_data.get('total_units')),

            'repair_reserve_fund': format_value(property_data.get('repair_reserve_fund')),

            'land_lease_fee': format_value(None),

            'right_fee': format_value(None),

            'deposit_guarantee': format_value(None),

            'maintenance_fees': format_value(None),

            'other_fees': format_value(property_data.get('other_fees')),

            'bicycle_parking': format_value(None),

            'bike_storage': format_value(None),

            'site_area': format_value(None),

            'pets': format_value(None),

            'land_rights': format_value(property_data.get('land_rights')),

            'management_form': format_value(property_data.get('management_form')),

            'land_law_notification': format_value(None),

            'current_situation': format_value(property_data.get('current_situation')),

            'extradition_possible_date': format_value(None),

            'transaction_mode': format_value(property_data.get('transaction_mode')),

            'property_number': format_value(property_data.get('property_number')),

            'information_release_date': format_value(property_data.get('information_release_date')),

            'next_scheduled_update_date': format_value(property_data.get('next_scheduled_update_date')),

            'remarks': format_value(None),

            'evaluation_certificate': format_value(None),

            'parking': format_value(None),

            'kitchen': format_value(None),

            'bath_toilet': format_value(None),

            'facilities_services': format_value(None),

            'others': format_value(None),

            'images': format_value('ARRAY[]'),  # Empty array

            'zipcode': format_value(property_data.get('zipcode')),

            'area_level_1': format_value(property_data.get('area_level_1')),

            'area_level_2': format_value(property_data.get('area_level_2')),

            'area_level_3': format_value(property_data.get('area_level_3')),

            'area_level_4': format_value(property_data.get('area_level_4')),

            'status': format_value('for sale'),

            'direction': format_value(property_data.get('direction')),

            'urban_planning': format_value(None),

            'condominium_sales_company': format_value(None),

            'construction_company': format_value(None),

            'design_company': format_value(None),

            'management_company': format_value(property_data.get('management_company')),

            'building_area': format_value(None),

            'land_area': format_value(None),

            'access_situation': format_value(None),

            'building_coverage_ratio': format_value(None),

            'floor_area_ratio': format_value(None),

            'estimated_rent': format_value(None),

            'assumed_yield': format_value(None),

            'current_rent': format_value(None),

            'current_yield': format_value(None),

            'rental_status': format_value(None),

            'number_of_units_in_building': format_value(None),

            'exclusive_area_of_each_residence': format_value(None)

        }

       

        return sql_template.format(**values)

   

    def process_screenshot(self, image_path: str, verbose: bool = False) -> str:

        """

        Main method to process screenshot and generate SQL

        """

        if verbose:

            print(f"Processing screenshot: {image_path}")

       

        # Extract text using OCR

        if verbose:

            print("Extracting text from image...")

        ocr_text = self.extract_text_from_image(image_path)

       

        if verbose:

            print("OCR Text extracted:")

            print("-" * 40)

            print(ocr_text)

            print("-" * 40)

       

        # Parse OCR text into structured data

        if verbose:

            print("Parsing structured data...")

        structured_data = self.parse_ocr_text_to_dict(ocr_text)

       

        if verbose:

            print("Structured data:")

            for key, value in structured_data.items():

                print(f"  {key}: {value}")

            print("-" * 40)

       

        # Parse into final format

        parsed_data = self.parse_property_data(structured_data)

       

        # Generate SQL

        if verbose:

            print("Generating SQL INSERT statement...")

        sql_insert = self.generate_sql_insert(parsed_data)

       

        return sql_insert

 

def main():

    """

    Main function with command line argument parsing

    """

    parser = argparse.ArgumentParser(

        description='Generate SQL INSERT statements from Japanese property listing screenshots'

    )

    parser.add_argument(

        'screenshot',

        help='Path to the screenshot image file'

    )

    parser.add_argument(

        '-v', '--verbose',

        action='store_true',

        help='Enable verbose output showing OCR results and parsing steps'

    )

    parser.add_argument(

        '-o', '--output',

        help='Output file for the SQL statement (default: print to stdout)'

    )

   

    args = parser.parse_args()

   

    try:

        generator = PropertySQLGenerator()

        sql_result = generator.process_screenshot(args.screenshot, args.verbose)

       

        if args.output:

            with open(args.output, 'w', encoding='utf-8') as f:

                f.write(sql_result)

            print(f"SQL statement written to: {args.output}")

        else:

            print("Generated SQL INSERT statement:")

            print("=" * 50)

            print(sql_result)

           

    except KeyboardInterrupt:

        print("\nOperation cancelled by user.")

        sys.exit(1)

    except Exception as e:

        print(f"Error: {str(e)}")

        sys.exit(1)

 

if __name__ == "__main__":

    main()