import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { SetbackgroundDirective } from '../../directives/setbackground/setbackground';


@NgModule({
  declarations: [
    HomePage,
    SetbackgroundDirective
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
  ],
})
export class HomePageModule {}
