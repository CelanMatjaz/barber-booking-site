import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarberBookingComponent } from './barber-booking/barber-booking.component';
import { BarberBookingFormComponent } from './barber-booking/barber-booking-form/barber-booking-form.component';
import { BarberBookingSuccessComponent } from './barber-booking-success/barber-booking-success.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    BarberBookingComponent,
    BarberBookingFormComponent,
    BarberBookingSuccessComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
