export interface Context {
    mod: boolean;
    owner: boolean;
    vip: boolean;
    userName: string;
    displayName: string;
    [key: string]: any;
}
