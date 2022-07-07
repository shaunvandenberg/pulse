import { Subscription, Observable, Subscriber } from 'rxjs';
import { OperatorFunction, SchedulerLike } from 'rxjs';
import { createOperatorSubscriber, OperatorSubscriber } from './OperatorSubscriber';
import { asyncScheduler, SchedulerAction } from 'rxjs';
import RawRate from './rawRate';

// export function executeSchedule(
//     parentSubscription: Subscription,
//     scheduler: SchedulerLike,
//     work: () => void,
//     delay = 0,
//     repeat = false
//   ): Subscription | void {
//     const scheduleSubscription = scheduler.schedule(function (this: SchedulerAction<any>) {
//       work();
//       if (repeat) {
//         parentSubscription.add(this.schedule(null, delay));
//       } else {
//         this.unsubscribe();
//       }
//     }, delay);
  
//     parentSubscription.add(scheduleSubscription);
  
//     if (!repeat) {
//       // Because user-land scheduler implementations are unlikely to properly reuse
//       // Actions for repeat scheduling, we can't trust that the returned subscription
//       // will control repeat subscription scenarios. So we're trying to avoid using them
//       // incorrectly within this library.
//       return scheduleSubscription;
//     }
//   }

export function executeSchedule(
    parentSubscription: Subscription,
    scheduler: SchedulerLike,
    work: () => void,
    delay = 0
  ): Subscription | void {
    const scheduleSubscription = scheduler.schedule(function (this: SchedulerAction<any>) {
        work();

        this.unsubscribe();
    }, delay);
  
    parentSubscription.add(scheduleSubscription);
  
    return scheduleSubscription;
}

// export function myBufferTime<T>(bufferTimeSpan: number, ...otherArgs: any[]): OperatorFunction<T, T[]> {
//     const scheduler = asyncScheduler;

//     return (source: Observable<T>) => {
//         let bufferRecords: { buffer: T[]; subs: Subscription }[] | null = [];

//         const arrRemove = <T>(arr: T[] | undefined | null, item: T) => {
//             const index = arr.indexOf(item);
//             0 <= index && arr.splice(index, 1);
//         };

//         return new Observable<T[]>(subscriber => {
//             const emit = (record: { buffer: T[]; subs: Subscription }) => {
//                 const { buffer, subs } = record;
//                 subs.unsubscribe();
//                 arrRemove(bufferRecords, record);
//                 subscriber.next(buffer);
                
//                 let p = {
//                     b: record.buffer,
//                     r: bufferRecords
//                 };

//                 console.log(p);

//                 startBuffer();
//             };
        
//             const startBuffer = () => {
//                 if (bufferRecords) {
//                     const subs = new Subscription();
                    
//                     subscriber.add(subs);
                    
//                     const buffer: T[] = [];
//                     const record = {
//                         buffer,
//                         subs,
//                     };
                    
//                     bufferRecords.push(record);
                    
//                     executeSchedule(subs, scheduler, () => emit(record), bufferTimeSpan);
//                 }
//             };

//             startBuffer();

//             const bufferTimeSubscriber = createOperatorSubscriber(
//                 subscriber,
//                 (value: T) => {
//                     const recordsCopy = bufferRecords!.slice();
                  
//                     for (const record of recordsCopy) {
//                         const { buffer } = record;

//                         buffer.push(value);
//                     }
//                 },
//                 () => {
//                     while (bufferRecords?.length) {
//                         subscriber.next(bufferRecords.shift()!.buffer);
//                     }

//                     bufferTimeSubscriber?.unsubscribe();
//                     subscriber.complete();
//                     subscriber.unsubscribe();
//                 },
//                 undefined,
//                 () => (bufferRecords = null));
          
//                 source.subscribe(bufferTimeSubscriber);
//         });
//     };
// }

export type KeyGen<T> = (item: T) => string;

export function ratesBufferTime(bufferTimeSpan: number, ...otherArgs: any[]): OperatorFunction<RawRate, Map<string, RawRate>> {
    const scheduler = asyncScheduler;
    
    return (source: Observable<RawRate>) => {
        let bufferRecords: { buffer: Map<string, RawRate>; subs: Subscription };

        return new Observable<Map<string, RawRate>>(subscriber => {
            const keyGen = (rate: RawRate) => {
                var rateId = `${rate.clientId}-${rate.primary}${rate.secondary}${rate.tenor}`;
        
                return rateId;
            };
            
            const emit = (record: { buffer: Map<string, RawRate>; subs: Subscription }) => {
                const { buffer, subs } = record;
                
                subs.unsubscribe();
                
                subscriber.next(buffer);

                startBuffer();
            };
        
            const startBuffer = () => {
                const subs = new Subscription();
                
                subscriber.add(subs);
                
                const buffer: Map<string, RawRate> = new Map();
                const record = {
                    buffer,
                    subs,
                };
                
                bufferRecords = record;
                
                executeSchedule(subs, scheduler, () => emit(record), bufferTimeSpan);
            };

            startBuffer();

            const bufferTimeSubscriber = createOperatorSubscriber(
                subscriber,
                (rate: RawRate) => {
                    const { buffer } = bufferRecords;
                    const key = keyGen(rate);

                    buffer.set(key, rate);
                },
                () => {
                    subscriber.next(bufferRecords.buffer);

                    bufferTimeSubscriber?.unsubscribe();

                    subscriber.complete();
                    subscriber.unsubscribe();
                },
                undefined,
                () => (bufferRecords = null));
          
                source.subscribe(bufferTimeSubscriber);
        });
    };
}