import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  scanData: any[] = [];
  fileName = '';
  selectedOptions: any[] = [];

  @ViewChild('list') list: any;
  @ViewChild('fileUpload') fileUpload: any;
  imageToShow: any = null;
  searchField: string = '';

  constructor(private http: HttpClient) {}

  compareFunction = (o1: any, o2: any) => o1?.id === o2?.id;

  ngOnInit() {
    this.getScanData();
  }

  getScanData() {
    this.http.get('http://localhost:3000/api/scans').subscribe({
      next: (res: any) => {
        this.scanData = res.payload;
      },
      error: (e: any) => {
        alert(e.error.message);
      },
      complete: () => console.info('complete'),
    });
  }

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    const file = event && event.item(0);

    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append('file', file);
      this.fileUpload.nativeElement.value = '';
      this.http.post('http://localhost:3000/api/upload', formData).subscribe({
        next: (res: any) => {
          this.fileName = '';
          this.scanData.unshift(res.payload);
          alert(res.message);
        },
        error: (e: any) => {
          alert(e.error.message);
        },
        complete: () => console.info('complete'),
      });
    }
  }

  deleteQR() {
    console.log(this.selectedOptions[0]);
    this.http
      .delete('http://localhost:3000/api/delete-scan', {
        params: {
          id: this.selectedOptions[0].id,
        },
      })
      .subscribe({
        next: () => {
          this.scanData = this.scanData.filter(
            (data) => data.id !== this.selectedOptions[0].id
          );
          this.clearSelection();
        },
        error: (e: any) => {
          alert(e.error.message);
        },
        complete: () => console.info('complete'),
      });
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.imageToShow = reader.result;
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  getQRImage(id: string) {
    this.http
      .get('http://localhost:3000/api/qr-image', {
        params: {
          id: id,
        },
        responseType: 'blob',
      })
      .subscribe({
        next: (res: any) => {
          this.createImageFromBlob(res);
        },
        error: (e: any) => {
          alert(e.error.message);
        },
        complete: () => console.info('complete'),
      });
  }

  clearSelection() {
    this.list.deselectAll();
  }

  clearSearchField() {
    this.searchField = '';
  }
}
