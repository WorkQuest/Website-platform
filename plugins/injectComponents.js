import Vue from 'vue';

import CtmModal from '~/components/CtmModal';
import CtmModalBox from '~/components/CtmModal/CtmModalBox';
import Header from '~/components/app/Header';
import BaseButton from '~/components/ui/BaseButton';
import BaseInput from '~/components/ui/BaseInput';

Vue.component('ctm-modal', CtmModal);
Vue.component('ctm-modal-box', CtmModalBox);
Vue.component('Header', Header);
Vue.component('base-btn', BaseButton);
Vue.component('base-field', BaseInput);
