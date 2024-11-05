export interface UserDBResponse {
    user: UserDb;
    token: string;
}

export interface UserDb {
    id: string;
    name: string;
    email: string;
    pictureUrl: string;
    pictureId: string;
}