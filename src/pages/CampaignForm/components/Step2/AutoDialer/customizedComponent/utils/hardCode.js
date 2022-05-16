export const nameInput = {
  vocal: 'vocal',
  speed: 'speed',
  wait_time_dtmf_sec: 'wait_time_dtmf_sec',
  max_replay: 'max_replay',
};

export const AGENT = {
  media_type: 'agent',
  action_type: 'ROUTE_TO_AGENT',
};

export const TEXT_TO_SPEAK = {
  media_type: 'tts',
  action_type: 'SPEAK_TTS',
};

export const SPEAK_MEDIA = {
  media_type: 'mp3',
  action_type: 'SPEAK_MEDIA',
};

export const PROTOCOL = {
  TTS: 'tts',
  RECORD: 'record',
};

export const TYPE_NAVIGATE = {
  BOT: 'bot',
  AGENT: 'agent',
  RE_PLAY: 're-play',
};

export const PLACEMENT_UPLOAD = {
  introdution: 'introdution',
  navigatorKey: 'navigatorKey',
};

export const maskSlider = {
  0: '-3',
  16: '-2',
  32: '-1',
  50: '0',
  66: '1',
  82: '2',
  100: '3',
};

export const voices = [
  [
    {
      name: 'Lê Minh (Giọng nam)',
      value: 'leminh',
    },
    {
      name: 'Ban Mai (Giọng nữ)',
      value: 'banmai',
    },
    {
      name: 'Thu Minh (Giọng nữ)',
      value: 'thuminh',
    },
  ],
  [
    {
      name: 'Gia Huy (Giọng nam)',
      value: 'giahuy',
    },
    {
      name: 'Mỹ An (Giọng nữ)',
      value: 'myan',
    },
    {
      name: 'Ngọc Lam (Giọng nữ)',
      value: 'ngoclam',
    },
  ],
  [
    {
      name: 'Minh Quang(Giọng nam)',
      value: 'minhquang',
    },
    {
      name: 'Lan Nhi (Giọng nữ)',
      value: 'lannhi',
    },
    {
      name: 'Linh San (Giọng nữ)',
      value: 'linhsan',
    },
  ],
];
