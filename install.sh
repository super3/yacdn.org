apt-get install build-essential
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
 		 REDIS_EXECUTABLE=`command -v redis-server` ./utils/install_server.sh
./utils/install_server.sh
cd ../
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
nvm install node
npm install -g pm2
git clone https://github.com/ovsoinc/yacdn.org
cd yacdn.org
pm2 start process.json
pm2 save
pm2 startup
