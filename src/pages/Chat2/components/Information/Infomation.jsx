/* eslint-disable lines-between-class-members */
import Icon, {
  CloseOutlined,
  DownOutlined,
  FileFilled,
  MinusCircleOutlined,
  PlusOutlined,
  PlusSquareFilled,
  StarFilled,
  UserOutlined,
} from '@ant-design/icons';
import {
  AutoComplete,
  Avatar,
  Button,
  Col,
  Collapse,
  Image,
  Input,
  Layout,
  Modal,
  Radio,
  Row,
  Select,
  Typography,
  Form,
  Timeline,
  notification,
  Rate,
  Checkbox,
  Switch,
  Tag,
  Tooltip,
} from 'antd';
import React from 'react';
import { connect } from 'umi';
// import { bindActionCreators } from "redux";
// import * as ActionSaga from "../../actions/index";
import * as API from '../../constants/Api.js';
import {
  reqwestCMS,
  reqwestLog,
  reqwestUpdateCM,
  reqwestListPhone,
  reqwestCustomerInfo,
} from '../../helpers/reqwest';
import { formatStringToString } from '../../utils/formatTime';
import IconEdit from '../../assets/icon/edit.svg';
import { isArray } from 'lodash';
const { Sider } = Layout;
const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;

const VideoSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="12" fill="white" />
    <path
      d="M17.2306 11.1318C17.9024 11.5157 17.9024 12.4843 17.2306 12.8682L9.74614 17.1451C9.07948 17.526 8.25 17.0446 8.25 16.2768L8.25 7.72318C8.25 6.95536 9.07948 6.47399 9.74614 6.85494L17.2306 11.1318Z"
      fill="#365DFE"
    />
  </svg>
);
const UserSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#F0F0F0" />
    <path
      d="M11.9996 6.02637C10.2627 6.02637 8.84961 7.43946 8.84961 9.17637C8.84961 10.9133 10.2627 12.3264 11.9996 12.3264C13.7365 12.3264 15.1496 10.9133 15.1496 9.17637C15.1496 7.43946 13.7365 6.02637 11.9996 6.02637Z"
      fill="black"
      fillOpacity="0.85"
    />
    <path
      d="M15.9192 14.3843C15.0568 13.5086 13.9135 13.0264 12.7 13.0264H11.3C10.0865 13.0264 8.94319 13.5086 8.08079 14.3843C7.22262 15.2556 6.75 16.4058 6.75 17.623C6.75 17.8163 6.90671 17.973 7.1 17.973H16.9C17.0933 17.973 17.25 17.8163 17.25 17.623C17.25 16.4058 16.7774 15.2556 15.9192 14.3843Z"
      fill="black"
      fillOpacity="0.85"
    />
  </svg>
);
const PhoneSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#F0F0F0" />
    <path
      d="M10.9974 13.0014C9.88389 11.8879 9.63245 10.7743 9.57573 10.3282C9.55988 10.2048 9.60233 10.0811 9.69058 9.99345L10.5917 9.0927C10.7243 8.96023 10.7478 8.75376 10.6485 8.59486L9.21366 6.36693C9.10373 6.19098 8.87803 6.12748 8.69248 6.2203L6.38913 7.30509C6.23908 7.37898 6.15083 7.5384 6.16786 7.70478C6.28855 8.85133 6.78841 11.6698 9.55823 14.4398C12.328 17.2099 15.1461 17.7095 16.2933 17.8302C16.4597 17.8472 16.6191 17.759 16.693 17.6089L17.7778 15.3056C17.8702 15.1204 17.8072 14.8953 17.6319 14.7852L15.404 13.3508C15.2452 13.2514 15.0388 13.2747 14.9062 13.4071L14.0054 14.3083C13.9178 14.3966 13.7941 14.439 13.6707 14.4232C13.2246 14.3664 12.111 14.115 10.9974 13.0014Z"
      fill="#262626"
    />
  </svg>
);
const EmailSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#F0F0F0" />
    <path
      d="M17.6875 7.1875H6.3125C6.07051 7.1875 5.875 7.38301 5.875 7.625V16.375C5.875 16.617 6.07051 16.8125 6.3125 16.8125H17.6875C17.9295 16.8125 18.125 16.617 18.125 16.375V7.625C18.125 7.38301 17.9295 7.1875 17.6875 7.1875ZM16.5828 8.67637L12.2693 12.0328C12.1627 12.1162 12.0137 12.1162 11.907 12.0328L7.59219 8.67637C7.57592 8.66381 7.56399 8.64649 7.55807 8.62681C7.55215 8.60714 7.55253 8.58611 7.55916 8.56666C7.56579 8.54721 7.57835 8.53033 7.59506 8.51838C7.61177 8.50642 7.6318 8.5 7.65234 8.5H16.5227C16.5432 8.5 16.5632 8.50642 16.5799 8.51838C16.5967 8.53033 16.6092 8.54721 16.6158 8.56666C16.6225 8.58611 16.6229 8.60714 16.6169 8.62681C16.611 8.64649 16.5991 8.66381 16.5828 8.67637Z"
      fill="black"
      fillOpacity="0.85"
    />
  </svg>
);
const addressesSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#F0F0F0" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.64062 10.4688C6.64062 7.51357 9.04482 5.10938 12 5.10938C14.9552 5.10938 17.3594 7.51357 17.3594 10.4688C17.3594 11.9043 16.4897 13.7478 14.7744 15.9478C13.9885 16.9532 13.1375 17.9058 12.2268 18.7996C12.1657 18.858 12.0845 18.8906 12 18.8906C11.9155 18.8906 11.8343 18.858 11.7732 18.7996C10.8625 17.9058 10.0115 16.9532 9.22562 15.9478C7.51035 13.7478 6.64062 11.9043 6.64062 10.4688ZM14.3333 10.25C14.3333 11.5387 13.2887 12.5833 12 12.5833C10.7113 12.5833 9.66667 11.5387 9.66667 10.25C9.66667 8.96134 10.7113 7.91667 12 7.91667C13.2887 7.91667 14.3333 8.96134 14.3333 10.25Z"
      fill="black"
      fillOpacity="0.85"
    />
  </svg>
);
const FileSvg = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.34375 5.5V2.125H3.625V13.875H12.375V6.15625H9C8.82595 6.15625 8.65903 6.08711 8.53596 5.96404C8.41289 5.84097 8.34375 5.67405 8.34375 5.5Z"
      fill="#EBF5FD"
    />
    <path
      d="M13.3531 4.50938L9.99063 1.14688C9.89688 1.05313 9.77031 1 9.6375 1H3C2.72344 1 2.5 1.22344 2.5 1.5V14.5C2.5 14.7766 2.72344 15 3 15H13C13.2766 15 13.5 14.7766 13.5 14.5V4.86406C13.5 4.73125 13.4469 4.60313 13.3531 4.50938ZM9.40625 2.15313L12.3469 5.09375H9.40625V2.15313ZM12.375 13.875H3.625V2.125H8.34375V5.5C8.34375 5.67405 8.41289 5.84097 8.53596 5.96404C8.65903 6.08711 8.82595 6.15625 9 6.15625H12.375V13.875Z"
      fill="#127ACE"
    />
  </svg>
);
const FileDocSvg = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.34375 5.5V2.125H3.625V13.875H12.375V6.15625H9C8.82595 6.15625 8.65903 6.08711 8.53596 5.96404C8.41289 5.84097 8.34375 5.67405 8.34375 5.5ZM9.92656 7.52031C9.94687 7.43594 10.0219 7.375 10.1094 7.375H10.6656C10.6943 7.37511 10.7227 7.38179 10.7484 7.39453C10.7741 7.40727 10.7966 7.42574 10.8141 7.44852C10.8316 7.47129 10.8437 7.49777 10.8493 7.52593C10.855 7.55408 10.8542 7.58316 10.8469 7.61094L9.68437 11.9234C9.6625 12.0062 9.5875 12.0625 9.50313 12.0625H9.00625C8.92188 12.0625 8.84687 12.0047 8.825 11.9234L8 8.84531L7.175 11.9234C7.15313 12.0062 7.07812 12.0625 6.99375 12.0625H6.49375C6.40938 12.0625 6.33437 12.0047 6.3125 11.9234L5.15312 7.61094C5.14576 7.58316 5.14487 7.55405 5.15052 7.52588C5.15618 7.4977 5.16822 7.47119 5.18573 7.4484C5.20324 7.4256 5.22574 7.40713 5.25152 7.39441C5.27729 7.38168 5.30563 7.37504 5.33437 7.375H5.8875C5.975 7.375 6.05 7.43594 6.07031 7.52031L6.79063 10.625L7.56719 7.51719C7.5875 7.43281 7.6625 7.375 7.74844 7.375H8.25156C8.3375 7.375 8.4125 7.43281 8.43281 7.51719L9.21094 10.6313L9.92656 7.52031Z"
      fill="#EBF5FD"
    />
    <path
      d="M13.3531 4.50938L9.99063 1.14688C9.89688 1.05313 9.77031 1 9.6375 1H3C2.72344 1 2.5 1.22344 2.5 1.5V14.5C2.5 14.7766 2.72344 15 3 15H13C13.2766 15 13.5 14.7766 13.5 14.5V4.86406C13.5 4.73125 13.4469 4.60313 13.3531 4.50938ZM9.40625 2.15313L12.3469 5.09375H9.40625V2.15313ZM12.375 13.875H3.625V2.125H8.34375V5.5C8.34375 5.67405 8.41289 5.84097 8.53596 5.96404C8.65903 6.08711 8.82595 6.15625 9 6.15625H12.375V13.875Z"
      fill="#127ACE"
    />
    <path
      d="M8.25167 7.375H7.74855C7.66261 7.375 7.58761 7.43281 7.5673 7.51719L6.79073 10.625L6.07042 7.52031C6.05011 7.43594 5.97511 7.375 5.88761 7.375H5.33448C5.30574 7.37504 5.27739 7.38168 5.25162 7.39441C5.22585 7.40713 5.20334 7.4256 5.18583 7.4484C5.16832 7.47119 5.15628 7.4977 5.15063 7.52588C5.14497 7.55405 5.14586 7.58316 5.15323 7.61094L6.31261 11.9234C6.33448 12.0047 6.40948 12.0625 6.49386 12.0625H6.99386C7.07823 12.0625 7.15323 12.0062 7.17511 11.9234L8.00011 8.84531L8.82511 11.9234C8.84699 12.0047 8.92199 12.0625 9.00636 12.0625H9.50324C9.58762 12.0625 9.66262 12.0062 9.68449 11.9234L10.847 7.61094C10.8543 7.58316 10.8551 7.55408 10.8495 7.52593C10.8438 7.49777 10.8317 7.47129 10.8142 7.44852C10.7967 7.42574 10.7743 7.40727 10.7485 7.39453C10.7228 7.38179 10.6945 7.37511 10.6657 7.375H10.1095C10.022 7.375 9.94699 7.43594 9.92668 7.52031L9.21105 10.6313L8.43292 7.51719C8.41261 7.43281 8.33761 7.375 8.25167 7.375Z"
      fill="#127ACE"
    />
  </svg>
);
const FileXlsmSvg = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.34375 5.5V2.125H3.625V13.875H12.375V6.15625H9C8.82595 6.15625 8.65903 6.08711 8.53596 5.96404C8.41289 5.84097 8.34375 5.67405 8.34375 5.5ZM9.15 7.375H9.70781C9.74144 7.37517 9.7744 7.38435 9.80328 7.40158C9.83215 7.41881 9.85588 7.44346 9.87199 7.47298C9.88811 7.50249 9.89601 7.53578 9.89489 7.56939C9.89377 7.60299 9.88367 7.63569 9.86563 7.66406L8.53281 9.73438L9.84531 11.7719C9.90156 11.8594 9.87656 11.975 9.78906 12.0312C9.75781 12.05 9.72344 12.0609 9.6875 12.0609H9.10156C9.0375 12.0609 8.97656 12.0281 8.94219 11.9719L7.96875 10.3875L6.98906 11.9734C6.95469 12.0281 6.89531 12.0625 6.82969 12.0625H6.29063C6.25711 12.0624 6.22422 12.0534 6.19535 12.0364C6.16649 12.0193 6.1427 11.9949 6.12645 11.9656C6.1102 11.9363 6.10208 11.9031 6.10292 11.8696C6.10376 11.8361 6.11354 11.8035 6.13125 11.775L7.43437 9.7L6.14844 7.6625C6.09219 7.57344 6.11875 7.45781 6.20625 7.40312C6.23594 7.38281 6.27031 7.37344 6.30625 7.37344H6.90625C6.97187 7.37344 7.03281 7.40781 7.06719 7.46406L8.03281 9.06406L8.98906 7.46562C9.02344 7.40937 9.08437 7.375 9.15 7.375Z"
      fill="#EBF5FD"
    />
    <path
      d="M13.3531 4.50938L9.99063 1.14688C9.89688 1.05313 9.77031 1 9.6375 1H3C2.72344 1 2.5 1.22344 2.5 1.5V14.5C2.5 14.7766 2.72344 15 3 15H13C13.2766 15 13.5 14.7766 13.5 14.5V4.86406C13.5 4.73125 13.4469 4.60313 13.3531 4.50938ZM9.40625 2.15313L12.3469 5.09375H9.40625V2.15313ZM12.375 13.875H3.625V2.125H8.34375V5.5C8.34375 5.67405 8.41289 5.84097 8.53596 5.96404C8.65903 6.08711 8.82595 6.15625 9 6.15625H12.375V13.875Z"
      fill="#127ACE"
    />
    <path
      d="M8.03285 9.06411L7.06723 7.4641C7.03285 7.40785 6.97191 7.37348 6.90629 7.37348H6.30629C6.27035 7.37348 6.23598 7.38285 6.20629 7.40316C6.11879 7.45785 6.09223 7.57348 6.14848 7.66254L7.43441 9.70005L6.13129 11.7751C6.11358 11.8035 6.1038 11.8362 6.10296 11.8697C6.10212 11.9032 6.11024 11.9363 6.12649 11.9656C6.14274 11.995 6.16653 12.0194 6.19539 12.0364C6.22426 12.0535 6.25715 12.0625 6.29066 12.0626H6.82973C6.89535 12.0626 6.95473 12.0282 6.9891 11.9735L7.96879 10.3875L8.94223 11.9719C8.9766 12.0282 9.03754 12.061 9.1016 12.061H9.68754C9.72348 12.061 9.75785 12.0501 9.7891 12.0313C9.8766 11.9751 9.9016 11.8594 9.84535 11.7719L8.53285 9.73442L9.86566 7.6641C9.88371 7.63573 9.89381 7.60303 9.89493 7.56943C9.89605 7.53582 9.88814 7.50253 9.87203 7.47302C9.85592 7.4435 9.83219 7.41885 9.80332 7.40162C9.77444 7.38438 9.74148 7.37521 9.70785 7.37504H9.15004C9.08441 7.37504 9.02348 7.40941 8.9891 7.46566L8.03285 9.06411Z"
      fill="#127ACE"
    />
  </svg>
);
const FilePDFSvg = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.95625 7.66883C7.94531 7.64852 7.93438 7.63914 7.92188 7.63758C7.87656 7.68914 7.8875 8.12977 7.96406 8.4407C8.02656 8.2282 8.0375 7.80789 7.95625 7.66883ZM7.93125 9.55164C7.81094 9.86414 7.6375 10.2907 7.42969 10.6673C7.49219 10.6423 7.55625 10.6157 7.62188 10.5891C7.89687 10.4766 8.20469 10.3501 8.54219 10.2735C8.30938 10.0891 8.09844 9.8407 7.93125 9.55164Z"
      fill="#EBF5FD"
    />
    <path
      d="M8.34375 5.5V2.125H3.625V13.875H12.375V6.15625H9C8.82595 6.15625 8.65903 6.08711 8.53596 5.96404C8.41289 5.84097 8.34375 5.67405 8.34375 5.5ZM9.20312 9.99375C9.45469 9.96406 9.68125 9.95 9.89531 9.95781C10.0953 9.96406 10.2641 9.98906 10.3953 10.0375C10.3984 10.0391 10.4 10.0391 10.4031 10.0406C10.4094 10.0437 10.4156 10.0453 10.4219 10.0484C10.4297 10.0516 10.4391 10.0547 10.4469 10.0594C10.4484 10.0609 10.4516 10.0609 10.4531 10.0625C10.5172 10.0906 10.5703 10.125 10.6109 10.1656C10.7531 10.3078 10.7953 10.5734 10.7078 10.7844C10.6578 10.9047 10.525 11.1047 10.1875 11.1047C9.84688 11.1047 9.34531 10.9531 8.90469 10.7172C8.50625 10.7844 8.06563 10.9344 7.64062 11.0781C7.55 11.1094 7.45625 11.1406 7.36562 11.1703C6.77187 12.1891 6.32656 12.4109 6.05156 12.4109C5.98594 12.4109 5.92969 12.3969 5.88281 12.3797C5.775 12.3391 5.68281 12.2547 5.625 12.1453C5.61094 12.1187 5.6 12.0922 5.59062 12.0641C5.56562 11.9891 5.55781 11.9141 5.57031 11.8516L5.57969 11.8094C5.58125 11.8062 5.58125 11.8031 5.58281 11.8C5.58594 11.7891 5.58906 11.7781 5.59375 11.7672C5.59375 11.7656 5.59531 11.7641 5.59531 11.7625C5.65938 11.5766 5.80781 11.3969 6.02813 11.2219C6.22031 11.0688 6.45156 10.9297 6.74531 10.7781C6.99375 10.3406 7.33281 9.60469 7.54531 9.1C7.37656 8.44688 7.28437 7.93437 7.3875 7.55937C7.40156 7.50781 7.42656 7.45938 7.45937 7.41719C7.4625 7.41406 7.46406 7.41094 7.46719 7.40781C7.46875 7.40625 7.46875 7.40469 7.47031 7.40469C7.56875 7.2875 7.73438 7.21875 7.90938 7.225C8.16875 7.23594 8.37344 7.40469 8.425 7.69531C8.45156 7.82031 8.45937 7.95312 8.45469 8.09688V8.10781C8.45469 8.11563 8.45469 8.12344 8.45312 8.13125C8.44219 8.33906 8.40625 8.54687 8.33906 8.82969C8.33281 8.85469 8.32656 8.87969 8.32031 8.91094L8.30469 8.975L8.30313 8.97969C8.30469 8.98281 8.30469 8.98438 8.30625 8.9875L8.33438 9.05781C8.33594 9.0625 8.33906 9.06875 8.34062 9.07344C8.35156 9.09844 8.3625 9.125 8.37344 9.14844V9.15C8.50938 9.44375 8.68125 9.67188 8.90312 9.85469C8.97031 9.90938 9.04219 9.95938 9.12031 10.0078C9.14844 10 9.175 9.99687 9.20312 9.99375Z"
      fill="#EBF5FD"
    />
    <path
      d="M6.11719 11.8906C6.20625 11.8219 6.37031 11.6641 6.5875 11.3485C6.42656 11.4953 6.22187 11.6985 6.11719 11.8906ZM10.35 10.5938L10.3531 10.5891H10.3562C10.3656 10.5828 10.364 10.5781 10.3625 10.575C10.3609 10.5735 10.2922 10.4297 9.6578 10.4594C10.2094 10.6766 10.3375 10.6016 10.35 10.5938Z"
      fill="#EBF5FD"
    />
    <path
      d="M13.3531 4.50938L9.99063 1.14688C9.89688 1.05313 9.77031 1 9.6375 1H3C2.72344 1 2.5 1.22344 2.5 1.5V14.5C2.5 14.7766 2.72344 15 3 15H13C13.2766 15 13.5 14.7766 13.5 14.5V4.86406C13.5 4.73125 13.4469 4.60313 13.3531 4.50938ZM9.40625 2.15313L12.3469 5.09375H9.40625V2.15313ZM12.375 13.875H3.625V2.125H8.34375V5.5C8.34375 5.67405 8.41289 5.84097 8.53596 5.96404C8.65903 6.08711 8.82595 6.15625 9 6.15625H12.375V13.875Z"
      fill="#127ACE"
    />
    <path
      d="M8.37352 9.14541C8.36102 9.11885 8.35009 9.09385 8.33915 9.06885C8.33759 9.06416 8.33446 9.05791 8.3329 9.05322L8.30477 8.98291C8.30321 8.97978 8.30321 8.97822 8.30165 8.9751L8.30321 8.97041L8.30633 8.95322C8.36883 8.69853 8.44071 8.40166 8.45321 8.10322V8.09228C8.4579 7.95791 8.45009 7.82353 8.42196 7.69228C8.36259 7.35947 8.11727 7.22978 7.9079 7.2204C7.73134 7.21259 7.56727 7.2829 7.46884 7.39853C7.46727 7.40009 7.46727 7.40165 7.46571 7.40165C7.46259 7.40478 7.45946 7.4079 7.4579 7.41103C7.42509 7.45322 7.40009 7.50165 7.38602 7.55322C7.2829 7.92822 7.37509 8.44072 7.54384 9.09385C7.33134 9.6001 6.99228 10.3345 6.74384 10.772V10.7735C6.31103 10.997 5.74228 11.3329 5.59384 11.7564C5.59384 11.7579 5.59228 11.7595 5.59228 11.761C5.58915 11.772 5.58447 11.7829 5.58134 11.7939C5.57978 11.797 5.57978 11.8001 5.57822 11.8032C5.57509 11.8173 5.5704 11.8314 5.56884 11.8454C5.55478 11.9079 5.56259 11.9829 5.58915 12.0579C5.59853 12.086 5.60947 12.1126 5.62353 12.1392C5.68134 12.2485 5.77353 12.3329 5.88134 12.3735C5.92822 12.3907 5.98447 12.4048 6.05009 12.4048C6.32509 12.4048 6.7704 12.1829 7.36415 11.1642C7.45477 11.1345 7.54852 11.1032 7.63915 11.072C8.06415 10.9282 8.50477 10.7782 8.90321 10.711C9.34383 10.947 9.84539 11.0985 10.186 11.0985C10.5235 11.0985 10.6563 10.8985 10.7063 10.7782C10.7938 10.5673 10.7516 10.3017 10.6095 10.1595C10.5688 10.1188 10.5157 10.0845 10.4516 10.0563C10.4501 10.0548 10.447 10.0548 10.4454 10.0532C10.4376 10.0501 10.4282 10.047 10.4204 10.0423C10.4141 10.0392 10.4079 10.0376 10.4016 10.0345C10.3985 10.0329 10.397 10.0329 10.3938 10.0313C10.1407 9.94072 9.74227 9.92666 9.20165 9.9876L9.11883 9.99697C9.04071 9.9501 8.96883 9.89854 8.90165 9.84385C8.67977 9.66728 8.50946 9.44072 8.37352 9.14541ZM6.11728 11.8907C6.22197 11.6985 6.42665 11.4954 6.58759 11.3485C6.3704 11.6642 6.20634 11.822 6.11728 11.8907ZM7.92196 7.63759C7.93446 7.63915 7.9454 7.64853 7.95634 7.66884C8.03759 7.80791 8.02665 8.22822 7.96415 8.44072C7.88759 8.12978 7.87665 7.68916 7.92196 7.63759ZM7.62196 10.5892C7.55634 10.6157 7.49227 10.6423 7.42977 10.6673C7.63759 10.2907 7.81102 9.86416 7.93134 9.55166C8.09852 9.84072 8.30946 10.0892 8.54227 10.2735C8.20477 10.3501 7.89696 10.4767 7.62196 10.5892ZM10.3626 10.5751C10.3641 10.5782 10.3657 10.5829 10.3563 10.5892H10.3532L10.3501 10.5939C10.3376 10.6017 10.2095 10.6767 9.65789 10.4595C10.2923 10.4298 10.361 10.5735 10.3626 10.5751Z"
      fill="#127ACE"
    />
  </svg>
);
const FileZipSvg = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.375 9.84375H5.875V9.875H5.375V9.84375Z" fill="#EBF5FD" />
    <path
      d="M8.34375 5.5V2.125H5.625V3.125H6.625V4.125H5.625V5.125H6.625V6.125H5.625V7.125H6.625V8.125H5.625V9.09375H6.625V11.5938H4.625V8.125H5.625V7.125H4.625V6.125H5.625V5.125H4.625V4.125H5.625V3.125H4.625V2.125H3.625V13.875H12.375V6.15625H9C8.82595 6.15625 8.65903 6.08711 8.53596 5.96404C8.41289 5.84097 8.34375 5.67405 8.34375 5.5Z"
      fill="#EBF5FD"
    />
    <path
      d="M13.3531 4.50938L9.99063 1.14688C9.89688 1.05313 9.77031 1 9.6375 1H3C2.72344 1 2.5 1.22344 2.5 1.5V14.5C2.5 14.7766 2.72344 15 3 15H13C13.2766 15 13.5 14.7766 13.5 14.5V4.86406C13.5 4.73125 13.4469 4.60313 13.3531 4.50938ZM9.40625 2.15313L12.3469 5.09375H9.40625V2.15313ZM12.375 13.875H3.625V2.125H4.625V3.125H5.625V2.125H8.34375V5.5C8.34375 5.67405 8.41289 5.84097 8.53596 5.96404C8.65903 6.08711 8.82595 6.15625 9 6.15625H12.375V13.875Z"
      fill="#127ACE"
    />
    <path
      d="M4.625 6.125H5.625V7.125H4.625V6.125ZM4.625 4.125H5.625V5.125H4.625V4.125ZM4.625 11.5938H6.625V9.09375H5.625V8.125H4.625V11.5938ZM5.375 9.84375H5.875V10.8438H5.375V9.84375ZM5.625 3.125H6.625V4.125H5.625V3.125ZM5.625 7.125H6.625V8.125H5.625V7.125ZM5.625 5.125H6.625V6.125H5.625V5.125Z"
      fill="#127ACE"
    />
  </svg>
);
const WrapperSvg = () => (
  <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.82665 6.2899L10.1954 2.8707C10.2476 2.83052 10.2771 2.76757 10.2771 2.70195V1.66668C10.2771 1.57695 10.174 1.5274 10.1043 1.58231L5.56281 5.13677L1.02129 1.58231C1.0055 1.56994 0.986545 1.56227 0.966599 1.56017C0.946652 1.55806 0.926517 1.56162 0.908495 1.57042C0.890472 1.57922 0.87529 1.59291 0.864684 1.60994C0.854078 1.62696 0.848477 1.64662 0.84852 1.66668V2.70195C0.84852 2.76757 0.879323 2.83052 0.930216 2.8707L5.29763 6.2899C5.45432 6.41177 5.67129 6.41177 5.82665 6.2899ZM5.82665 10.3613L10.1954 6.94213C10.2476 6.90195 10.2771 6.839 10.2771 6.77338V5.73811C10.2771 5.64838 10.174 5.59882 10.1043 5.65373L5.56281 9.2082L1.02129 5.65373C1.0055 5.64137 0.986545 5.6337 0.966599 5.63159C0.946652 5.62949 0.926517 5.63304 0.908495 5.64184C0.890472 5.65065 0.87529 5.66434 0.864684 5.68137C0.854078 5.69839 0.848477 5.71805 0.84852 5.73811V6.77338C0.84852 6.839 0.879323 6.90195 0.930216 6.94213L5.29763 10.3613C5.45432 10.4832 5.67129 10.4832 5.82665 10.3613Z"
      fill="#127ACE"
    />
  </svg>
);
const DeleteSvg = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.3335 3.33268H14.6668V4.66602H1.3335V3.33268Z"
      fill="#FF4D4F"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.66683 1.99935C6.49002 1.99935 6.32045 2.06959 6.19543 2.19461C6.0704 2.31964 6.00016 2.4892 6.00016 2.66602V3.33268H10.0002V2.66602C10.0002 2.4892 9.92992 2.31964 9.8049 2.19461C9.67988 2.06959 9.51031 1.99935 9.3335 1.99935H6.66683ZM11.3335 3.33268V2.66602C11.3335 2.13558 11.1228 1.62687 10.7477 1.2518C10.3726 0.876729 9.86393 0.666016 9.3335 0.666016H6.66683C6.1364 0.666016 5.62769 0.876729 5.25262 1.2518C4.87754 1.62687 4.66683 2.13558 4.66683 2.66602V3.33268H2.66683V13.3327C2.66683 13.8631 2.87754 14.3718 3.25262 14.7469C3.62769 15.122 4.1364 15.3327 4.66683 15.3327H11.3335C11.8639 15.3327 12.3726 15.122 12.7477 14.7469C13.1228 14.3718 13.3335 13.8631 13.3335 13.3327V3.33268H11.3335ZM4.00016 4.66602V13.3327C4.00016 13.5095 4.0704 13.6791 4.19543 13.8041C4.32045 13.9291 4.49002 13.9993 4.66683 13.9993H11.3335C11.5103 13.9993 11.6799 13.9291 11.8049 13.8041C11.9299 13.6791 12.0002 13.5095 12.0002 13.3327V4.66602H4.00016Z"
      fill="#FF4D4F"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.3335 6.66602V11.9993H6.00016V6.66602H7.3335Z"
      fill="#FF4D4F"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.0002 6.66602V11.9993H8.66683V6.66602H10.0002Z"
      fill="#FF4D4F"
    />
  </svg>
);

class information extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomInfo: null,
      visible: false,
      visibleListUser: false,
      visibleEndChat: false,
      openHistory: false,
      // groupFile: [],
      // groupImageVideo: [],
      index: 0,
      websocket: null,
      indexReview: 0,
      visitorsInfo: null,
      images: [],
      users: [],
      listCustomerInfo: [],
      disibleBtnForward: true,
      valueInput: null,
      name: null,
      visibleEnd: false,
      content: '',
      reasonClose: 'Đã nhập Checklist',
      visibleSupportAgent: true,
      loadingInit: false,
      visibleEdit: false,
      formFields: null,
      logCall: [],
      lengthLogCall: 0,
      offsetLogCall: 0,
      isPhoneDefaul: -1,
    };
  }

  componentWillMount() {
    // this.props.searchCrmCustomerInfo({ params: {} });
    this.props.dispatch({
      type: 'rocketChat/searchCmCustomerInfo',
      payload: {
        params: {},
      },
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.roomInfo !== undefined) {
      if (nextProps?.roomInfo?._id !== this.state?.roomInfo?._id) {
        this.setState({ visibleEdit: false });
      }
    }
    if (nextProps.listUser && nextProps.listUser !== this.state.users) {
      this.setState({ users: nextProps.listUser });
    }
    if (nextProps.customerInfo) {
      this.checkPhoneDefault(nextProps.customerInfo?.phones);
      this.setState({ visibleEdit: false, openHistory: false });
      if (nextProps.customerInfo.name === this.props.roomInfo.customFields.dataInfoDto.name) {
        this.setState({
          formFields: [
            {
              name: ['name'],
              value: nextProps.customerInfo.name,
            },
            {
              name: ['phones'],
              value: nextProps.customerInfo.phones,
            },
            {
              name: ['email'],
              value: nextProps.customerInfo.email,
            },
            {
              name: ['addresses'],
              value: nextProps.customerInfo.addresses,
            },
          ],
        });
      } else {
        this.setState({
          formFields: [
            {
              name: ['name'],
              value: this.props.roomInfo.customFields.dataInfoDto.name,
            },
            {
              name: ['phones'],
              value: this.props.roomInfo.customFields.dataInfoDto.phone,
            },
            {
              name: ['email'],
              value: this.props.roomInfo.customFields.dataInfoDto.email,
            },
            {
              name: ['addresses'],
              value: this.props.roomInfo.customFields.dataInfoDto.address,
            },
          ],
        });
      }
      // } else {
      //   if (
      //     nextProps.visitorsInfoLivechat &&
      //     nextProps.roomInfo &&
      //     nextProps.visitorsInfo &&
      //     nextProps.roomInfo.t === 'l'
      //   ) {
      //     let { visitorsInfoLivechat, visitorsInfo, roomInfo } = nextProps;
      //     this.setState({
      //       formFields: [
      //         {
      //           name: ['id'],
      //           value: '',
      //         },
      //         {
      //           name: ['rid'],
      //           value: roomInfo._id,
      //         },
      //         {
      //           name: ['visitor_id'],
      //           value: visitorsInfo.id,
      //         },
      //         {
      //           name: ['name'],
      //           value: visitorsInfoLivechat.name,
      //         },
      //         {
      //           name: ['phones'],
      //           value: [
      //             {
      //               phone: visitorsInfoLivechat?.livechatData?.phone,
      //               default: false,
      //             },
      //           ],
      //         },
      //         {
      //           name: ['email'],
      //           value:
      //             visitorsInfoLivechat?.visitorEmails?.length > 0
      //               ? visitorsInfoLivechat?.visitorEmails[0].addresses
      //               : '',
      //         },
      //         {
      //           name: ['addresses'],
      //           value: '',
      //         },
      //         {
      //           name: ['note'],
      //           value: '',
      //         },
      //       ],
      //     });
      //   } else {
      //     this.setState({
      //       formFields: [
      //         {
      //           name: ['id'],
      //           value: '',
      //         },
      //         {
      //           name: ['rid'],
      //           value: '',
      //         },
      //         {
      //           name: ['visitor_id'],
      //           value: '',
      //         },
      //         {
      //           name: ['name'],
      //           value: '',
      //         },
      //         {
      //           name: ['phones'],
      //           value: [],
      //         },
      //         {
      //           name: ['email'],
      //           value: '',
      //         },
      //         {
      //           name: ['addresses'],
      //           value: '',
      //         },
      //         {
      //           name: ['note'],
      //           value: '',
      //         },
      //       ],
      //     });
      //   }
    }
    // if (nextProps.listCustomerInfo !== this.state?.listCustomerInfo) {
    //   let listCustomerInfo = JSON.parse(nextProps.listCustomerInfo);
    //   let options =
    //     listCustomerInfo && Array.isArray(listCustomerInfo)
    //       ? listCustomerInfo.map((u) => {
    //           let phoneDefault = this.getPhoneDefault(u.phones);
    //           return {
    //             ...u,
    //             value: phoneDefault,
    //             label: u.name + '-' + phoneDefault,
    //           };
    //         })
    //       : [];
    //   this.setState({
    //     listCustomerInfo: options,
    //   });
    // }
  }
  getPhoneDefault = (phones) => {
    let result = phones ? phones.find((value) => value?.default === true) : '';
    return result?.phone;
  };
  checkPhoneDefault = (phones) => {
    let result = phones ? phones.findIndex((value) => value?.isFirstNumber === true) : -1;
    this.setState({ isPhoneDefaul: result });
  };
  onChangeChat = (e) => {
    this.setState({ content: e.target.value });
  };
  onChange = (e) => {
    this.setState({ content: e.target.value });
  };
  handleCancel = () => {
    this.setState({
      visible: false,
      visibleEndChat: false,
      visibleSupportAgent: true,
    });
  };
  showModalListUser = async () => {
    this.setState({
      visibleListUser: true,
    });
    // this.props.getListUser();
    this.props.dispatch({
      type: 'rocketChat/getListUser',
      payload: {
        params: {
          page: 0,
          size: 10,
        },
      },
      headers: {
        Authorization: this.props.authorization,
      },
    });
  };
  showModalEndChat = async () => {
    this.setState({
      visibleEndChat: true,
    });
  };
  handleCancelForward = (e) => {
    this.setState({
      visibleListUser: false,
      disibleBtnForward: true,
    });
  };
  showModalEnd = () => {
    this.setState({
      visibleEnd: true,
    });
  };
  sendChat = () => {
    if (this.state.content === '') {
      this.sendMessageChat(
        'Cảm ơn Anh/Chị đã tương tác với FPT Telecom, khi cần phục vụ anh/ chị vui lòng để lại lời nhắn hoặc gửi yêu cầu hỗ trợ qua ứng dụng Hi FPT. Chúc anh/chị một ngày tốt lành!',
      );
    } else {
      this.sendMessageChat(this.state.content);
      this.setState({ content: '' });
    }
    this.setState({
      visibleEndChat: false,
    });
    if (this.props.dataISC) {
      this.handleOut(this.props.dataISC.roomID);
    } else {
      this.handleOut(this.state.roomInfo);
    }
  };
  sendMessageChat = async (value) => {
    if (value) {
      // await this.props.sendMessage({
      //   socket: this.props.websocket,
      //   roomId: this.props.roomInfo._id,
      //   msg: value,
      // });
      await this.props.dispatch({
        type: 'websocket/sendMessage',
        payload: {
          socket: this.props.websocket,
          roomId: this.props.roomInfo._id,
          msg: value,
        },
      });
    }
  };
  handleOut = async () => {
    // this.closeLiveChat(this.props.roomInfo._id);
    this.props.websocket.send(
      JSON.stringify({
        msg: 'method',
        method: 'livechat:closeRoom',
        id: IdSocket.OUT_GROUP,
        params: [this.props.roomInfo._id, 'Agent close room', { clientAction: true, tags: [] }],
      }),
    );
    this.setState({
      visibleSupportAgent: true,
      visibleEndChat: false,
    });
    document.addEventListener('load', WidgetHubSCC('reload'));
  };
  closeLiveChat = (roomId) => {
    this.props.websocket.send(
      JSON.stringify({
        msg: 'method',
        method: 'livechat:closeRoom',
        id: IdSocket.OUT_GROUP,
        params: [roomId, 'Agent close room', { clientAction: true, tags: [] }],
      }),
    );
    this.setState({
      visibleSupportAgent: true,
      visibleEndChat: false,
    });
  };
  closeGroup = async (params) => {
    this.setState({
      visibleEndChat: false,
    });
    // await this.props.closeGroup(params);
    await this.props.dispatch({
      type: 'rocketChat/closeGroup',
      payload: {
        params,
      },
    });
  };
  formatAMPM = (date) => {
    var _date = new Date(date);
    var hours = _date.getHours();
    var minutes = _date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes;
    return (
      `${_date.getDate() / 10 >= 1 ? _date.getDate() : '0' + _date.getDate()}/${
        (_date.getMonth() + 1) / 10 >= 1 ? _date.getMonth() + 1 : '0' + (_date.getMonth() + 1)
      }/${_date.getFullYear()}` +
      ' ' +
      strTime
    );
  };
  formatDateString = (date) => {
    var _date = new Date(date);
    var hours = _date.getHours();
    var minutes = _date.getMinutes();
    var seconds = _date.getSeconds();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    var strTime = hours + ':' + minutes + ':' + seconds;
    return (
      `${_date.getDate() / 10 >= 1 ? _date.getDate() : '0' + _date.getDate()}/${
        (_date.getMonth() + 1) / 10 >= 1 ? _date.getMonth() + 1 : '0' + (_date.getMonth() + 1)
      }/${_date.getFullYear()}` +
      ' - ' +
      strTime
    );
  };
  onChangeReasonClose = (value) => {
    this.setState({ reasonClose: value });
  };
  handelEdit = () => {
    if (this.state.visibleEdit) {
      this.setState({
        visibleEdit: false,
      });
    } else {
      this.setState({
        visibleEdit: true,
      });
    }
  };
  handSaveInformation = (formValue) => {
    let { roomInfo, userInfo, visitorsInfo, authorization, customerInfo } = this.props;
    let { isPhoneDefaul } = this.state;
    let idCustomerInfo = formValue.id;
    if (isPhoneDefaul === -1) {
      notification.error({
        message: 'Phải có ít nhất 1 số điện thoại mặc định',
      });
      return true;
    }
    // formValue.agent_id = userInfo?._id;
    // formValue.agent_name = userInfo?.username;
    // formValue.rid = roomInfo?._id;
    // formValue.visitor_id = visitorsInfo?.id;
    formValue.id = customerInfo?.id || '';
    formValue.agentId = roomInfo?.agent?.id || '';
    formValue.agentName = roomInfo?.agent?.username || '';
    formValue.source = roomInfo?.type || '';
    formValue.note = formValue?.note || '';
    formValue.name = formValue?.name || '';
    formValue.addresses = formValue?.addresses || '';
    formValue.email = formValue?.email || '';
    formValue.phones = formValue?.phones
      ? formValue?.phones.map((value, index) => {
          return {
            ...value,
            isFirstNumber: index === isPhoneDefaul ? true : false,
          };
        })
      : [];
    reqwestUpdateCM({
      apiPath: '/api/crm-service/customer/update',
      authorization,
      roomId: roomInfo.id,
      data: JSON.stringify(formValue),
      callback: (res) => {
        if (res.code === 200) {
          notification.success({
            message: 'Cập nhật thông tin thành công.',
          });
          this.setState({
            visibleEdit: false,
          });
          this.setState({
            formFields: [
              // {
              //   name: ['name'],
              //   value: res.response.data.name
              // },
              // {
              //   name: ['phones'],
              //   value: res.response.data.phones
              // },
              // {
              //   name: ['email'],
              //   value: res.response.data.email
              // },
              // {
              //   name: ['addresses'],
              //   value: res.response.data.addresses
              // },
              {
                name: ['note'],
                value: '',
              },
            ],
          });
          this.props.dispatch({
            type: 'rocketChat/getCMCustomerInfoCompleted',
            payload: {
              data: res.response.data,
            },
          });
          reqwestLog({
            basePath: process.env.UMI_API_BASE_URL,
            apiPath: '/api/crm-service/customer/all-reaction-history',
            customerId: res.response.data.id,
            authorization: authorization,
            callback: (res) => {
              if (res.code === 200) {
                this.setState({
                  logCall: res.response.data,
                  lengthLogCall: res.response.data.length,
                  offsetLogCall: 1,
                });
              }
            },
            callbackErr: (err) => {
              console.log(err);
            },
          });
        }
      },
      callbackErr: (err) => {
        notification.error({
          message: 'Cập nhật thông tin lỗi',
        });
      },
    });
    // if (formValue.id && roomInfo) {
    //   delete formValue.id;
    //   reqwestCMS({
    //     apiPath: API.CM_CUSTOMER_INFOS + '/' + idCustomerInfo,
    //     filter: JSON.stringify(formValue),
    //     authToken: this.props.authToken,
    //     userId: this.props.userId,
    //     authorization: authorization,
    //     method: 'patch',
    //     callback: (res) => {
    //       if (res.success == false) {
    //         notification.error({
    //           message: res.msg,
    //         });
    //       } else {
    //         notification.success({
    //           message: 'Cập nhật thông tin thành công.',
    //         });
    //         let phones = [];

    //         if (customerInfo?.phones && customerInfo.phones.length > 0) {
    //           for (let index = 0; index < customerInfo.phones.length; index++) {
    //             const element = customerInfo.phones[index];
    //             phones.push(element.phone);
    //           }
    //         }

    //         if (phones.length > 0) {
    //           let param = `?sort={"createAt":-1}&page=1&limit=5&phone=${phones.join(',')}&cusid=${
    //             customerInfo._id
    //           }`;
    //           reqwestLog({
    //             basePath: process.env.URL_API_CM,
    //             apiPath: API.CUSTOMER_HISTORY_ALL + param,
    //             userId: this.props.userId,
    //             authToken: this.props.authToken,
    //             authorization: authorization,
    //             callback: (res) => {
    //               if (res.success) {
    //                 this.setState({
    //                   logCall: res.data,
    //                   lengthLogCall: res.total,
    //                   offsetLogCall: 1,
    //                 });
    //               }
    //             },
    //             callbackErr: (err) => {},
    //           });
    //         } else {
    //           this.setState({ logCall: [], lengthLogCall: 0, offsetLogCall: 1 });
    //         }
    //         if (roomInfo.t === 'p') {
    //           // this.props.getCmVisitorsInfo({
    //           //   params: { user_id: roomInfo.customFields.id },
    //           // });
    //           this.props.dispatch({
    //             type: 'rocketChat/getCmVisitorInfo',
    //             payload: {
    //               params: { user_id: roomInfo.customFields.id },
    //             },
    //           });
    //         } else {
    //           // this.props.getCmVisitorsInfo({
    //           //   params: { user_id: roomInfo.v._id },
    //           // });
    //           this.props.dispatch({
    //             type: 'rocketChat/getCmVisitorInfo',
    //             payload: {
    //               params: { user_id: roomInfo.v._id },
    //             },
    //           });
    //         }
    //         this.setState({ visibleEdit: false });
    //       }
    //     },
    //     callbackErr: (err) => {
    //       notification.error({
    //         message: JSON.parse(err.response).error.message,
    //       });
    //     },
    //   });
    // } else {
    //   delete formValue.id;
    //   reqwestCMS({
    //     apiPath: API.CM_CUSTOMER_INFOS,
    //     filter: JSON.stringify(formValue),
    //     authToken: this.props.authToken,
    //     userId: this.props.userId,
    //     authorization: authorization,
    //     method: 'post',
    //     callback: (res) => {
    //       if (res.success == false) {
    //         notification.error({
    //           message: res.error,
    //         });
    //       } else {
    //         notification.success({
    //           message: 'Cập nhật thông tin thành công.',
    //         });
    //         this.setState({ visibleEdit: false });
    //         if (roomInfo.t === 'p') {
    //           // this.props.getCmVisitorsInfo({
    //           //   params: { user_id: roomInfo.customFields.id },
    //           // });
    //           this.props.dispatch({
    //             type: 'rocketChat/getCmVisitorInfo',
    //             payload: {
    //               params: { user_id: roomInfo.customFields.id },
    //             },
    //           });
    //         } else {
    //           // this.props.getCmVisitorsInfo({
    //           //   params: { user_id: roomInfo.v._id },
    //           // });
    //           // this.props.dispatch({
    //           //   type: 'rocketChat/getCmVisitorInfo',
    //           //   payload: {
    //           //     params: { user_id: roomInfo.v._id },
    //           //   },
    //           // });
    //         }
    //       }
    //     },
    //     callbackErr: (err) => {
    //       notification.error({
    //         message: JSON.parse(err.response).error.message,
    //       });
    //     },
    //   });
    // }
  };
  componentDidMount() {
    reqwestListPhone({
      apiPath: '/api/crm-service/customer/phones/list-phone',
      search: '',
      authorization: this.props.authorization,
      callback: (res) => {
        if (res.code === 200) {
          const list = [];
          res.response.data.map((x) => {
            list.push({ label: `${x.name} - ${x.phone}`, value: x.phone });
          });
          this.setState({ listCustomerInfo: list });
          this.props.dispatch({
            type: 'rocketChat/searchCMCustomerInfoCompleted',
            payload: {
              data: list,
            },
          });
        }
      },
      callbackErr: (err) => {
        console.log(err);
      },
    });
  }
  handSearchInformationCustomer = (phoneNumber) => {
    const { listCustomerInfo } = this.props;
    if (phoneNumber) {
      const customerSearch = listCustomerInfo
        ? listCustomerInfo.filter((x) => x.value.indexOf(phoneNumber) > -1)
        : [];
      this.setState({ listCustomerInfo: customerSearch });
    } else {
      this.setState({ listCustomerInfo: this.props.listCustomerInfo });
    }
    // let listCustomerInfo =
    //   this.props.listCustomerInfo && isArray(JSON.parse(this.props.listCustomerInfo))
    //     ? JSON.parse(this.props.listCustomerInfo)
    //     : [];
    // let options =
    //   listCustomerInfo && Array.isArray(listCustomerInfo)
    //     ? listCustomerInfo.map((u) => {
    //         let phoneDefault = this.getPhoneDefault(u.phones);
    //         return {
    //           ...u,
    //           value: phoneDefault,
    //           label: u.name + '-' + phoneDefault,
    //         };
    //       })
    //     : [];
    // if (phoneNumber) {
    //   let customerInfoSearch = options
    //     ? options.filter((e) => e?.value?.indexOf(phoneNumber) > -1)
    //     : [];
    //   this.setState({
    //     listCustomerInfo: customerInfoSearch,
    //   });
    // } else {
    //   this.setState({
    //     listCustomerInfo,
    //   });
    // }
  };
  handSelectInformationCustomer = (value, opt) => {
    // if (opt?.value?.length > 0) {
    //   this.checkPhoneDefault(opt.value);
    // }
    reqwestCustomerInfo({
      apiPath: `/api/crm-service/customer/phone/${opt?.value}`,
      authorization: this.props.authorization,
      callback: (res) => {
        if (res.code === 200) {
          const customer = res.response.data;
          this.setState({
            formFields: [
              // {
              //   name: ['id'],
              //   value: opt._id || '',
              // },
              // {
              //   name: ['rid'],
              //   value: this.props?.roomInfo?._id,
              // },
              // {
              //   name: ['visitor_id'],
              //   value: this.props?.visitorsInfo.id,
              // },
              {
                name: ['name'],
                value: customer.name,
              },
              {
                name: ['phones'],
                value: customer.phones,
              },
              {
                name: ['email'],
                value: customer.email,
              },
              {
                name: ['addresses'],
                value: customer.addresses,
              },
              {
                name: ['note'],
                value: customer.note,
              },
            ],
          });
        }
      },
      callbackErr: (err) => {
        console.log(err);
      },
    });
  };
  onChangeLog = (value) => {
    const { customerInfo, authorization } = this.props;
    if (value) {
      this.setState({ openHistory: true });
      reqwestLog({
        basePath: process.env.UMI_API_BASE_URL,
        apiPath: '/api/crm-service/customer/all-reaction-history',
        customerId: customerInfo?.id,
        authorization: authorization,
        callback: (res) => {
          if (res.code === 200) {
            this.setState({
              logCall: res.response.data,
              lengthLogCall: res.response.data.length,
              offsetLogCall: 1,
            });
          }
        },
        callbackErr: (err) => {
          console.log(err);
        },
      });
    } else {
      // this.setState({ openHistory: false });
      this.setState({ logCall: [], lengthLogCall: 0, offsetLogCall: 1, openHistory: false });
    }
  };
  // onNewLog = () => {
  //   let { offsetLogCall, logCall, lengthLogCall } = this.state;
  //   let { customerInfo, authorization } = this.props;
  //   let phones = [];

  //   if (customerInfo?.phones && customerInfo.phones.length > 0) {
  //     for (let index = 0; index < customerInfo.phones.length; index++) {
  //       const element = customerInfo.phones[index];
  //       phones.push(element.phone);
  //     }
  //   }
  //   if (logCall && logCall.length > 0 && offsetLogCall * 5 <= lengthLogCall) {
  //     if (phones.length > 0 && customerInfo) {
  //       let param = `?sort={"createAt":-1}&page=${offsetLogCall + 1}&limit=5&phone=${phones.join(
  //         ',',
  //       )}&cusid=${customerInfo._id}`;
  //       reqwestLog({
  //         basePath: process.env.URL_API_CM,
  //         apiPath: API.CUSTOMER_HISTORY_ALL + param,
  //         userId: this.props.userId,
  //         authToken: this.props.authToken,
  //         authorization: authorization,
  //         callback: (res) => {
  //           if (res.success) {
  //             this.setState({
  //               logCall: logCall.concat(res.data),
  //               offsetLogCall: offsetLogCall + 1,
  //             });
  //           }
  //         },
  //         callbackErr: (err) => {},
  //       });
  //     }
  //   }
  // };
  onClickCancel = (roomInfo) => {
    this.handelEdit();
    if (roomInfo) {
      if (roomInfo.t === 'p') {
        // this.props.getCmVisitorsInfo({
        //   params: { user_id: roomInfo.customFields.id },
        // });
        this.props.dispatch({
          type: 'rocketChat/getCmVisitorInfo',
          payload: {
            params: { user_id: roomInfo.customFields.id },
          },
        });
      } else {
        // this.props.getCmVisitorsInfo({
        //   params: { user_id: roomInfo.v._id },
        // });
        // this.props.dispatch({
        //   type: 'rocketChat/getCmVisitorInfo',
        //   payload: {
        //     params: { user_id: roomInfo.v._id },
        //   },
        // });
      }
    }
  };
  getExtension = (filename) => {
    var parts = filename.split('.');
    return parts[parts.length - 1];
  };
  render() {
    const {
      visibleEdit,
      listCustomerInfo,
      formFields,
      logCall,
      lengthLogCall,
      openHistory,
    } = this.state;
    const {
      roomInfo,
      visitorsInfo,
      groupImageVideo,
      groupFile,
      typeRoom,
      typeSocial,
      muted,
      customerInfo,
      visitorsInfoLivechat,
    } = this.props;
    // console.log(customerInfo, roomInfo);
    return (
      <>
        <Sider theme="light" className="sider-navbar">
          {roomInfo ? (
            <>
              <div className="information-content">
                <Form
                  // name="control-ref"
                  wrapperCol={{ span: 24 }}
                  className="information-form"
                  fields={formFields}
                  onFinish={this.handSaveInformation}
                >
                  <Row className="slider-container">
                    <Col>
                      {roomInfo?.customFields?.dataInfoDto?.profilePic ? (
                        <Avatar size={80} src={roomInfo.customFields.dataInfoDto.profilePic} />
                      ) : (
                        <Avatar
                          size={80}
                          style={{
                            backgroundColor: `#${Math.floor(
                              roomInfo.customFields.dataInfoDto.name.charCodeAt(0) * 50000,
                            ).toString(16)}`,
                          }}
                        >
                          {roomInfo.customFields.dataInfoDto.name.split(' ')[0].length < 8
                            ? roomInfo.customFields.dataInfoDto.name.split(' ')[0]
                            : roomInfo.customFields.dataInfoDto.name.split(' ')[0].slice(0, 8)}
                        </Avatar>
                      )}
                      <Row>
                        <Col className={!visibleEdit ? 'information-name' : ''} span={24}>
                          <Typography.Title className="information-title">
                            {roomInfo ? roomInfo.customFields.dataInfoDto.name : null}
                          </Typography.Title>
                          {!visibleEdit && roomInfo?.status === 'PROCESSING' ? (
                            <Button
                              id="btn-edit-infomation"
                              className="information-button-edit"
                              disabled={muted}
                              onClick={this.handelEdit}
                            >
                              <img src={IconEdit} />
                            </Button>
                          ) : null}
                        </Col>
                      </Row>
                      {visibleEdit ? (
                        <Row>
                          <Col span={24}>
                            <Button
                              id="btn-save-infomation"
                              className="information-button-save"
                              type="primary"
                              htmlType="submit"
                            >
                              Lưu
                            </Button>
                            <Button
                              id="btn-cancel-infomation"
                              className="information-button-cancel"
                              type="default"
                              htmlType="button"
                              onClick={() => this.onClickCancel(roomInfo)}
                            >
                              Hủy
                            </Button>
                          </Col>
                        </Row>
                      ) : (
                        <p className="information-status">Đang online</p>
                      )}
                    </Col>
                  </Row>
                  <Col span={24} className="txt-info-lable">
                    Thông tin khách hàng
                  </Col>

                  {/* <Form.Item
                    hidden={true}
                    label={<Typography.Text className="txt-information">Id</Typography.Text>}
                    name="id"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    hidden={true}
                    label={<Typography.Text className="txt-information"> Room Id</Typography.Text>}
                    name="rid"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    hidden={true}
                    label={
                      <Typography.Text className="txt-information">Visitor Id</Typography.Text>
                    }
                    name="visitor_id"
                  >
                    <Input />
                  </Form.Item> */}
                  <Form.Item colon={false} className="form-item-information">
                    <Col className="icon-form-information">
                      <Icon component={UserSvg} />
                    </Col>
                    <Col className="content-form-information">
                      <Form.Item
                        labelCol={{ span: 24 }}
                        colon={false}
                        name="name"
                        className="form-lable-item-information"
                        label={
                          <Typography.Text className="txt-information">Họ và tên</Typography.Text>
                        }
                        rules={[
                          {
                            validator: (_, value) =>
                              /[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]$/.test(
                                String(value),
                              )
                                ? Promise.resolve()
                                : Promise.reject(
                                    new Error('Vui lòng không nhập số và kí tự đặt biệt'),
                                  ),
                          },
                        ]}
                      >
                        {!visibleEdit ? (
                          <span style={{ fontSize: 12, fontWeight: 600 }}>
                            {customerInfo
                              ? customerInfo.name
                              : roomInfo.customFields.dataInfoDto.name}
                          </span>
                        ) : (
                          <Input
                            size="small"
                            hidden={formFields && !formFields[3].value && !visibleEdit}
                            disabled={!visibleEdit}
                            bordered={visibleEdit}
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Form.Item>
                  <Form.Item colon={false} className="form-item-information">
                    <Col className="icon-form-information">
                      <Icon component={PhoneSvg} />
                    </Col>
                    <Col className="content-form-information">
                      <Form.Item
                        labelCol={{ span: 24 }}
                        colon={false}
                        className="form-lable-list-information "
                        label={
                          <Typography.Text className="txt-information">
                            {' '}
                            Số điện thoại
                          </Typography.Text>
                        }
                      >
                        {visibleEdit ? (
                          <Form.List
                            className="form-list-information"
                            name="phones"
                            rules={[
                              {
                                validator: async (_, phones) => {
                                  if (!phones || phones.length < 1) {
                                    return Promise.reject(
                                      new Error('Phải có ít nhất 1 số điện thoại'),
                                    );
                                  } else {
                                    for (let index = 0; index < phones.length; index++) {
                                      const element = phones[index];
                                      let validate = /(\b(84|0)[0-9]{9}\b)|(\b\d{8,9}\b)/.test(
                                        String(element.phone),
                                      );
                                      if (!validate) {
                                        return Promise.reject(
                                          new Error('Nhập đúng số điện thoại .'),
                                        );
                                      }
                                    }
                                  }
                                },
                              },
                            ]}
                          >
                            {(fields, { add, remove }, { errors }) => (
                              <>
                                {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                                  <Row className={'row-list-item-information'} key={index + 'row'}>
                                    <Col span="16">
                                      <Form.Item key={key + 'phone'} name={[name, 'phone']} noStyle>
                                        <AutoComplete
                                          className={!visibleEdit ? 'form-phone-autocomplete' : ''}
                                          size="small"
                                          disabled={visibleEdit ? false : true}
                                          style={{ width: '100%' }}
                                          options={listCustomerInfo}
                                          onSelect={this.handSelectInformationCustomer}
                                          onSearch={this.handSearchInformationCustomer}
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col
                                      span="4"
                                      style={{
                                        textAlign: 'center',
                                        alignSelf: 'center',
                                      }}
                                    >
                                      <StarFilled
                                        style={{
                                          fontSize: '20px',
                                          color: `${
                                            name === this.state.isPhoneDefaul
                                              ? '#FAAD14'
                                              : '#ADADAD'
                                          }`,
                                        }}
                                        onClick={() =>
                                          this.setState({
                                            isPhoneDefaul: index,
                                          })
                                        }
                                      />
                                    </Col>

                                    <Col
                                      span="4"
                                      style={{
                                        textAlign: 'center',
                                        alignSelf: 'center',
                                      }}
                                    >
                                      <Icon
                                        component={DeleteSvg}
                                        onClick={() => {
                                          remove(name);
                                          if (name === this.state.isPhoneDefaul) {
                                            this.setState({
                                              isPhoneDefaul: -1,
                                            });
                                          }
                                        }}
                                      />
                                    </Col>
                                  </Row>
                                ))}
                                <Form.Item key={'btn'} labelCol={{ span: 24 }}>
                                  <Button
                                    style={{
                                      border: 'none',
                                      paddingLeft: '0px',
                                      boxShadow: 'none',
                                    }}
                                    onClick={() => add({ phone: '', isFirstNumber: false })}
                                    icon={<PlusSquareFilled />}
                                  >
                                    Thêm số diện thoại
                                  </Button>
                                  <Form.ErrorList errors={errors} />
                                </Form.Item>
                              </>
                            )}
                          </Form.List>
                        ) : (
                          <span style={{ fontSize: 12, fontWeight: 600 }}>
                            {customerInfo
                              ? customerInfo.phones?.filter((x) => x.isFirstNumber === true)[0]
                                  .phone
                              : roomInfo.customFields.dataInfoDto.phone}
                          </span>
                        )}
                      </Form.Item>
                    </Col>
                  </Form.Item>

                  <Form.Item colon={false} className="form-item-information">
                    <Col className="icon-form-information">
                      <Icon component={EmailSvg} />
                    </Col>
                    <Col className="content-form-information">
                      <Form.Item
                        labelCol={{ span: 24 }}
                        colon={false}
                        name="email"
                        className="form-lable-item-information"
                        label={<Typography.Text className="txt-information">Email</Typography.Text>}
                      >
                        {!visibleEdit ? (
                          <span style={{ fontSize: 12, fontWeight: 600 }}>
                            {customerInfo
                              ? customerInfo.email
                              : roomInfo.customFields.dataInfoDto.email}
                          </span>
                        ) : (
                          <Input
                            hidden={formFields && !formFields[5]?.value && !visibleEdit}
                            size="small"
                            bordered={visibleEdit}
                            type="email"
                            disabled={visibleEdit ? false : true}
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Form.Item>
                  <Form.Item colon={false} className="form-item-information">
                    <Col className="icon-form-information">
                      <Icon component={addressesSvg} />
                    </Col>
                    <Col className="content-form-information">
                      <Form.Item
                        labelCol={{ span: 24 }}
                        colon={false}
                        name="addresses"
                        className="form-lable-item-information"
                        label={
                          <Typography.Text className="txt-information"> Địa chỉ</Typography.Text>
                        }
                      >
                        {!visibleEdit ? (
                          <span style={{ fontSize: 12, fontWeight: 600 }}>
                            {customerInfo
                              ? customerInfo.addresses
                              : roomInfo.customFields.dataInfoDto.address}
                          </span>
                        ) : (
                          <Input
                            hidden={formFields && !formFields[6]?.value && !visibleEdit}
                            size="small"
                            bordered={visibleEdit}
                            type="text"
                            disabled={visibleEdit ? false : true}
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Form.Item>

                  <Form.Item
                    labelCol={{ span: 24 }}
                    colon={false}
                    name="note"
                    className="lable-note-information"
                    label={
                      <Typography.Text className="txt-note-information"> Ghi chú</Typography.Text>
                    }
                  >
                    <Input.TextArea
                      className="note-input-information"
                      autoSize={{ minRows: 3, maxRows: 3 }}
                      disabled={visibleEdit ? false : true}
                    />
                  </Form.Item>
                </Form>

                <Collapse
                  accordion
                  expandIconPosition="right"
                  bordered={false}
                  className="information-visitor"
                  activeKey={openHistory ? ['1'] : ['0']}
                  onChange={this.onChangeLog}
                  expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
                >
                  <Panel
                    className="panel-visitor-information"
                    header={
                      <Typography.Text className="txt-info-media">
                        Lịch sử tương tác
                      </Typography.Text>
                    }
                    key="1"
                  >
                    {logCall && logCall.length > 0 ? (
                      <Timeline className="information-visitor-timeline">
                        {logCall.map((item, index) => {
                          return (
                            <Timeline.Item
                              key={index}
                              className="information-visitor-timeline-item"
                            >
                              <p className="information-visitor-timeline-item-hightlight">
                                {formatStringToString(item?.createdAt) || ''}
                              </p>
                              <p>
                                {item?.source} -{' '}
                                <span className="information-visitor-timeline-item-hightlight">
                                  {item?.agent_name}
                                </span>
                              </p>
                              <p className="information-visitor-timeline-item-description">
                                {item?.note}
                              </p>
                            </Timeline.Item>
                          );
                        })}
                        {/* {logCall.length > 0 && logCall.length < lengthLogCall ? (
                          <div className="information-visitor-timeline-button">
                            <Button
                              type="link"
                              onClick={this.onNewLog}
                              className="information-visitor-timeline-button-info"
                              icon={<Icon component={WrapperSvg} />}
                            >
                              Xem thêm
                            </Button>
                          </div>
                        ) : null} */}
                      </Timeline>
                    ) : null}
                  </Panel>
                </Collapse>
                <Collapse
                  accordion
                  expandIconPosition="right"
                  bordered={false}
                  className="information-visitor"
                  expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
                >
                  <Panel
                    className="panel-visitor-profile"
                    header={
                      <Typography.Text className="txt-info-media">Visitor profile</Typography.Text>
                    }
                    key="1"
                  >
                    <Row>
                      <Col span={6}>
                        <Typography.Text className="lable-visitor-information">ID:</Typography.Text>
                      </Col>
                      <Col span={18}>
                        <Typography.Text className="txt-visitor-information">
                          {roomInfo ? (visitorsInfo ? visitorsInfo.id : null) : null}
                        </Typography.Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6}>
                        <Typography.Text className="lable-visitor-information">
                          Tên:
                        </Typography.Text>
                      </Col>
                      <Col span={18}>
                        <Typography.Text className="txt-visitor-information">
                          {roomInfo ? (visitorsInfo ? visitorsInfo.name : null) : null}
                        </Typography.Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6}>
                        <Typography.Text className="lable-visitor-information">
                          Source:
                        </Typography.Text>
                      </Col>
                      <Col span={18}>
                        <Typography.Text className="txt-visitor-information">
                          {roomInfo ? (visitorsInfo ? visitorsInfo.source : null) : null}
                        </Typography.Text>
                      </Col>
                    </Row>
                  </Panel>
                </Collapse>
                <Collapse
                  accordion
                  expandIconPosition="right"
                  bordered={false}
                  className="information-visitor"
                  expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
                >
                  <Panel
                    header={
                      <div className="information-visitor-header">
                        <Typography.Text className="txt-info-media">Tệp đính kèm</Typography.Text>
                        <Typography.Text className="txt-info-media-count">
                          {groupFile ? groupFile.length : 0} tệp
                        </Typography.Text>
                      </div>
                    }
                    key="2"
                  >
                    {groupFile && groupFile.length > 0
                      ? groupFile.map((item, index) => {
                          return (
                            <div key={'attach' + index} className="attach-file">
                              <Col>
                                {this.getExtension(item.title || item.description) === 'doc' ||
                                this.getExtension(item.title || item.description) === 'docx' ? (
                                  <Icon component={FileDocSvg} />
                                ) : this.getExtension(item.title || item.description) === 'pdf' ? (
                                  <Icon component={FilePDFSvg} />
                                ) : this.getExtension(item.title || item.description) === 'xlsx' ||
                                  this.getExtension(item.title || item.description) === 'xls' ? (
                                  <Icon component={FileXlsmSvg} />
                                ) : this.getExtension(item.title || item.description) === 'zip' ? (
                                  <Icon component={FileZipSvg} />
                                ) : (
                                  <Icon component={FileSvg} />
                                )}
                              </Col>
                              <Col className="attach-title-file">
                                {item.type !== 'sticker' ? (
                                  <a href={item.payloadUrl} target="_blank" rel="noreferrer">
                                    <span className="title-file">
                                      {item.title && item.title.length > 0
                                        ? item.title
                                        : item.description && item.description.length > 0
                                        ? item.description
                                        : null}
                                    </span>
                                  </a>
                                ) : null}
                              </Col>
                            </div>
                          );
                        })
                      : null}
                  </Panel>
                </Collapse>
                <Collapse
                  accordion
                  expandIconPosition="right"
                  bordered={false}
                  className="information-visitor"
                  expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
                >
                  <Panel
                    header={
                      <div className="information-visitor-header">
                        <Typography.Text className="txt-info-media">Ảnh và video</Typography.Text>
                        <Typography.Text className="txt-info-media-count">
                          {groupImageVideo ? groupImageVideo.length : 0} ảnh, video
                        </Typography.Text>
                      </div>
                    }
                    key="3"
                  >
                    <Row>
                      {groupImageVideo && groupImageVideo.length > 0
                        ? groupImageVideo.map((item, index) => {
                            if (item.type.search('image') !== -1) {
                              return (
                                <Col key={index} span={6} className="attach-content">
                                  <Image
                                    className="attach-image-video"
                                    // onClick={() => this.props.handleShowReViewImage(item)}
                                    preview={true}
                                    src={item.payloadUrl}
                                  />
                                </Col>
                              );
                            }
                            if (item.type.search('video') !== -1) {
                              return (
                                <Col key={index} span={6} className="attach-content">
                                  <video className="attach-image-video" controls>
                                    <source src={item.payloadUrl} type="video/mp4" />
                                  </video>
                                </Col>
                              );
                            }
                          })
                        : ''}
                    </Row>
                  </Panel>
                </Collapse>
              </div>
            </>
          ) : null}
        </Sider>
      </>
    );
  }
}

const mapStateToProps = ({ rocketChat, websocket, user }) => {
  return {
    websocket: websocket.socket,
    userInfo: rocketChat.userInfo,
    listUser: rocketChat.listUser,
    authorization: user.tokenGateway,
    customerInfo: rocketChat.customerInfo,
    // groupFile: rocketChat.groupFile,
    // groupImageVideo: rocketChat.groupImageVideo,
    listCustomerInfo: rocketChat.listCustomerInfo,
    visitorsInfoLivechat: rocketChat.visitorsInfoLivechat,
  };
};

export default connect(mapStateToProps)(information);
