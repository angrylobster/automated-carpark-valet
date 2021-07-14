# Introduction
This application is a command line interface that manages the parking information of vehicles in a car park. It can process inputs from a user, delivered through a `.txt` file, and can deliver outputs indicating which lots each vehicle is parked in, as well as the parking fee(s) of exiting vehicles.

The application requirements and installation instructions are defined for fresh installations of `Ubuntu 16.04`.

# Pre-Installation Instructions
The following technologies will need to be installed prior to running the application: 
- `curl`
- `Node.js`
- `git`

But before you install any of the above technologies, update your `Ubuntu` repositories first.

## Update Ubuntu repositories:

```sh
# Using the terminal
sudo apt update

# Using bash, as root
apt update
```

## Install curl:
You will need to run the following commands on the `terminal`, or on `bash` as the root user:
```sh
# Using the terminal
sudo apt install curl

# Using bash, as root
apt install curl
```

## Install Node.js v16.x:
You will need to run the following commands on the `terminal`, or on `bash` as the root user:

```sh
# Using the terminal
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Using bash, as root
curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
apt install -y nodejs
```

## Install Git:
You will need to run the following commands on the `terminal`, or on `bash` as the root user:

```sh
# Using the terminal
sudo apt install git-all

# Using bash, as root
apt install git-all
```

# Installation Instructions
Once you have installed `curl`, `Node.js`, and `Git`, open your terminal and navigate to a folder where you would like to install the `automated-carpark-valet`. Clone the repository code by running in the `terminal` or `bash`: 

```sh
git clone https://github.com/angrylobster/automated-carpark-valet.git
```

Navigate into the `automated-carpark-valet` folder with:

```sh
cd ./automated-carpark-valet
```
Install the required `Node.js` packages by running:

```sh
npm i
```
Finally, build the code so it can be run:
```sh
npm run build
```

# Execution Instructions
This application parses `.txt` files and returns an output. Once you have built the code as specified in the section above, you can simply use the following command to parse a `.txt` file:

```sh
node dist data.txt
```

To parse files that might be in parent or child folders, you can use a relative path when executing the application. For example:
```sh
# To parse .txt files in parent folders
node dist ../data.txt 

# To parse .txt files in child folders
node dist ./my-data/data.txt
```