import { Photo } from 'src/app/modules/photos/photo-template';
import { PhotoFetcher } from 'src/app/modules/photos/services/photo-fetcher.service';
import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  OnInit,
  SimpleChanges,
} from '@angular/core';

interface LimitChange {
  max: number;
  wasRemoved: number;
}

@Component({
  selector: 'app-image-container',
  templateUrl: './image-container.component.html',
  styleUrls: ['./image-container.component.scss'],
})
export class ImageContainerComponent implements OnChanges, OnInit {
  @Input() city!: string;
  @Input() filter?: string;
  @Input() limit = 10;
  @Output() limitChange = new EventEmitter<LimitChange>();
  displayPhotos: Photo[] = [];
  originalPhotos: Photo[] = [];
  errorMessage: string;
  query = '';

  constructor(private photosService: PhotoFetcher) {}

  ngOnInit() {
    this.getPhotos();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.limitPhotos(this.limit);
    if (changes.city) {
      this.filter = '';
    }
    this.query = this.filter
      ? `${this.city} ${this.filter}`
      : `${this.city} 1920`;
    if (changes.city || changes.filter) {
      this.getPhotos();
    }
  }

  getPhotos() {
    this.originalPhotos = [];
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
          this.limit = 10;
          this.limitChange.emit({max: this.limit, wasRemoved: 0});
          this.limitPhotos(this.limit);
        }
      },
      (error) => {
        this.errorMessage = error;
      }
    );
  }

  limitPhotos(limit: number) {
    this.displayPhotos = this.originalPhotos.slice(0, limit);
  }

  removePhoto(index: number) {
    this.limit--;
    this.originalPhotos.splice(index, 1);
    this.limitPhotos(this.limit);
    this.limitChange.emit({max: this.limit, wasRemoved: 1});
  }
}
