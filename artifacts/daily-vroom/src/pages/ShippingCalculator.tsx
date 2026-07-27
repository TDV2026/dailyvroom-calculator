import { useEffect, useRef, useState, useMemo } from 'react';

const API_BASE = import.meta.env.BASE_URL; // ends with '/'

// Faithful port of .migration-backup/shipping.html

const CAR_MODELS: Record<string, [string, number, number][]> = {
  'Acura': [['NSX NA1', 1990, 2005], ['NSX NC1', 2016, 2022], ['Integra Type R DC5', 2001, 2006], ['RSX Type S', 2002, 2006], ['TL Type S', 2007, 2008], ['TSX', 2003, 2008], ['Legend Coupe', 1987, 1995]],
  'Alfa Romeo': [['Spider 105', 1966, 1993], ['GTV 105', 1963, 1977], ['GTV6', 1980, 1987], ['Spider 916', 1994, 2005], ['GTV 916', 1994, 2005], ['147 GTA', 2002, 2010], ['156 GTA', 2002, 2005], ['166 2.5 V6', 1998, 2007], ['Brera', 2005, 2011], ['8C Competizione', 2007, 2010], ['4C', 2013, 2020], ['Giulia Quadrifoglio', 2016, 2026], ['Stelvio Quadrifoglio', 2017, 2026]],
  'Alfa Romeo Pre-War': [['6C 1500', 1925, 1933], ['6C 1750', 1927, 1933], ['6C 2300', 1934, 1939], ['8C 2300', 1931, 1934], ['8C 2900', 1935, 1939], ['P3', 1932, 1936]],
  'Aston Martin': [['DB4', 1958, 1963], ['DB5', 1963, 1965], ['DB6', 1965, 1970], ['DB7', 1994, 2004], ['DB9', 2004, 2016], ['DB11', 2016, 2023], ['DB12', 2023, 2026], ['DBS', 2007, 2012], ['DBS Superleggera', 2018, 2023], ['Vanquish', 2001, 2018], ['Vantage V8', 1977, 1989], ['Vantage AMR', 2017, 2023], ['Vantage 2024', 2024, 2026], ['DBX707', 2022, 2026], ['Rapide', 2010, 2020], ['One-77', 2009, 2012], ['Valkyrie', 2021, 2026]],
  'Atlas': [['Motorette', 1896, 1911]],
  'Auburn': [['851 Speedster', 1935, 1936], ['852 Speedster', 1936, 1937]],
  'Audi': [['Quattro Coupe', 1980, 1991], ['S2', 1990, 1995], ['RS2 Avant', 1994, 1995], ['S4 B5', 1997, 2002], ['RS4 B5 Avant', 1999, 2001], ['RS4 B7', 2005, 2008], ['RS6 C5', 2002, 2004], ['RS6 C6', 2008, 2010], ['TT 8N', 1998, 2006], ['TT 8J', 2006, 2014], ['TT RS 8J', 2009, 2014], ['R8 V8', 2007, 2015], ['R8 V10', 2009, 2023], ['RS3 8V', 2015, 2020], ['RS3 8Y', 2021, 2026], ['RS5 B8', 2010, 2017], ['RS5 B9', 2017, 2026], ['RS7 C8', 2020, 2026], ['e-tron GT', 2021, 2026], ['Q5 TDI', 2008, 2026], ['A6 TDI', 2004, 2026], ['A4 TDI B6', 2000, 2005], ['A4 TDI B7', 2004, 2008], ['A4 TDI B8', 2007, 2012], ['S6 C7', 2012, 2018], ['Allroad 2.7T', 2000, 2005]],
  'Austin-Healey': [['100', 1953, 1956], ['100-6', 1956, 1959], ['3000 Mk1', 1959, 1961], ['3000 Mk2', 1961, 1962], ['3000 Mk3', 1963, 1967], ['Sprite Mk1', 1958, 1961], ['Sprite Mk2', 1961, 1964], ['Sprite Mk3', 1964, 1966], ['Sprite Mk4', 1966, 1971]],
  'Bentley': [['Mulsanne', 2010, 2020], ['Continental GT V8', 2011, 2026], ['Continental GT W12', 2003, 2026], ['Continental GTC V8', 2012, 2026], ['Continental GTC W12', 2011, 2026], ['Flying Spur V8', 2013, 2026], ['Flying Spur W12', 2003, 2026], ['Bentayga W12', 2016, 2022], ['Bentayga V8', 2018, 2026], ['Bentayga EWB', 2022, 2026], ['Mulliner Bacalar', 2021, 2021], ['Batur', 2023, 2024]],
  'Bentley Pre-War': [['3 Litre', 1921, 1929], ['4.5 Litre', 1926, 1931], ['6.5 Litre', 1926, 1930], ['8 Litre', 1930, 1931], ['Speed Six', 1928, 1930], ['3.5 Litre', 1933, 1937], ['4.25 Litre', 1936, 1939], ['Mk V', 1939, 1941]],
  'BMW': [['2002', 1968, 1976], ['2002 Turbo', 1973, 1974], ['M1', 1978, 1981], ['635 CSi', 1978, 1989], ['M635 CSi', 1984, 1989], ['850i', 1989, 1999], ['850CSi', 1992, 1996], ['M3 E30', 1986, 1991], ['M3 E36', 1992, 1999], ['M3 E46', 2000, 2006], ['M3 E90', 2007, 2013], ['M3 E92', 2007, 2013], ['M3 G80', 2021, 2026], ['M3 CS', 2023, 2026], ['M5 E28', 1984, 1988], ['M5 E34', 1991, 1995], ['M5 E39', 1998, 2003], ['M5 E60', 2004, 2010], ['M5 F10', 2011, 2016], ['M5 G90', 2024, 2026], ['M8', 2019, 2026], ['XM', 2023, 2026], ['Z3 M Roadster', 1997, 2002], ['Z4 M', 2006, 2008], ['Z8', 2000, 2003], ['1 Series M', 2011, 2012], ['M2 F87', 2016, 2021], ['M2 G87', 2022, 2026], ['M4 F82', 2014, 2020], ['M4 G82', 2021, 2026], ['525d E39', 1996, 2003], ['530d E39', 1998, 2003], ['530d E60', 2003, 2010], ['X5 3.0d E53', 2001, 2006], ['X5 M E70', 2009, 2013], ['320d E46', 1998, 2005], ['330d E46', 2003, 2005], ['330d E90', 2005, 2012], ['325i E30', 1985, 1992], ['M3 E30 Touring', 1987, 1991]],
  'Bugatti Pre-War': [['Type 35', 1924, 1931], ['Type 37', 1926, 1930], ['Type 40', 1926, 1930], ['Type 41 Royale', 1927, 1933], ['Type 43', 1927, 1931], ['Type 44', 1926, 1930], ['Type 50', 1930, 1934], ['Type 51', 1931, 1935], ['Type 55', 1931, 1935], ['Type 57', 1934, 1940]],
  'Cadillac': [['CTS-V Coupe', 2011, 2015], ['CTS-V Sedan', 2009, 2015], ['CT5-V Blackwing', 2022, 2026], ['CT4-V Blackwing', 2022, 2026], ['Escalade', 2000, 2026], ['DeVille', 1949, 2005], ['Eldorado', 1953, 1978], ['Fleetwood', 1975, 1996], ['Seville', 1975, 1979]],
  'Cadillac Pre-War': [['V16', 1930, 1940], ['V12', 1931, 1937], ['Series 60', 1936, 1942], ['Series 75', 1936, 1942]],
  'Caterham': [['Seven 270', 2014, 2026], ['Seven 310', 2016, 2026], ['Seven 360', 2014, 2026], ['Seven 420', 2014, 2026], ['Seven 485', 2014, 2026], ['Seven 620R', 2013, 2026], ['Seven CSR', 2005, 2013], ['Seven Supersport', 2008, 2026]],
  'Chevrolet': [['Corvette C1', 1953, 1962], ['Corvette C2', 1963, 1967], ['Corvette C3', 1968, 1982], ['Corvette C4', 1984, 1996], ['Corvette C5', 1997, 2004], ['Corvette C6', 2005, 2013], ['Corvette C7', 2014, 2019], ['Corvette C8', 2020, 2026], ['Corvette Z06 C8', 2023, 2026], ['Corvette E-Ray', 2024, 2026], ['Camaro Z28', 1967, 2002], ['Camaro ZL1', 2012, 2025], ['Camaro SS', 1967, 2025], ['K10 Pickup', 1960, 1987], ['K10 Suburban', 1960, 1991], ['K20 Pickup', 1960, 1987], ['K5 Blazer', 1969, 1994], ['C10 Pickup', 1960, 1987], ['C30 Pickup', 1960, 1987], ['El Camino', 1959, 1987], ['Monte Carlo SS', 1970, 1988], ['Nova SS', 1966, 1979], ['Impala SS', 1961, 1969], ['Chevelle SS', 1964, 1977], ['Bel Air', 1950, 1981]],
  'Cord': [['L-29', 1929, 1932], ['810', 1935, 1937], ['812', 1937, 1937]],
  'Datsun/Nissan': [['240Z', 1969, 1973], ['260Z', 1974, 1975], ['280Z', 1975, 1978], ['280ZX', 1978, 1983], ['300ZX Z31', 1983, 1989], ['300ZX Z32', 1989, 2000]],
  'Delage': [['D8', 1929, 1940], ['D6', 1930, 1940]],
  'Delahaye': [['135', 1935, 1954], ['175', 1948, 1951]],
  'Dodge': [['Viper RT/10', 1992, 2002], ['Viper GTS', 1996, 2002], ['Viper ACR', 2008, 2017], ['Challenger Hellcat', 2015, 2025], ['Charger Hellcat', 2015, 2025], ['Demon', 2018, 2018]],
  'Duesenberg': [['Model A', 1921, 1926], ['Model J', 1928, 1937], ['Model SJ', 1932, 1937]],
  'Ferrari': [['250 GTO', 1962, 1964], ['275 GTB', 1964, 1968], ['308 GTB', 1975, 1985], ['308 GTS', 1977, 1985], ['328', 1985, 1989], ['348', 1989, 1995], ['355', 1994, 1999], ['360 Modena', 1999, 2005], ['360 Challenge Stradale', 2003, 2005], ['430', 2004, 2009], ['430 Scuderia', 2007, 2009], ['458', 2009, 2015], ['458 Speciale', 2013, 2015], ['488', 2015, 2019], ['488 Pista', 2018, 2020], ['F8', 2019, 2023], ['SF90', 2020, 2026], ['296', 2021, 2026], ['12Cilindri', 2024, 2026], ['Roma', 2020, 2026], ['Purosangue', 2023, 2026], ['Testarossa', 1984, 1996], ['512 BB', 1976, 1984], ['456', 1992, 2003], ['550 Maranello', 1996, 2001], ['575M', 2002, 2006], ['599', 2006, 2012], ['612', 2004, 2011], ['F40', 1987, 1992], ['F50', 1995, 1997], ['Enzo', 2002, 2004], ['LaFerrari', 2013, 2016], ['812', 2017, 2022]],
  'Fiat': [['500', 1957, 1975], ['500 Abarth', 2007, 2022], ['124 Spider', 1966, 1985], ['124 Spider 2016', 2016, 2020], ['Dino', 1966, 1972], ['131 Abarth', 1976, 1981], ['Punto GT', 1993, 1999], ['Coupe Turbo', 1994, 2000], ['Barchetta', 1995, 2005], ['Multipla', 1998, 2010]],
  'Ford': [['GT40', 1964, 1969], ['GT', 2005, 2006], ['GT 2nd Gen', 2017, 2022], ['Mustang Boss 302', 1969, 1970], ['Mustang Mach 1', 1969, 2004], ['Mustang GT500', 1967, 2026], ['Mustang Dark Horse', 2024, 2026], ['Mustang Bullitt', 1968, 2020], ['Sierra Cosworth', 1985, 1992], ['Escort Cosworth', 1992, 1996], ['Focus RS Mk2', 2009, 2010], ['Focus RS Mk3', 2015, 2018], ['Puma ST', 2019, 2026], ['Fiesta ST', 2013, 2025], ['Ranger Raptor', 2019, 2026], ['Bronco', 2021, 2026], ['F100', 1948, 1983], ['F150 Raptor', 2010, 2026], ['F150 Lightning Heritage', 2023, 2026]],
  'Ford Pre-War': [['Model T', 1908, 1927], ['Model A', 1927, 1931], ['Model B', 1932, 1934], ['V8', 1932, 1942]],
  'Frazer Nash': [['Chain Gang', 1924, 1939], ['Le Mans Replica', 1948, 1953]],
  'Hispano-Suiza': [['H6', 1919, 1933], ['J12', 1931, 1938], ['K6', 1934, 1937]],
  'Honda': [['NSX NA1', 1990, 2005], ['NSX NA2', 1997, 2005], ['NSX NC1', 2016, 2022], ['NSX Type S', 2021, 2022], ['S2000', 1999, 2009], ['Civic Type R EK9', 1997, 2000], ['Civic Type R EP3', 2001, 2005], ['Civic Type R FD2', 2007, 2011], ['Civic Type R FK2', 2015, 2017], ['Civic Type R FK8', 2017, 2021], ['Civic Type R FL5', 2023, 2026], ['Integra Type R DC2', 1995, 2001], ['Integra Type R DC5', 2001, 2006], ['Beat', 1991, 1996], ['S660', 2015, 2022], ['Legend', 1985, 2021], ['Prelude', 1978, 2001], ['Acty Van', 1977, 2021], ['Life Step Van', 1997, 2003], ['Element', 2003, 2011]],
  'Infiniti': [['G35 Coupe', 2003, 2007], ['G37 Coupe', 2008, 2013], ['G35 Sedan', 2003, 2006], ['Q60 Red Sport', 2017, 2022], ['FX35', 2003, 2008], ['FX45', 2003, 2008], ['FX50', 2008, 2013], ['Q45', 1989, 2006], ['M45', 2003, 2010]],
  'Isotta Fraschini': [['Tipo 8', 1919, 1924], ['Tipo 8A', 1924, 1931]],
  'Isuzu': [['VehiCROSS', 1997, 2001], ['Trooper', 1981, 2002], ['Bighorn', 1981, 2002], ['Wizard', 1993, 1998], ['Faster', 1972, 2002]],
  'Jaguar': [['E-Type S1', 1961, 1968], ['E-Type S2', 1968, 1971], ['E-Type S3', 1971, 1975], ['XJ-S', 1975, 1996], ['XK8', 1996, 2006], ['XKR', 1998, 2014], ['XKR-S', 2011, 2014], ['F-Type', 2013, 2024], ['F-Type SVR', 2016, 2024], ['XE SV Project 8', 2018, 2019], ['F-Pace SVR', 2017, 2026], ['XJ220', 1992, 1994], ['C-X75', 2013, 2014]],
  'Jeep': [['Wrangler YJ', 1987, 1995], ['Wrangler TJ', 1997, 2006], ['Wrangler JK', 2007, 2018], ['Wrangler JL', 2018, 2026], ['Wrangler Rubicon 392', 2021, 2026], ['Grand Cherokee Trackhawk', 2018, 2021], ['Grand Wagoneer', 1963, 1991], ['CJ-5', 1954, 1983], ['CJ-7', 1976, 1986]],
  'Koenigsegg': [['CC8S', 2002, 2004], ['CCR', 2004, 2006], ['CCX', 2006, 2010], ['CCXR', 2007, 2010], ['Agera', 2011, 2014], ['Agera R', 2011, 2014], ['Agera RS', 2015, 2018], ['One:1', 2014, 2014], ['Regera', 2016, 2020], ['Jesko', 2020, 2026], ['Jesko Absolut', 2020, 2026], ['Gemera', 2022, 2026], ['CC850', 2022, 2026]],
  'Lagonda': [['Rapier', 1934, 1935], ['LG6', 1937, 1940], ['V12', 1937, 1940]],
  'Lamborghini': [['Miura', 1966, 1973], ['Countach', 1974, 1990], ['Diablo', 1990, 2001], ['Diablo SV', 1995, 2001], ['Murcielago', 2001, 2010], ['Murcielago LP670', 2009, 2010], ['Gallardo', 2003, 2013], ['Gallardo Superleggera', 2007, 2010], ['Huracan', 2014, 2024], ['Huracan Performante', 2017, 2022], ['Aventador', 2011, 2022], ['Aventador SVJ', 2018, 2022], ['Urus', 2018, 2026], ['Revuelto', 2023, 2026], ['Temerario', 2025, 2026]],
  'Lancia': [['Stratos', 1972, 1978], ['037', 1982, 1983], ['Delta Integrale 8v', 1987, 1989], ['Delta Integrale 16v', 1989, 1994], ['Delta HF Turbo', 1983, 1987], ['Fulvia', 1963, 1976]],
  'Land Rover': [['Series I', 1948, 1958], ['Series II', 1958, 1971], ['Series III', 1971, 1985], ['Defender 90', 1983, 2016], ['Defender 110', 1983, 2016], ['Defender 130', 1983, 2016], ['Defender 90 L663', 2020, 2026], ['Defender 110 L663', 2020, 2026], ['Range Rover Classic', 1970, 1996], ['Range Rover P38', 1994, 2002], ['Range Rover L322', 2002, 2012], ['Range Rover Sport', 2005, 2026], ['Range Rover L460', 2022, 2026], ['Discovery 1', 1989, 1998], ['Discovery 2', 1998, 2004], ['Discovery 3', 2004, 2009], ['Discovery 4', 2009, 2016], ['Freelander 1', 1997, 2006]],
  'Lexus': [['LFA', 2010, 2012], ['LC500', 2017, 2026], ['LC500h', 2017, 2026], ['LX470', 1998, 2007], ['LX570', 2007, 2021], ['LX600', 2022, 2026], ['SC300', 1991, 2000], ['SC400', 1991, 2000], ['SC430', 2001, 2010], ['IS300', 2000, 2005], ['IS-F', 2008, 2014], ['GS-F', 2016, 2020], ['RC-F', 2015, 2024], ['RC-F Track Edition', 2020, 2022], ['GS300', 1993, 2005], ['LS400', 1989, 2000], ['LS430', 2001, 2006], ['LS460', 2006, 2012]],
  'Lincoln Pre-War': [['Model L', 1920, 1930], ['Model K', 1930, 1942], ['Zephyr', 1936, 1942], ['Continental', 1939, 1942]],
  'Lotus': [['Elan', 1962, 1975], ['Europa', 1966, 1975], ['Esprit S1', 1976, 1978], ['Esprit Turbo', 1980, 1987], ['Esprit V8', 1996, 2004], ['Elise S1', 1996, 2000], ['Elise S2', 2001, 2011], ['Elise S3', 2011, 2021], ['Exige S1', 2000, 2002], ['Exige S2', 2004, 2012], ['Exige V6', 2012, 2021], ['Evora', 2009, 2021], ['Emira', 2022, 2026], ['Eletre', 2023, 2026]],
  'Maserati': [['Ghibli 310', 1966, 1973], ['Bora', 1971, 1978], ['Merak', 1972, 1983], ['Khamsin', 1974, 1982], ['Quattroporte II', 1994, 2001], ['Quattroporte V', 2003, 2012], ['Quattroporte VI', 2013, 2022], ['GranTurismo', 2007, 2019], ['GranTurismo 2023', 2022, 2026], ['GranCabrio', 2010, 2019], ['GranCabrio 2023', 2023, 2026], ['3200 GT', 1998, 2002], ['Coupe', 2001, 2007], ['Spyder', 2001, 2007], ['MC12', 2004, 2005], ['GranSport', 2004, 2007], ['MC20', 2021, 2026], ['Grecale', 2022, 2026]],
  'Mazda': [['Cosmo', 1967, 1972], ['RX-7 SA', 1978, 1985], ['RX-7 FB', 1978, 1985], ['RX-7 FC', 1986, 1992], ['RX-7 FD', 1992, 2002], ['RX-8', 2003, 2012], ['MX-5 NA', 1989, 1997], ['MX-5 NB', 1998, 2005], ['MX-5 NC', 2005, 2015], ['MX-5 ND', 2015, 2026], ['Mazdaspeed 3', 2007, 2013], ['Cosmo LP', 1975, 1981]],
  'McLaren': [['F1', 1992, 1998], ['P1', 2013, 2015], ['675LT', 2015, 2017], ['720S', 2017, 2023], ['765LT', 2020, 2022], ['Senna', 2018, 2019], ['Speedtail', 2020, 2021], ['Artura', 2021, 2026], ['750S', 2023, 2026], ['W1', 2024, 2026], ['600LT', 2018, 2020], ['570S', 2015, 2021]],
  'Mercedes-Benz': [['G240 W460', 1979, 1994], ['G300 W460', 1979, 1994], ['G350 W460 Diesel', 1990, 1994], ['G300 W463', 1989, 2026], ['G320 W463', 1993, 2006], ['G350 W463 Diesel', 2008, 2018], ['G500 W463', 1993, 2018], ['G55 AMG W463', 1999, 2012], ['G63 AMG W463', 2012, 2018], ['190SL', 1955, 1963], ['300SL Gullwing', 1954, 1957], ['300SL Roadster', 1957, 1963], ['190E 2.3-16', 1984, 1988], ['190E 2.5-16 Evo', 1990, 1993], ['R107 SL', 1971, 1989], ['SL500 R129', 1989, 2001], ['SL600 R129', 1992, 2001], ['SL73 AMG R129', 1999, 2001], ['SLC180 R172', 2016, 2020], ['SLC200 R172', 2016, 2020], ['SLC300 R172', 2016, 2020], ['SLC43 AMG R172', 2016, 2020], ['SL500 R230', 2001, 2012], ['SL63 AMG R230', 2006, 2012], ['W124 500E', 1991, 1995], ['W124 300D', 1985, 1995], ['W124 300TD Wagon', 1985, 1996], ['W124 E300 Diesel', 1993, 1996], ['W210 E300 Diesel', 1995, 2002], ['W210 E320 CDI', 1999, 2002], ['W211 E320 CDI', 2002, 2009], ['W211 E280 CDI', 2005, 2009], ['E350 W212', 2009, 2016], ['E550 W212', 2009, 2013], ['E63 AMG W212', 2009, 2016], ['W124 E220', 1992, 1996], ['W201 190E', 1982, 1993], ['W126 560SEC', 1981, 1991], ['W140 S600', 1991, 1998], ['C36 AMG', 1994, 1997], ['C63 AMG W204', 2008, 2015], ['CLS55 AMG', 2004, 2006], ['CLS63 AMG', 2006, 2011], ['S63 AMG W221', 2007, 2013], ['S65 AMG W221', 2007, 2013], ['CLK GTR', 1997, 1998], ['SLR McLaren', 2003, 2010], ['SLS AMG', 2010, 2014], ['AMG GT', 2014, 2026], ['AMG GT Black Series', 2020, 2023], ['GT 63 AMG', 2019, 2026], ['G63 AMG', 2012, 2026], ['G300 CDI', 2000, 2012], ['G350 CDI', 2009, 2018], ['E63 AMG', 2006, 2026], ['C63 AMG W206', 2023, 2026], ['SL 63 AMG R232', 2022, 2026], ['W123 300D', 1976, 1985], ['W123 300TD', 1977, 1986], ['W116 450SEL 6.9', 1975, 1980]],
  'Mercedes-Benz Pre-War': [['SSK', 1928, 1932], ['500K', 1934, 1936], ['540K', 1936, 1940], ['770 Grosser', 1930, 1943], ['170', 1931, 1942], ['260D', 1936, 1940]],
  'MG': [['MGA', 1955, 1962], ['MGB', 1962, 1980], ['MGB GT', 1965, 1980], ['MGC', 1967, 1969], ['Midget', 1961, 1979], ['RV8', 1992, 1995]],
  'Mitsubishi': [['Starion', 1982, 1990], ['GTO/3000GT', 1990, 2001], ['Lancer Evo I', 1992, 1994], ['Lancer Evo II', 1994, 1995], ['Lancer Evo III', 1995, 1996], ['Lancer Evo IV', 1996, 1998], ['Lancer Evo V', 1998, 1999], ['Lancer Evo VI Tommi Makinen', 1999, 2001], ['Lancer Evo VII', 2001, 2003], ['Lancer Evo VIII', 2003, 2005], ['Lancer Evo IX', 2005, 2007], ['Lancer Evo X', 2007, 2016], ['Delica L300', 1979, 1994], ['Delica Space Gear', 1994, 2007], ['Pajero', 1982, 2021]],
  'Morgan': [['4/4', 1936, 2026], ['Plus 4', 1950, 2026], ['Plus 8', 1968, 2004], ['Aero 8', 2000, 2010], ['Plus Six', 2019, 2026], ['3 Wheeler', 2011, 2021]],
  'Nissan': [['Skyline GT-R R32', 1989, 1994], ['Skyline GT-R R33', 1995, 1998], ['Skyline GT-R R34', 1999, 2002], ['Skyline R31 GTS-R', 1987, 1990], ['GT-R R35', 2007, 2025], ['GT-R Nismo', 2014, 2024], ['400Z', 2022, 2026], ['Silvia S13', 1988, 1994], ['Silvia S14', 1993, 1999], ['Silvia S15', 1999, 2002], ['180SX', 1989, 1998], ['Fairlady Z Z31', 1983, 1989], ['Fairlady Z Z32', 1989, 2000], ['370Z', 2009, 2021], ['Stagea 260RS', 1996, 2001], ['Pulsar GTI-R', 1990, 1994], ['Pao', 1989, 1992], ['Figaro', 1991, 1991], ['S-Cargo', 1989, 1992], ['Be-1', 1987, 1988], ['Rasheen', 1994, 2000], ['Cube Z10', 1998, 2002], ['Cube Z11', 2002, 2008], ['Caravan E24', 1985, 2001], ['Safari Y60', 1987, 1997], ['Safari Y61', 1997, 2007], ['President', 1965, 2002]],
  'Packard Pre-War': [['Twin Six', 1916, 1923], ['Eight', 1923, 1942], ['Super Eight', 1933, 1942], ['Twelve', 1932, 1939]],
  'Pagani': [['Zonda C12', 1999, 2002], ['Zonda F', 2005, 2008], ['Zonda R', 2009, 2012], ['Zonda Cinque', 2009, 2010], ['Huayra', 2011, 2018], ['Huayra BC', 2016, 2018], ['Huayra R', 2021, 2023], ['Utopia', 2022, 2026]],
  'Peugeot': [['205 GTI', 1984, 1994], ['205 T16', 1984, 1985], ['306 GTI-6', 1996, 2002], ['306 Rallye', 1994, 1997], ['307 WRC', 2004, 2004], ['406 Coupe', 1997, 2004], ['504 Coupe', 1969, 1983], ['504 Cabriolet', 1969, 1983], ['205 Diesel', 1983, 1998], ['405 Mi16', 1987, 1997]],
  'Pontiac': [['Firebird Trans Am', 1969, 2002], ['GTO 1969', 1969, 1969], ['GTO Judge', 1969, 1971], ['Bonneville', 1957, 2005]],
  'Porsche': [['356 A', 1955, 1959], ['356 B', 1959, 1963], ['356 C', 1963, 1965], ['912', 1965, 1969], ['914', 1969, 1976], ['924', 1976, 1988], ['924 Carrera GT', 1980, 1981], ['928 S', 1979, 1986], ['928 GT', 1989, 1992], ['928 GTS', 1991, 1995], ['944', 1982, 1991], ['944 Turbo', 1985, 1991], ['944 S2', 1989, 1991], ['968', 1991, 1995], ['968 Club Sport', 1993, 1995], ['911 T', 1967, 1973], ['911 S', 1966, 1977], ['911 E', 1968, 1973], ['911 Carrera RS 2.7', 1972, 1974], ['911 930 Turbo 3.0', 1975, 1977], ['911 930 Turbo 3.3', 1978, 1989], ['911 SC', 1978, 1983], ['911 3.2 Carrera', 1983, 1989], ['911 964 C2', 1989, 1994], ['911 964 C4', 1989, 1994], ['911 964 Turbo', 1991, 1994], ['911 964 RS', 1991, 1994], ['911 993 Carrera', 1994, 1998], ['911 993 Carrera S', 1997, 1998], ['911 993 Turbo', 1995, 1998], ['911 993 GT2', 1995, 1998], ['911 993 RS', 1995, 1998], ['911 996 Carrera', 1997, 2005], ['911 996 Carrera 4S', 2001, 2005], ['911 996 Turbo', 2000, 2005], ['911 996 GT2', 2001, 2005], ['911 996 GT3', 1999, 2005], ['911 996 GT3 RS', 2003, 2005], ['911 997 Carrera S', 2004, 2012], ['911 997 Carrera 4S', 2005, 2012], ['911 997 Turbo', 2006, 2013], ['911 997 Turbo S', 2010, 2013], ['911 997 GT2 RS', 2010, 2012], ['911 997 GT3', 2006, 2012], ['911 997 GT3 RS', 2006, 2012], ['911 991 Carrera S', 2011, 2019], ['911 991 Turbo S', 2013, 2019], ['911 991 GT3', 2013, 2019], ['911 991 GT3 RS', 2015, 2019], ['911 991 GT2 RS', 2017, 2019], ['911 991 R', 2016, 2017], ['911 991 Speedster', 2019, 2019], ['911 992 Carrera S', 2019, 2026], ['911 992 Turbo S', 2020, 2026], ['911 992 GT3', 2021, 2026], ['911 992 GT3 RS', 2022, 2026], ['911 992 Sport Classic', 2022, 2023], ['911 992 S/T', 2023, 2026], ['911 992 Dakar', 2022, 2026], ['Boxster 986', 1996, 2004], ['Boxster 987', 2004, 2012], ['Boxster 981', 2012, 2016], ['Boxster 982', 2016, 2026], ['Cayman 987', 2005, 2012], ['Cayman 981', 2012, 2016], ['Cayman GT4 981', 2015, 2016], ['Cayman GT4 RS', 2021, 2026], ['Taycan Turbo S', 2020, 2026], ['Taycan GT', 2024, 2026], ['Cayenne Turbo GT', 2022, 2026], ['Cayenne GTS', 2003, 2026], ['Cayenne GTS Coupe', 2019, 2026], ['Cayenne Turbo', 2002, 2026], ['Cayenne S', 2002, 2026], ['Cayenne E-Hybrid', 2014, 2026], ['959', 1986, 1988], ['Carrera GT', 2004, 2006], ['918 Spyder', 2013, 2015]],
  'Ram': [['1500 TRX', 2021, 2024], ['1500 Classic', 2019, 2026], ['2500 Power Wagon', 2005, 2026]],
  'Renault': [['Alpine A110', 1961, 1977], ['Alpine A110 2017', 2017, 2026], ['Clio V6', 2001, 2005], ['Clio Williams', 1993, 1996], ['Megane RS 225', 2004, 2009], ['Megane RS 265', 2010, 2012], ['Megane RS 275', 2013, 2016], ['Megane RS Trophy', 2017, 2021], ['5 Turbo', 1980, 1986], ['R8 Gordini', 1964, 1971], ['Laguna V6', 1993, 2001]],
  'Rolls-Royce': [['Silver Shadow', 1965, 1980], ['Silver Shadow II', 1977, 1980], ['Silver Spirit', 1980, 1998], ['Silver Spur', 1980, 1994], ['Corniche', 1971, 1995], ['Camargue', 1975, 1986], ['Silver Seraph', 1998, 2002], ['Phantom IV', 1950, 1956], ['Phantom V', 1959, 1968], ['Phantom VI', 1968, 1991], ['Phantom VII', 2003, 2016], ['Phantom VIII', 2017, 2026], ['Ghost I', 2009, 2020], ['Ghost II', 2020, 2026], ['Wraith', 2013, 2023], ['Dawn', 2015, 2023], ['Cullinan', 2018, 2026], ['Spectre', 2023, 2026]],
  'Rolls-Royce Pre-War': [['Silver Ghost', 1906, 1926], ['Phantom I', 1925, 1929], ['Phantom II', 1929, 1936], ['Phantom III', 1936, 1939], ['20hp', 1922, 1929], ['20/25', 1929, 1936], ['25/30', 1936, 1938], ['Wraith', 1938, 1939]],
  'RUF': [['CTR Yellowbird', 1987, 1992], ['CTR2', 1995, 1998], ['CTR3', 2007, 2012], ['RGT', 2000, 2006], ['RT12', 2004, 2010], ['CTR Anniversary', 2017, 2022], ['SCR', 2018, 2022], ['GTR', 1991, 1996], ['Turbo R', 1991, 1998], ['3400S', 1994, 2001]],
  'SAAB': [['900 Turbo', 1978, 1994], ['900 SPG', 1984, 1991], ['9000 Aero', 1991, 1998], ['9-3 Viggen', 1999, 2002], ['9-3 Aero', 2002, 2011], ['9-5 Aero', 1997, 2011], ['9-5 SportCombi', 2005, 2011], ['9-2X Aero', 2005, 2006], ['Sonett III', 1970, 1974]],
  'Shelby': [['Cobra 260', 1962, 1963], ['Cobra 289', 1963, 1965], ['Cobra 427', 1965, 1967], ['GT350', 1965, 1970], ['GT500', 1967, 1970], ['GT350 2011', 2011, 2014], ['GT500 2013', 2013, 2014], ['GT350R', 2015, 2020], ['GT500 2020', 2020, 2023], ['Daytona Coupe', 1964, 1965]],
  'Subaru': [['Impreza WRX GC8', 1992, 2000], ['Impreza WRX STI GD', 2000, 2007], ['Impreza WRX STI GR', 2007, 2014], ['Legacy RS', 1989, 1994], ['Legacy B4', 1998, 2009], ['SVX', 1991, 1997], ['BRZ', 2012, 2026], ['WRX STI VA', 2014, 2021], ['WRX VB', 2022, 2026], ['WRX S4', 2021, 2026], ['Forester STI', 2004, 2013], ['Sambar', 1961, 2012]],
  'Suzuki': [['Cappuccino', 1991, 1998], ['Jimny SJ', 1981, 1998], ['Jimny JB', 1998, 2018], ['Jimny JB74', 2018, 2026], ['Alto Works', 1987, 2021], ['Carry Van', 1979, 2026], ['Every Van', 1982, 2026], ['Hustler', 2014, 2026], ['Swift Sport', 2005, 2026]],
  'Talbot-Lago': [['T150', 1935, 1940], ['T26', 1946, 1955]],
  'Toyota': [['2000GT', 1967, 1970], ['Supra A60', 1981, 1986], ['Supra A70', 1986, 1993], ['Supra A80', 1993, 2002], ['Supra A90', 2019, 2026], ['MR2 AW11', 1984, 1989], ['MR2 SW20', 1989, 1999], ['MR2 ZZW30', 1999, 2007], ['Celica GT-Four ST165', 1985, 1989], ['Celica GT-Four ST185', 1989, 1993], ['Celica GT-Four ST205', 1993, 1999], ['Corolla AE86', 1983, 1987], ['Land Cruiser FJ40', 1960, 1984], ['Land Cruiser FJ55', 1967, 1987], ['Land Cruiser 80', 1989, 1997], ['Land Cruiser 100', 1998, 2007], ['Land Cruiser 200', 2007, 2021], ['Land Cruiser 300', 2021, 2026], ['Land Cruiser 70', 1984, 2026], ['Hilux', 1968, 2026], ['HiAce', 1967, 2026], ['Hiace Super GL', 2004, 2026], ['GR Yaris', 2020, 2026], ['GR86', 2021, 2026], ['GR Corolla', 2022, 2026], ['Century', 1967, 2026], ['Alphard', 2002, 2026], ['Vellfire', 2008, 2026], ['RAV4 Euro Spec', 2000, 2018], ['Prado', 1990, 2026]],
  'Triumph': [['TR2', 1953, 1955], ['TR3', 1955, 1962], ['TR4', 1961, 1965], ['TR4A', 1965, 1968], ['TR5', 1967, 1968], ['TR6', 1969, 1976], ['TR7', 1975, 1981], ['TR8', 1979, 1981], ['Spitfire', 1962, 1980], ['GT6', 1966, 1973], ['Stag', 1970, 1977]],
  'TVR': [['Griffith', 1963, 1965], ['Chimaera', 1992, 2003], ['Cerbera', 1994, 2003], ['Tuscan', 1999, 2006], ['Tamora', 2001, 2006], ['Sagaris', 2004, 2006], ['T350', 2002, 2006]],
  'Unknown/Other': [['Unknown/Other', 1885, 2026]],
  'Veteran/Edwardian': [['Veteran Car pre-1905', 1885, 1904], ['Edwardian Car 1905-1918', 1905, 1918], ['Vintage Car 1919-1930', 1919, 1930], ['Pre-War Classic 1931-1945', 1931, 1945]],
  'Volkswagen': [['Golf GTI Mk1', 1976, 1983], ['Golf GTI Mk2', 1983, 1992], ['Golf GTI Mk3', 1991, 1997], ['Golf R32 Mk4', 2002, 2004], ['Golf R Mk6', 2010, 2013], ['Golf R Mk7', 2013, 2019], ['Golf R Mk8', 2020, 2026], ['Golf GTI Mk8', 2020, 2026], ['Golf TDI Mk4', 1997, 2004], ['Golf TDI Mk5', 2003, 2009], ['Golf TDI Mk6', 2008, 2013], ['Corrado G60', 1988, 1995], ['Corrado VR6', 1991, 1995], ['Scirocco', 1974, 1992], ['Phaeton W12', 2002, 2016], ['Touareg V10 TDI', 2002, 2010], ['Passat W8', 2001, 2004], ['Polo GTI', 1995, 2026], ['T3 Westfalia', 1979, 1991], ['T4', 1990, 2003], ['T5', 2003, 2015], ['T6', 2015, 2026]],
  'Volvo': [['P1800', 1961, 1973], ['242 Turbo', 1981, 1984], ['850 T5-R', 1994, 1997], ['850 R Estate', 1995, 1997], ['C70 T5', 1997, 2005], ['S60R', 2003, 2009], ['V70R', 1997, 2007], ['XC70', 1997, 2016], ['740 Turbo', 1984, 1992], ['940 Turbo', 1990, 1998], ['Amazon', 1956, 1970]],
};

const STYLES = `
.sc-scope *{box-sizing:border-box;margin:0;padding:0;}
.sc-scope{background:#FAFAF8;color:#111111;font-family:'Inter',sans-serif;font-weight:400;min-height:100vh;overflow-y:auto;}
.sc-scope .mast{padding:16px 32px;display:flex;align-items:center;justify-content:space-between;background:#111111;border-bottom:none;}
.sc-scope .mast-name{font-family:'Archivo',sans-serif;font-size:20px;font-weight:800;letter-spacing:-0.01em;text-transform:uppercase;color:#FFFFFF;}
.sc-scope .mast-name em{font-style:normal;color:#E63312;}
.sc-scope .mast-tag{font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#FFFFFF;border:2px solid #E63312;padding:4px 10px;}
.sc-scope .mast-sub{font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.75);}
.sc-scope .nav-tabs{display:flex;gap:0;border-bottom:2px solid #111111;max-width:680px;margin:0 auto;padding:0 24px;}
.sc-scope .nav-tab{font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#55595E;padding:13px 20px;border:none;background:none;cursor:pointer;border-bottom:3px solid transparent;margin-bottom:-2px;transition:all 0.15s;text-decoration:none;display:inline-block;}
.sc-scope .nav-tab:hover{color:#111111;}
.sc-scope .nav-tab.active{color:#111111;border-bottom-color:#E63312;}
.sc-scope .hero{max-width:600px;margin:0 auto;padding:40px 24px 28px;text-align:center;}
.sc-scope .hero-label{font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:#E63312;margin-bottom:18px;}
.sc-scope .hero h1{font-family:'Archivo',sans-serif;font-size:clamp(30px,4.5vw,50px);font-weight:900;line-height:1.05;letter-spacing:-0.02em;text-transform:uppercase;margin-bottom:16px;color:#111111;}
.sc-scope .hero h1 em{font-style:normal;color:#E63312;}
.sc-scope .hero-sub{font-size:15px;line-height:1.6;color:#3A3A3A;max-width:460px;margin:0 auto 8px;}
.sc-scope .hero-caveat{font-family:'IBM Plex Mono',monospace;font-size:12px;color:#55595E;max-width:440px;margin:0 auto 20px;line-height:1.6;}
.sc-scope .how-link{display:inline-block;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#FFFFFF;border-bottom:2px solid #E63312;padding-bottom:2px;cursor:pointer;background:none;border-top:none;border-left:none;border-right:none;transition:color 0.15s;}
.sc-scope .how-link:hover{color:#E63312;}
.sc-scope .hrule{max-width:680px;margin:0 auto;height:1px;background:#D9D9D4;}
.sc-scope .wrap{max-width:680px;margin:0 auto;padding:0 24px 72px;}
.sc-scope .form-section{padding:28px 0 0;}
.sc-scope .form-label{font-family:'Archivo',sans-serif;font-size:13px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:#111111;margin-bottom:14px;display:flex;align-items:center;gap:10px;}
.sc-scope .form-label::after{content:'';flex:1;height:2px;background:#111111;}
.sc-scope .g2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.sc-scope .g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;}
.sc-scope .mt{margin-top:12px;}
.sc-scope .fi{display:flex;flex-direction:column;gap:6px;}
.sc-scope .fi label{font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#55595E;}
.sc-scope .fi input,.sc-scope .fi select,.sc-scope .fi textarea{background:#FFFFFF;border:2px solid #111111;border-radius:0;color:#111111;font-family:'Inter',sans-serif;font-size:16px;font-weight:400;padding:11px 12px;outline:none;width:100%;-webkit-appearance:none;appearance:none;transition:border-color 0.15s;min-height:44px;}
.sc-scope .fi textarea{resize:vertical;min-height:80px;line-height:1.5;}
.sc-scope .fi input:focus,.sc-scope .fi select:focus,.sc-scope .fi textarea:focus{border-color:#E63312;}
.sc-scope .fi input::placeholder,.sc-scope .fi textarea::placeholder{color:#8A8E93;}
.sc-scope .fi-hint{font-family:'IBM Plex Mono',monospace;font-size:11px;color:#55595E;}
.sc-scope .errtxt{font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:600;color:#8A1200;padding:11px;background:#FBE3DE;border:2px solid #E63312;margin-top:8px;}
.sc-scope .calc-btn{width:100%;margin-top:20px;padding:15px;min-height:48px;background:#E63312;color:#FFFFFF;border:none;font-family:'Archivo',sans-serif;font-size:14px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;transition:background 0.15s;clip-path:polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%);}
.sc-scope .calc-btn:hover{background:#C52A0D;}
.sc-scope .ldw{padding:52px 0;text-align:center;}
.sc-scope .ldlbl{font-family:'Archivo',sans-serif;font-size:20px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:#111111;}
.sc-scope .ldbar{width:180px;height:3px;background:#D9D9D4;margin:20px auto 0;position:relative;overflow:hidden;}
.sc-scope .ldbar::after{content:'';position:absolute;top:0;left:-100%;width:100%;height:3px;background:#E63312;animation:sc-ldsweep 1.2s ease-in-out infinite;}
@keyframes sc-ldsweep{0%{left:-100%}100%{left:100%}}
.sc-scope .res-route{font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:#55595E;padding:28px 0 6px;}
.sc-scope .res-title{font-family:'Archivo',sans-serif;font-size:clamp(18px,2.5vw,24px);font-weight:800;letter-spacing:-0.01em;color:#111111;padding-bottom:20px;border-bottom:2px solid #111111;text-transform:uppercase;}
.sc-scope .crow{display:flex;justify-content:space-between;align-items:flex-start;padding:14px 0 14px 14px;border-bottom:1px solid #D9D9D4;border-left:3px solid #E63312;gap:16px;}
.sc-scope .clbl{font-size:15px;font-weight:600;color:#111111;flex:1;line-height:1.3;}
.sc-scope .csub{display:block;font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:400;color:#55595E;margin-top:3px;}
.sc-scope .cval{font-family:'IBM Plex Mono',monospace;font-size:15px;font-weight:500;color:#111111;white-space:nowrap;font-variant-numeric:tabular-nums;text-align:right;}
.sc-scope .totrow{display:flex;justify-content:space-between;align-items:center;padding:18px 20px;margin-top:6px;gap:16px;background:#111111;clip-path:polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%);}
.sc-scope .tot-lbl{font-family:'Archivo',sans-serif;font-size:15px;font-weight:800;letter-spacing:0.04em;text-transform:uppercase;color:#FFFFFF;}
.sc-scope .tot-val{font-family:'IBM Plex Mono',monospace;font-size:24px;font-weight:600;color:#E63312;font-variant-numeric:tabular-nums;}
.sc-scope .price-note{font-family:'IBM Plex Mono',monospace;font-size:11px;color:#55595E;padding:10px 0 0;line-height:1.6;}
.sc-scope .dist-line{font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:500;color:#3A3A3A;padding:6px 0 0;}
.sc-scope .toggle-grid{display:grid;grid-template-columns:1fr 1fr;border:2px solid #111111;margin:16px 0 0;}
.sc-scope .tog-btn{background:#FFFFFF;border:none;padding:16px;min-height:44px;cursor:pointer;text-align:left;transition:all 0.15s;border-right:2px solid #111111;}
.sc-scope .tog-btn:last-child{border-right:none;}
.sc-scope .tog-btn.active{background:#E63312;}
.sc-scope .tog-kicker{display:block;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#55595E;margin-bottom:6px;}
.sc-scope .tog-kicker.active{color:#FFFFFF;}
.sc-scope .tog-price{display:block;font-family:'IBM Plex Mono',monospace;font-size:26px;font-weight:500;color:#111111;font-variant-numeric:tabular-nums;}
.sc-scope .tog-price.active{color:#FFFFFF;}
.sc-scope .tog-sub{display:block;font-family:'IBM Plex Mono',monospace;font-size:11px;color:#55595E;margin-top:6px;line-height:1.4;}
.sc-scope .tog-btn.active .tog-sub{color:rgba(255,255,255,0.85);}
.sc-scope .explain-box{padding:14px;background:#FFFFFF;border:2px solid #111111;margin:12px 0;font-family:'IBM Plex Mono',monospace;font-size:12px;line-height:1.7;color:#3A3A3A;}
.sc-scope .rec-badge{padding:12px 14px;background:#FCF1D6;border:2px solid #B8860B;margin:8px 0;font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:500;color:#6B4E00;line-height:1.6;}
.sc-scope .book-wrap{margin-top:24px;padding:20px;background:#FFFFFF;border:2px solid #111111;}
.sc-scope .book-kicker{font-family:'Archivo',sans-serif;font-size:15px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;color:#111111;margin-bottom:12px;}
.sc-scope .book-fields{display:flex;flex-direction:column;gap:10px;margin-bottom:16px;}
.sc-scope .book-btn{width:100%;padding:15px;min-height:44px;background:#E63312;color:#FFFFFF;border:none;font-family:'Archivo',sans-serif;font-size:14px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;transition:background 0.15s;clip-path:polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%);}
.sc-scope .book-btn:hover{background:#C52A0D;}
.sc-scope .book-btn:disabled{background:#9A9A94;cursor:not-allowed;}
.sc-scope .book-note{font-family:'IBM Plex Mono',monospace;font-size:11px;color:#55595E;margin-top:10px;line-height:1.6;}
.sc-scope .confirm-wrap{margin-top:24px;padding:20px;background:#E4F2E9;border:2px solid #1E7A47;}
.sc-scope .confirm-kicker{font-family:'Archivo',sans-serif;font-size:15px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;color:#1E7A47;margin-bottom:10px;}
.sc-scope .confirm-text{font-size:14px;line-height:1.65;color:#111111;margin-bottom:14px;}
.sc-scope .confirm-order{font-family:'IBM Plex Mono',monospace;font-size:13px;font-weight:500;color:#3A3A3A;}
.sc-scope .btnr{background:#111111;border:2px solid #111111;color:#FFFFFF;padding:10px 18px;min-height:44px;font-family:'Archivo',sans-serif;font-size:12px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;margin-top:16px;transition:all 0.15s;}
.sc-scope .btnr:hover{background:#E63312;border-color:#E63312;color:#FFFFFF;}
.sc-scope .pgft{max-width:680px;margin:0 auto;padding:18px 24px 32px;border-top:2px solid #111111;display:flex;justify-content:space-between;}
.sc-scope .pgft p{font-family:'IBM Plex Mono',monospace;font-size:12px;color:#55595E;}
.sc-scope .live-badge{display:inline-flex;align-items:center;gap:6px;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#FFFFFF;padding:4px 10px;border:2px solid rgba(255,255,255,0.4);background:none;}
.sc-scope .live-dot{width:6px;height:6px;border-radius:50%;background:#E63312;display:inline-block;animation:sc-pulse 2s infinite;}
@keyframes sc-pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
.sc-scope .modal-overlay{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(17,17,17,0.7);z-index:1000;overflow-y:auto;}
.sc-scope .modal-overlay.open{display:block;}
.sc-scope .modal{background:#FAFAF8;max-width:600px;margin:40px auto;padding:36px 32px;position:relative;border:2px solid #111111;}
.sc-scope .modal-close{position:absolute;top:16px;right:16px;background:#111111;border:none;color:#FFFFFF;font-family:'Archivo',sans-serif;font-size:11px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;padding:6px 12px;}
.sc-scope .modal-close:hover{background:#E63312;}
.sc-scope .modal-kicker{font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#E63312;margin-bottom:24px;}
.sc-scope .faq-item{padding:0 0 24px;border-bottom:1px solid #D9D9D4;margin-bottom:24px;}
.sc-scope .faq-item:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0;}
.sc-scope .faq-q{font-family:'Archivo',sans-serif;font-size:17px;font-weight:800;letter-spacing:-0.01em;color:#111111;margin-bottom:10px;}
.sc-scope .faq-a{font-size:14px;line-height:1.65;color:#3A3A3A;}
@media(max-width:560px){.sc-scope .g2,.sc-scope .g3{grid-template-columns:1fr;}.sc-scope .hiw-grid{grid-template-columns:1fr!important;}.sc-scope .hiw-step{border-right:none!important;border-bottom:1px solid #D9D9D4;padding:0 0 16px 0!important;margin-bottom:16px;}.sc-scope .mast{padding:14px 16px;}.sc-scope .mast-tag{display:none;}.sc-scope .wrap,.sc-scope .pgft{padding-left:16px;padding-right:16px;}.sc-scope .hero{padding:36px 16px 28px;}.sc-scope .hero h1{font-size:30px;}.sc-scope .nav-tabs{padding:0 16px;}.sc-scope .nav-tab{padding:12px 12px;font-size:10px;}.sc-scope .fi input,.sc-scope .fi select,.sc-scope .fi textarea{font-size:16px;}.sc-scope .crow{flex-wrap:wrap;gap:4px;}.sc-scope .cval{white-space:normal;text-align:right;width:100%;}.sc-scope .totrow{flex-wrap:wrap;gap:6px;}.sc-scope .tot-lbl{width:100%;}.sc-scope .tot-val{font-size:28px;}.sc-scope .pgft{flex-direction:column;gap:6px;}.sc-scope .modal{margin:0;min-height:100vh;padding:24px 16px;}}
`;

interface QuoteState {
  openFare: number;
  enclosedFare: number;
  selectedType: 'open' | 'enclosed';
  distanceMiles: number;
  origin: string;
  dest: string;
  year: string;
  make: string;
  model: string;
  isOperational: boolean;
  value: number;
  supabaseRowId?: any;
}

const FAQ_ITEMS: [string, string][] = [
  ['Why are you offering this?', "Shipping is the part of buying a car people ignore until after they win. Then the real cost shows up. We built this so you know the number before you commit, not after."],
  ['Who actually ships my car?', "RunBuggy handles the transport. We've used them ourselves. Price is competitive, they're reliable, and you can actually see what's going on with your car."],
  ['Do you make money from this?', "No — this isn't a profit center for us. We charge a small flat fee of $50 to cover our technology costs. It's included in the price you see. We're not marking up the RunBuggy rate. No broker markup, no commission games."],
  ['Do I need to enter my email or phone number to get a quote?', "No. You get a real quote instantly — no account, no email, no phone number. Most shipping tools hide pricing behind a form and then pass your details around. We don't."],
  ['Is this for US domestic shipping only?', "Yes. Door-to-door across the contiguous United States. If you're importing a car, use the Import Calculator — we built that first to solve the same problem globally."],
  ["What if a truck can't reach my location?", "Most shipments collect and deliver to your exact address. If your location has access restrictions — a narrow lane, steep hill, gated community — RunBuggy will contact you after booking to arrange the nearest accessible point. No extra cost in most cases."],
  ['What if my car needs special handling?', "For shipments that need extra coordination — strict schedules, collector or race cars, spare parts, or multi-stop routes — RunBuggy may route your order through their Reserve service. If that happens, their team will contact you directly to confirm details and any adjusted pricing before transport begins."],
  ['Do I pay here?', "No. You get a live quote and request the shipment. RunBuggy contacts you directly to confirm details and collect payment."],
  ['Is my car insured?', "Standard transit coverage is included. If you're moving something high-value, ask about additional coverage — don't assume the default is enough."],
  ['One more thing', "If a route or situation isn't a good fit for this, we'll say so. The goal is to give you a real number you can trust, not push you into a shipment."],
];

type Panel = 'form' | 'loading' | 'results';

export default function ShippingCalculator() {
  const [faqOpen, setFaqOpen] = useState(false);
  const [panel, setPanel] = useState<Panel>('form');
  const [err, setErr] = useState<string>('');

  // form fields
  const [origin, setOrigin] = useState('');
  const [dest, setDest] = useState('');
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [value, setValue] = useState('');
  const [operational, setOperational] = useState('yes');

  // quote state
  const [state, setState] = useState<QuoteState | null>(null);
  const [selectedType, setSelectedType] = useState<'open' | 'enclosed'>('open');

  // booking
  const [bookName, setBookName] = useState('');
  const [bookEmail, setBookEmail] = useState('');
  const [bookPhone, setBookPhone] = useState('');
  const [bookNotes, setBookNotes] = useState('');
  const [shipSubscribe, setShipSubscribe] = useState(true);
  const [booking, setBooking] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmOrder, setConfirmOrder] = useState('');

  // share
  const [shareVisible, setShareVisible] = useState(false);
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [shareConfirm, setShareConfirm] = useState('');
  const [shareConfirmOpacity, setShareConfirmOpacity] = useState(0);
  const shareLinkInputRef = useRef<HTMLInputElement>(null);

  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = 2026; y >= 1885; y--) arr.push(y);
    return arr;
  }, []);
  const makes = useMemo(() => Object.keys(CAR_MODELS).sort(), []);

  // model options derived from year+make (mirror updateModels)
  const { modelOptions, modelPlaceholder } = useMemo(() => {
    const yr = parseInt(year) || 0;
    const allMods = CAR_MODELS[make] || [];
    const filtered = yr ? allMods.filter((m) => yr >= m[1] && yr <= m[2]) : allMods;
    const mods = filtered.length > 0 ? filtered : allMods;
    const placeholder = make
      ? filtered.length > 0
        ? 'Select (' + filtered.length + ' match)'
        : 'Select model'
      : 'Select make first';
    return { modelOptions: make ? mods : [], modelPlaceholder: placeholder };
  }, [year, make]);

  // reset model when make changes and current model no longer valid
  useEffect(() => {
    if (model && !modelOptions.some((m) => m[0] === model)) {
      setModel('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelOptions]);

  // notifyParentResize interval
  useEffect(() => {
    const id = setInterval(() => {
      const h = document.documentElement.scrollHeight;
      window.parent.postMessage({ source: 'tdv-calculator', calculator: 'shipping', iframeHeight: h }, '*');
    }, 300);
    return () => clearInterval(id);
  }, []);

  // body overflow when modal open
  useEffect(() => {
    document.body.style.overflow = faqOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [faqOpen]);

  // load shared quote via ?c=token on mount
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const token = p.get('c');
    if (!token) return;
    setPanel('loading');
    (async () => {
      try {
        const r = await fetch(`${API_BASE}api/share?token=${token}`);
        const d = await r.json();
        const i = d.inputs;
        const o = d.outputs;
        const s: QuoteState = {
          openFare: o.openFare,
          enclosedFare: o.enclosedFare,
          selectedType: o.selectedType,
          distanceMiles: o.distanceMiles,
          origin: i.origin,
          dest: i.dest,
          year: i.year,
          make: i.make,
          model: i.model,
          isOperational: i.isOperational,
          value: i.value,
        };
        renderResults(s);
      } catch (e) {
        setPanel('form');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openFaq() { setFaqOpen(true); }
  function closeFaq() { setFaqOpen(false); }
  function closeFaqIfOutside(e: React.MouseEvent) {
    if (e.target === e.currentTarget) closeFaq();
  }

  async function fetchQuote(
    pickupAddress: string, dropoffAddress: string, yr: string, mk: string, mo: string,
    isOperational: boolean, isOverSized: boolean, enclosureType: string,
  ): Promise<any> {
    const res = await fetch(`${API_BASE}api/shipping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'quote', payload: { pickupAddress, dropoffAddress, year: yr, make: mk, model: mo, isOperational, isOverSized, enclosureType } }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Quote failed');
    return data;
  }

  function renderResults(s: QuoteState) {
    setState(s);
    setSelectedType(s.selectedType);
    // reset booking sub-state (mirror original DOM resets)
    setBookNotes('');
    setConfirmed(false);
    setBooking(false);
    setPanel('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.parent.postMessage({ scrollToTop: true }, '*');
    setShareVisible(true);
    const params = new URLSearchParams({
      o: s.origin, d: s.dest, y: s.year, mk: s.make, mo: s.model,
      op: s.isOperational ? '1' : '0', v: String(s.value || 0),
    });
    setShareLink(window.location.origin + window.location.pathname + '?' + params.toString());
  }

  async function getQuotes() {
    const o = origin.trim();
    const d = dest.trim();
    const modelVal = model;
    const val = parseFloat(value) || 0;
    const isOperational = operational === 'yes';
    if (!o || !d || !year || !make || !modelVal) { setErr('Please fill in all fields.'); return; }
    if (!/^\d{5}$/.test(o) || !/^\d{5}$/.test(d)) { setErr('Please enter valid 5-digit ZIP codes.'); return; }
    if (o === d) { setErr('Origin and destination ZIP codes must be different.'); return; }
    setErr('');
    setPanel('loading');
    try {
      const [openRes, enclosedRes] = await Promise.all([
        fetchQuote(o, d, year, make, modelVal, isOperational, false, 'OPEN'),
        fetchQuote(o, d, year, make, modelVal, isOperational, false, 'ENCLOSED'),
      ]);
      const s: QuoteState = {
        openFare: openRes.fare,
        enclosedFare: enclosedRes.fare,
        selectedType: val >= 50000 ? 'enclosed' : 'open',
        distanceMiles: openRes.distanceMiles || enclosedRes.distanceMiles,
        origin: o, dest: d, year, make, model: modelVal, isOperational, value: val,
        supabaseRowId: openRes._supabase_row_id || null,
      };
      renderResults(s);
    } catch (e: any) {
      setPanel('form');
      setErr(e.message || 'Could not get a quote right now. Please try again.');
    }
  }

  async function bookShipment() {
    if (!state) return;
    const name = bookName.trim();
    const email = bookEmail.trim();
    const phone = bookPhone.trim();
    const notes = bookNotes.trim();
    const subscribe = shipSubscribe;
    if (!name || !email || !phone) { setErr('Name, email and phone are all required to book.'); return; }
    if (!email.includes('@')) { setErr('Please enter a valid email address.'); return; }
    setErr('');
    setBooking(true);
    try {
      const res = await fetch(`${API_BASE}api/shipping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'book',
          payload: {
            pickupAddress: state.origin,
            dropoffAddress: state.dest,
            year: state.year,
            make: state.make,
            model: state.model,
            isOperational: state.isOperational,
            isOverSized: false,
            enclosureType: selectedType === 'enclosed' ? 'ENCLOSED' : 'OPEN',
            customerName: name,
            customerEmail: email,
            customerPhone: phone,
            customerNotes: notes,
            vehicleValue: state.value || 0,
            supabaseRowId: state.supabaseRowId || null,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed');
      setConfirmed(true);
      if (subscribe && email) {
        fetch(`${API_BASE}api/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }).catch(() => {});
      }
      if (data.orderId) setConfirmOrder('Reference: ' + data.orderId);
    } catch (e: any) {
      setBooking(false);
      setErr(e.message || 'Booking failed. Please try again.');
    }
  }

  async function shareQuote() {
    if (!state) return;
    if (shareSheetOpen) { setShareSheetOpen(false); return; }
    setShareConfirm('Saving...');
    setShareConfirmOpacity(1);
    const inputs = { origin: state.origin, dest: state.dest, year: state.year, make: state.make, model: state.model, isOperational: state.isOperational, value: state.value };
    const outputs = { openFare: state.openFare, enclosedFare: state.enclosedFare, selectedType: selectedType, distanceMiles: state.distanceMiles };
    try {
      const r = await fetch(`${API_BASE}api/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs, outputs }),
      });
      const d = await r.json();
      const url = window.location.origin + window.location.pathname + '?c=' + d.token;
      setShareLink(url);
      setShareSheetOpen(true);
      setShareConfirm('');
      setShareConfirmOpacity(0);
    } catch (e) {
      setShareConfirm('Could not generate link.');
      setTimeout(() => setShareConfirmOpacity(0), 3000);
    }
  }

  function copyShareLink() {
    const input = shareLinkInputRef.current;
    if (!input) return;
    input.select();
    try {
      navigator.clipboard.writeText(input.value).catch(() => document.execCommand('copy'));
    } catch (e) {
      document.execCommand('copy');
    }
    setShareConfirmOpacity(1);
    setTimeout(() => setShareConfirmOpacity(0), 2500);
  }

  function resetCalc() {
    setPanel('form');
    setErr('');
    setConfirmed(false);
    setBooking(false);
    window.scrollTo(0, 0);
    window.parent.postMessage({ scrollToTop: true }, '*');
  }

  function selectType(type: 'open' | 'enclosed') {
    setSelectedType(type);
  }

  const isOpen = selectedType === 'open';
  const fare = state ? (isOpen ? state.openFare : state.enclosedFare) : 0;

  const distDays = state && state.distanceMiles > 0
    ? (state.distanceMiles < 500 ? '1-2' : state.distanceMiles < 1500 ? '2-4' : '4-7')
    : '';

  const showRecBadge = !!(state && state.value >= 50000 && selectedType === 'open');

  const importCalcHref = API_BASE + 'import-calculator';

  return (
    <div className="sc-scope">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className={'modal-overlay' + (faqOpen ? ' open' : '')} id="faqModal" onClick={closeFaqIfOutside}>
        <div className="modal">
          <button className="modal-close" onClick={closeFaq}>Close</button>
          <div className="modal-kicker">How it works</div>
          {FAQ_ITEMS.map(([q, a], i) => (
            <div className="faq-item" key={i}>
              <div className="faq-q">{q}</div>
              <p className="faq-a">{a}</p>
            </div>
          ))}
        </div>
      </div>

      <header className="mast">
        <div className="mast-name">The Daily <em>Vroom</em></div>
        <div className="mast-tag">US Shipping Calculator</div>
        <button className="how-link" onClick={openFaq} style={{ fontSize: '11px', letterSpacing: '0.08em' }}>How does this work?</button>
        <div className="mast-sub" id="liveBadge">
          <span className="live-badge"><span className="live-dot"></span>Live Quotes</span>
        </div>
      </header>
      <nav className="nav-tabs">
        <a href={importCalcHref} className="nav-tab" target="_parent">Import Calculator</a>
        <span className="nav-tab active">Domestic Shipping</span>
      </nav>
      <section className="hero">
        <div className="hero-label">Door to Door</div>
        <h1>What does it cost to <em>ship</em> that car?</h1>
        <p className="hero-sub">Instant shipping quotes for US domestic car transport.<br />No email address required</p>
      </section>
      <div className="hrule"></div>
      <div className="wrap">
        {panel === 'form' && (
          <div id="formPanel">
            <div className="form-section">
              <div className="form-label">The Route</div>
              <div className="g2">
                <div className="fi"><label>From (ZIP Code)</label><input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="90210" maxLength={5} inputMode="numeric" /></div>
                <div className="fi"><label>To (ZIP Code)</label><input type="text" value={dest} onChange={(e) => setDest(e.target.value)} placeholder="10001" maxLength={5} inputMode="numeric" /></div>
              </div>
            </div>
            <div className="form-section">
              <div className="form-label">The Car</div>
              <div className="g3">
                <div className="fi">
                  <label>Year</label>
                  <select value={year} onChange={(e) => setYear(e.target.value)}>
                    <option value="">Year</option>
                    {years.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="fi">
                  <label>Make</label>
                  <select value={make} onChange={(e) => setMake(e.target.value)}>
                    <option value="">Make</option>
                    {makes.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="fi" id="modelField">
                  <label>Model</label>
                  <select value={model} onChange={(e) => setModel(e.target.value)}>
                    <option value="">{modelPlaceholder}</option>
                    {modelOptions.map((m) => <option key={m[0]} value={m[0]}>{m[0]}</option>)}
                  </select>
                </div>
              </div>
              <div className="g2 mt">
                <div className="fi">
                  <label>Vehicle Value (USD)</label>
                  <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="45000" min={0} />
                  <span className="fi-hint">Helps recommend open vs enclosed</span>
                </div>
                <div className="fi">
                  <label>Does it run?</label>
                  <select value={operational} onChange={(e) => setOperational(e.target.value)}>
                    <option value="yes">Yes, runs and drives</option>
                    <option value="no">No, non-operational</option>
                  </select>
                </div>
              </div>
            </div>
            {err && <div className="errtxt">{err}</div>}
            <button className="calc-btn" onClick={getQuotes}>Get Instant Shipping Quote</button>
            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', color: '#55595E', marginTop: '10px', lineHeight: 1.6, textAlign: 'center' }}>Most shipments collect and deliver to your exact location. For restricted access areas, RunBuggy will arrange the nearest accessible point with you directly.</p>
          </div>
        )}

        {panel === 'loading' && (
          <div id="loadingPanel">
            <div className="ldw"><div className="ldlbl">Getting your live quote&#8230;</div><div className="ldbar"></div></div>
          </div>
        )}

        {panel === 'results' && state && (
          <div id="resultsPanel">
            <div className="res-route">Live Shipping Quote</div>
            <div className="res-title">{state.year + ' ' + state.make + ' ' + state.model + ' \u2014 ' + state.origin + ' to ' + state.dest}</div>
            <div className="toggle-grid">
              <button className={'tog-btn' + (isOpen ? ' active' : '')} onClick={() => selectType('open')}>
                <span className={'tog-kicker' + (isOpen ? ' active' : '')}>Open Transport</span>
                <span className={'tog-price' + (isOpen ? ' active' : '')}>{'$' + state.openFare.toLocaleString()}</span>
                <span className="tog-sub">Standard carrier</span>
              </button>
              <button className={'tog-btn' + (!isOpen ? ' active' : '')} onClick={() => selectType('enclosed')}>
                <span className={'tog-kicker' + (!isOpen ? ' active' : '')}>Enclosed Transport</span>
                <span className={'tog-price' + (!isOpen ? ' active' : '')}>{'$' + state.enclosedFare.toLocaleString()}</span>
                <span className="tog-sub">Best for high-value, exotic, or freshly restored vehicles</span>
              </button>
            </div>
            <div className="explain-box">
              {isOpen
                ? 'Open transport is the industry standard and the most common way collector cars are shipped safely across the country.'
                : 'Enclosed transport gives your car full protection from weather, road debris and prying eyes. Recommended for high-value, classic, or low-clearance vehicles. Typically 40-90% more than open transport.'}
            </div>
            {showRecBadge && (
              <div className="rec-badge">
                {'For a $' + state.value.toLocaleString() + ' vehicle, enclosed transport is recommended. Add $' + (state.enclosedFare - state.openFare).toLocaleString() + ' for full protection.'}
              </div>
            )}
            <div id="costRows">
              {[
                { label: 'Door-to-Door Pickup', sub: 'Carrier collects from your location' },
                { label: 'Door-to-Door Delivery', sub: 'Carrier delivers to your destination' },
                { label: 'Basic Transit Insurance', sub: 'Included with shipment' },
              ].map((item, i) => (
                <div className="crow" key={i}>
                  <div className="clbl">{item.label}<span className="csub">{item.sub}</span></div>
                  <div className="cval" style={{ color: '#1E7A47', fontWeight: 600 }}>Included</div>
                </div>
              ))}
            </div>
            <div className="totrow">
              <span className="tot-lbl">Live Shipping Quote</span>
              <span className="tot-val">{'$' + fare.toLocaleString()}</span>
            </div>
            <p className="price-note">Live market pricing based on current carrier availability. May vary for oversized or non-running vehicles.</p>
            <div className="dist-line">
              {state.distanceMiles > 0 ? 'Approx. ' + Math.round(state.distanceMiles).toLocaleString() + ' miles \u2014 transit typically ' + distDays + ' days' : ''}
            </div>
            {shareVisible && (
              <div id="shareBlock" style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <button className="share-btn" onClick={shareQuote} style={{ background: 'none', border: '2px solid #E63312', color: '#E63312', padding: '9px 16px', minHeight: '44px', fontFamily: "'Archivo',sans-serif", fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>Share This Quote</button>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', fontWeight: 600, color: '#1E7A47', opacity: shareConfirmOpacity, transition: 'opacity 0.3s' }}>{shareConfirm || 'Copied!'}</span>
                </div>
                {shareSheetOpen && (
                  <div id="shareSheet">
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input ref={shareLinkInputRef} type="text" readOnly value={shareLink} style={{ flex: 1, background: '#FFFFFF', border: '2px solid #111111', fontFamily: "'IBM Plex Mono',monospace", fontSize: '13px', padding: '9px 10px', color: '#111111', outline: 'none' }} />
                      <button onClick={copyShareLink} style={{ background: '#111111', border: '2px solid #111111', color: '#FFFFFF', padding: '9px 14px', minHeight: '44px', fontFamily: "'Archivo',sans-serif", fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>Copy</button>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div style={{ marginTop: '28px', padding: '20px 24px', border: '2px solid #111111', background: '#FFFFFF' }}>
              <div style={{ fontFamily: "'Archivo',sans-serif", fontSize: '13px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#111111', marginBottom: '20px' }}>How it works</div>
              <div className="hiw-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 0 }}>
                <div className="hiw-step" style={{ padding: '0 16px 0 0', borderRight: '1px solid #D9D9D4' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '0', background: '#F0F0EC', border: '2px solid #111111', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="1" /><line x1="8" y1="8" x2="16" y2="8" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="8" y1="16" x2="12" y2="16" /></svg>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '7px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '0', background: '#E63312', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', fontWeight: 500, color: '#FFFFFF', flexShrink: 0 }}>1</div>
                    <div style={{ fontFamily: "'Archivo',sans-serif", fontSize: '14px', fontWeight: 800, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.01em' }}>Get Your Quote</div>
                  </div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: 400, color: '#3A3A3A', lineHeight: 1.6 }}>Enter your route and vehicle details</div>
                </div>
                <div className="hiw-step" style={{ padding: '0 16px', borderRight: '1px solid #D9D9D4' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '0', background: '#F0F0EC', border: '2px solid #111111', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '7px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '0', background: '#E63312', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', fontWeight: 500, color: '#FFFFFF', flexShrink: 0 }}>2</div>
                    <div style={{ fontFamily: "'Archivo',sans-serif", fontSize: '14px', fontWeight: 800, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.01em' }}>Submit Request</div>
                  </div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: 400, color: '#3A3A3A', lineHeight: 1.6 }}>Send your shipment request directly to RunBuggy</div>
                </div>
                <div className="hiw-step" style={{ padding: '0 16px', borderRight: '1px solid #D9D9D4' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '0', background: '#F0F0EC', border: '2px solid #111111', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '7px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '0', background: '#E63312', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', fontWeight: 500, color: '#FFFFFF', flexShrink: 0 }}>3</div>
                    <div style={{ fontFamily: "'Archivo',sans-serif", fontSize: '14px', fontWeight: 800, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.01em' }}>RunBuggy Confirms</div>
                  </div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: 400, color: '#3A3A3A', lineHeight: 1.6 }}>Pickup scheduling and payment handled directly</div>
                </div>
                <div className="hiw-step" style={{ padding: '0 0 0 16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '0', background: '#F0F0EC', border: '2px solid #111111', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '7px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '0', background: '#E63312', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', fontWeight: 500, color: '#FFFFFF', flexShrink: 0 }}>4</div>
                    <div style={{ fontFamily: "'Archivo',sans-serif", fontSize: '14px', fontWeight: 800, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.01em' }}>Your Car Ships</div>
                  </div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: 400, color: '#3A3A3A', lineHeight: 1.6 }}>Track updates throughout transit</div>
                </div>
              </div>
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '2px solid #111111', textAlign: 'center' }}>
                <svg width="28" height="28" viewBox="0 0 40 40" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px', transform: 'scaleX(-1)' }}>
                  <path d="M8 32 Q14 10 32 8" stroke="#E63312" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M30 4 L32 8 L28 10" stroke="#E63312" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontFamily: "'Archivo',sans-serif", fontSize: '16px', fontWeight: 800, color: '#111111', letterSpacing: '0.01em', textTransform: 'uppercase' }}>One real quote. One trusted partner. Zero spam. Total clarity.</span>
              </div>
            </div>

            {!confirmed && (
              <div className="book-wrap" id="bookWrap">
                <div className="book-kicker">Book this shipment</div>
                <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', color: '#55595E', marginBottom: '14px' }}>Transport powered by RunBuggy</p>
                <div className="book-fields">
                  <div className="fi"><label>Full Name</label><input type="text" value={bookName} onChange={(e) => setBookName(e.target.value)} placeholder="Jane Smith" /></div>
                  <div className="fi"><label>Email</label><input type="email" value={bookEmail} onChange={(e) => setBookEmail(e.target.value)} placeholder="jane@example.com" /></div>
                  <div className="fi"><label>Phone</label><input type="tel" value={bookPhone} onChange={(e) => setBookPhone(e.target.value)} placeholder="+1 555 000 0000" /></div>
                  <div className="fi"><label>Anything else we should know? (optional)</label><textarea value={bookNotes} onChange={(e) => setBookNotes(e.target.value)} placeholder="Spare parts, extra wheels, access restrictions, anything relevant to pickup or delivery"></textarea></div>
                </div>
                <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', color: '#55595E', lineHeight: 1.6, marginBottom: '12px' }}>RunBuggy will contact you to confirm details and arrange payment. Nothing is charged here. No payment is collected on The Daily Vroom.</p>
                <button className="book-btn" disabled={booking} onClick={bookShipment}>{booking ? 'Booking...' : 'Request Shipment'}</button>
                <div style={{ marginTop: '16px', padding: '14px', background: '#F0F0EC', border: '2px solid #111111' }}>
                  <div style={{ fontFamily: "'Archivo',sans-serif", fontSize: '12px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#111111', marginBottom: '10px' }}>What happens next</div>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '12px', color: '#3A3A3A', lineHeight: 1.8 }}>
                    1. RunBuggy reviews your shipment request and confirms carrier availability<br />
                    2. They contact you directly to arrange pickup and delivery details<br />
                    3. Payment is handled securely by RunBuggy<br />
                    4. You receive updates throughout transit
                  </div>
                </div>
                <div style={{ marginTop: '16px', padding: '14px', background: '#FCF1D6', border: '2px solid #B8860B' }}>
                  <div style={{ fontFamily: "'Archivo',sans-serif", fontSize: '12px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B4E00', marginBottom: '8px' }}>Reserve Service Note</div>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '12px', color: '#3A3A3A', lineHeight: 1.8 }}>Not every move fits a standard mold. Your order may be routed to RunBuggy Reserve if it involves strict scheduling, specialty or collector vehicles, spare parts, whole-truck reservations, or multi-stop routes. If that happens, fares may be adjusted and their Reserve team will contact you directly to confirm details.</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '14px' }}>
                  <input type="checkbox" id="shipSubscribe" checked={shipSubscribe} onChange={(e) => setShipSubscribe(e.target.checked)} style={{ width: '18px', height: '18px', flexShrink: 0, accentColor: '#E63312', marginTop: '2px', cursor: 'pointer' }} />
                  <label htmlFor="shipSubscribe" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#55595E', cursor: 'pointer', lineHeight: 1.6 }}>Occasional collector car shipping, import, and auction updates from The Daily Vroom</label>
                </div>
              </div>
            )}

            {confirmed && (
              <div className="confirm-wrap" id="confirmWrap">
                <div className="confirm-kicker">Booking Confirmed</div>
                <p className="confirm-text">Your shipment has been created. RunBuggy will be in touch shortly to confirm pickup details and arrange payment.</p>
                <div className="confirm-order">{confirmOrder}</div>
              </div>
            )}

            {err && <div className="errtxt">{err}</div>}
            <button className="btnr" onClick={resetCalc}>New Estimate</button>
          </div>
        )}
      </div>

      <footer className="pgft">
        <p>&copy; TDV — thedailyvroom.com</p>
        <p><a href="mailto:news@thedailyvroom.com" style={{ color: '#55595E', textDecoration: 'none' }}>Questions? news@thedailyvroom.com</a></p>
      </footer>

      <div style={{ textAlign: 'center', padding: '16px', fontSize: '12px', fontFamily: "'IBM Plex Mono',monospace", color: '#55595E' }}>Built by <a href="https://feridanis.com" target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>Feridanis</a></div>
    </div>
  );
}
