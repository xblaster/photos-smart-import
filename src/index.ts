import { promises, readdir, stat } from 'fs';
import { cpus } from 'os';
import { join } from 'path';
import { from, Observable, Observer, of, range, ReplaySubject, Subject } from 'rxjs';
import { distinct, filter, flatMap, map, mergeMap, switchMap, take, tap, zip, count, windowTime, mergeAll, reduce } from 'rxjs/operators';

const fs = require('fs');



// console.log("hello world");

/*range(1, 10)
  .pipe(filter(x => x % 2 === 1), map(x => x + x))
  .subscribe(x => console.log(x));*/

class FsEntry {
  name: string;
  private isdir: boolean;

  constructor(name: string, isDir: boolean) {
    this.name = name;
    this.isdir = isDir;
  }

  isDir(): boolean {
    return this.isdir;
  }
}

/*
function stat$(filename: string): Promise<FsEntry> {
  //console.log('stat$ ' + JSON.stringify(filename));
  return new Promise<FsEntry>((resolve, reject) => {
    stat(filename, function cb(e, stat) {
      if (e) {
        reject(e);
      } else {
        resolve(new FsEntry(filename, stat.isDirectory()));
      }
    });
  });
}



function readdir$(entry: FsEntry): void {
  //console.log('readdir$ ' + JSON.stringify(entry));
  readdir(entry.name, function cb(e, files) {
    if (e) {
      console.log(e);
    } else {
      files.map((file: string) => {



        // o.next(dir+file);
        const filename = join(entry.name, file);
        //console.log(filename);
        // files.next(from(stat$(filename)));
        stat$(filename).then(
          (res) => {
            entryCrawler.next(res);
          });
      });
    }
  });
}


const files = entryCrawler.pipe(filter(x => !x.isDir()));
const dir = entryCrawler.pipe(filter(x => x.isDir()));

const e = dir.pipe(tap(x => readdir$(x)));
// .pipe(x => stat$(x));


//files.pipe(
  /*
  windowCount(20),
  mergeAll()).subscribe(x => console.log("size "+JSON.stringify(x)));*/

function getFileNature$(filename: string): Observable<string> {
  const obs = Observable.create((observer: any) => {
    stat(filename, function cb(e, stat) {
      if (e) {
        //do nothing
        console.log(e);
      } else {
        //resolve(new FsEntry(filename, stat.isDirectory()));
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
        //console.log(filename);
        observer.next(getFileNature$(filename));

        //observer.next(from([filename]));
      }

      observer.complete();
    });


    /*observer.next('Hello');
    observer.next('World');
    observer.complete();*/
  });
  //return obs;
  return obs.pipe(mergeAll());
}



readdir$("C:\\Users\\waxjero\\eclipse-workspace").pipe(count()
).subscribe(x => console.log(x));

/*
e.subscribe();
files.subscribe(x => console.log(x));*/

//entryCrawler.subscribe(x => console.log(x));

//entryCrawler.next(new FsEntry('../../', true));