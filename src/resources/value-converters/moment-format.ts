import * as moment from "moment";

export class MomentFormatValueConverter {
    toView(value, format) {
        return moment(value, moment.ISO_8601).format(format);
    }
}

