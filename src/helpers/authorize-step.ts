import { Redirect, PipelineStep, Next, NavigationInstruction } from "aurelia-router";
import { inject, Container } from "aurelia-framework";
import Constants from "config/constants";
import { Storage } from "./storage";

@inject(Storage)
export class AuthorizeStep implements PipelineStep {

    constructor(private storage: Storage) { }

    run(instruction: NavigationInstruction, next: Next) {
        let isLoggedIn = AuthorizeStep.isLoggedIn(),
            loginUrl = Constants.LOGIN_ROUTE_URL,
            isAdmin = AuthorizeStep.isAdmin();

        if (!isLoggedIn && instruction.config.name === Constants.LOGIN_ROUTE_NAME && (!location.hash || !location.hash.startsWith("access_token"))) {
            this.storage.clearAll();
        }

        if (!isLoggedIn) {
            if (instruction.getAllInstructions().some(i => (<IRoute>i.config).auth)) {
                this.storage.returnUrl = `${instruction.fragment}`;
                return next.cancel(new Redirect(loginUrl));
            }
        } else {
            // If the user is already authenticated 
            // and for some reason comes back to the login
            // then redirecto to previous URL
            if (instruction.config.name === Constants.LOGIN_ROUTE_NAME) {
                return next.cancel(new Redirect(this.storage.returnUrl));
            }

            // If the user is already authenticated
            // but is not and admin, and the current route requires admin privileges
            // then redirect the user to the default return url
            if (!isAdmin && instruction.getAllInstructions().some(i => (<IRoute>i.config).admin)) {
                this.storage.returnUrl = Constants.DEFAULT_RETURN_URL;
                return next.cancel(new Redirect(loginUrl));
            }
        }

        return next();
    }

    /**
     * Returns whether the user has logged in
     */
    static isLoggedIn(): boolean {
        let storage: Storage = Container.instance.get(Storage),
            token = storage.token;

        if (!token) {
            return false;
        }

        /*
        let exp;
        try {
            let base64Url = token.split(".")[1];
            let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            exp = JSON.parse(window.atob(base64)).exp;
        } catch (error) {
            return false;
        }

        if (exp) {
            return Math.round(new Date().getTime() / 1000) <= exp;
        }
        */

        return true;
    }

    /**
     * Returns whether the user has admin rights
     */
    static isAdmin(): boolean {
        let storage: Storage = Container.instance.get(Storage);
        return storage.isAdmin;
    }
}