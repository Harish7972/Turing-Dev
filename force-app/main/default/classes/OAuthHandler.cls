public with sharing class OAuthHandler {
    public static String getAccessToken(String code) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://login.salesforce.com/services/oauth2/token');
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');

        String clientId = '3MVG9PwZx9R6_UrdZImj8hAx4jNhRouGTn2hQwOGH_ac2hijCSXTmxM1.h9UiTc6zvRpZwbbRODaj4R1CeeHl';
        String clientSecret = 'CF0403983040DD6BF0BBEB7BB30B7AA295F6481B9557A2E7DE8972A62FDB217F';
        String redirectUri = 'https://nonprofit.org/callback';
        String grantType = 'authorization_code';

        req.setBody('code=' + code +
                    '&grant_type=' + grantType +
                    '&client_id=' + clientId +
                    '&client_secret=' + clientSecret +
                    '&redirect_uri=' + redirectUri);

        Http http = new Http();
        HttpResponse res = http.send(req);
        return res.getBody();
  }
}