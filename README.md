# serverless-with-oauth
[![JavaScript Style Guide: Good Parts](https://img.shields.io/badge/code%20style-goodparts-brightgreen.svg?style=flat)](https://github.com/dwyl/goodparts "JavaScript The Good Parts") [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues) [![Known Vulnerabilities](https://snyk.io//test/github/Gumball12/serverless-with-oauth/badge.svg?targetFile=package.json)](https://snyk.io//test/github/Gumball12/serverless-with-oauth?targetFile=package.json)

![thumbnail](https://i.imgur.com/cFciRLc.png)

### 🔒OAuth2.0 protocol implemented via ⚡️AWS Serverless architecture
We implemented the _[OAuth2.0 Standard Protocol (RFC 6749)](https://tools.ietf.org/html/rfc6749)_ via AWS Serverless architecture.

That protocol allows oonly authorized users to access web resources. Which means that we have implemented a _secure-web-service_.

* [wiki](https://github.com/Gumball12/serverless-with-oauth/wiki)
* [issues](https://github.com/Gumball12/serverless-with-oauth/issues)
* []

### Team Members
* [김성규](https://github.com/timosarang)
* [고한설](https://github.com/rhgkstjf)
* [서해준](https://github.com/Gumball12)
* [송재헌](https://github.com/JaehunSong)
* [양철주](https://github.com/ycj1212)

### Service Flow
#### OAuth2.0 Flow
![oauth flow](https://camo.githubusercontent.com/f0841bb31d2e1307516b4f0bd5a19bb569b30f2d/68747470733a2f2f692e696d6775722e636f6d2f56743068454b782e706e67)

#### AWS Flow
![aws flow](https://i.imgur.com/pv7gXCL.png)

#### Web Service Flow
![web flow](https://i.imgur.com/cH38PI2.png)

### Dependencies
#### Backend
Using Python, Javascript

* AWS; _Lambda, Cloudwatch, SNS, ES_
* Dependencies;

#### Frontend
Using Javascript

* Vue; _vuetify, vue-router, vuex, vue-the-mask_
* Dependencies; _js-cookie with vuex-persistedstate, axios, uuid, lodash_
* Dev-Dependencies; _eslint, sass_

### Bibliography
* [D. Hardt, Ed., "The OAuth 2.0 Authorization Framework", RFC 6749, Oct 2012](https://tools.ietf.org/html/rfc6749)
* [Rich Ludeen, "The Deputies are Still Confused", Blackhat, Jan 2013](https://media.blackhat.com/eu-13/briefings/Lundeen/bh-eu-13-deputies-still-confused-lundeen-wp.pdf)
* [Jim Manico, Cross-Side Request Forgery Prevention in "OWASP Cheat Sheet Series", OWASP, Sep 2019](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.md)
