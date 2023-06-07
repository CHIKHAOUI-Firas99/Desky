import { Component, ViewChild,ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { BookingService } from 'app/modules/booking/booking.service';
import { BookingMapComponent } from '../booking-map/booking-map.component';
import { Observable, map, of } from 'rxjs';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
  encapsulation:ViewEncapsulation.None

})
export class BookingComponent {

  @ViewChild('canvasBook', { static: true }) canvas: BookingMapComponent;
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
  public listWorkspaces :any =[]
  showCanvas : Boolean = false
  dates : any[] =[]
  workspaceName : string
  daysSelected: any[] = [];
  event: any;
  images : String[]=["1","2","3","4","5"]
  fullDay: boolean = false;

  minDate = new Date(2023, 5, 3);
  maxDate = new Date(2023, 5, 10);
  public selectedStartTime: string ="06:00";
  public selectedEndTime: string = "22:00";
  public listStartTime
  public start :string = "06:00"
  public end :string = "22:00"
  public listTime
  checkedListTime: any;
  activeIndex: any;
  activeElement: any;
  workspaceIndex: any;
  selectedDate: string;


  constructor(
   
    private _bookingService : BookingService ,
    )
    
    {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      console.log(today);
      
      const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Get the first day of the week
      const dates = Array.from({ length: 15 }, (_, i) => new Date(firstDayOfWeek).setDate(firstDayOfWeek.getDate() + i));
      this.dates = dates;
      
      // Get the dates of the week
      this.weekdays = dates.map(date => new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)); // Map the dates to weekday names
      console.log(this.weekdays);
      
      // Remove Sunday and Saturday from the weekdays
      this.weekdays = this.weekdays.filter(day => day !== 'Sun' && day !== 'Sat' );
      
      // Split the weekdays into two separate arrays
      const firstWeek = this.weekdays.slice(0, 5);
      const secondWeek = this.weekdays.slice(5, 10);
      this.firstWeek=firstWeek
      this.selectedWeek = firstWeek;
      this.secondWeek=secondWeek
      this.today = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now); // Get the name of the current day
      
      this.list = [];
      for (let index = 0; index < dates.length; index++) {
        const timestamp = dates[index];
        const date = new Date(timestamp);
        const nextDate = new Date(date.setDate(date.getDate()));
        if (nextDate.getMonth() !== date.getMonth()) {
          // if adding 1 day resulted in a new month, use the last day of the current month
          const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
          this.list.push(lastDayOfMonth.getDate().toString());
        } else {
          this.list.push(nextDate.getDate().toString());
        }
      }
      this.showedList = this.list;
    
    }    
  

    showNextWeekDays() {
      console.log(this.secondWeek);
      this.selectedWeek = this.secondWeek;
      this.showedList = this.list.slice(7, 14);
      this.isFirstWeek = false;
      // Reset the active index to the current day index in the new week
      // const todayIndex = this.selectedWeek.indexOf(this.today.substring(0, 3));
      // this.activeIndex = todayIndex !== -1 ? todayIndex : -1;
    }
    
    // Update the "previousWeekDays" method in your component
    previousWeekDays() {
      this.selectedWeek = this.firstWeek;
      this.showedList = this.list;
      this.isFirstWeek = true;
    
      // Reset the active index to the current day index in the first week
      // const todayIndex = this.selectedWeek.indexOf(this.today.substring(0, 3));
      // this.activeIndex = todayIndex !== -1 ? todayIndex : -1;
    }


  ngOnInit():  void{
    this.listTime = this.getTimeList(this.start,this.end)
    this.checkedListTime = this.listTime
    this.listStartTime = this.listTime
    const today: Date = new Date();
    const month: string = (today.getMonth() + 1).toString().padStart(2, '0');
    const date : string = today.getFullYear()+'-'+month+'-'+today.getDate().toString().padStart(2,'0')
    this.dateString = date
    let x = new Date();
    let monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1);
    this.minDate = x
    this.maxDate = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 13)
    
    this.activeIndex = this.selectedWeek.slice(0,5).indexOf(this.today.substring(0,3))
    this.selectedDate = this.showedList[this.activeIndex]
    this._bookingService.getWorkspacesForBooking(date).subscribe((data) => {
      this.listWorkspaces = data;
      console.log(this.listWorkspaces);
      if(this.listWorkspaces.length>0){
        this.canvas.loadCanvas(this.listWorkspaces[0].name, date);
        this.workspaceName = this.listWorkspaces[0].name;
        this.activeElement = this.listWorkspaces[0].name;
      }

    
    });
    

  }
  setFullDay() {
    this.selectedStartTime = this.start
    this.selectedEndTime = this.end
    this.fullDay = !this.fullDay

  }
  isToday(day: string): boolean {
    const today = new Date();
    const weekday = today.toLocaleDateString('en-US', { weekday: 'short' });
    return day === weekday;
  }
  
  onButtonClick(i: any) {
    this.activeIndex = i;
    let timestamp = 0
    this.selectedDate = this.showedList[i]
    if (this.isFirstWeek)
    {
       timestamp = this.dates[i+1];
    }
    else{
       timestamp = this.dates[i+8];
    }
    const date = new Date(timestamp);
    this.dateString = date.toISOString().substring(0,10)
    console.log(this.dateString);
    this._bookingService.getWorkspacesForBooking(this.dateString).subscribe(data => {
    this.listWorkspaces = data
    })
    this.canvas.loadCanvas(this.workspaceName,this.dateString)
    }

    loadCanvas(name: string, i: number) {
      this.workspaceName = name;
      this.workspaceIndex = i;
      this.activeElement = name;
      this.canvas.loadCanvas(name, this.dateString);
    }
    
    isActiveElement(name: string): boolean {
      return name === this.activeElement;
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

    isSelected = (event: any) => {
      const date =
        event.getFullYear() +
        "-" +
        ("00" + (event.getMonth() + 1)).slice(-2) +
        "-" +
        ("00" + event.getDate()).slice(-2);
        console.log(date);
        
      return this.daysSelected.find(x => x == date) ? "selected" : null;
    };
    
    select(event: any, calendar: any) {
      console.log(this.daysSelected);
      
      const date =
        event.getFullYear() +
        "-" +
        ("00" + (event.getMonth() + 1)).slice(-2) +
        "-" +
        ("00" + event.getDate()).slice(-2);
      const index = this.daysSelected.findIndex(x => x == date);
      if (index < 0) this.daysSelected.push(date);
      else this.daysSelected.splice(index, 1);
      calendar.updateTodaysDate();

    }
    remove(day: String): void {
      const index = this.daysSelected.indexOf(day);
  
      if (index >= 0) {
        this.daysSelected.splice(index, 1);

      }
    }

  // select(date: Date): void {
  //   const index = this.daysSelected.findIndex(d => d.getTime() === date.getTime());
  //   if (index >= 0) {
  //     this.daysSelected.splice(index, 1);
  //   } else {
  //     this.daysSelected.push(date);
  //   }
  // }
  getTimeList(start: string, end: string): string[] {
    const startHour = parseInt(start.split(':')[0]);
    const startMinute = parseInt(start.split(':')[1]);
    const endHour = parseInt(end.split(':')[0]);
    const endMinute = parseInt(end.split(':')[1]);
    
    const timeList = [];
    
    for (let hour = startHour; hour <= endHour; hour++) {
      const startMinuteOfHour = (hour === startHour) ? startMinute : 0;
      const endMinuteOfHour = (hour === endHour) ? endMinute : 60;
      
      for (let minute = startMinuteOfHour; minute < endMinuteOfHour; minute += 30) {
        const hourStr = hour.toString().padStart(2, '0');
        const minuteStr = minute.toString().padStart(2, '0');
        const timeStr = `${hourStr}:${minuteStr}`;
        timeList.push(timeStr);
      }
    }
    
    // Add the end time to the list if it's not already included
    const lastTime = timeList[timeList.length - 1];
    if (lastTime !== end) {
      timeList.push(end);
    }
    
    return timeList;
  }

  test(x){
    console.log(x);
    let bool = true
    let index =0    
    while (bool && index<this.listTime.length-1) {      
      if (this.listTime.indexOf(x) != -1){
        index =this.listTime.indexOf(x) 
        x= this.add30Minutes(x) 
      }
      else{
        console.log(x);
        this.checkedListTime = this.listTime.slice(0,index+1)
        bool =false
      }
    }
    this.selectedEndTime =null
  }
  add30Minutes(timeString: string): string {
    const [hours, minutes] = timeString.split(':');
    let newHours = Number(hours);
    let newMinutes = Number(minutes) + 30;
  
    if (newMinutes >= 60) {
      newHours += 1;
      newMinutes -= 60;
    }
      // Format hours and minutes with leading zeros if needed
      const formattedHours = newHours.toString().padStart(2, '0');
      const formattedMinutes = newMinutes.toString().padStart(2, '0');
      return `${formattedHours}:${formattedMinutes}`;
    }

}