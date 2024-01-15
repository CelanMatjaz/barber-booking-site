import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

interface Gif {
  images: {
    fixed_height: {
      url: string;
    }
  }
};

@Component({
  selector: 'app-barber-booking-success',
  templateUrl: './barber-booking-success.component.html',
  styleUrls: ['./barber-booking-success.component.scss']
})
export class BarberBookingSuccessComponent {
  gifUrl: string = '';

  constructor(private http: HttpClient) {
    this.fetchGif();
  }

  fetchGif() {
    return this.http.get<{ data: Gif[] }>('https://api.giphy.com/v1/gifs/search?api_key=KeTn0RgXZQF8EDkUGgQmSaJYuWPEz5mI&q=barber')
      .subscribe(({ data }) => {
        this.gifUrl = data[Math.floor(Math.random() * data.length)].images.fixed_height.url;
      });
  }

}
