import { Photo } from 'src/app/modules/photos/photo-template';
import { PhotoFetcher } from 'src/app/modules/photos/services/photo-fetcher.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-container',
  templateUrl: './image-container.component.html',
  styleUrls: ['./image-container.component.scss'],
})
export class ImageContainerComponent implements OnInit {
  photos: Photo[] = [];
  query: string;
  limit: number;
  errorMessage: string;

  constructor(private photosService: PhotoFetcher) {}

  ngOnInit() {
    this.getPhotos();
  }

  getPhotos() {
    this.query = 'Boston';
    this.limit = 8;
    this.photosService.getPhotos(this.query, this.limit).subscribe((results) => {
      for (const item of results.items) {
        if (item) {
          const photo = {
            title: item.title,
            link: item.link,
            contextLink: item.image.contextLink,
            height: item.image.height,
            width: item.image.width,
          };
          this.photos.push(photo);
        }
      }
      if (this.photos.length === 0) {
        this.errorMessage = '0 images found';
      } else {
        this.limitPhotos(this.limit);
      }
    }, (error) => {
        this.errorMessage = error;
        console.log(this.errorMessage);
    });
  }

  limitPhotos(limit: number) {
    this.photos = this.photos.slice(0, limit);
  }
}
