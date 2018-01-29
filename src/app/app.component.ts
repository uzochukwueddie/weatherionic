import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { WeatherProvider } from './../providers/weather/weather';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';


@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit, AfterViewInit{
  @ViewChild(Nav) nav: Nav;

  rootPage: string = "HomePage"

  pages: any[] = [];
  location = {};
  weather: any;
  forecast: any;

  hideDelete = false;
  loc: string;
  weatherUnits = [];

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private weatherProvider: WeatherProvider,
    private storage: Storage,
    private events: Events,
    private alertCtrl: AlertController
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.storage.forEach((value, key, index) => {
      this.pages.push(JSON.parse(value));
    });
  }

  ngAfterViewInit() {
    this.weatherProvider.getPosition().then(resp => {
      this.weatherProvider.currentWeather(resp.coords.longitude, resp.coords.latitude)
        .subscribe(res => {
          if(res.length > 0){
            this.weather = res[0];
            this.loc = res[0].name;

            this.location = {
              id: res[0].id,
              icon: `http://openweathermap.org/img/w/${res[0].weather[0].icon}.png`,
              current: res[0],
              forecast: res[1]
            }
            this.storage.set(`location ${res[0].id}`, JSON.stringify(this.location));

            if(this.pages.length <= 0){
              this.events.publish("cityinfo", this.location);
            }
            
            this.nav.setRoot("HomePage", {"weatherInfo": this.location});
          }
        });
    });

    this.events.subscribe("cityinfo", (data) => {
      this.pages.push(data);
    });

    this.showUnits()
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.nav.setRoot("HomePage", {"weatherInfo": page});
  }

  searchPage() {
    this.nav.push("SearchPage");
  }

  showButton() {
    this.hideDelete = !this.hideDelete;
  }

  removeCity(item) {
    let index = this.pages.indexOf(item);

    if(index > -1){
      this.pages.splice(index, 1);
      this.storage.remove(`location ${item.id}`).then(res => {
        this.nav.setRoot("HomePage", {"weatherInfo": this.location});
      })
    }
  }

  showUnits() {
    this.weatherUnits.push(
      {
        title: 'Temperature',
        unit: 'C',
        icon: 'thermometer',
        show: () => {
          let alert = this.alertCtrl.create({
            title: 'Temperature',
            subTitle: `<ion-badge>Unit: Celsius</ion-badge>`,
            buttons: ['Cancel'],
            cssClass: 'alertCss'
          })
          return alert.present();
        }
      },
      {
        title: 'Pressure',
        unit: 'HPa',
        icon: 'cloud',
        show: () => {
          let alert = this.alertCtrl.create({
            title: 'Pressure',
            subTitle: `<ion-badge>Unit: HectoPascal</ion-badge>`,
            buttons: ['Cancel'],
            cssClass: 'alertCss'
          })
          return alert.present()
        }
      },
      {
        title: 'Wind',
        unit: 'M/S',
        icon: 'speedometer',
        show: () => {
          let alert = this.alertCtrl.create({
            title: 'Wind',
            subTitle: `<ion-badge>Unit: Meter/Second</ion-badge>`,
            buttons: ['Cancel'],
            cssClass: 'alertCss'
          })
          return alert.present()
        }
      },
      {
        title: 'Humidity',
        unit: '%',
        icon: 'umbrella',
        show: () => {
          let alert = this.alertCtrl.create({
            title: 'Humidity',
            subTitle: `<ion-badge>Unit: Percentage</ion-badge>`,
            buttons: ['Cancel'],
            cssClass: 'alertCss'
          })
          return alert.present();
        }
      }
    )
  }

  settingsPage() {
    this.nav.push("SettingsPage", {"currentLocation": this.loc});
  }

  slidesPage() {
    this.nav.push("MyslidesPage");
  }

}
