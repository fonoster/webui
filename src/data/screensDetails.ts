import type { ScreenDetails } from '@/@types/ScreenDetails'

const apps: ScreenDetails = {
  title: 'Applications',
  subtitle: 'Programmable Voice Applications.',
  description:
    'Use this section to connect your DialogFlow Agents with your Numbers.',
}

const trunks: ScreenDetails = {
  title: 'SIP Network',
  subtitle: 'Trunks',
  description:
    'Use this section to configure your VoIP Providers for inbound and outbound calls to the PSTN.',
}

const numbers: ScreenDetails = {
  title: 'SIP Network',
  subtitle: 'Phone Numbers',
  description:
    'You will need a Number to make and receive calls from traditional phones.',
}

const domains: ScreenDetails = {
  title: 'SIP Network',
  subtitle: 'Domains for internal communications.',
  description:
    'A SIP Domain will group several SIP Agents. (e.g office, home, etc)',
}

const agents: ScreenDetails = {
  title: 'SIP Network',
  subtitle: 'Agent for your internal communications.',
  description:
    'SIP Agents in the same Domain can call each other with Voice Over IP using a Software Phone (e.g Zoiper)',
}

const secrets: ScreenDetails = {
  title: 'Secrets Management',
  subtitle: 'Safeguard your credentials in a vault.',
  description:
    'Secrets are encrypted variables that you can you use in your Voice Applications. Your secrets are only available for use within the Project.',
  docs: {
    url: '',
    title: 'Create a Secret using our SDK',
    description:
      'You can always interact with Fonoster from your external applications with our SDK, all our features are available to allow its extensibility.',
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
