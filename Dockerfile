# Step 1: Build Stage (using a larger image with all dependencies)
FROM node:16 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install all dependencies (including development dependencies)
RUN npm install
# Copy the rest of the application code
COPY . .

COPY .env .env

# Generate Prisma client
RUN npx prisma generate

# Run Prisma migrations during the build stage
RUN npx prisma migrate dev

# Build the TypeScript code (if applicable)
RUN npm run build

# Step 2: Production Stage (using a smaller image for running)
FROM node:16-slim

RUN apt-get update -y && apt-get install -y openssl && apt-get install -y postgresql-client
# Set the working directory for the production image
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/package*.json ./

#COPY --from=build /app/dist ./dist  # Assuming your built files are in the dist directory
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma

# Ensure uploads directory exists
RUN mkdir -p /app/uploads && chmod 755 /app/uploads

# Install only production dependencies (skip dev dependencies)
RUN npm install --production
ENV PORT=5000

# Expose the port your app listens on (e.g., 5000)
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
