# Checkin

An application check-in service.  This service allows your applications to periodically checkin and tell `Checkin` that the are still alive and doing well.

## Install

``` sh
npm install checkin
```

## Setup

Create a config.json file that contains the following configuration details:

* expire - Amount of time in milliseconds that you want to give until you notify app is down.
* port - the port you want the server to start on
* notifySvr - the url of the notify service (https://github.com/twilson63/notify)

``` sh
checkin init
# answer all the questions
```

## Run

``` sh
checkin -C ./config.json
```

## API

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

Get App CheckIn Status

### Get /:app

Success Response 200

``` json
{ 
  "status": "active", 
  "checkedIn": "Fri Mar 22 2013 11:19:14 GMT-0400 (EDT)"
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
