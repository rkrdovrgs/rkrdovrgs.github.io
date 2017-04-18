import { HttpClient, json } from "aurelia-fetch-client";
import { inject } from "aurelia-dependency-injection";
import * as _ from "lodash";
import * as moment from "moment";

export class BaseApiService extends HttpClient {
    constructor() {
        super();
        this.configure(config => {
            config.useStandardConfiguration()
                .withBaseUrl("/api/")
                .withInterceptor({
                    request: (request) => {
                        request.headers.append("cache-control", "no-cache");
                        return request;
                    }
                });
        });
    }

    static handleError(error: Error | Response): void {
        const message = error instanceof Error ? error.message : error.statusText;
        const exception = new Error(message);
        (exception as any).innerError = error;
        throw exception;
    }
    static pendingRequests: Array<boolean> = [];

    get<T>(url: string, params?: Object): Promise<T> {
        let request: any;

        BaseApiService.pendingRequests.push(true);
        if (Object.keys(params || {}).length) {
            let searchParams = new URLSearchParams();
            _.forEach(params, (value, key) => {
                searchParams.set(key, value);
            });
            url = `${url}?${searchParams.toString()}`;
        }

        request = this.fetch(url)
            .then(x => x.json())
            .catch(BaseApiService.handleError);

        return request.finally(() => BaseApiService.pendingRequests.pop());
    }


} 