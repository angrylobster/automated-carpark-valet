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
## In the Terminal / Bash
This application parses `.txt` files and returns an output. Once you have built the code as specified in the section above, you can simply use the following command to parse `.txt` files as input:

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

## In in the input (`.txt`) files
The input files must follow a fixed format. The first row of each `.txt` file must contain 1 number for the total number of `car` lots, and 1 number for the total number of `motorcycle` lots, in that order:

```sh
# 3 car lots, and 4 motorcycle lots
3 4

# 1 car lot, and 2 motorcycle lots
1 2 
```
For each subsequent line, there are two possible types of events:
1. Vehicle entering the carpark
2. Vehicle exiting carpark

For vehicles entering the carpark, the command must be given in the following format show below. There are only two types of `vehicleTypes` accepted - `car` and `motorcycle`: 
```sh
# Enter <vehicleType> <licensePlate> <timestamp>
Enter car SGA1234D 1613541902

# Enter <vehicleType> <licensePlate> <timestamp>
Enter motorcycle SGX5311K 1613541902
```

For vehicles exiting the carpark, the command must be given in the following format:
```sh
# Exit <licensePlate> <timestamp>
Exit SGX5311K 1613541910
```
A complete input file might look like this:
```sh
3 4
Enter motorcycle SGX1234A 1613541902
Enter car SGF9283P 1613541902
Exit SGX1234A 1613545602
Enter car SGP2937F 1613546029
Enter car SDW2111W 1613549730
Enter car SSD9281L 1613549740
Exit SDW2111W 1613559745
```

## Input Validation
Validation errors might occur if the inputs contain erroneous information. Some examples of validation errors include:

- Not including both the car and motorcycle lot counts
- Choosing a negative number for the vehicle lot count(s)
- Choosing an invalid input for the vehicle lot count(s) such as letters
- Not providing the accepted `Enter` or `Exit` commands
- Not providing the accepted `car` or `motorcycle` vehicle types
- Not providing a valid timestamp
- Having an invalid number of spaces (more than 1) between each data attribute

# Interpreting the Output
The program will print to your `terminal` or `bash` the output. 

When an `enter` command is accepted, the program will print the acceptance result and append the lot that the vehicle was assigned to:

```sh
# For cars
Accept CarLot1

# For motorcycles
Accept MotorcycleLot3
```

When an `exit` command is accepted, the program will print the parking lot that was freed up and append the parking fee charged. The parking rates are $1/hour for a motorcycle and $2/hour for a car. All fees are rounded up to the nearest hour. 

```sh
# Car lot 3 was freed up with a charge of $6
CarLot3 6

# Motorcycle Lot 2 was freed up with a charge of $2
MotorcycleLot2 2
```

When the command is erroneous and cannot be executed, a rejection message is printed. This can happen in several scenarios, here are some examples:

- When the lots for that vehicle category are all taken and a vehicle is to be parked in that same category
- When a vehicle is to exit but it is not currently parked

The rejection message looks like this:

```sh
Reject
```
Given the example in the previous section, a sample output might look like:
```sh
Accept MotorcycleLot1
Accept CarLot1
MotorcycleLot1 2
Accept CarLot2
Accept CarLot3
Reject
CarLot3 6
```
Each command is processed and printed in increasing / ascending order of the `timestamp` provided, so that it is chronologically understandable.