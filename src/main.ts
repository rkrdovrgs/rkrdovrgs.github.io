import "jquery";
import "bootstrap";
import "whatwg-fetch";
import "url-search-params";
import { Aurelia } from "aurelia-framework"
import environment from "environment";


//Configure Bluebird Promises.
//Note: You may want to use environment-specific configuration.
(<any>Promise).config({
    warnings: {
        wForgottenReturn: false
    }
});

export function configure(aurelia: Aurelia) {
    aurelia.use
        .standardConfiguration()
        //globalize features
        .feature("resources")
        .plugin("aurelia-dialog");

    if (environment.debug) {
        aurelia.use.developmentLogging();
    }

    if (environment.testing) {
        aurelia.use.plugin("aurelia-testing");
    }

    aurelia.start().then(() => aurelia.setRoot());
}
