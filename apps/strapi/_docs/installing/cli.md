Installing from CLI

Strapi CLI (Command Line Interface) installation scripts are the fastest way to get Strapi running locally. The following guide is the installation option most recommended by Strapi.
Preparing the installation

Before installing Strapi, the following requirements must be installed on your computer:

    Node.js: Only Active LTS or Maintenance LTS versions are supported (currently v20 and v22). Odd-number releases of Node, known as "current" versions of Node.js, are not supported (e.g. v21, v23).
    Your preferred Node.js package manager:
        npm (v6 and above)
        yarn
        pnpm
    Python (if using a SQLite database)

A supported database is also required for any Strapi project:
Database	Recommended	Minimum
MySQL	8.4	8.0
MariaDB	11.4	10.3
PostgreSQL	17.0	14.0
SQLite	3	3
Caution

Strapi does not support MongoDB (or any NoSQL databases), nor does it support any "Cloud Native" databases (e.g., Amazon Aurora, Google Cloud SQL, etc.)
Creating a Strapi project

Follow the steps below to create a new Strapi project, being sure to use the appropriate command for your installed package manager:

    In a terminal, run the following command:
        NPM
        Yarn
        pnpm

    npx create-strapi@latest

    Additional explanations for the command:

    The terminal will ask you whether you want to Login/Signup to Strapi Cloud (and start using your free 14-day trial projects), or Skip this step. Use arrow keys and press Enter to make your choice. If you choose to skip this step, you will need to host the project yourself.

    The terminal will ask you a few questions. For each of them, if you press Enter instead of typing something, the default answer (Yes) will be used:

Terminal prompts at installation
Tip

You can skip these questions using various options passed to the installation command. Please refer to the table for the full list of available options.

    (optional) If you answered n for "no" to the default (SQLite) database question, the CLI will ask for more questions about the database:
        Use arrow keys to select the database type you want, then press Enter.
        Give the database a name, define the database host address and port, define the database admin username and password, and define whether the database will use a SSL connection.
        For any of these questions, if you press Enter without typing anything, the default value (indicated in parentheses in the terminal output) will be used.

Once all questions have been answered, the script will start creating the Strapi project.
CLI installation options

The above installation guide only covers the basic installation option using the CLI. There are other options that can be used when creating a new Strapi project, for example:
Option	Description
--no-run	Do not start the application after it is created
--ts
--typescript	Initialize the project with TypeScript (default)
--js
--javascript	Initialize the project with JavaScript
--use-npm	Force the usage of npm as the project package manager
--use-yarn	Force the usage of yarn as the project package manager
--use-pnpm	Force the usage of pnpm as the project package manager
--install	Install all dependencies, skipping the related CLI prompt
--no-install	Do not install all dependencies, skipping the related CLI prompt
--git-init	Initialize a git repository, skipping the related CLI prompt
--no-git-init	Do not initialize a git repository, skipping the related CLI prompt
--example	Add example data, skipping the related CLI prompt
--no-example	Do not add example data, skipping the related CLI prompt
--skip-cloud	Skip Strapi Cloud login and project creation steps
--skip-db	Skip all database-related prompts and create a project with the default (SQLite) database
--template <template-name-or-url>	Create the application based on a given template.
Additional options for templates are available, see the templates documentation for details.
--dbclient <dbclient>	Define the database client to use by replacing <dbclient> in the command by one of the these values:

    sql for a SQLite database (default)
    postgres for a PostgreSQL database
    mysql for a MySQL database

--dbhost <dbhost>	Define the database host to use by replacing <dbhost> in the command by the value of your choice
--dbport <dbport>	Define the database port to use by replacing <dbport> in the command by the value of your choice
--dbname <dbname>	Define the database name to use by replacing <dbname> in the command by the value of your choice
--dbusername <dbusername>	Define the database username to use by replacing <dbusername> in the command by the value of your choice
--dbpassword <dbpassword>	Define the database password to use by replacing <dbpassword> in the command by the value of your choice
--dbssl <dbssl>	Define that SSL is used with the database, by passing --dbssl=true (No SSL by default)
--dbfile <dbfile>	For SQLite databases, define the database file path to use by replacing <dbclient> in the command by the value of your choice
--quickstart	(Deprecated in Strapi 5)
Directly create the project in quickstart mode.
Notes

    If you do not pass a --use-yarn|npm|pnpm option, the installation script will use whatever package manager was used with the create command to install all dependencies (e.g., npm create strapi will install all the project's dependencies with npm).
    For additional information about database configuration, please refer to the database configuration documentation.
    Experimental Strapi versions are released every Tuesday through Saturday at midnight GMT. You can create a new Strapi application based on the latest experimental release using npx create-strapi@experimental. Please use these experimental builds at your own risk. It is not recommended to use them in production.

Skipping the Strapi Cloud login step

When the installation script runs, the terminal will first ask you if you want to login/signup. Choosing Login/signup will create a free, 14-day trial Strapi Cloud project as described in the Quick Start Guide.

If you prefer skipping this Strapi Cloud login part, use the arrow keys to select Skip. The script will resume and create a local project. To deploy this project and host it online, you could later choose to:

    host it yourself by pushing the project's code to a repository (e.g., on GitHub) before following the deployment guide,
    or use the Cloud CLI commands to login to Strapi Cloud and deploy your project there.

If you want to host your project yourself and are not already familiar with GitHub, the following togglable content should get you started👇.
Steps required to push your Strapi project code to GitHub:
Running Strapi

To start the Strapi application, run the following command in the project folder:

    Yarn
    NPM

yarn develop

Where is my content?

For self-hosted Strapi projects, all your content is saved in a database file (by default, SQLite) found in the .tmp subfolder in your project's folder. So anytime you start the Strapi application from the folder where you created your Strapi project, your content will be available (see database configuration for additional information).

If the content was added to a Strapi Cloud project, it is stored in the database managed with your Strapi Cloud project (see advanced database configuration for Strapi Cloud for additional information).
Tags:

    installationCommand Line Interface (CLI)databaseMySQLPostgreSQL