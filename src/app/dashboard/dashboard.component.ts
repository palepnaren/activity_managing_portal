import { AngularFireDatabase } from '@angular/fire/database';
import { UserService } from './../service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, AfterViewInit } from '@angular/core';
// import '../js/histogram.js';
import * as d3 from 'd3';
import { WeatherService } from '../service/weather.service';
import { Router } from '@angular/router';
import { AudioService } from '../service/audio.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  dataset = [];
  promotedTalkes = [];
  length;
  // mg1 = []; mg2 = []; conv = []; mg3 = []; bp1 = []; ft1 = []; bp2 = []; ft2 = []; bp3 = []; preLaunch = []; launch = [];
  padding = 3;
  translate;
  message;
  key;
  database;
  obj;
  // barwidth;
  // svg;
  // xAxisGroup;
  // yAxisGroup;
  // xScale;
  // yScale;
  // xAxis;
  // yAxis;
  // barchart;
  // graph;
  // bounds;
  // t;
  // chart;
  processList;
  i = 0;
  // events = ['value', 'child_added', 'child_removed', 'child_moved', 'child_changed'];
  // result;
  // imgSrc;
  // temp;
  // humidity;
  // windSpeed;
  fGroup: FormGroup;
  // margin = { top: 20, right: 20, bottom: 100, left: 100 };
  // Width;
  // Heigth;

constructor(private route: Router,
            private fbuilder: FormBuilder, private userService: UserService,
            private db: AngularFireDatabase, private audioService: AudioService) {
  }

ngOnInit() {
    this.fGroup = this.fbuilder.group({
      date: ['', [Validators.required]],
      appointment: ['', [Validators.required]],
      category: ['', [Validators.required]],
      conversations:[''],
      dtm:[''],
      mg1:[''],
      mg2:[''],
      mg3:[''],
      bp1:[''],
      bp2:[''],
      fp1:[''],
      fp2:[''],
      preLaunch:[''],
      launch:[''],
      others:[''],
      filter: ['conversations']
    });


    // this.svg = d3.select('svg');
    this.database = this.db.database.ref('/users');


  }

ngAfterViewInit() {


  // this.createGraph();
  // window.addEventListener('resize', this.createGraph);

  // this.getData('conversations');
  setTimeout(() => {
    this.talksPromoted();
   }, 101);

   setTimeout(() => {
    this.populateProcess(sessionStorage.getItem('email'));
   }, 101);
   
  // this.updateGraph('conversations');

}

// getData(value?: string) {
//     this.database.child('/' + sessionStorage.getItem('email').split('@')[0]).on('value', (snapshot) => {
//       this.key = Object.keys(snapshot.val());
//     });

//     setTimeout(() => {
//       for (this.i = 0; this.i < this.events.length; this.i++) {
//         this.database.child('/' + sessionStorage.getItem('email').split('@')[0] + '/' + this.key)
//             .child('/process').on(this.events[this.i], (snapshot) => {
//             console.log(snapshot.val());
//             if (snapshot.val() !== null) {
//                 console.log('Inside:' + snapshot.val());
//                 this.key = Object.keys(snapshot.val());
//                 for (this.i = 0; this.i < this.key.length; this.i++) {
//                   this.dataset.push(snapshot.val()[this.key[this.i]]);
//                   // tslint:disable-next-line:radix
//                   if (value === snapshot.val()[this.key[this.i]].type && snapshot.val()[this.key[this.i]].type === 'conversations') {

//                     this.conv = this.dataset.filter((process) => {
//                       return process.type === 'conversations';
//                     });

//                     this.updateGraphData(this.conv);
//                   } else if (value === snapshot.val()[this.key[this.i]].type && snapshot.val()[this.key[this.i]].type === 'mg1') {

//                     this.mg1 = this.dataset.filter((process) => {
//                       return process.type === 'mg1';
//                     });

//                     this.updateGraphData(this.mg1);
//                   } else if (value === snapshot.val()[this.key[this.i]].type && snapshot.val()[this.key[this.i]].type === 'mg2') {

//                     this.mg2 = this.dataset.filter((process) => {
//                       return process.type === 'mg2';
//                     });

//                     this.updateGraphData(this.mg2);
//                   } else if (value === snapshot.val()[this.key[this.i]].type && snapshot.val()[this.key[this.i]].type === 'mg3') {

//                     this.mg3 = this.dataset.filter((process) => {
//                       return process.type === 'mg3';
//                     });

//                     this.updateGraphData(this.mg3);
//                   } else if (value === snapshot.val()[this.key[this.i]].type && snapshot.val()[this.key[this.i]].type === 'bp1') {

//                     this.bp1 = this.dataset.filter((process) => {
//                       return process.type === 'bp1';
//                     });

//                     this.updateGraphData(this.bp1);
//                   } else if (value === snapshot.val()[this.key[this.i]].type && snapshot.val()[this.key[this.i]].type === 'ft1') {

//                     this.ft1 = this.dataset.filter((process) => {
//                       return process.type === 'ft1';
//                     });

//                     this.updateGraphData(this.ft1);
//                   } else if (value === snapshot.val()[this.key[this.i]].type && snapshot.val()[this.key[this.i]].type === 'bp2') {

//                     this.bp2 = this.dataset.filter((process) => {
//                       return process.type === 'bp2';
//                     });

//                     this.updateGraphData(this.bp2);
//                   } else if (value === snapshot.val()[this.key[this.i]].type && snapshot.val()[this.key[this.i]].type === 'ft2') {

//                     this.ft2 = this.dataset.filter((process) => {
//                       return process.type === 'ft2';
//                     });

//                     this.updateGraphData(this.ft2);
//                   } else if (value === snapshot.val()[this.key[this.i]].type && snapshot.val()[this.key[this.i]].type === 'bp3') {

//                     this.bp3 = this.dataset.filter((process) => {
//                       return process.type === 'bp3';
//                     });

//                     this.updateGraphData(this.bp3);
//                   } else if (value === snapshot.val()[this.key[this.i]].type && snapshot.val()[this.key[this.i]].type === 'pre-launch') {

//                     this.preLaunch = this.dataset.filter((process) => {
//                       return process.type === 'pre-launch';
//                     });

//                     this.updateGraphData(this.preLaunch);
//                   } else if (value === snapshot.val()[this.key[this.i]].type && snapshot.val()[this.key[this.i]].type === 'launch') {

//                     this.launch = this.dataset.filter((process) => {
//                       return process.type === 'launch';
//                     });

//                     this.updateGraphData(this.launch);
//                   } else {
//                     // this.dataset = [];
//                     // this.updateGraphData(this.dataset);
//                   }
//                 }
//             } else {
//               this.dataset = [];
//               this.updateGraphData(this.dataset);
//             }
//         });
//       }
//   }, 2000);
// }


updateGraph(value) {
    // this.getData(value);
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

numOfappointments(date, conv, dtm, mg1, mg2, mg3, bp1, bp2, fp1, fp2, pre, launch, others) {

    const obj = {
      todayDate: date,
      conversations: conv,
      dtm: dtm,
      mg1: mg1,
      mg2: mg2,
      mg3: mg3,
      bp1: bp1,
      bp2: bp2,
      fp1: fp1,
      fp2: fp2,
      preLaunch: pre,
      launch: launch,
      others: others
    };

    const string =obj.todayDate+'~'+obj.conversations+'~'+obj.dtm+'~'+obj.mg1+'~'+obj.mg2+'~'+obj.mg3+'~'+obj.bp1+'~'+obj.bp2+'~'+obj.fp1+'~'+obj.fp2+'~'+obj.preLaunch+'~'+obj.launch+'~'+obj.others;

    localStorage.setItem('todayEntry',string);

    this.userService.updateProcess(obj, sessionStorage.getItem('email')).subscribe(res => {
       this.message = res;
    });
  }


  populateProcess(email){

    console.log(email);
    this.userService.getProcess(email).subscribe(list => {
      this.processList = list;
      console.log(list);
    }, err => {
      console.log(err + 'inside process error');
    });

  }


  // private createGraph(): void {


  //   this.t = d3.transition().duration(1500);


  //   this.bounds = this.svg.node().getBoundingClientRect();
  //   // console.log(this.bounds);
  //   this.Width = this.bounds.width - this.margin.left - this.margin.right;
  //   this.Heigth = this.bounds.height - this.margin.top - this.margin.bottom;

  //   console.log(this.Width);
  //   console.log(this.Heigth);

  //   this.graph = this.svg.append('g')
  //                 .attr('width', this.Width)
  //                 .attr('height', this.Heigth)
  //                 .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

  //   this.xAxisGroup = this.graph.append('g')
  //                       .attr('transform', `translate(0,${this.Heigth})`);

  //   this.yAxisGroup = this.graph.append('g');

  //   this.xScale = d3.scaleBand()
  //                   .range([0, this.Width])
  //                   .paddingInner(0.2)
  //                   .paddingOuter(0.2);

  //   this.yScale = d3.scaleLinear()
  //                   .range([this.Heigth, 0]);

  //   this.xAxis = d3.axisBottom(this.xScale);

  //   this.yAxis = d3.axisLeft(this.yScale)
  //                   .ticks(10, '%')
  //                   .tickFormat(d => d + '');

  //   this.yAxisGroup.selectAll('text')
  //             .attr('fill', 'red');

  //   this.xAxisGroup.selectAll('text')
  //             .attr('transform', `rotate(${-40})`)
  //             .attr('text-anchor', 'end')
  //             .attr('fill', 'red');


  // }

  talksPromoted() {
    this.audioService.getPromotedFiles().subscribe(files => {
      console.log('@@@@@@@@@@@');
      Object.values(files)[1].forEach(file => {
        this.promotedTalkes.push(file[0].data);
      });
      this.length = this.promotedTalkes.length;
    });

    setTimeout(() => {
      console.log('##############');
      console.log(this.promotedTalkes);
    }, 100);
  }

  // updateGraphData(data) {

  //     console.log(data);

  //     // tslint:disable-next-line:radix
  //     const min = d3.min(data.map(d => Number.parseInt(d.num)));
  //     // tslint:disable-next-line:radix
  //     const max = d3.max(data.map(d => Number.parseInt(d.num)));


  //     // update the scales
  //     this.yScale.domain([0, max]);
  //     this.xScale.domain(data.map(d => d.todayDate));


  //     const barchart = this.graph.selectAll('rect')
  //                     .data(data);

  //     barchart.attr('width', this.xScale.bandwidth())
  //             .attr('fill', 'lightblue')
  //             .attr('x', d => this.xScale(d.todayDate));

  //     barchart.enter()
  //             .append('rect')
  //             .attr('height', 0)
  //             .attr('fill', 'lightblue')
  //             .attr('x', d => this.xScale(d.todayDate))
  //             .attr('y', this.Heigth)
  //             .merge(barchart)
  //             .transition(this.t)
  //                   .attrTween('width', d => {
  //                     const i = d3.interpolate(0, this.xScale.bandwidth());

  //                     return (t) => {
  //                         return i(t);
  //                     };
  //                   })
  //                   .attr('y', d => this.yScale(d.num))
  //                   .attr('height', d => this.Heigth - this.yScale(d.num));

  //   // updating any deleted data
  //     barchart.exit().remove();

  //     this.xAxisGroup.call(this.xAxis);
  //     this.yAxisGroup.call(this.yAxis);
  //   }

}
