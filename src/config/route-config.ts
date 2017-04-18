import * as _ from "lodash";
import routes from "config/routes";

export class RouteConfiguration {
    private getRoutes(): Array<IRoute> {
        return _.map(routes, (r: IRoute) => {
            r.elementId = r.elementId || r.moduleId.split('/').pop();
            return r;
        });
    }

    configure(config): void {
        config.options.pushState = true;
        config.options.hashChange = false;
        config.options.root = '/';

        config.map(this.getRoutes());
    }
}
