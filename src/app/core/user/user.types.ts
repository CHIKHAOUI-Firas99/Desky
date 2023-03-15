export interface User
{
    role: any;
    authorization:boolean;
    id?: number;
    name: string;
    email: string;
    phoneNumber:string;
    avatar?: string;
    status?: string;
}
