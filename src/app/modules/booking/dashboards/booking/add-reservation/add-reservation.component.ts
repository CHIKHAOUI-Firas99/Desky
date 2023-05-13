import { Component, Inject } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute, RouteReuseStrategy } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { RoleService } from 'app/core/role/role.service';
import { BookingService } from 'app/modules/booking/booking.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-reservation',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.scss']
})

export class AddReservationComponent {
  public id : String
  public color : String
  public workspaceName :String
  public date : String
  public start :string = "06:00"
  public end :string = "22:00"
  public listTime
  public listStartTime
  public checkedListTime
  public TemcheckedListTime
  public selectedStartTime: string ="06:00";
  public selectedEndTime: string = "22:00";
  public fullDay : boolean = false
  public anonymous : boolean = false
  public isDisabled = false

  constructor(private dialogRef: MatDialogRef<AddReservationComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  private  dialog: MatDialog,
  private _authService : AuthService,
  private _bookingService : BookingService ,
  private _router: Router,
  private _roleService: RoleService,
  private route: ActivatedRoute,
  private routeReuseStrategy: RouteReuseStrategy,
  private toastr: ToastrService,

  ) {

  }
ngOnInit(): void {
  this.id = this.data.id
  this.workspaceName = this.data.workspaceName
  this.date = this.data.date
  this.color = this.data.color
  if (this.color == "red"){
    this.isDisabled = true
  }
  else{
    this.isDisabled = false
  }

  
  this.listTime = this.getTimeList(this.start,this.end)
  this._bookingService.get_available_time_slots(this.id,this.date).subscribe(data =>{
    console.log(data);
    this.listTime = data
    this.listStartTime = this.listTime.slice(0,this.listTime.length-1)
    console.log(this.listStartTime);
    
    this.checkedListTime = data
    this.TemcheckedListTime =data

    
  })
  

  
}
refreshRoute() {
  this.route.data.subscribe(() => {
    const currentUrl = this._router.url;
    this.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this._router.navigate([currentUrl]);
    });
  });
}
onCheckboxChange(event: MatCheckboxChange) {
  
  if (event.checked) {
    this.selectedStartTime ="06:00"
    this.selectedEndTime ="22:00"
    console.log("i am here");
    this.fullDay = true
    console.log(this.fullDay);
    
  } else {
    this.fullDay = false
    console.log(this.fullDay);
  }
}
  
  close() {
    this.dialogRef.close();
  }
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
    this.TemcheckedListTime = this.checkedListTime
    let bool = true
    let index =0    
    while (bool && index<this.listTime.length-1) {      
      if (this.listTime.indexOf(x) != -1){
        index =this.listTime.indexOf(x) 
        x= this.add30Minutes(x) 
      }
      else{
        console.log(x);
        this.TemcheckedListTime = this.listTime.slice(0,index+1)
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
  submit(){
    let id = this._authService.getCurrentUser().id
    const reservation = {
      "userId" : id,
      "deskId" : this.id,
      "date" : this.date,
      "startTime" : this.selectedStartTime,
      "endTime" : this.selectedEndTime,
      "anonymousBooking" : this.anonymous
    }
    console.log(reservation);
    this._bookingService.addReservation(reservation).subscribe(data =>{
      console.log(data);
      this.dialog.closeAll()
this.toastr.success('Your reservation has been succeded','success')
      this.refreshRoute()
    })
    
  }

}