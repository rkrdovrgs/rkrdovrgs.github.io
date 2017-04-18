interface IDialogResult<T> {
    wasCancelled: boolean;
    output: T;
}