import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'app/services/firebase.service';
import { MatTableDataSource } from '@angular/material/table';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

@Component({
  selector: 'app-view-timesheets',
  templateUrl: './view-timesheets.component.html',
  styleUrls: ['./view-timesheets.component.css'],
  providers: [FirebaseService],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
  ]
})

export class ViewTimesheetsComponent implements OnInit {
    displayedColumns = [
        'title',
        'monday',
        'tuesday',
        'wednesday',
        'thrusday',
        'friday',
        'saturday',
        'sunday'
    ];

    dataSource: MatTableDataSource<any>;
    noTimesheetsData = true;


    constructor(private firebaseService: FirebaseService) { }

    ngOnInit() {
        this.getAllTimesheets();
    }

    getAllTimesheets() {
        this.firebaseService
      .getFirestoreCollection('/timesheets')
      .valueChanges()
      .subscribe(timesheetData => {
        if (timesheetData) {
          this.noTimesheetsData = false;
          this.dataSource = new MatTableDataSource(timesheetData);
        }
        else {
          this.noTimesheetsData = true;
        }
      });
    }
    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
      }
}