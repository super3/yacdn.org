# redis
apt-get install build-essential -y
cd ~
wget http://download.redis.io/releases/redis-5.0.4.tar.gz
tar xvfs redis-5.0.4.tar.gz
cd redis-5.0.4;
make
make install
REDIS_PORT=1234 \
 		 REDIS_CONFIG_FILE=/etc/redis/1234.conf \
 		 REDIS_LOG_FILE=/var/log/redis_1234.log \
 		 REDIS_DATA_DIR=/var/lib/redis/1234 \
 		 REDIS_EXECUTABLE=`command -v redis-server` ./utils/install_server.sh;
./utils/install_server.sh;
cd ../;
# node
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash;
export NVM_DIR="$HOME/.nvm";
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh";  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion";  # This loads nvm bash_completion
nvm install node;
cd /usr/local/bin;
ln -s $HOME/.nvm/versions/node/*/bin/node;
ln -s $HOME/.nvm/versions/node/*/bin/npm;
npm install -g pm2;
ln -s $HOME/.nvm/versions/node/*/bin/pm2;
# yacdn
cd $HOME;
apt-get install -y git;
git clone https://github.com/ovsoinc/yacdn.org;
cd $HOME/yacdn.org;
npm install;
touch blacklist.txt;
pm2 start process.json;
pm2 save;
pm2 startup;
# nginx
apt-get install nginx -y;
curl -o - https://raw.githubusercontent.com/ovsoinc/yacdn.org/master/nginx.conf > /etc/nginx/sites-available/default;
# letsencrypt
apt-get update;
apt-get install software-properties-common -y;
add-apt-repository universe -y;
add-apt-repository ppa:certbot/certbot -y;
apt-get update -y;
apt-get install certbot python-certbot-nginx -y;
certbot --nginx;
