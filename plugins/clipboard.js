import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
import VueObserveVisibility from 'vue-observe-visibility';

VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);
Vue.use(VueObserveVisibility);
