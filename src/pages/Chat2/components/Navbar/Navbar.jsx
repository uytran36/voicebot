/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import { connect } from 'umi';
import { bindActionCreators } from 'redux';
import reqwest from 'reqwest';
// import { reqwestRoom, requestListRoom } from '../../helpers/reqwest';
import { requestListRoom } from '../../../../services/omnichat';
import {
  Layout,
  Typography,
  Col,
  Row,
  Button,
  List,
  Input,
  Switch,
  Avatar,
  Badge,
  Select,
  Tag,
  Modal,
} from 'antd';
import Icon, {
  CloseOutlined,
  LoadingOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons';
// import * as ActionSaga from "../../actions/index";
import { CHANGE_STATUS_LIVECHAT } from '../../constants/IdSocket';
import * as TYPE_ROOM_WIDGET from '../../constants/TypeRoomWidget';
import InfiniteScroll from 'react-infinite-scroller';
import IconMessenger15x15 from '../../assets/icon/messsenger-15x15.svg';
import IconZalo16x16 from '../../assets/icon/Zalo-16x16.svg';
import IconLiveChat16x16 from '../../assets/icon/LiveChat-16x16.svg';
import IconArrow from '../../assets/icon/Arrow.svg';
import RightArrow from '../../assets/icon/RightArrow.svg';
import { checkPermission, OMNI_CHAT_INBOUND } from '@/utils/permission';
import { requestGetListPageFacebookSubcribe } from '@/pages/OmniChannelInbound2/service';

const { CheckableTag } = Tag;
const { Option } = Select;
const { Sider } = Layout;

const IconUserCircle = () => (
  <svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.5003 13.2856C15.073 13.2856 16.352 12.0065 16.352 10.4338C16.352 8.86105 15.073 7.58203 13.5003 7.58203C11.9275 7.58203 10.6485 8.86105 10.6485 10.4338C10.6485 12.0065 11.9275 13.2856 13.5003 13.2856ZM17.7782 20.4151C18.1725 20.4151 18.4912 20.0957 18.4912 19.7022C18.4912 16.9502 16.2518 14.7116 13.5006 14.7116C10.7494 14.7116 8.51001 16.9502 8.51001 19.7022C8.51001 20.0957 8.82869 20.4151 9.22295 20.4151H17.7782ZM22.9278 4.57024C19.8825 1.52491 15.6678 0.166244 11.3625 0.831577C5.92647 1.67958 1.4198 6.05824 0.40247 11.4809C-0.0868637 14.0916 0.19447 16.7502 1.21714 19.1676C1.3478 19.4742 1.3878 19.7622 1.3358 20.0196L0.193136 25.7369C0.105136 26.1742 0.24247 26.6262 0.557136 26.9409C0.809136 27.1929 1.14914 27.3316 1.4998 27.3316C1.58647 27.3316 1.67447 27.3236 1.76114 27.3049L7.4718 26.1636C7.7998 26.1009 8.11847 26.1929 8.33047 26.2809C10.7491 27.3036 13.4078 27.5836 16.0171 27.0956C21.4398 26.0782 25.8185 21.5716 26.6665 16.1356C27.3371 11.8316 25.9745 7.61691 22.9278 4.57024Z"
      fill="#8C8C8C"
    />
  </svg>
);
const IconMessageCircle = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.3333 15.3316C18.5973 15.3316 17.9999 14.7343 17.9999 13.9983C17.9999 13.2623 18.5973 12.6649 19.3333 12.6649C20.0693 12.6649 20.6666 13.2623 20.6666 13.9983C20.6666 14.7343 20.0693 15.3316 19.3333 15.3316ZM13.9999 15.3316C13.2639 15.3316 12.6666 14.7343 12.6666 13.9983C12.6666 13.2623 13.2639 12.6649 13.9999 12.6649C14.7359 12.6649 15.3333 13.2623 15.3333 13.9983C15.3333 14.7343 14.7359 15.3316 13.9999 15.3316ZM8.6666 15.3316C7.9306 15.3316 7.33327 14.7343 7.33327 13.9983C7.33327 13.2623 7.9306 12.6649 8.6666 12.6649C9.4026 12.6649 9.99993 13.2623 9.99993 13.9983C9.99993 14.7343 9.4026 15.3316 8.6666 15.3316ZM23.4278 4.57024C20.3825 1.52491 16.1678 0.166244 11.8625 0.831577C6.42647 1.67958 1.9198 6.05824 0.90247 11.4809C0.413136 14.0916 0.69447 16.7502 1.71714 19.1676C1.8478 19.4742 1.8878 19.7622 1.8358 20.0196L0.693136 25.7369C0.605136 26.1742 0.74247 26.6262 1.05714 26.9409C1.30914 27.1929 1.64914 27.3316 1.9998 27.3316C2.08647 27.3316 2.17447 27.3236 2.26114 27.3049L7.9718 26.1636C8.2998 26.1009 8.61847 26.1929 8.83047 26.2809C11.2491 27.3036 13.9078 27.5836 16.5171 27.0956C21.9398 26.0782 26.3185 21.5716 27.1665 16.1356C27.8371 11.8316 26.4745 7.61691 23.4278 4.57024Z"
      fill="#8C8C8C"
    />
  </svg>
);
const IconMesssage = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z"
      fill="white"
    />
    <path
      d="M12.0978 6.28077L11.5867 7.11188L10.1156 9.44077C10.0301 9.59088 9.90763 9.71664 9.75983 9.8061C9.61204 9.89555 9.44382 9.94574 9.27117 9.95188C9.04234 9.95736 8.81786 9.88877 8.63117 9.75633L7.05339 8.57411C6.97353 8.50759 6.87288 8.47116 6.76895 8.47116C6.66501 8.47116 6.56437 8.50759 6.48451 8.57411L4.40006 10.1385C4.36263 10.173 4.31833 10.1991 4.27007 10.2152C4.2218 10.2313 4.17068 10.237 4.12006 10.2319C4.06678 10.2239 4.01633 10.2028 3.97327 10.1704C3.9302 10.138 3.89587 10.0954 3.87338 10.0465C3.85089 9.99753 3.84094 9.94375 3.84443 9.88999C3.84793 9.83623 3.86475 9.78418 3.89339 9.73855L4.24451 9.18299L5.87562 6.59188C5.95769 6.45022 6.07218 6.33003 6.2097 6.24118C6.34722 6.15234 6.50385 6.09736 6.66673 6.08077C6.79241 6.06328 6.92032 6.07077 7.04311 6.1028C7.1659 6.13483 7.28116 6.19078 7.38228 6.26744L8.96895 7.44966C9.04599 7.52025 9.14669 7.5594 9.25117 7.5594C9.35566 7.5594 9.45635 7.52025 9.53339 7.44966C10.2356 6.91633 10.9378 6.39188 11.6312 5.85411C11.6751 5.81524 11.7286 5.78882 11.7861 5.77758C11.8437 5.76634 11.9032 5.7707 11.9585 5.79019C12.0138 5.80968 12.0629 5.8436 12.1007 5.88844C12.1385 5.93328 12.1636 5.98741 12.1734 6.04522C12.1789 6.13046 12.1519 6.21463 12.0978 6.28077Z"
      fill="white"
    />
    <path
      d="M7.62228 1.15625H8.37783H8.42228C8.62466 1.16448 8.82644 1.18377 9.02672 1.21403C9.74979 1.31119 10.4532 1.52115 11.1112 1.83625C12.132 2.31235 13.0104 3.04735 13.6592 3.96818C14.3079 4.88902 14.7043 5.96361 14.8089 7.08514C14.8089 7.20069 14.8312 7.31625 14.8401 7.4318V8.16069C14.838 8.17692 14.838 8.19335 14.8401 8.20958C14.829 8.45106 14.8023 8.69157 14.7601 8.92958C14.536 10.3781 13.8185 11.7047 12.7289 12.6851C12.0724 13.2775 11.303 13.731 10.4667 14.0185C9.48148 14.3614 8.43511 14.4931 7.39561 14.4051C6.945 14.3746 6.49844 14.3002 6.06228 14.1829C5.90471 14.1366 5.73565 14.1492 5.58672 14.2185C5.14203 14.4794 4.66944 14.6896 4.17783 14.8451C4.11014 14.8562 4.04108 14.8562 3.97339 14.8451C3.83993 14.8212 3.72027 14.7482 3.638 14.6404C3.55573 14.5326 3.51682 14.398 3.52895 14.2629C3.52895 13.8718 3.52895 13.4851 3.49339 13.0985C3.49388 13.0296 3.48034 12.9614 3.45359 12.898C3.42685 12.8346 3.38746 12.7773 3.33783 12.7296L3.18672 12.5918C2.56456 12.0037 2.06726 11.2963 1.7245 10.5118C1.44178 9.87198 1.26466 9.19054 1.20006 8.49403C1.20006 8.38292 1.20006 8.27181 1.16895 8.16069V7.4318C1.17109 7.41409 1.17109 7.39619 1.16895 7.37847C1.17653 7.13989 1.20178 6.90221 1.2445 6.66736C1.48829 5.06603 2.33594 3.61882 3.61339 2.62292C4.66157 1.80106 5.92639 1.30223 7.25339 1.18736L7.62228 1.15625ZM9.27117 9.92958C9.44382 9.92344 9.61203 9.87325 9.75983 9.7838C9.90763 9.69434 10.0301 9.56858 10.1156 9.41847L11.5867 7.1118L12.0978 6.30292C12.1456 6.23426 12.1662 6.15032 12.1556 6.06736C12.1458 6.00955 12.1207 5.95543 12.0829 5.91059C12.0451 5.86575 11.996 5.83182 11.9407 5.81233C11.8854 5.79284 11.8259 5.78849 11.7683 5.79973C11.7108 5.81096 11.6573 5.83738 11.6134 5.87625C10.9201 6.41403 10.2178 6.93847 9.51561 7.4718C9.43857 7.54239 9.33788 7.58154 9.23339 7.58154C9.1289 7.58154 9.02821 7.54239 8.95117 7.4718L7.3645 6.26736C7.16487 6.1171 6.91471 6.05018 6.66672 6.08069C6.50697 6.09995 6.35391 6.15617 6.21967 6.24489C6.08544 6.33361 5.97372 6.45239 5.89339 6.5918C5.35117 7.48069 4.8045 8.32069 4.26228 9.18292L3.91117 9.73847C3.88455 9.78265 3.86885 9.83254 3.86537 9.884C3.86189 9.93545 3.87073 9.987 3.89115 10.0344C3.91157 10.0817 3.94299 10.1235 3.9828 10.1563C4.02261 10.1891 4.06966 10.2119 4.12006 10.2229C4.17067 10.228 4.2218 10.2224 4.27006 10.2063C4.31832 10.1902 4.36263 10.164 4.40006 10.1296L6.4845 8.54292C6.56154 8.47233 6.66224 8.43318 6.76672 8.43318C6.87121 8.43318 6.9719 8.47233 7.04894 8.54292L8.63117 9.72514C8.81676 9.86073 9.04133 9.93247 9.27117 9.92958Z"
      fill="url(#paint0_linear)"
    />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="11.1956"
        y1="2.06292"
        x2="4.45783"
        y2="14.1474"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF6D64" />
        <stop offset="0.45" stopColor="#9C36FF" />
        <stop offset="1" stopColor="#2184FF" />
      </linearGradient>
    </defs>
  </svg>
);
const IconZalo = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0)">
      <path
        d="M16 7.99653C16.0006 9.3421 15.6618 10.6661 15.0149 11.8459C14.368 13.0258 13.434 14.0235 12.2993 14.7466C11.1645 15.4697 9.86572 15.8949 8.52304 15.9829C7.18036 16.0709 5.83717 15.8187 4.61778 15.2499C3.31852 14.6437 2.20602 13.6996 1.39667 12.5162C0.587318 11.3328 0.110852 9.95366 0.0171186 8.52304C-0.0766153 7.09241 0.215828 5.66289 0.863854 4.38401C1.51188 3.10513 2.49167 2.0239 3.70074 1.25342C4.9098 0.482946 6.3037 0.0515405 7.73661 0.004338C9.16953 -0.0428645 10.5888 0.29587 11.8459 0.985106C13.1031 1.67434 14.1519 2.68875 14.8827 3.92221C15.6135 5.15566 15.9994 6.56284 16 7.99653Z"
        fill="#0064FF"
      />
      <path
        d="M13.9731 13.3322C12.8301 14.6122 11.3057 15.4908 9.62502 15.8381C7.94439 16.1855 6.19661 15.9832 4.63977 15.2611L2.54199 13.1722H2.71533C3.27199 13.1904 3.82666 13.0967 4.34644 12.8966C4.41008 12.8676 4.47538 12.8424 4.54199 12.8211C4.56793 12.8123 4.59605 12.8123 4.62199 12.8211C4.90199 12.9722 5.17755 13.1366 5.46644 13.2655C6.08421 13.5561 6.73486 13.771 7.40421 13.9055C8.20105 14.0688 9.01309 14.1463 9.82644 14.1366C10.6511 14.1303 11.4725 14.0319 12.2753 13.8433L12.382 13.8166L12.4887 13.7899L12.5953 13.7588L12.742 13.7188H12.7998L12.9509 13.6744L13.0664 13.6344C13.1553 13.6077 13.2442 13.5766 13.3331 13.5411L13.4353 13.5055L13.5375 13.4655L13.6398 13.4211L13.7642 13.3677L13.8264 13.3411L13.9731 13.3322Z"
        fill="#0058E9"
      />
      <path
        d="M8.04167 -0.0136719C6.1179 -0.0134625 4.25774 0.674039 2.79781 1.92443C2.68046 2.12069 2.5744 2.32346 2.48014 2.53176C2.21785 3.10319 2.02123 3.70243 1.89401 4.31802C1.8269 4.63062 1.7911 4.94768 1.74188 5.26474C1.67182 5.79758 1.65086 6.33572 1.67924 6.87238C1.70332 7.5243 1.79326 8.17212 1.9477 8.80601C2.10316 9.45718 2.33755 10.087 2.64569 10.6816C2.75124 10.8837 2.86929 11.0791 2.99916 11.2666C3.10506 11.4306 3.14797 11.6272 3.11996 11.8203C3.0776 12.2835 2.88065 12.7191 2.56068 13.0573C2.54489 13.0716 2.53131 13.0882 2.52041 13.1064C2.49356 13.1466 2.48909 13.1824 2.52041 13.2047H2.69491C3.25531 13.223 3.8137 13.1289 4.33696 12.9278C4.40103 12.8987 4.46677 12.8733 4.53383 12.8519C4.55995 12.8431 4.58826 12.8431 4.61437 12.8519C4.89625 13.0037 5.17365 13.169 5.46448 13.2985C6.08641 13.5905 6.74142 13.8064 7.41527 13.9415C8.21745 14.1056 9.03494 14.1835 9.85375 14.1737C10.684 14.1674 11.5109 14.0685 12.3191 13.879L12.4265 13.8522L12.5338 13.8254L12.6412 13.7942L12.7889 13.754H12.847L12.9992 13.7093L13.1155 13.6691C13.205 13.6423 13.2945 13.6111 13.384 13.5753L13.4869 13.5396L13.5898 13.4994L13.6927 13.4548L13.818 13.4012L13.8806 13.3744L13.9969 13.3253C15.0124 12.1701 15.6749 10.7485 15.9057 9.22907C16.1366 7.70963 15.9262 6.15599 15.2995 4.75223C14.6728 3.34847 13.656 2.15345 12.3697 1.30877C11.0833 0.464084 9.58133 0.00514347 8.04167 -0.0136719Z"
        fill="white"
      />
      <path
        d="M3.77373 5.24023H6.85373V5.29357C6.87549 5.4975 6.82346 5.70248 6.70707 5.87135L4.67596 8.44468L4.59151 8.55134H6.75596C6.83596 8.55134 6.86707 8.57357 6.85818 8.65357C6.84929 8.73357 6.85818 8.84023 6.85818 8.93357C6.85704 8.96217 6.85026 8.99027 6.83825 9.01626C6.82623 9.04225 6.80921 9.06561 6.78816 9.08501C6.76711 9.10441 6.74243 9.11947 6.71556 9.12933C6.68868 9.13919 6.66012 9.14365 6.63151 9.14246C6.52929 9.14246 6.42707 9.14246 6.32485 9.14246H3.8004C3.71151 9.14246 3.69818 9.11579 3.69373 9.03134C3.68786 8.84487 3.75118 8.66281 3.87151 8.52023C4.35151 7.93357 5.91596 5.97801 5.94262 5.93801H3.78707L3.77373 5.24023Z"
        fill="#0064FF"
      />
      <path
        d="M10.0448 6.31125C10.0448 6.25792 10.0448 6.23125 9.97372 6.23125H9.52928C9.47594 6.23125 9.46261 6.25348 9.46261 6.29792C9.46261 6.34237 9.46261 6.37792 9.46261 6.44014C9.30128 6.31849 9.11649 6.23159 8.9199 6.18493C8.72331 6.13826 8.51918 6.13285 8.32039 6.16903C8.12212 6.19934 7.93251 6.27123 7.76399 6.38C7.59548 6.48877 7.45187 6.63195 7.34261 6.80014C7.16213 7.06511 7.07199 7.38125 7.0856 7.70156C7.09921 8.02187 7.21585 8.32922 7.41817 8.57792C7.61797 8.83154 7.89882 9.00884 8.21372 9.08014C8.42635 9.13353 8.64815 9.1393 8.86327 9.09705C9.07839 9.05479 9.28153 8.96555 9.45817 8.8357C9.45817 8.85792 9.45817 8.86681 9.45817 8.88014C9.46032 8.91352 9.4693 8.9461 9.48454 8.97586C9.49979 9.00563 9.52099 9.03195 9.54682 9.0532C9.57264 9.07445 9.60256 9.09017 9.63471 9.09939C9.66686 9.10861 9.70056 9.11113 9.73372 9.10681H9.97817C10.0359 9.10681 10.0537 9.10681 10.0537 9.03125C10.0404 8.14236 10.0448 7.22681 10.0448 6.31125ZM8.54705 8.53348C8.30777 8.53348 8.07829 8.43842 7.90909 8.26922C7.73989 8.10002 7.64483 7.87054 7.64483 7.63125C7.64483 7.39197 7.73989 7.16249 7.90909 6.99329C8.07829 6.82409 8.30777 6.72903 8.54705 6.72903C8.66568 6.729 8.78311 6.7527 8.89243 6.79876C9.00175 6.84481 9.10075 6.91228 9.18358 6.99719C9.26642 7.0821 9.33143 7.18273 9.37477 7.29315C9.41811 7.40357 9.43891 7.52156 9.43594 7.64014C9.43891 7.75873 9.41811 7.87671 9.37477 7.98713C9.33143 8.09756 9.26642 8.19819 9.18358 8.2831C9.10075 8.36801 9.00175 8.43548 8.89243 8.48153C8.78311 8.52758 8.66568 8.55129 8.54705 8.55125V8.53348Z"
        fill="#0064FF"
      />
      <path
        d="M13.2182 6.13783C12.9177 6.13607 12.6234 6.22369 12.3728 6.38954C12.1222 6.55539 11.9266 6.792 11.8108 7.06929C11.695 7.34658 11.6642 7.65204 11.7224 7.94686C11.7806 8.24167 11.9251 8.51253 12.1376 8.72502C12.3501 8.93751 12.621 9.08203 12.9158 9.14022C13.2106 9.19842 13.5161 9.16766 13.7934 9.05185C14.0707 8.93604 14.3073 8.74041 14.4731 8.48982C14.639 8.23923 14.7266 7.94499 14.7248 7.6445C14.7248 7.2449 14.5661 6.86168 14.2835 6.57912C14.001 6.29657 13.6178 6.13783 13.2182 6.13783ZM13.2182 8.55561C13.0973 8.55868 12.9771 8.53707 12.8648 8.49209C12.7526 8.44712 12.6507 8.37971 12.5655 8.29401C12.4802 8.20831 12.4133 8.10612 12.3688 7.99367C12.3244 7.88123 12.3034 7.7609 12.307 7.64005C12.3105 7.52069 12.3375 7.4032 12.3864 7.29426C12.4353 7.18533 12.5052 7.0871 12.5921 7.00518C12.679 6.92326 12.7811 6.85925 12.8928 6.81681C13.0044 6.77437 13.1232 6.75433 13.2426 6.75783C13.362 6.76133 13.4795 6.78831 13.5884 6.83722C13.6973 6.88613 13.7956 6.95602 13.8775 7.04289C13.9594 7.12977 14.0234 7.23193 14.0658 7.34354C14.1083 7.45515 14.1283 7.57403 14.1248 7.69338C14.1178 7.92838 14.0181 8.15103 13.8473 8.31263C13.6766 8.47422 13.4487 8.56159 13.2137 8.55561H13.2182Z"
        fill="#0064FF"
      />
      <path
        d="M11.2448 9.12906C11.0848 9.12906 10.9337 9.12906 10.8004 9.12906C10.7745 9.12925 10.7488 9.12391 10.7251 9.1134C10.7014 9.10288 10.6802 9.08743 10.663 9.06808C10.6458 9.04873 10.6328 9.02593 10.6251 9.00119C10.6174 8.97644 10.615 8.95034 10.6182 8.92461C10.6182 8.76906 10.6182 8.60906 10.6182 8.44906C10.6182 7.41202 10.6182 6.37498 10.6182 5.33795C10.6182 5.26683 10.6182 5.24017 10.7115 5.24461C10.8626 5.24461 11.0182 5.24461 11.1559 5.24461C11.2271 5.24461 11.2493 5.24461 11.2493 5.3335V9.1335L11.2448 9.12906Z"
        fill="#0064FF"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
const IconLiveChat = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 0C10.1217 0 12.1566 0.842855 13.6569 2.34315C15.1571 3.84344 16 5.87827 16 8C16 10.1217 15.1571 12.1566 13.6569 13.6569C12.1566 15.1571 10.1217 16 8 16C5.87827 16 3.84344 15.1571 2.34315 13.6569C0.842855 12.1566 0 10.1217 0 8H0C0 5.87827 0.842855 3.84344 2.34315 2.34315C3.84344 0.842855 5.87827 0 8 0V0Z"
      fill="#C4C4C4"
    />
    <path
      d="M8 0C10.1217 0 12.1566 0.842855 13.6569 2.34315C15.1571 3.84344 16 5.87827 16 8C16 10.1217 15.1571 12.1566 13.6569 13.6569C12.1566 15.1571 10.1217 16 8 16C5.87827 16 3.84344 15.1571 2.34315 13.6569C0.842855 12.1566 0 10.1217 0 8H0C0 5.87827 0.842855 3.84344 2.34315 2.34315C3.84344 0.842855 5.87827 0 8 0V0Z"
      fill="#2F7CBA"
    />
    <path
      d="M4.34223 4.51558C5.03985 4.12 5.82916 3.91462 6.63112 3.92003C8.93779 3.92003 10.6889 5.50669 10.6889 7.33336C10.6889 9.16003 8.93779 10.7556 6.63112 10.7556C6.06818 10.7549 5.50985 10.6541 4.98223 10.4578L4.74668 10.3689L4.55112 10.5245C4.28437 10.7493 3.96465 10.9023 3.62223 10.9689C3.77875 10.715 3.86182 10.4227 3.86223 10.1245C3.86488 10.0786 3.86488 10.0326 3.86223 9.98669L3.84001 9.8178L3.71112 9.70669C3.35929 9.41793 3.0745 9.05609 2.8765 8.64627C2.67849 8.23644 2.57201 7.78845 2.56445 7.33336C2.57279 6.88058 2.67876 6.43495 2.87513 6.02688C3.07149 5.61882 3.35361 5.25795 3.70223 4.96891H3.73334C3.82032 4.88899 3.91236 4.81476 4.0089 4.74669C4.11556 4.64891 4.22223 4.58669 4.34223 4.51558Z"
      fill="white"
    />
    <path
      d="M10.9777 6.32422C11.0816 6.65042 11.134 6.99078 11.1333 7.33311C11.1333 9.46644 9.11995 11.1998 6.63106 11.1998H6.39551C6.7889 11.793 7.32732 12.2758 7.9597 12.6025C8.59207 12.9292 9.29742 13.0889 10.0088 13.0664C10.5722 13.0661 11.1308 12.9637 11.6577 12.7642L11.8933 12.6753L12.0888 12.8353C12.3562 13.0592 12.6757 13.212 13.0177 13.2798C12.8597 13.0266 12.7765 12.7338 12.7777 12.4353C12.7752 12.388 12.7752 12.3405 12.7777 12.2931L12.8 12.1287L12.9333 11.9998C13.2828 11.7122 13.5659 11.3524 13.7631 10.945C13.9603 10.5376 14.0669 10.0923 14.0755 9.63977C14.0669 9.18705 13.9608 8.74151 13.7644 8.33349C13.5681 7.92547 13.2861 7.56456 12.9377 7.27533L12.8888 7.25311C12.7866 7.16866 12.7022 7.09755 12.6133 7.03089C12.5244 6.96422 12.4133 6.90644 12.2933 6.83533C11.8858 6.59399 11.4413 6.42132 10.9777 6.32422Z"
      fill="white"
    />
  </svg>
);

const toConstant = ({ typeSocial, typeRoom, typeMessage }) => ({
  typeSocial: typeSocial ? typeSocial : TYPE_ROOM_WIDGET.CHATALL,
  typeRoom: typeRoom ? typeRoom : TYPE_ROOM_WIDGET.WAITING,
  typeMessage: typeMessage ? typeMessage : TYPE_ROOM_WIDGET.CHATALL,
});
class NavbarWeb extends React.Component {
  searchInput = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      rooms: [],
      roomsOffline: [],
      statusBot: [],
      // statusLivechat: 'available',
      roomInfo: [],
      userInfo: null,
      roomSearchs: [],
      valueSearch: '',
      skip: 1,
      loadingInit: false,
      loading: false,
      hasMore: true,
      activeButton: 'l',
      week: [],
      visibleSwitch: true,
      visibleSwitchSetting: true,
      visible: false,
      visibleSearch: false,
      activeRoomLock: false,
      notification: null,
      totalRoom: 0,
      subscriptions: null,
      notificationSubscription: null,
      selectedSocial: this.props.typeSocial,
      selectedTypeMessage: this.props.typeMessage,
      selectedPage: 'ALL',
      listPageSubscribe: [],
      chatFacebook: false,
      chatZalo: false,
      chatLivechat: false,
    };
  }
  componentDidMount = () => {
    if (this.props.userInfo.permissions) {
      const { permissions } = this.props.userInfo;
      this.setState({
        chatFacebook: checkPermission(permissions, OMNI_CHAT_INBOUND.chatChannelFacebook),
        chatZalo: checkPermission(permissions, OMNI_CHAT_INBOUND.chatChannelZalo),
        chatLivechat: checkPermission(permissions, OMNI_CHAT_INBOUND.chatChannelLivechat),
      });
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.userInfo.permissions !== this.props.userInfo.permissions) {
      this.setState({
        chatFacebook: checkPermission(permissions, OMNI_CHAT_INBOUND.chatChannelFacebook),
        chatZalo: checkPermission(permissions, OMNI_CHAT_INBOUND.chatChannelZalo),
        chatLivechat: checkPermission(permissions, OMNI_CHAT_INBOUND.chatChannelLivechat),
      });
    }
  }
  componentWillMount() {
    this.dateWeek();

    if (true) {
      this.fetchDataRoom({
        callback: this.handleUpdateRoomFetch,
        offset: 0,
        typeRoom: this.props.typeRoom,
        typeSocial: this.props.typeSocial,
        typeMessage: this.props.typeMessage,
      });
    }
  }

  fetchDataRoom = ({ callback, offset, typeSocial, typeRoom, typeMessage, pageId }) => {
    const type =
      typeSocial === TYPE_ROOM_WIDGET.ZALO ||
      typeSocial === TYPE_ROOM_WIDGET.FACEBOOK ||
      typeSocial === TYPE_ROOM_WIDGET.LIVECHAT_ONLINE
        ? typeSocial
        : '';
    const page = pageId === 'ALL' ? '' : pageId;
    this.props.dispatch({
      type: 'rocketChat/getListRoom',
      payload: {
        params: {
          status: typeRoom,
          filter: typeMessage,
          type: type,
          pageId: page,
        },
        callback,
      },
      headers: {
        Authorization: this.props.authorization,
      },
    });
  };

  fetchDataRoomLiveChatClose = (callback, offset) => {
    reqwest({
      url: `${process.env.REACT_APP_URL_ROCKETCHAT}/api/v1/livechat/rooms?agents[]=${this.props.userId}&open=false&sort={"lm":-1}&count=100&offset=${offset}`,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      headers: {
        'X-Auth-Token': this.props.authToken,
        'X-User-Id': this.props.userId,
      },
      success: (res) => {
        callback(res.rooms);
      },
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.notification) {
      this.setState({ notification: JSON.parse(nextProps.notification) });
    }

    if (nextProps.roomInfo !== undefined) {
      this.setState({ roomInfo: nextProps.roomInfo });
    } else {
      this.setState({ roomInfo: null });
    }
    if (!_.isEmpty(nextProps.listSubscription)) {
      this.setState({ subscriptions: JSON.parse(nextProps.listSubscription) });
    }
    if (!_.isEmpty(nextProps.listRoom)) {
      this.setState({ rooms: JSON.parse(nextProps.listRoom) });
    }
    if (!_.isEmpty(nextProps.userInfo)) {
      this.setState({ userInfo: nextProps.userInfo });
    }
    if (_.isEmpty(nextProps.listRoom)) {
      this.setState({ rooms: [] });
    }
    // if (!_.isEmpty(nextProps.listRoomSearch) && this.searchInput?.current?.state?.value) {
    //   this.setState({ rooms: JSON.parse(nextProps.listRoomSearch) });
    // }
    // if (_.isEmpty(nextProps.listRoomSearch) && this.searchInput?.current?.state?.value) {
    //   this.setState({ rooms: [] });
    // }
    if (!_.isEmpty(nextProps.listRoomOffline)) {
      this.setState({ roomsOffline: JSON.parse(nextProps.listRoomOffline) });
    }
    if (nextProps.groupFile && nextProps.groupFile !== this.state.groupFile) {
      this.setState({ groupFile: nextProps.groupFile });
    }

    if (nextProps.notificationSubscription) {
      this.setState({ notificationSubscription: JSON.parse(nextProps.notificationSubscription) });
    }
  }

  formatDate = (date) => {
    const dateNow = new Date();
    if (date.toDateString() !== dateNow.toDateString()) {
      return this.converDate(date);
    }
    const hours = date.getHours();
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    const strTime = `${hours}:${minutes}`;
    return strTime;
  };

  converDate = (time) => {
    const inWeek = this.state.week.findIndex((value) => value === time.toDateString());
    if (inWeek > -1) {
      // eslint-disable-next-line default-case
      switch (inWeek) {
        case 0:
          return 'Th2';
        case 1:
          return 'Th3';
        case 2:
          return 'Th4';
        case 3:
          return 'Th5';
        case 4:
          return 'Th6';
        case 5:
          return 'Th7';
        case 6:
          return 'CN';
      }
    }
    if (typeof time === 'object') {
      return `${time.getDate() / 10 >= 1 ? time.getDate() : `0${time.getDate()}`}/${
        (time.getMonth() + 1) / 10 >= 1 ? time.getMonth() + 1 : `0${time.getMonth() + 1}`
      }/${time.getFullYear()}`;
    }
    return '';
  };

  dateWeek = () => {
    const curr = new Date();
    for (let i = 1; i <= 7; i++) {
      const first = curr.getDate() - curr.getDay() + i;
      const day = new Date(curr.setDate(first)).toDateString();
      this.state.week.push(day);
    }
  };

  onChangeswitch = (value) => {
    this.setState({ visibleSwitch: value });
  };

  onChangeSwitchSetting = (value) => {
    this.setState({ visibleSwitchSetting: value });
  };

  onSearch = (e) => {
    this.props.dispatch({
      type: 'rocketChat/searchRoomWeb',
      payload: {
        searchValue: e.trim(),
      },
      headers: {
        Authorization: this.props.authorization,
      },
    });
  };

  onCancelSearch = (fetch) => {
    this.searchInput?.current?.value?.reset();
    this.setState({ visibleSearch: false });
    if (fetch) {
      this.fetchDataRoom({
        callback: this.handleUpdateRoomFetch,
        offset: 0,
        typeRoom: this.props.typeRoom,
        typeSocial: this.props.typeSocial,
        typeMessage: this.props.typeMessage,
      });
    }
  };

  handleClickRoom = async (item, typeRoom) => {
    if (!this.props.roomInfo || (this.props.roomInfo && item.id !== this.state.roomInfo.id)) {
      // await this.props.resetListMessage();
      await this.props.dispatch({
        type: 'rocketChat/resetListMessage',
      });
      this.props.dispatch({
        type: 'rocketChat/getVisitorsInfo2',
        payload: {
          id: item.senderId,
        },
      });
      this.props.dispatch({
        type: 'rocketChat/getCustomerInfo',
        payload: {
          phone: item.customFields.dataInfoDto.phone,
        },
      });
      this.props.dispatch({
        type: 'rocketChat/getFiles',
        payload: {
          roomId: item?.id,
        },
      });
      this.props.dispatch({
        type: 'rocketChat/getImageVideo',
        payload: {
          roomId: item?.id,
        },
      });
      this.props.dispatch({
        type: 'rocketChat/setRoomInfo',
        payload: {
          data: item,
        },
      });
      await this.props.dispatch({
        type: 'rocketChat/loadHistory',
        payload: {
          params: {
            roomId: item.id,
            conversationId: item.conversationId,
            limit: 30,
          },
        },
        headers: {
          Authorization: this.props.authorization,
        },
      });

      if (this.checkUnRead(item.id)) {
        // this.props.subscriptionRead({
        //     roomId: item.id,
        // });
        this.props.dispatch({
          type: 'rocketChat/getSubscriptionsRead',
          payload: {
            params: { roomId: item.id },
          },
        });
      }
      await this.props.handleStatusScroll(false);
      if (item.t === 'l') {
        // this.props.getChannelFile(item.id);
        // this.props.dispatch({
        //   type: 'rocketChat/getChannelFile',
        //   payload: {
        //     roomId: item.id,
        //   },
        // });
        // this.props.getCmVisitorsInfo({ params: { userid: item.v.id } });
        // this.props.dispatch({
        //   type: 'rocketChat/getCmVisitorInfo',
        //   payload: {
        //     params: { user_id: item.senderId },
        //   },
        // });
        // this.props.getVisitorsInfo({ id: item.v.id });
        // this.props.dispatch({
        //   type: 'rocketChat/getVisitorsInfo',
        //   payload: {
        //     id: item.senderId,
        //   },
        // });
      } else {
        // this.props.getGroupFile(item.id);
        // this.props.dispatch({
        //   type: 'rocketChat/getGroupFile',
        //   payload: {
        //     roomId: item.id,
        //   },
        // });
        // this.props.getCmVisitorsInfo({ params: { user_id: item.customFields.id } });
        // this.props.dispatch({
        //   type: 'rocketChat/getCmVisitorInfo',
        //   payload: {
        //     params: { user_id: item.customFields.id },
        //   },
        // });
      }
    }
  };

  handleClickReceive = async (item, index, typeSocial, typeRoom) => {
    // await this.props.receiveTransition({
    //     options: { roomId: item.id, userName: this.props.userInfo.username }
    // })
    await this.props.dispatch({
      type: 'rocketChat/receive',
      payload: {
        params: {
          roomId: item.id,
        },
        data: {
          username: this.props.userInfo.username,
          id: this.props.userInfo.id,
          avatar: `https://oncx-omnichat.fptdata.com/avatar/${this.props.userInfo.username}`,
        },
      },
      headers: {
        Authorization: this.props.authorization,
      },
    });
    const rooms = await this.removeRoom(this.state.rooms, item);
    // await this.props.updateListRoom({ data: JSON.stringify(rooms), typeSocial: typeSocial, typeRoom: typeRoom });
    await this.props.dispatch({
      type: 'rocketChat/updateListRoomCompleted',
      payload: {
        data: JSON.stringify(rooms),
        // typeSocial: typeSocial || TYPE_ROOM_WIDGET.CHATALL,
        // typeRoom: typeRoom || TYPE_ROOM_WIDGET.WAITING,
        // // typeMessage: typeMessage || TYPE_ROOM_WIDGET.CHATALL,
        ...toConstant({ typeSocial, typeRoom }),
      },
    });
    if (this.checkUnRead(item.id)) {
      // await this.props.subscriptionRead({
      //     roomId: item.id,
      // });
      this.props.dispatch({
        type: 'rocketChat/getSubscriptionsRead',
        payload: {
          params: { roomId: item.id },
        },
      });
    }
  };
  handleClickReceiveTransition = async (item, index, typeSocial, typeRoom) => {
    // await this.props.receiveTransition({
    //     options: { roomId: item.id, userName: this.props.userInfo.username }
    // })
    await this.props.dispatch({
      type: 'rocketChat/receiveTransition',
      payload: {
        params: {
          roomId: item.id,
        },
        data: {
          username: this.props.userInfo.username,
          id: this.props.userInfo.id,
          avatar: `https://oncx-omnichat.fptdata.com/avatar/${this.props.userInfo.username}`,
        },
      },
      headers: {
        Authorization: this.props.authorization,
      },
    });
    const rooms = await this.removeRoom(this.state.rooms, item);
    // await this.props.updateListRoom({ data: JSON.stringify(rooms), typeSocial: typeSocial, typeRoom: typeRoom });
    await this.props.dispatch({
      type: 'rocketChat/updateListRoomCompleted',
      payload: {
        data: JSON.stringify(rooms),
        // typeSocial: typeSocial || TYPE_ROOM_WIDGET.CHATALL,
        // typeRoom: typeRoom || TYPE_ROOM_WIDGET.WAITING,
        // // typeMessage: typeMessage || TYPE_ROOM_WIDGET.CHATALL,
        ...toConstant({ typeSocial, typeRoom }),
      },
    });
    if (this.checkUnRead(item.id)) {
      // await this.props.subscriptionRead({
      //     roomId: item.id,
      // });
      this.props.dispatch({
        type: 'rocketChat/getSubscriptionsRead',
        payload: {
          params: { roomId: item.id },
        },
      });
    }
  };
  handleClickRejectTransition = async (item, index, typeSocial, typeRoom) => {
    // await this.props.rejectTransition({
    //     options: { roomId: item.id, userName: item.customFields.session.from }
    // })
    await this.props.dispatch({
      type: 'rocketChat/rejectTransition',
      payload: {
        params: {
          roomId: item.id,
        },
      },
      headers: {
        Authorization: this.props.authorization,
      },
    });
    const rooms = await this.removeRoom(this.state.rooms, item);
    // await this.props.updateListRoom({ data: JSON.stringify(rooms), typeSocial: typeSocial, typeRoom: typeRoom });
    await this.props.dispatch({
      type: 'rocketChat/updateListRoomCompleted',
      payload: {
        data: JSON.stringify(rooms),
        // typeSocial: typeSocial || TYPE_ROOM_WIDGET.CHATALL,
        // typeRoom: typeRoom || TYPE_ROOM_WIDGET.WAITING,
        // // typeMessage: typeMessage || TYPE_ROOM_WIDGET.CHATALL,
        ...toConstant({ typeSocial, typeRoom }),
      },
    });
  };

  removeRoom = (listRoom, data) => {
    const checkRoom = _.findIndex(listRoom, { id: data.id });
    if (checkRoom > -1) {
      listRoom.splice(checkRoom, 1);
      if (listRoom && listRoom.length > 0) {
        this.handleUpdateRoomFetch({
          rooms: listRoom,
          typeRoom: this.props.typeRoom,
          typeSocial: this.state.selectedSocial,
          typeMessage: this.state.selectedTypeMessage,
        });
      }
      return listRoom;
    }
  };

  handleClickRoomOffline = (item, index) => {
    this.props.getRoomInfoOffline(item);
    this.props.handleStatusScroll(false);
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleOpenSetting = () => {
    this.setState({ visible: true });
  };

  handleLockRoom = async () => {
    if (!this.props.activeRoomLock) {
      await this.props.handleActiveRoomLock(true);
      await this.setState({
        ...this.state,
        skip: 1,
        hasMore: true,
        rooms: [],
      });
      // await this.props.getListRoom({ typeRoom: "l", open: false });
      this.props.dispatch({
        type: 'rocketChat/getListRoom',
        payload: {
          typeRoom: 'l',
          skip: skip || 0,
          userId: userId || '',
          authToken: authToken || '',
          open: false,
        },
      });
      await this.props.handleActiveRooom(-1);
    } else {
      await this.props.handleActiveRoomLock(false);
      await this.setState({
        ...this.state,
        skip: 1,
        hasMore: true,
        rooms: [],
      });
      // await this.props.getListRoom({ typeRoom: "l", open: true });
      this.props.dispatch({
        type: 'rocketChat/getListRoom',
        payload: {
          typeRoom: 'l',
          skip: skip || 0,
          userId: userId || '',
          authToken: authToken || '',
          open: true,
        },
      });
      await this.props.handleActiveRooom(-1);
    }
  };

  handleInfiniteOnLoad = () => {
    let { rooms } = this.state;
    this.setState({
      loading: true,
    });
    if (rooms.length >= this.props.maxLength) {
      this.setState({
        hasMore: false,
        loading: false,
      });
      return;
    }
    this.fetchData((res) => {
      if (res.status && res.length > 0) {
        rooms = rooms.concat(res.message.reverse());
        // this.props.updateListRoom(JSON.stringify(rooms))
        this.props.dispatch({
          type: 'rocketChat/updateListRoomCompleted',
          payload: {
            data: JSON.stringify(rooms),
            // typeSocial: typeSocial || TYPE_ROOM_WIDGET.CHATALL,
            // typeRoom: typeRoom || TYPE_ROOM_WIDGET.WAITING,
            // typeMessage: typeMessage || TYPE_ROOM_WIDGET.CHATALL,
            ...toConstant({}),
          },
        });
        this.setState({
          rooms,
          loading: false,
          skip: this.state.skip + 1,
        });
      }
    });
  };

  handleChangeTypeRoom = (value) => {
    this.setState({
      skip: 1,
      loadingInit: false,
      loading: false,
      hasMore: true,
      valueSearch: '',
    });
    const selectedTypeMessage =
      value === TYPE_ROOM_WIDGET.RECEIVED ? TYPE_ROOM_WIDGET.PROCESSING : TYPE_ROOM_WIDGET.ALL;
    this.setState({
      selectedTypeMessage,
      selectedSocial: TYPE_ROOM_WIDGET.CHATALL,
    });
    // this.setState({ selectedPage: 'ALL' });
    this.onCancelSearch(false);
    // this.props.updateListRoom({ data: null, typeRoom: value, typeSocial: TYPE_ROOM_WIDGET.CHATALL, typeMessage: selectedTypeMessage });
    this.props.dispatch({
      type: 'rocketChat/updateListRoomCompleted',
      payload: {
        data: null,
        // typeSocial: TYPE_ROOM_WIDGET.CHATALL,
        // typeRoom: value || TYPE_ROOM_WIDGET.WAITING,
        // typeMessage: selectedTypeMessage || TYPE_ROOM_WIDGET.CHATALL,
        ...toConstant({
          typeSocial: TYPE_ROOM_WIDGET.CHATALL,
          typeRoom: value,
          typeMessage: selectedTypeMessage,
        }),
      },
    });
    // this.props.resetListMessage();
    this.props.dispatch({
      type: 'rocketChat/resetListMessage',
    });
    this.fetchDataRoom({
      callback: this.handleUpdateRoomFetch,
      offset: 0,
      typeSocial: TYPE_ROOM_WIDGET.CHATALL,
      typeRoom: value,
      typeMessage: selectedTypeMessage,
    });
    // this.props.getListSubscription();
    // this.props.dispatch({
    //   type: 'rocketChat/getListSubscription',
    // });
    this.props.handleChangeTypeRoom(value);
    this.props.handleChangeTypeMessage(selectedTypeMessage);
  };

  checkUnRead = (roomId) => {
    const { subscriptions } = this.state;
    let checkRoom = [];
    if (subscriptions && subscriptions.length > 0) {
      checkRoom = subscriptions.filter((value) => value.rid === roomId);
      if (checkRoom && checkRoom.length > 0 && checkRoom[0].alert) {
        return true;
      }
      return false;
    }
    return false;
  };

  handleOnchangePage = (value) => {
    const { typeRoom, typeMessage } = this.props;
    this.setState({ selectedPage: value });
    this.fetchDataRoom({
      callback: this.handleUpdateRoomFetch,
      offset: 0,
      typeSocial: TYPE_ROOM_WIDGET.FACEBOOK,
      typeRoom,
      typeMessage,
      pageId: value,
    });
  };
  handleOnchangeSelect = (value) => {
    const { typeRoom } = this.props;
    this.props.handleChangeTypeSocial(TYPE_ROOM_WIDGET.CHATALL);
    this.props.handleChangeTypeMessage(value);
    this.setState({ selectedTypeMessage: value, selectedSocial: TYPE_ROOM_WIDGET.CHATALL });
    // if (typeRoom === TYPE_ROOM_WIDGET.RECEIVED) {
    this.setState({ selectedPage: 'ALL' });

    this.setState({
      skip: 1,
      loadingInit: false,
      loading: false,
      hasMore: true,
    });
    // this.props.updateListRoom({ data: null, typeSocial: TYPE_ROOM_WIDGET.CHATALL, typeRoom, typeMessage: value });
    // this.props.dispatch({
    //   type: 'rocketChat/updateListRoomCompleted',
    //   payload: {
    //     data: null,
    //     // typeSocial: TYPE_ROOM_WIDGET.CHATALL,
    //     // typeRoom: typeRoom || TYPE_ROOM_WIDGET.WAITING,
    //     // typeMessage: value || TYPE_ROOM_WIDGET.CHATALL,
    //     ...toConstant({
    //       typeSocial: TYPE_ROOM_WIDGET.CHATALL,
    //       typeRoom: typeRoom,
    //       typeMessage: value,
    //     }),
    //   },
    // });
    // // }
    this.fetchDataRoom({
      callback: this.handleUpdateRoomFetch,
      offset: 0,
      typeSocial: TYPE_ROOM_WIDGET.CHATALL,
      typeRoom,
      typeMessage: value,
    });
  };

  handleUpdateRoomFetch = async ({ rooms, typeSocial, typeMessage, typeRoom }) => {
    // await this.props.updateListRoom({ data: JSON.stringify(rooms), typeSocial, typeRoom, typeMessage });
    await this.props.dispatch({
      type: 'rocketChat/updateListRoomCompleted',
      payload: {
        data: JSON.stringify(rooms),
        ...toConstant({ typeSocial, typeRoom, typeMessage }),
      },
    });
    await this.setState({
      loadingInit: true,
    });
    if (rooms && rooms.length > 0) {
      const room = rooms[0];
      await this.props.dispatch({
        type: 'rocketChat/resetListMessage',
      });
      this.props.dispatch({
        type: 'rocketChat/getVisitorsInfo2',
        payload: {
          id: room.senderId,
        },
      });
      this.props.dispatch({
        type: 'rocketChat/getCustomerInfo',
        payload: {
          phone: room.customFields.dataInfoDto.phone,
        },
      });
      this.props.dispatch({
        type: 'rocketChat/getFiles',
        payload: {
          roomId: room?.id,
        },
      });
      this.props.dispatch({
        type: 'rocketChat/getImageVideo',
        payload: {
          roomId: room?.id,
        },
      });
      this.props.dispatch({
        type: 'rocketChat/setRoomInfo',
        payload: {
          data: room,
        },
      });
      await this.props.dispatch({
        type: 'rocketChat/loadHistory',
        payload: {
          params: {
            roomId: room.id,
            conversationId: room.conversationId,
            limit: 30,
          },
        },
        headers: {
          Authorization: this.props.authorization,
        },
      });

      await this.props.handleStatusScroll(false);
    }
  };

  handleChangeTag = async (tag, checked) => {
    const { selectedTypeMessage } = this.state;
    const { typeRoom } = this.props;
    const selectedSocial = checked ? tag : TYPE_ROOM_WIDGET.CHATALL;
    if (selectedSocial === TYPE_ROOM_WIDGET.FACEBOOK) {
      const headers = {
        Authorization: this.props.authorization,
      };
      const res = await requestGetListPageFacebookSubcribe(headers);
      if (res.code === 200) {
        this.setState({ listPageSubscribe: res.response.data });
      }
    }
    if (
      !(
        // (typeRoom === TYPE_ROOM_WIDGET.WAITING && tag === TYPE_ROOM_WIDGET.LIVECHAT_ONLINE) ||
        (selectedTypeMessage === TYPE_ROOM_WIDGET.FORWARD_MESSENGE)
      )
    ) {
      this.setState({ selectedSocial });
      this.setState({
        skip: 1,
        loadingInit: false,
        loading: false,
        hasMore: true,
      });
      this.props.handleChangeTypeSocial(selectedSocial);
      // this.props.updateListRoom({ data: null, typeSocial: selectedSocial, typeRoom: typeRoom, typeMessage: selectedTypeMessage });
      this.props.dispatch({
        type: 'rocketChat/updateListRoomCompleted',
        payload: {
          data: null,
          // typeSocial: selectedSocial || TYPE_ROOM_WIDGET.CHATALL,
          // typeRoom: typeRoom || TYPE_ROOM_WIDGET.WAITING,
          // typeMessage: selectedTypeMessage || TYPE_ROOM_WIDGET.CHATALL,
          ...toConstant({
            typeSocial: selectedSocial,
            typeRoom: typeRoom,
            typeMessage: selectedTypeMessage,
          }),
        },
      });
      // this.props.resetListMessage();
      this.props.dispatch({
        type: 'rocketChat/resetListMessage',
      });
      const params = {
        callback: this.handleUpdateRoomFetch,
        offset: 0,
        typeSocial: selectedSocial,
        typeRoom,
        typeMessage: selectedTypeMessage,
        pageId: this.state.selectedPage,
      };
      !(selectedSocial === TYPE_ROOM_WIDGET.FACEBOOK) && delete params.pageId;
      this.fetchDataRoom(params);
      // this.fetchDataRoom(this.handleUpdateRoomFetch, 0, selectedSocial, typeRoom, selectedTypeMessage);
    }
  };

  _renderListItem = ({ item, typeRoom, typeSocial, roomInfo, index, userInfo }) => {
    return (
      <List.Item
        id={`room-${item.id}`}
        onClick={() => this.handleClickRoom(item, typeRoom)}
        className={roomInfo && item.id === roomInfo.id ? 'room-item active' : 'room-item'}
        key={item.id + index}
      >
        <Col>
          {item.customFields && item.customFields.dataInfoDto.profilePic ? (
            <Badge
              offset={[0, 32]}
              count={
                <img
                  src={
                    item.type === 'FACEBOOK'
                      ? IconMessenger15x15
                      : item.type === 'ZALO'
                      ? IconZalo16x16
                      : IconLiveChat16x16
                  }
                  className="icon-social-avatar"
                />
              }
            >
              <Avatar
                size={40}
                src={item.customFields?.dataInfoDto?.profilePic}
                alt={item?.customFields?.dataInfoDto?.name}
              ></Avatar>
            </Badge>
          ) : (
            <Badge
              offset={[0, 32]}
              count={
                <img
                  src={
                    item.type === 'FACEBOOK'
                      ? IconMessenger15x15
                      : item.type === 'ZALO'
                      ? IconZalo16x16
                      : IconLiveChat16x16
                  }
                  className="icon-social-avatar"
                />
              }
            >
              <Avatar
                size={40}
                style={{
                  backgroundColor: `#${Math.floor(
                    item.customFields.dataInfoDto.name.charCodeAt(0) * 50000,
                  ).toString(16)}`,
                }}
              >
                {item.customFields.dataInfoDto.name.split(' ')[0].length < 8
                  ? item.customFields.dataInfoDto.name.split(' ')[0]
                  : item.customFields.dataInfoDto.name.split(' ')[0].slice(0, 8)}
              </Avatar>
            </Badge>
          )}
        </Col>
        <Col style={{ textAlign: 'left !important', paddingLeft: 10 }} span={21}>
          <Row justify="space-between">
            <Row>
              <Col style={{ alignSelf: 'center' }}>
                <Typography.Paragraph className="room-name" ellipsis={true}>
                  {item.customFields &&
                  item.customFields.dataInfoDto &&
                  item.customFields.dataInfoDto.name
                    ? item.customFields.dataInfoDto.name
                    : item.customFields &&
                      item.customFields.dataZalo &&
                      item.customFields.dataZalo.display_name
                    ? item.customFields.dataZalo.display_name
                    : item.fname}
                </Typography.Paragraph>
              </Col>
              <Col style={{ alignSelf: 'center' }} className="user-status">
                <Badge status="success" />
              </Col>
            </Row>
            <Col className="time-conversation-child">
              <div className="time-item-conversation">
                {' '}
                {item?.lastMessage?.timestamp
                  ? this.formatDate(new Date(item?.lastMessage?.timestamp))
                  : item.actionRoomDtos?.length > 0
                  ? this.formatDate(new Date(item.actionRoomDtos[0].timestamp))
                  : this.formatDate(new Date(item?.createdDate))}
              </div>
            </Col>
          </Row>
          <Row>
            {item?.pageInfo?.pageId !== 'livechat' && (
              <div className="page-wrapper">
                {/* <div className="page-avt" /> */}
                <Avatar size={15} src={item?.pageInfo?.avatarUrl} />
                <div className="text-page-name">{item?.pageInfo?.pageName}</div>
              </div>
            )}
          </Row>
          <Row align="middle center" justify="space-between">
            <Col style={{ display: 'inline-flex' }}>
              {item.forward !== null ? (
                <div className="icon-last-message">
                  <img src={RightArrow} />
                </div>
              ) : (
                <div className="icon-last-message">
                  <img src={IconArrow} />
                </div>
              )}
              <div>
                <Typography.Paragraph className="room-last-message" ellipsis={true}>
                  {' '}
                  {item?.lastMessage ? item?.lastMessage.text : 'Bạn có tin nhắn mới'}
                </Typography.Paragraph>
              </div>
            </Col>

            <Col>
              {this.checkUnRead(item._id) ? (
                <div
                  style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#FF4D4F' }}
                />
              ) : null}
            </Col>
          </Row>
          {typeRoom === TYPE_ROOM_WIDGET.WAITING ? (
            <Row>
              <Button
                id={`btn-receive-${item.id}`}
                onClick={
                  item.forward === null
                    ? () => this.handleClickReceive(item, index, typeSocial, typeRoom)
                    : () => this.handleClickReceiveTransition(item, index, typeSocial, typeRoom)
                }
                className="room-button-accept"
              >
                Chấp nhận
              </Button>
              {userInfo &&
                item.forward &&
                item.forward.status === true &&
                item.forward.to === userInfo.username && (
                  <Button
                    id={`btn-reject-${item.id}`}
                    onClick={() =>
                      this.handleClickRejectTransition(item, index, typeSocial, typeRoom)
                    }
                    className="room-button-cancel"
                  >
                    Từ chối
                  </Button>
                )}
            </Row>
          ) : null}
        </Col>
        {/* <Col span={4} className={'time-conversation-child'}>
          <div name="time-item-conversation">
            {' '}
            {this.formatDate(
              new Date(
                typeof item.createdDate === 'object'
                  ? item.createdDate.$date
                  : item.createdDate || item.lastMessage.timestamp,
              ),
            )}
          </div>
          <div>
            {this.checkUnRead(item.id) ? (
              <Button
                type="primary"
                style={{ width: 10, minWidth: 10, height: 10, color: '#365DFE' }}
                shape="circle"
              >
                <p></p>
              </Button>
            ) : null}
          </div>
        </Col> */}
      </List.Item>
    );
  };

  render() {
    const {
      rooms,
      subscriptions,
      roomsOffline,
      notification,
      roomInfo,
      selectedSocial,
      selectedTypeMessage,
      visibleSearch,
      valueSearch,
    } = this.state;
    const { userInfo, typeSocial, typeRoom } = this.props;
    // const { statusLivechat } = this.props.websocket;
    const loader = (
      <LoadingOutlined
        style={{ padding: '30px', position: 'relative', display: 'block', fontSize: '30px' }}
      />
    );
    return (
      <>
        <Sider theme="light" className="sider-navbar">
          <div className="header-navbar">
            {!visibleSearch ? (
              <Row className="header-navbar-row">
                <Col span={18}>
                  {typeRoom === TYPE_ROOM_WIDGET.RECEIVED ? (
                    <Select
                      className="header-navbar-select"
                      value={selectedTypeMessage}
                      onChange={this.handleOnchangeSelect}
                    >
                      {/* <Option value={TYPE_ROOM_WIDGET.ALL}>Tất cả</Option> */}
                      <Option value={TYPE_ROOM_WIDGET.PROCESSING}>Tin đang giải quyết </Option>
                      {typeSocial !== TYPE_ROOM_WIDGET.LIVECHAT_ONLINE ? (
                        <Option value={TYPE_ROOM_WIDGET.IS_FORWARDED}>Tin chuyển tiếp</Option>
                      ) : null}
                      <Option value={TYPE_ROOM_WIDGET.RESOLVED}>Tin đã hoàn thành</Option>
                    </Select>
                  ) : (
                    <Select
                      className="header-navbar-select"
                      value={selectedTypeMessage}
                      onChange={this.handleOnchangeSelect}
                    >
                      <Option value={TYPE_ROOM_WIDGET.ALL}>Tất cả</Option>
                      <Option value={TYPE_ROOM_WIDGET.NEW}>Tin nhắn mới </Option>
                      <Option value={TYPE_ROOM_WIDGET.IS_FORWARDED}>Tin được chuyển tiếp</Option>
                      <Option value={TYPE_ROOM_WIDGET.OFFLINE}>Tin nhắn livechat offline</Option>
                    </Select>
                  )}
                </Col>
                <Col span={3}>
                  <Button
                    id="header-navbar-button-search"
                    className="header-navbar-button"
                    onClick={() => this.setState({ visibleSearch: true })}
                    icon={<SearchOutlined />}
                  ></Button>
                </Col>
                {/* <Col span={3}>
                  <Button
                    id="header-navbar-button-setting"
                    className="header-navbar-button"
                    onClick={this.handleOpenSetting}
                    icon={<SettingOutlined />}
                  ></Button>
                </Col> */}
              </Row>
            ) : (
              <Row className="header-navbar-row">
                <Col span={24}>
                  <Input.Search
                    ref={this.searchInput}
                    className="header-navbar-input-search"
                    onSearch={this.onSearch}
                    allowClear
                    enterButton
                  />
                  <Button
                    id="header-navbar-button-close"
                    className="header-navbar-button"
                    onClick={() => this.onCancelSearch(true)}
                  >
                    Hủy
                  </Button>
                </Col>
              </Row>
            )}
          </div>
          {!visibleSearch ? (
            <div className="content-navbar">
              <Row className="tags-navbar">
                {this.state.chatFacebook && (
                  <Col>
                    <CheckableTag
                      key={TYPE_ROOM_WIDGET.FACEBOOK}
                      checked={selectedSocial === TYPE_ROOM_WIDGET.FACEBOOK}
                      onChange={(checked) =>
                        this.handleChangeTag(TYPE_ROOM_WIDGET.FACEBOOK, checked)
                      }
                    >
                      <Icon className="icon-tags-navbar" component={IconMesssage} />
                      <span className="title-tags-navbar">Messenger</span>
                    </CheckableTag>
                  </Col>
                )}
                {this.state.chatZalo && (
                  <Col>
                    <CheckableTag
                      key={TYPE_ROOM_WIDGET.ZALO}
                      checked={selectedSocial === TYPE_ROOM_WIDGET.ZALO}
                      onChange={(checked) => this.handleChangeTag(TYPE_ROOM_WIDGET.ZALO, checked)}
                    >
                      <Icon className="icon-tags-navbar" component={IconZalo} />
                      <span className="title-tags-navbar">Zalo</span>
                    </CheckableTag>
                  </Col>
                )}
                {this.state.chatLivechat && (
                  <Col>
                    <CheckableTag
                      key={TYPE_ROOM_WIDGET.ZALO}
                      // className={typeRoom === TYPE_ROOM_WIDGET.WAITING ? 'tags-navbar-disable' : ''}
                      checked={selectedSocial === TYPE_ROOM_WIDGET.LIVECHAT_ONLINE}
                      onChange={(checked) =>
                        this.handleChangeTag(TYPE_ROOM_WIDGET.LIVECHAT_ONLINE, checked)
                      }
                    >
                      <Icon className="icon-tags-navbar" component={IconLiveChat} />
                      <span className="title-tags-navbar">LiveChat</span>
                    </CheckableTag>
                  </Col>
                )}
              </Row>
            </div>
          ) : null}
          {this.state.selectedSocial === TYPE_ROOM_WIDGET.FACEBOOK && (
            <div className="content-navbar" style={{ width: '100%' }}>
              <Select
                className={'my-select'}
                style={{ width: '100%' }}
                value={this.state.selectedPage}
                onChange={this.handleOnchangePage}
                bordered
              >
                <Option value={'ALL'}>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <Avatar.Group maxCount={2} size={28}>
                      {this.state.listPageSubscribe.map(
                        (item) =>
                          item.name &&
                          item.avatarUrl &&
                          item.pageId && <Avatar src={item.avatarUrl} />,
                      )}
                    </Avatar.Group>
                    <span style={{ marginLeft: '5px', fontWeight: 'bold' }}>Tất cả fanpage</span>
                  </div>
                </Option>
                {this.state.listPageSubscribe.map(
                  (item) =>
                    item.name &&
                    item.avatarUrl &&
                    item.pageId && (
                      <Option value={item.pageId}>
                        <div>
                          <Avatar size={28} src={item.avatarUrl} />
                          <span style={{ marginLeft: '5px', fontWeight: 'bold' }}>{item.name}</span>
                        </div>
                      </Option>
                    ),
                )}
              </Select>
            </div>
          )}
          <div
            className="sider-room"
            style={{
              height: !visibleSearch
                ? this.state.selectedSocial === TYPE_ROOM_WIDGET.FACEBOOK
                  ? '71%'
                  : '75%'
                : this.state.selectedSocial === TYPE_ROOM_WIDGET.FACEBOOK
                ? '76%'
                : '80%',
            }}
          >
            {/* {rooms.map((item,index) => <div>{item.id}</div> )} */}
            <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              loadMore={this.handleInfiniteOnLoad}
              hasMore={!this.state.loading && this.state.hasMore && rooms?.length > 0}
              useWindow={false}
              key="livechat"
            >
              <List>
                {rooms && rooms.length > 0
                  ? rooms.map((item, index) => {
                      if (typeRoom === TYPE_ROOM_WIDGET.WAITING) {
                        return this._renderListItem({
                          item,
                          typeSocial,
                          typeRoom,
                          roomInfo,
                          index,
                          userInfo,
                        });
                      }
                      if (typeRoom === TYPE_ROOM_WIDGET.RECEIVED) {
                        // return this._renderListItem({ item, typeSocial, typeRoom, roomInfo, index })

                        return this._renderListItem({
                          item,
                          typeSocial,
                          typeRoom,
                          roomInfo,
                          index,
                        });
                      }
                    })
                  : !this.state.loadingInit
                  ? loader
                  : ''}
              </List>
            </InfiniteScroll>
          </div>
          <div className="type-room">
            <Row className="type-room-row">
              <Col span={12} className="type-room-button">
                <Row justify="center">
                  <Badge count={this.props.waiting || 0} size="small" className="type-room-badge">
                    <Button
                      icon={<Icon component={IconMessageCircle} />}
                      id="btn-zalo"
                      onClick={() => this.handleChangeTypeRoom(TYPE_ROOM_WIDGET.WAITING)}
                      className={
                        this.props.typeRoom === TYPE_ROOM_WIDGET.WAITING
                          ? 'type-button active-button'
                          : 'type-button'
                      }
                    ></Button>
                  </Badge>
                </Row>
                <Row justify="center">
                  <Typography.Text
                    className={
                      this.props.typeRoom === TYPE_ROOM_WIDGET.WAITING
                        ? 'type-button active-button'
                        : 'type-button'
                    }
                  >
                    {' '}
                    Đang chờ
                  </Typography.Text>
                </Row>
              </Col>
              <Col span={12} className="type-room-button">
                <Row justify="center">
                  <Badge
                    count={this.props.processing || 0}
                    size="small"
                    className="type-room-badge"
                  >
                    <Button
                      icon={<Icon component={IconUserCircle} />}
                      id="btn-chat-all"
                      onClick={() => this.handleChangeTypeRoom(TYPE_ROOM_WIDGET.RECEIVED)}
                      className={
                        this.props.typeRoom === TYPE_ROOM_WIDGET.RECEIVED
                          ? 'type-button active-button'
                          : 'type-button'
                      }
                    ></Button>
                  </Badge>
                </Row>
                <Row justify="center">
                  <Typography.Text
                    className={
                      this.props.typeRoom === TYPE_ROOM_WIDGET.RECEIVED
                        ? 'type-button active-button'
                        : 'type-button'
                    }
                  >
                    Đã nhận
                  </Typography.Text>
                </Row>
              </Col>
            </Row>
          </div>
        </Sider>
        {/* <Modal
          visible={this.state.visible}
          wrapClassName="modal-setting"
          footer={null}
          forceRender={false}
          onCancel={() => this.handleCancel(false)}
          closeIcon={<CloseOutlined style={{ color: '#FFFFFF' }} />}
          title="Cấu hình"
        >
          <Row>
            <Col span={24} style={{ alignSelf: 'center', justifyContent: 'center' }}>
              <Switch
                size="small"
                className={
                  statusLivechat === 'available'
                    ? 'switch-chat switch-chat-enable'
                    : 'switch-chat switch-chat-disable'
                }
                checked={statusLivechat === 'available'}
                onChange={this.onChangeswitch}
              />
              <Typography.Text className="switch-chat-text"> Nhận chat LiveChat</Typography.Text>
            </Col>
          </Row>
        </Modal> */}
      </>
    );
  }
}

const mapStateToProps = ({ rocketChat, user }) => {
  return {
    authorization: user.tokenGateway,
    listRoom: rocketChat.listRoom,
    maxLength: rocketChat.maxLength,
    listRoomOffline: rocketChat.listRoomOffline,
    lengthRoomOffline: rocketChat.lengthRoomOffline,
    loading: rocketChat.loading,
    roomInfo: rocketChat.roomInfo,
    statusBot: rocketChat.statusBot,
    userInfo: user.currentUser,
    notification: rocketChat.notification,
    listSubscription: rocketChat.listSubscription,
    notificationSubscription: rocketChat.notificationSubscription,
    processing: rocketChat.processing,
    waiting: rocketChat.waiting,
  };
};

export default connect(mapStateToProps)(NavbarWeb);
