# express-server-test
Testing hosting node express app on server.

# Steps

Run `ssh-keygen` and `clip < C:/Users/Brian/.ssh/id_rsa.pub` before creating if you don't have ssh keys and add ssh key in linode.

# Steps after creating linode VPS:

Log into server as root user.
```
ssh root@<server-ip>
```

Create user, give user sudo access, move .ssh directory into new account, terminate connection to server.
```
uname="brian"; adduser $uname && usermod -aG sudo $uname && rsync --archive --chown=$uname:$uname .ssh /home/$uname/ && exit
```

Logging in as new user.
```
ssh brian@<server-ip>
```

Update your system and package lists.
```
sudo apt update && sudo apt upgrade
```

Install a webserver to server as our proxy, and we need nodejs and npm.
```
sudo apt install nginx nodejs npm
```

Setup firewall.
```
sudo ufw allow http
sudo ufw allow OpenSSH
sudo ufw allow https
sudo ufw enable
```

Go to nginx configuration files
```
cd /etc/nginx/sites-available
```

Edit that file. Make sure the port matches port used by the express app.
```
sudo nano bruhmoment.com
```

```
server {
  listen 80 default_server;
  listen [::]:80 default_server;

  server_name bruhmoment.com www.bruhmoment.com;

  location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass http://127.0.0.1:3000/;
        proxy_redirect off;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_redirect off;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
```

Enable site.
```
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
```

Remove default site.
```
sudo rm /etc/nginx/sites-enabled/default
```

Restart web server to apply changes.
```
sudo systemctl restart nginx
```

Go back to home directory.
```
cd ~
```

Clone the project from GitLab.
```
git clone <url>
```

Go to project folder
```
cd <project-folder-name>
```

Install packages
```
npm install
```

You can use use pm2 to manage the app.
```
sudo npm i pm2 -g
```

Start the app with pm2.
```
pm2 start index.js
```