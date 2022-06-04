import type { ScreenDetails } from '@/@types/ScreenDetails'

const apps: ScreenDetails = {
  title: 'Applications',
  subtitle: 'Programmable Voice Applications.',
  description:
    'Use this section to connect your DialogFlow Agents with your Numbers.',
  docs: {
    url: '',
    title: 'Create an Application with the NodeSDK',
    description:
      'All features in Fonoster are designed to be API first. You can always interact with this service from your applications using one of our SDKs.',
    tableContent: {
      headers: ['Param', 'Description'],
      rows: [
        ['name: string', 'The name of the application'],
        ['initialDtmf: string', 'Optional intitial DTMF'],
        ['activationIntentId: string', 'Activation intent ID'],
        ['interactionTimeout: number', 'Timeout, to ask again for user input'],
        ['transfer: TransferConfig', 'Transfer configuration object'],
        ['speechConfig: SpeechConfig', 'Speech configuration object'],
        ['intentsEngineConfig: IntentsEngineConfig', 'Intents engine configuration object'],
      ],
    },
    example: `
    const Fonoster = require("@fonoster/sdk")
    const apps = new Fonoster.Apps()
    
    const request = {
      name: "Clever Tube",
      initialDtmf: "12",
      speechConfig: {
        secretName: "clever-tube-secret",
        voice: "en-US-Wavenet-F"
      },
      intentsEngineConfig: {
        secretName: "clever-tube-secret",
        projectId: "clever-tube-275321"
      }
    }
    
    apps.createApp(request)
      .then(console.log)
      .catch(console.error)  
    `,
  },
}

const trunks: ScreenDetails = {
  title: 'SIP Network',
  subtitle: 'Trunks',
  description:
    'Use this section to configure your VoIP Providers for inbound and outbound calls to the PSTN.',
  docs: {
    url: '',
    title: 'Creating a Trunk with the NodeSDK',
    description:
      'All features in Fonoster are designed to be API first. You can always interact with this service from your applications using one of our SDKs.',
    tableContent: {
      headers: ['Param', 'Description'],
      rows: [
        ['name: string', 'Friendly name'],
        ['type: enum', 'Type of value'],
        ['value: string', 'Value of secret'],
      ],
    },
    example: `
    const Fonoster = require("@fonoster/sdk");
    const providers = new Fonoster.Providers();
    
    const request = {
      name: "SIP Provider",
      username: "trunk001",
      secret: "secretkey",
      host: "sip.provider.net"
    };
    
    providers.createProvider(request)
      .then(console.log).catch(console.error);`,
  },
}

const numbers: ScreenDetails = {
  title: 'SIP Network',
  subtitle: 'Phone Numbers',
  description:
    'You will need a Number to make and receive calls from traditional phones.',
  docs: {
    url: '',
    title: 'Creating a Secret with the NodeSDK',
    description:
      'All features in Fonoster are designed to be API first. You can always interact with this service from your applications using one of our SDKs.',
    tableContent: {
      headers: ['Param', 'Description'],
      rows: [
        ['name: string', 'Friendly name'],
        ['type: enum', 'Type of value'],
        ['value: string', 'Value of secret'],
      ],
    },
    example: `
      const Fonoster = require("@fonoster/sdk");
      const providers = new Fonoster.Providers();
  
      const request = {
        name: "SIP Provider",
        username: "trunk001",
        secret: "secretkey",
        host: "sip.provider.net"
      };
  
      providers.createProvider(request)
      .then(result => {
        console.log(result)             // successful response
      }).catch(e => console.error(e));   // an error occurred`,
  },
}

const domains: ScreenDetails = {
  title: 'SIP Network',
  subtitle: 'Domains for internal communications.',
  description:
    'A SIP Domain will group several SIP Agents. (e.g office, home, etc)',
  docs: {
    url: '',
    title: 'Creating a Secret with the NodeSDK',
    description:
      'All features in Fonoster are designed to be API first. You can always interact with this service from your applications using one of our SDKs.',
    tableContent: {
      headers: ['Param', 'Description'],
      rows: [
        ['name: string', 'Friendly name'],
        ['type: enum', 'Type of value'],
        ['value: string', 'Value of secret'],
      ],
    },
    example: `
      const Fonoster = require("@fonoster/sdk");
      const providers = new Fonoster.Providers();
  
      const request = {
        name: "SIP Provider",
        username: "trunk001",
        secret: "secretkey",
        host: "sip.provider.net"
      };
  
      providers.createProvider(request)
      .then(result => {
        console.log(result)             // successful response
      }).catch(e => console.error(e));   // an error occurred`,
  },
}

const agents: ScreenDetails = {
  title: 'SIP Network',
  subtitle: 'Agent for your internal communications.',
  description:
    'SIP Agents in the same Domain can call each other with Voice Over IP using a Software Phone (e.g Zoiper)',
  docs: {
    url: '',
    title: 'Creating a Secret with the NodeSDK',
    description:
      'All features in Fonoster are designed to be API first. You can always interact with this service from your applications using one of our SDKs.',
    tableContent: {
      headers: ['Param', 'Description'],
      rows: [
        ['name: string', 'Friendly name'],
        ['type: enum', 'Type of value'],
        ['value: string', 'Value of secret'],
      ],
    },
    example: `
      const Fonoster = require("@fonoster/sdk");
      const providers = new Fonoster.Providers();
  
      const request = {
        name: "SIP Provider",
        username: "trunk001",
        secret: "secretkey",
        host: "sip.provider.net"
      };
  
      providers.createProvider(request)
      .then(result => {
        console.log(result)             // successful response
      }).catch(e => console.error(e));   // an error occurred`,
  },
}

const secrets: ScreenDetails = {
  title: 'Secrets Management',
  subtitle: 'Safeguard your credentials in the Secrets Vault.',
  description:
    'Secrets are encrypted variables that you can you use in your Voice Applications and APIs. Your secrets are only available for use within the Project.',
  docs: {
    url: '',
    title: 'Creating a Secret with the NodeSDK',
    description:
      'All features in Fonoster are designed to be API first. You can always interact with this service from your applications using one of our SDKs.',
    tableContent: {
      headers: ['Param', 'Description'],
      rows: [
        ['name: string', 'Friendly name'],
        ['type: enum', 'Type of value'],
        ['value: string', 'Value of secret'],
      ],
    },
    example: `
    const Fonoster = require("@fonoster/sdk");
    const providers = new Fonoster.Providers();

    const request = {
      name: "SIP Provider",
      username: "trunk001",
      secret: "secretkey",
      host: "sip.provider.net"
    };

    providers.createProvider(request)
    .then(result => {
      console.log(result)             // successful response
    }).catch(e => console.error(e));   // an error occurred`,
  },
}

export { agents, apps, domains, numbers, secrets, trunks }
