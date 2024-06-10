import { Injectable, OnModuleInit } from '@nestjs/common';
import * as net from 'net';
import { DeviceDataService } from './device-data.service';

@Injectable()
export class TcpServerService implements OnModuleInit {
  constructor(private readonly deviceDataService: DeviceDataService) {}

  onModuleInit() {
    this.startServer();
  }

  startServer() {
    const server = net.createServer((socket) => {
      socket.on('data', async (data) => {
        try {
          await this.deviceDataService.processAndSaveData(data);
          console.log('Data saved successfully');
        } catch (error) {
          console.error('Error saving data:', error);
        }
      });

      socket.on('error', (err) => {
        console.error('Socket error:', err);
      });

      socket.on('close', () => {
        console.log('Connection closed');
      });
    });

    server.listen(3000, '0.0.0.0', () => {
      console.log('TCP server listening on port 3000');
    });
  }
}
