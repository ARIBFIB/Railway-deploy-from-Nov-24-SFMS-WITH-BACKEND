import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import loadingGif from "../assets/loading/200.gif";
import { customerService } from '../services/customerService';
import { itemService } from '../services/itemService';

import { 
  Search, 
  Plus, 
  Printer, 
  Send,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  Copy,
  ShieldCheck,
  Lock,
  MessageCircle,
  ArrowRight,
  AlignJustify,
} from 'lucide-react';

const QuotesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [quoteFilter, setQuoteFilter] = useState('all');
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
  const [extendedSearchOpen, setExtendedSearchOpen] = useState(false);
  const [basicDetailsExpanded, setBasicDetailsExpanded] = useState(true);
  const [quoteDetailsExpanded, setQuoteDetailsExpanded] = useState(true);
  const [quoteContentExpanded, setQuoteContentExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateQuoteForm, setShowCreateQuoteForm] = useState(false);
  const [isCreatingQuote, setIsCreatingQuote] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [activeColumn, setActiveColumn] = useState<number | string | null>(null);
  const [loadingColumn, setLoadingColumn] = useState<number | string | null>(null);

  
  // State for Create Quote form
  const [customer, setCustomer] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [customerOptions, setCustomerOptions] = useState<any[]>([]);
  const [filteredCustomerOptions, setFilteredCustomerOptions] = useState<any[]>([]);
  const [quoteDate, setQuoteDate] = useState('');
  const [vatIncl, setVatIncl] = useState('yes');
  const [validTo, setValidTo] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [terms, setTerms] = useState('0 days'); // Default to 0 days
  const [showTermsDropdown, setShowTermsDropdown] = useState(false);
  const [ourReference, setOurReference] = useState('');
  const [yourReference, setYourReference] = useState('');
  const [showYourReferenceDropdown, setShowYourReferenceDropdown] = useState(false);
  const [yourReferenceOptions, setYourReferenceOptions] = useState<string[]>([]);
  const [filteredYourReferenceOptions, setFilteredYourReferenceOptions] = useState<string[]>([]);
  const [priceList, setPriceList] = useState('');
  const [currency, setCurrency] = useState('');
  const [vat, setVat] = useState('');
  const [typeOfVat, setTypeOfVat] = useState('');
  const [orderRef, setOrderRef] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [postcode, setPostcode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [invoiceAddress, setInvoiceAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryPostcode, setDeliveryPostcode] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryCountry, setDeliveryCountry] = useState('');
  const [showDeliveryCountryDropdown, setShowDeliveryCountryDropdown] = useState(false);
  const [deliveryTerms, setDeliveryTerms] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [quoteText, setQuoteText] = useState('');
  const [charges, setCharges] = useState('');
  const [invoiceCharge, setInvoiceCharge] = useState('');
  const [language, setLanguage] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  
  // Countries data
  const countriesData = [
    { code: 'AF', swedish: 'Afghanistan', english: 'Afghanistan' },
    { code: 'AX', swedish: 'Åland', english: 'Åland Islands' },
    { code: 'AL', swedish: 'Albanien', english: 'Albania' },
    { code: 'DZ', swedish: 'Algeriet', english: 'Algeria' },
    { code: 'AS', swedish: 'Amerikanska Samoa', english: 'American Samoa' },
    { code: 'VI', swedish: 'Amerikanska Jungfruöarna', english: 'U.S. Virgin Islands' },
    { code: 'AD', swedish: 'Andorra', english: 'Andorra' },
    { code: 'AO', swedish: 'Angola', english: 'Angola' },
    { code: 'AI', swedish: 'Anguilla', english: 'Anguilla' },
    { code: 'AQ', swedish: 'Antarktis', english: 'Antarctica' },
    { code: 'AG', swedish: 'Antigua och Barbuda', english: 'Antigua and Barbuda' },
    { code: 'AR', swedish: 'Argentina', english: 'Argentina' },
    { code: 'AM', swedish: 'Armenien', english: 'Armenia' },
    { code: 'AW', swedish: 'Aruba', english: 'Aruba' },
    { code: 'AC', swedish: 'Ascension', english: 'Ascension Island' },
    { code: 'AU', swedish: 'Australien', english: 'Australia' },
    { code: 'AZ', swedish: 'Azerbajdzjan', english: 'Azerbaijan' },
    { code: 'BS', swedish: 'Bahamas', english: 'Bahamas' },
    { code: 'BH', swedish: 'Bahrain', english: 'Bahrain' },
    { code: 'BD', swedish: 'Bangladesh', english: 'Bangladesh' },
    { code: 'BB', swedish: 'Barbados', english: 'Barbados' },
    { code: 'BE', swedish: 'Belgien', english: 'Belgium' },
    { code: 'BZ', swedish: 'Belize', english: 'Belize' },
    { code: 'BJ', swedish: 'Benin', english: 'Benin' },
    { code: 'BM', swedish: 'Bermuda', english: 'Bermuda' },
    { code: 'BT', swedish: 'Bhutan', english: 'Bhutan' },
    { code: 'BO', swedish: 'Bolivia', english: 'Bolivia' },
    { code: 'BA', swedish: 'Bosnien och Hercegovina', english: 'Bosnia and Herzegovina' },
    { code: 'BW', swedish: 'Botswana', english: 'Botswana' },
    { code: 'BV', swedish: 'Bouvetön', english: 'Bouvet Island' },
    { code: 'BR', swedish: 'Brasilien', english: 'Brazil' },
    { code: 'VG', swedish: 'Brittiska Jungfruöarna', english: 'British Virgin Islands' },
    { code: 'IO', swedish: 'Brittiska territoriet i Indiska oceanen', english: 'British Indian Ocean Territory' },
    { code: 'BN', swedish: 'Brunei', english: 'Brunei' },
    { code: 'BG', swedish: 'Bulgarien', english: 'Bulgaria' },
    { code: 'BF', swedish: 'Burkina Faso', english: 'Burkina Faso' },
    { code: 'BI', swedish: 'Burundi', english: 'Burundi' },
    { code: 'KY', swedish: 'Caymanöarna', english: 'Cayman Islands' },
    { code: 'CF', swedish: 'Centralafrikanska republiken', english: 'Central African Republic' },
    { code: 'EA', swedish: 'Ceuta och Melilla', english: 'Ceuta and Melilla' },
    { code: 'CL', swedish: 'Chile', english: 'Chile' },
    { code: 'CN', swedish: 'Kina', english: 'China' },
    { code: 'CX', swedish: 'Julön', english: 'Christmas Island' },
    { code: 'CC', swedish: 'Kokosöarna', english: 'Cocos (Keeling) Islands' },
    { code: 'CO', swedish: 'Colombia', english: 'Colombia' },
    { code: 'KM', swedish: 'Komorerna', english: 'Comoros' },
    { code: 'CG', swedish: 'Kongo-Brazzaville', english: 'Congo - Brazzaville' },
    { code: 'CD', swedish: 'Kongo-Kinshasa', english: 'Congo - Kinshasa' },
    { code: 'CK', swedish: 'Cooköarna', english: 'Cook Islands' },
    { code: 'CR', swedish: 'Costa Rica', english: 'Costa Rica' },
    { code: 'CU', swedish: 'Kuba', english: 'Cuba' },
    { code: 'CW', swedish: 'Curaçao', english: 'Curaçao' },
    { code: 'CY', swedish: 'Cypern', english: 'Cyprus' },
    { code: 'DK', swedish: 'Danmark', english: 'Denmark' },
    { code: 'DJ', swedish: 'Djibouti', english: 'Djibouti' },
    { code: 'DM', swedish: 'Dominica', english: 'Dominica' },
    { code: 'DO', swedish: 'Dominikanska republiken', english: 'Dominican Republic' },
    { code: 'EC', swedish: 'Ecuador', english: 'Ecuador' },
    { code: 'EG', swedish: 'Egypten', english: 'Egypt' },
    { code: 'GQ', swedish: 'Ekvatorialguinea', english: 'Equatorial Guinea' },
    { code: 'SV', swedish: 'El Salvador', english: 'El Salvador' },
    { code: 'CI', swedish: 'Elfenbenskusten', english: 'Côte d’Ivoire' },
    { code: 'ER', swedish: 'Eritrea', english: 'Eritrea' },
    { code: 'EE', swedish: 'Estland', english: 'Estonia' },
    { code: 'SZ', swedish: 'Eswatini', english: 'Eswatini' },
    { code: 'ET', swedish: 'Etiopien', english: 'Ethiopia' },
    { code: 'FK', swedish: 'Falklandsöarna', english: 'Falkland Islands' },
    { code: 'FO', swedish: 'Färöarna', english: 'Faroe Islands' },
    { code: 'FJ', swedish: 'Fiji', english: 'Fiji' },
    { code: 'PH', swedish: 'Filippinerna', english: 'Philippines' },
    { code: 'FI', swedish: 'Finland', english: 'Finland' },
    { code: 'FR', swedish: 'Frankrike', english: 'France' },
    { code: 'GF', swedish: 'Franska Guyana', english: 'French Guiana' },
    { code: 'PF', swedish: 'Franska Polynesien', english: 'French Polynesia' },
    { code: 'TF', swedish: 'Franska sydterritorierna', english: 'French Southern Territories' },
    { code: 'GA', swedish: 'Gabon', english: 'Gabon' },
    { code: 'GM', swedish: 'Gambia', english: 'Gambia' },
    { code: 'GE', swedish: 'Georgien', english: 'Georgia' },
    { code: 'GH', swedish: 'Ghana', english: 'Ghana' },
    { code: 'GI', swedish: 'Gibraltar', english: 'Gibraltar' },
    { code: 'GR', swedish: 'Grekland', english: 'Greece' },
    { code: 'GD', swedish: 'Grenada', english: 'Grenada' },
    { code: 'GL', swedish: 'Grönland', english: 'Greenland' },
    { code: 'GP', swedish: 'Guadeloupe', english: 'Guadeloupe' },
    { code: 'GU', swedish: 'Guam', english: 'Guam' },
    { code: 'GT', swedish: 'Guatemala', english: 'Guatemala' },
    { code: 'GG', swedish: 'Guernsey', english: 'Guernsey' },
    { code: 'GN', swedish: 'Guinea', english: 'Guinea' },
    { code: 'GW', swedish: 'Guinea-Bissau', english: 'Guinea-Bissau' },
    { code: 'GY', swedish: 'Guyana', english: 'Guyana' },
    { code: 'HT', swedish: 'Haiti', english: 'Haiti' },
    { code: 'HM', swedish: 'Heardön och McDonaldöarna', english: 'Heard & McDonald Islands' },
    { code: 'HN', swedish: 'Honduras', english: 'Honduras' },
    { code: 'HK', swedish: 'Hongkong', english: 'Hong Kong SAR China' },
    { code: 'IN', swedish: 'Indien', english: 'India' },
    { code: 'ID', swedish: 'Indonesien', english: 'Indonesia' },
    { code: 'IQ', swedish: 'Irak', english: 'Iraq' },
    { code: 'IR', swedish: 'Iran', english: 'Iran' },
    { code: 'IE', swedish: 'Irland', english: 'Ireland' },
    { code: 'IS', swedish: 'Island', english: 'Iceland' },
    { code: 'IM', swedish: 'Isle of Man', english: 'Isle of Man' },
    { code: 'IL', swedish: 'Israel', english: 'Israel' },
    { code: 'IT', swedish: 'Italien', english: 'Italy' },
    { code: 'JM', swedish: 'Jamaica', english: 'Jamaica' },
    { code: 'JP', swedish: 'Japan', english: 'Japan' },
    { code: 'YE', swedish: 'Jemen', english: 'Yemen' },
    { code: 'JE', swedish: 'Jersey', english: 'Jersey' },
    { code: 'JO', swedish: 'Jordanien', english: 'Jordan' },
    { code: 'CX', swedish: 'Julön', english: 'Christmas Island' },
    { code: 'KH', swedish: 'Kambodja', english: 'Cambodia' },
    { code: 'CM', swedish: 'Kamerun', english: 'Cameroon' },
    { code: 'CA', swedish: 'Kanada', english: 'Canada' },
    { code: 'IC', swedish: 'Kanarieöarna', english: 'Canary Islands' },
    { code: 'CV', swedish: 'Kap Verde', english: 'Cape Verde' },
    { code: 'KZ', swedish: 'Kazakstan', english: 'Kazakhstan' },
    { code: 'KE', swedish: 'Kenya', english: 'Kenya' },
    { code: 'KG', swedish: 'Kirgizistan', english: 'Kyrgyzstan' },
    { code: 'KI', swedish: 'Kiribati', english: 'Kiribati' },
    { code: 'KN', swedish: 'Saint Kitts och Nevis', english: 'St. Kitts & Nevis' },
    { code: 'KR', swedish: 'Sydkorea', english: 'South Korea' },
    { code: 'XK', swedish: 'Kosovo', english: 'Kosovo' },
    { code: 'KW', swedish: 'Kuwait', english: 'Kuwait' },
    { code: 'LA', swedish: 'Laos', english: 'Laos' },
    { code: 'LS', swedish: 'Lesotho', english: 'Lesotho' },
    { code: 'LV', swedish: 'Lettland', english: 'Latvia' },
    { code: 'LB', swedish: 'Libanon', english: 'Lebanon' },
    { code: 'LR', swedish: 'Liberia', english: 'Liberia' },
    { code: 'LY', swedish: 'Libyen', english: 'Libya' },
    { code: 'LI', swedish: 'Liechtenstein', english: 'Liechtenstein' },
    { code: 'LT', swedish: 'Litauen', english: 'Lithuania' },
    { code: 'LU', swedish: 'Luxemburg', english: 'Luxembourg' },
    { code: 'MO', swedish: 'Macao', english: 'Macao SAR China' },
    { code: 'MG', swedish: 'Madagaskar', english: 'Madagascar' },
    { code: 'MW', swedish: 'Malawi', english: 'Malawi' },
    { code: 'MY', swedish: 'Malaysia', english: 'Malaysia' },
    { code: 'MV', swedish: 'Maldiverna', english: 'Maldives' },
    { code: 'ML', swedish: 'Mali', english: 'Mali' },
    { code: 'MT', swedish: 'Malta', english: 'Malta' },
    { code: 'MA', swedish: 'Marocko', english: 'Morocco' },
    { code: 'MH', swedish: 'Marshallöarna', english: 'Marshall Islands' },
    { code: 'MQ', swedish: 'Martinique', english: 'Martinique' },
    { code: 'MR', swedish: 'Mauretanien', english: 'Mauritania' },
    { code: 'MU', swedish: 'Mauritius', english: 'Mauritius' },
    { code: 'YT', swedish: 'Mayotte', english: 'Mayotte' },
    { code: 'MX', swedish: 'Mexiko', english: 'Mexico' },
    { code: 'FM', swedish: 'Mikronesiska federationen', english: 'Micronesia' },
    { code: 'MD', swedish: 'Moldavien', english: 'Moldova' },
    { code: 'MC', swedish: 'Monaco', english: 'Monaco' },
    { code: 'MN', swedish: 'Mongoliet', english: 'Mongolia' },
    { code: 'ME', swedish: 'Montenegro', english: 'Montenegro' },
    { code: 'MS', swedish: 'Montserrat', english: 'Montserrat' },
    { code: 'MZ', swedish: 'Moçambique', english: 'Mozambique' },
    { code: 'MM', swedish: 'Myanmar (Burma)', english: 'Myanmar (Burma)' },
    { code: 'NA', swedish: 'Namibia', english: 'Namibia' },
    { code: 'NR', swedish: 'Nauru', english: 'Nauru' },
    { code: 'NL', swedish: 'Nederländerna', english: 'Netherlands' },
    { code: 'NP', swedish: 'Nepal', english: 'Nepal' },
    { code: 'NI', swedish: 'Nicaragua', english: 'Nicaragua' },
    { code: 'NE', swedish: 'Niger', english: 'Niger' },
    { code: 'NG', swedish: 'Nigeria', english: 'Nigeria' },
    { code: 'NU', swedish: 'Niue', english: 'Niue' },
    { code: 'NF', swedish: 'Norfolkön', english: 'Norfolk Island' },
    { code: 'NO', swedish: 'Norge', english: 'Norway' },
    { code: 'NC', swedish: 'Nya Kaledonien', english: 'New Caledonia' },
    { code: 'NZ', swedish: 'Nya Zeeland', english: 'New Zealand' },
    { code: 'OM', swedish: 'Oman', english: 'Oman' },
    { code: 'PK', swedish: 'Pakistan', english: 'Pakistan' },
    { code: 'PW', swedish: 'Palau', english: 'Palau' },
    { code: 'PS', swedish: 'Palestinska territorierna', english: 'Palestinian Territories' },
    { code: 'PA', swedish: 'Panama', english: 'Panama' },
    { code: 'PG', swedish: 'Papua Nya Guinea', english: 'Papua New Guinea' },
    { code: 'PY', swedish: 'Paraguay', english: 'Paraguay' },
    { code: 'PE', swedish: 'Peru', english: 'Peru' },
    { code: 'PN', swedish: 'Pitcairnöarna', english: 'Pitcairn Islands' },
    { code: 'PL', swedish: 'Polen', english: 'Poland' },
    { code: 'PT', swedish: 'Portugal', english: 'Portugal' },
    { code: 'PR', swedish: 'Puerto Rico', english: 'Puerto Rico' },
    { code: 'QA', swedish: 'Qatar', english: 'Qatar' },
    { code: 'RE', swedish: 'Réunion', english: 'Réunion' },
    { code: 'RO', swedish: 'Rumänien', english: 'Romania' },
    { code: 'RW', swedish: 'Rwanda', english: 'Rwanda' },
    { code: 'RU', swedish: 'Ryssland', english: 'Russia' },
    { code: 'BL', swedish: 'S:t Barthélemy', english: 'St. Barthélemy' },
    { code: 'SH', swedish: 'S:t Helena', english: 'St. Helena' },
    { code: 'LC', swedish: 'S:t Lucia', english: 'St. Lucia' },
    { code: 'MF', swedish: 'S:t Martin', english: 'St. Martin' },
    { code: 'PM', swedish: 'S:t Pierre och Miquelon', english: 'St. Pierre & Miquelon' },
    { code: 'VC', swedish: 'S:t Vincent och Grenadinerna', english: 'St. Vincent & Grenadines' },
    { code: 'SB', swedish: 'Salomonöarna', english: 'Solomon Islands' },
    { code: 'WS', swedish: 'Samoa', english: 'Samoa' },
    { code: 'SM', swedish: 'San Marino', english: 'San Marino' },
    { code: 'ST', swedish: 'São Tomé och Príncipe', english: 'São Tomé & Príncipe' },
    { code: 'SA', swedish: 'Saudiarabien', english: 'Saudi Arabia' },
    { code: 'CH', swedish: 'Schweiz', english: 'Switzerland' },
    { code: 'SN', swedish: 'Senegal', english: 'Senegal' },
    { code: 'RS', swedish: 'Serbien', english: 'Serbia' },
    { code: 'SC', swedish: 'Seychellerna', english: 'Seychelles' },
    { code: 'SL', swedish: 'Sierra Leone', english: 'Sierra Leone' },
    { code: 'SG', swedish: 'Singapore', english: 'Singapore' },
    { code: 'SX', swedish: 'Sint Maarten', english: 'Sint Maarten' },
    { code: 'SK', swedish: 'Slovakien', english: 'Slovakia' },
    { code: 'SI', swedish: 'Slovenien', english: 'Slovenia' },
    { code: 'SO', swedish: 'Somalia', english: 'Somalia' },
    { code: 'ES', swedish: 'Spanien', english: 'Spain' },
    { code: 'LK', swedish: 'Sri Lanka', english: 'Sri Lanka' },
    { code: 'GB', swedish: 'Storbritannien', english: 'United Kingdom' },
    { code: 'SD', swedish: 'Sudan', english: 'Sudan' },
    { code: 'SR', swedish: 'Surinam', english: 'Suriname' },
    { code: 'SJ', swedish: 'Svalbard och Jan Mayen', english: 'Svalbard & Jan Mayen' },
    { code: 'SE', swedish: 'Sverige', english: 'Sweden' },
    { code: 'SZ', swedish: 'Eswatini', english: 'Eswatini' },
    { code: 'SY', swedish: 'Syrien', english: 'Syria' },
    { code: 'TJ', swedish: 'Tadzjikistan', english: 'Tajikistan' },
    { code: 'TW', swedish: 'Taiwan', english: 'Taiwan' },
    { code: 'TZ', swedish: 'Tanzania', english: 'Tanzania' },
    { code: 'TD', swedish: 'Tchad', english: 'Chad' },
    { code: 'TH', swedish: 'Thailand', english: 'Thailand' },
    { code: 'TL', swedish: 'Östtimor', english: 'Timor-Leste' },
    { code: 'TG', swedish: 'Togo', english: 'Togo' },
    { code: 'TK', swedish: 'Tokelau', english: 'Tokelau' },
    { code: 'TO', swedish: 'Tonga', english: 'Tonga' },
    { code: 'TT', swedish: 'Trinidad och Tobago', english: 'Trinidad & Tobago' },
    { code: 'TA', swedish: 'Tristan da Cunha', english: 'Tristan da Cunha' },
    { code: 'TN', swedish: 'Tunisien', english: 'Tunisia' },
    { code: 'TR', swedish: 'Turkiet', english: 'Turkey' },
    { code: 'TM', swedish: 'Turkmenistan', english: 'Turkmenistan' },
    { code: 'TC', swedish: 'Turks- och Caicosöarna', english: 'Turks & Caicos Islands' },
    { code: 'TV', swedish: 'Tuvalu', english: 'Tuvalu' },
    { code: 'DE', swedish: 'Tyskland', english: 'Germany' },
    { code: 'UG', swedish: 'Uganda', english: 'Uganda' },
    { code: 'UA', swedish: 'Ukraina', english: 'Ukraine' },
    { code: 'HU', swedish: 'Ungern', english: 'Hungary' },
    { code: 'UY', swedish: 'Uruguay', english: 'Uruguay' },
    { code: 'US', swedish: 'USA', english: 'United States' },
    { code: 'UM', swedish: 'USA:s yttre öar', english: 'U.S. Outlying Islands' },
    { code: 'UZ', swedish: 'Uzbekistan', english: 'Uzbekistan' },
    { code: 'VU', swedish: 'Vanuatu', english: 'Vanuatu' },
    { code: 'VA', swedish: 'Vatikanstaten', english: 'Vatican City' },
    { code: 'VE', swedish: 'Venezuela', english: 'Venezuela' },
    { code: 'AE', swedish: 'Förenade Arabemiraten', english: 'United Arab Emirates' },
    { code: 'VN', swedish: 'Vietnam', english: 'Vietnam' },
    { code: 'WF', swedish: 'Wallis- och Futunaöarna', english: 'Wallis & Futuna' },
    { code: 'YE', swedish: 'Jemen', english: 'Yemen' },
    { code: 'ZM', swedish: 'Zambia', english: 'Zambia' },
    { code: 'ZW', swedish: 'Zimbabwe', english: 'Zimbabwe' },
  ];
  
  const [lineItems, setLineItems] = useState([
    { id: 1, itemNo: '', name: '', quantity: '1.00', unit: 'pcs', pricePerUnit: '', discount: '', total: '0.00', vat: '25%', account: '', cmr: '100%' },
    { id: 2, itemNo: '', name: '', quantity: '1.00', unit: 'pcs', pricePerUnit: '', discount: '', total: '0.00', vat: '25%', account: '', cmr: '100%' },
    { id: 3, itemNo: '', name: '', quantity: '1.00', unit: 'pcs', pricePerUnit: '', discount: '', total: '0.00', vat: '25%', account: '', cmr: '100%' }
  ]);

  // Helper function to calculate summary values
  const calculateSummaryValues = () => {
    const net = lineItems.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const pricePerUnit = parseFloat(item.pricePerUnit) || 0;
      const discount = parseFloat(item.discount) || 0;
      const total = quantity * pricePerUnit;
      const discountedTotal = total - (total * (discount / 100));
      return sum + discountedTotal;
    }, 0);
    
    const totalExclVat = lineItems.reduce((sum, item) => {
      const total = parseFloat(item.total) || 0;
      return sum + total;
    }, 0);
    
    const vatAmount = lineItems.reduce((sum, item) => {
      const total = parseFloat(item.total) || 0;
      const vatRate = parseFloat(item.vat) || 0;
      const vatValue = total * (vatRate / 100);
      return sum + vatValue;
    }, 0);
    
    const gross = totalExclVat + vatAmount;
    
    // Add shipping charge and invoice charge to the toPay amount
    const shippingCharge = parseFloat(charges) || 0;
    const invoiceChargeValue = parseFloat(invoiceCharge) || 0;
    const toPay = gross + shippingCharge + invoiceChargeValue;
    
    return {
      net: net.toFixed(2),
      gross: gross.toFixed(2),
      totalExclVat: totalExclVat.toFixed(2),
      vatAmount: vatAmount.toFixed(2),
      toPay: toPay.toFixed(2)
    };
  };
  
  const summaryValues = calculateSummaryValues();
  // Define type for errors
  type FormErrors = {
    customer?: string;
    quoteDate?: string;
    validTo?: string;
    lineItems?: string;
  };
  
  // Validation state
  const [errors, setErrors] = useState<FormErrors>({});

  const handleColumnClick = (index: number | string) => {
  setLoadingColumn(index);
  setActiveColumn(null);

  setTimeout(() => {
    setLoadingColumn(null);
    setActiveColumn(index);
  }, 500);
};


const toggleRow = (rowId: number) => {
  setSelectedRows((prev: number[]) =>
    prev.includes(rowId)
      ? prev.filter((r) => r !== rowId)
      : [...prev, rowId]
  );
};

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      const foundationId = userData.foundationId || userData.foundation_id || '12345678-1234-1234-1234-123456789012';
      
      const customers = await customerService.getCustomers(foundationId);
      
      // Transform the data to match the format needed for the dropdown
      const transformedCustomers = customers.map((cust: any) => ({
        id: cust.id,
        customerId: cust.customer_number,
        name: cust.name,
        city: cust.customer_addresses?.[0]?.city || '',
        orgPersonNumber: cust.corporate_personal_id,
      }));
      
      setCustomerOptions(transformedCustomers);
      setFilteredCustomerOptions(transformedCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchItems();
  }, []);

  // Fetch items
  const fetchItems = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      const foundationId = userData.foundationId || userData.foundation_id || '12345678-1234-1234-1234-123456789012';
      
      const { data: items, error } = await itemService.getItems(foundationId);
      
      if (error) {
        console.error('Error fetching items:', error);
        return;
      }
      
      // Transform the data to match the format needed for the dropdown
      const transformedItems = items?.map((item: any) => ({
        id: item.id,
        item_number: item.item_number,
        name: item.name,
        unit: item.unit,
        price: item.cost_calculation,
        vat: item.vat,
        account: item.sale_account,
      })) || [];
      
      setItems(transformedItems);
      setFilteredItems(transformedItems);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showCustomerDropdown && !target.closest('.customer-dropdown-container')) {
        setShowCustomerDropdown(false);
      }
      if (showCountryDropdown && !target.closest('.country-dropdown-container')) {
        setShowCountryDropdown(false);
      }
      if (showDeliveryCountryDropdown && !target.closest('.delivery-country-dropdown-container')) {
        setShowDeliveryCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCustomerDropdown, showCountryDropdown, showDeliveryCountryDropdown]);

  // Handle customer selection from dropdown
  const handleCustomerSelect = (selectedCustomer: any) => {
    setCustomer(selectedCustomer.customerId);
    setCustomerName(selectedCustomer.name);
    setShowCustomerDropdown(false);
  };

  // Handle input change to filter customers
  const handleCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomer(value);
    
    if (value) {
      const filtered = customerOptions.filter(option =>
        option.name.toLowerCase().includes(value.toLowerCase()) ||
        option.customerId.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCustomerOptions(filtered);
      setShowCustomerDropdown(true);
    } else {
      setFilteredCustomerOptions(customerOptions);
      setShowCustomerDropdown(false);
    }
  };

  // Payment terms options
  const paymentTermsOptions = [
    '0 days',
    '10 days',
    '15 days',
    '20 days',
    '30 days',
    'Direct debit',
    'Cash',
    'Cash on delivery'
  ];

  // Handle payment terms selection
  const handleTermsSelect = (selectedTerm: string) => {
    setTerms(selectedTerm);
    setShowTermsDropdown(false);
  };

  // Handle click outside for payment terms dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showTermsDropdown && !target.closest('.payment-terms-dropdown')) {
        setShowTermsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTermsDropdown]);

  // Initialize your reference options (this could come from an API or local storage)
  useEffect(() => {
    // For now, using sample data - in a real app, this would come from an API or local storage
    const sampleOptions = [
      'John Doe',
      'Jane Smith',
      'Robert Johnson',
      'Emily Davis'
    ];
    setYourReferenceOptions(sampleOptions);
    setFilteredYourReferenceOptions(sampleOptions);
  }, []);

  // Handle your reference selection
  const handleYourReferenceSelect = (selectedRef: string) => {
    setYourReference(selectedRef);
    setShowYourReferenceDropdown(false);
  };

  // Handle your reference input change to filter options
  const handleYourReferenceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setYourReference(value);
    
    if (value) {
      const filtered = yourReferenceOptions.filter(option =>
        option.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredYourReferenceOptions(filtered);
      setShowYourReferenceDropdown(true);
    } else {
      setFilteredYourReferenceOptions(yourReferenceOptions);
      setShowYourReferenceDropdown(true); // Show dropdown with all options when empty
    }
  };

  // Handle click outside for your reference dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showYourReferenceDropdown && !target.closest('.your-reference-dropdown')) {
        setShowYourReferenceDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showYourReferenceDropdown]);

  // Validation function
  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!customer.trim()) {
      newErrors.customer = 'Customer is required';
    }
    
    if (!quoteDate) {
      newErrors.quoteDate = 'Quote date is required';
    }
    
    if (!validTo) {
      newErrors.validTo = 'Valid to date is required';
    }
    
    if (lineItems.some(item => !item.name.trim())) {
      newErrors.lineItems = 'All line items must have a name';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Here you would typically submit the form data to your API
    console.log('Submitting quote:', {
      customer,
      quoteDate,
      validTo,
      deliveryDate,
      terms,
      ourReference,
      yourReference,
      priceList,
      currency,
      vat,
      typeOfVat,
      orderRef,
      customerName,
      address,
      postcode,
      city,
      country,
      phone,
      email,
      invoiceAddress,
      deliveryAddress,
      deliveryPostcode,
      deliveryCity,
      deliveryCountry,
      deliveryTerms,
      deliveryMethod,
      quoteText,
      charges,
      language,
      lineItems
    });
    
    // Show success message or redirect
    alert('Quote created successfully!');
    
    // Reset form and return to list view
    setShowCreateQuoteForm(false);
    setIsCreatingQuote(false);
  };

  // Handle adding a new line item
  const addLineItem = () => {
    const newItem = {
      id: Date.now(),
      itemNo: '',
      name: '',
      quantity: '1.00',
      unit: 'pcs',
      pricePerUnit: '',
      discount: '',
      total: '0.00',
      vat: '25%',
      account: '',
      cmr: '100%'
    };
    setLineItems([...lineItems, newItem]);
  };

  // Handle removing a line item
  const removeLineItem = (id: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  // Handle updating a line item
  const updateLineItem = (id: number, field: string, value: string) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Calculate total when quantity, price per unit, or discount changes
        if (field === 'quantity' || field === 'pricePerUnit' || field === 'discount') {
          const quantity = parseFloat(updatedItem.quantity) || 0;
          const pricePerUnit = parseFloat(updatedItem.pricePerUnit) || 0;
          const discount = parseFloat(updatedItem.discount) || 0;
          
          // Calculate base total
          let total = quantity * pricePerUnit;
          
          // Apply discount if present
          if (discount > 0) {
            total = total - (total * (discount / 100));
          }
          
          updatedItem.total = total.toFixed(2);
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  // Handle item selection from dropdown
  const handleItemSelect = (id: number, itemId: string) => {
    const selectedItem = items.find(item => item.id === itemId);
    if (selectedItem) {
      setLineItems(lineItems.map(item => {
        if (item.id === id) {
          // Calculate total based on price and default quantity of 1
          const price = parseFloat(selectedItem.price) || 0;
          const quantity = 1.00; // Default quantity
          const total = price * quantity;
          
          return {
            ...item,
            itemNo: selectedItem.item_number, // Show item number in Item No. column
            name: selectedItem.name,
            quantity: quantity.toFixed(2), // Default quantity to 1.00
            unit: selectedItem.unit || 'pcs',
            pricePerUnit: selectedItem.price?.toString() || '',
            vat: selectedItem.vat || '25%',
            account: selectedItem.account || '',
            cmr: '100%', // Set CMR to 100% when item is selected
            total: total.toFixed(2) // Calculate total based on price and default quantity
          };
        }
        return item;
      }));
    }
  };

  const getQuoteFilterColor = (filter: string) => {
    switch (filter) {
      case 'all': 
        return quoteFilter === 'all' 
          ? 'border border-[#DADADA] bg-[#E9E9E9] text-[#1F1F1F]' 
          : 'border border-[#DADADA] bg-white text-[#1F1F1F]';
      case 'active': 
        return quoteFilter === 'active' 
          ? 'border border-[#DADADA] relative text-[#1F1F1F] overflow-hidden' 
          : 'border border-[#DADADA] bg-white text-[#1F1F1F]';
      case 'due': 
        return quoteFilter === 'due' 
          ? 'border-l-4 border-[#EF5350] bg-[#F9B6B6] text-[#1F1F1F]' 
          : 'border border-[#DADADA] bg-white text-[#1F1F1F]';
      case 'order/invoices-created': 
        return quoteFilter === 'order/invoices-created' 
          ? 'border-l-4 border-[#A5D6A7] bg-[#D4F3B8] text-[#1F1F1F]' 
          : 'border border-[#DADADA] bg-white text-[#1F1F1F]';
      case 'voided': 
        return quoteFilter === 'voided' 
          ? 'border-l-4 border-[#BDBDBD] bg-[#E7E7E7] text-[#1F1F1F]' 
          : 'border border-[#DADADA] bg-white text-[#1F1F1F]';
      case 'failed': 
        return quoteFilter === 'failed' 
          ? 'border-l-4 border-[#9E9E9E] bg-[#E9E9E9] text-[#1F1F1F]' 
          : 'border border-[#DADADA] bg-white text-[#1F1F1F]';
      default: 
        return 'border border-[#DADADA] bg-white text-[#1F1F1F]';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-l-4 border-[#66BB6A] bg-[#F1F8F4]';
      case 'due': return 'border-l-4 border-[#EF5350] bg-[#FDECEC]';
      case 'order-created': return 'border-l-4 border-[#A5D6A7] bg-[#F3FBF5]';
      case 'voided': return 'border-l-4 border-[#BDBDBD] bg-[#F5F5F5]';
      case 'failed': return 'border-l-4 border-[#9E9E9E] bg-[#EEEEEE]';
      default: return 'bg-white';
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen">
      <div className="space-y-6 flex-grow">
        {/* Top Navigation Bar */}
        {isCreatingQuote && !showCreateQuoteForm ? (
          // Loading state during transition
          <div className="flex flex-col items-center justify-center h-64">
            <img
              src={loadingGif}
              alt="loading"
              className="w-10 h-10"
            />
            {/* <p className="mt-4 text-[#BDBDBD]">Loading new quote form...</p> */}
          </div>
        ) : showCreateQuoteForm ? (
          // Create Quote Form View
          <div className="bg-[#FAFAFA] border border-[#E0E0E0] rounded-lg p-6">
            {/* Header bar */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#E0E0E0]">
              <h2 className="text-xl font-bold text-[#333333]">QUOTE 1*</h2>
              <div className="flex space-x-3">
                <button 
                  className="bg-[#8E8E8E] hover:bg-[#7A7A7A] text-white font-bold rounded-full h-9 px-4 text-sm"
                  onClick={handleSubmit}>
                  <span className="flex items-center">
                    <Plus size={16} className="mr-2" />
                    Create quote
                  </span>
                </button>
                <button 
                  className="bg-[#FFC107] hover:bg-[#E6B800] text-[#111827] font-bold rounded-full h-9 px-4 text-sm"
                  onClick={async () => {
                    setIsLoading(true);
                    await new Promise(resolve => setTimeout(resolve, 500));
                    setShowCreateQuoteForm(false);
                    setIsCreatingQuote(false);
                    setIsLoading(false);
                  }}
                >
                  <span className="flex items-center">
                    {isLoading ? (
                      <img
                        src={loadingGif}
                        alt="loading"
                        className="w-4 h-4 mr-2"
                      />
                    ) : (
                      <AlignJustify size={16} className="mr-2 text-[#111827]" />
                    )}
                    {isLoading ? 'Loading...' : 'Show list'}
                  </span>
                </button>
              </div>
            </div>
            
            {/* Customer & Date inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="customer-dropdown-container">
                <label className="block text-sm font-medium text-[#555555] mb-1">Customer</label>
                <div className="relative">
                  <input 
                    type="text" 
                    className={`w-full h-9 border ${errors.customer ? 'border-red-500' : 'border-[#DADADA]'} rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]`} 
                    placeholder="Select customer"
                    value={customer}
                    onChange={handleCustomerInputChange}
                    onFocus={() => {
                      if (customerOptions.length > 0) {
                        setFilteredCustomerOptions(customerOptions);
                        setShowCustomerDropdown(true);
                      }
                    }}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={16} className="text-[#999999]" />
                  </div>
                  
                  {/* Dropdown */}
                  {showCustomerDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-[#DADADA] rounded shadow-lg max-h-80 overflow-hidden">
                      <div className="relative">
                        <div className="max-h-60 overflow-y-auto">
                          <table className="w-full">
                            <thead className="bg-[#F5F5F5] sticky top-0 z-10">
                              <tr>
                                <th className="text-left py-2 px-4 text-xs font-semibold text-[#333333] border-b border-[#DADADA] w-1/4">Customer no.</th>
                                <th className="text-left py-2 px-4 text-xs font-semibold text-[#333333] border-b border-[#DADADA] w-1/4">Name</th>
                                <th className="text-left py-2 px-4 text-xs font-semibold text-[#333333] border-b border-[#DADADA] w-1/4">City</th>
                                <th className="text-left py-2 px-4 text-xs font-semibold text-[#333333] border-b border-[#DADADA] w-1/4">CIN / PIN</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredCustomerOptions.map((cust) => (
                                <tr 
                                  key={cust.id}
                                  className="hover:bg-[#FAFAFA] border-b border-[#E0E0E0] cursor-pointer"
                                  onClick={() => handleCustomerSelect(cust)}
                                >
                                  <td className="py-2 px-4 text-sm text-[#444444] w-1/4 break-words">{cust.customerId}</td>
                                  <td className="py-2 px-4 text-sm text-[#444444] w-1/4 break-words">{cust.name}</td>
                                  <td className="py-2 px-4 text-sm text-[#444444] w-1/4 break-words">{cust.city}</td>
                                  <td className="py-2 px-4 text-sm text-[#444444] w-1/4 break-words">{cust.orgPersonNumber}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {filteredCustomerOptions.length === 0 && (
                          <div className="py-3 px-4 text-sm text-[#999999] text-center">No customers found</div>
                        )}
                        
                        {/* Create New Customer Button */}
                        <button 
                          className="absolute top-2 right-2 bg-[#FFC200] hover:bg-[#E0A800] text-black p-2 rounded w-8 h-8 flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/customers');
                          }}
                          onMouseEnter={(e) => {
                            const tooltip = document.createElement('div');
                            tooltip.className = 'customer-create-tooltip absolute bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-20';
                            tooltip.textContent = 'Create new';
                            tooltip.style.left = 'auto';
                            tooltip.style.right = '100%';
                            tooltip.style.top = '50%';
                            tooltip.style.transform = 'translateY(-50%)';
                            e.currentTarget.parentElement?.appendChild(tooltip);
                          }}
                          onMouseLeave={(e) => {
                            const tooltip = e.currentTarget.parentElement?.querySelector('.customer-create-tooltip');
                            if (tooltip) {
                              e.currentTarget.parentElement?.removeChild(tooltip);
                            }
                          }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {errors.customer && <p className="text-red-500 text-xs mt-1">{errors.customer}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">Quote date</label>
                <div className="relative">
                  <input 
                    type="date" 
                    className={`w-full h-9 border ${errors.quoteDate ? 'border-red-500' : 'border-[#D1D1D1]'} rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]`} 
                    placeholder=""
                    value={quoteDate}
                    onChange={(e) => setQuoteDate(e.target.value)}
                  />
                </div>
                {errors.quoteDate && <p className="text-red-500 text-xs mt-1">{errors.quoteDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">Valid to</label>
                <div className="relative">
                  <input 
                    type="date" 
                    className={`w-full h-9 border ${errors.validTo ? 'border-red-500' : 'border-[#D1D1D1]'} rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]`} 
                    placeholder=""
                    value={validTo}
                    onChange={(e) => setValidTo(e.target.value)}
                  />
                </div>
                {errors.validTo && <p className="text-red-500 text-xs mt-1">{errors.validTo}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">Delivery date</label>
                <div className="relative">
                  <input 
                    type="date" 
                    className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]" 
                    placeholder=""
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* Quote Details Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4 cursor-pointer">
                <h3 className="text-lg font-bold text-[#333333] flex items-center">
                  <span className="text-[#2E7D32] mr-2">▶</span>
                  Quote details
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="payment-terms-dropdown">
                  <label className="block text-sm font-medium text-[#555555] mb-1">Payment terms</label>
                  <div className="relative">
                    <button
                      type="button"
                      className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF] flex items-center justify-between"
                      onClick={() => setShowTermsDropdown(!showTermsDropdown)}
                    >
                      <span>{terms}</span>
                      <ChevronDown size={16} className="text-[#999999]" />
                    </button>
                    
                    {/* Dropdown */}
                    {showTermsDropdown && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-[#DADADA] rounded shadow-lg max-h-60 overflow-y-auto">
                        {paymentTermsOptions.map((term) => (
                          <div
                            key={term}
                            className="py-2 px-4 text-sm text-[#4A4A4A] hover:bg-[#F5F5F5] cursor-pointer"
                            onClick={() => handleTermsSelect(term)}
                          >
                            {term}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">Our reference</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]" 
                    placeholder=""
                    value={ourReference}
                    onChange={(e) => setOurReference(e.target.value)}
                  />
                </div>
                <div className="your-reference-dropdown">
                  <label className="block text-sm font-medium text-[#555555] mb-1">Your reference</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF] pr-8" 
                      placeholder="first name, last name"
                      value={yourReference}
                      onChange={handleYourReferenceInputChange}
                      onFocus={() => {
                        setFilteredYourReferenceOptions(yourReferenceOptions);
                        setShowYourReferenceDropdown(true);
                      }}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <ChevronDown size={16} className="text-[#999999]" />
                    </div>
                    
                    {/* Dropdown */}
                    {showYourReferenceDropdown && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-[#DADADA] rounded shadow-lg max-h-60 overflow-y-auto">
                        {filteredYourReferenceOptions.length > 0 ? (
                          filteredYourReferenceOptions.map((ref, index) => (
                            <div
                              key={index}
                              className="py-2 px-4 text-sm text-[#4A4A4A] hover:bg-[#F5F5F5] cursor-pointer"
                              onClick={() => handleYourReferenceSelect(ref)}
                            >
                              {ref}
                            </div>
                          ))
                        ) : (
                          <div className="py-2 px-4 text-sm text-[#999999] text-center">No inputs found</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">Price list</label>
                  <select 
                    className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]"
                    value={priceList}
                    onChange={(e) => setPriceList(e.target.value)}>
                    <option>Select</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">Currency</label>
                  <select 
                    className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}>
                    <option value="">Select</option>
                    <option value="SEK">SEK</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">VAT</label>
                  <select 
                    className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]"
                    value={vat}
                    onChange={(e) => setVat(e.target.value)}>
                    <option>Select</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">Type of VAT</label>
                  <div className="flex">
                    <select 
                      className="w-full h-9 border border-[#D1D1D1] rounded-l px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]"
                      value={typeOfVat}
                      onChange={(e) => setTypeOfVat(e.target.value)}>
                      <option>Select</option>
                      <option>SEE</option>
                      <option>SE reverse charge</option>
                      <option>EU reverse charge</option>
                      <option>Subject to EU VAT</option>
                      <option>Export</option>
                    </select>
                    <div className="bg-[#EDEDED] border border-l-0 border-[#D1D1D1] rounded-r px-2 flex items-center">
                      <span className="text-[#007BFF] text-sm">?</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">Order ref.</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]" 
                    placeholder=""
                    value={orderRef}
                    onChange={(e) => setOrderRef(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* Customer Details Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4 cursor-pointer">
                <h3 className="text-lg font-bold text-[#333333] flex items-center">
                  <span className="text-[#2E7D32] mr-2">▶</span>
                  Customer details
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">Name</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#DADADA] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#2E7D32]" 
                    placeholder=""
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-[#555555] mb-1">Invoice address</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#DADADA] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#2E7D32]" 
                    placeholder=""
                    value={invoiceAddress}
                    onChange={(e) => setInvoiceAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">Postcode</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#DADADA] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#2E7D32]" 
                    placeholder=""
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">City</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#DADADA] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#2E7D32]" 
                    placeholder=""
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-[#555555] mb-1">Phone</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#DADADA] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#2E7D32]" 
                    placeholder=""
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">CIN</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#DADADA] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#2E7D32]" 
                    placeholder=""
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="country-dropdown-container">
                  <label className="block text-sm font-medium text-[#555555] mb-1">Country</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      className="w-full h-9 border border-[#DADADA] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#2E7D32]" 
                      placeholder="Select country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      onFocus={() => setShowCountryDropdown(true)}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <ChevronDown size={16} className="text-[#999999]" />
                    </div>
                    
                    {/* Country dropdown table */}
                    {showCountryDropdown && (
                      <div className="absolute z-30 w-full mt-1 bg-white border border-[#DADADA] rounded shadow-lg max-h-80 overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-[#F5F5F5] sticky top-0 z-10">
                            <tr>
                              <th className="text-left py-2 px-4 text-xs font-semibold text-[#333333] border-b border-[#DADADA] w-1/4">Country Code</th>
                              <th className="text-left py-2 px-4 text-xs font-semibold text-[#333333] border-b border-[#DADADA] w-1/4">Swedish</th>
                              <th className="text-left py-2 px-4 text-xs font-semibold text-[#333333] border-b border-[#DADADA] w-1/4">English</th>
                            </tr>
                          </thead>
                          <tbody className="max-h-60 overflow-y-auto block">
                            {countriesData.map((countryObj, index) => (
                              <tr 
                                key={index}
                                className="hover:bg-[#FAFAFA] border-b border-[#E0E0E0] cursor-pointer"
                                onClick={() => {
                                  setCountry(`${countryObj.swedish} (${countryObj.code})`); // Display Swedish name with code
                                  setShowCountryDropdown(false);
                                }}
                              >
                                <td className="py-2 px-4 text-sm text-[#444444] w-1/4 break-words">{countryObj.code}</td>
                                <td className="py-2 px-4 text-sm text-[#444444] w-1/4 break-words">{countryObj.swedish}</td>
                                <td className="py-2 px-4 text-sm text-[#444444] w-1/4 break-words">{countryObj.english}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-[#555555] mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full h-9 border border-[#DADADA] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#2E7D32]" 
                    placeholder=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-[#555555] mb-1">Invoice address 2</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#DADADA] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#2E7D32]" 
                    placeholder=""
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* Delivery Information Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4 cursor-pointer">
                <h3 className="text-lg font-bold text-[#333333] flex items-center">
                  <span className="text-[#2E7D32] mr-2">▶</span>
                  Delivery information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">Delivery address</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]" 
                    placeholder=""
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">Postcode</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]" 
                    placeholder=""
                    value={deliveryPostcode}
                    onChange={(e) => setDeliveryPostcode(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">City</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]" 
                    placeholder=""
                    value={deliveryCity}
                    onChange={(e) => setDeliveryCity(e.target.value)}
                  />
                </div>
                <div className="delivery-country-dropdown-container">
                  <label className="block text-sm font-medium text-[#555555] mb-1">Country</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]" 
                      placeholder="Select country"
                      value={deliveryCountry}
                      onChange={(e) => setDeliveryCountry(e.target.value)}
                      onFocus={() => setShowDeliveryCountryDropdown(true)}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <ChevronDown size={16} className="text-[#999999]" />
                    </div>
                    
                    {/* Country dropdown table */}
                    {showDeliveryCountryDropdown && (
                      <div className="absolute z-30 w-full mt-1 bg-white border border-[#DADADA] rounded shadow-lg max-h-80 overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-[#F5F5F5] sticky top-0 z-10">
                            <tr>
                              <th className="text-left py-2 px-4 text-xs font-semibold text-[#333333] border-b border-[#DADADA] w-1/4">Country Code</th>
                              <th className="text-left py-2 px-4 text-xs font-semibold text-[#333333] border-b border-[#DADADA] w-1/4">Swedish</th>
                              <th className="text-left py-2 px-4 text-xs font-semibold text-[#333333] border-b border-[#DADADA] w-1/4">English</th>
                            </tr>
                          </thead>
                          <tbody className="max-h-60 overflow-y-auto block">
                            {countriesData.map((countryObj, index) => (
                              <tr 
                                key={index}
                                className="hover:bg-[#FAFAFA] border-b border-[#E0E0E0] cursor-pointer"
                                onClick={() => {
                                  setDeliveryCountry(`${countryObj.swedish} (${countryObj.code})`); // Display Swedish name with code
                                  setShowDeliveryCountryDropdown(false);
                                }}
                              >
                                <td className="py-2 px-4 text-sm text-[#444444] w-1/4 break-words">{countryObj.code}</td>
                                <td className="py-2 px-4 text-sm text-[#444444] w-1/4 break-words">{countryObj.swedish}</td>
                                <td className="py-2 px-4 text-sm text-[#444444] w-1/4 break-words">{countryObj.english}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">Delivery terms</label>
                  <select 
                    className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]"
                    value={deliveryTerms}
                    onChange={(e) => setDeliveryTerms(e.target.value)}>
                    <option>Select</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">Delivery method</label>
                  <select 
                    className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]"
                    value={deliveryMethod}
                    onChange={(e) => setDeliveryMethod(e.target.value)}>
                    <option>Select</option>
                    <option value="Downloaded">Downloaded</option>
                    <option value="Mail">Mail</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Quick Action Toolbar */}
            <div className="flex items-center space-x-6 pt-4 border-t border-[#E0E0E0] py-4">
              <button className="text-[#6F6F6F] hover:text-[#333333] flex flex-col items-center">
                <Copy size={18} />
                <span className="text-xs mt-1">Copy</span>
              </button>
              <button className="text-[#6F6F6F] hover:text-[#333333] flex flex-col items-center">
                <ShieldCheck size={18} />
                <span className="text-xs mt-1">Credit report</span>
              </button>
              <button className="text-[#6F6F6F] hover:text-[#333333] flex flex-col items-center">
                <Lock size={18} />
                <span className="text-xs mt-1">Mark as not complete</span>
              </button>
              <button className="text-[#6F6F6F] hover:text-[#333333] flex flex-col items-center">
                <MessageCircle size={18} />
                <span className="text-xs mt-1">Comment</span>
              </button>
              <button className="text-[#6F6F6F] hover:text-[#333333] flex flex-col items-center">
                <Printer size={18} />
                <span className="text-xs mt-1">Preview</span>
              </button>
            </div>
            
            {/* Line Items Table */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                {/* <h3 className="text-lg font-bold text-[#333333]">LINE ITEMS</h3> */}
              </div>
              
              <div className="border border-[#E0E0E0] rounded-lg min-h-[180px] bg-white shadow-sm overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="h-8 px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] uppercase tracking-[0.5px] text-left border-b border-[#DADADA]">Item No.</th>
                      <th className="h-8 px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] uppercase tracking-[0.5px] text-left border-b border-[#DADADA]">Name</th>
                      <th className="h-8 px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] uppercase tracking-[0.5px] text-center border-b border-[#DADADA]">Quantity</th>
                      <th className="h-8 px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] uppercase tracking-[0.5px] text-center border-b border-[#DADADA]">Unit</th>
                      <th className="h-8 px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] uppercase tracking-[0.5px] text-right border-b border-[#DADADA]">Price per unit</th>
                      <th className="h-8 px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] uppercase tracking-[0.5px] text-right border-b border-[#DADADA]">Discount</th>
                      <th className="h-8 px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] uppercase tracking-[0.5px] text-right border-b border-[#DADADA]">Total</th>
                      <th className="h-8 px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] uppercase tracking-[0.5px] text-center border-b border-[#DADADA]">VAT</th>
                      <th className="h-8 px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] uppercase tracking-[0.5px] text-left border-b border-[#DADADA]">Account</th>
                      <th className="h-8 px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] uppercase tracking-[0.5px] text-center border-b border-[#DADADA]">CMR %</th>
                      <th className="h-8 px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] uppercase tracking-[0.5px] text-center border-b border-[#DADADA]"></th>
                      <th className="h-8 px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] uppercase tracking-[0.5px] text-center border-b border-[#DADADA]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item) => (
                      <tr key={item.id} className="bg-white border-b border-[#E5E5E5] hover:bg-[#F8F9FB]">
                        <td className="px-2 py-1 text-[11px] text-[#2E2E2E] align-middle">
                          <div className="relative">
                            <input
                              type="text"
                              className="w-full h-6 border border-[#D0D0D0] rounded-sm px-1 text-xs text-[#2E2E2E] bg-white text-left focus:outline-none focus:border-[#2563EB] pr-6"
                              value={item.itemNo}
                              onChange={(e) => updateLineItem(item.id, 'itemNo', e.target.value)}
                              placeholder="Item No."
                            />
                            <select
                              className="absolute right-1 top-1/2 transform -translate-y-1/2 w-5 h-5 text-xs border-0 bg-transparent appearance-none text-[#9CA3AF] cursor-pointer"
                              value=""
                              onChange={(e) => handleItemSelect(item.id, e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value="" disabled>Select</option>
                              {items.map((itemOption) => (
                                <option key={itemOption.id} value={itemOption.id}>
                                  {itemOption.item_number} - {itemOption.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="px-2 py-1 text-[11px] text-[#2E2E2E] align-middle">
                          <input 
                            type="text" 
                            className="w-full h-6 border border-[#D0D0D0] rounded-sm px-1 text-xs text-[#2E2E2E] bg-white text-left focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]" 
                            placeholder=""
                            value={item.name}
                            onChange={(e) => updateLineItem(item.id, 'name', e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1 text-[11px] text-[#2E2E2E] text-center align-middle">
                          <input 
                            type="number" 
                            className="w-full h-6 border border-[#D0D0D0] rounded-sm px-1 text-xs text-[#2E2E2E] bg-white text-center focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]" 
                            placeholder="0"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, 'quantity', e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1 text-[11px] text-[#2E2E2E] text-center align-middle">
                          <input 
                            type="text" 
                            className="w-full h-6 border border-[#D0D0D0] rounded-sm px-1 text-xs text-[#2E2E2E] bg-white text-center focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]" 
                            placeholder="1"
                            value={item.unit}
                            onChange={(e) => updateLineItem(item.id, 'unit', e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1 text-[11px] text-[#2E2E2E] text-right align-middle">
                          <input 
                            type="number" 
                            className="w-full h-6 border border-[#D0D0D0] rounded-sm px-1 text-xs text-[#2E2E2E] bg-white text-right focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]" 
                            placeholder="0.00"
                            value={item.pricePerUnit}
                            onChange={(e) => updateLineItem(item.id, 'pricePerUnit', e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1 text-[11px] text-[#2E2E2E] text-right align-middle">
                          <input 
                            type="number" 
                            className="w-full h-6 border border-[#D0D0D0] rounded-sm px-1 text-xs text-[#2E2E2E] bg-white text-right focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]" 
                            placeholder="0.00"
                            value={item.discount}
                            onChange={(e) => updateLineItem(item.id, 'discount', e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1 text-[11px] text-[#2E2E2E] text-right font-medium align-middle">
                          <input 
                            type="text" 
                            className="w-full h-6 border border-[#D0D0D0] rounded-sm px-1 text-xs text-[#2E2E2E] bg-white text-right focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]" 
                            placeholder="0.00"
                            value={item.total}
                            readOnly
                          />
                        </td>
                        <td className="px-2 py-1 text-[11px] text-[#2E2E2E] text-center align-middle">
                          <input 
                            type="text" 
                            className="w-full h-6 border border-[#D0D0D0] rounded-sm px-1 text-xs text-[#2E2E2E] bg-white text-center focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]" 
                            placeholder="VAT"
                            value={item.vat}
                            onChange={(e) => updateLineItem(item.id, 'vat', e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1 text-[11px] text-[#2E2E2E] align-middle">
                          <input 
                            type="text" 
                            className="w-full h-6 border border-[#D0D0D0] rounded-sm px-1 text-xs text-[#2E2E2E] bg-white text-left focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]" 
                            placeholder="Account"
                            value={item.account}
                            onChange={(e) => updateLineItem(item.id, 'account', e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1 text-[11px] text-[#2E2E2E] text-center align-middle">
                          <input 
                            type="number" 
                            className="w-12 h-6 border border-[#D0D0D0] rounded-sm px-1 text-xs text-[#2E2E2E] bg-white text-center focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]" 
                            placeholder="0"
                            value={item.cmr}
                            onChange={(e) => updateLineItem(item.id, 'cmr', e.target.value)}
                          />
                        </td>

                        <td className="px-2 py-1 text-center align-middle">
                          <button 
                            className="text-[#6B7280] hover:text-[#DC2626]"
                            onClick={() => removeLineItem(item.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            </svg>
                          </button>
                        </td>
                        <td className="px-2 py-1 text-center align-middle">
                          <div className="cursor-grab text-[#6B7280] hover:text-[#2563EB]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="9" cy="12" r="1"></circle>
                              <circle cx="9" cy="5" r="1"></circle>
                              <circle cx="9" cy="19" r="1"></circle>
                              <circle cx="15" cy="12" r="1"></circle>
                              <circle cx="15" cy="5" r="1"></circle>
                              <circle cx="15" cy="19" r="1"></circle>
                            </svg>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#FAFAFA] border-t-2 border-[#BDBDBD]">
                      <td className="px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] text-right" colSpan={2}>Total Quantity:</td>
                      <td className="px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] text-center">
                        {lineItems.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0).toFixed(2)}
                      </td>
                      <td className="px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] text-right" colSpan={8}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            {/* Quote text + Charges + Language options */}
            <div className="mt-6 flex items-start justify-between gap-6">
              <div className="w-[320px]">
                <label className="block text-[12px] font-medium text-[#4B5563] mb-1">Quote text</label>
                <textarea 
                  className="w-full h-16 border border-[#D1D5DB] rounded-md px-2 py-1 text-[13px] text-[#111827] bg-white focus:outline-none focus:border-[#16A34A] resize-none" 
                  placeholder=""
                  value={quoteText}
                  onChange={(e) => setQuoteText(e.target.value)}
                ></textarea>
                <div className="mt-2 flex items-center">
                  <input 
                    type="checkbox" 
                    id="use-as-order-invoice"
                    className="w-4 h-4 text-[#16A34A] border-[#D1D5DB] rounded focus:ring-transparent"
                  />
                  <label htmlFor="use-as-order-invoice" className="ml-2 text-[12px] font-normal text-[#374151]">Use as order/invoice text.</label>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 w-[420px]">
                <div>
                  <label className="block text-[11px] font-medium text-[#4B5563] mb-1">Shipping charge</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#D1D5DB] rounded px-2 text-[13px] text-[#111827] bg-white text-right focus:outline-none focus:border-[#16A34A]" 
                    placeholder="0.00"
                    value={charges}
                    onChange={(e) => setCharges(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#4B5563] mb-1">Invoice charge</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#D1D5DB] rounded px-2 text-[13px] text-[#111827] bg-white text-right focus:outline-none focus:border-[#16A34A]" 
                    placeholder="0.00"
                    value={invoiceCharge}
                    onChange={(e) => setInvoiceCharge(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#4B5563] mb-1">Invoice number</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#D1D5DB] rounded px-2 text-[13px] text-[#111827] bg-white text-left placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#16A34A]" 
                    placeholder=""
                    value=""
                    onChange={() => {}}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 w-[420px] mt-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#4B5563] mb-1">Printout template</label>
                  <select 
                    className="w-full h-9 border border-[#D1D5DB] rounded px-2 text-[13px] text-[#111827] bg-white appearance-none focus:outline-none focus:border-[#16A34A]"
                    value="Offer"
                    onChange={() => {}}>
                    <option>Offer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#4B5563] mb-1">Language</label>
                  <select 
                    className="w-full h-9 border border-[#D1D5DB] rounded px-2 text-[13px] text-[#111827] bg-white appearance-none focus:outline-none focus:border-[#16A34A]"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}>
                    <option>English</option>
                    <option>Swedish</option>
                    <option>German</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Divider */}
            <div className="my-4 h-px bg-[#E5E7EB]"></div>
            
            {/* Amount Summary (XS Card Layout) */}
            <div className="w-[300px] text-right space-y-2">
  <div className="flex justify-between text-[13px]">
    <span className="text-[#6B7280]">Net</span>
    <span className="font-medium">{summaryValues.net}</span>
  </div>

  <div className="flex justify-between text-[13px]">
    <span className="text-[#6B7280]">Gross</span>
    <span className="font-medium">{summaryValues.gross}</span>
  </div>

  <div className="flex justify-between text-[13px]">
    <span className="text-[#6B7280]">Total excl. VAT</span>
    <span className="font-medium">{summaryValues.totalExclVat}</span>
  </div>

  <div className="flex justify-between text-[13px]">
    <span className="text-[#6B7280]">VAT</span>
    <span className="font-medium">{summaryValues.vatAmount}</span>
  </div>

  <div className="flex justify-between text-[14px] font-semibold text-[#EA580C] pt-2">
    <span>To pay</span>
    <span>{summaryValues.toPay}</span>
  </div>
</div>

            
            {/* Divider */}
            <div className="my-4 h-px bg-[#E5E7EB]"></div>
            
            {/* Action buttons */}
            {/* Action Buttons – XS Sticky Footer */}
<div className="sticky bottom-0 z-30 bg-white border-t border-[#E5E7EB] px-3 py-3">
  <div className="flex items-center justify-between mt-6">
  
  {/* Left */}
  <button className="h-9 px-6 bg-[#D1D5DB] text-white rounded-full text-[13px]">
    Void
  </button>

  {/* Right */}
  <div className="flex items-center gap-2">
    <button className="h-9 px-5 bg-[#9CA3AF] text-white rounded-full text-[13px]">
      Cancel
    </button>

    <button className="h-9 px-5 bg-[#15803D] text-white rounded-full text-[13px]">
      Save
    </button>

    <div className="flex items-center border rounded-full overflow-hidden">
      <button className="h-9 px-4 bg-white text-[#111827] text-[13px]">
        Printout
      </button>
      <button className="h-9 px-4 bg-[#15803D] text-white flex items-center gap-1 text-[13px]">
        Send <ArrowRight size={14} />
      </button>
    </div>

    <button className="h-9 px-6 bg-[#0F7A3D] text-white rounded-full flex items-center gap-2 text-[13px]">
      Create order <ChevronDown size={14} />
    </button>
  </div>
</div>

</div>

          </div>
        ) : (
          // List View (Original Content)
          <>
            {/* Top Navigation Bar */}
            <div className="h-14 bg-white border-b border-[#E5E5E5] flex items-center">
              <div className="h-[56px] flex items-center">
                <div className="relative h-[56px] px-4 flex items-center cursor-pointer font-sans text-[14px] font-medium text-[#4A4A4A] hover:text-[#000000] transition-colors duration-150">
                  <span className="font-semibold text-[#1F1F1F]">Quotes</span>
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#2E7D32]"></div>
                </div>
              </div>
              <div className="ml-auto flex items-center space-x-6">
                {/* <div className="text-sm text-[#4A4A4A] hover:text-[#000000] cursor-pointer">Reports</div> */}
                {/* <div className="text-sm text-[#4A4A4A] hover:text-[#000000] cursor-pointer relative">
                  Register
                  <ChevronDown size={16} className="absolute top-0.5 right-[-18px] text-[#4A4A4A]" />
                </div> */}
              </div>
            </div>

            {/* Header Section */}
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold tracking-[0.4px] text-[#1F1F1F] uppercase">QUOTES – LIST</h1>
              <div className="flex items-center space-x-4">
                <button className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-semibold rounded-full h-10 px-4 flex items-center text-sm"
                onClick={async () => {
                  setIsLoading(true);
                  setIsCreatingQuote(true);
                  await new Promise(resolve => setTimeout(resolve, 500));
                  setShowCreateQuoteForm(true);
                  setIsLoading(false);
                }}>
                  {isLoading ? (
                    <img
                      src={loadingGif}
                      alt="loading"
                      className="w-4 h-4 mr-2"
                    />
                  ) : (
                    <Plus size={16} className="mr-2" />
                  )}
                  {isLoading ? 'Loading...' : 'Create quote'}
                </button>
                <button className="text-sm text-[#4A4A4A] hover:text-[#000000] flex items-center">
                  <Printer size={18} className="mr-1" />
                  Print list
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center space-x-4">
              <div className="relative w-[360px]">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9E9E9E]" />
                <input
                  placeholder="Quote no., Customer no., Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-9 border border-[#DADADA] rounded pl-10 pr-3 text-sm"
                />
              </div>
              <button 
                className="text-[#1976D2] text-xs hover:underline"
                onClick={() => setExtendedSearchOpen(!extendedSearchOpen)}
              >
                {extendedSearchOpen ? 'close extended search' : 'extended search'}
              </button>
            </div>
            
            {/* Extended Search Panel */}
            {extendedSearchOpen && (
              <div className="bg-white border-t border-b border-[#E5E5E5] p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {/* Basic Details Section */}
                  <div className="col-span-4">
                    <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setBasicDetailsExpanded(!basicDetailsExpanded)}>
                      <h3 className="text-base font-semibold text-[#1F1F1F] flex items-center">
                        {basicDetailsExpanded ? <ChevronDown size={16} className="text-[#2E7D32] mr-2" /> : <ChevronRight size={16} className="text-[#2E7D32] mr-2" />}
                        Basic details
                      </h3>
                    </div>
                    
                    {basicDetailsExpanded && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                          <div>
                            <label className="block text-xs font-medium text-[#424242] mb-1">Quote number</label>
                            <input 
                              type="text" 
                              className="w-full h-9 border border-[#CFCFCF] rounded px-2.5 py-2 text-sm text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#1976D2] focus:ring-1 focus:ring-[#1976D2]/15" 
                              placeholder=""
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-[#424242] mb-1">Customer number</label>
                            <input 
                              type="text" 
                              className="w-full h-9 border border-[#CFCFCF] rounded px-2.5 py-2 text-sm text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#1976D2] focus:ring-1 focus:ring-[#1976D2]/15" 
                              placeholder=""
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-[#424242] mb-1">Customer name</label>
                            <input 
                              type="text" 
                              className="w-full h-9 border border-[#CFCFCF] rounded px-2.5 py-2 text-sm text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#1976D2] focus:ring-1 focus:ring-[#1976D2]/15" 
                              placeholder=""
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-[#424242] mb-1">Status</label>
                            <select 
                              className="w-full h-9 border border-[#CFCFCF] rounded px-2.5 py-2 text-sm text-[#212121] appearance-none bg-white relative"
                            >
                              <option value="">All</option>
                              <option value="active">Active</option>
                              <option value="due">Due</option>
                              <option value="order-created">Order/Invoice Created</option>
                              <option value="voided">Voided</option>
                              <option value="failed">Failed</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 mt-4">
                          <div>
                            <label className="block text-xs font-medium text-[#424242] mb-1">View complete quotes</label>
                            <div className="flex gap-1">
                              <button className="h-9 px-3 border border-[#CFCFCF] bg-[#E0E0E0] text-[#757575] text-xs font-medium">Complete</button>
                              <button className="h-9 px-3 border border-[#CFCFCF] bg-[#E0E0E0] text-[#757575] text-xs font-medium">Not done</button>
                              <button className="h-9 px-3 border border-[#CFCFCF] bg-white text-[#212121] text-xs font-semibold">All</button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-[#424242] mb-1">Show sent quotes</label>
                            <div className="flex gap-1">
                              <button className="h-9 px-3 border border-[#CFCFCF] bg-[#E0E0E0] text-[#757575] text-xs font-medium">Sent</button>
                              <button className="h-9 px-3 border border-[#CFCFCF] bg-[#E0E0E0] text-[#757575] text-xs font-medium">Not sent</button>
                              <button className="h-9 px-3 border border-[#CFCFCF] bg-white text-[#212121] text-xs font-semibold">All</button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Quote Details Section */}
                  <div className="col-span-4">

  {/* Header */}
  <button
    type="button"
    onClick={() => setQuoteDetailsExpanded(prev => !prev)}
    className="w-full flex items-center justify-between mb-4 cursor-pointer focus:outline-none"
  >
    <h3 className="flex items-center text-base font-semibold text-[#1F1F1F]">

      {/* Angle / Chevron Icon */}
      <ChevronRight
        size={16}
        className={`
          mr-2 text-[#2E7D32]
          transition-transform duration-200 ease-in-out
          ${quoteDetailsExpanded ? "rotate-90" : "rotate-0"}
        `}
      />

      Quote details
    </h3>
  </button>

  {/* Expand / Collapse Content */}
  <div
    className={`
      grid overflow-hidden transition-all duration-300 ease-in-out
      ${quoteDetailsExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
    `}
  >
    <div className="min-h-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

        {/* Example Field */}
        <div>
          <label className="block text-xs font-medium text-[#424242] mb-1">
            Our reference
          </label>
          <input
            type="text"
            className="w-full h-9 border border-[#CFCFCF] rounded px-2.5 text-sm
                       focus:outline-none focus:border-[#1976D2]
                       focus:ring-1 focus:ring-[#1976D2]/15"
          />
        </div>

        {/* (rest of your inputs stay unchanged) */}

      </div>
    </div>
  </div>
</div>

                  
                  {/* Quote Content Section */}
                  <div className="col-span-4">
                    <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setQuoteContentExpanded(!quoteContentExpanded)}>
                      <h3 className="text-base font-semibold text-[#1F1F1F] flex items-center">
                        {quoteContentExpanded ? <ChevronDown size={16} className="text-[#2E7D32] mr-2" /> : <ChevronRight size={16} className="text-[#2E7D32] mr-2" />}
                        Quote content
                      </h3>
                    </div>
                    
                    {quoteContentExpanded && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <div>
                          <label className="block text-xs font-medium text-[#424242] mb-1">Item number</label>
                          <input 
                            type="text" 
                            className="w-full h-9 border border-[#CFCFCF] rounded px-2.5 py-2 text-sm text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#1976D2] focus:ring-1 focus:ring-[#1976D2]/15" 
                            placeholder=""
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-[#424242] mb-1">Account (from)</label>
                          <input 
                            type="text" 
                            className="w-full h-9 border border-[#CFCFCF] rounded px-2.5 py-2 text-sm text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#1976D2] focus:ring-1 focus:ring-[#1976D2]/15" 
                            placeholder=""
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-[#424242] mb-1">Account (to)</label>
                          <input 
                            type="text" 
                            className="w-full h-9 border border-[#CFCFCF] rounded px-2.5 py-2 text-sm text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#1976D2] focus:ring-1 focus:ring-[#1976D2]/15" 
                            placeholder=""
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-[#424242] mb-1">Amount type</label>
                          <select 
                            className="w-full h-9 border border-[#CFCFCF] rounded px-2.5 py-2 text-sm text-[#212121] appearance-none bg-white relative"
                          >
                            <option value="">Total incl. VAT</option>
                          </select>
                        </div>
                        
                        <div className="lg:col-span-2">
                          <label className="block text-xs font-medium text-[#424242] mb-1">Item name</label>
                          <input 
                            type="text" 
                            className="w-full h-9 border border-[#CFCFCF] rounded px-2.5 py-2 text-sm text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#1976D2] focus:ring-1 focus:ring-[#1976D2]/15" 
                            placeholder=""
                          />
                        </div>
                        
                        <div className="flex flex-col">
                          <label className="block text-xs font-medium text-[#424242] mb-1">Amount range</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              className="w-full h-9 border border-[#CFCFCF] rounded px-2.5 py-2 text-sm text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#1976D2] focus:ring-1 focus:ring-[#1976D2]/15" 
                              placeholder="From"
                            />
                            <input 
                              type="text" 
                              className="w-full h-9 border border-[#CFCFCF] rounded px-2.5 py-2 text-sm text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#1976D2] focus:ring-1 focus:ring-[#1976D2]/15" 
                              placeholder="To"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="col-span-4 flex justify-end gap-3 mt-4 pt-4 border-t border-[#E0E0E0]">
                    <button className="h-10 bg-[#9E9E9E] hover:bg-[#757575] text-white px-6 rounded-full text-sm font-semibold">
                      Clear
                    </button>
                    <button className="h-10 bg-[#8D8D8D] hover:bg-[#6F6F6F] text-white px-7 rounded-full text-sm font-semibold">
                      Search
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Tabs */}
            <div className="flex items-center space-x-2">
              <button
                className={`h-8 px-3 text-xs font-medium rounded ${getQuoteFilterColor('all')} ${quoteFilter === 'all' ? 'font-semibold border-[#9E9E9E]' : ''}`}
                onClick={async () => {
                  setIsLoading(true);
                  await new Promise(resolve => setTimeout(resolve, 500));
                  setQuoteFilter('all');
                  setIsLoading(false);
                }}
              >
                All
              </button>
              <button
                className={`h-8 px-3 text-xs font-medium rounded ${getQuoteFilterColor('active')} ${quoteFilter === 'active' ? 'font-semibold border-[#9E9E9E]' : ''}`}
                onClick={async () => {
                  setIsLoading(true);
                  await new Promise(resolve => setTimeout(resolve, 500));
                  setQuoteFilter('active');
                  setIsLoading(false);
                }}
              >
                <span className={`${quoteFilter === 'active' ? 'bg-gradient-to-r from-white to-[#FFC6C6]' : ''} h-full w-full flex items-center justify-center rounded`}>
                  Active
                </span>
              </button>
              <button
                className={`h-8 px-3 text-xs font-medium rounded ${getQuoteFilterColor('due')} ${quoteFilter === 'due' ? 'font-semibold border-[#9E9E9E]' : ''}`}
                onClick={async () => {
                  setIsLoading(true);
                  await new Promise(resolve => setTimeout(resolve, 500));
                  setQuoteFilter('due');
                  setIsLoading(false);
                }}
              >
                Due
              </button>
              <button
                className={`h-8 px-3 text-xs font-medium rounded ${getQuoteFilterColor('order/invoices-created')} ${quoteFilter === 'order/invoices-created' ? 'font-semibold border-[#9E9E9E]' : ''}`}
                onClick={async () => {
                  setIsLoading(true);
                  await new Promise(resolve => setTimeout(resolve, 500));
                  setQuoteFilter('order/invoices-created');
                  setIsLoading(false);
                }}
              >
                Order/invoices created
              </button>
              <button
                className={`h-8 px-3 text-xs font-medium rounded ${getQuoteFilterColor('voided')} ${quoteFilter === 'voided' ? 'font-semibold border-[#9E9E9E]' : ''}`}
                onClick={async () => {
                  setIsLoading(true);
                  await new Promise(resolve => setTimeout(resolve, 500));
                  setQuoteFilter('voided');
                  setIsLoading(false);
                }}
              >
                Voided
              </button>
              <button
                className={`h-8 px-3 text-xs font-medium rounded ${getQuoteFilterColor('failed')} ${quoteFilter === 'failed' ? 'font-semibold border-[#9E9E9E]' : ''}`}
                onClick={async () => {
                  setIsLoading(true);
                  await new Promise(resolve => setTimeout(resolve, 500));
                  setQuoteFilter('failed');
                  setIsLoading(false);
                }}
              >
                Failed
              </button>
              <div className="flex-1"></div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border border-[#BDBDBD] rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#BDBDBD]"></div>
                </div>
                <span className="text-xs text-[#1F1F1F]">{selectedQuotes.length} -</span>
              </div>
            </div>

            {/* Quotes Table */}
            <div className="bg-white border border-[#E0E0E0] rounded-lg overflow-hidden relative">
              {loadingColumn !== null && (
                <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center z-10">
                  <img
                    src={loadingGif}
                    alt="loading"
                    className="w-8 h-8"
                  />
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">

                  {/* ================= TABLE HEADER ================= */}
                  <thead className="bg-[#FAFAFA]">
                    <tr>

                      {/* MASTER CHECKBOX */}
                      <th
                        onClick={() => handleColumnClick('select')}
                        className={`h-11 w-12 border-b-2 border-[#BDBDBD] text-center cursor-pointer select-none relative ${
                          activeColumn === 'select' ? 'bg-[#B8B8B8]' : 'bg-[#FAFAFA]'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {loadingColumn === 'select' ? (
                            <img
                              src={loadingGif}
                              alt="loading"
                              className="w-4 h-4"
                            />
                          ) : null}
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setSelectAll(checked);
                              setSelectedRows(checked ? [1, 2, 3] : []);
                            }}
                            className="w-4 h-4"
                          />
                        </div>
                      </th>

                      {[
                        "Quote No.",
                        "Customer No.",
                        "Name",
                        "Quote Date",
                        "Valid To",
                        "Total",
                        "Quote value",
                        "Currency",
                      ].map((col, index) => (
                        <th
                          key={col}
                          onClick={() => handleColumnClick(index)}
                          className={`h-11 px-6 border-b-2 border-[#BDBDBD]
                            text-left text-xs font-bold uppercase tracking-wider
                            cursor-pointer select-none relative
                            ${activeColumn === index ? "bg-[#B8B8B8]" : "bg-[#FAFAFA]"}`}
                        >
                          <div className="flex items-center gap-2">
                            {loadingColumn === index ? (
                              <img
                                src={loadingGif}
                                alt="loading"
                                className="w-4 h-4"
                              />
                            ) : null}
                            <span>{col}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* ================= TABLE BODY ================= */}
                  <tbody>

                    {[1, 2, 3].map((row) => (
                      <tr
                        key={row}
                        onClick={() => toggleRow(row)}
                        className="border-b border-[#E0E0E0] hover:bg-[#F5F5F5] cursor-pointer"
                      >

                        {/* ROW CHECKBOX */}
                        <td
                          className="h-14 text-center"
                        >
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(row)}
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => toggleRow(row)}
                            className="w-4 h-4"
                          />
                        </td>

                        {/* EMPTY COLUMNS */}
                        <td className="h-14 px-6"></td>
                        <td className="h-14 px-6"></td>
                        <td className="h-14 px-6"></td>
                        <td className="h-14 px-6"></td>

                        {/* VALID TO */}
                        <td className="h-14 px-6"></td>

                        {/* TOTAL */}
                        <td
                          className="h-14 px-6 text-right font-medium"
                        >
                          0,00
                        </td>

                        {/* QUOTE VALUE */}
                        <td
                          className="h-14 px-6 text-right font-medium"
                        >
                          0,00
                        </td>

                        {/* CURRENCY */}
                        <td
                          className="h-14 px-6"
                        >
                          SEK
                        </td>
                      </tr>
                    ))}

                    {/* ================= TOTAL ROW ================= */}
                    <tr className="bg-[#F9FAFB] font-semibold">
                      <td className="h-14"></td>
                      <td colSpan={4}></td>

                      <td className="h-14 px-6 text-right">Total SEK</td>
                      <td className="h-14 px-6 text-right">0,00</td>
                      <td className="h-14 px-6 text-right">0,00</td>
                      <td></td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>

            
            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] py-3 px-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-[#66BB6A] border-[#BDBDBD] rounded focus:ring-transparent" />
                  <span className="ml-2 text-sm text-[#4A4A4A]">Selection</span>
                </div>
                <div className="text-sm text-[#4A4A4A]">({selectedQuotes.length} selected)</div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-[#4A4A4A]">Template</span>
                  <select className="h-8 px-3 border border-[#D1D1D1] rounded text-sm text-[#4A4A4A] bg-white focus:outline-none">
                    <option>Default template</option>
                  </select>
                </div>
                
                <button className="h-8 px-4 bg-[#8E8E8E] text-white text-sm font-medium rounded">
                  Preview
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-[#4A4A4A]">Distribution method</span>
                  <select className="h-8 px-3 border border-[#D1D1D1] rounded text-sm text-[#4A4A4A] bg-white focus:outline-none">
                    <option>Default</option>
                  </select>
                </div>
                
                <button className="h-8 px-4 bg-[#FFC107] text-black text-sm font-medium rounded">
                  Send
                </button>
                
                <button className="h-8 px-4 bg-[#8BC34A] text-white text-sm font-medium rounded">
                  Create order
                </button>
              </div>
            </div>
            
          </>
        )}
        
      </div>
    </div>
  );
};
export default QuotesPage;
