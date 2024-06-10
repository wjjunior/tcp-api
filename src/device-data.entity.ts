import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class DeviceData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  deviceType: string;

  @Column()
  firmwareVersion: string;

  @Column()
  imei: string;

  @Column()
  deviceNumber: string;

  @Column()
  extendedTagNumber: string;

  @Column()
  extendedTagData: string;

  @Column()
  checksum: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
