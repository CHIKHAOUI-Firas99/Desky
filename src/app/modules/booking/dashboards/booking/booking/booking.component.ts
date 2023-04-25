import { Component, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { BookingService } from 'app/modules/booking/booking.service';
import { BookingMapComponent } from '../booking-map/booking-map.component';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent {
  @ViewChild('canvas', { static: false }) canvas: BookingMapComponent;
  dateString :string
  timeControl = new FormControl();
  weekdays: string[];
  firstWeek: string[] =[];
  secondWeek: string[] =[];
  selectedWeek :any
  isFirstWeek :boolean =true
  today: string;
  list :string[] =[];
  showedList :string[] =[];
  listWorkspaces :any =[]
  showCanvas : Boolean = false
  dates : any[] =[]
  workspaceName : string
  constructor(
   
    private _bookingService : BookingService ,
    )
    
    {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    console.log(today);
    
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Get the first day of the week
    const dates = Array.from({ length: 15 }, (_, i) => new Date(firstDayOfWeek).setDate(firstDayOfWeek.getDate() + i));
    this.dates = dates
    // Get the dates of the week
    this.weekdays = dates.map(date => new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)); // Map the dates to weekday names
    console.log(this.weekdays);
    
    for (let index = 0; index < (this.weekdays.length-1)/2; index++) {
      this.firstWeek.push(this.weekdays[index].substring(0,3))
      this.secondWeek.push(this.weekdays[index+7].substring(0,3))
    }
    
    this.selectedWeek = this.firstWeek
    this.today = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now); // Get the name of the current day
    for (let index = 0; index < dates.length; index++) {
      const timestamp = dates[index];
      const date = new Date(timestamp);
      const dateString = date.toISOString().substring(8, 10);
      this.list.push((Number(dateString)+1).toString())
      this.showedList = this.list
    }    
  }

  showNextWeekDays(){
    this.selectedWeek=this.secondWeek
    this.showedList = this.list.slice(7,14)
    this.isFirstWeek = false
    
  }
  previousWeekDays(){
    this.selectedWeek = this.firstWeek
    this.showedList = this.list
    this.isFirstWeek = true


  }


  ngOnInit():  void{
    const today: Date = new Date();
    console.log(today.getMonth()+1);
    const month: string = (today.getMonth() + 1).toString().padStart(2, '0');
    const date : string = today.getFullYear()+'-'+month+'-'+today.getDate()
    this.dateString = date
    console.log(date);
    this._bookingService.getWorkspacesForBooking(date).subscribe(data => {
      this.listWorkspaces = data   
      this.canvas.loadCanvas(this.listWorkspaces[0].name,date)
   
    })

  }
  onButtonClick(i: any) {
    let timestamp = 0
    if (this.isFirstWeek){
       timestamp = this.dates[i+1];
    }
    else{
       timestamp = this.dates[i+8];
    }
    const date = new Date(timestamp);
     this.dateString = date.toISOString().substring(0,10)
    this._bookingService.getWorkspacesForBooking(this.dateString).subscribe(data => {
      this.listWorkspaces = data
      console.log(data);
            
    })
    this.canvas.loadCanvas(this.workspaceName,this.dateString)
    }

    loadCanvas(name){
      this.workspaceName = name      
      this.canvas.loadCanvas(name,this.dateString)
    }

    getValueClass(value: number): string {
      if (value > 60) {                
        return 'progress-bar bg-success';
      } else if (value < 40) {
        return 'progress-bar bg-danger';
      } else {
        return 'progress-bar bg-warning';
      }
    }


}