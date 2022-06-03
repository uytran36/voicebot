import { withPropsAPI } from 'gg-editor';
import React, { useState } from 'react';
import styles from './editSide.less';
import { EditOutlined, UploadOutlined, PlusCircleOutlined, CloseOutlined } from '@ant-design/icons';
import {
  Typography,
  Form,
  Select,
  Upload,
  Button,
  Row,
  Col,
  Slider,
  Tag,
  message,
  AutoComplete,
  Collapse,
  InputNumber,
  Checkbox,
} from 'antd';
import { FormattedMessage } from 'umi';
import { maskSlider, voices, nameInput } from './utils/hardCode';
import ContentEditable from './ContentEditable/contentEditable';
import { nodeType } from './CustomFlowElement/customNode';
import debounce from 'lodash/debounce';
import api from '@/api';
import {
  uploadSoundFile,
  geLinkTTS,
  getVariableTTS,
  getFunctionTTS,
} from '@/services/campaign-management';
import AudioPlayer from './AudioPlayer';

const botNodeOption = {
  record: 'record',
  TTS: 'TTS',
};

const agentNodeOption = {
  extention: 'extention',
  queue: 'queue',
};

class EditSide extends React.Component {
  constructor(props) {
    super(props);
    const selectedItem = props.nodeOnClick;
    const model = selectedItem?.model;

    this.state = {
      isEditName: false,
      soundURL: false,
      isLoadingCreateSound: false,

      TTSVariablesFunctions: {
        variables: [],
        functions: [],
      },

      botSide: model?.info || {
        type: botNodeOption.record,
        details: {},
      },

      agentAutoComplete: {
        value: '',
        options: [],
      },

      agentNumber: model?.info?.details?.agentNumber || null,

      APIreturnData: model?.info?.details?.APIreturnData || null,
    };
  }

  async componentDidMount() {
    if (this.props?.campaignInfo?.field_tts) {
      const variableRes = await getVariableTTS(this.props?.headers, {
        data_id: this.props?.campaignInfo?.field_tts,
      });
      if (variableRes?.success) {
        const newArr = variableRes?.data?.map((i, index) => ({ id: index, display: i }));
        await this.setState((preState) => {
          return {
            ...preState,
            TTSVariablesFunctions: {
              variables: newArr,
              functions: [],
            },
          };
        });
      } else message.warning(variableRes?.error);

      const getFunctionRes = await getFunctionTTS(this.props?.headers);
      if (getFunctionRes?.success) {
        const newArr = getFunctionRes?.data?.map((i, index) => ({ id: index, display: i }));
        await this.setState((preState) => {
          return {
            ...preState,
            TTSVariablesFunctions: {
              variables: preState.TTSVariablesFunctions.variables,
              functions: newArr,
            },
          };
        });
      } else message.warning(getFunctionRes?.error);
    }
  }

  removeAnchorAfterUpdate(item) {
    item.anchorShapes?.forEach((anchor) => anchor?.attr('opacity', '0'));
  }

  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const { propsAPI } = this.props;
      const { getSelected, update, executeCommand } = propsAPI;
      const selectedItem = getSelected()[0];
      executeCommand(() => {
        update(selectedItem, { text: e.target.value });
      });
      this.removeAnchorAfterUpdate(selectedItem);
      this.setState({ isEditName: false });
    }
  };

  renderBotSide() {
    const { propsAPI } = this.props;
    const { getSelected, update } = propsAPI;
    const selectedItem = getSelected()[0];

    const botNodeOptionList = [
      { key: botNodeOption.record, value: 'File ghi âm' },
      { key: botNodeOption.TTS, value: 'Text to Speech' },
    ];

    const onSelect = async (value) => {
      let defaultBotDetails = {};
      if (value == botNodeOption.TTS)
        defaultBotDetails = {
          speed: '0',
          voice: 'leminh',
        };
      await this.setState((preState) => {
        return {
          preState,
          botSide: {
            type: value,
            details: defaultBotDetails,
          },
        };
      });
      update(selectedItem, { info: this.state.botSide });
      this.removeAnchorAfterUpdate(selectedItem);
    };

    const propUploads = (fns) => {
      const propUpload = {
        name: 'file',
        multiple: false,
        accept: '.mp3, .wav',
        beforeUpload: () => false,
      };

      if (fns?.beforeUpload) {
        propUpload.beforeUpload = fns.beforeUpload;
      }

      if (fns?.onChange) {
        propUpload.onChange = fns.onChange;
      }

      return { ...fns, ...propUpload };
    };

    const handleTextareaOnChangeForIntro = debounce(async (value) => {
      await this.setState((preState) => {
        return {
          botSide: { ...preState.botSide, details: { ...preState.botSide.details, textTS: value } },
          soundURL: false,
        };
      });
      update(selectedItem, { info: this.state.botSide });
      this.removeAnchorAfterUpdate(selectedItem);
    }, 500);

    let listTags = this.state.TTSVariablesFunctions?.variables || [];

    const listFunctions =
      /* this.state.TTSVariablesFunctions.functions */
      [
        {
          id: 'text-function-calculate-current-day',
          display: 'D',
          explanation: '<D> Ngày hiện tại',
        },
        {
          id: 'text-function-calculate-next-day',
          display: 'D+1',
          explanation: '<D+1> Ngày hiện tại + 1',
        },
        {
          id: 'text-function-calculate-last-day',
          display: 'D-1',
          explanation: '<D-1> Ngày hiện tại -1',
        },
        {
          id: 'text-function-calculate-current-month',
          display: 'M',
          explanation: '<M> Tháng hiện tại',
        },
        {
          id: 'text-function-calculate-next-month',
          display: 'M+1',
          explanation: '<M+1> Tháng hiện tại +1',
        },
        {
          id: 'text-function-calculate-last-month',
          display: 'M-1',
          explanation: '<M-1> Tháng hiện tại -1',
        },
      ];

    const onUploadIntro = async (item) => {
      const file = item.file;
      let fileList = [...item.fileList];
      fileList = fileList.slice(-1);

      if (fileList.length == 0) {
        await this.setState((preState) => {
          return {
            botSide: {
              ...preState.botSide,
              details: { record: [] },
            },
          };
        });
        update(selectedItem, { info: this.state.botSide });
        this.removeAnchorAfterUpdate(selectedItem);
        return;
      }

      let formData = new FormData();
      formData.append('file', fileList[0]?.originFileObj);
      const soundUploadRes = await uploadSoundFile(this.props.headers, formData);
      if (soundUploadRes.success) {
        await this.setState((preState) => {
          return {
            botSide: {
              ...preState.botSide,
              details: { record: [soundUploadRes.data[0]] },
            },
          };
        });
        update(selectedItem, { info: this.state.botSide });
        this.removeAnchorAfterUpdate(selectedItem);
      } else {
        await this.setState((preState) => {
          return {
            botSide: {
              ...preState.botSide,
              details: { record: [] },
            },
          };
        });
      }
    };

    const getKeyByValue = (object, value) => {
      return Object.keys(object).find((key) => object[key] === value);
    };

    const getLinkTTS = async () => {
      this.setState((preState) => {
        return {
          ...preState.botSide,
          isLoadingCreateSound: true,
        };
      });
      const linkTTSRes = await geLinkTTS(this.props.headers, this.state.botSide.details);

      if (linkTTSRes.success) {
        this.setState((preState) => {
          return {
            ...preState.botSide,
            soundURL: linkTTSRes.data[0].url,
            isLoadingCreateSound: false,
          };
        });
      } else {
        message.warning(linkTTSRes.error);
        this.setState((preState) => {
          return {
            ...preState.botSide,
            isLoadingCreateSound: false,
          };
        });
      }
    };
    return (
      <Form layout="vertical">
        <Form.Item name="is_active" label="Tùy chọn">
          <Select onSelect={onSelect} defaultValue={this.state.botSide?.type}>
            {botNodeOptionList.map((elm, index) => (
              <Select.Option key={elm.key} value={elm.key}>
                {elm.value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {this.state.botSide?.type == botNodeOption.record ? (
          <Form.Item label="Upload file">
            <Upload
              {...propUploads({
                onChange: onUploadIntro,
                onRemove: (file) => {
                  this.setState((preState) => {
                    return { botSide: { ...preState.botSide, details: {} } };
                  });
                },
              })}
              fileList={this.state.botSide?.details?.record}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            {this.state.botSide?.details?.record?.length > 0 ? (
              <AudioPlayer
                key={this.state.botSide?.details?.record[0].url}
                dispatch={this.props.dispatch}
                src={`${this.state.botSide?.details?.record[0].url}`}
              />
            ) : null}
          </Form.Item>
        ) : (
          <>
            <Form.Item name={nameInput.vocal} label="Giọng đọc">
              <Select
                listHeight={400}
                placeholder="Chọn giọng đọc"
                defaultValue={this.state.botSide?.details?.voice}
                onChange={async (value) => {
                  await this.setState((preState) => {
                    return {
                      botSide: {
                        ...preState.botSide,
                        details: { ...preState.botSide.details, voice: value },
                      },
                    };
                  });
                  update(selectedItem, { info: this.state.botSide });
                  this.removeAnchorAfterUpdate(selectedItem);
                }}
              >
                {voices.map((elm, index) => (
                  <Select.OptGroup
                    label={
                      index === 0 ? (
                        <span style={{ color: '#127ace', fontSize: 14 }}>
                          <FormattedMessage id="pages.campaign-management.north" />
                        </span>
                      ) : index === 1 ? (
                        <span style={{ color: '#127ace', fontSize: 14 }}>
                          <FormattedMessage id="pages.campaign-management.mid" />
                        </span>
                      ) : (
                        <span style={{ color: '#127ace', fontSize: 14 }}>
                          <FormattedMessage id="pages.campaign-management.south" />
                        </span>
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

            <Form.Item label="Tốc độ đọc" name={nameInput.speed}>
              <Slider
                defaultValue={getKeyByValue(maskSlider, this.state.botSide?.details?.speed) || 50}
                step={null}
                onChange={async (value) => {
                  await this.setState((preState) => {
                    return {
                      botSide: {
                        ...preState.botSide,
                        details: { ...preState.botSide.details, speed: maskSlider[value] },
                      },
                    };
                  });
                  update(selectedItem, { info: this.state.botSide });
                  this.removeAnchorAfterUpdate(selectedItem);
                }}
                marks={maskSlider}
              />
            </Form.Item>

            <Form.Item label="Phương thức">
              <div className={styles['introduction-container']}>
                <div className={`${styles['introduction-input']}`} name="test">
                  <ContentEditable
                    mentions={listTags}
                    mentions2={listFunctions}
                    defaultValue={this.state.botSide?.details?.textTS}
                    handleTextareaOnChange={handleTextareaOnChangeForIntro}
                  />
                </div>
                <div className={`${styles['introduction-tag']}`} style={{ marginTop: 10 }}>
                  {listTags.map((tag, index) => (
                    <Tag
                      className={styles.tag}
                      key={index}
                      color="#108ee9"
                      style={{ marginBottom: 5 }}
                    >
                      {tag.display}
                    </Tag>
                  ))}
                </div>

                <Collapse ghost>
                  <Collapse.Panel
                    header="Hàm chức năng"
                    key="1"
                    className={`${styles['collapseHeader']}`}
                  >
                    {listFunctions.map((tag, index) => (
                      <p style={{ marginBottom: 5 }}>{tag.explanation}</p>
                    ))}
                  </Collapse.Panel>
                </Collapse>
              </div>
            </Form.Item>

            <Button
              disabled={
                !this.state.botSide.details.textTS || this.state.isLoadingCreateSound ? true : false
              }
              style={
                !this.state.botSide.details.textTS || this.state.isLoadingCreateSound
                  ? { background: '#1EAF61', opacity: 0.5, padding: '5px 16px', color: 'white' }
                  : { background: '#1EAF61', padding: '5px 16px', color: 'white' }
              }
              loading={this.state.isLoadingCreateSound}
              onClick={() => getLinkTTS()}
            >
              {this.state.isLoadingCreateSound ? 'Đang tạo' : 'Tạo file nghe thử'}
            </Button>
            {this.state.soundURL && this.state.botSide.details.textTS ? (
              <AudioPlayer
                key={this.state.soundURL}
                dispatch={this.props.dispatch}
                src={this.state.soundURL}
              />
            ) : null}
          </>
        )}
      </Form>
    );
  }

  renderAgentSide() {
    const { propsAPI } = this.props;
    const { getSelected, update } = propsAPI;
    const selectedItem = getSelected()[0];

    const agentNodeOptionList = [
      { key: agentNodeOption.extention, value: 'Extentions' },
      { key: agentNodeOption.queue, value: 'Queue' },
    ];

    const options = [
      { value: '1800-HuongNT256' },
      { value: '1802-TriLM22' },
      { value: '1803-HDT53' },
      { value: '1804-AnhLHQ' },
      { value: '1805-MinhPD11' },
    ];

    const tagRender = (props) => {
      const { label, value, closable, onClose } = props;
      const onPreventMouseDown = (event) => {
        event.preventDefault();
        event.stopPropagation();
      };
      
      return (
        <Tag
          color={'cyan'}
          onMouseDown={onPreventMouseDown}
          closable={closable}
          onClose={onClose}
          style={{ marginRight: 3 }}
        >
          {label}
        </Tag>
      );
    };

    return (
      <Form layout="vertical">
        <Form.Item label="Loại kết nối">
          <Select /* onSelect={onSelect} defaultValue={this.state.botSide?.type} */>
            {agentNodeOptionList.map((elm, index) => (
              <Select.Option key={elm.key} value={elm.key}>
                {elm.value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Số/Tên Queue">
          <Select
            mode="multiple"
            showArrow
            tagRender={tagRender}
            defaultValue={['Ext 1', 'Ext 2']}
            style={{ width: '100%' }}
            options={options}
          />
        </Form.Item>
      </Form>
    );
  }

  renderReturnSide() {
    const { propsAPI } = this.props;
    const { getSelected, update } = propsAPI;
    const selectedItem = getSelected()[0];
    // search theo key chứ không phải value
    const listAPIs = [
      {
        key: 'API1',
        value: 'API1',
      },
      {
        key: 'API2',
        value: 'API2',
      },
      {
        key: 'API3',
        value: 'API3',
      },
      {
        key: 'API4',
        value: 'API4',
      },
      {
        key: 'API5',
        value: 'API5',
      },
      {
        key: 'API6',
        value: 'API6',
      },
    ];

    const onSelect = async (data) => {
      await this.setState({ APIreturnData: data });
      update(selectedItem, { info: { type: 'returnAPI', details: { APIreturnData: data } } });
      this.removeAnchorAfterUpdate(selectedItem);
    };

    return (
      <Form layout="vertical">
        <Form.Item label="Dữ liệu trả ra">
          <Select onSelect={onSelect} value={this.state.APIreturnData} showSearch>
            {listAPIs.map((elm, index) => (
              <Select.Option key={elm.key} value={elm.key}>
                {elm.value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    );
  }

  renderEditSide(type) {
    let editSide;
    switch (type) {
      case nodeType.Bot:
        editSide = this.renderBotSide();
        break;

      case nodeType.Agent:
        editSide = this.renderAgentSide();
        break;

      case nodeType.ReturnData:
        editSide = this.renderReturnSide();
        break;

      default:
        break;
    }
    return editSide;
  }

  render() {
    const selectedItem = this.props.nodeOnClick;
    const selected = selectedItem;
    return (
      <div className={styles.editSide}>
        <div className={styles.nodeName}>
          {this.state.isEditName ? (
            <input
              id="nameInput"
              type="text"
              defaultValue={selected?.model?.text}
              onChange={() => {}}
              autoFocus
              onKeyDown={this._handleKeyDown}
            />
          ) : (
            <Typography.Text level={5}>{selected?.model?.text}</Typography.Text>
          )}
        </div>
        <div className={styles.editContent}>
          {selected && this.renderEditSide(selected?.model?.nodeCustomizeType)}
        </div>
      </div>
    );
  }
}

export default withPropsAPI(EditSide);
