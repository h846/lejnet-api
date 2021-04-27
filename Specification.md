# LEJ-Net API Specification
## System Environment
### Language
[Node.js](https://nodejs.org/en/)
### Framework
[Express - Node.js web application framework](https://expressjs.com/)
### Package for Windows Servicing
[Winser](https://www.npmjs.com/package/winser)
#### Service Install(Start) Command
`npm run install-service`
#### Service uninstall(Stop) Command
`npm run uninstall-service`
<details><summary>POINT</summary>
Run these commands after running Command Prompt or PowerShell as an administrator on IIS.
</details>

## APIs
### Access API
#### URL
http://lejnet/API/accdb
#### Methods
##### GET
Get the data of the Access DB table in JSON format.
###### Query Parameters
**db**: Enter the path of the DB you want to retrieve from the document root.
**table:** Enter a table name.
*example:* http://lejnet/API/accdb?db=ISNet/PCM/PCM.accdb&table=PCList

##### POST
Update the table data.
###### Query Parameters
**db:** The path to the table where you want to update the data.
**sql:** The SQL statement you want to execute on the table.
*example:* http://lejnet/API/accdb?db=ISNet/PCM/PCM.accdb&sql=SELCT * FROM PCList

### JSON API
#### URL
http://lejnet/API/json
#### Methods
##### GET

### User Info API

