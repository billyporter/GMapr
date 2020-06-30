import { Photo } from 'src/app/modules/photos/photo-template';
import { PhotoFetcher } from 'src/app/modules/photos/services/photo-fetcher.service';
import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-image-container',
  templateUrl: './image-container.component.html',
  styleUrls: ['./image-container.component.scss'],
})
export class ImageContainerComponent implements OnInit, OnChanges  {
  displayPhotos: Photo[] = [];
  originalPhotos: Photo[] = [];
  query: string;
  errorMessage: string;
  @Input() limit: number;
  @Output() limitChange = new EventEmitter<number>();

  constructor(private photosService: PhotoFetcher) {}
  ngOnInit() {
    this.limit = 10;
    this.getPhotos();
  }

  ngOnChanges() {
    this.limitPhotos(this.limit);
  }

  getPhotos() {
    this.query = 'Boston';
    this.photosService.getPhotos(this.query, 10).subscribe(
      (results) => {
        for (const item in results.items) {
          if (item) {
            const photo = {
              title: results.items[item].title,
              link: results.items[item].link,
              contextLink: results.items[item].image.contextLink,
              height: results.items[item].image.height,
              width: results.items[item].image.width,
            };
            this.originalPhotos.push(photo);
          }
        }
        if (this.originalPhotos.length === 0) {
          this.errorMessage = '0 images found';
        } else {
          this.limitPhotos(this.limit);
        }
      },
      (error) => {
        this.errorMessage = error;
        console.log(this.errorMessage);
      }
    );
  }

  limitPhotos(limit: number) {
    this.displayPhotos = this.originalPhotos.slice(0, limit);
  }

  removePhoto(index: number) {
    this.limit -= 1;
    this.limitChange.emit(this.limit);
    this.originalPhotos.splice(index, 1);
  }
}

