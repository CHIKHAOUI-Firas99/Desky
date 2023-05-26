import { Component, OnInit, ViewChild } from '@angular/core';
import { AnalyticsService } from './analytics.service';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexNonAxisChartSeries, ApexPlotOptions, ApexResponsive, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent } from "ng-apexcharts";
import { first } from 'rxjs';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  colors: string[];

};
export type ChartOptionsRadial = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive | ApexResponsive[];
  
};
export type ChartOptionsColumns = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})

export class AnalyticsComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;

  public chartOptions: Partial<ChartOptions>;
  public deskchartOptions: Partial<ChartOptions>;
  public office_remote_chart_options: Partial<ChartOptions>;
  public working_dayschart_options: Partial<ChartOptions>;
  public common_equipement_chart_option: Partial<ChartOptions>;
  public reservation_status_chart_options: Partial<ChartOptions>;

  public data: any = [];
  tabPeakHours: any = [];
  tabReservationsByDate: any=[];
  RadialchartOptions: { series: number[]; chart: { height: number; type: string; }; plotOptions: { radialBar: { offsetY: number; startAngle: number; endAngle: number; hollow: { margin: number; size: string; background: string; image: any; }; dataLabels: { name: { show: boolean; }; value: { show: boolean; }; }; }; }; colors: string[]; labels: string[]; legend: { show: boolean; floating: boolean; fontSize: string; position: string; offsetX: number; offsetY: number; labels: { useSeriesColors: boolean; }; formatter: (seriesName: any, opts: any) => string; itemMargin: { horizontal: number; }; }; responsive: { breakpoint: number; options: { legend: { show: boolean; }; }; }[]; };
  chartOptionsColumns: {
    series: { name: string; data: number[]; }[]; chart: { height: number; type: string; }; plotOptions: {
      bar: {
        dataLabels: {
          position: string; // top, center, bottom
        };
      };
    }; dataLabels: { enabled: boolean; formatter: (val: any) => string; offsetY: number; style: { fontSize: string; colors: string[]; }; }; xaxis: { categories: string[]; position: string; labels: { offsetY: number; }; axisBorder: { show: boolean; }; axisTicks: { show: boolean; }; crosshairs: { fill: { type: string; gradient: { colorFrom: string; colorTo: string; stops: number[]; opacityFrom: number; opacityTo: number; }; }; }; tooltip: { enabled: boolean; offsetY: number; }; }; fill: { type: string; gradient: { shade: string; type: string; shadeIntensity: number; gradientToColors: any; inverseColors: boolean; opacityFrom: number; opacityTo: number; stops: number[]; }; }; yaxis: { axisBorder: { show: boolean; }; axisTicks: { show: boolean; }; labels: { show: boolean; formatter: (val: any) => string; }; }; title: { text: string; floating: number; offsetY: number; align: string; style: { color: string; }; };
  };
  office_remote: any=[];
  rerservations_status: any=[];
  most_common_equipements: any=[];
  desk_usage: any=[];
  deskUsageSeries=[];
  deskUsageValues=[];
  deskUsageNames=[];
  office_remote_names: any[];
  office_remote_values: any[];

  constructor(private _analyticsService: AnalyticsService){
    this.common_equipement_chart_option= {
      series: [],
      chart: {width: 300,type: "pie"},
      
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ],
    colors: ["#1ab7ea", "#0084ff", "#39539E", "#0077B5"]

    };
    this.chartOptions = {
      series: [],
      chart: {width: 300,type: "pie"},
      
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ],
    colors: ["#7ae9ff", "#0084ff", "#39539E", "#0077B5"]

    };
    this.reservation_status_chart_options = {
      series: [],
      chart: {width: 300,type: "pie"},
      
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ],
    colors: ['#4fc3f7', '#81c784', '#dcedc8', '#263238', '#212121']

    };
    this.office_remote_chart_options = {
      series: [],
      chart: {width: 300,type: "pie"},
      
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ],
    colors:  ['#1a237e', '#2196f3', '#2e7d32', '#8bc34a', '#4a148c']

    };
  }

  view: any[] = [610, 320];

  // options
  legendTitle: string = 'AAAAAAAAAAAAAAA';
  legendTitleMulti: string = 'Months';
  legendPosition: string = 'below'; // ['right', 'below']
  legend: boolean = false;

  xAxis: boolean = true;
  yAxis: boolean = true;

  yAxisLabel: string = 'Pourcentages';
  xAxisLabel: string = 'Hours';
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;

  maxXAxisTickLength: number = 30;
  maxYAxisTickLength: number = 30;
  trimXAxisTicks: boolean = false;
  trimYAxisTicks: boolean = false;
  rotateXAxisTicks: boolean = false;
  cardColor: string = '#D9D9D9';
  // xAxisTicks: any[] = []
  yAxisTicks: any[] = [0, 20, 40, 60, 80, 100]
  
  labelFormatting(c) {
    return `${(c.label)} Sales`;
  }
  animations: boolean = true; // animations on load

  showGridLines: boolean = true; // grid lines

  showDataLabel: boolean = true; // numbers on bars

  gradient: boolean = false;
  
  colorScheme = {
    domain: ['#ca9cff', '#80cc58', '#ffd969', '#9faff5', '#30b6d1']
  };
  schemeType: string = 'ordinal'; // 'ordinal' or 'linear'

  activeEntries: any[] = ['book']
  barPadding: number = 5
  tooltipDisabled: boolean = true;

  yScaleMax: number = 9000;

  roundEdges: boolean = false;
  formatString(input: string): string {
    return input.toUpperCase()
  }

  formatNumber(input: number): number {
    return input
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }
  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
 async  ngOnInit() {
 

  
this.tabPeakHours = await this._analyticsService.get_peak_hours().pipe(first()).toPromise();
this.tabReservationsByDate=await this._analyticsService.get_reservation_by_date().pipe(first()).toPromise();
this.office_remote = await this._analyticsService.get_office_remote_analyse().pipe(first()).toPromise();
let office_remote_names=[]
let office_remote_values=[]
for (let i = 0; i < this.office_remote.length; i++) {
  const element = this.office_remote[i];
  office_remote_names.push(element['name'])
  office_remote_values.push(Number(element['value']))
}
this.office_remote_chart_options.labels=office_remote_names
this.office_remote_chart_options.series=office_remote_values

this.rerservations_status = await this._analyticsService.get_rerservations_status().pipe(first()).toPromise();
let rerservations_status_names=[]
let rerservations_status_values=[]
for (let i = 0; i < this.rerservations_status.length; i++) {
  const element = this.rerservations_status[i];
  rerservations_status_names.push(element['name'])
  rerservations_status_values.push(Number(element['value']))
}
this.reservation_status_chart_options.series=rerservations_status_values
this.reservation_status_chart_options.labels=rerservations_status_names

this.most_common_equipements = await this._analyticsService.most_common_equipements().pipe(first()).toPromise();
console.log(this.most_common_equipements);

let most_common_equipements_names=[]
let most_common_equipements_values =[]

for (let i = 0; i < this.most_common_equipements.length; i++) {
  const element = this.most_common_equipements[i];
  most_common_equipements_names.push(element['name'])
  most_common_equipements_values.push(Number(element['value']))
}
this.common_equipement_chart_option.series=most_common_equipements_values
this.common_equipement_chart_option.labels=most_common_equipements_names


this.desk_usage = await this._analyticsService.get_desk_usage().pipe(first()).toPromise();
console.log(this.desk_usage);

let t = [];
if (Array.isArray(this.desk_usage)) {
  console.log(this.desk_usage);
  
  t = this.desk_usage;
}
console.log(t.length);

this.deskUsageSeries = [];
this.deskUsageValues = [];

for (let i = 0; i < t.length; i++) {
  const element = t[i];
  this.deskUsageNames.push(element['name']);
  this.deskUsageValues.push(Number(element['value']));
}
console.log(this.chartOptions.series);

this.chartOptions.series = this.deskUsageValues;

this.chartOptions.labels = this.deskUsageNames;
}
  productSales = [
    {
      "name": "book",
      "value": 5001
    }, {
      "name": "graphic card",
      "value": 7322
    }, {
      "name": "desk",
      "value": 1726
    }, {
      "name": "laptop",
      "value": 2599
    }, {
      "name": "monitor",
      "value": 705
    }
  ];

  title = '';
  type = 'PieChart';

  columnNames = ['hour', 'Percentage'];
  options = {};
  width = 350;
  height = 200;
}
