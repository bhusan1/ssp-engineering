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
  selector: 'app-view-services',
  templateUrl: './view-services.component.html',
  styleUrls: ['./view-services.component.css'],
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
export class ViewServicesComponent implements OnInit {

  displayedColumns = [
    'title',
    'serviceCategory',
    'imageSrc',
    'description',
    'updatedAt',
    'actions'
  ];
  dataSource: MatTableDataSource<any>;
  noServicesData = true;

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.getAllProjects();
  }

  getAllProjects() {
    this.firebaseService
      .getFirestoreCollection('/services-test')
      .valueChanges()
      .subscribe(ServicesData => {
        if (ServicesData) {
          console.log(ServicesData);
          this.noServicesData = false;
          this.dataSource = new MatTableDataSource(ServicesData);
        }
        else {
          this.noServicesData = true;
        }
      });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}



