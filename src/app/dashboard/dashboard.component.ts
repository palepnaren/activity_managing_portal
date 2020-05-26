import { AngularFireDatabase } from '@angular/fire/database';
import { UserService } from './../service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, AfterViewInit, ViewChild, EventEmitter, OnChanges } from '@angular/core';
// import '../js/histogram.js';
import * as d3 from 'd3';
import * as $ from 'jquery';
import { WeatherService } from '../service/weather.service';
import { Router } from '@angular/router';
import { AudioService } from '../service/audio.service';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnChanges {
  dataset = [];
  promotedTalkes = [];
  length;
  refresh = true;
  // mg1 = []; mg2 = []; conv = []; mg3 = []; bp1 = []; ft1 = []; bp2 = []; ft2 = []; bp3 = []; preLaunch = []; launch = [];
  padding = 3;
  translate;
  message;
  key;
  database;
  obj;
  fromDate;
  toDate;
  alerts:any = [];
  newAlerts:any = [];
  map = new Map();
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
  tableList;
  audios;
  len = 0;
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

  // @ViewChild('pagination')
  // pagination: PaginationComponent;

constructor(private router: Router,
            private fbuilder: FormBuilder, private userService: UserService,
            private db: AngularFireDatabase, private audioService: AudioService, private pagination: PaginationComponent) {

              this.userService.showNotificationAlert().subscribe(alerts => {
                if(alerts === null){
                  return;
                }
                this.alerts = alerts;
                for(var i=0; i<this.alerts.length;i++){
                  let values = Object.values(alerts[i]);
                  this.newAlerts.push(values[0]); 
                }
                this.userService.setNotifications(this.newAlerts);
              });
  }

ngOnChanges(){
  
}



ngOnInit() {

  // this.isLoading = true;
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
      filter: ['5']
    });


    // this.svg = d3.select('svg');
    this.database = this.db.database.ref('/users');


  }

ngAfterViewInit() {

   this.talksPromoted();
   this.populateProcess(sessionStorage.getItem('email'));
   document.addEventListener('play', (e) => {
    this.audios = document.getElementsByTagName('audio');
    for (this.i = 0, this.len = this.audios.length; this.i < this.len; this.i++) {
        if (this.audios[this.i] !== e.target) {
            this.audios[this.i].pause();
        }
    }
  }, true);
   
  // this.updateGraph('conversations');

  $('loader').css({'display':'none'});
}

updateTable(value:string){
  console.log(value);
  if(value === "5"){
    $('table').hide();
    this.processList.sort((a,b) => {
      a = new Date(a.todayDate);
      b = new Date(b.todayDate);
      return b - a;
    });
    this.tableList = this.processList.slice(0,5);
    this.aggregateCalculator(this.tableList);
    $('table').show();
  } else if(value === "date"){
    if((this.fromDate != undefined || this.fromDate != null) && (this.toDate != undefined || this.toDate != null)){
      $('table').hide();
      this.processList.sort((a,b) => {
        a = new Date(a.todayDate);
        b = new Date(b.todayDate);
        return b - a;
      });
      this.tableList = this.processList.filter((item: any) => {
        return new Date(item.todayDate) >= new Date(this.fromDate) && new Date(item.todayDate) <= new Date(this.toDate);
      })
      this.aggregateCalculator(this.tableList);
      $('table').show();
    }
  } else if(value === "30"){
    $('table').hide();
    this.processList.sort((a,b) => {
      a = new Date(a.todayDate);
      b = new Date(b.todayDate);
      return b - a;
    });
    this.tableList = this.processList.slice(0,30);
    this.aggregateCalculator(this.tableList);
    $('table').show();
  }
}

dateFilter(fromDate, toDate){

  this.fromDate = fromDate;
  this.toDate = toDate;

  this.updateTable("date");
  
}

aggregateCalculator(list,length?: string){

  var sum = 0;
  list.forEach(item => {
    if(item.conversations == null || item.conversations == undefined || item.conversations == ''){

    } else{
      sum += parseInt(item.conversations);
    }
    
  });
  console.log("conv-aggregate "+sum);
  this.map.set('conv-aggregate', sum);
  sum = 0;

  list.forEach(item => {
    if(item.dtm == null || item.dtm == undefined || item.dtm == ''){

    } else{
      sum += parseInt(item.dtm);
    }
    
  });
  console.log("dtm-aggregate "+sum);
  this.map.set('dtm-aggregate', sum);
  sum = 0;

  list.forEach(item => {
    if(item.mg1 == null || item.mg1 == undefined || item.mg1 == ''){

    } else{
      sum += parseInt(item.mg1);
    }
    
  });
  console.log("mg1-aggregate "+sum);
  this.map.set('mg1-aggregate', sum);
  sum = 0;

  list.forEach(item => {
    if(item.mg2 == null || item.mg2 == undefined || item.mg2 == ''){

    } else{
      sum += parseInt(item.mg2);
    }
    
  });
  console.log("mg2-aggregate "+sum);
  this.map.set('mg2-aggregate', sum);
  sum = 0;

  list.forEach(item => {
    if(item.mg3 == null || item.mg3 == undefined || item.mg3 == ''){

    } else{
      sum += parseInt(item.mg3);
    }
    
  });
  console.log("mg3-aggregate "+sum);
  this.map.set('mg3-aggregate', sum);
  sum = 0;

  list.forEach(item => {
    if(item.bp1 == null || item.bp1 == undefined || item.bp1 == ''){

    } else{
      sum += parseInt(item.bp1);
    }
    
  });
  console.log("bp1-aggregate "+sum);
  this.map.set('bp1-aggregate', sum);
  sum = 0;

  list.forEach(item => {
    if(item.bp2 == null || item.bp2 == undefined || item.bp2 == ''){

    } else{
      sum += parseInt(item.bp2);
    }
    
  });
  console.log("bp2-aggregate "+sum);
  this.map.set('bp2-aggregate', sum);
  sum = 0;

  list.forEach(item => {
    if(item.fp1 == null || item.fp1 == undefined || item.fp1 == ''){

    } else{
      sum += parseInt(item.fp1);
    }
    
  });
  console.log("fp1-aggregate "+sum);
  this.map.set('fp1-aggregate', sum);
  sum = 0;

  list.forEach(item => {
    if(item.fp2 == null || item.fp2 == undefined || item.fp2 == ''){

    } else{
      sum += parseInt(item.fp2);
    }
    
  });
  console.log("fp2-aggregate "+sum);
  this.map.set('fp2-aggregate', sum);
  sum = 0;

  list.forEach(item => {
    if(item.preLaunch == null || item.preLaunch == undefined || item.preLaunch == ''){

    } else{
      sum += parseInt(item.preLaunch);
    }
    
  });
  console.log("preLaunch-aggregate "+sum);
  this.map.set('preLaunch-aggregate', sum);
  sum = 0;

  list.forEach(item => {
    if(item.launch == null || item.launch == undefined || item.launch == ''){

    } else{
      sum += parseInt(item.launch);
    }
    
  });
  console.log("launch-aggregate "+sum);
  this.map.set('launch-aggregate', sum);
  
}

// searching(keyword){
//   this.refresh = false;
//   if(keyword === null || keyword === undefined || keyword === ''){

//     this.promotedTalkes = [];
//     this.talksPromoted();

//   } else{

//     this.promotedTalkes = this.promotedTalkes.filter(talk => talk.name === keyword);
//     console.log(this.promotedTalkes);
//     this.length = this.promotedTalkes.length;
//     setTimeout(() => {
//       this.pagination.listOfItems = this.promotedTalkes;
//       this.pagination.lengthOfList = this.length;
//       this.pagination.ngOnInit();
//       this.pagination.ngAfterViewInit();
//       this.refresh = true;
//     }, 200);
//   }
  
  
// }

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

  $('loader').css({'display':'block'});

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
      if(res){
        this.message = Object.values(res)[0];
        this.processList = Object.values(res)[1];
        this.updateTable("5");
        $('loader').css({'display':'none'});
      } 
    });
  }

  populateProcess(email){
    $('loader').css({'display':'block'});
    console.log(email);
    this.userService.getProcess(email).subscribe(list => {
      this.processList = list;
      console.log("New Updated list is: ");
      console.log(list);
      $('loader').css({'display':'none'});
      this.updateTable("5");
    }, err => {
      console.log(err + 'inside process error');
      $('loader').css({'display':'none'});
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
    $('loader').css({'display':'block'});
    this.audioService.getPromotedFiles().subscribe(files => {
      console.log('@@@@@@@@@@@');
      Object.values(files)[1].forEach(file => {
        this.promotedTalkes.push(file[0].data);
      });
      this.length = this.promotedTalkes.length;
      $('loader').css({'display':'none'});
      this.refresh = true;
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
