# Checkin

An application check-in service.  This service allows your applications to periodically checkin and tell `Checkin` that the are still alive and doing well.

# API

Checkin

### POST /:app

Success Response 200

``` json
{ 
  "status": "active", 
  "checkedIn": "Fri Mar 22 2013 11:19:14 GMT-0400 (EDT)"
}
```

Error Response 500

``` json
{ 
  "error": "message"
}
```

Get Apps CheckIn Status

### GET /

Success Response 200

``` json
{
  "app1": { 
    "status": "active", 
    "checkedIn": "Fri Mar 22 2013 11:19:14 GMT-0400 (EDT)"
  },
  "app2": {
    "status": "active", 
    "checkedIn": "Fri Mar 22 2013 11:19:14 GMT-0400 (EDT)"
  }
}
```

Remove App from CheckIn 

### DELETE /:app

Success Response 200
