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
sudo apt-get -y install build-essential  python-pip python3-pip python-dev python3-dev python-virtualenv git supervisor > /dev/null

msg "Starting provision for python app..."
# dependencies for pycurl
sudo apt-get -y install libcurl4-openssl-dev > /dev/null
sudo rm -fr /home/vagrant/app/venv /home/vagrant/linc-webapp/venv 2> /dev/null
virtualenv --python=python2.7 --prompt=" LINC-WebApp " /home/vagrant/linc-webapp/venv
msg "Install Python Dependencies"
source /home/vagrant/linc-webapp/venv/bin/activate
pip install pip --upgrade
pip install setuptools --upgrade
pip install -r /home/vagrant/linc-api/requirements.txt --upgrade
pip install -I Pillow

msg "Configuring supervisord to daemonize"
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
