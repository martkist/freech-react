# freech-react
A drop-in-replacement for [freech-html](https://github.com/martkist/freech-html) written in [React](https://facebook.github.io/react/) using [Bootstrap](http://getbootstrap.com/) with the [paper theme](https://bootswatch.com/paper/).

It builds upon [freech-lib-js](https://github.com/martkist/freech-lib-js) which enables browser-side-cryptography meaning that the private freech key is generated in the browser and does not leave the browser. It is meant to be used together with a remote freech-proxy that is accessible from anywhere enabling a normal web-like usage. Because of browser-side-cryptography communication is secured end-to-end and the freech-proxy is highly exchangeable. 

freech-react is currently in alpha phase. Use at your own risk.

Forked from https://github.com/Tschaul/freecher-react by Julian Steinwachs.

## Missing Features			

* Trending Hashtags
* Direct Messages
* Promoted Posts


## Publicly hosted instances (use at your own risk)

Url | Admin | Location | Note 
----- | ----- | ----- | ------

*Your proxy is missing? Drop me a line or make a pull request!*

## Setup as hosted by a public freech proxy (ubuntu 15.10)

First we install the basic dependecies.

```
apt-get update
apt-get install -y git curl nodejs nodejs-legacy npm
curl -sSL https://get.docker.com/ | sh
```

Now we pull freech-core.

```
git clone https://github.com/martkist/freech-core.git

mkdir ~/.freech
echo -e "rpcuser=user\nrpcpassword=pwd\nhtmldir=~/freech-react" > ~/.freech/freech.conf
chmod 600 ~/.freech/freech.conf
```

Next pull this repo and freech-proxy.

```
git clone https://github.com/martkist/freech-react.git
git clone https://github.com/martkist/freech-proxy.git

npm install -g forever
```

We setup freech-proxy and pull the settings from this repo.

```
cd freech-proxy
npm install
curl https://raw.githubusercontent.com/martkist/freech-react/master/docker/settings.json > settings.json
cd ..
```

Next we need the start script from this repo and set the correct rights.

```
curl https://raw.githubusercontent.com/martkist/freech-react/master/docker/run.sh > run.sh
chmod 777 run.sh 
```

For https to work we need certificates.

```
git clone https://github.com/letsencrypt/letsencrypt

./letsencrypt/letsencrypt-auto certonly --standalone
```

letsencrypt will ask you to provide an email address and your domain. It will then save your certificates in /etc/letsencrypt/live/example.com/ where example.com is your domain.

For last step we have to tell freech-proxy where the certificates are.

```
nano freech-proxy/settings.json 
```

Inside "Server" replace example.com by your domain in a the "ssl_*" properties. Press Crtl+O to save and then Crtl+X to exit.

Now we can start it up. When starting for the first time it will pull the freech docker-image.

```
./run.sh
```

freechd now needs a while (10min to 1h depending on your connection) to download the blockchain. You can check `top` to see if freechd is still busy. If it's not busy anymore (cpu at around 10%) it's ready to use. Go to https://example.com/index.html where example.com is your domain and start freeching :-).

To stop freechd and the proxy, run:

```
killall freechd
killall nodejs
```

If freech-proxy is hanging itself regularly try updating nodejs to a newer version:

http://askubuntu.com/questions/426750/how-can-i-update-my-nodejs-to-the-latest-version

## Screenshots

![Alt text](/screenshots/home.png?raw=true "Home")

The home screen with two click account switching

![Alt text](/screenshots/post.png?raw=true "New Post Modal")

The new post modal

![Alt text](/screenshots/profile.png?raw=true "Profile")

The profile page on the posts tab

![Alt text](/screenshots/following.png?raw=true "Following")

The profile page on the following tab

![Alt text](/screenshots/mentions.png?raw=true "Mentions")

The profile page on the mentions tab

![Alt text](/screenshots/conversation.png?raw=true "Conversation")

The conversation page
