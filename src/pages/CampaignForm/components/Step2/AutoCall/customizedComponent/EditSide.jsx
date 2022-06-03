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
  getReturnDataAPIs,
} from '@/services/campaign-management';
import AudioPlayer from './AudioPlayer';

const botNodeOption = {
  record: 'record',
  TTS: 'TTS',
};

export const conditionalNodeOption = {
  pressNumber: 'pressNumber',
  notInteract: 'notInteract',
};

class EditSide extends React.Component {
  constructor(props) {
    super(props);
    const { propsAPI } = this.props;
    const { getSelected } = propsAPI;
    const selectedItem = /* getSelected()[0] || */ props.nodeOnClick;
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

      conditionalSide: model?.info || {
        type: conditionalNodeOption.pressNumber,
        details: {},
      },

      rows: model?.info?.details?.conditions || [
        {
          condition: 'equal',
          value: null,
        },
      ],

      notInteract: model?.info?.details || {
        waitingTime: 3,
        is_check_repeat: false,
        repeatTimes: 1,
      },

      agentAutoComplete: {
        value: '',
        options: [],
      },

      agentNumber: model?.info?.details?.agentNumber || null,

      APIreturnData: model?.info?.details?.APIreturnData || null,

      listAPIs: [],
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
    const returnDataAPIRes = await getReturnDataAPIs(this.props?.headers);
    if (returnDataAPIRes?.success) {
      const newArr = returnDataAPIRes?.data?.map((i, index) => ({ key: i.name, value: i.name }));
      await this.setState((preState) => {
        return {
          ...preState,
          listAPIs: newArr,
        };
      });
    } else message.warning(returnDataAPIRes?.error);
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

    let listTags =
      this.state.TTSVariablesFunctions?.variables ||
      []; /* [
      {
        id: 'phone_number',
        display: 'Số điện thoại',
      },
      {
        id: 'name',
        display: 'Tên',
      },
      {
        id: 'full_name',
        display: 'Họ và tên',
      },
      {
        id: 'other_name',
        display: 'Danh xưng',
      },
      {
        id: 'gender',
        display: 'Giới tính',
      },
      {
        id: 'age',
        display: 'Tuổi',
      },
      {
        id: 'customer_code',
        display: 'Mã khách hàng',
      },
      {
        id: 'amount_of_money',
        display: 'Số tiền',
      },
      {
        id: 'currency_unit',
        display: 'Đơn vị tiền',
      },
    ]; */

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
    const endpoint = api.UMI_API_BASE_URL;
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
                src={this.state.botSide?.details?.record[0].url}
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

  renderCustomerSide() {
    const { propsAPI } = this.props;
    const { getSelected, update, save } = propsAPI;
    const selectedItem = getSelected()[0];

    const conditionalNodeOptionList = [
      { key: conditionalNodeOption.pressNumber, value: 'Nhấn phím' },
      { key: conditionalNodeOption.notInteract, value: 'Không tương tác' },
    ];

    const onSelect = async (value) => {
      await this.setState((preState) => {
        return {
          ...preState,
          conditionalSide: {
            type: value,
            details:
              value === conditionalNodeOption.pressNumber
                ? {}
                : {
                    waitingTime: 3,
                    is_check_repeat: false,
                    repeatTimes: 1,
                  },
          },
          rows: [
            {
              condition: 'equal',
              value: null,
            },
          ],
        };
      });
      update(selectedItem, { info: this.state.conditionalSide });
      this.removeAnchorAfterUpdate(selectedItem);
    };

    //pressNumber

    let condition = [
      {
        key: 'equal',
        value: '=',
      },
    ];

    const defaultValidValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '#'];

    const validValues = defaultValidValues?.filter(
      (v) => this.state.rows?.findIndex((r) => r.value === v) === -1,
    );

    const checkDuplicateCondition = (checkRow, idx) => {
      if (checkRow?.value) {
        const thisNode = this.props.nodeOnClickID || getSelected()[0];

        const allNode = save().nodes;
        const allLink = save().edges;
        const previousEdgeOfThisNode = allLink?.filter((ed) => ed.target === thisNode.id)[0];
        let allConditionalNodes = [];
        if (previousEdgeOfThisNode?.source) {
          const allEgesFromSameNode = allLink?.filter(
            (ed) => ed.source === previousEdgeOfThisNode?.source,
          );
          const allNodeSameSource = allNode?.filter(
            (n) =>
              allEgesFromSameNode?.findIndex((ed) => ed.target === n.id && n.id !== thisNode.id) !=
              -1,
          ); // các điều kiện không thuộc node hiện tại

          allConditionalNodes = allNodeSameSource?.filter(
            (n) => n.nodeCustomizeType === nodeType.Customer,
          );
        }

        let listUsedCondition = [];
        allConditionalNodes?.forEach((n) => {
          if (
            n.info?.type === conditionalNodeOption.pressNumber &&
            n?.info?.details?.conditions !== undefined
          ) {
            listUsedCondition.push(...n.info.details.conditions);
          }
        });

        // bổ sung thêm điều kiện của node hiện tại, không tính dòng đang kiểm tra
        let rows = this.state.rows?.filter((r, index) => index !== idx);
        listUsedCondition = listUsedCondition.concat(rows);
        const isDuplicate =
          listUsedCondition?.findIndex(
            (c) =>
              c.condition == checkRow.condition &&
              c.value == checkRow.value &&
              !(c.value === '' || c.value === undefined || c.value === null),
          ) !== -1;
        return isDuplicate;
      }
      //return true;
    };

    const handleAddRow = async () => {
      let currentRows = this.state.rows;
      currentRows = currentRows?.filter((con) => !(con.condition === 'equal' && con.value === ''));

      const item = {
        condition: 'equal',
        value: '',
      };
      await this.setState({
        rows: [...currentRows, item],
      });

      update(selectedItem, {
        info: { type: conditionalNodeOption.pressNumber, details: { conditions: this.state.rows } },
      });
      this.removeAnchorAfterUpdate(selectedItem);
    };

    const handleRemoveRow = async (idx) => {
      this.state.rows.splice(idx, 1);

      await this.setState({
        rows: this.state.rows,
      });
      update(selectedItem, {
        info: { type: conditionalNodeOption.pressNumber, details: { conditions: this.state.rows } },
      });
      this.removeAnchorAfterUpdate(selectedItem);
    };

    let formRef = React.createRef();

    const listConditions = this.state.rows;

    const selectChange = (idx) => async (e) => {
      let rows = [...this.state.rows];
      rows[idx] = {
        ...rows[idx],
        value: e,
      };

      await this.setState({
        rows,
      });

      update(selectedItem, {
        info: { type: conditionalNodeOption.pressNumber, details: { conditions: this.state.rows } },
      });
      this.removeAnchorAfterUpdate(selectedItem);
    };

    //not interact

    const onCheckRepeat = async (e) => {
      await this.setState((preState) => {
        return { notInteract: { ...preState.notInteract, is_check_repeat: e.target.checked } };
      });
      update(selectedItem, {
        info: { type: conditionalNodeOption.notInteract, details: { ...this.state.notInteract } },
      });
      this.removeAnchorAfterUpdate(selectedItem);
    };

    const changeWaitingTime = async (e) => {
      await this.setState((preState) => {
        return { notInteract: { ...preState.notInteract, waitingTime: e } };
      });
      update(selectedItem, {
        info: { type: conditionalNodeOption.notInteract, details: { ...this.state.notInteract } },
      });
      this.removeAnchorAfterUpdate(selectedItem);
    };

    const changeRepeatTimes = async (e) => {
      await this.setState((preState) => {
        return { notInteract: { ...preState.notInteract, repeatTimes: e } };
      });
      update(selectedItem, {
        info: { type: conditionalNodeOption.notInteract, details: { ...this.state.notInteract } },
      });
      this.removeAnchorAfterUpdate(selectedItem);
    };

    const isEnableNotInteract = () => {
      const { propsAPI } = this.props;
      const { save, getSelected } = propsAPI;
      const thisNode = getSelected()[0];
      const allNode = save().nodes;
      const allLink = save().edges;

      const previousEdgeOfThisNode = allLink?.filter((ed) => ed.target === thisNode.id)[0];
      if (previousEdgeOfThisNode?.source) {
        const allEgesFromSameNode = allLink?.filter(
          (ed) => ed.source === previousEdgeOfThisNode?.source,
        );

        const allNodeSameSource = allNode?.filter(
          (n) =>
            allEgesFromSameNode?.findIndex((ed) => ed.target === n.id && n.id !== thisNode.id) !=
            -1,
        );

        const allConditionalNodes = allNodeSameSource?.filter(
          (n) => n.nodeCustomizeType === nodeType.Customer,
        );

        return (
          allConditionalNodes.filter((n) => n.info?.type === conditionalNodeOption.notInteract)
            .length > 0 || allConditionalNodes.length == 0
        );
      }
    };

    const isEnableRepeat = () => {
      const { propsAPI } = this.props;
      const { save, getSelected } = propsAPI;
      const thisNode = getSelected()[0];
      const allNode = save().nodes;
      const allLink = save().edges;

      const allEdgeOfThisNode = allLink?.filter((ed) => ed.source === thisNode.id);
      const allNodeSameSource = allNode?.filter(
        (n) => allEdgeOfThisNode?.findIndex((ed) => ed.target === n.id) != -1,
      );
      return allNodeSameSource.length > 0;
    };

    return (
      <Form layout="vertical" ref={formRef}>
        <Form.Item name="is_active_conditional" label="Tùy chọn">
          <Select onSelect={onSelect} defaultValue={this.state.conditionalSide?.type}>
            {conditionalNodeOptionList.map((elm) => (
              <Select.Option
                key={elm.key}
                value={elm.key}
                disabled={isEnableNotInteract() && elm.key === conditionalNodeOption.notInteract}
              >
                {elm.value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {this.state.conditionalSide?.type == conditionalNodeOption.pressNumber ? (
          <>
            <Row>
              <Col span={10}>
                <Typography.Text>Điều kiện</Typography.Text>
              </Col>
              <Col span={10} offset={1}>
                <Typography.Text>Giá trị</Typography.Text>
              </Col>
            </Row>
            {listConditions.map((item, idx) => (
              <Row style={{ alignItems: 'baseline' }} key={idx}>
                <Col span={10}>
                  <Form.Item>
                    <Select value={item.condition}>
                      {condition.map((elm) => (
                        <Select.Option key={elm.key} value={elm.key}>
                          {elm.value}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={10} offset={1}>
                  <Form.Item
                    // name={[idx.toString()]}
                    // rules={[
                    //   (...params) => ({
                    //     validator() {
                    //
                    //       // const x = getFieldValue(idx.toString());
                    //
                    //       if (checkDuplicateCondition(idx, x))
                    //         return Promise.reject(new Error('Trùng giá trị điều kiện!'));
                    //       handleChange(idx, x);
                    //       return Promise.resolve();
                    //     },
                    //   }),
                    // ]}

                    validateStatus={checkDuplicateCondition(item, idx) ? 'error' : 'success'}
                    help={checkDuplicateCondition(item, idx) ? 'Trùng giá trị điều kiện!' : null}
                  >
                    <Select value={item.value} showSearch onChange={selectChange(idx)}>
                      {validValues.map((elm) => (
                        <Select.Option key={elm}>{elm}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={2} offset={1} style={{ justifyContent: 'flex-end' }}>
                  {idx == listConditions.length - 1 ? (
                    <PlusCircleOutlined
                      onClick={() => handleAddRow()}
                      style={{ color: '#4E89FF' }}
                    />
                  ) : (
                    <CloseOutlined onClick={() => handleRemoveRow(idx)} />
                  )}
                </Col>
              </Row>
            ))}
          </>
        ) : (
          <>
            <Row>
              <Col>
                <Form.Item name="watitingTime" label="Thời gian chờ">
                  <InputNumber
                    min={3}
                    max={40}
                    defaultValue={this.state.notInteract.waitingTime}
                    onChange={changeWaitingTime}
                  />
                  <span style={{ marginLeft: 5 }}>giây</span>
                </Form.Item>
              </Col>
            </Row>

            <Row className={styles['combo-wrapper']}>
              <Col style={{ margin: 'auto 0px' }}>
                <Checkbox
                  onChange={onCheckRepeat}
                  className={styles['pickup']}
                  checked={this.state.notInteract.is_check_repeat}
                  disabled={isEnableRepeat()}
                >
                  Lặp lại
                </Checkbox>
              </Col>
              <Col>
                <Form.Item noStyle name="repeat">
                  <InputNumber
                    min={1}
                    disabled={!this.state.notInteract.is_check_repeat}
                    onChange={changeRepeatTimes}
                    defaultValue={this.state.notInteract.repeatTimes}
                  />
                  <span className={styles['unit']} style={{ marginLeft: 5 }}>
                    giây
                  </span>
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
      </Form>
    );
  }

  renderAgentSide() {
    const { propsAPI } = this.props;
    const { getSelected, update } = propsAPI;
    const selectedItem = getSelected()[0];

    const onSearch = (searchText) => {
      this.setState({
        agentAutoComplete: {
          options: [
            { value: '1800-HuongNT256' },
            { value: '1802-TriLM22' },
            { value: '1803-HDT53' },
            { value: '1804-AnhLHQ' },
            { value: '1805-MinhPD11' },
          ],
        },
      });
    };

    const onSelect = async (data) => {
      await this.setState({ agentNumber: data });
      update(selectedItem, { info: { type: 'agentNumber', details: { agentNumber: data } } });
      this.removeAnchorAfterUpdate(selectedItem);
    };

    const onChange = (data) => {
      this.setState({ agentNumber: data });
    };

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
        <Form.Item label="Số điều hướng">
          {/* <AutoComplete
            value={this.state.agentNumber}
            options={this.state.agentAutoComplete?.options}
            onSelect={onSelect}
            onSearch={onSearch}
            onChange={onChange}
          /> */}
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
    const listAPIs = this.state
      .listAPIs; /* [
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
    ]; */

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

      case nodeType.Customer:
        editSide = this.renderCustomerSide();
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
    const { propsAPI } = this.props;
    const { getSelected, save } = propsAPI;
    let selected;
    try {
      selected = getSelected()[0];
    } catch {}
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
            <>
              <Typography.Text level={5}>{selected?.model?.text}</Typography.Text>
              {selected?.id !== '0' && (
                <EditOutlined onClick={() => this.setState({ isEditName: true })} />
              )}
            </>
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
