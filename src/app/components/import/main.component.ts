// const fs = require('fs');
// const remoteElec = require('electron').remote;
// const electroFs = remoteElec.require('fs');
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
const { ipcRenderer } = window.require('electron');

import { Component, OnInit, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';

import * as jsPDF from 'jspdf';
import { Observable } from 'rxjs/Observable';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-home',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private zone: NgZone, private _electronService: ElectronService) {
    this.zone = zone;
  }

  public observableFiles: Observable<any[]>;
  private inPath = '';
  private targetDir;


  ngOnInit() {
    const that = this;

    ipcRenderer.on('get-chapters-list', (event, arg) => {
      console.log(arg);
      this.zone.run(() => { });
    });

  }

  asyEncode(chapter): Promise<string> {
    const p = new Promise<string>(resolve => {
      ipcRenderer.send('encode-chapter', chapter);
      ipcRenderer.on('encode-chapter-ok', (event, arg) => {
        resolve(arg);
      });
    });

    return p;

  }

  onSubmit(f: NgForm) {
    console.log(f.value);  // { first: '', last: '' }
    console.log(f.valid);  // false
  }

  onChange(file) {
    // console.log('on change !');
    // console.log(files[0].path);

    // console.log(file);
    const path = file[0].path;
    this.inPath = path;
    console.log(path);
    ipcRenderer.send('get-chapters', path);

    /*const myNotification = new Notification('Title', {
      body: 'Lorem Ipsum Dolor Sit Amet'
    });*/
  }

  onChangeTargetDir(file) {
    // console.log('on change !');
    // console.log(files[0].path);

    // console.log(file);
    const path = file[0].path;
    this.targetDir = path;
  }

  getPDF() {
    /*console.log(jsPDF);
    const doc = new jsPDF();
    doc.fromHTML(document.getElementById('images'), 0, 0, {
      'width': 1400, // max width of content on PDF
    }, function(bla) {   doc.save('saveInCallback.pdf');
   }, 12);*/
    window.print();
    // doc.save('a4.pdf');
  }
}
