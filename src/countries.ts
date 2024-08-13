interface Profile {
	incomeUSD: number
	married: boolean
	oneIncome: boolean
}
export interface TaxSummary {
	percentage: number | undefined
	link?: string
	notice?: string
}
interface TaxStrategy {
	(profile: Profile, exchangeRates: Record<string, number>): TaxSummary
}

interface TaxStrategies {
	[name: string]: TaxStrategy
}

export function defaultTaxStrategy(notice?: string): TaxSummary {
	return { percentage: undefined, notice }
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
		const exchangeRateFJD = exchangeRates['FJD']
		if (!exchangeRateFJD) {
			console.error('Exchange rate for FJD is not available.')
			return defaultTaxStrategy('Exchange rate for FJD is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateFJD
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

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/fiji/individual/taxes-on-personal-income',
			notice: 'There are types of income',
		}
	},
	Tanzania: (profile, exchangeRates) => {
		const exchangeRateTZS = exchangeRates['TZS']
		if (!exchangeRateTZS) {
			console.error('Exchange rate for TZS is not available.')
			return defaultTaxStrategy('Exchange rate for TZS is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateTZS
		const tax = progressiveTax(
			{
				270000: 0,
				520000: 0.08,
				760000: 0.2,
				1000000: 0.25,
				Infinity: 0.3,
			},
			localCurrencyIncome
		)
		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/tanzania/individual/taxes-on-personal-income',
			notice: 'There are types of income',
		}
	},
	'W. Sahara': () => defaultTaxStrategy('No information'),
	// Resident/Non-resident
	Canada: (profile, exchangeRates) => {
		const exchangeRateCAD = exchangeRates['CAD']
		if (!exchangeRateCAD) {
			console.error('Exchange rate for CAD is not available.')
			return defaultTaxStrategy('Exchange rate for CAD is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateCAD
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

		return {
			percentage: totalTax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/canada/individual/taxes-on-personal-income',
			notice:
				'British Columbia provincial/territorial tax taken here. Taxes depend on location and type, there are additional territorial income taxes and special tax system in Quebec',
		}
	},
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

		return {
			percentage: tax / profile.incomeUSD,
			link: 'https://taxsummaries.pwc.com/united-states/individual/taxes-on-personal-income',
			notice:
				'Taxes strongly depend on location, type, marriage, kids, there are additional income taxes. Here is for single taxpayer',
		}
	},
	Kazakhstan: (profile, exchangeRates) => {
		const exchangeRateKZT = exchangeRates['KZT']
		if (!exchangeRateKZT) {
			console.error('Exchange rate for KZT is not available.')
			return defaultTaxStrategy('Exchange rate for KZT is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateKZT
		const tax = localCurrencyIncome * 0.1

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/kazakhstan/individual/taxes-on-personal-income',
		}
	},
	Uzbekistan: (profile, exchangeRates) => {
		const exchangeRateUZS = exchangeRates['UZS']
		if (!exchangeRateUZS) {
			console.error('Exchange rate for UZS is not available.')
			return defaultTaxStrategy('Exchange rate for UZS is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateUZS
		const tax = localCurrencyIncome * 0.12
		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/republic-of-uzbekistan/individual/taxes-on-personal-income',
			notice: 'There are types of income',
		}
	},
	'Papua New Guinea': (profile, exchangeRates) => {
		const exchangeRatePGK = exchangeRates['PGK']
		if (!exchangeRatePGK) {
			console.error('Exchange rate for PGK is not available.')
			return defaultTaxStrategy('Exchange rate for PGK is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRatePGK
		const tax = progressiveTax(
			{
				20000: 0.3,
				33000: 0.35,
				70000: 0.4,
				Infinity: 0.42,
			},
			localCurrencyIncome
		)
		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/papua-new-guinea/individual/taxes-on-personal-income',
		}
	},
	Indonesia: (profile, exchangeRates) => {
		const exchangeRateIDR = exchangeRates['IDR']
		if (!exchangeRateIDR) {
			console.error('Exchange rate for IDR is not available.')
			return defaultTaxStrategy('Exchange rate for IDR is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateIDR
		const tax = progressiveTax(
			{
				60000000: 0.05,
				250000000: 0.15,
				500000000: 0.25,
				5000000000: 0.3,
				Infinity: 0.35,
			},
			localCurrencyIncome
		)
		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/indonesia/individual/taxes-on-personal-income',
			notice: 'Additional taxes on several payments',
		}
	},
	// Non-residents pay 24.5%
	Argentina: (profile, exchangeRates) => {
		const exchangeRateARS = exchangeRates['ARS']
		if (!exchangeRateARS) {
			console.error('Exchange rate for ARS is not available.')
			return defaultTaxStrategy('Exchange rate for ARS is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateARS
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

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/argentina/individual/taxes-on-personal-income',
			notice: 'There are types of income',
		}
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

		return {
			percentage: tax / profile.incomeUSD,
			link: 'https://taxsummaries.pwc.com/chile/individual/taxes-on-personal-income',
		}
	},
	'Dem. Rep. Congo': (profile, exchangeRates) => {
		const exchangeRateCDF = exchangeRates['CDF']
		if (!exchangeRateCDF) {
			console.error('Exchange rate for CDF is not available.')
			return defaultTaxStrategy('Exchange rate for CDF is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateCDF
		const tax = progressiveTax(
			{
				1944000: 0.03,
				21600000: 0.15,
				43200000: 0.3,
				Infinity: 0.4,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/democratic-republic-of-the-congo/individual/taxes-on-personal-income',
			notice: 'There are types of income',
		}
	},
	Somalia: () => defaultTaxStrategy('No information'),
	Malta: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR']
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy('Exchange rate for EUR is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateEUR
		const tax = progressiveTax(
			{
				9100: 0,
				14500: 0.15,
				19500: 0.25,
				60000: 0.25,
				Infinity: 0.35,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/malta/individual/taxes-on-personal-income',
			notice: 'There are types of income. Depends on marriage and kids. Here is for single.',
		}
	},
	Kenya: (profile, exchangeRates) => {
		const exchangeRateKES = exchangeRates['KES']
		if (!exchangeRateKES) {
			console.error('Exchange rate for KES is not available.')
			return defaultTaxStrategy('Exchange rate for KES is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateKES
		const tax = progressiveTax(
			{
				288000: 0.1,
				388000: 0.25,
				6000000: 0.3,
				9600000: 0.325,
				Infinity: 0.35,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/kenya/individual/taxes-on-personal-income',
			notice: 'There are types of income.',
		}
	},
	Sudan: () => defaultTaxStrategy('No information'),
	Chad: (profile, exchangeRates) => {
		const exchangeRateXAF = exchangeRates['XAF']
		if (!exchangeRateXAF) {
			console.error('Exchange rate for XAF is not available.')
			return defaultTaxStrategy('Exchange rate for XAF is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateXAF
		const tax = progressiveTax(
			{
				800000: 0,
				6000000: 0.105,
				7500000: 0.15,
				9000000: 0.2,
				12000000: 0.25,
				Infinity: 0.3,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/chad/individual/taxes-on-personal-income',
			notice: 'There are types of income.',
		}
	},
	Haiti: (profile, exchangeRates) => {
		const exchangeRateHTG = exchangeRates['HTG']
		if (!exchangeRateHTG) {
			console.error('Exchange rate for HTG is not available.')
			return defaultTaxStrategy('Exchange rate for HTG is not available.')
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

		return {
			percentage: tax / localCurrencyIncome,
			link: `Information taken from "Worldwide Personal Tax and Immigration Guide
2023-2024"`,
		}
	},
	'Dominican Rep.': (profile, exchangeRates) => {
		const exchangeRateDOP = exchangeRates['DOP']
		if (!exchangeRateDOP) {
			console.error('Exchange rate for DOP is not available.')
			return defaultTaxStrategy('Exchange rate for DOP is not available.')
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

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/dominican-republic/individual/taxes-on-personal-income',
		}
	},
	Russia: (profile, exchangeRates) => {
		const exchangeRateRUB = exchangeRates['RUB']
		if (!exchangeRateRUB) {
			console.error('Exchange rate for RUB is not available.')
			return defaultTaxStrategy('Exchange rate for RUB is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateRUB
		const tax = progressiveTax(
			{
				5000000: 0.13,
				Infinity: 0.15,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: `Information taken from "Worldwide Personal Tax and Immigration Guide
      2023-2024"`,
			notice: 'There are types of income',
		}
	},
	Bahamas: () => {
		const tax = 0
		return {
			percentage: tax,
			link: `Information taken from "Worldwide Personal Tax and Immigration Guide
      2023-2024"`,
			notice: 'Income is not taxed in the Bahamas',
		}
	},
	'Falkland Is.': (profile, exchangeRates) => {
		const exchangeRateFKP = exchangeRates['FKP']
		if (!exchangeRateFKP) {
			console.error('Exchange rate for FKP is not available.')
			return defaultTaxStrategy('Exchange rate for FKP is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateFKP

		const tax = progressiveTax(
			{
				12000: 0.21,
				Infinity: 0.26,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: `Information taken from "Worldwide Personal Tax and Immigration Guide
      2023-2024"`,
			notice: 'There are types of income',
		}
	},
	Norway: (profile, exchangeRates) => {
		const exchangeRateNOK = exchangeRates['NOK']
		if (!exchangeRateNOK) {
			console.error('Exchange rate for NOK is not available.')
			return defaultTaxStrategy('Exchange rate for NOK is not available.')
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

		return {
			percentage: totalTax / localCurrencyIncome,
			link: `https://taxsummaries.pwc.com/norway/individual/taxes-on-personal-income`,
			notice: 'Dual tax base system: general income and personal income',
		}
	},
	Greenland: (profile, exchangeRates) => {
		const exchangeRateDKK = exchangeRates['DKK']
		if (!exchangeRateDKK) {
			console.error('Exchange rate for DKK is not available.')
			return defaultTaxStrategy('Exchange rate for DKK is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateDKK
		const tax = localCurrencyIncome * 0.44

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/greenland/individual/taxes-on-personal-income',
			notice: 'Taxes depend on location from 36% to 44%',
		}
	},
	'Fr. S. Antarctic Lands': () => defaultTaxStrategy('No information'),
	'Timor-Leste': (profile) => {
		const tax = progressiveTax(
			{
				6000: 0,
				Infinity: 0.1,
			},
			profile.incomeUSD
		)

		return {
			percentage: tax / profile.incomeUSD,
			link: 'https://taxsummaries.pwc.com/timor-leste/individual/taxes-on-personal-income',
			notice: 'There are types of income.',
		}
	},
	'South Africa': (profile, exchangeRates) => {
		const exchangeRateZAR = exchangeRates['ZAR']
		if (!exchangeRateZAR) {
			console.error('Exchange rate for ZAR is not available.')
			return defaultTaxStrategy('Exchange rate for ZAR is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateZAR
		const tax = progressiveTax(
			{
				237100: 0.18,
				370500: 0.26,
				512800: 0.31,
				673000: 0.36,
				857900: 0.39,
				1817000: 0.41,
				Infinity: 0.45,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/south-africa/individual/taxes-on-personal-income',
		}
	},
	Lesotho: (profile, exchangeRates) => {
		const exchangeRateLSL = exchangeRates['LSL']
		if (!exchangeRateLSL) {
			console.error('Exchange rate for LSL is not available.')
			return defaultTaxStrategy('Exchange rate for LSL is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateLSL
		const tax = progressiveTax(
			{
				69120: 0.2,
				Infinity: 0.3,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: `Information taken from "Worldwide Personal Tax and Immigration Guide
      2023-2024"`,
			notice: 'There are types of income.',
		}
	},
	// Resident or Non-Resident
	Mexico: (profile, exchangeRates) => {
		const exchangeRateMXN = exchangeRates['MXN']
		if (!exchangeRateMXN) {
			console.error('Exchange rate for MXN is not available.')
			return defaultTaxStrategy('Exchange rate for MXN is not available.')
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

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/mexico/individual/taxes-on-personal-income',
		}
	},
	// Resident or Non-Resident
	Uruguay: (profile, exchangeRates) => {
		const exchangeRateUYU = exchangeRates['UYU']
		if (!exchangeRateUYU) {
			console.error('Exchange rate for UYU is not available.')
			return defaultTaxStrategy('Exchange rate for UYU is not available.')
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

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/uruguay/individual/taxes-on-personal-income',
			notice: 'Depends on marriage. Here is for single.',
		}
	},
	Brazil: (profile, exchangeRates) => {
		const exchangeRateBRL = exchangeRates['BRL']
		if (!exchangeRateBRL) {
			console.error('Exchange rate for BRL is not available.')
			return defaultTaxStrategy('Exchange rate for BRL is not available.')
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

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/brazil/individual/taxes-on-personal-income',
		}
	},
	Bolivia: (profile, exchangeRates) => {
		const exchangeRateBOB = exchangeRates['BOB']
		if (!exchangeRateBOB) {
			console.error('Exchange rate for BOB is not available.')
			return defaultTaxStrategy('Exchange rate for BOB is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateBOB
		const tax = localCurrencyIncome * 0.13

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/bolivia/individual/taxes-on-personal-income',
		}
	},
	// Non-Residents pay 30%
	Peru: (profile, exchangeRates) => {
		const exchangeRatePEN = exchangeRates['PEN']
		if (!exchangeRatePEN) {
			console.error('Exchange rate for PEN is not available.')
			return defaultTaxStrategy('Exchange rate for PEN is not available.')
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

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/peru/individual/taxes-on-personal-income',
			notice: 'There are types of income',
		}
	},
	Colombia: (profile, exchangeRates) => {
		const exchangeRateCOP = exchangeRates['COP']
		if (!exchangeRateCOP) {
			console.error('Exchange rate for COP is not available.')
			return defaultTaxStrategy('Exchange rate for COP is not available.')
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

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/colombia/individual/taxes-on-personal-income',
			notice: 'There are types of income',
		}
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

		return {
			percentage: tax / profile.incomeUSD,
			link: 'https://taxsummaries.pwc.com/panama/individual/taxes-on-personal-income',
		}
	},
	// Non-residents pay 10%
	'Costa Rica': (profile, exchangeRates) => {
		const exchangeRateCRC = exchangeRates['CRC']
		if (!exchangeRateCRC) {
			console.error('Exchange rate for CRC is not available.')
			return defaultTaxStrategy('Exchange rate for CRC is not available.')
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

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/costa-rica/individual/taxes-on-personal-income',
			notice:
				'There are types of income: self-employed individuals and employed individuals. Here is for self-employed individuals',
		}
	},
	// Non-residents pay 20%
	Nicaragua: (profile, exchangeRates) => {
		const exchangeRateNIO = exchangeRates['NIO']
		if (!exchangeRateNIO) {
			console.error('Exchange rate for NIO is not available.')
			return defaultTaxStrategy('Exchange rate for NIO is not available.')
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

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/nicaragua/individual/taxes-on-personal-income',
		}
	},
	Honduras: (profile, exchangeRates) => {
		const exchangeRateHNL = exchangeRates['HNL']
		if (!exchangeRateHNL) {
			console.error('Exchange rate for HNL is not available.')
			return defaultTaxStrategy('Exchange rate for HNL is not available.')
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

		return {
			percentage: totalTax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/honduras/individual/taxes-on-personal-income',
		}
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

		return {
			percentage: tax / profile.incomeUSD,
			link: `Information taken from "Worldwide Personal Tax and Immigration Guide
      2023-2024"`,
		}
	},
	Guatemala: (profile, exchangeRates) => {
		const exchangeRateGTQ = exchangeRates['GTQ']
		if (!exchangeRateGTQ) {
			console.error('Exchange rate for GTQ is not available.')
			return defaultTaxStrategy('Exchange rate for GTQ is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateGTQ
		const tax = progressiveTax(
			{
				300000: 0.05,
				Infinity: 0.07,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/guatemala/individual/taxes-on-personal-income',
		}
	},
	Belize: () => defaultTaxStrategy('No information. Part of Guatemala?'),
	// Non-residents pay 34%
	Venezuela: (profile, exchangeRates) => {
		const exchangeRateVES = exchangeRates['VES']
		if (!exchangeRateVES) {
			console.error('Exchange rate for VES is not available.')
			return defaultTaxStrategy('Exchange rate for VES is not available.')
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

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/venezuela/individual/taxes-on-personal-income',
			notice: 'There are tax units',
		}
	},
	Guyana: (profile, exchangeRates) => {
		const exchangeRateGYD = exchangeRates['GYD']
		if (!exchangeRateGYD) {
			console.error('Exchange rate for GYD is not available.')
			return defaultTaxStrategy('Exchange rate for GYD is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateGYD
		const tax = progressiveTax(
			{
				2040000: 0.28,
				Infinity: 0.4,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/guyana/individual/taxes-on-personal-income',
		}
	},
	Suriname: (profile, exchangeRates) => {
		const exchangeRateSRD = exchangeRates['SRD']
		if (!exchangeRateSRD) {
			console.error('Exchange rate for SRD is not available.')
			return defaultTaxStrategy('Exchange rate for SRD is not available.')
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

		return {
			percentage: tax / localCurrencyIncome,
			link: `Information taken from "Worldwide Personal Tax and Immigration Guide
      2023-2024"`,
			notice: 'There are types of income',
		}
	},
	France: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR']
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy('Exchange rate for EUR is not available.')
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

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/france/individual/taxes-on-personal-income',
			notice: 'There are types of income. Depends on marriage and kids. Here is for Single',
		}
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

		return {
			percentage: tax / profile.incomeUSD,
			link: 'https://taxsummaries.pwc.com/ecuador/individual/taxes-on-personal-income',
		}
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
		return {
			percentage: totalTax / profile.incomeUSD,
			link: 'https://taxsummaries.pwc.com/puerto-rico/individual/taxes-on-personal-income',
			notice: 'There are types of income and taxes',
		}
	},
	Jamaica: (profile, exchangeRates) => {
		const exchangeRateJMD = exchangeRates['JMD']
		if (!exchangeRateJMD) {
			console.error('Exchange rate for JMD is not available.')
			return defaultTaxStrategy('Exchange rate for JMD is not available.')
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

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/jamaica/individual/taxes-on-personal-income',
		}
	},
	Cuba: (profile, exchangeRates) => {
		const exchangeRateCUP = exchangeRates['CUP']
		if (!exchangeRateCUP) {
			console.error('Exchange rate for CUP is not available.')
			return defaultTaxStrategy('Exchange rate for CUP is not available.')
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

		return {
			percentage: tax / localCurrencyIncome,
			link: `Information taken from "Worldwide Personal Tax and Immigration Guide
      2023-2024"`,
		}
	},
	Zimbabwe: (profile) => {
		const tax = progressiveTax(
			{
				1200: 0,
				3600: 0.2,
				12000: 0.25,
				24000: 0.3,
				36000: 0.35,
				Infinity: 0.4,
			},
			profile.incomeUSD
		)
		const AIDSlevyTax = profile.incomeUSD * 0.03
		const totalTax = tax + AIDSlevyTax
		return {
			percentage: totalTax / profile.incomeUSD,
			link: 'https://taxsummaries.pwc.com/zimbabwe/individual/taxes-on-personal-income',
			notice:
				'There are types of income.',
		}
	},
	Botswana: (profile, exchangeRates) => {
		const exchangeRateBWP = exchangeRates['BWP']
		if (!exchangeRateBWP) {
			console.error('Exchange rate for BWP is not available.')
			return defaultTaxStrategy('Exchange rate for BWP is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateBWP
		const tax = progressiveTax(
			{
				48000: 0,
				84000: 0.05,
				120000: 0.125,
				156000: 0.1875,
				Infinity: 0.25,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/botswana/individual/taxes-on-personal-income',
		}
	},
	Namibia: (profile, exchangeRates) => {
		const exchangeRateNAD = exchangeRates['NAD']
		if (!exchangeRateNAD) {
			console.error('Exchange rate for NAD is not available.')
			return defaultTaxStrategy('Exchange rate for NAD is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateNAD
		const tax = progressiveTax(
			{
				50000: 0,
				100000: 0.18,
				300000: 0.25,
				500000: 0.28,
				800000: 0.3,
				1500000: 0.32,
				Infinity: 0.37,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/republic-of-namibia/individual/taxes-on-personal-income',
			notice: 'There are types of income.'
		}
	},
	Senegal: (profile, exchangeRates) => {
		const exchangeRateXOF = exchangeRates['XOF']
		if (!exchangeRateXOF) {
			console.error('Exchange rate for XOF is not available.')
			return defaultTaxStrategy('Exchange rate for XOF is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateXOF
		const tax = progressiveTax(
			{
				630000: 0,
				1500000: 0.2,
				4000000: 0.3,
				8000000: 0.35,
				13500000: 0.37,
				50000000: 0.4,
				Infinity: 0.43,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/senegal/individual/taxes-on-personal-income',
			notice: 'There are types of income.'
		}
	},
	Mali: () => defaultTaxStrategy('No information'),
	Mauritania: (profile, exchangeRates) => {
		const exchangeRateMRU = exchangeRates['MRU']
		if (!exchangeRateMRU) {
			console.error('Exchange rate for MRU is not available.')
			return defaultTaxStrategy('Exchange rate for MRU is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateMRU
		const tax = progressiveTax(
			{
				6000: 0,
				9000: 0.15,
				21000: 0.25,
				Infinity: 0.4,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/mauritania/individual/taxes-on-personal-income',
			notice: 'There are types of income.'
		}
	},
	Benin: () => defaultTaxStrategy('No information'),
	Niger: () => defaultTaxStrategy('No information'),
	Nigeria: (profile, exchangeRates) => {
		const exchangeRateNGN = exchangeRates['NGN']
		if (!exchangeRateNGN) {
			console.error('Exchange rate for NGN is not available.')
			return defaultTaxStrategy('Exchange rate for NGN is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateNGN
		const tax = progressiveTax(
			{
				300000: 0.07,
				600000: 0.11,
				1100000: 0.15,
				1600000: 0.19,
				3200000: 0.21,
				Infinity: 0.24,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/nigeria/individual/taxes-on-personal-income',
			notice: 'There are few types of income.'
		}
	},
	Cameroon: (profile, exchangeRates) => {
		const exchangeRateXAF = exchangeRates['XAF']
		if (!exchangeRateXAF) {
			console.error('Exchange rate for XAF is not available.')
			return defaultTaxStrategy('Exchange rate for XAF is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateXAF
		const tax = progressiveTax(
			{
				600000: 0.11,
				1100000: 0.165,
				3200000: 0.275,
				Infinity: 0.385,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/republic-of-cameroon/individual/taxes-on-personal-income',
		}
	},
	Togo: () => defaultTaxStrategy('No information'),
	Ghana: (profile, exchangeRates) => {
		const exchangeRateGHS = exchangeRates['GHS']
		if (!exchangeRateGHS) {
			console.error('Exchange rate for GHS is not available.')
			return defaultTaxStrategy('Exchange rate for GHS is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateGHS
		const tax = progressiveTax(
			{
				4824: 0,
				6144: 0.05,
				7704: 0.1,
				43704: 0.175,
				240444: 0.25,
				600000: 0.3,
				Infinity: 0.35,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/ghana/individual/taxes-on-personal-income',
			notice: 'There are types of income.'
		}
	},
	//  !!!!!!! different formula
	// https://taxsummaries.pwc.com/ivory-coast/individual/taxes-on-personal-income
	"Côte d'Ivoire": (profile, exchangeRates) => {
		const exchangeRateXOF = exchangeRates['XOF']
		if (!exchangeRateXOF) {
			console.error('Exchange rate for XOF is not available.')
			return defaultTaxStrategy('Exchange rate for XOF is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateXOF
		const tax = progressiveTax(
			{
				300000: 0,
				547000: 0.1,
				979000: 0.15,
				1519000: 0.2,
				2644000: 0.25,
				4669000: 0.35,
				10106000: 0.45,
				Infinity: 0.6,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/ivory-coast/individual/taxes-on-personal-income',
		}
	},
	Guinea: (profile, exchangeRates) => {
		const exchangeRateGNF = exchangeRates['GNF']
		if (!exchangeRateGNF) {
			console.error('Exchange rate for GNF is not available.')
			return defaultTaxStrategy('Exchange rate for GNF is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateGNF
		const tax = progressiveTax(
			{
				1000000: 0,
				3000000: 0.05,
				5000000: 0.08,
				10000000: 0.1,
				20000000: 0.15,
				Infinity: 0.2,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: `Information taken from "Worldwide Personal Tax and Immigration Guide
      2023-2024"`,
			notice: 'There are types of income.'
		}
	},
	'Guinea-Bissau': () => defaultTaxStrategy('No information'),
	Liberia: () => defaultTaxStrategy('No information'),
	'Sierra Leone': () => defaultTaxStrategy('No information'),
	'Burkina Faso': () => defaultTaxStrategy('No information'),
	'Central African Rep.': () => defaultTaxStrategy('No information'),
	Congo: (profile, exchangeRates) => {
		const exchangeRateXAF = exchangeRates['XAF']
		if (!exchangeRateXAF) {
			console.error('Exchange rate for XAF is not available.')
			return defaultTaxStrategy('Exchange rate for XAF is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateXAF
		const tax = progressiveTax(
			{
				464000: 0.01,
				1000000: 0.1,
				3000000: 0.25,
				Infinity: 0.4,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/republic-of-congo/individual/taxes-on-personal-income',
		}
	},
	//  !!!!!!! different formula
	// https://taxsummaries.pwc.com/gabon/individual/taxes-on-personal-income
	Gabon: (profile, exchangeRates) => {
		const exchangeRateXAF = exchangeRates['XAF']
		if (!exchangeRateXAF) {
			console.error('Exchange rate for XAF is not available.')
			return defaultTaxStrategy('Exchange rate for XAF is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateXAF
		const tax = progressiveTax(
			{
				1500000: 0,
				1920000: 0.05,
				2700000: 0.1,
				3600000: 0.15,
				5160000: 0.2,
				7500000: 0.25,
				11000000: 0.3,
				Infinity: 0.35,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/gabon/individual/taxes-on-personal-income',
		}
	},
	'Eq. Guinea': () => defaultTaxStrategy('No information'),
	Zambia: (profile, exchangeRates) => {
		const exchangeRateZMW = exchangeRates['ZMW']
		if (!exchangeRateZMW) {
			console.error('Exchange rate for ZMW is not available.')
			return defaultTaxStrategy('Exchange rate for ZMW is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateZMW
		const tax = progressiveTax(
			{
				61200: 0,
				85200: 0.2,
				110400: 0.3,
				Infinity: 0.37,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/zambia/individual/taxes-on-personal-income',
		}
	},
	// 15% for non-residents
	Malawi: (profile, exchangeRates) => {
		const exchangeRateMWK = exchangeRates['MWK']
		if (!exchangeRateMWK) {
			console.error('Exchange rate for MWK is not available.')
			return defaultTaxStrategy('Exchange rate for MWK is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateMWK
		const tax = progressiveTax(
			{
				1800000: 0,
				4200000: 0.25,
				24600000: 0.3,
				Infinity: 0.35,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/malawi/individual/taxes-on-personal-income',
		}
	},
	// 20% for non-residents
	Mozambique: (profile, exchangeRates) => {
		const exchangeRateMZN = exchangeRates['MZN']
		if (!exchangeRateMZN) {
			console.error('Exchange rate for MZN is not available.')
			return defaultTaxStrategy('Exchange rate for MZN is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateMZN
		const tax = progressiveTax(
			{
				42000: 0.1,
				168000: 0.15,
				504000: 0.2,
				1512000: 0.25,
				Infinity: 0.32,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/mozambique/individual/taxes-on-personal-income',
		}
	},
	eSwatini: (profile, exchangeRates) => {
		const exchangeRateSZL = exchangeRates['SZL']
		if (!exchangeRateSZL) {
			console.error('Exchange rate for SZL is not available.')
			return defaultTaxStrategy('Exchange rate for SZL is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateSZL
		const tax = progressiveTax(
			{
				41000: 0,
				100000: 0.2,
				150000: 0.25,
				200000: 0.3,
				Infinity: 0.33,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/eswatini/individual/taxes-on-personal-income',
		}
	},
	Angola: (profile, exchangeRates) => {
		const exchangeRateAOA = exchangeRates['AOA']
		if (!exchangeRateAOA) {
			console.error('Exchange rate for AOA is not available.')
			return defaultTaxStrategy('Exchange rate for AOA is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateAOA
		const tax = progressiveTax(
			{
				100000: 0,
				150000: 0.13,
				200000: 0.16,
				300000: 0.18,
				500000: 0.19,
				1000000: 0.2,
				1500000: 0.21,
				2000000: 0.22,
				2500000: 0.23,
				5000000: 0.24,
				10000000: 0.245,
				Infinity: 0.25,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/angola/individual/taxes-on-personal-income',
			notice: "There are types of income."
		}
	},
	Burundi: () => defaultTaxStrategy('No information'),
	Israel: (profile, exchangeRates) => {
		const exchangeRateILS = exchangeRates['ILS']
		if (!exchangeRateILS) {
			console.error('Exchange rate for ILS is not available.')
			return defaultTaxStrategy('Exchange rate for ILS is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateILS
		const tax = progressiveTax(
			{
				84120: 0.1,
				120720: 0.14,
				193800: 0.2,
				269280: 0.31,
				560280: 0.35,
				721560: 0.47,
				Infinity: 0.5,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/israel/individual/taxes-on-personal-income',
			notice: "Depends on marriage, kids, etc. There are types of income."
		}
	},
	Lebanon: (profile, exchangeRates) => {
		const exchangeRateLBP = exchangeRates['LBP']
		if (!exchangeRateLBP) {
			console.error('Exchange rate for LBP is not available.')
			return defaultTaxStrategy('Exchange rate for LBP is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateLBP
		const tax = progressiveTax(
			{
				27000000: 0.04,
				45000000: 0.07,
				90000000: 0.12,
				150000000: 0.16,
				363000000: 0.21,
				Infinity: 0.25,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/lebanon/individual/taxes-on-personal-income',
			notice: "Depends on marriage, kids, etc. There are types of income."
		}
	},
	Madagascar: (profile, exchangeRates) => {
		const exchangeRateMGA = exchangeRates['MGA']
		if (!exchangeRateMGA) {
			console.error('Exchange rate for MGA is not available.')
			return defaultTaxStrategy('Exchange rate for MGA is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateMGA
		const tax = progressiveTax(
			{
				350000: 0,
				400000: 0.05,
				500000: 0.1,
				600000: 0.15,
				Infinity: 0.2,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/madagascar/individual/taxes-on-personal-income',
			notice: "There are types of income."
		}
	},
	Palestine: (profile, exchangeRates) => {
		const exchangeRateILS = exchangeRates['ILS']
		if (!exchangeRateILS) {
			console.error('Exchange rate for ILS is not available.')
			return defaultTaxStrategy('Exchange rate for ILS is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateILS
		const tax = progressiveTax(
			{
				75000: 0.05,
				150000: 0.1,
				Infinity: 0.15,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: `Information taken from "Worldwide Personal Tax and Immigration Guide
			2023-2024"`,
			notice: "There are types of income and payments"
		}
	},
	Gambia: () => defaultTaxStrategy('No information'),
	Tunisia: (profile, exchangeRates) => {
		const exchangeRateTND = exchangeRates['TND']
		if (!exchangeRateTND) {
			console.error('Exchange rate for TND is not available.')
			return defaultTaxStrategy('Exchange rate for TND is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateTND
		const tax = progressiveTax(
			{
				5000: 0,
				20000: 0.26,
				30000: 0.28,
				50000: 0.32,
				Infinity: 0.35,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/tunisia/individual/taxes-on-personal-income',
			notice: "There are types of income."
		}
	},
	Algeria: (profile, exchangeRates) => {
		const exchangeRateDZD = exchangeRates['DZD']
		if (!exchangeRateDZD) {
			console.error('Exchange rate for DZD is not available.')
			return defaultTaxStrategy('Exchange rate for DZD is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateDZD
		const tax = progressiveTax(
			{
				240000: 0,
				480000: 0.23,
				960000: 0.27,
				1920000: 0.3,
				3840000: 0.33,
				Infinity: 0.35,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/algeria/individual/taxes-on-personal-income',
		}
	},
	Jordan: (profile, exchangeRates) => {
		const exchangeRateJOD = exchangeRates['JOD']
		if (!exchangeRateJOD) {
			console.error('Exchange rate for JOD is not available.')
			return defaultTaxStrategy('Exchange rate for JOD is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateJOD
		const tax = progressiveTax(
			{
				5000: 0.05,
				10000: 0.1,
				15000: 0.15,
				20000: 0.2,
				1000000: 0.25,
				Infinity: 0.3,
			},
			localCurrencyIncome
		)
		let localIncomeTax = 0
		if (localCurrencyIncome > 200000) {
			localIncomeTax = 0.01
		} else {
			localIncomeTax = 0
		}

		const totalTax = tax + localCurrencyIncome * localIncomeTax
		return {
			percentage: totalTax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/jordan/individual/taxes-on-personal-income',
		}
	},
	'United Arab Emirates': () => {
		const tax = 0
		return {
			percentage: tax,
			link: 'https://taxsummaries.pwc.com/united-arab-emirates/individual/taxes-on-personal-income',
			notice: 'Income is not taxed in the UAE',
		}
	},
	Qatar: () => {
		const tax = 0
		return {
			percentage: tax,
			link: 'https://taxsummaries.pwc.com/qatar/individual/taxes-on-personal-income',
			notice: `Income tax is not imposed on employed individuals' salaries, wages, and allowances.
			There are types of income`,
		}
	},
	Kuwait: () => {
		const tax = 0
		return {
			percentage: tax,
			link: 'https://taxsummaries.pwc.com/kuwait/individual/taxes-on-personal-income',
			notice: `There is no personal income tax (PIT) imposed on individuals in Kuwait.`,
		}
	},
	Iraq: (profile, exchangeRates) => {
		const exchangeRateIQD = exchangeRates['IQD']
		if (!exchangeRateIQD) {
			console.error('Exchange rate for IQD is not available.')
			return defaultTaxStrategy('Exchange rate for IQD is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateIQD
		const tax = progressiveTax(
			{
				250000: 0.03,
				500000: 0.05,
				1000000: 0.1,
				Infinity: 0.15,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/iraq/individual/taxes-on-personal-income',
		}
	},
	Oman: () => {
		const tax = 0
		return {
			percentage: tax,
			link: 'https://taxsummaries.pwc.com/oman/individual/taxes-on-personal-income',
			notice: `There is currently no personal income tax (PIT) law enacted in Oman.`,
		}
	},
	Vanuatu: () => defaultTaxStrategy('No information'),
	// 20% for non-residents
	Cambodia: (profile, exchangeRates) => {
		const exchangeRateKHR = exchangeRates['KHR']
		if (!exchangeRateKHR) {
			console.error('Exchange rate for KHR is not available.')
			return defaultTaxStrategy('Exchange rate for KHR is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateKHR
		const tax = progressiveTax(
			{
				1500000: 0,
				2000000: 0.05,
				8500000: 0.1,
				12500000: 0.15,
				Infinity: 0.2,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/cambodia/individual/taxes-on-personal-income',
			notice: "There are types of income."
		}
	},
	Thailand: (profile, exchangeRates) => {
		const exchangeRateTHB = exchangeRates['THB']
		if (!exchangeRateTHB) {
			console.error('Exchange rate for THB is not available.')
			return defaultTaxStrategy('Exchange rate for THB is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateTHB
		const tax = progressiveTax(
			{
				150000: 0,
				300000: 0.05,
				500000: 0.1,
				750000: 0.15,
				1000000: 0.2,
				2000000: 0.25,
				5000000: 0.3,
				Infinity: 0.35,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/thailand/individual/taxes-on-personal-income',
		}
	},
	Laos: (profile, exchangeRates) => {
		const exchangeRateLAK = exchangeRates['LAK']
		if (!exchangeRateLAK) {
			console.error('Exchange rate for LAK is not available.')
			return defaultTaxStrategy('Exchange rate for LAK is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateLAK
		const tax = progressiveTax(
			{
				15600000: 0,
				60000000: 0.05,
				180000000: 0.1,
				300000000: 0.15,
				780000000: 0.2,
				Infinity: 0.25,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/lao-pdr/individual/taxes-on-personal-income',
			notice: "There are types of income."
		}
	},
	// https://taxsummaries.pwc.com/myanmar/individual/taxes-on-personal-income
	Myanmar: () => defaultTaxStrategy(`There is no exact information.
		Progressive rates from 1% to 25% with personal tax relief available.`),
	Vietnam: (profile, exchangeRates) => {
		const exchangeRateVND = exchangeRates['VND']
		if (!exchangeRateVND) {
			console.error('Exchange rate for VND is not available.')
			return defaultTaxStrategy('Exchange rate for VND is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateVND
		const tax = progressiveTax(
			{
				60000000: 0.05,
				120000000: 0.1,
				216000000: 0.15,
				384000000: 0.2,
				624000000: 0.25,
				960000000: 0.3,
				Infinity: 0.35,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/vietnam/individual/taxes-on-personal-income',
			notice: "There are types of income."
		}
	},
	'North Korea': () => defaultTaxStrategy('No information'),
	'South Korea': (profile, exchangeRates) => {
		const exchangeRateKRW = exchangeRates['KRW']
		if (!exchangeRateKRW) {
			console.error('Exchange rate for KRW is not available.')
			return defaultTaxStrategy('Exchange rate for KRW is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateKRW
		const tax = progressiveTax(
			{
				14000: 0.06,
				50000: 0.15,
				88000: 0.24,
				150000: 0.35,
				300000: 0.38,
				500000: 0.4,
				1000000: 0.42,
				Infinity: 0.45,
			},
			localCurrencyIncome
		)
		const localTax = progressiveTax(
			{
				14000: 0.006,
				50000: 0.015,
				88000: 0.024,
				150000: 0.035,
				300000: 0.038,
				500000: 0.04,
				1000000: 0.042,
				Infinity: 0.045,
			},
			localCurrencyIncome
		)
		const totalTax = tax + localTax
		return {
			percentage: totalTax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/republic-of-korea/individual/taxes-on-personal-income',
		}
	},
	// 20% for non-residents
	Mongolia: (profile, exchangeRates) => {
		const exchangeRateMNT = exchangeRates['MNT']
		if (!exchangeRateMNT) {
			console.error('Exchange rate for MNT is not available.')
			return defaultTaxStrategy('Exchange rate for MNT is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateMNT
		const tax = progressiveTax(
			{
				120000000: 0.1,
				180000000: 0.15,
				Infinity: 0.2,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/mongolia/individual/taxes-on-personal-income',
			notice: "There are types of income."
		}
	},
	India: (profile, exchangeRates) => {
		const exchangeRateINR = exchangeRates['INR']
		if (!exchangeRateINR) {
			console.error('Exchange rate for INR is not available.')
			return defaultTaxStrategy('Exchange rate for INR is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateINR
		const tax = progressiveTax(
			{
				300000: 0,
				600000: 0.05,
				900000: 0.1,
				1200000: 0.15,
				1500000: 0.2,
				Infinity: 0.3,
			},
			localCurrencyIncome
		)
		const additionalTax = progressiveTax(
			{
				5000000: 0,
				10000000: 0.1,
				20000000: 0.15,
				Infinity: 0.25,
			},
			localCurrencyIncome
		)
		const healthEduTax = localCurrencyIncome * 0.04
		const totalTax = tax + additionalTax + healthEduTax
		return {
			percentage: totalTax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/india/individual/taxes-on-personal-income',
			notice: "There are types of income, taxes and rebates."
		}
	},
	Bangladesh: () => defaultTaxStrategy('No information'),
	Bhutan: () => defaultTaxStrategy('No information'),
	Nepal: () => defaultTaxStrategy('No information'),
	Pakistan: (profile, exchangeRates) => {
		const exchangeRatePKR = exchangeRates['PKR']
		if (!exchangeRatePKR) {
			console.error('Exchange rate for PKR is not available.')
			return defaultTaxStrategy('Exchange rate for PKR is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRatePKR
		const tax = progressiveTax(
			{
				600000: 0,
				1200000: 0.05,
				2200000: 0.15,
				3200000: 0.25,
				4100000: 0.3,
				Infinity: 0.35,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/pakistan/individual/taxes-on-personal-income',
		}
	},
	Afghanistan: () => defaultTaxStrategy('No information'),
	// 20% for non-residents
	Tajikistan: (profile, exchangeRates) => {
		const exchangeRateTJS = exchangeRates['TJS']
		if (!exchangeRateTJS) {
			console.error('Exchange rate for TJS is not available.')
			return defaultTaxStrategy('Exchange rate for TJS is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateTJS
		const tax = localCurrencyIncome * 0.12

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/tajikistan/individual/taxes-on-personal-income',
			notice: 'There are types of income and taxes.',
		}
	},
	Kyrgyzstan: (profile, exchangeRates) => {
		const exchangeRateKGS = exchangeRates['KGS']
		if (!exchangeRateKGS) {
			console.error('Exchange rate for KGS is not available.')
			return defaultTaxStrategy('Exchange rate for KGS is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateKGS
		const tax = localCurrencyIncome * 0.1

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/kyrgyzstan/individual/taxes-on-personal-income',
		}
	},
	Turkmenistan: (profile, exchangeRates) => {
		const exchangeRateTMT = exchangeRates['TMT']
		if (!exchangeRateTMT) {
			console.error('Exchange rate for TMT is not available.')
			return defaultTaxStrategy('Exchange rate for TMT is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateTMT
		const tax = localCurrencyIncome * 0.1

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/turkmenistan/individual/taxes-on-personal-income',
		}
	},
	Iran: () => defaultTaxStrategy('No information'),
	Syria: () => defaultTaxStrategy('No information'),
	Armenia: (profile, exchangeRates) => {
		const exchangeRateAMD = exchangeRates['AMD']
		if (!exchangeRateAMD) {
			console.error('Exchange rate for AMD is not available.')
			return defaultTaxStrategy('Exchange rate for AMD is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateAMD
		const tax = localCurrencyIncome * 0.2

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/armenia/individual/taxes-on-personal-income',
			notice: 'There are types of income and taxes.',
		}
	},
	// Resident or Non-resident
	Sweden: (profile, exchangeRates) => {
		const exchangeRateSEK = exchangeRates['SEK']
		if (!exchangeRateSEK) {
			console.error('Exchange rate for SEK is not available.')
			return defaultTaxStrategy('Exchange rate for SEK is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateSEK
		const tax = progressiveTax(
			{
				614000: 0.32,
				Infinity: 0.52,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/sweden/individual/taxes-on-personal-income',
			notice: 'There are types of income',
		}
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
	Greece: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR']
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy('Exchange rate for EUR is not available.')
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

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/greece/individual/taxes-on-personal-income',
			notice: 'Plus Real estate property',
		}
	},
	Turkey: (profile, exchangeRates) => {
		const exchangeRateTRY = exchangeRates['TRY']
		if (!exchangeRateTRY) {
			console.error('Exchange rate for TRY is not available.')
			return defaultTaxStrategy('Exchange rate for TRY is not available.')
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

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/turkey/individual/taxes-on-personal-income',
			notice: 'Depends on the type of income and instruments',
		}
	},
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	Albania: (profile, exchangeRates) => {
		const exchangeRateALL = exchangeRates['ALL']
		if (!exchangeRateALL) {
			console.error('Exchange rate for ALL is not available.')
			return defaultTaxStrategy('Exchange rate for ALL is not available.')
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
		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/albania/individual/taxes-on-personal-income',
		}
	},
	Croatia: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR']
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy('Exchange rate for EUR is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateEUR

		const tax = progressiveTax(
			{
				50400: 0.23,
				Infinity: 0.35,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/croatia/individual/taxes-on-personal-income',
			notice: 'Depends on location',
		}
	},
	Switzerland: () => defaultTaxStrategy('Strongly depends on location'),
	Luxembourg: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR']
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy('Exchange rate for EUR is not available.')
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

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/luxembourg/individual/taxes-on-personal-income',
			notice: 'Depends on marriage',
		}
	},
	Belgium: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR']
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy('Exchange rate for EUR is not available.')
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

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/belgium/individual/taxes-on-personal-income',
			notice: 'There are types of income and additional local tax',
		}
	},
	Netherlands: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR']
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy('Exchange rate for EUR is not available.')
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

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/netherlands/individual/taxes-on-personal-income',
			notice: 'There are types of income',
		}
	},
	// Resident or Non-resident
	Portugal: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR']
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy('Exchange rate for EUR is not available.')
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
		return {
			percentage: totalTax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/portugal/individual/taxes-on-personal-income',
		}
	},
	Spain: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR']
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy('Exchange rate for EUR is not available.')
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

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/spain/individual/taxes-on-personal-income',
			notice: 'There are types of income',
		}
		// for each limit which is less then our income we apply current rate to limit
		// then sum each of them until reach limit that is more then income
		// substract previous limit from income and multyply on current rate
		// result plus sum is total tax
	},
	Ireland: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR']
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy('Exchange rate for EUR is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateEUR

		let tax: number
		if (profile.married) {
			if (profile.oneIncome) {
				tax = progressiveTax(
					{
						51000: 0.2,
						Infinity: 0.4,
					},
					localCurrencyIncome
				)
			} else {
				tax = progressiveTax(
					{
						84000: 0.2,
						Infinity: 0.4,
					},
					localCurrencyIncome
				)
			}
		} else {
			if (profile.oneIncome) {
				tax = progressiveTax(
					{
						42000: 0.2,
						Infinity: 0.4,
					},
					localCurrencyIncome
				)
			} else {
				throw new Error('Impossible to have 2 incomes for single taxpayer')
			}
		}
		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/ireland/individual/taxes-on-personal-income',
		}
	},
	'New Caledonia': defaultTaxStrategy,
	'Solomon Is.': defaultTaxStrategy,
	'New Zealand': defaultTaxStrategy,
	Australia: defaultTaxStrategy,
	'Sri Lanka': defaultTaxStrategy,
	China: defaultTaxStrategy,
	Taiwan: defaultTaxStrategy,
	//Resident or Non-resident
	Italy: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR']
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy('Exchange rate for EUR is not available.')
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

		return {
			percentage: totalTax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/italy/individual/taxes-on-personal-income',
			notice: 'There are types of income taxes',
		}
	},
	// Used the ordinary tax scheme by up to 52.07%
	Denmark: (profile, exchangeRates) => {
		const exchangeRateDKK = exchangeRates['DKK']
		if (!exchangeRateDKK) {
			console.error('Exchange rate for DKK is not available.')
			return defaultTaxStrategy('Exchange rate for DKK is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateDKK
		const tax = localCurrencyIncome * 0.5207

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/denmark/individual/taxes-on-personal-income',
			notice: 'Used the ordinary tax scheme by up to 52.07%. There are types of incomes',
		}
	},
	'United Kingdom': (profile, exchangeRates) => {
		const exchangeRateGBP = exchangeRates['GBP']
		if (!exchangeRateGBP) {
			console.error('Exchange rate for GBP is not available.')
			return defaultTaxStrategy('Exchange rate for GBP is not available.')
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

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/united-kingdom/individual/taxes-on-personal-income',
			notice: 'Scotland has other taxes. There are types of incomes',
		}
	},
	Iceland: (profile, exchangeRates) => {
		const exchangeRateISK = exchangeRates['ISK']
		if (!exchangeRateISK) {
			console.error('Exchange rate for ISK is not available.')
			return defaultTaxStrategy('Exchange rate for ISK is not available.')
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

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/iceland/individual/taxes-on-personal-income',
			notice: 'There are types of income',
		}
	},
	Azerbaijan: defaultTaxStrategy,
	Georgia: defaultTaxStrategy,
	Philippines: defaultTaxStrategy,
	Malaysia: defaultTaxStrategy,
	Brunei: defaultTaxStrategy,
	Slovenia: defaultTaxStrategy,
	// Resident/Non-resident
	Finland: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR']
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy('Exchange rate for EUR is not available.')
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

		return {
			percentage: totalTax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/finland/individual/taxes-on-personal-income',
			notice: 'There are types of income taxes',
		}
	},
	Slovakia: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR']
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy('Exchange rate for EUR is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateEUR
		const tax = progressiveTax(
			{
				41445: 0.19,
				Infinity: 0.25,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/slovak-republic/individual/taxes-on-personal-income',
			notice: 'There are types of income',
		}
	},
	Czechia: (profile, exchangeRates) => {
		const exchangeRateCZK = exchangeRates['CZK']
		if (!exchangeRateCZK) {
			console.error('Exchange rate for CZK is not available.')
			return defaultTaxStrategy('Exchange rate for CZK is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateCZK
		const tax = progressiveTax(
			{
				1582812: 0.15,
				Infinity: 0.23,
			},
			localCurrencyIncome
		)

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/czech-republic/individual/taxes-on-personal-income',
			notice: 'There are types of income taxes',
		}
	},
	Eritrea: defaultTaxStrategy,
	Japan: defaultTaxStrategy,
	Paraguay: (profile, exchangeRates) => {
		const exchangeRatePYG = exchangeRates['PYG']
		if (!exchangeRatePYG) {
			console.error('Exchange rate for PYG is not available.')
			return defaultTaxStrategy('Exchange rate for PYG is not available.')
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

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/paraguay/individual/taxes-on-personal-income',
			notice: 'There are types of income',
		}
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
	'Bosnia and Herz.': (profile, exchangeRates) => {
		const exchangeRateBAM = exchangeRates['BAM']
		if (!exchangeRateBAM) {
			console.error('Exchange rate for BAM is not available.')
			return defaultTaxStrategy('Exchange rate for BAM is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateBAM
		const tax = localCurrencyIncome * 0.1

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/bosnia-and-herzegovina/individual/taxes-on-personal-income',
			notice:
				'Small entrepreneurs are taxed at a 2% rate on their total annual revenue, while foreign-source income is taxed at the prescribed absolute amount.',
		}
	},
	Macedonia: (profile, exchangeRates) => {
		const exchangeRateMKD = exchangeRates['MKD']
		if (!exchangeRateMKD) {
			console.error('Exchange rate for MKD is not available.')
			return defaultTaxStrategy('Exchange rate for MKD is not available.')
		}
		const localCurrencyIncome = profile.incomeUSD * exchangeRateMKD
		const tax = localCurrencyIncome * 0.1

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/north-macedonia/individual/taxes-on-personal-income',
			notice: 'There are types of income',
		}
	},
	Serbia: () => defaultTaxStrategy('Depends on the type of income'),
	Montenegro: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR']
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy('Exchange rate for EUR is not available.')
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

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/montenegro/individual/taxes-on-personal-income',
			notice: 'There are types of income: salary or business. Here is only for salary',
		}
	},
	Kosovo: (profile, exchangeRates) => {
		const exchangeRateEUR = exchangeRates['EUR']
		if (!exchangeRateEUR) {
			console.error('Exchange rate for EUR is not available.')
			return defaultTaxStrategy('Exchange rate for EUR is not available.')
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

		return {
			percentage: tax / localCurrencyIncome,
			link: 'https://taxsummaries.pwc.com/kosovo/individual/taxes-on-personal-income',
		}
	},
	'Trinidad and Tobago': defaultTaxStrategy,
	'S. Sudan': defaultTaxStrategy,
}
