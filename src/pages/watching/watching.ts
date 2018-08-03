import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { Geolocation } from '@ionic-native/geolocation';


/**
 * Generated class for the WatchingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-watching',
  templateUrl: 'watching.html',
})
export class WatchingPage {

  public lastX: number = 0;
  public lastY: number = 0;
  public lastZ: number = 0;
  public valueX: number = 0;
  public valueY: number = 0;
  public valueZ: number = 0;
  public moveCounter: number = 0;
  public deltaX: number = 0;
  public deltaY: number = 0;
  public deltaZ: number = 0;
  public busy:boolean = false;

  public sensitivity: number = 10;

  public text: string;
  public rate: number;
  public locale: string;

  public isRecording: boolean;
  public matches: String[];

  public lat = 0.0;
  public long = 0.0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public deviceMotion: DeviceMotion,
    public platform: Platform,
    private tts: TextToSpeech,
    private speechRecognition: SpeechRecognition,
    private geolocation: Geolocation
  ) {

    this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {
        console.log(hasPermission);
        if (!hasPermission) {
          this.speechRecognition.requestPermission()
            .then(
              () => console.log('Granted'),
              () => console.log('Denied')
            )
        }
      });

    this.rate = 1;
    this.locale = 'en-US';

    platform.ready().then(() => {
      var subscription = this.deviceMotion.watchAcceleration({ frequency: 200 }).subscribe(acc => {
        //console.log(acc);

        this.valueX = this.round2(acc.x);
        this.valueY = this.round2(acc.y);
        this.valueZ = this.round2(acc.z);

        if (!this.lastX) {
          this.lastX = this.valueX;
          this.lastY = this.valueY;
          this.lastZ = this.valueZ;
          return;
        }


        this.deltaX = this.round2(Math.abs(this.valueX - this.lastX));
        this.deltaY = this.round2(Math.abs(this.valueY - this.lastY));
        this.deltaZ = this.round2(Math.abs(this.valueZ - this.lastZ));

        if (this.deltaX + this.deltaY + this.deltaZ > this.sensitivity) {
          this.moveCounter++;
        } else {
          this.moveCounter = Math.max(0, --this.moveCounter);
        }

        if (this.moveCounter >= 2 && !this.busy) {

          this.busy = true;

          console.log('SHAKE');
          //alert("SHAKEN!");

          this.geolocation.getCurrentPosition().then((resp) => {
            this.lat = resp.coords.latitude
            this.long = resp.coords.longitude
           }).catch((error) => {
             console.log('Error getting location', error);
           });

          this.text = 'What was that? A pothole, an accident or just a speed bump?';

          this.tts.speak({
            text: this.text,
            rate: this.rate,
            locale: this.locale
          })
            .then(() => {
              this.startListening();
            })
            .catch((reason: any) => console.log(reason));

          this.moveCounter = 0;

          
        }

        this.lastX = this.valueX;
        this.lastY = this.valueY;
        this.lastZ = this.valueZ;


      });
    });

  }

  round2(x: number) {
    //return (Math.round(x * 1000)) / 1000.0;
    return x;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WatchingPage');
  }


  startListening() {
    let options = {
      language: 'en-US'
    }
    this.speechRecognition.startListening(options).subscribe(matches => {
      this.matches = matches;
      //this.cd.detectChanges();
      this.busy = false;
    });
    this.isRecording = true;

    if (this.isIos()) {
      let TIME_IN_MS = 4000;
      let Timeout = setTimeout(() => {
        this.speechRecognition.stopListening();
        this.busy = false;
      }, TIME_IN_MS);
    }
  }

  isIos() {
    return this.platform.is('ios');
  }

}
