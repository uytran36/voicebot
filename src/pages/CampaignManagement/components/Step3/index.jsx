import React, { useState, useCallback, useEffect, useRef } from 'react';
import PT from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import {
  Form,
  Input,
  Select,
  Button,
  Slider,
  Row,
  Col,
  Card,
  List,
  Tag,
  Popover,
  Tree,
  message,
  InputNumber,
  ConfigProvider,
  Upload,
  Alert,
  Space,
  Popconfirm,
  Typography,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi';
import { DeleteOutlined, CloseOutlined, CloudUploadOutlined } from '@ant-design/icons';
import LayoutNumber from './layoutNumber';
import styles from './styles.less';
import { requestUploadFile, requestGetSoundtrack } from '../../service';
import RenderBackgroundMusic from '../Form/formStep3';
import { useMultiAudio } from '@/components/Player';
import api from '@/api';
import { Edit, Delete } from '@/components/Icons';
import { filterField } from '@/constants/filter-data-excel';
import CheckWindowSize from '@/components/CheckWindownSize';

// const tokenGateway = localStorage.getItem('tokenGateway');

RenderStep3.propTypes = {
  data: PT.instanceOf(Array).isRequired,
  user: PT.instanceOf(Object).isRequired,
  initialValues: PT.instanceOf(Object).isRequired,
  headers: PT.instanceOf(Object).isRequired,
  handleChangeElementModal: PT.func.isRequired,
  handleChangeStateModal: PT.func.isRequired,
  handleCreateScenarioes: PT.func.isRequired,
  handleUpdateScenario: PT.func.isRequired,
  dispatch: PT.func.isRequired,
  nameCampaign: PT.string.isRequired,
  onClickStep: PT.func.isRequired,
  checkPermission: PT.func.isRequired,
  permissionVoiceBot: PT.instanceOf(Object).isRequired,
};

const voices = [
  [
    { name: 'Lê Minh (Giọng nam)', value: 'leminh' },
    { name: 'Ban Mai (Giọng nữ)', value: 'banmai' },
    { name: 'Thu Minh (Giọng nữ)', value: 'thuminh' },
  ],
  [
    { name: 'Gia Huy (Giọng nam)', value: 'giahuy' },
    { name: 'Mỹ An (Giọng nữ)', value: 'myan' },
    { name: 'Ngọc Lam (Giọng nữ)', value: 'ngoclam' },
  ],
  [
    { name: 'Minh Quang(Giọng nam)', value: 'minhquang' },
    { name: 'Lan Nhi (Giọng nữ)', value: 'lannhi' },
    { name: 'Linh San (Giọng nữ)', value: 'linhsan' },
  ],
];

const maskSlider = {
  0: '-3',
  16: '-2',
  32: '-1',
  50: 'Chuẩn',
  66: '1',
  82: '2',
  100: '3',
};

const speedValue = {
  0: '-3',
  16: '-2',
  32: '-1',
  50: '0',
  66: '1',
  82: '2',
  100: '3',
};

const fakeVoices = [
  {
    agent_id: '105',
    agent_name: 'Nguyen Huu Uyen',
  },
];

const urlMedia = `${api.IVR_SERVICE}/media_store/media_music`;

const handleFlatToTreeData = (flat, key = 'children') => {
  const roots = []; // things without parentId
  // make them accessible by id on this map
  const all = {};

  [...flat].forEach((item) => {
    all[item.id] = { ...item };
  });

  // connect childrens to its parentId, and split roots apart
  Object.keys(all).forEach((id) => {
    const item = all[id];
    if (item.parentId === null) {
      roots.push(item);
    } else if (item.parentId in all) {
      const p = all[item.parentId];
      if (!(key in p)) {
        p[key] = [];
      }
      p[key].push(item);
    }
  });
  return roots;
};

const recursive = (arr) => {
  return [...arr].reduce((acc, { dtmf, ...other }) => {
    acc.push(other);
    if (Array.isArray(dtmf)) {
      acc.push(...recursive(dtmf));
    }
    return acc;
  }, []);
};

const handleTreeDataToFlat = (tree) => {
  let result = [];
  if (tree && tree.introduction) {
    const { dtmf, ...other } = tree.introduction;
    result.push({
      voice: tree.introduction.voice,
      media_type: tree.introduction.media_type || '',
      name: `introduce`,
      title: `introduce`,
      key: '1',
      id: 1,
      parentId: null,
      ...other,
    });
  }
  if (tree && tree.introduction.dtmf) {
    const arr = recursive(tree.introduction.dtmf);
    result = result.concat(arr);
  }
  // console.log({result})
  return result;
};

// function to render component
function RenderStep3({
  data,
  handleChangeStateModal,
  handleChangeElementModal,
  nameCampaign,
  user,
  handleCreateScenarioes,
  // onClickStep,
  initialValues,
  handleUpdateScenario,
  dispatch,
  onClickStep,
  headers,
  checkPermission,
  permissionVoiceBot,
  ...rest
}) {
  // refs
  const refTextArea = useRef();
  // states
  const [valueTextArea, setValueTextArea] = useState('');
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [rawData, setRawData] = useState([
    {
      name: `introduce`,
      title: `introduce`,
      key: 1,
      id: 1,
      parentId: null,
    },
  ]); // data để setup hiển thị tree
  const [treeData, setTreeData] = useState([]);
  const [nodeTreeSelected, setNodeTreeSelected] = useState({});
  const [bgMusic, setBgMusic] = useState({});
  const [fileRecord, setFileRecord] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [form] = Form.useForm(); // ~~antd form v4
  const [disableTextArea, setDisableTextArea] = useState(false);
  const [disableUploadFile, setDisableUploadFile] = useState(false);
  const [disableSelectVoice, setDisableSeletVoice] = useState(false);
  const [valueSelectVoice, setValueSelectVoice] = useState([]);
  const [players, toggle, setUrls] = useMultiAudio([]);
  const [posCursor, setPosCursor] = useState(0);

  const handleVisibleChange = useCallback((visible) => {
    setPopoverVisible(visible);
  }, []);

  // click number to set tree data
  const clickNumber = useCallback(
    (number, _nodeTreeSelected) => {
      setPopoverVisible(false);
      const _rawData = cloneDeep(rawData);
      const random = Math.random();
      if (!_nodeTreeSelected || Object.keys(_nodeTreeSelected).length === 0) {
        message.error('Hãy chọn 1 node.');
        return null;
      }
      // add to root
      // if (Object.keys(_nodeTreeSelected).length === 0) {
      //   _rawData.push({
      //     name: `phim ${number}`,
      //     title: `phim ${number}`,
      //     key: random,
      //     id: random,
      //     parentId: null,
      //   });
      // } else {
      //   // add to child
      //   _rawData.push({
      //     name: `phim ${number}`,
      //     title: `phim ${number}`,
      //     key: random,
      //     id: random,
      //     parentId: _nodeTreeSelected.id,
      //   });
      // }
      // kiểm tra tồn tại của phím trong node cha.
      const a = _rawData.filter((elm) => {
        if (elm.parentId === _nodeTreeSelected.id && elm.value === number) {
          return true;
        }
        return false;
      });
      if (a.length > 0) {
        return message.warning(`Phím ${number} đã tồn tại, vui lòng chọn phím khác!`);
      }

      // add to child
      _rawData.push({
        name: `phim ${number}`,
        value: number,
        title: `phim ${number}`,
        key: random,
        id: random,
        parentId: _nodeTreeSelected.id,
      });
      const result = handleFlatToTreeData(_rawData);
      setTreeData(result);
      setRawData(_rawData);
      return null;
    },
    [rawData],
  );

  // const handleClickPlusIcon = useCallback(
  //   (nodeTree) => {
  //     handleVisibleChange(true);
  //     setNodeTreeSelected(nodeTree);
  //   },
  //   [handleVisibleChange],
  // );

  const handleClickDeleteIcon = useCallback(
    (nodeTree) => {
      const result = rawData.filter((elm) => elm.id !== nodeTree.id);
      const resultFlat = handleFlatToTreeData(result);
      setRawData(result);
      setTreeData(resultFlat);
      // message.warning('function is not working. because tree componet is not support')
    },
    [rawData],
  );

  const handleOnSelecteTreeNode = useCallback(
    (selectedKey, { node, nativeEvent: e }) => {
      // console.log({ node });
      if (e?.target?.closest('.anticon')) {
        // icon close clicked
        handleClickDeleteIcon(node);
        if (nodeTreeSelected.id === node.id) {
          setValueTextArea('');
          setNodeTreeSelected({});
          setValueSelectVoice([]);
        }
      } else {
        if (node.media_type === 'tts') {
          setValueTextArea(node?.voice || '');
          setDisableUploadFile(node?.voice?.length > 0);
          setDisableSeletVoice(node?.voice?.length > 0);
          setFileRecord([]);
          if (disableTextArea) {
            setDisableTextArea(false);
            setDisableUploadFile(true);
            setDisableSeletVoice(true);
          }
        } else if (node.media_type === 'mp3') {
          setFileRecord([
            {
              name: node.voice,
              url: node.voice ? `${urlMedia}/${node.voice}` : '',
            },
          ]);
          setDisableTextArea(node?.voice?.length > 0);
          setValueTextArea('');
          if (disableUploadFile) {
            setDisableTextArea(true);
            setDisableUploadFile(false);
            setDisableSeletVoice(true);
          }
        } else if (node?.media_type === 'agent') {
          setDisableSeletVoice(false);
          setValueSelectVoice(`${node?.agent_id}-${node?.agent_name}`);
          setDisableTextArea(node?.agent_id?.length > 0);
          setDisableUploadFile(node?.agent_id?.length > 0);
          if (disableSelectVoice) {
            setDisableTextArea(true);
            setDisableUploadFile(true);
            setDisableSeletVoice(false);
          }
        } else {
          setFileRecord([]);
          setValueTextArea('');
          setDisableUploadFile(false);
          setDisableTextArea(false);
          setDisableSeletVoice(false);
        }
        setNodeTreeSelected(node);
      }
    },
    [
      disableSelectVoice,
      disableTextArea,
      disableUploadFile,
      handleClickDeleteIcon,
      nodeTreeSelected.id,
    ],
  );

  // hàm logic chỉ dùng cho textarea onchange và tag clicked
  const replaceRawdata = useCallback(
    (_rawData, text) => {
      const index = rawData.findIndex((elm) => elm.id === nodeTreeSelected.id);
      if (index >= 0) {
        rawData[index] = {
          ...rawData[index],
          voice: text,
          media_type: 'tts',
          action_type: 'SPEAK_TTS',
        };
      }
      setValueTextArea(text);
      setRawData(rawData);
      setTreeData(handleFlatToTreeData(rawData));
    },
    [nodeTreeSelected, rawData],
  );

  const handleOnTextAreaChange = useCallback(
    (e) => {
      if (e.target.value.length > 0 && !disableUploadFile) {
        setDisableUploadFile(true);
        setDisableSeletVoice(true);
      } else if (e.target.value.length === 0 && disableUploadFile) {
        setDisableUploadFile(false);
        setDisableSeletVoice(false);
      }
      replaceRawdata(rawData, e.target.value);
    },
    [disableUploadFile, rawData, replaceRawdata],
  );

  const getPosCur = (e) => {
    const { selectionStart } = e.target;
    if (typeof selectionStart === 'number') {
      setPosCursor(selectionStart);
    }
  };

  const handleClickToTag = useCallback(
    (item) => {
      let str = '';
      if (posCursor === 0) {
        str = [
          valueTextArea.slice(0, posCursor),
          `{{${item}}} `,
          valueTextArea.slice(posCursor),
        ].join('');
      } else if (posCursor === valueTextArea.length) {
        str = `${valueTextArea} {{${item}}}`;
        setPosCursor(posCursor + 5 + `${item}`.length);
      } else {
        str = [
          valueTextArea.slice(0, posCursor),
          ` {{${item}}} `,
          valueTextArea.slice(posCursor),
        ].join('');
        setPosCursor(posCursor + 6 + `${item}`.length);
      }
      replaceRawdata(rawData, str);

      if (!disableUploadFile) {
        setDisableUploadFile(true);
      }
    },
    [disableUploadFile, rawData, replaceRawdata, valueTextArea, posCursor],
  );

  const handleClickAddMusicBg = useCallback(async () => {
    try {
      // let listSoundtrack = [];
      handleChangeStateModal(true);

      handleChangeElementModal({
        title: <FormattedMessage id="pages.campaign-management.soundtrack.list" />,
        bodyStyle: {
          padding: '12px 24px 16px 24px',
        },
        content: (
          <RenderBackgroundMusic
            getRecord={(record) => {
              setBgMusic(record);
              handleChangeStateModal(false);
            }}
            handleChangeStateModal={handleChangeStateModal}
            // data={players}
            toggle={toggle}
            // data={listSoundtrack}
          />
        ),
        footer: {
          footer: null,
          // hàm oncancel đang có vấn đề, vui lòng không bỏ comment..
          onCancel: () => {
            toggle(-1)();
            handleChangeStateModal(false);
          },
        },
      });
    } catch (err) {
      // message.error(err.toString());
    }
  }, [handleChangeElementModal, handleChangeStateModal, toggle]);

  const handleOnFinish = useCallback(
    (values) => {
      const error = [];
      // console.log(rawData)
      const dataFlat = rawData.map((elm) => {
        const dataProps = {
          voice: elm.voice,
          speed: speedValue[values.speed] || '0',
          vocal: values.vocal,
          wait_time_dtmf_sec: values.wait_time_dtmf_sec,
          max_replay: values.max_replay,
          is_replay: 'false',
          background_music: '',
        };
        // console.log({elm})
        if (elm.voice && elm.voice.length > 0) {
          if (elm.title === 'introduce') {
            return {
              ...elm,
              ...dataProps,
            };
          }
          return {
            ...elm,
            ...dataProps,
            dtmf: [],
            dtmf_num: elm.value,
          };
        }
        if (elm?.agent_id?.length > 0 && elm?.agent_name?.length > 0) {
          if (elm.title === 'introduce') {
            return {
              ...elm,
              ...dataProps,
            };
          }
          return {
            ...elm,
            ...dataProps,
            dtmf: [],
            dtmf_num: elm.value,
          };
        }
        error.push(elm);
        return {};
      });

      if (error.length > 0) {
        error.forEach((elm) => {
          message.error(`${elm.title.toUpperCase()} không được để trống`);
        });

        return null;
      }
      const [{ dtmf, ...other }] = handleFlatToTreeData(dataFlat, 'dtmf');
      const _data = {
        scenario_name: values.scenario_name,
        ScenarioModel: {
          scenario_name: values.scenario_name,
          background_music: bgMusic.name || '',
          is_background_music: `${!!bgMusic.name}`,
          introduction: {
            // action_type: 'SPEAK_TTS',
            // media_type: 'tts',
            // voice: other.voice,
            // vocal: other.vocal,
            ...other,
            speed: speedValue[values.speed] || '0',
            wait_time_dtmf_sec: values.wait_time_dtmf_sec,
            max_replay: values.max_replay,
            is_replay: 'false',
            dtmf: dtmf || [],
          },
        },
      };
      // return console.log({_data})
      // update
      if (Object.keys(initialValues).length > 0 && initialValues.campaignScenario) {
        _data.updateby = user?.username || 'unknown';
        handleUpdateScenario(_data, initialValues.campaignScenario._id);
        return null;
      }
      _data.createby = user?.username || 'unknown';
      handleCreateScenarioes(_data);
      return null;
    },
    [bgMusic, handleCreateScenarioes, handleUpdateScenario, initialValues, rawData, user],
  );

  const propUpload = {
    name: 'file',
    action: `${api.IVR_SERVICE}/uploadFile`,
    accept: '.mp3, .wav',
    headers,
    data: {
      media_store: 'media_voice',
      overwrite: 'false',
    },
    beforeUpload: (file) => {
      // console.log(file)
      if (file.size > 10485760) {
        message.error(`File ${file.name} có dung lương lớn hơn 10Mb`);
        return false;
      }
      if (Object.keys(nodeTreeSelected).length === 0) {
        message.error(`Hãy chọn lời thoại trước khi tải file ghi âm`);
        return false;
      }
      return true;
    },
    onChange: (info) => {
      let list = [...info.fileList];
      list = list.slice(-1);
      // console.log('done', info);
      if (info.file.status === 'done') {
        setFileRecord(list);
        setDisableTextArea(true);
        setDisableSeletVoice(true);
        const index = rawData.findIndex((elm) => elm.id === nodeTreeSelected.id);
        if (index >= 0) {
          rawData[index] = {
            ...rawData[index],
            voice: list[0].response.fileName,
            media_type: 'mp3',
            action_type: 'SPEAK_MEDIA',
          };
        }
        setRawData(rawData);
        setTreeData(handleFlatToTreeData(rawData));
        if (info?.file?.response?.message?.includes('existed file')) {
          setShowAlert(true);
        } else if (info?.file?.response?.url) {
          message.success('Upload file success');
        } else {
          message.error(
            typeof info?.file?.response === 'string'
              ? info?.file?.response
              : info?.file?.response?.message || 'Error...',
          );
        }
      }
      if (info.file.status === 'error') {
        console.error('error load file', info.file.status);
      }
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent) => `${parseFloat(percent.toFixed(2))}%`,
    },
    onRemove: (file) => {
      const index = rawData.findIndex((elm) => elm.id === nodeTreeSelected.id);
      if (index >= 0) {
        rawData[index] = { ...rawData[index], voice: '', media_type: '' };
      }
      setDisableTextArea(false);
      setDisableSeletVoice(false);
      setFileRecord(fileRecord.filter((elm) => elm.uid !== file.uid));
      setRawData(rawData);
      setTreeData(handleFlatToTreeData(rawData));
    },
  };

  const handleOnSelectVoice = useCallback(
    (value) => {
      if (Object.keys(nodeTreeSelected).length === 0) {
        message.error(`Hãy chọn lời thoại trước khi tải file ghi âm`);
        return false;
      }
      if (value && value.length > 0) {
        const index = rawData.findIndex((elm) => elm.id === nodeTreeSelected.id);
        if (index >= 0) {
          const split = value.split('-');
          rawData[index] = {
            ...rawData[index],
            media_type: 'agent',
            agent_id: split[0],
            agent_name: split[1],
            action_type: 'ROUTE_TO_AGENT',
          };
        }
        setValueSelectVoice(value);
        setRawData(rawData);
        // disable UI
        setDisableTextArea(true);
        setDisableUploadFile(true);
        setDisableSeletVoice(false);
      } else {
        setDisableTextArea(false);
        setDisableUploadFile(false);
        setDisableSeletVoice(false);
        setValueSelectVoice([]);
      }
      return null;
    },
    [nodeTreeSelected, rawData],
  );

  const handleAcceptReplaceFile = useCallback(async () => {
    const formData = new FormData();
    formData.append('file', fileRecord[0].originFileObj);
    formData.append('overwrite', true);
    formData.append('media_store', 'media_voice');
    try {
      const res = await requestUploadFile(headers, formData);

      if (res.fileName) {
        message.success('Replace existed file success!');
        setShowAlert(false);
        const index = rawData.findIndex((elm) => elm.id === nodeTreeSelected.id);
        if (index >= 0) {
          rawData[index] = {
            ...rawData[index],
            voice: res.fileName,
            media_type: 'mp3',
            action_type: 'SPEAK_MEDIA',
          };
        }
        setRawData(rawData);
        setTreeData(handleFlatToTreeData(rawData));
      } else {
        throw new Error('Some thing wrong...');
      }
    } catch (err) {
      // message.error(err.toString());
    }
  }, [fileRecord, nodeTreeSelected, rawData]);

  const handleDeclineReplaceFile = useCallback(() => {
    setFileRecord([]);
    setShowAlert(false);
    setDisableTextArea(false);
  }, []);

  const handleDeleteBgMusic = useCallback(() => {
    setBgMusic({});
  }, []);

  // ~~ effects ~~
  useEffect(() => {
    const result = handleFlatToTreeData(rawData);
    /**
     * Do mặc định đã set defaultSelected = root tree,
     * nên tại đây chúng ta cần phải tạo initial value cho các thành phần
     * giống như khi ta onSelect.
     * @funtion handleOnSelecteTreeNode chỉ được phép chạy duy nhất 1 lần
     * mỗi khi @param rawData thay đổi
     */
    handleOnSelecteTreeNode('select_by_useEffect', { node: result[0] });
    setTreeData(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawData]);

  useEffect(() => {
    if (Object.keys(initialValues).length > 0 && initialValues.campaignScenario) {
      const result = handleTreeDataToFlat(initialValues?.campaignScenario?.ScenarioModel);
      setRawData(result);
    }
  }, [initialValues]);

  useEffect(() => {
    form.resetFields();

    if (Object.keys(initialValues).length > 0 && initialValues.campaignScenario) {
      const backgroundMusic = initialValues.campaignScenario.ScenarioModel.background_music;
      setBgMusic({
        role: backgroundMusic,
        url: `${urlMedia}/${backgroundMusic}`,
      });
    }
    // setFileRecord([{
    //   name:
    // }])
  }, [initialValues, form]);

  useEffect(() => {
    const formData = new FormData();
    formData.append('media_store', 'media_music');
    (async () => {
      try {
        const res = await requestGetSoundtrack(headers, formData);
        if (res?.payload?.list_file) {
          const sources = res.payload?.list_file?.map((elm) => ({
            name: elm,
            url: `${urlMedia}/${elm}`,
          }));
          setUrls(sources);
        } else {
          console.error('response list sound track', res)
          // throw new Error(res?.error || 'Error');
        }
      } catch (err) {
        // message.error(err.toString());
      }
    })();
  }, [setUrls]);

  useEffect(() => {
    dispatch({
      type: 'campaign/execution',
      payload: {
        listBgMusic: players,
      },
    });
  }, [players, dispatch]);

  // ~~ RENDER COMPONENTS ~~
  const renderTree = useCallback((tree) => {
    return tree.map((item) => {
      if (item.children) {
        return (
          <Tree.TreeNode title={item.title} key={item.key} {...item}>
            {renderTree(item.children)}
          </Tree.TreeNode>
        );
      }
      return <Tree.TreeNode key={item.key} {...item} />;
    });
  }, []);

  const size = CheckWindowSize();

  return (
    <div className={styles.containder}>
      <Typography.Title level={3}>
        {<FormattedMessage id="pages.campaign-management.campaign.build" />}
      </Typography.Title>
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        initialValues={{
          speed:
            Object.assign({}, ...Object.entries(speedValue).map(([a, b]) => ({ [b]: a })))[
              initialValues?.campaignScenario?.ScenarioModel?.introduction?.speed
            ] || '50',
          wait_time_dtmf_sec:
            initialValues?.campaignScenario?.ScenarioModel?.introduction?.wait_time_dtmf_sec || 1,
          max_replay: initialValues?.campaignScenario?.ScenarioModel?.introduction?.max_replay || 1,
          vocal:
            initialValues?.campaignScenario?.ScenarioModel?.introduction?.vocal ||
            voices[0][0]?.values ||
            'leminh',
          scenario_name: nameCampaign,
        }}
        onFinish={handleOnFinish}
      >
        <Row gutter={size.screen === 'lg' ? [13, 8] : [16, 8]}>
          <Col span={9}>
            <Form.Item
              labelCol={{ span: size.screen === 'xxl' ? 7 : size.screen === 'xl' ? 9 : 24 }}
              wrapperCol={{ span: size.screen === 'xxl' ? 14 : size.screen === 'xl' ? 10 : 24 }}
              label={<FormattedMessage id="pages.campaign-management.name" />}
              labelAlign="left"
              name="scenario_name"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12} offset={2}>
            <Form.Item
              label={
                <Button onClick={handleClickAddMusicBg}>
                  {<FormattedMessage id="pages.campaign-management.insert.music" />}
                </Button>
              }
              labelCol={{ span: size.screen === 'xxl' ? 6 : size.screen === 'xl' ? 8 : 24 }}
              labelAlign="left"
              colon={false}
            >
              {Object.keys(bgMusic).length > 0 && (
                <>
                  <span style={{ marginRight: 8 }}>{bgMusic.name || 'Unknow'}</span>
                  <Popconfirm
                    title={<FormattedMessage id="pages.campaign-management.sure" />}
                    onConfirm={handleDeleteBgMusic}
                  >
                    <Delete className={styles.icon} />
                  </Popconfirm>
                </>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={size.screen === 'lg' ? [13, 8] : [16, 8]} style={{ margin: '-16px -8px -17px'}}>
          <Col span={9}>
            <Form.Item
              label={<FormattedMessage id="pages.campaign-management.voice" />}
              name="vocal"
              labelCol={{ span: size.screen === 'xxl' ? 7 : size.screen === 'xl' ? 9 : 24 }}
              wrapperCol={{ span: size.screen === 'xxl' ? 14 : size.screen === 'xl' ? 10 : 24 }}
              labelAlign="left"
            >
              <Select>
                {voices.map((elm, index) => (
                  <Select.OptGroup
                    label={
                      index === 0 ? (
                        <FormattedMessage id="pages.campaign-management.north" />
                      ) : index === 1 ? (
                        <FormattedMessage id="pages.campaign-management.mid" />
                      ) : (
                        <FormattedMessage id="pages.campaign-management.south" />
                      )
                    }
                    key={index}
                  >
                    {elm.map((el) => (
                      <Select.Option key={el.value} value={el.value}>
                        {el.name}
                      </Select.Option>
                    ))}
                  </Select.OptGroup>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12} offset={2}>
            <Form.Item
              name="speed"
              label={<FormattedMessage id="pages.campaign-management.speed" />}
              labelAlign="left"
              labelCol={{ span: size.screen === 'xxl' ? 6 : size.screen === 'xl' ? 8 : 24 }}
            >
              <Slider
                included={false}
                step={null}
                tipFormatter={(values) => {
                  const [tip] = Object.keys(maskSlider).filter(
                    (key) => key.toString() === values.toString(),
                  );
                  return maskSlider[tip];
                }}
                marks={maskSlider}
                // tooltipVisible
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={6}>
            <Card
              title={
                <span className={styles.textInfo}>
                  {<FormattedMessage id="pages.campaign-management.speech" />}
                </span>
              }
              bodyStyle={{ padding: 3 }}
              actions={[
                <Popover
                  key="add"
                  content={
                    <LayoutNumber clickNumber={clickNumber} nodeTreeSelected={nodeTreeSelected} />
                  }
                  trigger="click"
                  visible={popoverVisible}
                  onVisibleChange={handleVisibleChange}
                >
                  <span className={styles.textInfo}>
                    {<FormattedMessage id="pages.campaign-management.add.key" />}
                  </span>
                </Popover>,
              ]}
              className={styles.speech}
            >
              {treeData.length > 0 && (
                <Tree
                  className={styles.tree}
                  defaultExpandAll
                  titleRender={(node) => {
                    if (node.title === 'introduce') {
                      return (
                        <div className={styles.tree_title}>
                          <span style={{ display: 'block', whiteSpace: 'normal' }}>
                            {node.title}
                          </span>
                        </div>
                      );
                    }
                    return (
                      <div className={styles.tree_title}>
                        <span>{node.title}</span>
                        <div className={styles.tree_title__icon}>
                          {/* <PlusOutlined onClick={() => handleClickPlusIcon(node)} /> */}
                          <CloseOutlined />
                        </div>
                      </div>
                    );
                  }}
                  defaultSelectedKeys={['1']}
                  // treeData={treeData}
                  onSelect={handleOnSelecteTreeNode}
                >
                  {renderTree(treeData)}
                </Tree>
              )}
            </Card>
          </Col>
          <Col span={18}>
            <Row style={{ marginLeft: 16 }} gutter={[0, 6]}>
              <Col span={24}>
                {showAlert && (
                  <Alert
                    message="Cannot replace existed file."
                    description={`Click "Accept" to replace existed file.`}
                    type="warning"
                    banner
                    action={
                      <Space direction="vertical">
                        <Button size="small" type="primary" onClick={handleAcceptReplaceFile}>
                          Accept
                        </Button>
                        <Button size="small" danger type="ghost" onClick={handleDeclineReplaceFile}>
                          Decline
                        </Button>
                      </Space>
                    }
                    closable
                    style={{ marginBottom: 8 }}
                  />
                )}
                <Upload {...propUpload} fileList={fileRecord} disabled={disableUploadFile}>
                  <ConfigProvider direction="rtl">
                    <Button
                      style={{ marginBottom: 3 }}
                      disabled={disableUploadFile}
                      type="primary"
                      icon={<CloudUploadOutlined />}
                      hidden={!checkPermission(user?.permissions, permissionVoiceBot.configCampaignIVR)}
                    >
                      {<FormattedMessage id="pages.campaign-management.record.upload" />}
                    </Button>
                  </ConfigProvider>
                </Upload>
              </Col>
              {/* Su dung func goi tong dai vien */}
              {/* <Col span={24}>
                <Select
                  allowClear
                  placeholder="select one"
                  dropdownMatchSelectWidth={false}
                  onChange={handleOnSelectVoice}
                  disabled={disableSelectVoice}
                  value={valueSelectVoice}
                >
                  {fakeVoices.map((voice) => (
                    <Select.Option
                      value={`${voice.agent_id}-${voice.agent_name}`}
                      key={voice.agent_id}
                    >
                      {voice.agent_name}
                    </Select.Option>
                  ))}
                </Select>
              </Col> */}
              <Col span={24} hidden={!checkPermission(user?.permissions, permissionVoiceBot.configCampaignT2S)}>
                {data?.length > 0 && (
                  <div style={{ width: '100%' }}>
                    <div className={styles.titleTextSpeech}>
                      {<FormattedMessage id="pages.campaign-management.config.content" />}
                    </div>
                    <div style={{ display: 'inline-flex', width: '100%' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          // width: '200px',
                          border: '1px solid #d9d9d9',
                          // alignItems: 'center',
                          // justifyContent: 'center',
                        }}
                      >
                        <List
                          itemLayout="vertical"
                          // dataSource={Object.keys(data[0]).map((key) => {
                          //   return key;
                          // })}
                          className={styles.list}
                          dataSource={(() => {
                            const listKey = [];
                            Object.keys(data[0]).forEach((key) => {
                              if (!filterField.includes(key)) {
                                listKey.push([key]);
                              }
                              return null;
                              // if (
                              //   elm !== 'id' &&
                              //   elm !== '_id' &&
                              //   elm !== 'key' &&
                              //   elm !== 'xlsContactObject'
                              // ) {
                              //   listKey.push(elm);
                              // }
                              // if (elm === 'xlsContactObject') {
                              //   Object.keys(data[0].xlsContactObject).forEach((key) => {
                              //     if (key !== 'createdAt' && key !== 'updatedAt' && key !== 'id') {
                              //       listKey.push(key);
                              //     }
                              //   });
                              // }
                            });
                            return listKey;
                          })()}
                          renderItem={(item) => (
                            <Tag
                              onClick={() => {
                                if (disableTextArea) {
                                  message.warning('Không thể chọn...');
                                  return null;
                                }
                                return handleClickToTag(item);
                              }}
                              className={styles['tag-child']}
                            >
                              {item}
                            </Tag>
                          )}
                        />
                      </div>
                      <Input.TextArea
                        disabled={disableTextArea}
                        placeholder="Hãy chọn lời thoại trước khi nhập"
                        value={valueTextArea}
                        onChange={handleOnTextAreaChange}
                        ref={refTextArea}
                        onClick={(e) => getPosCur(e)}
                        onKeyUp={(e) => {
                          getPosCur(e);
                        }}
                      />
                    </div>
                  </div>
                )}
              </Col>
              <Col span={size.screen === 'lg' || size.screen === 'md' ? 9 : size.screen === 'sm' || size.screen === 'xs' ? 24 : 12}>
                <Form.Item
                  label={<FormattedMessage id="pages.campaign-management.repeat.time" />}
                  name="max_replay"
                  labelAlign="left"
                  labelCol={{ span: 2.5 }}
                  // wrapperCol={{ span: 12 }}
                >
                  <InputNumber min={1} />
                </Form.Item>
              </Col>
              <Col span={size.screen === 'lg' || size.screen === 'md' ? 13 : size.screen === 'sm' || size.screen === 'xs' ? 24 : 12}>
                <Form.Item
                  label={<FormattedMessage id="pages.campaign-management.receive.time" />}
                  name="wait_time_dtmf_sec"
                  labelAlign="left"
                  labelCol={{ span: 4.5 }}
                >
                  <InputNumber min={1} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        {/* <Row gutter={8} style={{ marginTop: 8 }}>
          <Col span={9}>
            <Form.Item
              label={<FormattedMessage id="pages.campaign-management.repeat.time" />}
              name="max_replay"
              labelAlign="left"
              labelCol={{ span: 5 }}
            >
              <InputNumber min={1} />
            </Form.Item>
          </Col>
          <Col span={12} offset={2}>
            <Form.Item
              label={<FormattedMessage id="pages.campaign-management.receive.time" />}
              name="wait_time_dtmf_sec"
              labelAlign="left"
              labelCol={{ span: 7 }}
            >
              <InputNumber min={1} />
            </Form.Item>
          </Col>
        </Row> */}

        <div style={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <Button style={{ marginRight: 5 }} disabled>
            {<FormattedMessage id="pages.campaign-management.listen" />}
          </Button>
          <Button style={{ marginRight: 5 }} onClick={() => onClickStep(2)}>
            {<FormattedMessage id="pages.campaign-management.back" />}
          </Button>
          <Button type="primary" htmlType="submit">
            {Object.keys(initialValues).length > 0 && initialValues.campaignScenario ? (
              <FormattedMessage id="pages.campaign-management.update" />
            ) : (
              <FormattedMessage id="pages.campaign-management.continue" />
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default RenderStep3;
