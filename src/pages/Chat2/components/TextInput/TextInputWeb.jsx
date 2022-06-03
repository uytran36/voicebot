/* eslint-disable react/prop-types */
/* eslint-disable lines-between-class-members */

import React from 'react';
import { connect } from 'umi';
import { bindActionCreators } from 'redux';
import reqwest from 'reqwest';
import Icon from '@ant-design/icons';
import { Button, Card, Image, Input, Layout, List, Modal, Space, Typography, Upload } from 'antd';
import { notification } from 'antd';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
// import {
//   actionUploadImageRoom,
//   actionSetText,
//   actionSendMessage,
//   actionSubscriptionRead,
//   actionGetGroupFile,
//   actionGetChannelFile,
// } from '../../actions/index';
import { openNotification } from '../../utils/notification';
import UtilModal from '../../utils/modal';
import { UPLOAD_IMAGE_ROOOM } from '../../constants/Api';
import * as TYPE_ROOM_WIDGET from '../../constants/TypeRoomWidget';

const { Footer } = Layout;
const { Dragger } = Upload;
const { Text } = Typography;
const CloseSvg = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.00004 1.3335C4.32404 1.3335 1.33337 4.32416 1.33337 8.00016C1.33337 11.6762 4.32404 14.6668 8.00004 14.6668C11.676 14.6668 14.6667 11.6762 14.6667 8.00016C14.6667 4.32416 11.676 1.3335 8.00004 1.3335Z"
      fill="#343943"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.52864 5.52876C5.78899 5.26841 6.2111 5.26841 6.47144 5.52876L8.00004 7.05735L9.52864 5.52876C9.78899 5.26841 10.2111 5.26841 10.4714 5.52876C10.7318 5.78911 10.7318 6.21122 10.4714 6.47157L8.94285 8.00016L10.4714 9.52875C10.7318 9.7891 10.7318 10.2112 10.4714 10.4716C10.2111 10.7319 9.78899 10.7319 9.52864 10.4716L8.00004 8.94297L6.47144 10.4716C6.2111 10.7319 5.78899 10.7319 5.52864 10.4716C5.26829 10.2112 5.26829 9.78911 5.52864 9.52876L7.05723 8.00016L5.52864 6.47157C5.26829 6.21122 5.26829 5.78911 5.52864 5.52876Z"
      fill="white"
    />
  </svg>
);
const AddSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19 11H13V5C13 4.447 12.552 4 12 4C11.448 4 11 4.447 11 5V11H5C4.448 11 4 11.447 4 12C4 12.553 4.448 13 5 13H11V19C11 19.553 11.448 20 12 20C12.552 20 13 19.553 13 19V13H19C19.552 13 20 12.553 20 12C20 11.447 19.552 11 19 11Z"
      fill="white"
    />
  </svg>
);
const AttactSvg = () => (
  <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.19569 13.0002C3.0917 13.0002 2.04236 12.5562 1.24103 11.7502C-0.350971 10.1482 -0.416305 7.60816 1.09503 6.0875L6.01903 1.13416C6.53169 0.618163 7.2237 0.333496 7.96703 0.333496C8.76236 0.333496 9.51836 0.652829 10.095 1.23283C11.2424 2.38683 11.2864 4.22083 10.1924 5.32083L5.26236 10.2735C4.94303 10.5955 4.51303 10.7722 4.05169 10.7722C3.56436 10.7722 3.10236 10.5775 2.7517 10.2248C2.0497 9.5175 2.0277 8.39016 2.70303 7.71016L7.25303 3.14016C7.51303 2.87883 7.93436 2.8775 8.19569 3.1375C8.45636 3.3975 8.4577 3.8195 8.19769 4.08016L3.64836 8.65083C3.48836 8.81216 3.51036 9.09683 3.6977 9.28483C3.79503 9.38283 3.92436 9.43883 4.05169 9.43883C4.12503 9.43883 4.23036 9.42083 4.31703 9.3335L9.24703 4.38083C9.82503 3.79883 9.78169 2.80883 9.14969 2.17283C8.54503 1.56483 7.51903 1.51683 6.96436 2.07416L2.04036 7.0275C1.04436 8.0295 1.1097 9.72683 2.18703 10.8102C2.7357 11.3628 3.44903 11.6668 4.19569 11.6668C4.86303 11.6668 5.4817 11.4148 5.93636 10.9575L10.861 6.00416C11.1204 5.7435 11.5424 5.7415 11.8037 6.0015C12.0644 6.2615 12.0657 6.68283 11.8064 6.94416L6.88169 11.8975C6.17503 12.6082 5.22103 13.0002 4.19569 13.0002Z"
      fill="#747783"
    />
  </svg>
);
const VideoSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="12" fill="white" />
    <path
      d="M17.2306 11.1318C17.9024 11.5157 17.9024 12.4843 17.2306 12.8682L9.74614 17.1451C9.07948 17.526 8.25 17.0446 8.25 16.2768L8.25 7.72318C8.25 6.95536 9.07948 6.47399 9.74614 6.85494L17.2306 11.1318Z"
      fill="#365DFE"
    />
  </svg>
);
const AttactInputSvg = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.7738 2.37098C11.0916 0.688839 8.35236 0.688839 6.672 2.37098L2.01129 7.02812C1.98093 7.05848 1.96486 7.09955 1.96486 7.14241C1.96486 7.18527 1.98093 7.22634 2.01129 7.2567L2.67022 7.91563C2.70034 7.94561 2.74111 7.96245 2.78361 7.96245C2.82611 7.96245 2.86688 7.94561 2.897 7.91563L7.55772 3.25848C8.13629 2.67991 8.90593 2.36205 9.72379 2.36205C10.5416 2.36205 11.3113 2.67991 11.8881 3.25848C12.4666 3.83705 12.7845 4.6067 12.7845 5.42277C12.7845 6.24062 12.4666 7.00848 11.8881 7.58705L7.13807 12.3353L6.36843 13.1049C5.64879 13.8246 4.47915 13.8246 3.7595 13.1049C3.41129 12.7567 3.22022 12.2942 3.22022 11.8013C3.22022 11.3085 3.41129 10.846 3.7595 10.4978L8.472 5.78705C8.59165 5.6692 8.74879 5.60313 8.91665 5.60313H8.91843C9.08629 5.60313 9.24164 5.6692 9.3595 5.78705C9.47915 5.9067 9.54343 6.06384 9.54343 6.2317C9.54343 6.39777 9.47736 6.55491 9.3595 6.67277L5.50772 10.521C5.47736 10.5513 5.46129 10.5924 5.46129 10.6353C5.46129 10.6781 5.47736 10.7192 5.50772 10.7496L6.16665 11.4085C6.19676 11.4385 6.23754 11.4553 6.28004 11.4553C6.32254 11.4553 6.36331 11.4385 6.39343 11.4085L10.2434 7.55848C10.5988 7.20312 10.7934 6.7317 10.7934 6.22991C10.7934 5.72813 10.597 5.25491 10.2434 4.90134C9.5095 4.16741 8.31665 4.1692 7.58272 4.90134L7.12557 5.36027L2.872 9.61205C2.58331 9.89905 2.35446 10.2405 2.19874 10.6166C2.04302 10.9928 1.96353 11.396 1.96486 11.8031C1.96486 12.6299 2.28807 13.4067 2.872 13.9906C3.47736 14.5942 4.27022 14.896 5.06307 14.896C5.85593 14.896 6.64879 14.5942 7.25236 13.9906L12.7738 8.47277C13.5863 7.65848 14.0363 6.57455 14.0363 5.42277C14.0381 4.2692 13.5881 3.18527 12.7738 2.37098Z"
      fill="#8C8C8C"
    />
  </svg>
);
const FileImageSvg = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0)">
      <path
        d="M8.73449 7.94821L7.3452 9.71964L6.61127 8.78393C6.59791 8.76686 6.58084 8.75305 6.56134 8.74355C6.54185 8.73405 6.52045 8.72912 6.49877 8.72912C6.47709 8.72912 6.45569 8.73405 6.4362 8.74355C6.41671 8.75305 6.39964 8.76686 6.38627 8.78393L4.60413 11.0554C4.58764 11.0764 4.57741 11.1017 4.57461 11.1283C4.57181 11.1549 4.57654 11.1817 4.58828 11.2057C4.60001 11.2298 4.61827 11.25 4.64097 11.2642C4.66367 11.2783 4.68989 11.2858 4.71663 11.2857H11.2863C11.4059 11.2857 11.472 11.1482 11.3988 11.0554L8.96127 7.94821C8.94773 7.93111 8.9305 7.9173 8.91086 7.9078C8.89122 7.8983 8.86969 7.89337 8.84788 7.89337C8.82607 7.89337 8.80454 7.8983 8.7849 7.9078C8.76526 7.9173 8.74803 7.93111 8.73449 7.94821ZM5.28627 6.75C5.28627 6.93944 5.36153 7.12112 5.49548 7.25508C5.62944 7.38903 5.81112 7.46429 6.00056 7.46429C6.19 7.46429 6.37168 7.38903 6.50563 7.25508C6.63959 7.12112 6.71484 6.93944 6.71484 6.75C6.71484 6.56056 6.63959 6.37888 6.50563 6.24492C6.37168 6.11097 6.19 6.03571 6.00056 6.03571C5.81112 6.03571 5.62944 6.11097 5.49548 6.24492C5.36153 6.37888 5.28627 6.56056 5.28627 6.75ZM14.1184 4.01071L10.2756 0.167857C10.1684 0.0607143 10.0238 0 9.87199 0H2.28627C1.9702 0 1.71484 0.255357 1.71484 0.571429V15.4286C1.71484 15.7446 1.9702 16 2.28627 16H13.7148C14.0309 16 14.2863 15.7446 14.2863 15.4286V4.41607C14.2863 4.26429 14.2256 4.11786 14.1184 4.01071ZM12.9684 4.67857H9.6077V1.31786L12.9684 4.67857ZM13.0006 14.7143H3.00056V1.28571H8.39342V5.14286C8.39342 5.34177 8.47243 5.53254 8.61309 5.67319C8.75374 5.81384 8.9445 5.89286 9.14342 5.89286H13.0006V14.7143Z"
        fill="#8C8C8C"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
const EmojiSvg = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0)">
      <path
        d="M4 6.375C4 6.60233 4.09031 6.82035 4.25105 6.98109C4.4118 7.14184 4.62981 7.23214 4.85714 7.23214C5.08447 7.23214 5.30249 7.14184 5.46323 6.98109C5.62398 6.82035 5.71429 6.60233 5.71429 6.375C5.71429 6.14767 5.62398 5.92965 5.46323 5.76891C5.30249 5.60816 5.08447 5.51786 4.85714 5.51786C4.62981 5.51786 4.4118 5.60816 4.25105 5.76891C4.09031 5.92965 4 6.14767 4 6.375ZM10.2857 6.375C10.2857 6.60233 10.376 6.82035 10.5368 6.98109C10.6975 7.14184 10.9155 7.23214 11.1429 7.23214C11.3702 7.23214 11.5882 7.14184 11.7489 6.98109C11.9097 6.82035 12 6.60233 12 6.375C12 6.14767 11.9097 5.92965 11.7489 5.76891C11.5882 5.60816 11.3702 5.51786 11.1429 5.51786C10.9155 5.51786 10.6975 5.60816 10.5368 5.76891C10.376 5.92965 10.2857 6.14767 10.2857 6.375ZM8 0C3.58214 0 0 3.58214 0 8C0 12.4179 3.58214 16 8 16C12.4179 16 16 12.4179 16 8C16 3.58214 12.4179 0 8 0ZM12.6964 12.6964C12.0857 13.3071 11.375 13.7857 10.5839 14.1214C9.76786 14.4679 8.89821 14.6429 8 14.6429C7.10179 14.6429 6.23214 14.4679 5.41429 14.1214C4.62441 13.7878 3.90693 13.3039 3.30179 12.6964C2.69107 12.0857 2.2125 11.375 1.87679 10.5839C1.53214 9.76786 1.35714 8.89821 1.35714 8C1.35714 7.10179 1.53214 6.23214 1.87857 5.41429C2.21216 4.62441 2.69614 3.90693 3.30357 3.30179C3.91429 2.69107 4.625 2.2125 5.41607 1.87679C6.23214 1.53214 7.10179 1.35714 8 1.35714C8.89821 1.35714 9.76786 1.53214 10.5857 1.87857C11.3756 2.21216 12.0931 2.69614 12.6982 3.30357C13.3089 3.91429 13.7875 4.625 14.1232 5.41607C14.4679 6.23214 14.6429 7.10179 14.6429 8C14.6429 8.89821 14.4679 9.76786 14.1214 10.5857C13.7882 11.3753 13.3042 12.0922 12.6964 12.6964ZM10.7143 8.375H9.85536C9.78036 8.375 9.71607 8.43214 9.71071 8.50714C9.64286 9.39107 8.90179 10.0893 8 10.0893C7.09821 10.0893 6.35536 9.39107 6.28929 8.50714C6.28393 8.43214 6.21964 8.375 6.14464 8.375H5.28571C5.26634 8.37498 5.24716 8.37889 5.22934 8.38652C5.21153 8.39414 5.19545 8.4053 5.18209 8.41933C5.16872 8.43337 5.15836 8.44997 5.15161 8.46814C5.14487 8.4863 5.14189 8.50565 5.14286 8.525C5.22143 10.0304 6.47321 11.2321 8 11.2321C9.52679 11.2321 10.7786 10.0304 10.8571 8.525C10.8581 8.50565 10.8551 8.4863 10.8484 8.46814C10.8416 8.44997 10.8313 8.43337 10.8179 8.41933C10.8046 8.4053 10.7885 8.39414 10.7707 8.38652C10.7528 8.37889 10.7337 8.37498 10.7143 8.375Z"
        fill="#8C8C8C"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
const SendSvg = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0.931248 0.885639C0.714393 0.45193 0.886381 0.27371 1.33255 0.496796L17.191 8.42632C17.6303 8.64629 17.6347 9.01956 17.2196 9.25012L1.92766 17.7448C1.50454 17.981 1.30327 17.8022 1.4765 17.3498L4.27692 10.0702L13.0009 8.82389L4.27692 7.5776L0.931248 0.885639Z"
      fill="white"
    />
  </svg>
);

class TextInputWeb extends React.Component {
  textInput = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewFile: null,
      previewVideoAudio: null,
      showEmoji: true,
      showModal: true,
      content: '',
      selectedFile: null,
      files: [],
      uploading: false,
      selectedFiles: null,
      roomInfo: null,
      visibleModal: false,
      visiblePopover: false,
      sendChat: false,
      dotPosition: 'top',
      caretPos: 0,
    };
  }
  fileSelectHander = (event) => {
    // this.setState{
    //     selectedFile: event.target.files[0];
    // }
  };
  toggleEmojiModal = () => {
    this.setState({
      showEmoji: !this.state.showEmoji,
    });
  };
  showModalNomal = () => {
    UtilModal.openModal(this.props.keyChat + 'Emoji');
    this.setState({ showModal: false });
  };
  handleCancelEmoji = () => {
    UtilModal.closeModal(this.props.keyChat + 'Emoji');
    this.setState({ showModal: true });
  };
  handleOpen = (preview) => {
    this.setState({
      visible: true,
      previewFile: preview,
    });
  };
  handleCancel = (e) => {
    this.setState({
      visible: false,
      previewFile: null,
    });
  };
  parse = (plainText) =>
    [{ plain: plainText }]
      .map(({ plain, html }) => (plain ? escapeHtml(plain) : html || ''))
      .join('');

  moveCursorToEndAndFocus = (endIndex) => {
    const setPos = document.createRange();
    const set = window.getSelection();
    setPos.setStart(this.textInput.current.childNodes[0], endIndex);
    setPos.collapse(true);
    set.removeAllRanges();
    set.addRange(setPos);
  };
  pasteText = (plainText) => {
    this.textInput.current.focus();

    if (document.queryCommandSupported('insertText')) {
      document.execCommand('insertText', false, plainText);
      return;
    }

    const range = document.getSelection().getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(plainText);
    range.insertNode(textNode);
    range.selectNodeContents(textNode);
    range.collapse(false);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  };

  handleDrop = (event) => {
    if (!event.dataTransfer || !event.dataTransfer.items) {
      return;
    }

    event.preventDefault();

    const items = Array.from(event.dataTransfer.items);

    const files = items.filter((item) => item.kind === 'file').map((item) => item.getAsFile());
    if (files.length) {
      for (let i = 0; i < files.length; i += 1) {
        if (files[i].type.includes('image')) {
          this.setImage(files[i]);
        } else if (files[i].type.includes('video')) {
          this.setVideoAudio(files[i]);
        } else {
          this.setFile(files[i]);
        }
      }
    }
    Promise.all(
      items
        .filter((item) => item.kind === 'string' && /^text\/plain/.test(item.type))
        .map((item) => new Promise((resolve) => item.getAsString(resolve))),
    ).then((texts) => {
      texts.forEach((text) => this.pasteText(text));
    });
  };

  handlePaste = (event) => {
    if (!event.clipboardData || !event.clipboardData.items) {
      return;
    }
    event.preventDefault();
    const items = Array.from(event.clipboardData.items);

    const files = items.filter((item) => item.kind === 'file').map((item) => item.getAsFile());
    if (files.length) {
      for (let i = 0; i < files.length; i += 1) {
        if (files[i].type.includes('image')) {
          this.setImage(files[i]);
        } else if (files[i].type.includes('video')) {
          this.setVideoAudio(files[i]);
        } else {
          this.setFile(files[i]);
        }
      }
    }
    Promise.all(
      items
        .filter((item) => item.kind === 'string' && /^text\/plain/.test(item.type))
        .map((item) => new Promise((resolve) => item.getAsString(resolve))),
    ).then((texts) => {
      texts.forEach((text) => this.pasteText(text));
    });
  };

  pasteText = (plainText) => {
    this.textInput.current.focus();

    if (document.queryCommandSupported('insertText')) {
      document.execCommand('insertText', false, plainText);
      return;
    }

    const range = document.getSelection().getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(plainText);
    range.insertNode(textNode);
    range.selectNodeContents(textNode);
    range.collapse(false);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  };

  getCaretPosition = (element) => {
    const doc = element.ownerDocument || element.document;
    const win = doc.defaultView || doc.parentWindow;
    if (typeof win.getSelection !== 'undefined' && win.getSelection().rangeCount > 0) {
      const range = win.getSelection().getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      return preCaretRange.toString().length;
    }

    if (doc.selection && doc.selection.type !== 'Control') {
      const textRange = doc.selection.createRange();
      const preCaretTextRange = doc.body.createTextRange();
      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint('EndToEnd', textRange);
      return preCaretTextRange.text.length;
    }
    return 0;
  };
  onChangeChat = (e) => {
    this.setState({ content: e.target.value });
  };
  sendMessageChat = () => {
    let value = this.textInput.current.innerText;
    let files = this.state.files;
    if (files.length > 0) {
      let files = this.state.files;
      this.handleUploadFile(files, value, this.props.roomInfo);
      this.setState((state) => ({
        files: [],
      }));
      this.textInput.current.innerText = '';
    } else if (value) {
      // await this.props.sendMessage({
      //   socket: this.props.websocket,
      //   roomId: this.props.roomInfo._id,
      //   msg: value,
      // });
      // await this.props.dispatch({
      //   type: 'websocket/sendMessage',
      //   payload: {
      //     socket: this.props.websocket,
      //     roomId: this.props.roomInfo._id,
      //     msg: value,
      //   }
      // })
      this.props.dispatch({
        type: 'rocketChat/sendMessage',
        payload: {
          params: {
            roomId: this.props.roomInfo.id,
          },
          data: {
            text: value,
          },
        },
        headers: {
          Authorization: this.props.authorization,
        },
      });
      this.textInput.current.innerText = '';
    }
    let elment = document.getElementById(this.props.keyChat);
    elment.scrollTop = elment.scrollHeight;
  };
  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.roomInfo && nextProps.roomInfo !== this.state.roomInfo) {
      this.setState({ roomInfo: nextProps.roomInfo });
    }
  }
  handleUploadFile = (file, text, roomInfo) => {
    const formData = new FormData();
    for (let i = 0; i < file.length; i++) {
      formData.append('files', file[i]);
    }
    formData.append('roomId', roomInfo.id);
    formData.append('typeMessage', 'file');
    if (text) {
      formData.append('text', text);
    }
    this.setState({
      uploading: true,
    });

    this.props.dispatch({
      type: 'rocketChat/sendMessageWithAttachments',
      payload: {
        data: formData,
      },
      headers: {
        Authorization: this.props.authorization,
      },
    });
    this.setState({
      files: [],
      uploading: false,
    });
    // You can use any AJAX library you like
    // reqwest({
    //   url: 'https://oncx-gateway.smartcontactcenter.xyz/smcc-chat-service/api/message/send-message',
    //   method: 'post',
    //   processData: false,
    //   data: formData,
    //   headers: {
    //     Authorization: this.props.authorization,
    //   },
    //   success: () => {
    //     this.setState({
    //       files: [],
    //       uploading: false,
    //     });
    //     if (roomInfo.t && roomInfo.t === 'l') {
    //       // this.props.getChannelFile(roomInfo._id);
    //       this.props.dispatch({
    //         type: 'rocketChat/getChannelFile',
    //         payload: {
    //           roomId: roomInfo._id,
    //         },
    //       });
    //     } else {
    //       // this.props.getGroupFile(roomInfo._id);
    //       // this.props.dispatch({
    //       //   type: 'rocketChat/getGroupFile',
    //       //   payload: {
    //       //     roomId: roomInfo._id,
    //       //   },
    //       // });
    //     }
    //   },
    //   error: () => {
    //     this.setState({
    //       uploading: false,
    //     });
    //     openNotification('topRight', 'Kích thước quá lớn.');
    //   },
    // });
  };
  hide = () => {
    this.setState({
      visible: false,
    });
  };
  hidePopover = () => {
    this.setState({
      visiblePopover: false,
    });
  };

  handleVisibleChange = () => {
    UtilModal.openModal(this.props.keyChat + 'Emoji');
    document.querySelector('.emoji-mart input[type=search]').focus();
  };
  handleVisibleChangePopover = (visiblePopover) => {
    this.setState({ visiblePopover });
  };
  moveCursorToEndAndFocus = () => {
    const setPos = document.createRange();
    const set = window.getSelection();
    const lastChild = this.textInput.current.childNodes.length - 1;
    setPos.setStart(
      this.textInput.current.childNodes[lastChild],
      this.textInput.current.childNodes[lastChild].data.length - 1,
    );
    setPos.collapse(true);
    set.removeAllRanges();
    set.addRange(setPos);
  };
  handleIcon = (emoji) => {
    const oldText = this.textInput.current.innerText;
    const newText = oldText.concat(emoji.native);
    this.textInput.current.innerText = newText;

    this.moveCursorToEndAndFocus();
    const caretPosition = this.getCaretPosition(this.textInput.current);
    this.setState({ caretPos: caretPosition });
    this.handleCancelEmoji();
  };
  getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  setImage = async (file) => {
    file.preview = await this.getBase64(file);
    this.setState((state) => ({
      files: [...state.files, file],
    }));
  };
  setVideoAudio = async (file) => {
    file.previewVideoAudio = await this.getBase64(file);
    file.fileType = (await file.type) === 'video/mp4' ? 'mp4' : 'mp3';
    this.setState((state) => ({
      files: [...state.files, file],
    }));
  };
  setFile = async (file) => {
    file.fileType = (await file.type) === 'application/pdf' ? 'pdf' : 'txt';
    this.setState((state) => ({
      files: [...state.files, file],
    }));
  };
  deleteFileReview = async (indexImage) => {
    let newImages = await this.state.files;
    var filtered = await newImages.filter(function (value, index, arr) {
      return index != indexImage;
    });
    this.setState({
      files: filtered,
    });
  };
  previewType = (visible, onVisibleChange, getContainer) => {};
  handlePositionChange = ({ target: { value } }) => {
    this.setState({
      dotPosition: value,
    });
  };

  render() {
    const { files, roomInfo, previewVisible } = this.state;
    const { rooms, userInfo, muted, typeRoom, typeMessage } = this.props;
    let roomId = roomInfo && roomInfo.id ? roomInfo.id : '';
    const propsImage = {
      beforeUpload: (file) => {
        if (
          (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif') &&
          file.size > 0 &&
          file.size < 10485760
        ) {
          document.getElementById(this.props.keyChat + 'inputChat').focus();
          this.setImage(file);
        } else if (
          (file.type == 'video/mp4' || file.type == 'audio/mpeg') &&
          file.size > 0 &&
          file.size < 10485760
        ) {
          document.getElementById(this.props.keyChat + 'inputChat').focus();
          this.setVideoAudio(file);
        } else {
          notification.error({
            message: 'Định dạng không hổ trợ hoặc kích thước > 10MB.',
            placement: 'topRight',
          });
        }
        return false;
      },
      showUploadList: false,
      fileList: files,
      multiple: true,
    };
    const propsFile = {
      beforeUpload: (file) => {
        if (
          (file.type === 'application/pdf' ||
            file.type === 'application/zip' ||
            file.type === 'text/plain' ||
            file.type === 'application/msword' ||
            file.type ===
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') &&
          file.size > 0 &&
          file.size < 10485760
        ) {
          document.getElementById(this.props.keyChat + 'inputChat').focus();
          this.setFile(file);
        } else {
          notification.error({
            message: 'Định dạng không hổ trợ hoặc kích thước > 10MB.',
            placement: 'topRight',
          });
        }
        return false;
      },
      showUploadList: false,
      fileList: files,
      multiple: true,
    };
    const propsAddFile = {
      beforeUpload: (file) => {
        if (
          (file.type === 'application/pdf' ||
            file.type === 'application/zip' ||
            file.type === 'text/plain' ||
            file.type === 'application/msword' ||
            file.type ===
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') &&
          file.size > 0 &&
          file.size < 10485760
        ) {
          document.getElementById(this.props.keyChat + 'inputChat').focus();
          this.setFile(file);
        } else {
          if ((file.type == 'image/png' || file.type == 'image/jpeg') && file.size > 0) {
            document.getElementById(this.props.keyChat + 'inputChat').focus();
            this.setImage(file);
          } else {
            notification.error({
              message: 'Định dạng không hổ trợ hoặc kích thước > 10MB.',
              placement: 'topRight',
            });
          }
        }
        return false;
      },
      showUploadList: false,
      fileList: files,
      multiple: true,
    };
    const contentStyle = {
      // height: files && files.length > 0 ? "30%" : "10%",
    };
    return (
      <>
        <div>
          {files && files.length > 0 ? (
            <List className="site-image-review">
              {files.map((item, index) => {
                return (
                  <List.Item key={index} className="list-item-review">
                    {item.preview ? (
                      <Space width={68} height={68}>
                        <Card bodyStyle={{ padding: 14 }} style={{ border: 'none' }}>
                          <Image
                            onClick={() => this.handleOpen(item.preview)}
                            preview={false}
                            style={{ borderRadius: '4px' }}
                            width={68}
                            height={68}
                            src={item.preview}
                          />
                          <Button
                            shape="circle"
                            onClick={(e) => this.deleteFileReview(index)}
                            className="bt-delete-file-review"
                            icon={<Icon component={CloseSvg} />}
                            size="small"
                          />
                        </Card>
                      </Space>
                    ) : item.previewVideoAudio ? (
                      <Space width={68} height={68} className="space-background">
                        <Card bodyStyle={{ padding: 14 }} style={{ border: 'none' }}>
                          <div className="card-body-image">
                            {item.previewVideoAudio.indexOf('video/mp4') > -1 ? (
                              <video
                                className="ard-body-video"
                                src={item.previewVideoAudio}
                                width={68}
                                height={68}
                              />
                            ) : (
                              <Text className="text-attact">
                                {item.name && item.name.length > 12
                                  ? item.name.slice(0, 8) + '...'
                                  : item.name}
                              </Text>
                            )}
                            <Icon
                              onClick={() => this.handleOpen(item.previewVideoAudio)}
                              className="icon-video-attact"
                              component={VideoSvg}
                            />
                            <Button
                              shape="circle"
                              onClick={(e) => this.deleteFileReview(index)}
                              className="bt-delete-file-review"
                              icon={<Icon component={CloseSvg} />}
                              size="small"
                            />
                          </div>
                        </Card>
                      </Space>
                    ) : (
                      <Space width={68} height={68} className="space-background">
                        <Card bodyStyle={{ padding: 14 }} style={{ border: 'none' }}>
                          <div className="card-body-image">
                            <Icon className="icon-attact" component={AttactSvg} />
                            <Text className="text-attact">
                              {item.name && item.name.length > 12
                                ? item.name.slice(0, 8) + '...'
                                : item.name}
                            </Text>
                            <Button
                              shape="circle"
                              onClick={(e) => this.deleteFileReview(index)}
                              className="bt-delete-file-review"
                              icon={<Icon component={CloseSvg} />}
                              size="small"
                            />
                          </div>
                        </Card>
                      </Space>
                    )}
                  </List.Item>
                );
              })}
              <List.Item key={'add'} style={{ display: 'inline' }}>
                <Space width={68} height={68}>
                  <Card style={{ border: 'none' }}>
                    <Dragger className="dragger-add" {...propsAddFile}>
                      <Icon component={AddSvg} />
                    </Dragger>
                  </Card>
                </Space>
              </List.Item>
            </List>
          ) : null}
        </div>
        <Footer className="message-input" style={contentStyle}>
          <div className="input-widget">
            <div
              contentEditable
              aria-hidden="true"
              onDrop={(e) => this.handleDrop(e)}
              onPaste={(e) => this.handlePaste(e)}
              onInput={() => {
                const caretPosition = this.getCaretPosition(this.textInput.current);
                this.setState({ caretPos: caretPosition });
              }}
              onKeyPress={(event) => {
                if (event.which === 13 && !event.shiftKey) {
                  event.preventDefault();
                  this.sendMessageChat();
                }
              }}
              id={this.props.keyChat + 'inputChat'}
              name="inputChat"
              className="input-affix-wrapper input-chat"
              placeholder="Type a message"
              onClick={() => {
                const caretPosition = this.getCaretPosition(this.textInput.current);
                this.setState({ caretPos: caretPosition });
                this.handleCancelEmoji();
              }}
              ref={this.textInput}
            />
            <div className="flex-container">
              <Dragger
                accept=".png,.jpeg,.jpg,.mp4,.mp3,.gif"
                className="widget-dragger-upload"
                style={{ padding: 0 }}
                {...propsImage}
              >
                <Button
                  disabled={
                    (muted && this.props.typeSocial !== TYPE_ROOM_WIDGET.LIVECHAT_ONLINE) ||
                    typeMessage === TYPE_ROOM_WIDGET.HANDLE_MESSENGE ||
                    typeRoom === TYPE_ROOM_WIDGET.NEW_CHAT
                  }
                  className="btn-icon"
                  icon={<Icon component={FileImageSvg} />}
                />
              </Dragger>
              <Dragger
                accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.xlsx"
                className="widget-dragger-upload"
                style={{ padding: 0 }}
                {...propsFile}
              >
                <Button
                  disabled={
                    (muted && this.props.typeSocial !== TYPE_ROOM_WIDGET.LIVECHAT_ONLINE) ||
                    typeMessage === TYPE_ROOM_WIDGET.HANDLE_MESSENGE ||
                    typeRoom === TYPE_ROOM_WIDGET.NEW_CHAT
                  }
                  className="btn-icon"
                  icon={<Icon component={AttactInputSvg} />}
                />
              </Dragger>
              <div>
                <Button
                  onClick={this.state.showModal ? this.showModalNomal : this.handleCancelEmoji}
                  disabled={
                    (muted && this.props.typeSocial !== TYPE_ROOM_WIDGET.LIVECHAT_ONLINE) ||
                    typeMessage === TYPE_ROOM_WIDGET.HANDLE_MESSENGE ||
                    typeRoom === TYPE_ROOM_WIDGET.NEW_CHAT
                  }
                  className="btn-icon"
                  icon={<Icon component={EmojiSvg} />}
                />
                <div id={this.props.keyChat + 'Emoji'} className="widget-emoji-container">
                  <Picker
                    sheetSize={64}
                    set="apple"
                    showPreview={false}
                    showSkinTones={false}
                    onSelect={(emoji) => this.handleIcon(emoji)}
                    color="#D5DBDB"
                    i18n={{
                      search: 'Tìm kiếm',
                      clear: 'Xóa', // Accessible label on "clear" button
                      notfound: 'Không tìm thấy Icon',
                      skintext: 'Chọn tông màu mặc định của bạn',
                      categories: {
                        search: 'Kết quả tìm kiếm',
                        recent: 'Thường dùng',
                        smileys: 'Mặt cười ',
                        people: 'Mặt cười & Mọi người',
                        nature: 'Động vật và thiên nhiên',
                        foods: 'Ẩm thực',
                        activity: 'Hoạt động',
                        places: 'Du lịch và địa điểm',
                        objects: 'Đối tượng',
                        symbols: 'Biểu tượng',
                        flags: 'Cờ',
                        custom: 'Tùy chọn',
                      },
                      categorieslabel: 'Emoji categories', // Accessible title for the list of categories
                      skintones: {
                        1: 'Default Skin Tone',
                        2: 'Light Skin Tone',
                        3: 'Medium-Light Skin Tone',
                        4: 'Medium Skin Tone',
                        5: 'Medium-Dark Skin Tone',
                        6: 'Dark Skin Tone',
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            <Button
              icon={<Icon component={SendSvg} />}
              disabled={
                (muted && this.props.typeSocial !== TYPE_ROOM_WIDGET.LIVECHAT_ONLINE) ||
                typeMessage === TYPE_ROOM_WIDGET.HANDLE_MESSENGE ||
                typeRoom === TYPE_ROOM_WIDGET.NEW_CHAT
              }
              className="btn-send"
              onClick={this.sendMessageChat}
            />
          </div>
        </Footer>
        <Modal
          visible={this.state.visible}
          title={null}
          footer={null}
          closable={null}
          onCancel={this.handleCancel}
          wrapClassName="review-images"
          width={1100}
        >
          <div style={{ textAlign: 'center' }}>
            {this.state.previewFile ? (
              this.state.previewFile.indexOf('video/mp4') > -1 ? (
                <video id="preview-video" autoPlay={true} width={928} height={576} controls>
                  <source src={this.state.previewFile} type="video/mp4" />
                </video>
              ) : this.state.previewFile.indexOf('audio/mpeg') > -1 ? (
                <audio id="preview-audio" autoPlay={true} controls>
                  <source src={this.state.previewFile} type="audio/mpeg" />
                </audio>
              ) : (
                <img
                  alt="example"
                  style={{ width: '928px', height: '576px', objectFit: 'cover' }}
                  src={this.state.previewFile}
                />
              )
            ) : (
              ''
            )}
          </div>
        </Modal>
      </>
    );
  }
}
const mapStateToProps = ({ websocket, rocketChat, user }) => {
  return {
    authorization: user.tokenGateway,
    userInfo: rocketChat.userInfo,
    websocket: websocket.socket,
    images: rocketChat.images,
    loading: rocketChat.loading,
    roomInfo: rocketChat.roomInfo,
    textValue: rocketChat.text,
  };
};
export default connect(mapStateToProps)(TextInputWeb);
