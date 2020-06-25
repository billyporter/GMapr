import { defer } from 'rxjs';

// Create async observable that emits-once and completes after a JS engine turn 
export function asyncData<T>(data: T) {
    return defer(() => Promise.resolve(data));
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
