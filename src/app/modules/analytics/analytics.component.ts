import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './analytics.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  public data: any = [];
  tabPeakHours: any = [];

  constructor(private _analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this._analyticsService.get_peak_hours().subscribe((data) => {
      console.log(data);
      this.tabPeakHours = data;
      this.data = this.tabPeakHours.map(([hour, percentage]) => [hour.toString(), percentage]);
      this.title = 'Most hours peaked'; // Update the title here
    });
    
  }

  title = '';
  type = 'PieChart';

  columnNames = ['hour', 'Percentage'];
  options = {};
  width = 350;
  height = 200;
}
