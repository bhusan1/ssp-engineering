import { Component, OnInit, Input } from '@angular/core';
import { FirebaseService } from 'app/services/firebase.service';
import { defaultNoOfItems } from '../../config';
import { QueryFn } from '@angular/fire/firestore';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  @Input() title: string;
  @Input() projectListings: any;
  @Input() noOfItems: number | string;

  noOfItemsFromConfig = defaultNoOfItems;

  constructor(private fbService: FirebaseService) {}

  ngOnInit() {
    this.showProjectListingsDefault();
  }

  showProjectListingsDefault() {
    if (!this.projectListings) {
      const queryFunction: QueryFn = this.getQueryFunction();
      this.fbService
        .getFirestoreCollection('projects', queryFunction)
        .valueChanges()
        .subscribe((data) => {
          this.projectListings = data;
        });
    }
  }

  getQueryFunction() {
    if (this.noOfItems) {
      if (typeof this.noOfItems === 'number') {
        return (ref: any) => ref.orderBy('createdAt').limit(this.noOfItems);
      }
      else if (typeof this.noOfItems === 'string' && this.noOfItems === 'all') {
        return (ref: any) => ref.orderBy('createdAt');
      }
    }
    return (ref: any) => ref.orderBy('createdAt').limit(this.noOfItemsFromConfig);
  }
}
