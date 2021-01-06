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
  selector: 'app-view-projects',
  templateUrl: './view-projects.component.html',
  styleUrls: ['./view-projects.component.css'],
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
export class ViewProjectsComponent implements OnInit {
  displayedColumns = [
    'title',
    'imageSrc',
    'description',
    'updatedAt',
    'actions'
  ];
  dataSource: MatTableDataSource<any>;
  noProjectData = true;

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.getAllProjects();
  }

  getAllProjects() {
    this.firebaseService
      .getFirestoreCollection('/projects')
      .valueChanges()
      .subscribe(projectData => {
        if (projectData) {
          this.noProjectData = false;
          this.dataSource = new MatTableDataSource(projectData);
        }
        else {
          this.noProjectData = true;
        }
      });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
