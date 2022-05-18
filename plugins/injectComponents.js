import Vue from 'vue';

import VuePhoneNumberInput from '~/node_modules/vue-phone-number-input';
import GMap from '~/node_modules/vue2-google-maps/src/components/map';
import GMapMarker from '~/node_modules/vue2-google-maps/src/components/marker';
import GMapCluster from '~/node_modules/vue2-google-maps/src/components/cluster';
import GMapInfoWindow from '~/node_modules/vue2-google-maps/src/components/infoWindow';
import GMapInfoBlock from '~/components/app/GMapInfoBlock';
import GMapLoader from '~/components/app/GMapLoader';
import SearchWithMap from '~/components/app/SearchWithMap';

import PanelFilters from '~/components/app/PanelFilters';

import Header from '~/components/app/Header';
import Footer from '~/components/app/Footer';
import CtmModal from '~/components/CtmModal';
import CtmModalBox from '~/components/CtmModal/CtmModalBox';
import Loader from '~/components/ui/Loader';
import BaseButton from '~/components/ui/BaseButton';
import BaseInput from '~/components/ui/BaseInput';
import BaseDD from '~/components/ui/BaseDD';
import BaseFilterDD from '~/components/ui/BaseFilterDD';
import BaseCheckbox from '~/components/ui/BaseCheckbox';
import BaseTable from '~/components/ui/BaseTable';
import BasePager from '~/components/ui/BasePager';
import QuestDD from '~/components/ui/QuestDD';
import BaseTextarea from '~/components/ui/BaseTextarea';
import WorkersList from '~/components/app/pages/quests_id/WorkersList';
import StarRating from '~/components/app/pages/quests_id/starRating';
import SpecializationsSelector from '~/components/ui/SpecializationsSelector';
import FilesUploader from '~/components/ui/FilesUploader';
import FilesPreview from '~/components/ui/FilesPreview';
import NotificationsButton from '~/components/ui/NotificationsButton';
import EmptyData from '~/components/app/info/emptyData';
import CardEmployee from '~/components/app/CardEmployee';
import CardQuest from '~/components/app/CardQuest';
import ItemRating from '~/components/app/info/item-rating';
import MessagesList from '~/components/app/pages/messages_id/messagesList';
import QuestPanel from '~/components/app/panels/questPanel';
import Info from '~/components/app/info';
import BtnPasswordVisibility from '~/components/app/BtnPasswordVisibility';

Vue.component('Header', Header);
Vue.component('Footer', Footer);
Vue.component('vue-phone-number-input', VuePhoneNumberInput);

Vue.component('g-map', GMap);
Vue.component('g-map-marker', GMapMarker);
Vue.component('g-map-cluster', GMapCluster);
Vue.component('g-map-info-window', GMapInfoWindow);
Vue.component('g-map-info-block', GMapInfoBlock);
Vue.component('g-map-loader', GMapLoader);
Vue.component('search-with-map', SearchWithMap);

Vue.component('panel-filters', PanelFilters);

Vue.component('base-dd', BaseDD);
Vue.component('base-btn', BaseButton);
Vue.component('base-field', BaseInput);
Vue.component('base-table', BaseTable);
Vue.component('base-pager', BasePager);
Vue.component('base-textarea', BaseTextarea);
Vue.component('base-checkbox', BaseCheckbox);
Vue.component('base-filter-dd', BaseFilterDD);

Vue.component('ctm-modal', CtmModal);
Vue.component('ctm-modal-box', CtmModalBox);

Vue.component('card-quest', CardQuest);
Vue.component('card-employee', CardEmployee);

Vue.component('files-preview', FilesPreview);
Vue.component('files-uploader', FilesUploader);

Vue.component('quest-dd', QuestDD);
Vue.component('quest-panel', QuestPanel);

Vue.component('info', Info);
Vue.component('loader', Loader);
Vue.component('workers-list', WorkersList);
Vue.component('star-rating', StarRating);
Vue.component('specializations-selector', SpecializationsSelector);
Vue.component('empty-data', EmptyData);
Vue.component('item-rating', ItemRating);
Vue.component('MessagesList', MessagesList);
Vue.component('notifications-button', NotificationsButton);
Vue.component('btn-password-visibility', BtnPasswordVisibility);
