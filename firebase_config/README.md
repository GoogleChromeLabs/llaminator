# Firebase Config

To set up a Firebase Storage bucket to use with Llaminator, start by following
[Step
1](https://firebase.google.com/docs/web/setup#create-firebase-project-and-app)
of the Firebase getting started guide for web, and installing firebase-tools
(`npm -g install firebase-tools`).

The setup should give you a firebaseConfig object that you can put in
[firebase.ts](../src/firebase.ts).

Then, make a Google App Engine instance at
https://console.cloud.google.com/appengine for your Firebase project ([see
why](https://cloud.google.com/firestore/docs/app-engine-requirement)).

You'll also need to run `firebase login` at some point to authenticate yourself
and pick your firebase project with the command-line tools. You _may_ also need
to install [gcloud](https://cloud.google.com/sdk/docs/install) and run `gcloud
auth login` or `gcloud init` to select the corresponding App Engine project.

Once all that is out of the way, you can finally deploy the Firebase Storage
rules with `firebase deploy`. Yay.

But we're not done yet! You also have to set up a CORS configuration by running
the `gsutil` command shown
[here](https://firebase.google.com/docs/storage/web/download-files#cors_configuration).
