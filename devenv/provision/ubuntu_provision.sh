#!/bin/bash

# Functions definitions
msg () {
    echo " "
    echo -e "\033[33;34m >>> "$1
    echo " "
    return 0
}

msg "Starting provision..."

msg "Configuring OS"
# Provision config section
USER=vagrant
HOME_DIR=/home/vagrant
PROGRAM_NAME=linc-webapp
PROGRAMA_LABEL_NAME=LINC-WEBAPP

# Timezone definition
msg "Setting timezone: EST"
sudo timedatectl set-timezone EST > /dev/null

# Update Packages Database
msg "Update packages database"
sudo apt-get update > /dev/null

msg "Installing common packages and dependencies"
sudo apt-get -y install build-essential  python-pip python3-pip python-dev python3-dev python-virtualenv git supervisor sudo timedatectl > /dev/null

echo "Starting provision for python app..."
# dependencies for pycurl
sudo apt-get -y install libcurl4-openssl-dev
virtualenv --python=python3 --prompt=" LINC-WebApp " /home/vagrant/linc-webapp/venv
source /home/vagrant/linc-webapp/venv/bin/activate
pip install -r /home/vagrant/linc-webapp/requirements.txt --upgrade

echo "Configuring supervisord to daemonize"
cat << EOF | sudo tee -a /etc/supervisor/conf.d/linc-webapp.conf
[program:linc-webapp]
command=/home/vagrant/linc-webapp/venv/bin/python /home/vagrant/app/linc-webapp.py
redirect_stderr=true
stdout_logfile=/tmp/linc-webapp.log
numprocs=1
user=vagrant
directory=/home/vagrant/app

EOF

# Updating
sudo supervisorctl update

msg "Cleaning Everything"
sudo apt-get -y dist-upgrade > /dev/null
sudo apt-get -y autoremove > /dev/null
sudo apt-get -y autoclean > /dev/null
# Shrink image size
sudo dd if=/dev/zero of=/EMPTY bs=1M
sudo rm -f /EMPTY

msg "Provision completed!"
