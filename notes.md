# Notes
* [신청서](#application-form)
* [할 일들](#todos)
* [OAuth 설명](#oauth)
* [구현](#implementation)
* [의문점](#questions)

## Application-form
* AWS 서버리스 아키텍처 기반
  * OAuth 프로토콜 구현
    * 이는 로그인 부분에 사용됨
  * FaaS(Function as a Service) 웹 서비스 구현

AWS 서버리스 아키텍처 기반 OAuth 프로토콜과 FaaS 웹 서비스를 구현하였습니다. 구현된 OAuth 프로토콜은 웹 서비스의 로그인 부분에 사용되었습니다.

## Todos
* 성규한테 플로우 짜고 리뷰받음
  * 리뷰 후, 각 단계에 대한 설계서(흐름도) 작성

## OAuth
표준 문서의 이름은 [RFC 6749](https://tools.ietf.org/html/rfc6749)이며, 프로토콜 흐름은 다음과 같음.

```
     +--------+                               +---------------+
     |        |--(A)- Authorization Request ->|   Resource    |
     |        |                               |     Owner     |
     |        |<-(B)-- Authorization Grant ---|               |
     |        |                               +---------------+
     |        |
     |        |                               +---------------+
     |        |--(C)-- Authorization Grant -->| Authorization |
     | Client |                               |     Server    |
     |        |<-(D)----- Access Token -------|               |
     |        |                               +---------------+
     |        |
     |        |                               +---------------+
     |        |--(E)----- Access Token ------>|    Resource   |
     |        |                               |     Server    |
     |        |<-(F)--- Protected Resource ---|               |
     +--------+                               +---------------+
```

### 용어설명
OAuth를 구성하고 있는 주요 객체(_Roles_) 4 가지

* `Client`: `Resource Owner`의 `Protected Resource` 요청
* `Resource Owner`: `Protected Resource` 자원 권한 제공 (_`Access Token` 제공이 아님_)
* `Authorization Server`: `Authorization Grant` 확인 후 `Access Token` 제공
  * `Access Token`을 이렇게 따로 처리하기에, 잠재적인 정보 유출 위험 방지가 된다고 함
  * 물론 _Implicit_ 기법을 사용하여 그냥 바로 `Resource Owner`에서 `Access Token`을 제공하도록 할 수 있음. 이는 아래에서 다룸.
* `Resource Server`: `Access Token`을 확인하여 검증 후 Resource 반환

### 동작
1. __(A)__ `Client`가 `Resource Owner`에게 계정을 보내 권한(`Authorization Grant`)을 요청 (이를 _Resource Owner Password Credentials 방식_ 이라고 함)
2. __(B)__ `Resource Owner`가 계정 검증 후 `Authorization Grant` 또는 `Access Token`, `Refresh Token` 반환
    * 여기서 `Resource Owner`에게는 두 가지 옵션이 있다.
    * __1\. `Authorization Grant` 반환 (_Authorization Code_)__
      * `Authorization Server` 계층을 추가적으로 구현해줘야 하지만,
      * `Access Token` 반환을 따로 처리하기에, `Resource Owner`의 User-Agent와 같은 잠재적인 정보 유출 위험 방지가 됨
      * 즉, 사용자 계정 검증 따로, Access Token 반환 따로 구현하는 것
    * __2\. Token 반환 (_Implicit_)__
      * 바로 계정 검증 후 `Access Token`과 `Refresh Token`을 반환하는 것
      * `Authorization Server` 계층 구현은 필요없지만
      * 보안성이 낮아짐
3. __(C)__ `Authorization Grant`를 `Authorization Server`로 전송
4. __(D)__ `Authorization Server`는 이를 검증 후 `Access Token`, `Refresh Token` 반환
    * `Access Token`: 보호된 자원(`Protected Resource`)에 접근하기 위해 필요
    * `Refresh Token`: 발급받은 `Access Token`의 유효기간 만료 시, 새로운 `Access Token`을 얻기 위해 사용
5. __(E)__ 받은 `Access Token`을 이용해 `Resource Server`에 자원을 요청
6. __(F)__ `Resource Server`는 이를 검증 후 요청한 자원 반환

### 기타
* 물론 실제 서비스를 위해 OAuth를 사용하는 경우라면, Google의 Firebase나 Amazon의 Amazon Cognito와 같은 서비스를 사용하지 않고 직접 구현하는 이유가 무엇인지를 잘 생각해 보도록 한다.

* 우리는 `redirect_uri` 필드는 다루지 않는데, 이는 타 서비스에서 OAuth를 사용하는 것을 염두해 두지 않았기 때문

## Implementation
우리는 이를 어떻게 구현할 것인가?

### 흐름
![flow](https://i.imgur.com/p098abc.png)

1. 인가되지 않은 사용자가 `Resource Server`에 접근하여, _보호된 자원_ 을 요청

2. 이 경우 로그인 페이지로 Redirection을 진행한다.

3. `Client`는 로그인 페이지에서 아이디와 패스워드를 입력/전송
    * SSL 사용

4. `Resource Owner`는 `DB`에서 유저 정보 가져옴

5. 검증 여부에 따라 인증서(Grant)가 발급되거나, 인증 실패가 반환됨
    * 인증 실패 시, 재 로그인이 필요

6. `Client`는 인증서를 `Authorization Server`로 전송

7. `Authorization Server`는 `DB`에서 인증서 정보를 가져옴

8. 검증 여부에 따라 Token이 발급되거나, 인증 실패가 반환됨
    * `Access Token`을 통해 보호된 자원을 요청할 수 있음
    * `Refresh Token`은 `Access Token`을 새로이 발급받기 위해 사용

9. `Client`는 `Access Token`과 함께 보호된 자원을 요청

10. `Resource Server`는 `DB`에서 토큰 정보를 가져옴

11. 검증 여부에 따라 리소스가 반환되거나, 인증 실패가 반환됨

12. `Client`는 새로운 `Access Token`을 발급받기 위해 `Authorization Server`로 `Refresh Token`을 전송

13. `Authorization Server`는 `DB`에서 토큰 정보를 가져옴

14. 검증 여부에 따라 `Access Token`과 `Refresh Token`이 발급되거나, 인증 실패가 반환됨

### Algorithm
세부 동작은 다음과 같음

#### 1. Access Token 없이 리소스 접근 / 서비스 이용 시도
1. `Resource Server`는 `Client`에서 보낸 데이터를 확인함

2. `Access Token`이 있으면 리소스 반환 (_http 200_)

3. 없으면 인증 실패 반환 (_http 401_)

#### 2. 로그인 페이지로 Redirection
1. 현재는 `Access Token`을 아직 발급받지 않은 상태

2. 따라서 http 401을 반환하여 인가되지 않은 사용자임을 반환

#### 3. 아이디와 패스워드 전송
1. `Access Token`을 얻기 위해서는 인증서를 먼저 발급받아야 함

2. 이를 위해 `Resource Owner`에게 아이디와 패스워드를 전송

#### 4. 유저 정보 가져옴
1. `Resource Owner`는 전송된 `Client`의 정보를 검증하기 위해

2. `DB/Users`에서 유저의 정보를 가져온 뒤, 검증을 진행
    * Password가 Hashed 되었음을 유의

유저 정보는 다음과 같음

```json
"DB/Users": {
  "userId": "String", // user id (unique)
  "name": "String", // user name
  "password": "String" // * hashed *
}
```

* `userId: <String>`: 사용자의 아이디
* `name: <String>`: 사용자 이름
* `password: <String>`: 사용자 비밀번호 (_해싱됨_)

#### 5. 인증서 발급 / 인증 실패
1. 검증 여부에 따라 인증서가 발급되거나 (_http 200_)
    * '발급'은 인증서의 `id`와 인증서 검증값(`validation`)을 전송함을 의미함
    * `DB/Grants`에 발급된 인증서 append

2. 유저 정보 인증 실패가 반환 (_http 401_)

인증서 내용은 다음과 같이 저장되어있음

```json
"DB/Grants": {
  "id": "String", // grants id (unique)
  "userId": "String", // user id (unique)
  "validation": "String", // validation
  "created": "Timestamp" // created date
}
```

* `id: <String>`: 인증서의 아이디
* `userId: <String>`: 인증서와 연결된 사용자의 아이디
* `validation: <String>`: 인증서 검증을 위한 값
* `created: <Timestamp>`: 인증서가 생성된 시각

#### 6. 인증서 전달
1. 성공적으로 인증서가 발급되었을 경우

2. `Client`는 인증서를 `Authorization Server`로 전송하여

3. `Access Token`을 발급받도록 해야 함

#### 7. 인증서 정보 가져옴
1. `Authorization Server`는 전송된 인증서를 검증하기 위해

2. `DB/Grants`에서 `id`를 통해 인증서를 찾아냄
    * 없으면 당연히 검증 실패 (_http 403_)

#### 8. Token 발급 / 인증 실패
1. 다음의 검증을 진행
    * `validation` 값을 비교
    * `created` 값을 이용해 특정 시간 내에 인증서가 보내졌음을 확인

2. 위 두 가지 rule이 성립하는 경우에만 __검증 성공__
    * 그 외에는 실패 (_http 403_)
    * 검증 성공 시 _인증서 `DB/Grants`에서 제거_ (의미가 없음)

3. 토큰 발급을 위해 인증서와 연결된 `userId`값을 이용

4. `Access Token`, `Refresh Token`을 생성 및 전송 (_http 200_)
    * 그리고 `DB/Tokens`에 생성한 Token을 append

#### 9. Access Token과 함께 리소스 요청 / 서비스 이용 시도
1. 현재는 `Access Token`이 있음

2. `Client`는 리소스를 요청하고, 이를 위해 `Access Token`을 같이 전송

#### 10. 토큰 정보 가져옴
1. `Resource Server`는 `Access Token` 검증을 위해

2. `DB/Tokens`에서 `accessToken` 값을 이용해 Token을 찾아냄

#### 11. 리소스 반환 / 인증 실패
1. 다음이 만족하면 _검증된 `Access Token`_ 이라고 할 수 있음
    * `DB/Tokens`에 `Access Token`이 있으며
    * 유효기간(`expired`)을 넘지 않음

2. 검증된 `Access Token`을 전송한 경우 리소스 반환 (_http 200_)
    * 그리고 유효기간 재생성

3. 그렇지 않은 경우 인증 실패 반환 (_http 401_)

#### 12. Refresh Token 전달
1. `Access Token`이 만료된 경우 재발급을 받아야 함

2. 이를 위해 `Client`는 `Authorization Server`에 `Refresh Token`을 전송

#### 13. 토큰 정보 가져옴
1. `Authorization Server`는 `Refresh Token` 검증을 위해

2. `DB/Tokens`에서 `refreshToken` 값을 이용해 Token을 찾아냄

#### 14. Token 발급 / 인증 실패
1. 다음을 만족하면 검증된 `Refresh Token` 이라고 할 수 있음
    * `DB/Tokens`에 `Refresh Token`이 있음

2. 검증 성공이면 새로운 토큰(`Access Token`, `Refresh Token`) 반환 (_http 200_)

3. 검증 실패면 인증 실패 반환 (_http 401_)

### Tables
```json
{
  "Users": {
    "userId": "String", // user id (unique)
    "name": "String", // user name
    "password": "String" // * hashed *
  },

  "Grants": {
    "id": "String", // grants id (unique)
    "userId": "String", // user id (unique)
    "validation": "String", // validation
    "created": "Timestamp" // created date
  },

  "Tokens": {
    "userId": "String", // user id (unique)
    "accessToken": "String", // access token (unique)
    "refreshToken": "String", // refresh token (unique)
    "expired": "Timestamp" // expired date
  }
}
```

### Cases
케이스에 대한 시나리오 정의

#### Case 1: 정상적인 로그인

#### Case 2: ID, PASSWORD 검증 실패

#### Case 3: 인증서(Grant) 검증 실패

#### Case 4: Access Token 검증 실패

#### Case 5: Access Token 유효기간 만료

#### Case 6: Authorization DOS 공격

#### Case 7: Access Token 탈취

#### Case 8: 

## Questions
* 인증서, `Access Token` 이런거 클라이언트로 전송 시 암호화 해야하지 않나? 평문으로 보내도 되는건가?

* 인증서를 `validation` 값으로 검증하는게 의미가 있나? 너무 약하거나 의미가 없지 않은가?

* 인증서 검증 후, 제거해도 되는가? 더 이상 인증서를 통해 `Access Token`을 발급받지 않는데 의미가 없지 않은가?

* `Access Token`, `Refresh Token` 그리고 인증서를 전송할 때 header를 통해 줘야 하는가, 아니면 body를 통해 줘야 하는가? 차이가 없는가?

* `Access Token`을 검증할 때, 그냥 값이랑 유효기간만 비교해도 되는 것인가? 이래도 안전한 검증이라 할 수 있는가?
  * 심지어 `Refresh Token`은 유효기간도 없음

* `Access Token` 발급 시 `Client`에게 유효기간을 보내지 않는데, 괜찮은 것인가? (스펙에서는 보내도록 하고 있음)

* `Access Token`을 통해 Resource를 받아온 경우, 유효기간을 늘려줘야만 하나?
  * 현재는 이러한 패턴으로 설계했으나, 적절하지 않은 패턴으로 파악될 경우
  * 유효기간을 늘리지 않고, 유효기간이 되었을 때 `Refresh Token`을 통해 새로운 `Access Token`을 발급받도록 함

* `Authorization Server`는 인증서 또는 `Refresh Token`을 통해 새로운 `Access Token`을 발급하는데, 이 둘을 구분해주지 않아도 되는가?
  * 8번과 14번 두 개를 말하는 것
  * 현재는 구분을 위해 mode를 같이 보내는 방안을 생각중
