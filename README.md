#### To Start

Ensure you have the Docker Desktop application installed
Ensure you have two ngrok authtokens, one for the client, and one for the server.

To add your ngrok token:
`ngrok add-authtoken *INSERT TOKEN*`: authtoken to be used for the server

In the directory your authtoken, create another ngrok.yml file with your other authtoken

`npm i`: install node module packages
`npm run start:server`: builds and starts the server
`npm run build:client`: builds the client

`npm run startdev`: builds both server and client
`npm run dev`: starts the server allowing changes to be made live

After building the client and starting the server, the server shall be running at this point; the client shall not.
To Run the client:

`cd packages && cd client && npm run dev`: Change the directory to the client, and runs the built client file

At this point, both the server and client shall be running locally.

To expose the server to the web with ngrok:

`ngrok http --domain=`NGROK_DOMAIN_OF_SERVER.com` --config "PATH_TO\ngrok2.yml":
will expose the localhost to ngrok domain

`ngrok http `CLIENT_IP_ADDRESS`:1234 --domain=`NGROK_DOMAIN_OF_CLIENT`:
will expose the client ip address to ngrok domain
