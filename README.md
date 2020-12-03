# graveyard

### Description
Graveyard is a serverless application for providing ban information on commands issued specifically by Destiny in the destying.gg chat. 
The service provides ban information for the last 5 days and is sourced from https://overrustlelogs.net/.

The service is hosted on AWS and can be deployed in your own environment using the Serverless framework. The front-end is a small vue app for display purposes, hosted in s3 behind cloudfront.

Site is live at: https://graveyard.st.lk

Feature requests and code contributions are welcome.

### Files
`serverless.yml`
Serverless framework configuration file

`bans.js`
Lambda code for parsing logs and returning banned users

`www/`
Front-end Vue application
