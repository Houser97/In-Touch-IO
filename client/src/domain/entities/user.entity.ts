export interface User {
    id: string,
    email: string,
    name: string,
    pictureUrl: string,
    pictureId: string
}


export interface UserDb {
    id: string;
    name: string;
    email: string;
    pictureUrl: string;
    pictureId: string;
}