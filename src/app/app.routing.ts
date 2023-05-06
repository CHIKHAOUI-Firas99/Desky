import { Route } from "@angular/router";
import { AuthGuard } from "app/core/auth/guards/auth.guard";
import { NoAuthGuard } from "app/core/auth/guards/noAuth.guard";
import { LayoutComponent } from "app/layout/layout.component";
import { InitialDataResolver } from "app/app.resolvers";
import { RolesComponent } from "./modules/admin/dashboards/roles/roles.component";
import { UsersComponent } from "./modules/admin/dashboards/users/users.component";
import { MapConceptorComponent } from "./modules/admin/dashboards/map-conceptor/map-conceptor.component";
import { RolesAuthGuard } from "./core/auth/guards/roles.guard";
import { MapAuthGuard } from "./core/auth/guards/map.guard";
import { UsersAuthGuard } from "./core/auth/guards/users.guard";
import { Component } from "@angular/core";
import { AddMaterialComponent } from "./modules/admin/dashboards/add-material/add-material.component";
import { MaterialsAuthGuard } from "./core/auth/guards/materials.guards";
import { BookingComponent } from "./modules/booking/dashboards/booking/booking/booking.component";
import { SettingsAccountComponent } from "./modules/settings/settings-account/settings-account.component";
import { DemandsAuthGuard } from "./core/auth/guards/demands.guards";

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
  // Redirect empty path to '/example'
  { path: "", pathMatch: "full", redirectTo: "dashboards/users" },

  // Redirect signed-in user to the '/dashboards/project'
  //
  // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
  // path. Below is another redirection for that path to redirect the user to the desired
  // location. This is a small convenience to keep all main routes together here on this file.
  {
    path: "signed-in-redirect",
    pathMatch: "full",
    redirectTo: "dashboards/booking",
  },

  // Auth routes for guests
  {
    path: "",
    canMatch: [NoAuthGuard],
    component: LayoutComponent,
    data: {
      layout: "empty",
    },
    children: [
      {
        path: "confirmation-required",
        loadChildren: () =>
          import(
            "app/modules/auth/confirmation-required/confirmation-required.module"
          ).then((m) => m.AuthConfirmationRequiredModule),
      },
      {
        path: "forgot-password",
        loadChildren: () =>
          import(
            "app/modules/auth/forgot-password/forgot-password.module"
          ).then((m) => m.AuthForgotPasswordModule),
      },
      {
        path: "reset-password",
        loadChildren: () =>
          import("app/modules/auth/reset-password/reset-password.module").then(
            (m) => m.AuthResetPasswordModule
          ),
      },
      {
        path: "sign-in",
        loadChildren: () =>
          import("app/modules/auth/sign-in/sign-in.module").then(
            (m) => m.AuthSignInModule
          ),
      },
      {
        path: "sign-up",
        loadChildren: () =>
          import("app/modules/auth/sign-up/sign-up.module").then(
            (m) => m.AuthSignUpModule
          ),
      },
    ],
  },

  // Auth routes for authenticated users
  {
    path: "",
    canMatch: [AuthGuard],
    component: LayoutComponent,
    data: {
      layout: "empty",
    },
    children: [
      {
        path: "sign-out",
        loadChildren: () =>
          import("app/modules/auth/sign-out/sign-out.module").then(
            (m) => m.AuthSignOutModule
          ),
      },
      {
        path: "unlock-session",
        loadChildren: () =>
          import("app/modules/auth/unlock-session/unlock-session.module").then(
            (m) => m.AuthUnlockSessionModule
          ),
      },
    ],
  },

  // Landing routes
  {
    path: "",
    component: LayoutComponent,
    data: {
      layout: "empty",
    },
    children: [
      {
        path: "home",
        loadChildren: () =>
          import("app/modules/landing/home/home.module").then(
            (m) => m.LandingHomeModule
          ),
      },
    ],
  },

  // Admin routes
  {
    path: "",
    canMatch: [AuthGuard],
    component: LayoutComponent,
    resolve: {
      initialData: InitialDataResolver,
    },
    children: [
      {
        path: "dashboards",
        children: [
          {
            path: "users",
            loadChildren: () =>
              import("app/modules/admin/dashboards/users/users.module").then(
                (m) => m.UsersModule
              ),

            canActivate: [UsersAuthGuard],
          },
          {
            path: "roles",
            loadChildren: () =>
              import("app/modules/admin/dashboards/roles/roles.module").then(
                (m) => m.RolesModule
              ),
            canActivate: [RolesAuthGuard],
          },
          {
            path: "mapConceptor",
            loadChildren: () =>
              import(
                "app/modules/admin/dashboards/map-conceptor/map-conceptor.module"
              ).then((m) => m.MapConceptorModule),
            canActivate: [MapAuthGuard],
          },
          // {
          //   path:'add-material',
          //   loadChildren: () => import("app/modules/admin/dashboards/add-material/add-material.module")
          //     .then((m) => m.AddMaterialModule),
          // },
          {
            path:'materials',
            loadChildren: () => import("app/modules/admin/dashboards/materials/materials.module")
              .then((m) => m.MaterialsModule),
              canActivate: [MaterialsAuthGuard],
          },
          {
            path:'demands',
            loadChildren: () => import("app/modules/admin/dashboards/demands/demands.module")
              .then((m) => m.DemandsModule),
              canActivate: [DemandsAuthGuard],
          },
          
         
        ],
      },
    ],
  },
  {
    path: '',
    canMatch: [AuthGuard],
    component: LayoutComponent,
    resolve: {
        initialData: InitialDataResolver,
    },
    children: [{
        path : "dashboards/booking" , component : BookingComponent,
    },
    {
      path : "settings",pathMatch: "full",
      loadChildren: () =>
        import("app/modules/settings/settings.module").then(
          (m) => m.SettingsModule
        ),
    }
    ]
},
  {
    path: "404-not-found",
    pathMatch: "full",
    loadChildren: () =>
      import("app/modules/admin/error/error-404/error-404.module").then(
        (m) => m.Error404Module
      ),
  },
{path:'add',component:AddMaterialComponent},
  { path: "**", redirectTo: "404-not-found"},
];
