import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
import { User } from 'app/core/user/user.types';
import {Url} from 'app/core/config/app.config'

@Injectable({
    providedIn: 'root'
})
export class UserService
{
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User)
    {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<any>
    {
        console.log(this._user.asObservable());
        
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<User>
    {
        return this._httpClient.get<User>('api/common/user').pipe(
            tap((user) => {
                console.log('oussema aaaaaaaaaa');
                
                this._user.next(user);
            })
        );
    }
deletePhone(id:number){
    return this._httpClient.delete(Url+'/deleteUserPhone/'+id)
}

    getAllUsers(): Observable<User[]>
    
    {
        // const url = `${Url+'/getAllUsers/'}?limit=${limit}&page=${page}`;
        const url = `${Url+'/getAll/'}`;

        return this._httpClient.get<Array<User>>(url)
    
    }




    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any>
    {
        return this._httpClient.patch<User>('api/common/user', {user}).pipe(
            map((response) => {
                this._user.next(response);
            })
        );
    }

}
