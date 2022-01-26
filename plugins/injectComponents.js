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
import MapBlock from '~/components/app/MapBlock';
import BaseTable from '~/components/ui/BaseTable';
import BasePager from '~/components/ui/BasePager';
import QuestDD from '~/components/ui/QuestDD';
import BaseTextarea from '~/components/ui/BaseTextarea';
import WorkersList from '~/components/app/pages/quests_id/WorkersList';
import StarRating from '~/components/app/pages/quests_id/starRating';
import SpecializationsSelector from '~/components/ui/SpecializationsSelector';
import FilesUploader from '~/components/ui/FilesUploader';
import FilesPreview from '~/components/ui/FilesPreview';
import EmptyData from '~/components/app/info/emptyData';
import EmployeeCard from '~/components/app/pages/common/employeeCard';
import QuestCards from '~/components/app/pages/common/quests';
import QuestCard from '~/components/app/pages/common/questCard';
import FiltersPanel from '~/components/app/panels/filters';
import SearchWithMap from '~/components/app/SearchWithMap';

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
Vue.component('base-textarea', BaseTextarea);
Vue.component('vue-phone-number-input', VuePhoneNumberInput);
Vue.component('workers-list', WorkersList);
Vue.component('star-rating', StarRating);
Vue.component('specializations-selector', SpecializationsSelector);
Vue.component('files-uploader', FilesUploader);
Vue.component('files-preview', FilesPreview);
Vue.component('map-block', MapBlock);
Vue.component('empty-data', EmptyData);
Vue.component('employee-card', EmployeeCard);
Vue.component('filters-panel', FiltersPanel);
Vue.component('search-with-map', SearchWithMap);
Vue.component('quest-cards', QuestCards);
Vue.component('quest-card', QuestCard);
