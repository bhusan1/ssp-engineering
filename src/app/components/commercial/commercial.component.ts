import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'app/services/firebase.service';

@Component({
  selector: 'app-commercial',
  templateUrl: './commercial.component.html',
  styleUrls: ['./commercial.component.css']
})
export class CommercialComponent implements OnInit {

  settings: Object;
  constructor(private fbService: FirebaseService) {
    this.getSettings().then((data) => {
      this.settings = data;
    });
  }

  ngOnInit() {
  }

  getSettings() {
    return this.fbService.getFirestoreDocument('settings', 'metrices').then(function (doc) {
      if (doc.exists) {
        return doc.data();
      }
      else {
        console.log('No settings availabel!');
        return null;
      }
    }).catch(function (error) {
      console.log('Error getting document:', error);
      return null;
    });
  }

}
