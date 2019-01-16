import { promises, readdir, stat } from 'fs';
import { cpus } from 'os';
import { join } from 'path';
import { from, Observable, Observer, of, range, ReplaySubject, Subject } from 'rxjs';
import { distinct, filter, flatMap, map, mergeMap, switchMap, take, tap, zip, count, windowCount, mergeAll } from 'rxjs/operators';

const entryCrawler = new Subject<FsEntry>();


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

//
// Asynchronously reads the stats of the item at the path.
//
/*
function stat$(path) {
    return Observable.create(observer => {
        fs.stat(path, function cb(e, stat) {
            if(e) return observer.onError(e);
            var data = getFilenameMetaData(path || '');
            data.stat = stat;
            observer.onNext(data);
            observer.onCompleted();
        });
    });
};
function getFilenameMetaData$(path) {
    var extension = Path.extname(path);
    return {
        extension: Path.extname(path),
        name:      Path.basename(path, extension),
        location:  Path.dirname(path),
        path:      path
    };
};*/

/*readdir$('../../')
    .pipe(mergeMap(x => from(x)))
    //.pipe(take(3))
    .subscribe(x => console.log(x));*/

/*const files = new Subject<FsEntry>();
const dir = new Subject<FsEntry>();*/

const files = entryCrawler.pipe(filter(x => !x.isDir()));
const dir = entryCrawler.pipe(filter(x => x.isDir()));

const e = dir.pipe(tap(x => readdir$(x)));
// .pipe(x => stat$(x));


//files.pipe(
  /*
  windowCount(20),
  mergeAll()).subscribe(x => console.log("size "+JSON.stringify(x)));*/
e.subscribe();
files.subscribe(x => console.log(x));

//entryCrawler.subscribe(x => console.log(x));

entryCrawler.next(new FsEntry('d:\\tmp2', true));