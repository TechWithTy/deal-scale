https://docs.strapi.io/cms/quick-start
Quick Start Guide

Strapi offers a lot of flexibility. Whether you want to go fast and quickly see the final result, or would rather dive deeper into the product, we got you covered. For this tutorial, we'll go for the DIY approach and build a project and content structure from scratch, then deploy your project to Strapi Cloud to add data from there.

Estimated completion time: 5-10 minutes
Prerequisites

Before installing Strapi, the following requirements must be installed on your computer:

    Node.js: Only Active LTS or Maintenance LTS versions are supported (currently v20 and v22). Odd-number releases of Node, known as "current" versions of Node.js, are not supported (e.g. v21, v23).
    Your preferred Node.js package manager:
        npm (v6 and above)
        yarn
        pnpm
    Python (if using a SQLite database)

You will also need to install `git` and to have a GitHub account to deploy your project to Strapi Cloud.
Part A: Create a new project with Strapi

We will first create a new Strapi project on your machine by running a command in the terminal, and then register our first local administrator user.

Follow the steps below by clicking on the togglable content to read more instructions.
Step 1: Run the installation script and create a Strapi Cloud account
Step 1: Run the installation script and create a Strapi Cloud account

Run the following command in a terminal:

npx create-strapi@latest my-strapi-project

    The terminal will invite you to create a Strapi Cloud account and start a free, 14-day trial. Ensure Login/Sign up is selected in the terminal, or use arrow keys to select it, and press Enter.

    In the new browser tab that opens, ensure the confirmation code is the same as in the terminal and click Confirm.

    Still in the browser tab, click Continue with GitHub. If you are not already logged in into GitHub with your current browser session, you might be redirected to a GitHub login page.

    Once logged in, the browser will display a "Congratulations, you're all set!" message and you can safely close the browser tab and get back to the terminal.
    Login GIF

    The terminal will now ask you a few questions. Press Enter to accept the default answer to all questions.

    Questions and answers from the terminal

As you will see in the terminal, your project is now building locally.
Info

    The folder of your project will include a .strapi-cloud.json file used to link the local Strapi project on your machine to the Strapi Cloud project.
    Many more installation options are available. Please refer to the installation documentation for details.

Step 2: Register the first local administrator user
Congratulations!

You have just created a new Strapi project! You can start playing with Strapi and discover the Content Manager by yourself, or proceed to part B below.
Part B: Build your content structure with the Content-type Builder

The installation script has just created an empty project. We will now guide you through creating a restaurants directory, inspired by our FoodAdvisor example application.

The admin panel of a local Strapi project runs at http://localhost:1337/admin. This is where you will spend most of your time creating and updating content.

First we will build a content structure for your content. This can only be done while in development mode, which is the default mode for projects that are created locally.
Tip

If the server is not already running, in your terminal, cd into the my-strapi-project folder and run npm run develop (or yarn develop) to launch it.

The Content-Type Builder helps you create your content structure. When creating an empty project with Strapi, this is where to get the party started!
Step 1: Create a "Restaurant" collection type
Step 2: Create a "Category" collection type
Congratulations!

You have just created a basic content structure for your Strapi project! You can keep on playing with the Content-Type Builder, or proceed to parts C and D below to discover Strapi Cloud and add actual content to your project.
️ Part C: Deploy to Strapi Cloud

Now that your beautiful first Strapi project is working locally, it's time for the world to see it live! The most straightforward way to host your project is to use Strapi Cloud: Deploying your project on Strapi Cloud is done with a single command! 🚀

To deploy your project on Strapi Cloud, in your terminal:

    If the server for your local Strapi project is running, which should be the case if you followed this tutorial so far, press Ctrl-C to stop the server.

    Ensure you are in the folder of your Strapi project (if needed, run for instance cd my-strapi-project to reach this folder), and run the following command:
        Yarn
        NPM

    yarn strapi deploy

    Answer questions in the terminal, giving your project a name (you can press Enter to keep the default name), choosing the recommended NodeJS version, and selecting the region closer to your current place:

    Strapi Cloud terminal questions and answers

Within a few moments, your local project will be hosted on Strapi Cloud. 🚀

Once it's done, the terminal will provide you a clickable link that starts with https://cloud.strapi.io/projects. Click on the link, or copy and paste it in your browser address bar, to visit the page.

You will see the Strapi Cloud project we've just created, my-strapi-project, visible in the Strapi Cloud dashboard. Click the Visit app button in the top right corner to access your deployed Strapi project.
Visit Strapi Cloud App GIF
Congratulations!

Now your project is hosted on Strapi Cloud and accessible online. Enjoy your 14-day free Strapi Cloud trial! You can learn more about Strapi Cloud by reading its dedicated documentation or proceed to part D to log in into your online Strapi project and add your first data from there.
Tip

Feel free to play with the Content-Type Builder even further and add more fields to your content-types or create new content-types. Anytime you make such changes, deploy them again on Strapi Cloud, by running the appropriate deploy command, and see your hosted project updated within a few minutes. Magical, isn't it? 🪄
Part D: Add content to your Strapi Cloud project with the Content Manager

Now that we have created a basic content structure with 2 collection types, "Restaurant" and "Category", and deployed your project to Strapi Cloud, let's use the Cloud to actually add content by creating new entries.
Step 1: Log in to the admin panel of your new Strapi Cloud project
Step 2: Create an entry for the "Restaurant" collection type
Step 3: Add Categories
Step 4: Set Roles & Permissions
Step 5: Publish the content
Step 6: Use the API
Congratulations!

Now your content is created, published, and you have permissions to request it through the API. Keep on creating amazing content!
Tip: Transfer data between your local and Strapi Cloud projects

The databases for your Strapi Cloud project and your local project are different. This means that data is not automatically synchronized between your Strapi Cloud and local projects. You can use the data management system to transfer data between projects.
What to do next?

Now that you know the basics of creating and publishing content with Strapi, we encourage you to explore and dig deeper into some Strapi features:

learn how to use Strapi's REST API to query the content,
learn more about Strapi features by browsing the Features category,
learn more about Strapi Cloud projects by reading the Cloud Documentation,
and customize your Strapi back end and admin panel for advanced use cases.
Tags:

    guidesContent-type Buildercollection typeContent ManagerStrapi Cloud