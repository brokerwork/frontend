<!DOCTYPE html>
<html lang="en">
<head>
    <title>TraderWork Mobile</title>
    <meta charset="utf-8">
    <meta name="format-detection" content="telephone=no" />
    <meta name="msapplication-tap-highlight" content="no" />
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
</head>
<body>
    <form id="myForm" action="/v1/wechat/redirect">
        <input type="hidden" name="appId" value="${appId}"/>
        <input type="hidden" name="appNo" value="${appNo}"/>
        <input type="hidden" name="token" value="${token}"/>
        <input type="hidden" name="viewPath" value="${viewPath}"/>
    </form>
    <script>
        document.getElementById('myForm').submit();
    </script>
</body>
</html>