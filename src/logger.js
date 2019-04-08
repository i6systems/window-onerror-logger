import init from './init';
import format from './format';
import send from './send';

export default {
    init: (options) => {
        if(options) {
            window.loggerOpts = options;
        }

        init(window, format, send);
    },
};
