export enum ProtocolTagsEnum {
  DEVICE_TYPE = '01',
  FIRMWARE_VERSION = '02',
  IMEI = '03',
  DEVICE_NUMBER = '04',
  EXTENDED_TAG_NUMBER = 'FE',
}

export const ProtocolTagsLength: { [key in ProtocolTagsEnum]: number } = {
  [ProtocolTagsEnum.DEVICE_TYPE]: 1,
  [ProtocolTagsEnum.FIRMWARE_VERSION]: 1,
  [ProtocolTagsEnum.IMEI]: 15,
  [ProtocolTagsEnum.DEVICE_NUMBER]: 2,
  [ProtocolTagsEnum.EXTENDED_TAG_NUMBER]: 6,
};
