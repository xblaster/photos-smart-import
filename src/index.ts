import { promises, readdir, stat } from 'fs';
import { cpus } from 'os';
import { join } from 'path';
import { from, Observable, Observer, of, range, ReplaySubject, Subject } from 'rxjs';
import { distinct, filter, flatMap, map, mergeMap, switchMap, take, tap, zip, count, windowTime, mergeAll, reduce } from 'rxjs/operators';

const fs = require('fs');


function getFilesFromEntry$(filename: string): Observable<string> {
  const obs = Observable.create((observer: any) => {
    stat(filename, function cb(e, stat) {
      if (e) {
        console.log(e);
        observer.error(e);
      } else {
        if (stat.isDirectory()) {
          observer.next(readdir$(filename));
        } else {
          observer.next(from([filename]));
        }
        observer.complete();
      }
    });
  });

  return obs.pipe(mergeAll());
}

function readdir$(directory: string): Observable<string> {
  const obs = Observable.create((observer: any) => {
    fs.readdir(directory, (err, files) => {
      for (let file in files) {
        const filename = join(directory, files[file]);
        observer.next(getFilesFromEntry$(filename));
      }
      observer.complete();
    });

  });
  return obs.pipe(mergeAll());
}

readdir$("C:\\Users\\waxjero\\eclipse-workspace").pipe(count()
).subscribe(x => console.log(x));

