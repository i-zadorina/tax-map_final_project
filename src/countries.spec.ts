import { expect, describe, it } from 'vitest'
import {countries} from './countries'

[10_000, 20_000, 30_000, 40_000, 100_000, 500_000].forEach(income => {
	const result = countries.Spain({incomeUSD: income}, {EUR: 1}).percentage
	console.log(`expect(countries.Spain({incomeUSD: ${income}}, {EUR: 1}).percentage).toBe(${result})`)
})

describe('Countries', () => {
	it('calculate for Spain', () => {
		expect(countries.Spain({incomeUSD: 10000}, {EUR: 1}).percentage).toBe(0.19)
		expect(countries.Spain({incomeUSD: 20000}, {EUR: 1}).percentage).toBe(0.208875)
		expect(countries.Spain({incomeUSD: 30000}, {EUR: 1}).percentage).toBe(0.23885)
		expect(countries.Spain({incomeUSD: 40000}, {EUR: 1}).percentage).toBe(0.2625375)
		expect(countries.Spain({incomeUSD: 100000}, {EUR: 1}).percentage).toBe(0.359015)
		expect(countries.Spain({incomeUSD: 500000}, {EUR: 1}).percentage).toBe(0.439803)
	})
})
