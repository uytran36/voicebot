import React, { useState, useCallback } from 'react';
import PT from 'prop-types';
import CreateProfileForm from './createProfileForm';
import { requestCreateUser } from '@/services/user-management'
import { requestCreateVocieBot } from '../../service'
import { isBuffer } from 'lodash';
import { notification } from 'antd';

export default function FormStep({ user, sipProfile }) {
  const [formData, setFormData] = useState({});
  const [Step, setStep] = useState(1);

  const getValues = useCallback(values => {
    setFormData({ ...formData, ...values })
  }, [formData])

  // console.log({formData})
  // {
  //   "profileUrl": "sdfádfá",
  //   "isLocal": "172.263.265.245",
  //   "isPublic": "",
  //   "firstName": "Sang",
  //   "lastName": "Truong",
  //   "username": "tanhv3",
  //   "password": "tanhv3",
  //   "confirm_password": "tanhv3",
  //   "email": "tansang106@gmail.com",
  //   "isIncomingCall": true,
  //   "phoneNumber": "12345"
  // }

  console.log({formData})

  if ((formData.username && formData.email) && ((Step === 3 && formData.phoneNumber) || (Step === 3 && formData.setting))) {
    const dataUser = {
      name: `${formData.firstName} ${formData.lastName}`,
      username: formData.username,
      email: formData.email,
      password: formData.password,
    }

    const data = {
      profileName: formData.profileUrl,
      ip: formData.isLocal ? formData.isLocal : formData.isPublic,
      isLocal: formData.isLocal ? true : false,
      userManagerID: '12314142',
      isIncomingCall: formData.isIncomingCall ? true : false,
      isOutcomingCall: formData.isIncomingCall ? false : true,
      isPhoneExist: formData.setting ? true : false,
      phoneNumber: formData.phoneNumber?.split('/')[0], // get phone truoc dau "/"
      gatewaySetting: formData.setting === 'acc' ? true : false,
      gatewayHostname: formData.gatewayHostname,
      gatewayPort: formData.gatewayPort,
      gatewayTransport: formData.gatewayTransport,
      token: user.tokenHub,
    }


    console.log('vao luon', dataUser, data)
    const header = {
      authToken: user.authToken,
      userId: user.userId,
    }
    requestCreateUser(header, dataUser).then(resUser => {
      if (resUser?.success === true) {
        data.userManagerID = resUser.user._id
        requestCreateVocieBot(data).then(resVoiceBot => {
          if (resVoiceBot?.success === true) {
            return notification.success({
              message: 'Create voice bot success',
              description: 'Success',
            });
          }
          return notification.error({
            message: 'Create voice bot error',
            description: 'Error',
          });
        })
      }
    })
  }

  return (
    <div>
      <div>
        <CreateProfileForm Step={Step} formData={formData} setStep={setStep} getValues={getValues} sipProfile={sipProfile} user={user}/>
      </div>
    </div>
  );
}
