import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { Appointment, Barber, Service, TimeEntry } from '../types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-barber-booking-form',
  templateUrl: './barber-booking-form.component.html',
  styleUrls: ['./barber-booking-form.component.scss']
})
export class BarberBookingFormComponent implements OnInit {

  showErrors = false;

  formGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    contactNumber: new FormControl('', [Validators.required, Validators.maxLength(9), Validators.minLength(9), Validators.pattern('^0\\d+$')]),
    barber: new FormControl('0', [Validators.required]),
    service: new FormControl('0', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    time: new FormControl('0', [Validators.required]),
    price: new FormControl(''),
  });

  barbers: { [id: number]: Barber } = {};
  services: { [id: number]: Service } = {};
  appointments: Appointment[] = [];
  timeEntries: TimeEntry[] = [];

  constructor(private http: HttpClient, private router: Router) {
    this.fetchBarbers();
    this.fetchServices();
    this.fetchAppointments();

    this.updateTimeEntries();

    // Fix parsing bug that happens when adding "disabled" to price input  
    this.formGroup.controls.price.disable();
  }

  ngOnInit(): void {
  }

  fetchBarbers() {
    return this.http.get<Barber[]>('http://localhost:3000/barbers')
      .subscribe(data => this.barbers = data.reduce((prev: { [id: number]: Barber }, current) => {
        prev[current.id] = current;
        return prev;
      }, {}));
  }

  fetchServices() {
    return this.http.get<Service[]>('http://localhost:3000/services')
      .subscribe(data => this.services = data.reduce((prev: { [id: number]: Service }, current) => {
        prev[current.id] = current;
        return prev;
      }, {}));
  }

  fetchAppointments() {
    return this.http.get<Appointment[]>('http://localhost:3000/appointments').subscribe(data => this.appointments = data);
  }

  updateTimeEntries() {
    const foundBarber = this.barbers[+this.formGroup.controls.barber.value!];
    const foundService = this.services[+this.formGroup.controls.service.value!];

    if (!foundBarber || !foundService) {
      return;
    }

    const dayOfTheWeek = new Date(this.formGroup.controls.date.value as string).getDay();
    const foundWorkHours = foundBarber.workHours.find(h => h.day == dayOfTheWeek);

    if (!foundWorkHours) {
      return;
    }

    this.formGroup.controls.time.setValue('0');
    this.timeEntries = [];

    const serviceDuration = foundService.durationMinutes * 60 * 1000;
    const timeEntries: TimeEntry[] = [];

    const date = new Date(this.formGroup.controls.date.value as string);
    date.setHours(foundWorkHours.startHour);

    const endDate = new Date(this.formGroup.controls.date.value as string);
    endDate.setHours(foundWorkHours.endHour);

    const breakDate = new Date(this.formGroup.controls.date.value as string);
    breakDate.setHours(foundWorkHours.lunchTime.startHour);
    const breakDuration = foundWorkHours.lunchTime.durationMinutes * 60 * 1000;

    const filteredAppointments = this.appointments
      .filter(appointment => new Date(appointment.startDate).getDate() === date.getDate())
      .sort((a, b) => a.startDate - b.startDate);

    let currentAppointmentIndex = 0;

    let handledBreak = false;

    while ((+date + serviceDuration) < +endDate) {
      const newDate = new Date(+date + serviceDuration);

      if (!handledBreak && (newDate > breakDate && date <= breakDate)) {
        handledBreak = true;
        date.setTime(breakDate.getTime() + breakDuration);
        continue;
      }

      const currentAppointmentStartDate = filteredAppointments[currentAppointmentIndex]?.startDate;

      if (currentAppointmentStartDate < +newDate && currentAppointmentStartDate >= +date) {
        const currentAppointmentDuration = this.services[filteredAppointments[currentAppointmentIndex].serviceId].durationMinutes;
        date.setTime(currentAppointmentStartDate + currentAppointmentDuration * 60 * 1000);
        newDate.setTime(+date + serviceDuration);
        ++currentAppointmentIndex;
        continue;
      }

      const startHour = date.getHours().toString().padStart(2, '0');
      const startMinutes = date.getMinutes().toString().padStart(2, '0');
      const endHour = newDate.getHours().toString().padStart(2, '0');
      const endMinutes = newDate.getMinutes().toString().padStart(2, '0')

      timeEntries.push({
        value: +date, label: `${startHour}:${startMinutes}-${endHour}:${endMinutes}`
      });

      date.setTime(newDate.getTime());
    }

    this.timeEntries = timeEntries;
  }

  postAppointment() {
    const { time, barber, service, firstName, lastName, email, contactNumber } = this.formGroup.controls;

    const newAppointment = {
      startDate: +time.value!,
      barberId: +barber.value!,
      serviceId: +service.value!,
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      contactNumber: contactNumber.value
    };

    this.http.post('http://localhost:3000/appointments', newAppointment).subscribe(
      _data => {
        this.router.navigateByUrl('/booking-success');
      },
      _error => {
        console.log(_error)
        console.log(this.formGroup)
        this.showErrors = true;
        this.fetchAppointments();
      }
    );
  }

  submit() {
    this.showErrors = false;

    if (!this.formGroup.valid) {
      this.showErrors = true;
    }
    else {
      this.postAppointment();
    }
  }

  changeService() {
    const foundService = this.services[+(this.formGroup.controls.service.value || '0')];
    if (foundService) {
      this.formGroup.controls.price.setValue(`Price is ${foundService.price}`);
    }
    this.updateTimeEntries();
  }

}
