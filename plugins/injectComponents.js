import Vue from 'vue';

import VuePhoneNumberInput from 'vue-phone-number-input';
import CtmModal from '~/components/CtmModal';
import CtmModalBox from '~/components/CtmModal/CtmModalBox';
import Loader from '~/components/ui/Loader';
import Header from '~/components/app/Header';
import BaseButton from '~/components/ui/BaseButton';
import BaseInput from '~/components/ui/BaseInput';
import BaseDD from '~/components/ui/BaseDD';
import BaseFilterDD from '~/components/ui/BaseFilterDD';
import BaseCheckbox from '~/components/ui/BaseCheckbox';
import GMap from '~/components/GMap';
import GMapMarker from '~/components/GMapMarker';
import GMapInfoWindow from '~/components/GMapInfoWindow';
import BaseTable from '~/components/ui/BaseTable';
import BasePager from '~/components/ui/BasePager';
import QuestDD from '~/components/ui/QuestDD';
import BaseTextarea from '~/components/ui/BaseTextarea';
import QuestIdDD from '~/components/ui/QuestIdDD';
import InvitedWorkerList from '~/components/app/pages/quests_id/invitedWorkerList';
import RespondedWorkerList from '~/components/app/pages/quests_id/respondedWorkerList';
import StarRating from '~/components/app/pages/quests_id/starRating';
import SpecializationsSelector from '~/components/ui/SpecializationsSelector';

Vue.component('ctm-modal', CtmModal);
Vue.component('ctm-modal-box', CtmModalBox);
Vue.component('Header', Header);
Vue.component('base-btn', BaseButton);
Vue.component('base-field', BaseInput);
Vue.component('base-dd', BaseDD);
Vue.component('base-filter-dd', BaseFilterDD);
Vue.component('base-checkbox', BaseCheckbox);
Vue.component('loader', Loader);
Vue.component('GmapMap', GMap);
Vue.component('GMapMarker', GMapMarker);
Vue.component('GMapInfoWindow', GMapInfoWindow);
Vue.component('base-table', BaseTable);
Vue.component('base-pager', BasePager);
Vue.component('quest-dd', QuestDD);
Vue.component('quest-id-dd', QuestIdDD);
Vue.component('base-textarea', BaseTextarea);
Vue.component('vue-phone-number-input', VuePhoneNumberInput);
Vue.component('invited-worker-list', InvitedWorkerList);
Vue.component('responded-worker-list', RespondedWorkerList);
Vue.component('star-rating', StarRating);
Vue.component('specializations-selector', SpecializationsSelector);
