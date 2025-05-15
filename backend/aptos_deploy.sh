#!/bin/bash

# EcoChain Aptos Smart Contract Deployment Script
echo "Starting EcoChain Aptos smart contract deployment..."

# Check if Aptos CLI is installed
if ! command -v aptos &> /dev/null
then
    echo "Error: Aptos CLI not found. Please install it first."
    echo "Run: curl -fsSL \"https://aptos.dev/scripts/install_cli.py\" | python3"
    exit 1
fi

# Set working directory
cd "$(dirname "$0")/move"

# Set address (using Petra wallet address)
ADDR="0xda14cb8535c599bd7eeedaf980c4e6fa8c1605047ff88403b6120f7437b7b6c0"
echo "Using address: $ADDR"

# Update the Move.toml file with the provided address
sed -i '' "s/ecochain = \".*\"/ecochain = \"$ADDR\"/" Move.toml
echo "Updated Move.toml with address: $ADDR"

# Compile the contract
echo "Compiling Move contracts..."
aptos move compile --skip-fetch-latest-git-deps
if [ $? -ne 0 ]; then
    echo "Error: Compilation failed."
    exit 1
fi
echo "Compilation successful."

# Publish the contract
echo "Publishing contracts to Aptos testnet..."
aptos move publish --named-addresses ecochain=$ADDR --max-gas=10000 --skip-fetch-latest-git-deps
if [ $? -ne 0 ]; then
    echo "Error: Publishing failed."
    exit 1
fi
echo "Deployment successful!"

# Create a project for testing
echo "Creating a test project..."
aptos move run \
    --function-id $ADDR::verification::create_project \
    --args string:"RF-2023-089" string:"Amazon Rainforest Conservation" string:"Brazil" \
    string:"This project focuses on conserving and restoring the Amazon rainforest" \
    string:"reforestation" u64:12450 u64:1845 \
    --max-gas=5000

# Submit test sensor data
echo "Submitting sample IoT sensor data..."
aptos move run \
    --function-id $ADDR::verification::submit_sensor_data \
    --args string:"RF-2023-089" string:"3.4653° S" string:"73.8078° W" \
    u64:4280 u64:87 u64:523 u64:2140 \
    hex:"7f2c38e5d3b95a4a0c8f19167d8c5b7d9d2e898432c6f37a12cf42bc198f2d8e" \
    --max-gas=5000

echo "Setup complete! Access your contract at:"
echo "https://explorer.aptoslabs.com/account/$ADDR?network=testnet" 