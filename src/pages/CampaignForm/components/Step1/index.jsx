import React from 'react';
import styles from './styles.less';
import { getListCampaignScript, getListSampleScript } from '@/services/campaign-management';
import { Modal, Col, Row } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
const style = { background: '#0092ff', padding: '8px 0' };
class ColorCard extends React.Component {
  render() {
    return (
      <div
        className={styles['rcorners']}
        style={{ backgroundColor: this.props.sc.backgroundColor }}
      >
        <img src={this.props.sc.icon}></img>
      </div>
    );
  }
}

class Step1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recentScript: [],
      sampleScript: [],
    };
    this.getColorAndIcon = this.getColorAndIcon.bind(this);
    this.createScript = this.createScript.bind(this);
    this.checkBeforeCreate = this.checkBeforeCreate.bind(this);
  }

  async componentDidMount() {
    const res = await getListCampaignScript(this.props.headers);
    const resSamples = await getListSampleScript(this.props.headers);
    if (res.success || resSamples.success)
      this.setState({
        recentScript: res?.data[0] || [],
        sampleScript: resSamples?.data || [],
        visible: false,
      });
  }

  getColorAndIcon(index) {
    const code = index + 1;
    if (code % 4 == 0)
      return {
        backgroundColor: '#EF83F8',
        icon: '/icons/ScenarioIcon/icon4.png',
        title: 'Kịch bản mẫu 4',
      };
    else if (code % 3 == 0)
      return {
        backgroundColor: '#F5AB3C',
        icon: '/icons/ScenarioIcon/icon3.png',
        title: 'Kịch bản mẫu 3',
      };
    else if (code % 2 == 0)
      return {
        backgroundColor: '#63D787',
        icon: '/icons/ScenarioIcon/icon2.png',
        title: 'Kịch bản mẫu 2',
      };
    else
      return {
        backgroundColor: '#EA637B',
        icon: '/icons/ScenarioIcon/icon1.png',
        title: 'Thông báo nhắc cước',
      };
  }

  createScript(params) {
    if (params.length == 0) this.props.createNewScript();
    else this.props.cloneScriptById(...params);
  }

  checkBeforeCreate(...params) {
    if (this.props.showElertPopUp) this.confirm(params);
    else this.createScript(params);
  }

  confirm(params) {
    Modal.confirm({
      title: 'Cảnh báo',
      icon: <ExclamationCircleOutlined />,
      content: 'Có muốn thay thế kịch bản hiện có?',
      okText: 'OK',
      cancelText: 'Hủy',
      onOk: () => {
        this.createScript(params);
      },
    });
  }

  render() {
    const currentScenario =
      this.state.recentScript?.map((e, index) => {
        const x = this.getColorAndIcon(index);
        return { ...x, ...e };
      }) || [];

    const arrayScenarrio =
      this.state.sampleScript?.map((e, index) => {
        const x = this.getColorAndIcon(index);
        return { ...x, ...e };
      }) || [];

    return (
      <div style={{ backgroundColor: 'white', padding: 20 }}>
        <div className={styles['choose-scenario']}>
          <strong>Lựa chọn kịch bản mẫu</strong>
          <div className={styles['list-scenario']}>
            <div
              style={{ textAlign: 'center' }}
              className={styles['scenario-item']}
              onClick={() => this.checkBeforeCreate()}
            >
              <div className={`${styles['create-scenario']} ${styles['rcorners']}`}>
                <img src="/icons/ScenarioIcon/createIcon.png"></img>
              </div>
              <strong>Tạo mới</strong>
            </div>
            {arrayScenarrio.map((sc) => (
              <div
                style={{ textAlign: 'center', width: 100 }}
                className={styles['scenario-item']}
                onClick={() => this.checkBeforeCreate(sc.id, 'sample')}
              >
                <ColorCard sc={sc} />
                <strong>{sc.name}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className={styles['current-scenario']}>
          <h3>
            <strong>Gần đây</strong>
          </h3>
          <div className={styles['grid']}>
            {currentScenario.map((sc) => (
              <div className={styles['scenario-item']}>
                <div onClick={() => this.checkBeforeCreate(sc.id)}>
                  <ColorCard sc={sc} />
                </div>
                <div onClick={() => this.checkBeforeCreate(sc.id)}>
                  <strong>{sc.name}</strong>
                  <p>{moment(sc.create_at).format('DD-MM-YYYY HH:mm:ss')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Step1;
