import {
  AccessoryPlugin,
  Formats,
  Perms,
  Characteristic,
  CharacteristicGetCallback,
  CharacteristicSetCallback,
  CharacteristicValue,
  HAP,
  Logging,
  Service,
  CharacteristicEventTypes
} from "homebridge";

export class ACModeSelector extends Characteristic {
    public static readonly UUID: string = "0007108F-0000-1000-8000-0026BB765291";
  
    public static readonly TURNOFF_RESEVATION = 0;
    public static readonly COOLING = 1;
    public static readonly DEHUMIDIFY = 2;
  
    constructor() {
      super("Air Control Mode", ACModeSelector.UUID, {
        format: Formats.UINT8,
        perms: [Perms.NOTIFY, Perms.PAIRED_READ, Perms.PAIRED_WRITE],
        minValue: 0,
        maxValue: 2,
        minStep: 1,
        validValues: [0, 1, 2],
      });
      this.value = this.getDefaultValue();
    }
  }

export class AirConditioner implements AccessoryPlugin {

  private readonly log: Logging;

  private switchOn = false;

  // This property must be existent!!
  name: string;

  private readonly switchService: Service;
  private readonly informationService: Service;

  constructor(hap: HAP, log: Logging, name: string) {
    this.log = log;
    this.name = name;

    this.switchService = new hap.Service.Switch(name);
    this.switchService.getCharacteristic(hap.Characteristic.On)
      .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
        log.info("Current state of the switch was returned: " + (this.switchOn? "ON": "OFF"));
        callback(undefined, this.switchOn);
      })
      .on(CharacteristicEventTypes.SET, (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
        this.switchOn = value as boolean;
        log.info("Switch state was set to: " + (this.switchOn? "ON": "OFF"));
        callback();
      });

    this.informationService = new hap.Service.AccessoryInformation()
      .setCharacteristic(hap.Characteristic.Manufacturer, "jkh")
      .setCharacteristic(hap.Characteristic.Model, "version 1.0.0")

    // this.acmodecontol = new ACModeSelector();
    // this.switchService.addCharacteristic(this.acmodecontol);

    this.switchService.addCharacteristic(hap.Characteristic.CoolingThresholdTemperature).displayName = "온도";
    this.switchService.setCharacteristic(hap.Characteristic.CoolingThresholdTemperature, 27);

    /*
      // https://github.com/homebridge/HAP-NodeJS/blob/master/src/lib/definitions/CharacteristicDefinitions.ts
      public static readonly INACTIVE = 0;
      public static readonly IDLE = 1;
      public static readonly BLOWING_AIR = 2;
      */
    this.switchService.addCharacteristic(hap.Characteristic.CurrentFanState).displayName = "모드";
    this.switchService.setCharacteristic(hap.Characteristic.CurrentFanState, 2);

    //this.switchService.setCharacteristic(this.acmodecontol, "");
    //this.switchService.addOptionalCharacteristic

    /*
    this.controlService = new hap.Service.Thermostat("모드");
    this.controlService.getCharacteristic(hap.Characteristic.TargetHeatingCoolingState).setProps({
        maxValue: 3,
        minValue: 0,
        validValues: [0, 3]
      })
      */

    log.info("airconditioner '%s' created!", name);
  }

  identify(): void {
    this.log("Identify!");
  }

  getServices(): Service[] {
    return [
      this.informationService,
      this.switchService
    ];
  }

}
