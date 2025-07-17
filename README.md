# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Deployment to Google Cloud Run

This app can be deployed to Google Cloud Run via the scripts available in the root.
To run the scripts it is required to have installed on your local machine `gcloud` cli and have configured it to access the GCP project [https://e2x.atlassian.net/wiki/spaces/KBA/pages/22637904006/Manual+deployment+to+GCP](https://e2x.atlassian.net/wiki/spaces/KBA/pages/22637904006/Manual+deployment+to+GCP)

- `localBuildAndDeploy.sh` creates the docker image locally using docker daemon runnning on your machine, and deploys the image to Google Cloud Run
- `gcpBuildAndDeploy.sh` uses Google Cloud Build to build the docker image, and deploys the image to Google Cloud Run. **Needs Cloud Build API to be enabled on the GCP project, also can go over the free tier allowance**

React deployment documentation: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
**This project has no tests at the moment.**

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
