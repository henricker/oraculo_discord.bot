export interface IUseCase<I = any, O = any> {
    execute(input: I, ...params: unknown[]): Promise<O>
}