#!/bin/bash

# Clean the .next directory
rm -rf .next

# Install dependencies
npm install

# Run the build
npm run build

# Check if the build was successful
if [ $? -eq 0 ]; then
  echo "Build successful!"
else
  echo "Build failed!"
fi 