import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import {Url} from 'app/core/config/app.config'
import { User } from '../user/user.types';
@Injectable()
export class AuthService
{
    private _currentUser:User
    private _authenticated: boolean = false;
tokenValid:boolean=false

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any>
    {
        return this._httpClient.post(Url+'/forget_password', email);
    }

    dispalyAdminDashboard()
    {
        const headers = new HttpHeaders().set('token', ` ${this.accessToken}`);
        return this._httpClient.get <any[]>(Url+'/dispalyadmin',{headers});
   
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any>
    {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post(Url+'/user_sign_in', credentials).pipe(
            switchMap((response: any) => {


                // Store the access token in the local storage
                this.accessToken = response.access_token;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;
                this._currentUser=response.user
                console.log('response sign in',response);

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {
        const headers = new HttpHeaders().set('token', ` ${this.accessToken}`);
        // Sign in using the token
        return this._httpClient.post(Url+'/token_sign_in',{}, {
           headers
        }).pipe(
            catchError(()=>
                
            

                // Return false
                 of(false)
            ),
            switchMap((response: any) => {
console.log(response);
if(!response){
    localStorage.removeItem('accessToken')
    location.reload()
    }

                // Replace the access token with the new one if it's available on
                // the response object.
                //
                // This is an added optional step for better security. Once you sign
                // in using the token, you should generate a new one on the server
                // side and attach it to the response object. Then the following
                // piece of code can replace the token with the refreshed one.
                // if ( response.accessToken )
                // {
                //     this.accessToken = response.accessToken;
                // }
                this._currentUser=response.user
                console.log(response.user.name);
                
              

                // Set the authenticated flag to true
                console.log(('sign in with token function'));
                
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return true
                return of(this._authenticated);
            },err=>{
                console.log(err);
                
            })
        );
    }

    /**
     * Sign out
     */
    getCurrentUser():User{
        return this._currentUser
    }
    signOut(): Observable<any>
    {
        
        const headers = new HttpHeaders().set('token', ` ${this.accessToken}`);
        // Remove the access token from the local storage
        this._httpClient.post(Url+"/user_sign_out",{},{headers}).subscribe(()=>{
            localStorage.removeItem('accessToken');

        })
        
        this._authenticated = false;

        // Set the authenticated flag to false

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user): Observable<any>
    {
        
        return this._httpClient.post(Url+'/user_sign_up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post(Url+'/user_sign_in', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
