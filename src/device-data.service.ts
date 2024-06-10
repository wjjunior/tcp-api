import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceData } from './device-data.entity';
import { DeviceLog } from './device-log.entity';

@Injectable()
export class DeviceDataService {
  constructor(
    @InjectRepository(DeviceData)
    private readonly deviceDataRepository: Repository<DeviceData>,
    @InjectRepository(DeviceLog)
    private readonly deviceLogRepository: Repository<DeviceLog>,
  ) {}

  async processAndSaveData(buffer: Buffer): Promise<DeviceData> {
    const {
      deviceType,
      firmwareVersion,
      imei,
      deviceNumber,
      extendedTagNumber,
      extendedTagData,
      checksum,
    } = this.parseHexPacket(buffer.toString());

    this.deviceLogRepository.insert({
      data: buffer.toString(),
    });

    const newData = this.deviceDataRepository.create({
      deviceType,
      firmwareVersion,
      imei,
      deviceNumber,
      extendedTagNumber,
      extendedTagData,
      checksum,
    });

    return await this.deviceDataRepository.save(newData);
  }

  private parseHexPacket(packet: string) {
    let index = 12;

    // Tag 01 - Device Type
    const deviceType = packet.slice(index, index + 2);

    // Tag 02 - Firmware Version
    index += 3;
    const firmwareVersion = packet.slice(index, index + 3);

    // Tag 03 - IMEI
    index += 9;
    const imei = this.hex2a(packet.slice(index, index + 45));

    // Tag 04 - Device Number
    index += 48;
    const deviceNumber = packet.slice(index, index + 5);

    // Extended Tags
    index += 5;
    const extendedTagPresence = packet.slice(index, index + 3).trim();

    // Extended Tag Length
    index += 4;
    const extendedLength = packet.slice(index, index + 5);

    // Extended Tag Number
    index += 6;
    const extendedTagNumber = packet.slice(index, index + 5);

    // Extended Tag Data
    index += 5;
    const extendedTagData = packet.slice(index, index + 9).trim();

    // Checksum
    index += 13;
    const checksum = packet.slice(index, index + 5);

    return {
      deviceType,
      firmwareVersion,
      imei,
      deviceNumber,
      extendedTagPresence,
      extendedLength,
      extendedTagNumber,
      extendedTagData,
      checksum,
    };
  }

  private hex2a(hexString: string) {
    const cleanHex = hexString.replace(/\s+/g, '');
    const hexPairs = Array.from({ length: cleanHex.length / 2 }, (_, i) =>
      cleanHex.slice(i * 2, i * 2 + 2),
    );

    return hexPairs.reduce(
      (decodedString, hexPair) =>
        decodedString + String.fromCharCode(parseInt(hexPair, 16)),
      '',
    );
  }
}
