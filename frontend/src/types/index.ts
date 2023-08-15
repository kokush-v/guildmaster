export interface IBot {
    id: number;
    name: string;
    imgUrl: string;
    status: boolean;
    modules: IModule[];
}

export interface IModule {
    id: string;
    prefix: string;
    name:string
    description: string
    enabled: boolean;
    active: boolean;
 }