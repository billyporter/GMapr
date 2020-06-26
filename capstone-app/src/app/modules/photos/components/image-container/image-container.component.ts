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

  constructor(private photosService: PhotoFetcher) {}

  ngOnInit() {
    this.getPhotos();
  }

  // TODO(billyporter): Allow userinput for limitPhotos instead of hardcoding
  getPhotos() {
    this.photosService.getPhotos().subscribe((results) => {
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
      this.limitPhotos(6);
    });
  }

  limitPhotos(limit: number) {
    this.photos = this.photos.slice(0, limit);
  }
}
