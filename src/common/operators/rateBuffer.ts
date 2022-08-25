import { Subscription, Observable, Subscriber } from 'rxjs';
import { OperatorFunction, SchedulerLike } from 'rxjs';
import { asyncScheduler, SchedulerAction } from 'rxjs';
import { createOperatorSubscriber } from '../operatorSubscriber';
import RawRate from '../../models/rawRate';

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

export function rateBuffer(bufferTimeSpan: number, ...otherArgs: any[]): OperatorFunction<RawRate, Map<string, RawRate>> {
    const scheduler = asyncScheduler;
    
    return (source: Observable<RawRate>) => {
        let bufferRecords: { buffer: Map<string, RawRate>; subs: Subscription };

        return new Observable<Map<string, RawRate>>(subscriber => {
            const keyGen = (rate: RawRate) => {
                var rateId = `${rate.ClientId}-${rate.Primary}${rate.Secondary}${rate.Tenor}`;
        
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