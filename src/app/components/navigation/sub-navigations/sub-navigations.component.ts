import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sub-navigations',
  templateUrl: './sub-navigations.component.html',
  styleUrls: ['./sub-navigations.component.css']
})
export class SubNavigationsComponent implements OnInit {
  currentRoute: String;
  constructor(private router: Router) {
    this.currentRoute = this.router.url;
  }

  ngOnInit() {
  }

}
