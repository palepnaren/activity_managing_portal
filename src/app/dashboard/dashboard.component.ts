import { AngularFireDatabase } from '@angular/fire/database';
import { UserService } from './../service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, AfterViewInit } from '@angular/core';
// import '../js/histogram.js';
import * as d3 from 'd3';
import { WeatherService } from '../service/weather.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  // dataset = [80, 100, 90, 56, 120, 200, 45, 150, 75, 189];
  dataset = [];
  padding = 3;
  translate;
  message;
  key;
  database;
  barwidth;
  svg;
  xAxisGroup;
  yAxisGroup;
  xScale;
  yScale;
  xAxis;
  yAxis;
  barchart;
  graph;
  bounds;
  t;
  chart;
  i = 0;
  events = ['value', 'child_added', 'child_removed', 'child_moved', 'child_changed'];
  // result;
  // imgSrc;
  // temp;
  // humidity;
  // windSpeed;
  fGroup: FormGroup;
  margin = { top: 20, right: 20, bottom: 100, left: 100 };
  Width;
  Heigth;

constructor(private service: WeatherService, private route: Router,
            private fbuilder: FormBuilder, private userService: UserService, private db: AngularFireDatabase) {
  }

ngOnInit() {
    this.fGroup = this.fbuilder.group({
      date: ['', [Validators.required]],
      appointment: ['', [Validators.required]]
    });


    this.svg = d3.select('svg');
    this.database = this.db.database.ref('/users');

  }

ngAfterViewInit() {


  this.createGraph();
  window.addEventListener('resize', this.createGraph);

  this.database.child('/' + sessionStorage.getItem('email').split('@')[0]).on('value', (snapshot) => {
      this.key = Object.keys(snapshot.val());
    });

  setTimeout(() => {
      for (this.i = 0; this.i < this.events.length; this.i++) {
        this.database.child('/' + sessionStorage.getItem('email').split('@')[0] + '/' + this.key)
      .child('/process').on(this.events[this.i], (snapshot) => {
        this.key = Object.keys(snapshot.val());
        for (this.i = 0; this.i < this.key.length; this.i++) {
          // tslint:disable-next-line:radix
          this.dataset.push(snapshot.val()[this.key[this.i]]);
        }
        // console.log(this.dataset);
        this.updateGraphData(this.dataset);
      });
      }
      // console.log(this.dataset);
      // this.updateGraphData(this.dataset);
    }, 2000);
  }

  // weather() {
  //   navigator.geolocation.getCurrentPosition(data => {
  //     this.service.getWeather(data.coords.latitude, data.coords.longitude)
  //                 .subscribe(res => {
  //                   this.result = res;
  //                   const icon = this.result.weather[0].icon;
  //                   this.imgSrc = 'http://openweathermap.org/img/w/' + icon + '.png';
  //                   this.temp = this.convertToFahrenheitFromKelvin(this.result.main.temp); // converting into celcius
  //                   this.humidity = this.result.main.humidity;
  //                   this.windSpeed = this.result.wind.speed;
  //                 });
  //   });
  // }

  // convertToFahrenheitFromKelvin(temp) {

  //   return Math.round((temp * (9 / 5)) - 459.67);

  // }

numOfappointments(date, numOfProcess) {

    const obj = {
      todayDate: date,
      num: numOfProcess
    };

    this.userService.updateProcess(obj, sessionStorage.getItem('email')).subscribe(res => {
       this.message = res;
    });
  }


  private createGraph(): void {


    this.t = d3.transition().duration(1500);


    this.bounds = this.svg.node().getBoundingClientRect();
    // console.log(this.bounds);
    this.Width = this.bounds.width - this.margin.left - this.margin.right;
    this.Heigth = this.bounds.height - this.margin.top - this.margin.bottom;

    console.log(this.Width);
    console.log(this.Heigth);

    this.graph = this.svg.append('g')
                  .attr('width', this.Width)
                  .attr('height', this.Heigth)
                  .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    this.xAxisGroup = this.graph.append('g')
                        .attr('transform', `translate(0,${this.Heigth})`);

    this.yAxisGroup = this.graph.append('g');

    this.xScale = d3.scaleBand()
                    .range([0, this.Width])
                    .paddingInner(0.2)
                    .paddingOuter(0.2);

    this.yScale = d3.scaleLinear()
                    .range([this.Heigth, 0]);

    this.xAxis = d3.axisBottom(this.xScale);

    this.yAxis = d3.axisLeft(this.yScale)
                    .ticks(10, '%')
                    .tickFormat(d => d + '');

    this.yAxisGroup.selectAll('text')
              .attr('fill', 'blue');

    this.xAxisGroup.selectAll('text')
              .attr('transform', `rotate(${-40})`)
              .attr('text-anchor', 'end')
              .attr('fill', 'blue');


  }

  updateGraphData(data) {


      // console.log(data);

      // tslint:disable-next-line:radix
      const min = d3.min(data.map(d => Number.parseInt(d.num)));
      // tslint:disable-next-line:radix
      const max = d3.max(data.map(d => Number.parseInt(d.num)));


      // update the scales
      this.yScale.domain([0, max]);
      this.xScale.domain(data.map(d => d.todayDate));


      const barchart = this.graph.selectAll('rect')
                      .data(data);

      barchart.attr('width', this.xScale.bandwidth())
              .attr('fill', 'lightblue')
              .attr('x', d => this.xScale(d.todayDate));

      barchart.enter()
              .append('rect')
              .attr('height', 0)
              .attr('fill', 'lightblue')
              .attr('x', d => this.xScale(d.todayDate))
              .attr('y', this.Heigth)
              .merge(barchart)
              .transition(this.t)
                    .attrTween('width', d => {
                      const i = d3.interpolate(0, this.xScale.bandwidth());

                      return (t) => {
                          return i(t);
                      };
                    })
                    .attr('y', d => this.yScale(d.num))
                    .attr('height', d => this.Heigth - this.yScale(d.num));

    // updatin any deleted data
      barchart.exit().remove();

      this.xAxisGroup.call(this.xAxis);
      this.yAxisGroup.call(this.yAxis);
    }

}
