interface Profile {
    income: number;
    resident: boolean,
}
interface TaxSummary {
    percentage: number | undefined;
}
interface TaxStrategy {
    (profile: Profile): TaxSummary;
}

interface TaxStrategies {
    [name: string]: TaxStrategy;
}

function defaultTaxStrategy() {
    return { percentage: undefined };
}
 
export const countries: TaxStrategies = {
    // Exchange Rates !!!
    // Didn't find Malta
    'Fiji': (profile) => {
        if (profile.resident) {
        let tax = 0;
        if (profile.income < 30000) {
            tax = profile.income * 0;
        }
        if (profile.income < 50000) {
            tax = (profile.income - 30000) * 0.18;
        }
        if (profile.income < 270000) {
            tax = 9000 + (profile.income - 50000) * 0.2;
        }
        if (profile.income < 300000) {
            tax = 54000 + (profile.income - 270000) * 0.33;
        } 
        if (profile.income < 350000) {
            tax = 99000 + (profile.income - 300000) * 0.34;
        }
        if (profile.income < 400000) {
            tax = 119000 + (profile.income - 350000) * 0.35;
        }
        if (profile.income < 450000) {
            tax = 140000 + (profile.income - 400000) * 0.36;
        }
        if (profile.income < 500000) {
            tax = 162000 + (profile.income - 450000) * 0.37;
        }
        if (profile.income < 1000000) {
            tax = 185000 + (profile.income - 500000) * 0.38;
        }
        if (profile.income > 1000000) {
            tax = 380000 + (profile.income - 1000000) * 0.39;
        }
        return { percentage: tax / profile.income };
    } else {
        let tax = 0;
        if (profile.income < 30000) {
            tax = profile.income * 0.2;
        }
        if (profile.income < 50000) {
            tax = (profile.income - 30000) * 0.2;
        }
        if (profile.income < 270000) {
            tax = 9000 + (profile.income - 50000) * 0.2;
        }
        if (profile.income < 300000) {
            tax = 54000 + (profile.income - 270000) * 0.33;
        } 
        if (profile.income < 350000) {
            tax = 99000 + (profile.income - 300000) * 0.34;
        }
        if (profile.income < 400000) {
            tax = 119000 + (profile.income - 350000) * 0.35;
        }
        if (profile.income < 450000) {
            tax = 140000 + (profile.income - 400000) * 0.36;
        }
        if (profile.income < 500000) {
            tax = 162000 + (profile.income - 450000) * 0.37;
        }
        if (profile.income < 1000000) {
            tax = 185000 + (profile.income - 500000) * 0.38;
        }
        if (profile.income > 1000000) {
            tax = 380000 + (profile.income - 1000000) * 0.39;
        }
        return { percentage: tax / profile.income };
    }
    },
    'Tanzania': defaultTaxStrategy,
    'W. Sahara': defaultTaxStrategy,
    'Canada': defaultTaxStrategy,
    'United States of America': defaultTaxStrategy,
    'Kazakhstan': defaultTaxStrategy,
    'Uzbekistan': defaultTaxStrategy,
    'Papua New Guinea': defaultTaxStrategy,
    'Indonesia': defaultTaxStrategy,
    'Argentina': defaultTaxStrategy,
    'Chile': defaultTaxStrategy,
    'Dem. Rep. Congo': defaultTaxStrategy,
    'Somalia': defaultTaxStrategy,
    'Kenya': defaultTaxStrategy,
    'Sudan': defaultTaxStrategy,
    'Chad': defaultTaxStrategy,
    'Haiti': defaultTaxStrategy,
    'Dominican Rep.': defaultTaxStrategy,
    'Russia': defaultTaxStrategy,
    'Bahamas': defaultTaxStrategy,
    'Falkland Is.': defaultTaxStrategy,
    'Norway': defaultTaxStrategy,
    'Greenland': defaultTaxStrategy,
    'Fr. S. Antarctic Lands': defaultTaxStrategy,
    'Timor-Leste': defaultTaxStrategy,
    'South Africa': defaultTaxStrategy,
    'Lesotho': defaultTaxStrategy,
    'Mexico': defaultTaxStrategy,
    'Uruguay': defaultTaxStrategy,
    'Brazil': defaultTaxStrategy,
    'Bolivia': defaultTaxStrategy,
    'Peru': defaultTaxStrategy,
    'Colombia': defaultTaxStrategy,
    'Panama': defaultTaxStrategy,
    'Costa Rica': defaultTaxStrategy,
    'Nicaragua': defaultTaxStrategy,
    'Honduras': defaultTaxStrategy,
    'El Salvador': defaultTaxStrategy,
    'Guatemala': defaultTaxStrategy,
    'Belize': defaultTaxStrategy,
    'Venezuela': defaultTaxStrategy,
    'Guyana': defaultTaxStrategy,
    'Suriname': defaultTaxStrategy,
    'France': defaultTaxStrategy,
    'Ecuador': defaultTaxStrategy,
    'Puerto Rico': defaultTaxStrategy,
    'Jamaica': defaultTaxStrategy,
    'Cuba': defaultTaxStrategy,
    'Zimbabwe': defaultTaxStrategy,
    'Botswana': defaultTaxStrategy,
    'Namibia': defaultTaxStrategy,
    'Senegal': defaultTaxStrategy,
    'Mali': defaultTaxStrategy,
    'Mauritania': defaultTaxStrategy,
    'Benin': defaultTaxStrategy,
    'Niger': defaultTaxStrategy,
    'Nigeria': defaultTaxStrategy,
    'Cameroon': defaultTaxStrategy,
    'Togo': defaultTaxStrategy,
    'Ghana': defaultTaxStrategy,
    'Côte d\'Ivoire': defaultTaxStrategy,
    'Guinea': defaultTaxStrategy,
    'Guinea-Bissau': defaultTaxStrategy,
    'Liberia': defaultTaxStrategy,
    'Sierra Leone': defaultTaxStrategy,
    'Burkina Faso': defaultTaxStrategy,
    'Central African Rep.': defaultTaxStrategy,
    'Congo': defaultTaxStrategy,
    'Gabon': defaultTaxStrategy,
    'Eq. Guinea': defaultTaxStrategy,
    'Zambia': defaultTaxStrategy,
    'Malawi': defaultTaxStrategy,
    'Mozambique': defaultTaxStrategy,
    'eSwatini': defaultTaxStrategy,
    'Angola': defaultTaxStrategy,
    'Burundi': defaultTaxStrategy,
    'Israel': defaultTaxStrategy,
    'Lebanon': defaultTaxStrategy,
    'Madagascar': defaultTaxStrategy,
    'Palestine': defaultTaxStrategy,
    'Gambia': defaultTaxStrategy,
    'Tunisia': defaultTaxStrategy,
    'Algeria': defaultTaxStrategy,
    'Jordan': defaultTaxStrategy,
    'United Arab Emirates': defaultTaxStrategy,
    'Qatar': defaultTaxStrategy,
    'Kuwait': defaultTaxStrategy,
    'Iraq': defaultTaxStrategy,
    'Oman': defaultTaxStrategy,
    'Vanuatu': defaultTaxStrategy,
    'Cambodia': defaultTaxStrategy,
    'Thailand': defaultTaxStrategy,
    'Laos': defaultTaxStrategy,
    'Myanmar': defaultTaxStrategy,
    'Vietnam': defaultTaxStrategy,
    'North Korea': defaultTaxStrategy,
    'South Korea': defaultTaxStrategy,
    'Mongolia': defaultTaxStrategy,
    'India': defaultTaxStrategy,
    'Bangladesh': defaultTaxStrategy,
    'Bhutan': defaultTaxStrategy,
    'Nepal': defaultTaxStrategy,
    'Pakistan': defaultTaxStrategy,
    'Afghanistan': defaultTaxStrategy,
    'Tajikistan': defaultTaxStrategy,
    'Kyrgyzstan': defaultTaxStrategy,
    'Turkmenistan': defaultTaxStrategy,
    'Iran': defaultTaxStrategy,
    'Syria': defaultTaxStrategy,
    'Armenia': defaultTaxStrategy,
    'Sweden': defaultTaxStrategy,
    'Belarus': defaultTaxStrategy,
    'Ukraine': defaultTaxStrategy,
    'Poland': defaultTaxStrategy,
    'Austria': defaultTaxStrategy,
    'Hungary': defaultTaxStrategy,
    'Moldova': defaultTaxStrategy,
    'Romania': defaultTaxStrategy,
    'Lithuania': defaultTaxStrategy,
    'Latvia': defaultTaxStrategy,
    'Estonia': defaultTaxStrategy,
    'Germany': defaultTaxStrategy,
    'Bulgaria': defaultTaxStrategy,
    'Greece': defaultTaxStrategy,
    'Turkey': defaultTaxStrategy,
    'Albania': defaultTaxStrategy,
    'Croatia': defaultTaxStrategy,
    'Switzerland': defaultTaxStrategy,
    'Luxembourg': defaultTaxStrategy,
    'Belgium': defaultTaxStrategy,
    'Netherlands': defaultTaxStrategy,
    // Deductible amount
    // Additional solidarity rate after 80 000 and 250 000
    'Portugal': (profile) => {
        if (profile.resident) {
        let tax = 0;
        if (profile.income < 7703) {
            tax = profile.income * 0.1325;
        }
        if (profile.income < 11623) {
            tax = 1020.65 + (profile.income - 7703) * 0.18;
        }
        if (profile.income < 16472) {
            tax = 2092.14 + (profile.income - 11623) * 0.23;
        }
        if (profile.income < 21321) {
            tax = 3788.56 + (profile.income - 16472) * 0.26;
        } 
        if (profile.income < 27146) {
            tax = 5543.46 + (profile.income - 21321) * 0.3275;
        }
        if (profile.income < 39791	) {
            tax = 8890.32 + (profile.income - 27146) * 0.37;
        }
        if (profile.income < 51997) {
            tax = 14722.67 + (profile.income - 39791) * 0.435;
        }
        if (profile.income > 80000 && profile.income < 81,199) {
            tax = 14722.67 + (profile.income - 39,791) * 0.435 + profile.income * 0.025;
        }
        if (profile.income < 81199) {
            tax = 22618.70 + (profile.income - 51997) * 0.45 + profile.income * 0.025;
        }
        if (profile.income < 250000) {
            tax = 36539.55 + (profile.income - 81199) * 0.48 + profile.income * 0.025;
        }
        if (profile.income > 250000) {
            tax = 36539.55 + (profile.income - 81,199) * 0.48 + profile.income * 0.05;
        }
        return { percentage: tax / profile.income };
    } else {
        let tax = 0;
        if (profile.income > 0) {
            tax = (profile.income) * 0.25;
        }
        return { percentage: tax / profile.income };
    }
    },
    'Spain': (profile) => {
        let tax = 0;
        if (profile.income < 12450) {
            tax = profile.income * 0.19;
        }
        if (profile.income < 20200) {
            tax = 2365.5 + (profile.income - 12450) * 0.24;
        }
        if (profile.income < 35200) {
            tax = 4729.5 + (profile.income - 20200) * 0.3;
        }
        if (profile.income < 60000) {
            tax = 8959.5 + (profile.income - 35200) * 0.37;
        } 
        if (profile.income < 300000) {
            tax = 17159.5 + (profile.income - 60000) * 0.45;
        }
        if (profile.income > 300000) {
            tax = 109159.5 + (profile.income - 300000) * 0.47;
        }
        return { percentage: tax / profile.income };
    },
    //Married, kids, one or two incomes
    'Ireland': defaultTaxStrategy,
    'New Caledonia': defaultTaxStrategy,
    'Solomon Is.': defaultTaxStrategy,
    'New Zealand': defaultTaxStrategy,
    'Australia': defaultTaxStrategy,
    'Sri Lanka': defaultTaxStrategy,
    'China': defaultTaxStrategy,
    'Taiwan': defaultTaxStrategy,
    'Italy': defaultTaxStrategy,
    'Denmark': defaultTaxStrategy,
    'United Kingdom': defaultTaxStrategy,
    'Iceland': defaultTaxStrategy,
    'Azerbaijan': defaultTaxStrategy,
    'Georgia': defaultTaxStrategy,
    'Philippines': defaultTaxStrategy,
    'Malaysia': defaultTaxStrategy,
    'Brunei': defaultTaxStrategy,
    'Slovenia': defaultTaxStrategy,
    'Finland': defaultTaxStrategy,
    'Slovakia': defaultTaxStrategy,
    'Czechia': defaultTaxStrategy,
    'Eritrea': defaultTaxStrategy,
    'Japan': defaultTaxStrategy,
    'Paraguay': defaultTaxStrategy,
    'Yemen': defaultTaxStrategy,
    'Saudi Arabia': defaultTaxStrategy,
    'Antarctica': defaultTaxStrategy,
    'N. Cyprus': defaultTaxStrategy,
    'Cyprus': defaultTaxStrategy,
    'Morocco': defaultTaxStrategy,
    'Egypt': defaultTaxStrategy,
    'Libya': defaultTaxStrategy,
    'Ethiopia': defaultTaxStrategy,
    'Djibouti': defaultTaxStrategy,
    'Somaliland': defaultTaxStrategy,
    'Uganda': defaultTaxStrategy,
    'Rwanda': defaultTaxStrategy,
    //Small entrepreneurs are taxed at a 2% rate on their total annual revenue, 
    //while foreign-source income is taxed at the prescribed absolute amount.
    'Bosnia and Herz.': (profile) => {
        let tax = 0;
        if (profile.income > 0) {
            tax = profile.income * 0.1;
        }
        return { percentage: tax / profile.income };
    },
    'Macedonia': (profile) => {
        let tax = 0;
        if (profile.income > 0) {
            tax = profile.income * 0.1;
        }
        return { percentage: tax / profile.income };
    },
    // Depends on the type of income 
    'Serbia': defaultTaxStrategy,
    // Salary or business. Here is only for salary
    'Montenegro': (profile) => {
        let tax = 0;
        if (profile.income < 700) {
            tax = profile.income * 0;
        }
        if (profile.income < 1000) {
            tax = (profile.income - 700) * 0.09;
        }
        if (profile.income > 1000) {
            tax = 90 + (profile.income - 1000) * 0.15;
        }
        return { percentage: tax / profile.income };
    },
    'Kosovo': (profile) => {
        let tax = 0;
        if (profile.income < 960) {
            tax = profile.income * 0;
        }
        if (profile.income < 3000) {
            tax = (profile.income - 960) * 0.04;
        }
        if (profile.income < 5400) {
            tax = 120 + (profile.income - 3000) * 0.08;
        }
        if (profile.income > 5400) {
            tax = 432 + (profile.income - 5400) * 0.1;
        }
        return { percentage: tax / profile.income };
    },
    'Trinidad and Tobago': defaultTaxStrategy,
    'S. Sudan': defaultTaxStrategy,
}
