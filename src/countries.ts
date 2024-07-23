interface Profile {
	incomeUSD: number
}
interface TaxSummary {
	percentage: number | undefined
}
interface TaxStrategy {
	(profile: Profile, exchangeRates: Record<string, number>): TaxSummary
}

interface TaxStrategies {
	[name: string]: TaxStrategy
}

function defaultTaxStrategy(): TaxSummary {
	return { percentage: undefined }
}

export const countries: TaxStrategies = {
	//Resident/Non-resident
	Fiji: (profile, exchangeRates) => {
		const exchangeRateFJD = exchangeRates['FJD'] || 1
		if (!exchangeRateFJD) {
			console.error('Exchange rate for FJD is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD / exchangeRateFJD
		let tax = 0
		if (localCurrencyIncome < 30000) {
			tax = localCurrencyIncome * 0
		} else if (localCurrencyIncome < 50000) {
			tax = (localCurrencyIncome - 30000) * 0.18
		} else if (localCurrencyIncome < 270000) {
			tax = 3600 + (localCurrencyIncome - 50000) * 0.2
		} else if (localCurrencyIncome < 300000) {
			tax = 47600 + (localCurrencyIncome - 270000) * 0.33
		} else if (localCurrencyIncome < 350000) {
			tax = 57500 + (localCurrencyIncome - 300000) * 0.34
		} else if (localCurrencyIncome < 400000) {
			tax = 74500 + (localCurrencyIncome - 350000) * 0.35
		} else if (localCurrencyIncome < 450000) {
			tax = 92000 + (localCurrencyIncome - 400000) * 0.36
		} else if (localCurrencyIncome < 500000) {
			tax = 110000 + (localCurrencyIncome - 450000) * 0.37
		} else if (localCurrencyIncome < 1000000) {
			tax = 128500 + (localCurrencyIncome - 500000) * 0.38
		} else {
			tax = 318500 + (localCurrencyIncome - 1000000) * 0.39
		}
		let percentage = tax / localCurrencyIncome
		return { percentage }
	},
	Tanzania: defaultTaxStrategy,
	'W. Sahara': defaultTaxStrategy,
	Canada: defaultTaxStrategy,
	'United States of America': defaultTaxStrategy,
	Kazakhstan: defaultTaxStrategy,
	Uzbekistan: defaultTaxStrategy,
	'Papua New Guinea': defaultTaxStrategy,
	Indonesia: defaultTaxStrategy,
	Argentina: defaultTaxStrategy,
	Chile: defaultTaxStrategy,
	'Dem. Rep. Congo': defaultTaxStrategy,
	Somalia: defaultTaxStrategy,
	Malta: defaultTaxStrategy,
	Kenya: defaultTaxStrategy,
	Sudan: defaultTaxStrategy,
	Chad: defaultTaxStrategy,
	Haiti: defaultTaxStrategy,
	'Dominican Rep.': defaultTaxStrategy,
	Russia: (profile, exchangeRates) => {
		const exchangeRateRUB = exchangeRates['RUB'] || 1
		if (!exchangeRateRUB) {
			console.error('Exchange rate for RUB is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateRUB
		let tax = 0
		if (localCurrencyIncome > 0) {
			tax = localCurrencyIncome * 0.13
		}
		return { percentage: tax / localCurrencyIncome }
	},
	Bahamas: defaultTaxStrategy,
	'Falkland Is.': defaultTaxStrategy,
	//Dual tax base system:
	//general income and personal income.
	Norway: (profile, exchangeRates) => {
		const exchangeRateNOK = exchangeRates['NOK'] || 1
		if (!exchangeRateNOK) {
			console.error('Exchange rate for NOK is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateNOK
		let tax = 0
		if (localCurrencyIncome < 208051) {
			tax = localCurrencyIncome * 0
		}
		if (localCurrencyIncome < 292850) {
			tax = localCurrencyIncome * 0.017
		}
		if (localCurrencyIncome < 670000) {
			tax = 1441.58 + (localCurrencyIncome - 292850) * 0.04
		}
		if (localCurrencyIncome < 937900) {
			tax = 15085.96 + (localCurrencyIncome - 670000) * 0.136
		}
		if (localCurrencyIncome < 1350000) {
			tax = 36447.64 + (localCurrencyIncome - 937900) * 0.166
		}
		if (localCurrencyIncome > 1350000) {
			tax = 68408.43 + (localCurrencyIncome - 1350000) * 0.176
		}
		const generalIncomeTax = localCurrencyIncome * 0.22
		const totalTax = tax + generalIncomeTax

		return { percentage: totalTax / localCurrencyIncome }
	},
	// Depends on location
	Greenland: (profile, exchangeRates) => {
		const exchangeRateDKK = exchangeRates['DKK'] || 1
		if (!exchangeRateDKK) {
			console.error('Exchange rate for DKK is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateDKK
		let tax = 0
		if (localCurrencyIncome > 0) {
			tax = localCurrencyIncome * 0.44
		}
		return { percentage: tax / localCurrencyIncome }
	},
	'Fr. S. Antarctic Lands': defaultTaxStrategy,
	'Timor-Leste': defaultTaxStrategy,
	'South Africa': defaultTaxStrategy,
	Lesotho: defaultTaxStrategy,
	Mexico: defaultTaxStrategy,
	Uruguay: defaultTaxStrategy,
	Brazil: defaultTaxStrategy,
	Bolivia: defaultTaxStrategy,
	Peru: defaultTaxStrategy,
	Colombia: defaultTaxStrategy,
	Panama: defaultTaxStrategy,
	'Costa Rica': defaultTaxStrategy,
	Nicaragua: defaultTaxStrategy,
	Honduras: defaultTaxStrategy,
	'El Salvador': defaultTaxStrategy,
	Guatemala: defaultTaxStrategy,
	Belize: defaultTaxStrategy,
	Venezuela: defaultTaxStrategy,
	Guyana: defaultTaxStrategy,
	Suriname: defaultTaxStrategy,
	France: defaultTaxStrategy,
	Ecuador: defaultTaxStrategy,
	'Puerto Rico': defaultTaxStrategy,
	Jamaica: defaultTaxStrategy,
	Cuba: defaultTaxStrategy,
	Zimbabwe: defaultTaxStrategy,
	Botswana: defaultTaxStrategy,
	Namibia: defaultTaxStrategy,
	Senegal: defaultTaxStrategy,
	Mali: defaultTaxStrategy,
	Mauritania: defaultTaxStrategy,
	Benin: defaultTaxStrategy,
	Niger: defaultTaxStrategy,
	Nigeria: defaultTaxStrategy,
	Cameroon: defaultTaxStrategy,
	Togo: defaultTaxStrategy,
	Ghana: defaultTaxStrategy,
	"Côte d'Ivoire": defaultTaxStrategy,
	Guinea: defaultTaxStrategy,
	'Guinea-Bissau': defaultTaxStrategy,
	Liberia: defaultTaxStrategy,
	'Sierra Leone': defaultTaxStrategy,
	'Burkina Faso': defaultTaxStrategy,
	'Central African Rep.': defaultTaxStrategy,
	Congo: defaultTaxStrategy,
	Gabon: defaultTaxStrategy,
	'Eq. Guinea': defaultTaxStrategy,
	Zambia: defaultTaxStrategy,
	Malawi: defaultTaxStrategy,
	Mozambique: defaultTaxStrategy,
	eSwatini: defaultTaxStrategy,
	Angola: defaultTaxStrategy,
	Burundi: defaultTaxStrategy,
	Israel: defaultTaxStrategy,
	Lebanon: defaultTaxStrategy,
	Madagascar: defaultTaxStrategy,
	Palestine: defaultTaxStrategy,
	Gambia: defaultTaxStrategy,
	Tunisia: defaultTaxStrategy,
	Algeria: defaultTaxStrategy,
	Jordan: defaultTaxStrategy,
	'United Arab Emirates': defaultTaxStrategy,
	Qatar: defaultTaxStrategy,
	Kuwait: defaultTaxStrategy,
	Iraq: defaultTaxStrategy,
	Oman: defaultTaxStrategy,
	Vanuatu: defaultTaxStrategy,
	Cambodia: defaultTaxStrategy,
	Thailand: defaultTaxStrategy,
	Laos: defaultTaxStrategy,
	Myanmar: defaultTaxStrategy,
	Vietnam: defaultTaxStrategy,
	'North Korea': defaultTaxStrategy,
	'South Korea': defaultTaxStrategy,
	Mongolia: defaultTaxStrategy,
	India: defaultTaxStrategy,
	Bangladesh: defaultTaxStrategy,
	Bhutan: defaultTaxStrategy,
	Nepal: defaultTaxStrategy,
	Pakistan: defaultTaxStrategy,
	Afghanistan: defaultTaxStrategy,
	Tajikistan: defaultTaxStrategy,
	Kyrgyzstan: defaultTaxStrategy,
	Turkmenistan: defaultTaxStrategy,
	Iran: defaultTaxStrategy,
	Syria: defaultTaxStrategy,
	Armenia: defaultTaxStrategy,
	Sweden: (profile, exchangeRates) => {
		const exchangeRateSEK = exchangeRates['SEK'] || 1
		if (!exchangeRateSEK) {
			console.error('Exchange rate for SEK is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateSEK
		let tax = 0
		if (localCurrencyIncome < 614000) {
			tax = localCurrencyIncome * 0.32
		}
		if (localCurrencyIncome > 614000) {
			tax = localCurrencyIncome * 0.2 + localCurrencyIncome * 0.32
		}
		return { percentage: tax / localCurrencyIncome }
	},
	Belarus: defaultTaxStrategy,
	Ukraine: defaultTaxStrategy,
	Poland: defaultTaxStrategy,
	Austria: defaultTaxStrategy,
	Hungary: defaultTaxStrategy,
	Moldova: defaultTaxStrategy,
	Romania: defaultTaxStrategy,
	Lithuania: defaultTaxStrategy,
	Latvia: defaultTaxStrategy,
	Estonia: defaultTaxStrategy,
	Germany: defaultTaxStrategy,
	Bulgaria: defaultTaxStrategy,
	// Plus Real estate property
	Greece: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR'] || 1
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateEUR
		let tax = 0
		if (localCurrencyIncome < 10000) {
			tax = localCurrencyIncome * 0.09
		}
		if (localCurrencyIncome < 20000) {
			tax = 900 + (localCurrencyIncome - 10000) * 0.22
		}
		if (localCurrencyIncome < 30000) {
			tax = 3100 + (localCurrencyIncome - 20000) * 0.28
		}
		if (localCurrencyIncome < 40000) {
			tax = 5900 + (localCurrencyIncome - 30000) * 0.36
		}
		if (localCurrencyIncome > 40000) {
			tax = 9500 + (localCurrencyIncome - 40000) * 0.44
		}
		return { percentage: tax / localCurrencyIncome }
	},
	// Depends on the type of income and instruments
	Turkey: (profile, exchangeRates) => {
		const exchangeRateTRY = exchangeRates['TRY'] || 1
		if (!exchangeRateTRY) {
			console.error('Exchange rate for TRY is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateTRY
		let tax = 0
		if (localCurrencyIncome < 110000) {
			tax = localCurrencyIncome * 0.15
		}
		if (localCurrencyIncome < 230000) {
			tax = 16500 + (localCurrencyIncome - 110000) * 0.2
		}
		if (localCurrencyIncome < 870000) {
			tax = 40500 + (localCurrencyIncome - 230000) * 0.27
		}
		if (localCurrencyIncome < 3000000) {
			tax = 213300 + (localCurrencyIncome - 870000) * 0.35
		}
		if (localCurrencyIncome > 3000000) {
			tax = 958000 + (localCurrencyIncome - 3000000) * 0.4
		}
		return { percentage: tax / localCurrencyIncome }
	},
	Albania: (profile, exchangeRates) => {
		const exchangeRateALL = exchangeRates['ALL'] || 1
		if (!exchangeRateALL) {
			console.error('Exchange rate for ALL is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateALL
		let tax = 0
		if (localCurrencyIncome <= 50000) {
			tax = 0
		} else if (localCurrencyIncome <= 60000) {
			if (localCurrencyIncome <= 35000) {
				tax = 0
			} else {
				tax = (localCurrencyIncome - 35000) * 0.13
			}
		} else {
			// localCurrencyIncome > 60000
			if (localCurrencyIncome <= 30000) {
				tax = 0
			} else if (localCurrencyIncome <= 200000) {
				tax = (localCurrencyIncome - 30000) * 0.13
			} else {
				tax = 22100 + (localCurrencyIncome - 200000) * 0.23
			}
		}
		return { percentage: tax / localCurrencyIncome }
	},
	// Depends on location
	Croatia: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR'] || 1
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateEUR
		let tax = 0
		if (localCurrencyIncome < 50400) {
			tax = localCurrencyIncome * 0.23
		}
		if (localCurrencyIncome > 50400) {
			tax = 11592 + (localCurrencyIncome - 50400) * 0.35
		}
		return { percentage: tax / localCurrencyIncome }
	},
	//Depends on location
	Switzerland: defaultTaxStrategy,
	// Single/Married
	Luxembourg: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR'] || 1
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateEUR
		let tax = 0
		if (localCurrencyIncome < 12438) {
			tax = localCurrencyIncome * 0
		} else if (localCurrencyIncome < 14508) {
			tax = (localCurrencyIncome - 12438) * 0.08
		} else if (localCurrencyIncome < 16578) {
			tax = 484.24 + (localCurrencyIncome - 14508) * 0.09
		} else if (localCurrencyIncome < 18648) {
			tax = 1009.34 + (localCurrencyIncome - 16578) * 0.1
		} else if (localCurrencyIncome < 20718) {
			tax = 1544.94 + (localCurrencyIncome - 18648) * 0.11
		} else if (localCurrencyIncome < 22788) {
			tax = 2171.04 + (localCurrencyIncome - 20718) * 0.12
		} else if (localCurrencyIncome < 24939) {
			tax = 2897.64 + (localCurrencyIncome - 22788) * 0.14
		} else if (localCurrencyIncome < 27090) {
			tax = 3724.74 + (localCurrencyIncome - 24939) * 0.16
		} else if (localCurrencyIncome < 29241) {
			tax = 4652.34 + (localCurrencyIncome - 27090) * 0.18
		} else if (localCurrencyIncome < 31392) {
			tax = 5680.44 + (localCurrencyIncome - 29241) * 0.2
		} else if (localCurrencyIncome < 33543) {
			tax = 6809.04 + (localCurrencyIncome - 31392) * 0.22
		} else if (localCurrencyIncome < 35694) {
			tax = 8038.14 + (localCurrencyIncome - 33543) * 0.24
		} else if (localCurrencyIncome < 37845) {
			tax = 9367.74 + (localCurrencyIncome - 35694) * 0.26
		} else if (localCurrencyIncome < 39996) {
			tax = 10797.84 + (localCurrencyIncome - 37845) * 0.28
		} else if (localCurrencyIncome < 42147) {
			tax = 12328.44 + (localCurrencyIncome - 39996) * 0.3
		} else if (localCurrencyIncome < 44298) {
			tax = 13959.54 + (localCurrencyIncome - 42147) * 0.32
		} else if (localCurrencyIncome < 46449) {
			tax = 15691.14 + (localCurrencyIncome - 44298) * 0.34
		} else if (localCurrencyIncome < 48600) {
			tax = 17523.24 + (localCurrencyIncome - 46449) * 0.36
		} else if (localCurrencyIncome < 50751) {
			tax = 19455.84 + (localCurrencyIncome - 48600) * 0.38
		} else if (localCurrencyIncome < 110403) {
			tax = 21488.94 + (localCurrencyIncome - 50751) * 0.39
		} else if (localCurrencyIncome < 165600) {
			tax = 47953.94 + (localCurrencyIncome - 110403) * 0.4
		} else if (localCurrencyIncome < 220788) {
			tax = 72953.94 + (localCurrencyIncome - 165600) * 0.41
		} else if (localCurrencyIncome > 220788) {
			tax = 103791.94 + (localCurrencyIncome - 220788) * 0.42
		}

		return { percentage: tax / localCurrencyIncome }
	},
	//Types of income + Local tax
	Belgium: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR'] || 1
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateEUR
		let tax = 0
		if (localCurrencyIncome < 15820) {
			tax = localCurrencyIncome * 0.25
		}
		if (localCurrencyIncome < 27920) {
			tax = 3955 + (localCurrencyIncome - 15820) * 0.4
		}
		if (localCurrencyIncome < 48320) {
			tax = 4840 + (localCurrencyIncome - 27920) * 0.45
		}
		if (localCurrencyIncome > 48320) {
			tax = 9180 + (localCurrencyIncome - 48320) * 0.5
		}
		return { percentage: tax / localCurrencyIncome }
	},
	Netherlands: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR'] || 1
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateEUR
		let tax = 0
		if (localCurrencyIncome < 38098) {
			tax = localCurrencyIncome * 0.0932
		}
		if (localCurrencyIncome < 75518) {
			tax = 3550 + (localCurrencyIncome - 38098) * 0.3697
		}
		if (localCurrencyIncome > 75518) {
			tax = 17384 + (localCurrencyIncome - 75518) * 0.495
		}
		return { percentage: tax / localCurrencyIncome }
	},
	// Deductible amount
	// Additional solidarity rate after 80 000 and 250 000
	Portugal: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR'] || 1
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateEUR
		let tax = 0
		if (localCurrencyIncome < 7703) {
			tax = localCurrencyIncome * 0.1325
		}
		if (localCurrencyIncome < 11623) {
			tax = 1022.28 + (localCurrencyIncome - 7703) * 0.18
		}
		if (localCurrencyIncome < 16472) {
			tax = 1758.95 + (localCurrencyIncome - 11623) * 0.23
		}
		if (localCurrencyIncome < 21321) {
			tax = 3530.74 + (localCurrencyIncome - 16472) * 0.26
		}
		if (localCurrencyIncome < 27146) {
			tax = 5351.86 + (localCurrencyIncome - 21321) * 0.3275
		}
		if (localCurrencyIncome < 39791) {
			tax = 8008.2 + (localCurrencyIncome - 27146) * 0.37
		}
		if (localCurrencyIncome < 51997) {
			tax = 11679.88 + (localCurrencyIncome - 39791) * 0.435
		}
		if (localCurrencyIncome > 80000 && localCurrencyIncome < 81199) {
			tax = 16991.68 + (localCurrencyIncome - 39791) * 0.435 + localCurrencyIncome * 0.025
		}
		if (localCurrencyIncome < 81199) {
			tax = 23936.78 + (localCurrencyIncome - 51997) * 0.45 + localCurrencyIncome * 0.025
		}
		if (localCurrencyIncome < 250000) {
			tax = 25302.68 + (localCurrencyIncome - 81199) * 0.48 + localCurrencyIncome * 0.025
		}
		if (localCurrencyIncome > 250000) {
			tax = 114302.68 + (localCurrencyIncome - 81199) * 0.48 + localCurrencyIncome * 0.05
		}
		return { percentage: tax / localCurrencyIncome }
	},
	Spain: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR'] || 1
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.');
			return defaultTaxStrategy();
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateEUR;
		let tax = 0
    const scale: Record<string, number> = {
      "12450": 0.19,
      "20200": 0.24,
      "35200": 0.3,
      "60000": 0.37,
      "300000": 0.45,
      Infinity: 0.47,
    }
    function progressiveTax(scale:Record<string, number>, localCurrencyIncome: number){
      let sum = 0
      let prevLimit: number = 0
      for (const [limit, rate] of Object.entries(scale)) {
        if (Number(limit) < localCurrencyIncome) {
          sum = sum + rate * (Number(limit) - prevLimit);
          prevLimit = Number(limit);
        } else {
          tax = sum + (localCurrencyIncome - prevLimit) * rate;
          break;
        }
      }  
    }
    progressiveTax(scale, localCurrencyIncome);
    return { percentage: tax / localCurrencyIncome }
    // for each limit which is less then our income we apply current rate to limit
    // then sum each of them until reach limit that is more then income
    // substract previous limit from income and multyply on current rate
    // result plus sum is total tax
	},
	//Married, kids, one or two incomes
	Ireland: defaultTaxStrategy,
	'New Caledonia': defaultTaxStrategy,
	'Solomon Is.': defaultTaxStrategy,
	'New Zealand': defaultTaxStrategy,
	Australia: defaultTaxStrategy,
	'Sri Lanka': defaultTaxStrategy,
	China: defaultTaxStrategy,
	Taiwan: defaultTaxStrategy,
	//Resident or Non-resident
	// National income tax, Regional income tax, Municipal income tax.
	Italy: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR'] || 1
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateEUR
		let tax = 0
		if (localCurrencyIncome < 28000) {
			tax = localCurrencyIncome * 0.23
		}
		if (localCurrencyIncome < 50000) {
			tax = 6440 + (localCurrencyIncome - 28000) * 0.35
		}
		if (localCurrencyIncome > 50000) {
			tax = 14140 + (localCurrencyIncome - 50000) * 0.43
		}
		const muniIncomeTax = localCurrencyIncome * 0.009 // from 0% to 0.9%
		const regIncomeTax = localCurrencyIncome * 0.0333 // From 1.23% to 3.33%
		const totalTax = tax + muniIncomeTax + regIncomeTax

		return { percentage: totalTax / localCurrencyIncome }
	},
	// Types of income
	// Used the ordinary tax scheme by up to 52.07%
	Denmark: (profile, exchangeRates) => {
		const exchangeRateDKK = exchangeRates['DKK'] || 1
		if (!exchangeRateDKK) {
			console.error('Exchange rate for DKK is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateDKK
		let tax = 0
		if (localCurrencyIncome > 0) {
			tax = localCurrencyIncome * 0.5207
		}
		return { percentage: tax / localCurrencyIncome }
	},
	// Types of incomes
	// In Scotland other taxes
	'United Kingdom': (profile, exchangeRates) => {
		const exchangeRateGBP = exchangeRates['GBP'] || 1
		if (!exchangeRateGBP) {
			console.error('Exchange rate for GBP is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateGBP
		let tax = 0
		if (localCurrencyIncome < 17570) {
			tax = localCurrencyIncome * 0
		}
		if (localCurrencyIncome < 50270) {
			tax = (localCurrencyIncome - 17570) * 0.2
		}
		if (localCurrencyIncome < 125140) {
			tax = 6540 + (localCurrencyIncome - 50270) * 0.4
		}
		if (localCurrencyIncome > 125140) {
			tax = 36488 + (localCurrencyIncome - 125140) * 0.45
		}
		return { percentage: tax / localCurrencyIncome }
	},
	Iceland: (profile, exchangeRates) => {
		const exchangeRateISK = exchangeRates['ISK'] || 1
		if (!exchangeRateISK) {
			console.error('Exchange rate for ISK is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateISK
		let tax = 0
		if (localCurrencyIncome < 446136) {
			tax = localCurrencyIncome * 0.3148
		}
		if (localCurrencyIncome < 806364) {
			tax = 140443.61 + (localCurrencyIncome - 446136) * 0.3798
		}
		if (localCurrencyIncome > 1252501) {
			tax = 446700.66 + (localCurrencyIncome - 806364) * 0.4628
		}

		return { percentage: tax / localCurrencyIncome }
	},
	Azerbaijan: defaultTaxStrategy,
	Georgia: defaultTaxStrategy,
	Philippines: defaultTaxStrategy,
	Malaysia: defaultTaxStrategy,
	Brunei: defaultTaxStrategy,
	Slovenia: defaultTaxStrategy,
	// Local tax, resident/Non-resident
	Finland: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR'] || 1
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateEUR
		let tax = 0
		if (localCurrencyIncome < 20500) {
			tax = localCurrencyIncome * 0.1264
		}
		if (localCurrencyIncome < 30500) {
			tax = 2591 + (localCurrencyIncome - 20500) * 0.19
		}
		if (localCurrencyIncome < 50400) {
			tax = 4491 + (localCurrencyIncome - 30500) * 0.3025
		}
		if (localCurrencyIncome < 88200) {
			tax = 10510 + (localCurrencyIncome - 50400) * 0.34
		}
		if (localCurrencyIncome < 150000) {
			tax = 23362 + (localCurrencyIncome - 88200) * 0.42
		}
		if (localCurrencyIncome > 150000) {
			tax = 49318 + (localCurrencyIncome - 150000) * 0.44
		}
		const muniIncomeTax = localCurrencyIncome * 0.075
		const totalTax = tax + muniIncomeTax

		return { percentage: totalTax / localCurrencyIncome }
	},
	// Types of income
	Slovakia: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR'] || 1
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateEUR
		let tax = 0
		if (localCurrencyIncome < 41445.46) {
			tax = localCurrencyIncome * 0.19
		}
		if (localCurrencyIncome > 41445.46) {
			tax = 7874.64 + (localCurrencyIncome - 41445.46) * 0.25
		}
		return { percentage: tax / localCurrencyIncome }
	},
	Czechia: (profile, exchangeRates) => {
		const exchangeRateCZK = exchangeRates['CZK'] || 1
		if (!exchangeRateCZK) {
			console.error('Exchange rate for CZK is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateCZK
		let tax = 0
		if (localCurrencyIncome < 1582812) {
			tax = localCurrencyIncome * 0.15
		}
		if (localCurrencyIncome > 1582812) {
			tax = 237421.8 + (localCurrencyIncome - 1582812) * 0.23
		}
		return { percentage: tax / localCurrencyIncome }
	},
	Eritrea: defaultTaxStrategy,
	Japan: defaultTaxStrategy,
	Paraguay: defaultTaxStrategy,
	Yemen: defaultTaxStrategy,
	'Saudi Arabia': defaultTaxStrategy,
	Antarctica: defaultTaxStrategy,
	'N. Cyprus': defaultTaxStrategy,
	Cyprus: defaultTaxStrategy,
	Morocco: defaultTaxStrategy,
	Egypt: defaultTaxStrategy,
	Libya: defaultTaxStrategy,
	Ethiopia: defaultTaxStrategy,
	Djibouti: defaultTaxStrategy,
	Somaliland: defaultTaxStrategy,
	Uganda: defaultTaxStrategy,
	Rwanda: defaultTaxStrategy,
	//Small entrepreneurs are taxed at a 2% rate on their total annual revenue,
	//while foreign-source income is taxed at the prescribed absolute amount.
	'Bosnia and Herz.': (profile, exchangeRates) => {
		const exchangeRateBAM = exchangeRates['BAM'] || 1
		if (!exchangeRateBAM) {
			console.error('Exchange rate for BAM is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateBAM
		let tax = 0
		if (localCurrencyIncome > 0) {
			tax = localCurrencyIncome * 0.1
		}
		return { percentage: tax / localCurrencyIncome }
	},
	Macedonia: (profile, exchangeRates) => {
		const exchangeRateMKD = exchangeRates['MKD'] || 1
		if (!exchangeRateMKD) {
			console.error('Exchange rate for MKD is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateMKD
		let tax = 0
		if (localCurrencyIncome > 0) {
			tax = localCurrencyIncome * 0.1
		}
		return { percentage: tax / localCurrencyIncome }
	},
	// Depends on the type of income
	Serbia: defaultTaxStrategy,
	// Salary or business. Here is only for salary
	Montenegro: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR'] || 1
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateEUR
		let tax = 0
		if (localCurrencyIncome < 700) {
			tax = localCurrencyIncome * 0
		}
		if (localCurrencyIncome < 1000) {
			tax = (localCurrencyIncome - 700) * 0.09
		}
		if (localCurrencyIncome > 1000) {
			tax = 27 + (localCurrencyIncome - 1000) * 0.15
		}
		return { percentage: tax / localCurrencyIncome }
	},
	Kosovo: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR'] || 1
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateEUR
		let tax = 0
		if (localCurrencyIncome < 960) {
			tax = localCurrencyIncome * 0
		}
		if (localCurrencyIncome < 3000) {
			tax = (localCurrencyIncome - 960) * 0.04
		}
		if (localCurrencyIncome < 5400) {
			tax = 81.6 + (localCurrencyIncome - 3000) * 0.08
		}
		if (localCurrencyIncome > 5400) {
			tax = 273.6 + (localCurrencyIncome - 5400) * 0.1
		}
		return { percentage: tax / localCurrencyIncome }
	},
	'Trinidad and Tobago': defaultTaxStrategy,
	'S. Sudan': defaultTaxStrategy,
}
