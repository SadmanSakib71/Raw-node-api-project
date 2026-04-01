//dependencies

//module object - scaffolding

const environments = {};

environments.staging = {
  port: 3000,
  envName: "staging",
  secretKey: "fdsfdsfdsfsd",
  maximumCheck: 5,
  twilio: {
    fromPhone: "",
  },
};

environments.production = {
  port: 5000,
  envName: "production",
  secretKey: "fdsfdsfdsgfffsd",
  maximumCheck: 5,
  twilio: {
    fromPhone: "",
  },
};

//determine which environment was passed

const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

//export corresponding environment object

const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

module.exports = environmentToExport;
