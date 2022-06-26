import {AccessoryPlugin, API, HAP, Logging, PlatformConfig, StaticPlatformPlugin,} from "homebridge";
import {ExampleSwitch} from "./switch-accessory";
import {AirConditioner} from "./ac-accessory";


const PLATFORM_NAME = "Jkh's ESP32 Homebridge BOT";

let hap: HAP;

export = (api: API) => {
  hap = api.hap;

  api.registerPlatform(PLATFORM_NAME, ebotControlPlatform);
};

class ebotControlPlatform implements StaticPlatformPlugin {

  private readonly log: Logging;

  constructor(log: Logging, config: PlatformConfig, api: API) {
    this.log = log;

    // probably parse config or something here

    log.info("ebot-jkh platform finished initializing!");
  }

  accessories(callback: (foundAccessories: AccessoryPlugin[]) => void): void {
    callback([
      new AirConditioner(hap, this.log, "에어컨")
      //new ExampleSwitch(hap, this.log, "Switch 2"),
    ]);
  }

}
