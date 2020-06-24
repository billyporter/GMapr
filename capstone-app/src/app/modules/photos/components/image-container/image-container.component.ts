import { MockPhotoFetcher } from './../../services/mock-photo-fetcher.service';
import { Photo } from './../../photo-template';
import { PhotoFetcher } from './../../services/photo-fetcher.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-container',
  templateUrl: './image-container.component.html',
  styleUrls: ['./image-container.component.scss'],
})
export class ImageContainerComponent implements OnInit {
  photos: Photo[] = [];

  constructor(
    private photosService: PhotoFetcher,
    private mockPhotosService: MockPhotoFetcher
  ) {}

  ngOnInit() {
    this.getMockPhotos();
  }

  getPhotos() {
    this.photosService.getPhotos().subscribe((results) => {
      for (const item in results.items) {
        if (item) {
          const photo = {
            title: results.items[item].title,
            link: results.items[item].link,
            contextLink: results.items[item].image.contextLink,
            height: results.items[item].image.height,
            width: results.items[item].image.width,
          };
          this.photos.push(photo);
        }
      }
    });
  }

  getMockPhotos() {
    this.mockPhotosService.getPhotos().subscribe((results) => {
      for (const item in results.items) {
        if (item) {
          const photo = {
            title: results.items[item].title,
            link: results.items[item].link,
            contextLink: results.items[item].image.contextLink,
            height: results.items[item].image.height,
            width: results.items[item].image.width,
          };
          this.photos.push(photo);
        }
      }
    });
  }
}
