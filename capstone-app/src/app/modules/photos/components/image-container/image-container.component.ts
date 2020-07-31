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
  ChangeDetectorRef,
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
  guy = 0;
  imageLinks: string[] = [];
  wasRemoved: number;
  numLoaded: number;
  display: boolean;
  allowClick = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  value = 0;

  constructor(private cd: ChangeDetectorRef, private photosService: PhotoFetcher) {}

  ngOnInit() {
    this.getPhotos();
  }

  // TODO(billyporter): Fix expressionchanged error
  ngOnChanges(changes: SimpleChanges) {
    if (changes.limit && this.numLoaded === this.limit) {
      this.display = true;
    }
    if (this.filter === this.city) {
      this.filter = '';
    }
    if (changes.city) {
      this.filter = '';
    }
    this.query = this.filter
      ? `${this.city} ${this.filter}`
      : `${this.city} early 1900s`;
    if (changes.city || changes.filter) {
      this.getPhotos();
    }
    else {
      this.limitPhotos(this.limit);
    }
  }

  getPhotos() {
    this.allowClick = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.originalPhotos = [];
    this.imageLinks = [];
    this.wasRemoved = 0;
    this.display = false;
    const currentQuery = this.query;
    this.photosService.getPhotos(this.query, 10).subscribe(
      (results) => {
        let isOldRequest = false;
        if (currentQuery !== this.query) {
          isOldRequest = true;
        }
        for (const item in results.items) {
          if (isOldRequest) {
            break;
          }
          else if (item) {
            const photo = {
              title: results.items[item].title,
              link: results.items[item].link,
              contextLink: results.items[item].image.contextLink,
            };
            if (!this.isDuplicate(photo.link)) {
              this.originalPhotos.push(photo);
            }
            else {
              this.wasRemoved = 1;
            }
          }
        }
        if (this.originalPhotos.length === 0 && !isOldRequest) {
          this.errorMessage = '0 images found';
        } else if (!isOldRequest) {
          this.numLoaded = 0;
          this.value = 0;
          this.limitPhotos(this.limit);
          this.limitChange.emit({max: this.originalPhotos.length, wasRemoved: this.wasRemoved});
        }
      },
      (error) => {
        this.errorMessage = error;
      }
    );
  }

  limitPhotos(limit: number) {
    this.displayPhotos = this.originalPhotos.slice(0, limit);
    this.cd.detectChanges();
  }

  removePhoto(index: number) {
    this.limit = this.displayPhotos.length - 1;
    this.originalPhotos.splice(index, 1);
    this.limitPhotos(this.limit);
    this.limitChange.emit({max: this.originalPhotos.length, wasRemoved: 1});
  }

  isDuplicate(photoLink: string) {
    const shortenedLink = photoLink.match(/([^\/]+$)/g)[0];
    if (this.imageLinks.includes(shortenedLink)) {
      return true;
    }
    else {
      this.imageLinks.push(shortenedLink);
      return false;
    }
  }

  loading() {
    this.numLoaded++;
    const smallerOne = this.limit > this.originalPhotos.length ? this.originalPhotos.length : this.limit;
    this.value = (100 / smallerOne) * this.numLoaded;
    if (this.numLoaded === this.limit || this.numLoaded === this.originalPhotos.length) {
      this.display = true;
      this.value = 0;
    }
    this.cd.detectChanges();
  }

  toggleClickEvent(index: number) {
    this.allowClick = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.allowClick[index] = 1;
    this.cd.detectChanges();
  }
}
