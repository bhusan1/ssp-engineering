import {Component} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FirebaseService } from 'app/services/firebase.service';

@Component({
  selector: 'app-viewtimesheet',
  styleUrls: ['./viewtimesheet.component.css'],
  templateUrl: './viewtimesheet.component.html',
})
export class ViewTimesheetComponent {

  displayedColumns: string[] = ['projectid','startDate','endDate','day1','day2','day3','day4','day5','day6','day7','totalHour'];
  dataSource: MatTableDataSource<any>;
  noTimesheet = true;
  daysLabel: any;
  employeeName: string;
  
  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.getAllTimesheet();
    this.daysLabel = {};
  }


  getAllTimesheet() {
    this.firebaseService
      .getFirestoreCollection('/timesheets')
      .valueChanges()
      .subscribe((timesheetData: any[]) => {
        if (timesheetData.length >0) {
          this.noTimesheet = false;
          this.employeeName = timesheetData[0].Username;
          this.dataSource = new MatTableDataSource(timesheetData);
        }
        else {
          this.noTimesheet = true;
        }
      });
  }
  

}

