import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarberBookingComponent } from './barber-booking/barber-booking.component';
import { BarberBookingSuccessComponent } from './barber-booking-success/barber-booking-success.component';

const routes: Routes = [
  {
    path: 'booking',
    component: BarberBookingComponent
  },
  {
    path: 'booking-success',
    component: BarberBookingSuccessComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
