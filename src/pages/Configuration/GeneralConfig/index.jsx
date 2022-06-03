import React from 'react';
import { Card, Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import ProForm, { ProFormText, ProFormSelect, ProFormDependency } from '@ant-design/pro-form';
import style from './style.less';

const GeneralConfig = () => {
  return (
    <PageContainer
      header={{
        title: 'General Configuration',
        breadcrumb: {
          routes: [
            {
              path: '',
              breadcrumbName: 'Home',
            },
            {
              path: '',
              breadcrumbName: 'Configuration',
            },
            {
              path: '',
              breadcrumbName: 'General Configuration',
            },
          ],
        },
      }}
    >
      <Card>
        <ProForm
          submitter={{
            render: (props, doms) => {
              // console.log(props);
              return (
                <div className={style.footer}>
                  <Button size="large" className={style.save}>
                    Lưu
                  </Button>
                  <Button size="large" className={style.cancel}>
                    Hủy
                  </Button>
                </div>
              );
            },
          }}
        >
          <ProCard split="horizontal" className={style.contentWrapper}>
            <ProCard split="vertical" style={{ borderBottom: '0px' }}>
              <ProCard
                headStyle={{ justifyContent: 'center' }}
                title={<span className={style.titleCard}>Thông tin chung</span>}
                colSpan="210px"
              ></ProCard>
              <ProCard colSpan="300px">
                <ProFormText
                  label={<span className={style.label}>Tên doanh nghiệp</span>}
                  width={500}
                />
                <ProFormText label={<span className={style.label}>Tài khoản</span>} width={350} />
                <ProFormText
                  label={<span className={style.label}>Địa chỉ doanh nghiệp</span>}
                  width={350}
                />
                <ProFormText
                  label={<span className={style.label}>Số điện thoại</span>}
                  width={350}
                />
              </ProCard>
            </ProCard>
            <ProCard split="vertical">
              <ProCard
                headStyle={{ justifyContent: 'center' }}
                title={<span className={style.titleCard}>Định dạng</span>}
                colSpan="210px"
              ></ProCard>
              <ProCard colSpan="780px">
                <ProForm.Group>
                  <ProFormSelect
                    width={350}
                    options={[
                      {
                        value: '7',
                        label: 'GMT +7',
                      },
                      {
                        value: '1',
                        label: 'GMT +1',
                      },
                    ]}
                    label={<span className={style.label}>Múi giờ</span>}
                  />
                  <ProFormSelect
                    width={350}
                    options={[
                      {
                        value: 'VND',
                        label: 'Việt Nam Đồng',
                      },
                      {
                        value: 'EURO',
                        label: 'EURO',
                      },
                    ]}
                    label={<span className={style.label}>Tiền tệ</span>}
                  />
                </ProForm.Group>
                <ProFormSelect
                  width={350}
                  options={[
                    {
                      value: 'ddmmyyyy',
                      label: 'DD/MM/YYYY',
                    },
                    {
                      value: 'mmddyyyy',
                      label: 'MM/DD/YYYY',
                    },
                  ]}
                  label={<span className={style.label}>Ngày tháng</span>}
                />
              </ProCard>
            </ProCard>
          </ProCard>
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default GeneralConfig;
