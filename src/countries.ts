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
	// Resident/Non-resident
	// Types of income
	// Plus Provincial/territorial tax depending on province
	// Special tax system in Quebec
	Canada: (profile, exchangeRates) => {
		const exchangeRateCAD = exchangeRates['CAD'] || 1
		if (!exchangeRateCAD) {
			console.error('Exchange rate for CAD is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD / exchangeRateCAD
		const tax = progressiveTax(
			{
				55867: 0.15,
				111733: 0.205,
				173205: 0.26,
				246752: 0.29,
				Infinity: 0.33,
			},
			localCurrencyIncome
		)
		// From 11.5% in Nunavut to 25.75% in Quebec
		const regIncomeTax = localCurrencyIncome * 0.205 // British Columbia
		const totalTax = tax + regIncomeTax

		return { percentage: totalTax / localCurrencyIncome }
	},
	// Types of income
	// Plus State and local income taxes
	// Single/Married
	// Here is for single taxpayer
	'United States of America': (profile) => {
		const tax = progressiveTax(
			{
				11000: 0.1,
				44725: 0.12,
				95375: 0.22,
				182100: 0.24,
				231250: 0.32,
				578125: 0.35,
				Infinity: 0.37,
			},
			profile.incomeUSD
		)

		return { percentage: tax / profile.incomeUSD }
	},
	Kazakhstan: defaultTaxStrategy,
	Uzbekistan: defaultTaxStrategy,
	'Papua New Guinea': defaultTaxStrategy,
	Indonesia: defaultTaxStrategy,
	// Non-residents pay 24.5%
	Argentina: (profile, exchangeRates) => {
		const exchangeRateARS = exchangeRates['ARS'] || 1
		if (!exchangeRateARS) {
			console.error('Exchange rate for ARS is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD / exchangeRateARS
		const tax = progressiveTax(
			{
				419253.95: 0.05,
				838507.92: 0.09,
				1257761.87: 0.12,
				1677015.87: 0.15,
				2515523.74: 0.19,
				3354031.63: 0.23,
				5031047.45: 0.27,
				6708063.39: 0.31,
				Infinity: 0.35,
			},
			localCurrencyIncome
		)

		return { percentage: tax / localCurrencyIncome }
	},
	// Non-residents pay 15%
	Chile: (profile) => {
		const tax = progressiveTax(
			{
				11368.06: 0,
				25262.37: 0.04,
				42103.94: 0.08,
				58945.52: 0.135,
				75787.1: 0.23,
				101049.46: 0.304,
				260400: 0.355,
				Infinity: 0.4,
			},
			profile.incomeUSD
		)

		return { percentage: tax / profile.incomeUSD }
	},
	'Dem. Rep. Congo': defaultTaxStrategy,
	Somalia: defaultTaxStrategy,
	Malta: defaultTaxStrategy,
	Kenya: defaultTaxStrategy,
	Sudan: defaultTaxStrategy,
	Chad: defaultTaxStrategy,
	Haiti: (profile, exchangeRates) => {
		const exchangeRateHTG = exchangeRates['HTG'] || 1
		if (!exchangeRateHTG) {
			console.error('Exchange rate for HTG is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateHTG
		const tax = progressiveTax(
			{
				60000: 0,
				240000: 0.1,
        480000: 0.15,
        Infinity: 0.3,
			},
			localCurrencyIncome
		)

		return { percentage: tax / localCurrencyIncome }
	},
	'Dominican Rep.': (profile, exchangeRates) => {
		const exchangeRateDOP = exchangeRates['DOP'] || 1
		if (!exchangeRateDOP) {
			console.error('Exchange rate for DOP is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateDOP
		const tax = progressiveTax(
			{
				416220: 0,
				624329: 0.15,
        867123: 0.2,
        Infinity: 0.25,
			},
			localCurrencyIncome
		)

		return { percentage: tax / localCurrencyIncome }
	},
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
  // Income is not taxed in the Bahamas
	Bahamas: (profile) => {
		const tax = 0
		return { percentage: tax }
	},
  // Types of income
	'Falkland Is.': (profile, exchangeRates) => {
		const exchangeRateFKP = exchangeRates['FKP'] || 1
		if (!exchangeRateFKP) {
			console.error('Exchange rate for FKP is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateFKP

		const tax = progressiveTax(
			{
				12000: 0.21,
				Infinity: 0.26,
			},
			localCurrencyIncome
		)

		return { percentage: tax / localCurrencyIncome }
	},
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
	// Depends on location from 36% to 44%
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
	// Types of income
	Lesotho: (profile, exchangeRates) => {
		const exchangeRateLSL = exchangeRates['LSL'] || 1
		if (!exchangeRateLSL) {
			console.error('Exchange rate for LSL is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateLSL
		const tax = progressiveTax(
			{
				69120: 0.2,
				Infinity: 0.3,
			},
			localCurrencyIncome
		)

		return { percentage: tax / localCurrencyIncome }
	},
	// Resident or Non-Resident
	Mexico: (profile, exchangeRates) => {
		const exchangeRateMXN = exchangeRates['MXN'] || 1
		if (!exchangeRateMXN) {
			console.error('Exchange rate for MXN is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateMXN
		const tax = progressiveTax(
			{
				8952.49: 0.0192,
				75984.55: 0.064,
				133536.07: 0.1088,
				155229.8: 0.16,
				185852.57: 0.1792,
				374837.88: 0.2136,
				590795.99: 0.2352,
				1127926.84: 0.3,
				1503902.46: 0.32,
				4511707.37: 0.34,
				Infinity: 0.35,
			},
			localCurrencyIncome
		)

		return { percentage: tax / localCurrencyIncome }
	},
	// Resident or Non-Resident
	// If married not the same
	Uruguay: (profile, exchangeRates) => {
		const exchangeRateUYU = exchangeRates['UYU'] || 1
		if (!exchangeRateUYU) {
			console.error('Exchange rate for UYU is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateUYU
		const tax = progressiveTax(
			{
				475440: 0,
				679200: 0.1,
				1018800: 0.15,
				2037600: 0.24,
				3396000: 0.25,
				5094000: 0.27,
				7810800: 0.31,
				Infinity: 0.36,
			},
			localCurrencyIncome
		)

		return { percentage: tax / localCurrencyIncome }
	},
	Brazil: (profile, exchangeRates) => {
		const exchangeRateBRL = exchangeRates['BRL'] || 1
		if (!exchangeRateBRL) {
			console.error('Exchange rate for BRL is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateBRL
		const tax = progressiveTax(
			{
				6677.55: 0,
				9922.28: 0.075,
				13167: 0.15,
				16380.38: 0.225,
				Infinity: 0.275,
			},
			localCurrencyIncome
		)

		return { percentage: tax / localCurrencyIncome }
	},
	Bolivia: (profile, exchangeRates) => {
		const exchangeRateBOB = exchangeRates['BOB'] || 1
		if (!exchangeRateBOB) {
			console.error('Exchange rate for BOB is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateBOB
		const tax = localCurrencyIncome * 0.13

		return { percentage: tax / localCurrencyIncome }
	},
	// Non-Residents pay 30%
	// Types of income
	Peru: (profile, exchangeRates) => {
		const exchangeRatePEN = exchangeRates['PEN'] || 1
		if (!exchangeRatePEN) {
			console.error('Exchange rate for PEN is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRatePEN
		const tax = progressiveTax(
			{
				25750: 0.08,
				103000: 0.14,
				180250: 0.17,
				231750: 0.2,
				Infinity: 0.3,
			},
			localCurrencyIncome
		)

		return { percentage: tax / localCurrencyIncome }
	},
	// Types of income
	Colombia: (profile, exchangeRates) => {
		const exchangeRateCOP = exchangeRates['COP'] || 1
		if (!exchangeRateCOP) {
			console.error('Exchange rate for COP is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateCOP
		const tax = progressiveTax(
			{
				1090: 0,
				1700: 0.19,
				4100: 0.28,
				8670: 0.33,
				18970: 0.35,
				31000: 0.37,
				Infinity: 0.39,
			},
			localCurrencyIncome
		)

		return { percentage: tax / localCurrencyIncome }
	},
	Panama: (profile) => {
		const tax = progressiveTax(
			{
				11000: 0,
				50000: 0.15,
				Infinity: 0.25,
			},
			profile.incomeUSD
		)

		return { percentage: tax / profile.incomeUSD }
	},
	// Non-residents pay 10%
	// Types of income:
	// Self-employed individuals and Employed individuals
	// Here is for Self-employed individuals
	'Costa Rica': (profile, exchangeRates) => {
		const exchangeRateCRC = exchangeRates['CRC'] || 1
		if (!exchangeRateCRC) {
			console.error('Exchange rate for CRC is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateCRC
		const tax = progressiveTax(
			{
				4181000: 0,
				6244000: 0.1,
				10414000: 0.15,
				20872000: 0.2,
				Infinity: 0.25,
			},
			localCurrencyIncome
		)

		return { percentage: tax / localCurrencyIncome }
	},
	// Non-residents pay 20%
	Nicaragua: (profile, exchangeRates) => {
		const exchangeRateNIO = exchangeRates['NIO'] || 1
		if (!exchangeRateNIO) {
			console.error('Exchange rate for NIO is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateNIO
		const tax = progressiveTax(
			{
				100000: 0,
				200000: 0.15,
				350000: 0.2,
				500000: 0.25,
				Infinity: 0.3,
			},
			localCurrencyIncome
		)

		return { percentage: tax / localCurrencyIncome }
	},
	Honduras: (profile, exchangeRates) => {
		const exchangeRateHNL = exchangeRates['HNL'] || 1
		if (!exchangeRateHNL) {
			console.error('Exchange rate for HNL is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateHNL
		const tax = progressiveTax(
			{
				199039.47: 0,
				303499.9: 0.15,
				705813.76: 0.2,
				Infinity: 0.25,
			},
			localCurrencyIncome
		)
		const muniIncomeTax = progressiveTax(
			{
				5000: 0.015,
				10000: 0.02,
				20000: 0.025,
				30000: 0.03,
				50000: 0.035,
				75000: 0.0375,
				100000: 0.04,
				150000: 0.05,
				Infinity: 0.0525,
			},
			localCurrencyIncome
		)
		const totalTax = tax + muniIncomeTax

		return { percentage: totalTax / localCurrencyIncome }
	},
	// Non-residents pay 30%
	'El Salvador': (profile) => {
		const tax = progressiveTax(
			{
				4064: 0,
				9142.87: 0.1,
				22857.14: 0.2,
				Infinity: 0.3,
			},
			profile.incomeUSD
		)

		return { percentage: tax / profile.incomeUSD }
	},
	Guatemala: (profile, exchangeRates) => {
		const exchangeRateGTQ = exchangeRates['GTQ'] || 1
		if (!exchangeRateGTQ) {
			console.error('Exchange rate for GTQ is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateGTQ
		const tax = progressiveTax(
			{
				300000: 0.05,
				Infinity: 0.07,
			},
			localCurrencyIncome
		)

		return { percentage: tax / localCurrencyIncome }
	},
	// No information, part of Guatemala?
	Belize: defaultTaxStrategy,
	// Non-residents pay 34%
	Venezuela: (profile, exchangeRates) => {
		const exchangeRateVES = exchangeRates['VES'] || 1
		if (!exchangeRateVES) {
			console.error('Exchange rate for VES is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateVES
		const tax = progressiveTax(
			{
				1000: 0.06,
				1500: 0.09,
				2000: 0.12,
				2500: 0.16,
				3000: 0.2,
				4000: 0.24,
				6000: 0.29,
				Infinity: 0.34,
			},
			localCurrencyIncome
		)

		return { percentage: tax / localCurrencyIncome }
	},
	Guyana: (profile, exchangeRates) => {
		const exchangeRateGYD = exchangeRates['GYD'] || 1
		if (!exchangeRateGYD) {
			console.error('Exchange rate for GYD is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateGYD
		const tax = progressiveTax(
			{
				2040000: 0.28,
				Infinity: 0.4,
			},
			localCurrencyIncome
		)

		return { percentage: tax / localCurrencyIncome }
	},
  // Types of income
	Suriname: (profile, exchangeRates) => {
		const exchangeRateSRD = exchangeRates['SRD'] || 1
		if (!exchangeRateSRD) {
			console.error('Exchange rate for SRD is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateSRD
		const tax = progressiveTax(
			{
				108000: 0,
				150000: 0.08,
				192000: 0.18,
				234000: 0.28,
				Infinity: 0.38,
			},
			localCurrencyIncome
		)

		return { percentage: tax / localCurrencyIncome }
	},
  // Types of income
  // Depends on Single or Maried plus kids
  // Here is for Single
	France: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR'] || 1
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateEUR
		const tax = progressiveTax(
			{
				10777: 0,
        27478: 0.11,
        78570: 0.3,
        168994: 0.41,
        Infinity: 0.45,
			},
			localCurrencyIncome
		)

		return { percentage: tax / localCurrencyIncome }
	},
	Ecuador: (profile) => {
		const tax = progressiveTax(
			{
				11902: 0,
				15159: 0.05,
				19682: 0.1,
				26031: 0.12,
				34255: 0.15,
				45407: 0.2,
				60450: 0.25,
				80605: 0.3,
				107199: 0.35,
				Infinity: 0.37,
			},
			profile.incomeUSD
		)

		return { percentage: tax / profile.incomeUSD }
	},
	'Puerto Rico': (profile) => {
		const tax = progressiveTax(
			{
				9000: 0,
				25000: 0.07,
				41500: 0.14,
				61500: 0.25,
				Infinity: 0.33,
			},
			profile.incomeUSD
		)
		const alternateTax = progressiveTax(
			{
				25000: 0,
				50000: 0.01,
				75000: 0.03,
				150000: 0.05,
				250000: 0.1,
				Infinity: 0.24,
			},
			profile.incomeUSD
		)
		const totalTax = tax + alternateTax
		return { percentage: totalTax / profile.incomeUSD }
	},
	Jamaica: (profile, exchangeRates) => {
		const exchangeRateJMD = exchangeRates['JMD'] || 1
		if (!exchangeRateJMD) {
			console.error('Exchange rate for JMD is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateJMD
		const tax = progressiveTax(
			{
				1500000: 0,
				6000000: 0.25,
				Infinity: 0.3,
			},
			localCurrencyIncome
		)

		return { percentage: tax / localCurrencyIncome }
	},
  // No information
	Cuba: (profile, exchangeRates) => {
		const exchangeRateCUP = exchangeRates['CUP'] || 1
		if (!exchangeRateCUP) {
			console.error('Exchange rate for CUP is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateCUP
		const tax = progressiveTax(
			{
				10500: 0,
				30000: 0.15,
				60000: 0.2,
				90000: 0.3,
				Infinity: 0.5,
			},
			localCurrencyIncome
		)

		return { percentage: tax / localCurrencyIncome }
	},
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
	// Types of income
	Paraguay: (profile, exchangeRates) => {
		const exchangeRatePYG = exchangeRates['PYG'] || 1
		if (!exchangeRatePYG) {
			console.error('Exchange rate for PYG is not available.')
			return defaultTaxStrategy()
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRatePYG
		const tax = progressiveTax(
			{
				50000000: 0.08,
				150000000: 0.09,
				Infinity: 0.1,
			},
			localCurrencyIncome
		)

		return { percentage: tax / localCurrencyIncome }
	},
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
