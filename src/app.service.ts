import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private count = 0;
  getHello(): {count: number} {
    this.count++;
    return {count: this.count};
  }
}
