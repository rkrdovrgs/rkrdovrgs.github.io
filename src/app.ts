import { Router } from "aurelia-router";
import { inject } from "aurelia-framework";
import { RouteConfiguration } from "config/route-config";
import { FirebaseConfiguration } from "config/firebase-config";
import projectInfo from "config/project-info";

@inject(RouteConfiguration, FirebaseConfiguration)
export class App {
    router: Router;

    constructor(private routeConfiguration: RouteConfiguration, private firebaseConfiguration: FirebaseConfiguration) { }

    configureRouter(config, router: Router) {
        config.title = projectInfo.projectTitle;

        //configuring routes    
        this.routeConfiguration.configure(config);

        this.router = router;

        this.firebaseConfiguration.configure();
    }
}