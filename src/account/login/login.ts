import { inject } from "aurelia-framework";
import * as firebase from "firebase";
import { AuthHelper } from "helpers/auth-helper";

@inject(AuthHelper)
export class Login {
    provider = new firebase.auth.GithubAuthProvider();

    constructor(private authHelper: AuthHelper) {
        //this.provider.addScope("read:org");
        this.provider.setCustomParameters({
            "allow_signup": "false"
        });
    }

    loginWithGithub() {
        firebase.auth().signInWithPopup(this.provider).then(result =>
            this.authHelper.setAuthenticationInformation(result)
        ).catch(function (error) {
            /*
            console.log("error", arguments);
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user"s account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            */
        });
    }
}

