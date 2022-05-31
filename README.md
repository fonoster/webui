# Fonoster — Web UI

Web UI to create powerful voice applications with Fonoster's API

### Technical details

| Environment       | Deployed version | Link                                                   |
|-------------------|------------------|--------------------------------------------------------|
| Development       | v0.2.15          | [Go to](http://localhost:3000/)                        |
| Staging           | v0.2.15          | N/A                                                    |
| Production        | v0.0.0           | N/A                                                    |

### Getting Started

> These instructions will get you a copy of the project up and
> running on your local machine for development and testing purposes.

#### Technologies stack

| Tool                 | Description                                                         |
| -------------------- | ------------------------------------------------------------------- |
| Next.js              | Development platform. Framework for server-side apps using React    |
| Docker               | Infrastructure provisioning                                         |
| TypeScript           | Programing language. Types reduce bugs & increases reliability      |
| Bash scripts	       | Used for development management                                     |
| EsLint & Prettier	   | Code style enforcer                                                 |

#### Starting app in development mode

```shell
npm run dev

# or

yarn dev
```

#### Considerations, restrictions and values

- The components within each layer are cohesive.
- Restricts validation rejects and disinfects malicious input.
- Don't disable ESLint or Prettier rules.
- Follow the architectural styles and patterns of the project.
- Follow the merge template correctly.
- The sensitive information of the project must be in environment variables.
- Evaluate the use of dependencies. (Build or install)
- Please install the [VScode recommendations](/.vscode/extensions.json) to improve your code style.

#### Bugs and Feedback

For bugs, questions, and discussions, please use the [Github Issues](https://github.com/fonoster/webapp/issues)

#### Authors

- [Pedro Sanders](https://github.com/psanders)
- [Efra](https://github.com/efraa)

#### License

Copyright (C) 2022 by [Fonoster Inc](https://fonoster.com). MIT License (see [LICENSE](/LICENSE) for details).

