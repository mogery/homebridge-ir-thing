class IRThing {
    on = false;
    brightness = 100;
    temperature = 140;

    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;

        this.log.debug("IRThing loaded!");

        this.informationService = new this.api.hap.Service.AccessoryInformation()
            .setCharacteristic(this.api.hap.Characteristic.Manufacturer, "mogery")
            .setCharacteristic(this.api.hap.Characteristic.Model, "IRThing");
        
        this.service = new this.Service(this.Service.Lightbulb);
        
        this.service.getCharacteristic(this.api.hap.Characteristic.On)
            .onGet(this.handleOnGet.bind(this))
            .onSet(this.handleOnSet.bind(this));

        this.service.getCharacteristic(this.api.hap.Characteristic.Brightness)
            .onGet(this.handleBrightnessGet.bind(this))
            .onSet(this.handleBrightnessSet.bind(this));
        
        this.service.getCharacteristic(this.api.hap.Characteristic.ColorTemperature)
            .onGet(this.handleColorTemperatureGet.bind(this))
            .onSet(this.handleColorTemperatureSet.bind(this));
    }

    emitSetRequest() {
        const brightness = Math.round(this.brightness / (100 / 7));
        const temperature = Math.round((this.temperature - 140) / (360 / 7));
        fetch(`http://${this.config.ip}/lamp/${on ? "true" : "false"}/${brightness}/${temperature}`);
    }

    handleOnGet() {
        return this.on;
    }

    handleOnSet(on) {
        this.on = on;
        this.emitSetRequest();
    }

    handleBrightnessGet() {
        return this.brightness;
    }

    handleBrightnessSet(brightness) {
        this.brightness = brightness;
        this.emitSetRequest();
    }

    handleColorTemperatureGet() {
        return this.temperature;
    }

    handleColorTemperatureSet(temperature) {
        this.temperature = temperature;
        this.emitSetRequest();
    }
}

module.exports = (api) => {
    api.registerAccessory("IRThing", IRThing)
}