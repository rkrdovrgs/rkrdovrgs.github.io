import { BaseApiService } from "dataservices/base";
import { inject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { StoreRoute } from "./store-route";
import { AuthorizeStep } from "./authorize-step";
import { Storage } from "./storage";


interface IAuthResult {
    user: IUserInfo;
    credential: {
        accessToken: string;
    };
}

@inject(BaseApiService, Router, Storage)
export class AuthHelper {
    username: string;
    isRefreshingToken: boolean = false;

    constructor(private api: BaseApiService, private router: Router, private storage: Storage) { }

    configureAuth(config: any) {
        config.addPipelineStep("authorize", StoreRoute);
        config.addPipelineStep("authorize", AuthorizeStep);
    }

    setAuthenticationInformation(authInfo: IAuthResult) {
        this.storage.email = authInfo.user.email;
        this.storage.displayName = authInfo.user.displayName;
        this.storage.token = authInfo.credential.accessToken;
        this.router.navigate(this.storage.returnUrl);
    }

    isLoggedIn(): boolean {
        return AuthorizeStep.isLoggedIn();
    }

    isAdmin(): boolean {
        return AuthorizeStep.isAdmin();
    }

    /*
    logout() {

    }
    */

    /*
    refreshToken() {

    }
    */
}