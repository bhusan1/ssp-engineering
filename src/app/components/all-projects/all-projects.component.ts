import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html',
  styleUrls: ['./all-projects.component.css']
})
export class AllProjectsComponent implements OnInit {
  title = 'All Projects';
  noOfItems = 'all';

  constructor() {}

  ngOnInit() {}
}
