console.log('Chain of Responsibility');
var AuthenticationHeader = (function () {
    function AuthenticationHeader(token, next) {
        this.token = token;
        this.next = next;
    }
    AuthenticationHeader.prototype.addLines = function (inputHeader) {
        if (this.token === null)
            throw new Error("Token should be not null");
        var text = inputHeader + " Authorization: Bearer " + this.token;
        if (this.next)
            this.next.addLines(text);
        return text;
    };
    return AuthenticationHeader;
}());
var ContentTypeHeader = (function () {
    function ContentTypeHeader(contentType, next) {
        this.contentType = contentType;
        this.next = next;
    }
    ContentTypeHeader.prototype.addLines = function (inputHeader) {
        var text = inputHeader + " ContentType: " + this.contentType;
        if (this.next)
            this.next.addLines(text);
        return text;
    };
    return ContentTypeHeader;
}());
var BodyPayload = (function () {
    function BodyPayload(body, next) {
        this.body = body;
        this.next = next;
    }
    BodyPayload.prototype.addLines = function (inputHeader) {
        var text = inputHeader + " " + this.body;
        if (this.next)
            this.next.addLines(text);
        return text;
    };
    return BodyPayload;
}());
var authenticationHeader = new AuthenticationHeader("123456");
var contentTypeHeader = new ContentTypeHeader("json");
var messageBody = new BodyPayload('{"username"="dbacinski"}');
var messageChainWithAuthorization = function (authenticationHeader, contentTypeHeader, messageBody) {
    authenticationHeader.next = contentTypeHeader;
    contentTypeHeader.next = messageBody;
    return authenticationHeader;
};
var _messageChainWithAuthorization = messageChainWithAuthorization(authenticationHeader, contentTypeHeader, messageBody);
var _messageWithAuthentication = _messageChainWithAuthorization.addLines("Message with Authentication:\n");
console.log(_messageWithAuthentication);
