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

function progressiveTax(scale: Record<number, number>, localCurrencyIncome: number) {
	let sum = 0
	let prevLimit: number = 0
	for (const [limit, rate] of Object.entries(scale)) {
		if (Number(limit) < localCurrencyIncome) {
			sum = sum + rate * (Number(limit) - prevLimit)
			prevLimit = Number(limit)
		} else {
			sum = sum + (localCurrencyIncome - prevLimit) * rate
			break
		}
	}
	return sum
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
		const tax = progressiveTax(
			{
				30000: 0,
				50000: 0.18,
				270000: 0.2,
				300000: 0.33,
				350000: 0.34,
				400000: 0.35,
				450000: 0.36,
				500000: 0.37,
				1000000: 0.38,
				Infinity: 0.39,
			},
			localCurrencyIncome
		)

		return { percentage: tax / localCurrencyIncome }
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
		const tax = progressiveTax(
			{
				5000000: 0.13,
				Infinity: 0.15,
			},
			localCurrencyIncome
		)

		return { percentage: tax / localCurrencyIncome }
	},
	Bahamas: defaultTaxStrategy,
	'Falkland Is.': defaultTaxStrategy,
	//Dual tax base system:
	//general income and personal income
	Norway: (profile, exchangeRates) => {
		const exchangeRateNOK = exchangeRates['NOK'] || 1
		if (!exchangeRateNOK) {
			console.error('Exchange rate for NOK is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateNOK

		const tax = progressiveTax(
			{
				208051: 0,
				292850: 0.017,
				670000: 0.04,
				937900: 0.136,
				1350000: 0.166,
				Infinity: 0.176,
			},
			localCurrencyIncome
		)

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
		const tax = localCurrencyIncome * 0.44

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
	// Resident or Non-resident
	Sweden: (profile, exchangeRates) => {
		const exchangeRateSEK = exchangeRates['SEK'] || 1
		if (!exchangeRateSEK) {
			console.error('Exchange rate for SEK is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateSEK
		const tax = progressiveTax(
			{
				614000: 0.32,
				Infinity: 0.52,
			},
			localCurrencyIncome
		)

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

    const tax = progressiveTax(
			{
				10000: 0.09,
				20000: 0.22,
				30000: 0.28,
				40000: 0.36,
				Infinity: 0.44,
			},
			localCurrencyIncome
		)

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

    const tax = progressiveTax(
			{
				110000: 0.15,
				230000: 0.2,
				870000: 0.27,
				3000000: 0.35,
				Infinity: 0.4,
			},
			localCurrencyIncome
		)
		
		return { percentage: tax / localCurrencyIncome }
	},
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
    
    const tax = progressiveTax(
			{
				50400: 0.23,
				Infinity: 0.35,
			},
			localCurrencyIncome
		)
		
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

    const tax = progressiveTax(
			{
				12438: 0,
				14508: 0.08,
				16578: 0.09,
        18648: 0.1,
				20718: 0.11,
				22788: 0.12,
				24939: 0.14,
				27090: 0.16,
				29241: 0.18,
				31392: 0.2,
				33543: 0.22,
				35694: 0.24,
				37845: 0.26,
				39996: 0.28,
				42147: 0.3,
				44298: 0.32,
				46449: 0.34,
				48600: 0.36,
				50751: 0.38,
				110403: 0.39,
				165600: 0.4,
				220788: 0.41,
				Infinity: 0.42,
			},
			localCurrencyIncome
		)

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
    const tax = progressiveTax(
			{
				15820: 0.25,
				27920: 0.4,
				48320: 0.45,
				Infinity: 0.5,
			},
			localCurrencyIncome
		)

		return { percentage: tax / localCurrencyIncome }
	},
	Netherlands: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR'] || 1
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateEUR
    const tax = progressiveTax(
			{
				38098: 0.0932,
				75518: 0.3697,
				Infinity: 0.495,
			},
			localCurrencyIncome
		)

		return { percentage: tax / localCurrencyIncome }
	},
	// Deductible amount
	// Resident or Non-resident
	// Additional solidarity rate after 80 000 and 250 000
	Portugal: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR'] || 1
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateEUR
		const tax = progressiveTax(
			{
				7703: 0.1325,
				11623: 0.18,
				16472: 0.23,
				21321: 0.26,
				27146: 0.3275,
				39791: 0.37,
				51997: 0.435,
				81199: 0.45,
				Infinity: 0.48,
			},
			localCurrencyIncome
		)

		const muniIncomeTax = progressiveTax(
			{
				80000: 0,
				250000: 0.025,
				Infinity: 0.05,
			},
			localCurrencyIncome
		)
		const totalTax = tax + muniIncomeTax
		return { percentage: totalTax / localCurrencyIncome }
	},

	Spain: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR'] || 1
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateEUR

		const tax = progressiveTax(
			{
				12450: 0.19,
				20200: 0.24,
				35200: 0.3,
				60000: 0.37,
				300000: 0.45,
				Infinity: 0.47,
			},
			localCurrencyIncome
		)

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
    const tax = progressiveTax(
			{
				28000: 0.23,
				50000: 0.35,
				Infinity: 0.43,
			},
			localCurrencyIncome
		)
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
    const tax = localCurrencyIncome * 0.5207

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
    const tax = progressiveTax(
			{
				17570: 0,
				50270: 0.2,
				125140: 0.4,
				Infinity: 0.45,
			},
			localCurrencyIncome
		)

		return { percentage: tax / localCurrencyIncome }
	},
	Iceland: (profile, exchangeRates) => {
		const exchangeRateISK = exchangeRates['ISK'] || 1
		if (!exchangeRateISK) {
			console.error('Exchange rate for ISK is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateISK
    const tax = progressiveTax(
			{
				5353634: 0.3148,
				15030014: 0.3798,
				Infinity: 0.4628,
			},
			localCurrencyIncome
		)

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
    const tax = progressiveTax(
			{
				20500: 0.1264,
				30500: 0.19,
				50400: 0.3025,
				88200: 0.34,
				150000: 0.42,
				Infinity: 0.44,
			},
			localCurrencyIncome
		)
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
    const tax = progressiveTax(
			{
				41445: 0.19,
				Infinity: 0.25,
			},
			localCurrencyIncome
		)

		return { percentage: tax / localCurrencyIncome }
	},
	Czechia: (profile, exchangeRates) => {
		const exchangeRateCZK = exchangeRates['CZK'] || 1
		if (!exchangeRateCZK) {
			console.error('Exchange rate for CZK is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateCZK
    const tax = progressiveTax(
			{
				1582812: 0.15,
				Infinity: 0.23,
			},
			localCurrencyIncome
		)
		
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
		const tax = localCurrencyIncome * 0.1
		
		return { percentage: tax / localCurrencyIncome }
	},
	Macedonia: (profile, exchangeRates) => {
		const exchangeRateMKD = exchangeRates['MKD'] || 1
		if (!exchangeRateMKD) {
			console.error('Exchange rate for MKD is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateMKD
    const tax = localCurrencyIncome * 0.1

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
    const tax = progressiveTax(
			{
				700: 0,
				1000: 0.09,
				Infinity: 0.15,
			},
			localCurrencyIncome
		)
		
		return { percentage: tax / localCurrencyIncome }
	},
	Kosovo: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR'] || 1
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateEUR
    const tax = progressiveTax(
			{
				960: 0,
				3000: 0.04,
				5400: 0.08,
				Infinity: 0.1,
			},
			localCurrencyIncome
		)

		return { percentage: tax / localCurrencyIncome }
	},
	'Trinidad and Tobago': defaultTaxStrategy,
	'S. Sudan': defaultTaxStrategy,
}
