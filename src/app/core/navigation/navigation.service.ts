import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { Navigation } from 'app/core/navigation/navigation.types';
import { AuthService } from '../auth/auth.service';
import { map, switchMap } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
})
export class NavigationService
{
    
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);
    private _isAdmin:any

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient,private auth:AuthService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation>
    {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation> {
        return this.auth.dispalyAdminDashboard().pipe(
          switchMap((data) => {
            console.log(data);
            
            console.log(data);
            this._isAdmin = data["isAdmin"];
            let claims=data["claims"]
            let details=data["details"]
            console.log(details);
            
            console.log(claims);
            
            console.log(this._isAdmin);
            
            return this._httpClient.get<Navigation>("api/common/navigation").pipe(
              map((navigation) => {
                let filteredNavigation;
      
                if (this._isAdmin) {
                  console.log(navigation.compact[0]);
                  let filteredDetails = details.filter(n => n["rights"].includes('r'));
                  console.log(  
                    filteredDetails);
                  let compactChildren = navigation.compact[0].children.filter(n => n.id == "admin-interface")[0].children.filter((elm) => {
                    
                   
                    
                    
                    return claims.includes(elm.id.toLowerCase()) 
                    && filteredDetails.find(obj => obj.hasOwnProperty('object') && obj.object === elm.id.toLowerCase()) !== undefined;

                    
                    
                  });
                  
                  console.log(compactChildren);
      
                  let filteredCompact = navigation.compact[0].children.map(n => {
                    if (n.id === "admin-interface") {
                      return { ...n, children: compactChildren };
                    } else {
                      return n;
                    }
                  });
      
                  let filteredDefault = navigation.default[0].children.map(n => {
                    if (n.id === "admin-interface") {
                      return { ...n, children: compactChildren };
                    } else {
                      return n;
                    }
                  });
      
                  let filteredFuturistic = navigation.futuristic[0].children.map(n => {
                    if (n.id === "admin-interface") {
                      return { ...n, children: compactChildren };
                    } else {
                      return n;
                    }
                  });
      
                  let filteredHorizontal = navigation.horizontal[0].children.map(n => {
                    if (n.id === "admin-interface") {
                      return { ...n, children: compactChildren };
                    } else {
                      return n;
                    }
                  });
      
                  filteredNavigation = {
                    ...navigation,
                    compact: [{ ...navigation.compact[0], children: filteredCompact }],
                    default: [{ ...navigation.default[0], children: filteredDefault }],
                    futuristic: [{ ...navigation.futuristic[0], children: filteredFuturistic }],
                    horizontal: [{ ...navigation.horizontal[0], children: filteredHorizontal }]
                  };
                }else {
                  // Filter out some navigation items based on their IDs
                  let compactChildren = navigation.compact[0].children;
                  
                  let filteredCompact = compactChildren.filter(n => n.id !== "admin-interface");
                  let defaultChildren = navigation.default[0].children;
                  let filteredDefault = defaultChildren.filter(n => n.id !== "admin-interface");
                  let futuristicChildren = navigation.futuristic[0].children;
                  let filteredFuturistic = futuristicChildren.filter(n => n.id !== "admin-interface");
                  let horizontalChildren = navigation.horizontal[0].children;
                  let filteredHorizontal = horizontalChildren.filter(n => n.id !== "admin-interface");
      
                  // Create a new navigation object that doesn't include the filtered items
                  filteredNavigation = { ...navigation, compact: [{ ...navigation.compact[0], children: filteredCompact }], default: [{ ...navigation.default[0], children: filteredDefault }], futuristic: [{ ...navigation.futuristic[0], children: filteredFuturistic }], horizontal: [{ ...navigation.horizontal[0], children: filteredHorizontal }] };
                }
      
                console.log(filteredNavigation);
                this._navigation.next(filteredNavigation);
      
                return filteredNavigation;
              })
            );
          })
        );
      }
      
      
}
