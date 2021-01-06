import { Component, OnInit, Input } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { defaultNoOfServices } from '../../config';
import { FirebaseService } from 'app/services/firebase.service';
import { QueryFn } from '@angular/fire/firestore';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ServicesComponent implements OnInit {
  @Input() noOfItems: number | string;
  @Input() serviceListings: any;
  @Input() serviceType: string;
  noOfItemsFromConfig = defaultNoOfServices;

  constructor(private fbService: FirebaseService) { }

  ngOnInit() {
    this.showServiceListingsDefault();
  }

  showServiceListingsDefault() {
    const queryFunction: QueryFn = this.getQueryFunction();
    if (!this.serviceListings) {
      this.fbService
        .getFirestoreCollection('services-test', queryFunction)
        .valueChanges()
        .subscribe((data) => {
          this.serviceListings = data;
        });
    }
  }

  getQueryFunction() {
    if (this.noOfItems) {
      if (typeof this.noOfItems === 'number') {
        return (ref: any) => ref.where('serviceCategory', '==', this.serviceType).limit(this.noOfItems);
      }
      else if (typeof this.noOfItems === 'string' && this.noOfItems === 'all') {
        return (ref: any) => ref.where('serviceCategory', '==', this.serviceType);
      }
    }
    return (ref: any) => ref.where('serviceCategory', '==', this.serviceType).limit(this.noOfItemsFromConfig);
  }
}
