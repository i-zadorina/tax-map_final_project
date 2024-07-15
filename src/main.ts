import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { countries } from './countries';

// Set up the SVG canvas dimensions
const width = 960;
const height = 600;

// Create an SVG element
const svg = d3.select("svg")
  .attr("width", width)
  .attr("height", height);

// Define a projection and path generator
const projection = d3.geoMercator()
  .scale(150)
  .translate([width / 2, height / 1.5]);

interface Country {
  type: string;
  id: string;
  properties: Properties;
  geometry: Geometry;
}

interface Geometry {
  type: string;
  coordinates: number[][][];
}

interface Properties {
  name: string;
  value: number;
}
  
const path = d3.geoPath().projection(projection);

// Load and process the TopoJSON data
d3.json('/countries-110m.json').then((topoData: any) => {
  const geoData = topojson.feature(topoData, topoData.objects.countries) as unknown as {features: Country[]};

  // // Function to calculate values for each country
  // function calculateValue(country: Country) {
  //   return countries[country.properties.name]?.({ income: 60000 })?.percentage ?? 0 ;
  // }

// Function to calculate values for each country
function calculateValue(country: Country) {
  const profile = {
    income: 80500,  
    resident: true,
  };

  // Check if the country has a tax strategy defined
  if (countries[country.properties.name]) {
    return countries[country.properties.name](profile)?.percentage ?? 0;
  } else {
    return 0;  // Default value if no strategy is defined
  }
}


  // Bind values to GeoJSON data
  geoData.features.forEach((feature: any) => {
    feature.properties.value = calculateValue(feature);
  });

  // Create a color scale
  const colorScale = d3.scaleSequential(d3.interpolateBlues)
    .domain([0, 1]);

  // Render the countries
  svg.selectAll(".country")
    .data(geoData.features)
    .enter().append("path")
    .attr("class", "country")
    // @ts-ignore
    .attr("d", path)
    .attr("fill", (d: any) => colorScale(d.properties.value))
    .on("mouseover", function(event: any, d: any) {
      d3.select(this).attr("fill", "orange");
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip.html(`Tax rate: ${(d.properties.value * 100).toFixed(2)}`)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(d: any) {
      d3.select(this).attr("fill", (d: any) => colorScale(d.properties.value));
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });

  // Add a tooltip
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
});
