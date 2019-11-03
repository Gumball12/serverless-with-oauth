# serverless-with-oauth
[![JavaScript Style Guide: Good Parts](https://img.shields.io/badge/code%20style-goodparts-brightgreen.svg?style=flat)](https://github.com/dwyl/goodparts "JavaScript The Good Parts") [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues) [![Known Vulnerabilities](https://snyk.io//test/github/Gumball12/serverless-with-oauth/badge.svg?targetFile=package.json)](https://snyk.io//test/github/Gumball12/serverless-with-oauth?targetFile=package.json)

<p align="center"><img alt="thumbnail" style="max-height: 400px" src="https://i.imgur.com/cFciRLc.png"></p>

### 🔒OAuth2.0 protocol implemented via ⚡️AWS Serverless architecture
We implemented the _[OAuth2.0 Standard Protocol (RFC 6749)](https://tools.ietf.org/html/rfc6749)_ via AWS Serverless architecture.

That protocol allows only authorized users to access web resources. Which means that we have implemented a _secure-web-service_.

> Development documentation is available on the 📄 [Wiki](https://github.com/Gumball12/serverless-with-oauth/wiki) page

> And, of course, you can contribute through the 🔧 [Issues](https://github.com/Gumball12/serverless-with-oauth/issues) page

_Thanks for reading! And if it helps, you can start it!_ ⭐️

### 🐧 Team Members
* [김성규](https://github.com/timosarang)
* [고한설](https://github.com/rhgkstjf)
* [서해준](https://github.com/Gumball12)
* [송재헌](https://github.com/JaehunSong)
* [양철주](https://github.com/ycj1212)

## Service Flow
### OAuth2.0 Flow
<p align="center"><img alt="oauth flow" style="max-height: 400px" src="https://i.imgur.com/Bp8n5XV.png"></p>

#### Processes
* Process 1: Access to Protected Resources
* Process 2: Issue an `Auth Grant`
* Process 3: Issue an `Access Token`
* Process 4: Reissue an `Access Token`

#### Vulnerabilities
* MITM Attack
* Guessing Attack
* CSRF

### AWS Flow
<p align="center"><img alt="aws flow" style="max-height: 400px" src="https://i.imgur.com/B09PSmO.png"></p>

* OAuth modules
  * `Resource Server`
  * `Authorization Server`
  * `Resource Owner`

## Dependencies
### Backend
Using Python, Javascript

* AWS; _Lambda, Cloudwatch, SNS, ES, S3, CloudFront, API Gateway_

### Frontend
Using Javascript

* Vue; _vuetify, vue-router, vuex, vue-the-mask_
* Dependencies; _js-cookie with vuex-persistedstate, axios, uuid, lodash_
* Dev-Dependencies; _eslint, sass_

### Reference
* [[1] HARDT, Dick. The OAuth 2.0 authorization framework. 2012.](https://tools.ietf.org/html/rfc6749)
* [[2] JONES, M.; BRADLEY, J.; SAKIMURA, N. Rfc 7519: Json web token (jwt). Date of retrieval, 2015, 5: 2017.](https://tools.ietf.org/html/rfc7519)
