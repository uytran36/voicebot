import React from 'react';
import { Modal } from 'antd';
import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
  ProFormRadio,
  ProFormDateTimePicker,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';

const UpdateForm = (props) => {
  const intl = useIntl();
  return (
    <StepsForm
      stepsProps={{
        size: 'small',
      }}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            width={640}
            bodyStyle={{
              padding: '32px 40px 48px',
            }}
            destroyOnClose
            title={intl.formatMessage({
              id: 'pages.searchTable.updateForm.ruleConfig',
              defaultMessage: 'Rule configuration',
            })}
            visible={props.updateModalVisible}
            footer={submitter}
            onCancel={() => {
              props.onCancel();
            }}
          >
            {dom}
          </Modal>
        );
      }}
      onFinish={props.onSubmit}
    >
      <StepsForm.StepForm
        initialValues={{
          name: props.values.name,
          desc: props.values.desc,
        }}
        title={intl.formatMessage({
          id: 'pages.searchTable.updateForm.basicConfig',
          defaultMessage: 'essential information',
        })}
      >
        <ProFormText
          name="name"
          label={intl.formatMessage({
            id: 'pages.searchTable.updateForm.ruleName.nameLabel',
            defaultMessage: 'Rule name',
          })}
          width="md"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.updateForm.ruleName.nameRules"
                  defaultMessage="Please input rule name!"
                />
              ),
            },
          ]}
        />
        <ProFormTextArea
          name="desc"
          width="md"
          label={intl.formatMessage({
            id: 'pages.searchTable.updateForm.ruleDesc.descLabel',
            defaultMessage: 'Rule description',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.searchTable.updateForm.ruleDesc.descPlaceholder',
            defaultMessage: 'Please enter at least five characters',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.updateForm.ruleDesc.descRules"
                  defaultMessage="Please enter a rule description with at least five characters!"
                />
              ),
              min: 5,
            },
          ]}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          target: '0',
          template: '0',
        }}
        title={intl.formatMessage({
          id: 'pages.searchTable.updateForm.ruleProps.title',
          defaultMessage: 'Configure rule properties',
        })}
      >
        <ProFormSelect
          name="target"
          width="md"
          label={intl.formatMessage({
            id: 'pages.searchTable.updateForm.object',
            defaultMessage: 'Monitoring objects',
          })}
          valueEnum={{
            0: 'Table 1',
            1: 'Table 2',
          }}
        />
        <ProFormSelect
          name="template"
          width="md"
          label={intl.formatMessage({
            id: 'pages.searchTable.updateForm.ruleProps.templateLabel',
            defaultMessage: 'Rule Template',
          })}
          valueEnum={{
            0: 'Rule template 1',
            1: 'Rule template 2',
          }}
        />
        <ProFormRadio.Group
          name="type"
          label={intl.formatMessage({
            id: 'pages.searchTable.updateForm.ruleProps.typeLabel',
            defaultMessage: 'Rule type',
          })}
          options={[
            {
              value: '0',
              label: 'strong',
            },
            {
              value: '1',
              label: 'weak',
            },
          ]}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          type: '1',
          frequency: 'month',
        }}
        title={intl.formatMessage({
          id: 'pages.searchTable.updateForm.schedulingPeriod.title',
          defaultMessage: 'Set scheduling cycle',
        })}
      >
        <ProFormDateTimePicker
          name="time"
          width="md"
          label={intl.formatMessage({
            id: 'pages.searchTable.updateForm.schedulingPeriod.timeLabel',
            defaultMessage: 'start time',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.updateForm.schedulingPeriod.timeRules"
                  defaultMessage="Please select the start time!"
                />
              ),
            },
          ]}
        />
        <ProFormSelect
          name="frequency"
          label={intl.formatMessage({
            id: 'pages.searchTable.updateForm.object',
            defaultMessage: 'Monitoring objects',
          })}
          width="md"
          valueEnum={{
            month: 'month',
            week: 'week',
          }}
        />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;
