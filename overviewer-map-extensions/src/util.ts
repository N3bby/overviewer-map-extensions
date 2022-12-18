export function asType<T>(val: T): T {
    return val
}

export function wait(milliseconds: number): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(resolve, milliseconds)
    })
}