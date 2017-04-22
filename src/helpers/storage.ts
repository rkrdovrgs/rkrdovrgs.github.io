import environment from "environment";

const StorageKeys = {
    DisplayName: "displayName",
    Token: "accessToken",
    ReturnUrl: "returnUrl",
    Email: "email",
    IsAdmin: "isAdmin"
};

export class Storage {
    storage = environment.debug ? sessionStorage : localStorage;

    getItem(key: string): string {
        return this.storage.getItem(key);
    }

    setItem(key: string, data: string) {
        this.storage.setItem(key, data);
    }

    get displayName(): string {
        return this.storage.getItem(StorageKeys.DisplayName);
    }
    set displayName(value: string) {
        this.storage.setItem(StorageKeys.DisplayName, value);
    }

    get token(): string {
        return this.storage.getItem(StorageKeys.Token);
    }
    set token(value: string) {
        this.storage.setItem(StorageKeys.Token, value);
    }

    get returnUrl(): string {
        return this.storage.getItem(StorageKeys.ReturnUrl);
    }
    set returnUrl(value: string) {
        this.storage.setItem(StorageKeys.ReturnUrl, value);
    }

    get email(): string {
        return this.storage.getItem(StorageKeys.Email);
    }
    set email(value: string) {
        this.storage.setItem(StorageKeys.Email, value);
    }

    get isAdmin(): boolean {
        return btoa(this.storage.getItem(StorageKeys.Email)) === "cmtyZG8udnJnc0BnbWFpbC5jb20=";
    }

    clearAll() {
        Object.keys(StorageKeys).forEach(k => {
            let sessionKey: string = StorageKeys[k];
            if (sessionKey !== StorageKeys.ReturnUrl) {
                this.storage.removeItem(sessionKey);
            }
        });
    }

    getUserInfo(): IUserInfo {
        return {
            displayName: this.displayName,
            email: this.email
        };
    }
}