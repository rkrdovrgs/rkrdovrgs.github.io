import { Router } from "aurelia-router";
import { inject } from "aurelia-framework";
import { RouteConfiguration } from "config/route-config";
import { FirebaseConfiguration } from "config/firebase-config";
import projectInfo from "config/project-info";
import { AuthHelper } from "helpers/auth-helper";

@inject(RouteConfiguration, FirebaseConfiguration, AuthHelper)
export class App {
    router: Router;

    constructor(private routeConfiguration: RouteConfiguration, private firebaseConfiguration: FirebaseConfiguration, private authHelper: AuthHelper) { }

    configureRouter(config, router: Router) {
        config.title = projectInfo.projectTitle;

        //configuring routes    
        this.routeConfiguration.configure(config);

        // configureing auth
        this.authHelper.configureAuth(config);

        this.router = router;

        //configuring db
        this.firebaseConfiguration.configure();
    }
}