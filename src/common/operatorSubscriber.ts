import { Subscriber } from 'rxjs';

export function createOperatorSubscriber<T>(
    destination: Subscriber<any>,
    onNext?: (value: T) => void,
    onComplete?: () => void,
    onError?: (err: any) => void,
    onFinalize?: () => void
): Subscriber<T> {
    return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
}

export class OperatorSubscriber<T> extends Subscriber<T> {
    constructor(
        destination: Subscriber<any>,
        onNext?: (value: T) => void,
        onComplete?: () => void,
        onError?: (err: any) => void,
        private onFinalize?: () => void,
        private shouldUnsubscribe?: () => boolean
    ) {
        super(destination);
        this._next = onNext ? function (this: OperatorSubscriber<T>, value: T) {
            try {
                onNext(value);
            } catch (err) {
                destination.error(err);
            }
        } : super._next;
        
        this._error = onError ? function (this: OperatorSubscriber<T>, err: any) {
            try {
                onError(err);
            } catch (err) {
                // Send any errors that occur down stream.
                destination.error(err);
            } finally {
                // Ensure finalization.
                this.unsubscribe();
            }
        } : super._error;
        
        this._complete = onComplete ? function (this: OperatorSubscriber<T>) {
            try {
                onComplete();
            } catch (err) {
                // Send any errors that occur down stream.
                destination.error(err);
            } finally {
                // Ensure finalization.
                this.unsubscribe();
            }
        } : super._complete;
    }

    unsubscribe() {
        if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            const { closed } = this;
            super.unsubscribe();
            // Execute additional teardown if we have any and we didn't already do so.
            !closed && this.onFinalize?.();
        }
    }
}