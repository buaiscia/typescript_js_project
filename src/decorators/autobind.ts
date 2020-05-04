namespace App {
    // autobind decorator

    export function autobind(
        _target: any,
        _methodName: string,
        descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        const adjDescriptor: PropertyDescriptor = {
            configurable: true,
            get() {
                const bindFn = originalMethod.bind(this);
                return bindFn;
            }
        }
        return adjDescriptor
    }

}