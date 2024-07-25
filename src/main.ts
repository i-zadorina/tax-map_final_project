import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import { countries, TaxSummary } from './countries'

// Set up the SVG canvas dimensions
const width = 960
const height = 600

// Create an SVG element
const svg = d3.select('svg').attr('width', width).attr('height', height)

// Define a projection and path generator
const projection = d3
	.geoMercator()
	.scale(150)
	.translate([width / 2, height / 1.5])

interface Country {
	type: string
	id: string
	properties: Properties
	geometry: Geometry
}

interface Geometry {
	type: string
	coordinates: number[][][]
}

interface Properties {
	name: string
	taxSummary?: TaxSummary
}

const path = d3.geoPath().projection(projection)

// Create a color scale
const colorScale = d3.scaleSequential(d3.interpolateRgb('#96d363', '#b80707')).domain([0, 0.8])
function fill(d: Country) {
	const value = d.properties.taxSummary?.percentage
	return value === undefined ? '#d3d1d1' : colorScale(value)
}

// Exchange Rates
export function loadExchangeRates() {
	return fetch('https://open.er-api.com/v6/latest/USD')
		.then((response) => {
			return response.json()
		})
		.catch((error) => {
			console.error('Error fetching exchange rates', error)
			throw error
		})
}

loadExchangeRates()
	.then((exchangeRates) => {
		d3.json('/countries-110m.json')
			.then((topoData: any) => {
				const geoData = topojson.feature(topoData, topoData.objects.countries) as unknown as {
					features: Country[]
				}
				geoData.features.forEach((feature) => {
					const countryName = feature.properties.name
					const taxStrategy = countries[countryName]
					if (taxStrategy) {
						const taxResult = taxStrategy({ incomeUSD: 100000, married: false, oneIncome: true }, exchangeRates.rates)
						feature.properties.taxSummary = taxResult
					} else {
						console.error(`No tax strategy found for country ${countryName}`)
					}
				})

				// Render the countries
				svg
					.selectAll('.country')
					.data(geoData.features)
					.enter()
					.append('path')
					.attr('class', 'country')
					// @ts-ignore
					.attr('d', path)
					.attr('fill', fill)
					.on('mouseover', function (event: MouseEvent, feature: Country) {
						d3.select(this).attr('fill', 'orange')
						tooltip.transition().duration(200).style('opacity', 0.9)
						tooltip
							.html(`${feature.properties.name}<br>
								Tax rate: ${formatTaxRate(feature.properties.taxSummary?.percentage)}<br>
								${createLink(feature.properties.taxSummary?.link)}`)
							.style('left', event.pageX + 'px')
							.style('top', event.pageY - 28 + 'px')
					})
					.on('mouseout', function (e: MouseEvent, d: Country) {
						// alert(e.relatedTarget)
						d3.select(this).attr('fill', fill(d))
						tooltip.transition().duration(500).style('opacity', 0)
					})

				// Add a tooltip
				const tooltip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0)
			})
			.catch((error) => {
				console.error('Error loading geographic data', error)
			})
	})
	.catch((error) => {
		console.error('Error loading exchange rates', error)
	})

function formatTaxRate(rate: number | undefined) {
	return rate === undefined ? 'n/a' : (rate * 100).toFixed(2) + '%'
}
function createLink(link: string | undefined){
  if (link){
    return `<a href="${link}">More details...</a>`
  }
}