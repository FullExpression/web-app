# 🧑‍🦰 FullExpression Web App

FullExpression Web Application allow users to generate, see and interact with emotion recognition software.

## 🏷️ Main Features

### Emotion analysis in real time

Uses the webcam for capturing real time images and detect potential faces and emotions expressed.

### Emotion analysis from images

Allows users to generate emotional reports from their own images. The user can interact with the report by searching images, downloading a version of the report in excel format or downloading the images organized by the corresponding emotion classification.

## 🏃‍♂️ How to run

1. Run `npm install` in order to install all packages dependencies;
2. Run `npm start` to run the application in debug mode. Will be created a node service running on http://localhost:4200/.

## 🚋 CI/CD explanation

This projects has four main branches:

- The development branch where teams will develop features and fix bugs on daily bases;
- The main branch contains the code deployed to the production website;
- The release branch containing code from a development time point which eventually will be merge to main branch;
- The hotfix branch where developers quick fix bugs from the production code.

### Development

This is the branch where most of the work will be made. All new features will be created in this branch and most of non urgent bug will be fixed.

It is expected to be the the most unstable branch. Developers shouldn't be afraid to commit buggy code in this branch. Moreover, is encouraged to make small and daily commits and pulls in order to catch early bugs and quick fixed them. Also, to push daily code from this branch in order to prevent huge and potential headache merges.

Each time a pull is made to development branch, the build and deploy processes automatically starts. In case of success, the code is publish in [here](https://fl-web-app-development.web.app/).

You can verify the status of all build and deploy process [here](https://github.com/FullExpression/web-app/actions?query=workflow%3Apublish-development).

### Main

This is the most stable branch available and where the live web app will be deployed. Change to this branch should be well measure since could lead to erratic behavior on the live code.

New features should be added through the [release candidate branch](#Release-Candidate) and bug fixing through the [hotfix branch].

### Release Candidate

Each time a set of features or bug fixing is ready to production, a release candidate branch should be created. In here, the code should be deeply tested and bugs should be fixed until the release candidate is stable enough to be merged to the main branch and again to the development branch. The team should fix bugs directly on the release candidate branch.

### HotFix

*Eventually will have content here.*

## 🏘️Architecture

*Eventually will have content here.*

## Troubleshooting

*Eventually will have content here.*
