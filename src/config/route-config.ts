import * as _ from "lodash";
import routes from "config/routes";

export class RouteConfiguration {
    private getRoutes(): Array<IRoute> {
        return _.map(routes, (r: IRoute) => {
            r.elementId = r.elementId || r.name || r.moduleId.split("/").pop();
            r.auth = r.auth !== false;
            return r;
        });
    }

    configure(config): void {
        config.options.pushState = true;
        config.options.hashChange = false;
        config.options.root = "/";

        config.map(this.getRoutes());
    }
}
