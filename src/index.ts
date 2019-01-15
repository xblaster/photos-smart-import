import { Observable, Observer, Subject, ReplaySubject, from, of, range } from 'rxjs';
import { map, mergeMap, filter, switchMap, take } from 'rxjs/operators';
import { readdir, stat } from 'fs';
import { join } from 'path';



//console.log("hello world");

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


function stat$(filename: string): Observable<FsEntry> {
    return new Observable<FsEntry>(o => {
        stat(filename, function cb(e, stat) {
            if (e) {
                o.error(e);
            } else {
                if (stat.isDirectory()) {
                    //readdir$(filename).subscribe(x => o.next(
                } else {
                    o.next(new FsEntry(filename, stat.isDirectory()));
                    o.complete();
                }
                
            }
           
        });
    });

}

function readdir$(dir: string) {

    return new Observable<Observable<FsEntry>>(o => {
        readdir(dir, function cb(e, files) {
            files.map((file: string) => {
                // o.next(dir+file);
                const filename = join(dir + file);
                o.next(stat$(filename));
                

            });
            o.complete();
        });

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

readdir$('../../')
    .pipe(mergeMap(x => from(x)))
    //.pipe(take(3))
    .subscribe(x => console.log(x));