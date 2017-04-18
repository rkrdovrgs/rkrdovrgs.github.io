import * as project from '../aurelia.json';
import * as bundles from '../bundles.json';

Object.assign(project.build, bundles);

export default project;