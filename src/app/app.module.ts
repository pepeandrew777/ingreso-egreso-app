import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//Modulos
import { AppRoutingNModule } from './app-routing.module';
//ngrx
import {StoreModule} from '@ngrx/store';
import { appReducers } from './app.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
//Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
//Modulos personalizados
import { AuthModule } from './auth/auth.module';


import { environment } from '../environments/environment';



import { AppComponent } from './app.component';





@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AuthModule,
    AppRoutingNModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
