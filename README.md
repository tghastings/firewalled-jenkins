# Firewalled Jenkins ![a-RESTed Jenkins](https://image.ibb.co/dDKyov/firewall_jenkins.jpg)
A simple nodejs application that utilizes Jenkins' REST API which allows users to view build logs and kick off new builds. This is used primarily by developers that work offsite and can't access Jenkins build servers due to firewall restrictions.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

This application requires LDAP for authentication. In addition to LDAP the following are also required:

```
nodejs: ">=6.9"
npm: ">=3.10.10"
MySQL ">=5.5"
```
if you want to run your mysql from a docker container you can use this command:

    docker run -d -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=database -p 3306:3306 mysql

### Installing

Clone the repository and cd into the new directory, run:

```
npm install
```

### Environment Variables
The following environment variables must be set:

#### Database (MySQL):

    MYSQL_HOST=localhost
    MYSQL_USER=root
    MYSQL_PASSWORD=password
    MYSQL_DATABASE=database

#### LDAP:

    LDAP_URL=ldaps://ldap.example.com:636
    LDAP_ADMINDN=uid=myadminusername,ou=users,o=example.com
    LDAP_PASSWORD=myadminsuserpassword
    LDAP_SEARCHBASE=ou=users,o=example.com

## Development

```
node app.js
```

## Production

```
node app.js --prod
```

## Built With

* [Sails](http://sailsjs.com/) - MVC Framework
* [nodejs](https://nodejs.org/en/) - JavaScript Runtime
* [npm](https://www.npmjs.com/) - Dependency Management
* [Bootstrap](http://getbootstrap.com/) - HTML, CSS, JS front-end framework

## Authors

* **Thomas "Tom" Hastings** - *Initial work* - [PolarisAlpha](https://github.com/PolarisAlpha)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments
Thank you to the following projects for providing elements for this project:
* [crypto-js](https://github.com/brix/crypto-js) - Encryption Module
* [node-ldapauth-fork](https://github.com/vesse/node-ldapauth-fork) - LDAP Authentication
* [node-jenkins-api](https://github.com/jansepar/node-jenkins-api/) - Node Jenkins API