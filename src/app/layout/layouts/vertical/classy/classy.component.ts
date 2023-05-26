import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { AuthService } from 'app/core/auth/auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector     : 'classy-layout',
    templateUrl  : './classy.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ClassyLayoutComponent implements OnInit, OnDestroy
{
    isScreenSmall: boolean;
    navigation: Navigation;
    user: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isAdmin: boolean;

    /**
     * Constructor
     */
    constructor(
          private toastr: ToastrService,
        private sanitizer: DomSanitizer,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _userService: UserService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private authService :AuthService,
        private _http:HttpClient
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number
    {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */ async  ngOnInit()
    {
        this.authService.dispalyAdminDashboard().subscribe((data) => {
            console.log(data["isAdmin"], "isAdmin value"); // Add this line to log isAdmin to the console
            this.isAdmin = data["isAdmin"];
        });
        // Subscribe to navigation data
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation;
            });

        // Subscribe to the user service
        this._userService.user$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((user: User) => {
                console.log(user);
                
                if (user.avatar) {
                    // const imageData = atob(user.avatar);

                    
                }
                this.user = user;
            });
console.log(this.user);

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }
   async getAvatar(pic){
return pic
    }
    onChangeAvatarClick() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
      
        input.addEventListener('change', (event) => {
          const fileInput = event.target as HTMLInputElement;
          if (fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
      
            reader.onload = () => {
              const newAvatar = reader.result.toString();
              if (newAvatar !== this.user.avatar) {
               
                console.log(file);
                
                // Send a PUT request to the backend to update the user's avatar
                this._userService.updateAvatar(this.authService.getCurrentUser().id,file).subscribe((data)=>{
                    console.log(data);
                    this.user.avatar = newAvatar;
                    this.toastr.success('Image updated','success')
                },(err)=>{
                    this.toastr.error('Invalid Image','Failed')
                    
                })
            };
          }
    }});
      
        input.click();
      }
      
      
    getPictureUrl(picture) {
        if (!picture) {
          // If the picture is null or undefined, return a default image URL
          return null;
        }
      
        let base64Picture;
              
        try {
          // Try to decode the base64-encoded picture
          base64Picture = btoa(picture);
        } catch (e) {
          console.error('Invalid base64 string:', picture);
          // If the picture is not valid base64 data, return a default image URL
          return 'https://example.com/default-image.png';
        }
              
        // Construct the data URL for the picture
        const dataUrl = `data:image/jpeg;base64,${base64Picture}`;
            
        return dataUrl;
      }
      
    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void
    {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if ( navigation )
        {
            // Toggle the opened status
            navigation.toggle();
        }
    }
}
