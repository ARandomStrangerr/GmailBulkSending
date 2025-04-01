# Mail

A bulk mailsender with Google API

Using Vue and Electron.

To use this program build Vue project and build the Electron project

you must have a `json` file contains the following information for the program to run:

```json
{
  "clientId": "your-client-id-from-google-console",
  "clientSecret": "your-client-secret-from-google-console",
  "port": "port for google loopback",
  "scope": "https://www.googleapis.com/auth/gmail.send"
}
```
