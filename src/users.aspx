<%@ Page Language="C#" CodeFile="./users.cs" Inherits="clUser" %>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Get User Info</title>
</head>

<body>
  <% 
  string userID = getUserID();
  string userName = getUserName(userID);
  string json = "{\"id\": \""+userID+"\", \"name\": \""+userName+"\"}";
  
  Response.Clear();
  Response.ContentType = "application/json; charset=utf-8";
  Response.Write(json);
  Response.End();
  %>
</body>

</html>