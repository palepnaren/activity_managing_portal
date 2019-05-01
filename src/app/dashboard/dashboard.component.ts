import { Component, OnInit, AfterViewInit } from '@angular/core';
// import '../js/histogram.js';
import * as d3 from 'd3';
import { values } from 'd3';
import { WeatherService } from '../service/weather.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  // dataset = [80, 100, 90, 56, 120, 200, 45, 150, 75, 189];
  dataset = [20, 12, 4, 9, 3, 1, 0.5, 15];
  svgHeigth = 400;
  svgWidth = 300;
  padding = 3;
  translate;
  barwidth = (this.svgWidth / this.dataset.length);
  result;
  imgSrc;
  temp;
  minTemp;
  maxTemp;
  humidity;
  description;
  windSpeed;
  date;
  constructor(private service: WeatherService, private route: Router) {

  }

  ngOnInit() {
    this.createGraph();
    this.date = Date.now();

  }

  ngAfterViewInit() {
    this.weather();
  }

  weather() {
    navigator.geolocation.getCurrentPosition(data => {
      this.service.getWeather(data.coords.latitude, data.coords.longitude)
                  .subscribe(res => {
                    this.result = res;
                    const icon = this.result.weather[0].icon;
                    this.imgSrc = 'http://openweathermap.org/img/w/' + icon + '.png';
                    this.temp = this.convertToFahrenheitFromKelvin(this.result.main.temp); // converting into celcius
                    this.maxTemp = this.convertToFahrenheitFromKelvin(this.result.main.temp_max);
                    this.minTemp = this.convertToFahrenheitFromKelvin(this.result.main.temp_min);
                    this.humidity = this.result.main.humidity;
                    this.description = this.result.weather[0].description;
                    this.windSpeed = this.result.wind.speed;
                  });
    });
  }

  convertToFahrenheitFromKelvin(temp) {

    return Math.round((temp * (9 / 5)) - 459.67);

  }


  private createGraph(): void {

    const svg = d3.select('div#graph').append('svg')
                .attr('width', this.svgWidth)
                .attr('height', this.svgHeigth)
                .style('margin', 50)
                .style('background-color', 'white');

    const yScale = d3.scaleLinear()
                    .domain([0, d3.max(this.dataset)])
                    .range([0, this.svgHeigth]);

    const barchart = svg.selectAll('rect')
                     .data(this.dataset)
                     .enter()
                     .append('rect')
                     .attr('y', (d) => {
                        return this.svgHeigth - yScale(d);
                     })
                     .attr('height', (d) => {
                       return yScale(d);
                     })
                     .attr('width', this.barwidth - this.padding)
                     .attr('transform', (d, i) => {
                        this.translate = [this.barwidth * i, 0];
                        return 'translate(' + this.translate + ')';
                     });

    const text = svg.selectAll('text')
                     .data(this.dataset)
                     .enter()
                     .append('text')
                     .text((d) => {
                       return d;
                     })
                     .attr('y', (d, i) => {
                        return this.svgHeigth - yScale(d) - 2;
                     })
                     .attr('x', (d, i) => {
                       return this.barwidth * i;
                     })
                     .attr('fill', 'purple');

  }

}
