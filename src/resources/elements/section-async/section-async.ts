import {BaseApiService} from 'dataservices/base';
import {containerless, bindable} from 'aurelia-framework';

@containerless
export class SectionAsync {
    @bindable class: string;
    serviceRef = BaseApiService;
}

