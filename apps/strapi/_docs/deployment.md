Deployment

Strapi provides many deployment options for your project or application. Your Strapi applications can be deployed on traditional hosting servers or your preferred hosting provider.

The following documentation covers the basics of how to prepare Strapi for deployment on with several common hosting options.
Strapi Cloud

You can use Strapi Cloud to quickly deploy and host your project.
Tip

If you already created a content structure with the Content-Type Builder and added some data through the Content Manager to your local (development) Strapi instance, you can leverage the data management system to transfer data from a Strapi instance to another one.

Another possible workflow is to first create the content structure locally, push your project to a git-based repository, deploy the changes to production, and only then add content to the production instance.
General guidelines Hardware and software requirements

To provide the best possible environment for Strapi the following requirements apply to development (local) and staging and production workflows.

Before installing Strapi, the following requirements must be installed on your computer:

    Node.js: Only Active LTS or Maintenance LTS versions are supported (currently v20 and v22). Odd-number releases of Node, known as "current" versions of Node.js, are not supported (e.g. v21, v23).
    Your preferred Node.js package manager:
        npm (v6 and above)
        yarn
        pnpm
    Python (if using a SQLite database)

    Standard build tools for your OS (the build-essentials package on most Debian-based systems)

    Hardware specifications for your server (CPU, RAM, storage):
    Hardware	Recommended	Minimum
    CPU	2+ cores	1 core
    Memory	4GB+	2GB
    Disk	32GB+	8GB

    A supported database version:

Database	Recommended	Minimum
MySQL	8.0	8.0
MariaDB	10.6	10.5
PostgreSQL	14.0	12.0
SQLite	3	3
Database deployment

Deploying databases along with Strapi is covered in the databases guide.

    A supported operating system:
    Operating System	Recommended	Minimum
    Ubuntu (LTS)	22.04	20.04
    Debian	11.x	10.x
    CentOS/RHEL	9.x	8.x
    macOS	11.0	10.15
    Windows Desktop	11	10
    Windows Server	2022	2019

Application Configuration
1. Configure

We recommend using environment variables to configure your application based on the environment, for example:
/config/server.js


module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
});

Then you can create a .env file or directly set environment variables in your chosen deployment platform:

HOST=10.0.0.1
PORT=1338

Tip

To learn more about configuration details, see the configurations documentation.
2. Launch the server

Before running your server in production you need to build your admin panel for production:

    yarn
    npm
    windows

NODE_ENV=production yarn build

Run the server with the production settings:

    yarn
    npm
    windows

NODE_ENV=production yarn start

Caution

We highly recommend using pm2 to manage your process.

If you need a server.js file to be able to run node server.js instead of npm run start then create a ./server.js file as follows:
path: ./server.js


const strapi = require('@strapi/strapi');
strapi.createStrapi(/* {...} */).start();

Caution

If you are developing a TypeScript-based project you must provide the distDir option to start the server. For more information, consult the TypeScript documentation.
Advanced configurations

If you want to host the administration on another server than the API, please take a look at this dedicated section.
Additional resources
Prerequisites

    Your Strapi project is created and its code is hosted on GitHub.
    You have read the general deployment guidelines.

The integrations page of the Strapi website include information on how to integrate Strapi with many resources, including how to deploy Strapi on the following 3rd-party platforms:
Deploy Strapi on AWS
Deploy Strapi on Azure
Deploy Strapi on DigitalOcean App Platform
Deploy Strapi on Heroku

In addition, community-maintained guides for additional providers are available in the Strapi Forum. This includes the following guides:
Proxying with Caddy
Proxying with HAProxy
Proxying with NGinx
Using the PM2 process manager

The following external guide(s), not officially maintained by Strapi, might also help deploy Strapi on various environments:
[Microsoft Community] Deploying on Azure
Multi-tenancy

If you're looking for multi-tenancy options, the Strapi Blog has a comprehensive guide.
Tags:

    database deploymentdeploymentproject creationhosting providerhosting server