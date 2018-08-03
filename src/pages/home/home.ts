import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WatchingPage } from '../watching/watching';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  GoToWatching() {
    this.navCtrl.push(WatchingPage);
  }

}
