import * as d3 from "d3";
import * as topojson from "topojson-client";
import { countries, loadExchangeRates } from "./countries";

// Set up the SVG canvas dimensions
const width = 960;
const height = 600;

// Create an SVG element
const svg = d3.select("svg").attr("width", width).attr("height", height);

// Define a projection and path generator
const projection = d3
  .geoMercator()
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

loadExchangeRates()
  .then(() => {
    d3.json("/countries-110m.json")
      .then((topoData: any) => {
        const geoData = topojson.feature(topoData, topoData.objects.countries) as unknown as {features: Country[]};
        geoData.features.forEach((feature: any) => {
          const countryName = feature.properties.name;
          const taxStrategy = countries[countryName];
          if (taxStrategy) {const taxResult = taxStrategy({ incomeUSD: 200000 }); 
            feature.properties.value = taxResult.percentage ?? 0;
          } else {
            console.error(`No tax strategy found for country ${countryName}`);
            feature.properties.value = 0;
          }
        });

        // // Bind values to GeoJSON data
        // geoData.features.forEach((feature: any) => {
        //   feature.properties.value = calculateValue(feature);
        // });

        // Create a color scale
        const colorScale = d3
          .scaleSequential(d3.interpolateBlues)
          .domain([0, 0.8]);

        // Render the countries
        svg
          .selectAll(".country")
          .data(geoData.features)
          .enter()
          .append("path")
          .attr("class", "country")
          // @ts-ignore
          .attr("d", path)
          .attr("fill", (d: any) => colorScale(d.properties.value))
          .on("mouseover", function (event: any, d: any) {
            d3.select(this).attr("fill", "orange");
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip
              .html(
                `${d.properties.name}<br>Tax rate: ${(
                  d.properties.value * 100
                ).toFixed(2)}%`
              )
              .style("left", event.pageX + "px")
              .style("top", event.pageY - 28 + "px");
          })
          .on("mouseout", function (d: any) {
            d3.select(this).attr("fill", (d: any) =>
              colorScale(d.properties.value)
            );
            tooltip.transition().duration(500).style("opacity", 0);
          });

        // Add a tooltip
        const tooltip = d3
          .select("body")
          .append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);
      })
      .catch((error) => {
        console.error("Error loading geographic data", error);
      });
  })
  .catch((error) => {
    console.error("Error loading exchange rates", error);
  });
