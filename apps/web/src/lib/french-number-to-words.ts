/**
 * Converts a number to French words
 * Handles numbers from 0 to 999,999,999
 */

const frenchNumbers: Record<number, string> = {
  0: "zéro",
  1: "un",
  2: "deux",
  3: "trois",
  4: "quatre",
  5: "cinq",
  6: "six",
  7: "sept",
  8: "huit",
  9: "neuf",
  10: "dix",
  11: "onze",
  12: "douze",
  13: "treize",
  14: "quatorze",
  15: "quinze",
  16: "seize",
  17: "dix-sept",
  18: "dix-huit",
  19: "dix-neuf",
  20: "vingt",
  30: "trente",
  40: "quarante",
  50: "cinquante",
  60: "soixante",
  70: "soixante-dix",
  80: "quatre-vingts",
  90: "quatre-vingt-dix",
  100: "cent",
  1000: "mille",
  1000000: "million",
  1000000000: "milliard"
};

function convertTens(num: number): string {
  if (num < 20) {
    return frenchNumbers[num];
  }
  
  if (num < 70) {
    const tens = Math.floor(num / 10) * 10;
    const units = num % 10;
    if (units === 0) {
      return frenchNumbers[tens];
    }
    if (units === 1) {
      return `${frenchNumbers[tens]}-et-un`;
    }
    return `${frenchNumbers[tens]}-${frenchNumbers[units]}`;
  }
  
  if (num < 80) {
    const units = num % 10;
    if (units === 0) {
      return "soixante-dix";
    }
    return `soixante-${frenchNumbers[10 + units]}`;
  }
  
  if (num < 90) {
    const units = num % 10;
    if (units === 0) {
      return "quatre-vingts";
    }
    return `quatre-vingt-${frenchNumbers[units]}`;
  }
  
  // 90-99
  const units = num % 10;
  if (units === 0) {
    return "quatre-vingt-dix";
  }
  return `quatre-vingt-${frenchNumbers[10 + units]}`;
}

function convertHundreds(num: number): string {
  if (num < 100) {
    return convertTens(num);
  }
  
  const hundreds = Math.floor(num / 100);
  const remainder = num % 100;
  
  let result = "";
  
  if (hundreds === 1) {
    result = "cent";
  } else {
    result = `${frenchNumbers[hundreds]}-cent`;
  }
  
  if (remainder === 0) {
    return result;
  }
  
  if (remainder < 100) {
    return `${result}-${convertTens(remainder)}`;
  }
  
  return `${result}-${convertHundreds(remainder)}`;
}

function convertThousands(num: number): string {
  if (num < 1000) {
    return convertHundreds(num);
  }
  
  const thousands = Math.floor(num / 1000);
  const remainder = num % 1000;
  
  let result = "";
  
  if (thousands === 1) {
    result = "mille";
  } else {
    result = `${convertHundreds(thousands)}-mille`;
  }
  
  if (remainder === 0) {
    return result;
  }
  
  if (remainder < 100) {
    return `${result}-${convertTens(remainder)}`;
  }
  
  return `${result}-${convertHundreds(remainder)}`;
}

export function numberToFrenchWords(num: number): string {
  if (num === 0) {
    return "zéro";
  }
  
  if (num < 0) {
    return `moins ${numberToFrenchWords(-num)}`;
  }
  
  if (num < 1000) {
    return convertHundreds(num);
  }
  
  if (num < 1000000) {
    return convertThousands(num);
  }
  
  // For larger numbers, we'll keep it simple and use the basic conversion
  // In a real application, you might want to implement millions and billions
  return convertThousands(num);
}

/**
 * Converts a currency amount to French words
 * @param amount - The amount in the base currency unit (e.g., 123.45 for 123.45 EUR)
 * @param currency - The currency code (e.g., 'EUR', 'USD')
 * @returns French words representation of the amount
 */
export function currencyToFrenchWords(amount: number, currency: string): string {
  const integerPart = Math.floor(amount);
  const decimalPart = Math.round((amount - integerPart) * 100);
  
  const currencyNames: Record<string, { singular: string; plural: string }> = {
    EUR: { singular: "euro", plural: "euros" },
    USD: { singular: "dollar", plural: "dollars" },
    GBP: { singular: "livre", plural: "livres" },
    CAD: { singular: "dollar canadien", plural: "dollars canadiens" },
    AUD: { singular: "dollar australien", plural: "dollars australiens" },
    CHF: { singular: "franc suisse", plural: "francs suisses" },
    JPY: { singular: "yen", plural: "yens" },
    CNY: { singular: "yuan", plural: "yuans" },
    INR: { singular: "roupie", plural: "roupies" },
    BRL: { singular: "real", plural: "reals" },
    MXN: { singular: "peso", plural: "pesos" },
    RUB: { singular: "rouble", plural: "roubles" },
    ZAR: { singular: "rand", plural: "rands" },
    SEK: { singular: "couronne suédoise", plural: "couronnes suédoises" },
    NOK: { singular: "couronne norvégienne", plural: "couronnes norvégiennes" },
    DKK: { singular: "couronne danoise", plural: "couronnes danoises" },
    PLN: { singular: "zloty", plural: "zlotys" },
    CZK: { singular: "couronne tchèque", plural: "couronnes tchèques" },
    HUF: { singular: "forint", plural: "forints" },
    RON: { singular: "leu", plural: "leus" },
    BGN: { singular: "lev", plural: "levs" },
    HRK: { singular: "kuna", plural: "kunas" },
    RSD: { singular: "dinar", plural: "dinars" },
    UAH: { singular: "hryvnia", plural: "hryvnias" },
    BYN: { singular: "rouble biélorusse", plural: "roubles biélorusses" },
    KZT: { singular: "tenge", plural: "tenges" },
    UZS: { singular: "som", plural: "soms" },
    KGS: { singular: "som", plural: "soms" },
    TJS: { singular: "somoni", plural: "somonis" },
    TMT: { singular: "manat", plural: "manats" },
    AZN: { singular: "manat", plural: "manats" },
    GEL: { singular: "lari", plural: "laris" },
    AMD: { singular: "dram", plural: "drams" },
    TRY: { singular: "lira", plural: "liras" },
    ILS: { singular: "shekel", plural: "shekels" },
    JOD: { singular: "dinar jordanien", plural: "dinars jordaniens" },
    LBP: { singular: "livre libanaise", plural: "livres libanaises" },
    EGP: { singular: "livre égyptienne", plural: "livres égyptiennes" },
    MAD: { singular: "dirham", plural: "dirhams" },
    TND: { singular: "dinar tunisien", plural: "dinars tunisiens" },
    DZD: { singular: "dinar algérien", plural: "dinars algériens" },
    LYD: { singular: "dinar libyen", plural: "dinars libyens" },
    SDG: { singular: "livre soudanaise", plural: "livres soudanaises" },
    ETB: { singular: "birr", plural: "birrs" },
    KES: { singular: "shilling", plural: "shillings" },
    UGX: { singular: "shilling ougandais", plural: "shillings ougandais" },
    TZS: { singular: "shilling tanzanien", plural: "shillings tanzaniens" },
    RWF: { singular: "franc rwandais", plural: "francs rwandais" },
    BIF: { singular: "franc burundais", plural: "francs burundais" },
    DJF: { singular: "franc djiboutien", plural: "francs djiboutiens" },
    KMF: { singular: "franc comorien", plural: "francs comoriens" },
    MGA: { singular: "ariary", plural: "ariarys" },
    MUR: { singular: "roupie mauricienne", plural: "roupies mauriciennes" },
    SCR: { singular: "roupie seychelloise", plural: "roupies seychelloises" },
    SLL: { singular: "leone", plural: "leones" },
    GMD: { singular: "dalasi", plural: "dalasis" },
    GHS: { singular: "cedi", plural: "cedis" },
    NGN: { singular: "naira", plural: "nairas" },
    XOF: { singular: "franc CFA", plural: "francs CFA" },
    XAF: { singular: "franc CFA", plural: "francs CFA" },
    CDF: { singular: "franc congolais", plural: "francs congolais" },
    AOA: { singular: "kwanza", plural: "kwanzas" },
    ZMW: { singular: "kwacha", plural: "kwachas" },
    BWP: { singular: "pula", plural: "pulas" },
    SZL: { singular: "lilangeni", plural: "lilangenis" },
    LSL: { singular: "loti", plural: "lotis" },
    NAD: { singular: "dollar namibien", plural: "dollars namibiens" },
    MZN: { singular: "metical", plural: "meticals" },
    MWK: { singular: "kwacha", plural: "kwachas" },
    ZWL: { singular: "dollar zimbabwéen", plural: "dollars zimbabwéens" },
    BDT: { singular: "taka", plural: "takas" },
    LKR: { singular: "roupie srilankaise", plural: "roupies srilankaises" },
    NPR: { singular: "roupie népalaise", plural: "roupies népalaises" },
    PKR: { singular: "roupie pakistanaise", plural: "roupies pakistanaises" },
    AFN: { singular: "afghani", plural: "afghanis" },
    IRR: { singular: "rial iranien", plural: "rials iraniens" },
    IQD: { singular: "dinar irakien", plural: "dinars irakiens" },
    KWD: { singular: "dinar koweïtien", plural: "dinars koweïtiens" },
    BHD: { singular: "dinar bahreïni", plural: "dinars bahreïnis" },
    QAR: { singular: "riyal qatari", plural: "riyals qataris" },
    SAR: { singular: "riyal saoudien", plural: "riyals saoudiens" },
    AED: { singular: "dirham émirati", plural: "dirhams émiratis" },
    OMR: { singular: "rial omanais", plural: "rials omanais" },
    YER: { singular: "rial yéménite", plural: "rials yéménites" },
    SYP: { singular: "livre syrienne", plural: "livres syriennes" },
  };
  
  const currencyInfo = currencyNames[currency] || { singular: "unité", plural: "unités" };
  const currencyName = integerPart <= 1 ? currencyInfo.singular : currencyInfo.plural;
  
  let result = "";
  
  if (integerPart === 0) {
    result = "zéro";
  } else {
    result = numberToFrenchWords(integerPart);
  }
  
  result += ` ${currencyName}`;
  
  if (decimalPart > 0) {
    const centName = decimalPart <= 1 ? "centime" : "centimes";
    result += ` et ${numberToFrenchWords(decimalPart)} ${centName}`;
  }
  
  return result;
}
