import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { log } from "console";

@Injectable()
export class ReleaseResourceServiceService implements OnModuleDestroy {
  onModuleDestroy() {
    console.log('Releasing resources...');
    this.releaseAllResources();
  }

  releaseAllResources() {
    console.log('All resources have been released.');
  }
}