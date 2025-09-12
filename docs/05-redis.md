# Complete Guide: Setting up Redis with Docker for Windows Development

This guide will walk you through setting up Redis (a database) using Docker (a containerization tool) on Windows. Don't worry if you've never used these tools before - we'll explain everything step by step!

## Table of Contents

1. [What You'll Learn](#what-youll-learn)
2. [System Requirements](#system-requirements)
3. [Installing Docker Desktop](#installing-docker-desktop)
4. [Running Redis in Docker](#running-redis-in-docker)
5. [Creating Environment Configuration](#creating-environment-configuration)
6. [Optional: ASP.NET Core Environment File Setup](#optional-aspnet-core-environment-file-setup)
7. [Optional: Using Docker Compose](#optional-using-docker-compose)
8. [Verification and Testing](#verification-and-testing)
9. [Troubleshooting](#troubleshooting)

## What You'll Learn

By the end of this guide, you'll have:

- Docker Desktop installed and running on Windows
- Redis database running in a Docker container
- Proper environment configuration for your application
- Knowledge of how to start, stop, and manage your Redis container

**What is Redis?** Redis is a fast, in-memory database that stores data as key-value pairs. It's commonly used for caching and session storage in web applications.

**What is Docker?** Docker is a tool that packages applications and their dependencies into "containers" - think of them as lightweight, portable boxes that contain everything needed to run an application.

## System Requirements

Before we begin, ensure your Windows system meets these requirements:

### Minimum Requirements

- Windows 10 version 2004 or higher (Build 19041 or higher)
- Windows 11 (any version)
- 4 GB RAM minimum (8 GB recommended)
- UEFI firmware with virtualization support
- Hyper-V and Containers Windows features enabled

### Checking Your Windows Version

1. Press `Windows Key + R`
2. Type `winver` and press Enter
3. Check that your version meets the requirements above

> **Note:** If your system doesn't meet these requirements, you may need to update Windows or use alternative installation methods.

## Installing Docker Desktop

### Step 1: Enable Required Windows Features

Before installing Docker Desktop, we need to enable some Windows features:

1. **Open PowerShell as Administrator:**

   - Press `Windows Key + X`
   - Select "Windows PowerShell (Admin)" or "Terminal (Admin)"
   - Click "Yes" when prompted by User Account Control

2. **Enable WSL and Virtual Machine Platform:**

   ```powershell
   dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
   dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   ```

3. **Restart your computer** when prompted.

### Step 2: Install WSL 2

WSL (Windows Subsystem for Linux) is required for Docker Desktop:

1. **Open PowerShell as Administrator again**
2. **Install WSL 2:**

   ```powershell
   wsl --install
   ```

3. **Set WSL 2 as the default version:**
   ```powershell
   wsl --set-default-version 2
   ```

> **Tip:** WSL allows you to run Linux applications on Windows. Docker uses this to run Linux containers efficiently.

### Step 3: Download and Install Docker Desktop

1. **Download Docker Desktop:**

   - Visit: https://www.docker.com/products/docker-desktop/
   - Click "Download Docker Desktop for Windows"
   - Save the installer file (usually goes to your Downloads folder)

2. **Run the Installer:**

   - Navigate to your Downloads folder
   - Double-click `Docker Desktop Installer.exe`
   - If prompted by User Account Control, click "Yes"

3. **Installation Options:**

   - ✅ **Check** "Use WSL 2 instead of Hyper-V"
   - ✅ **Check** "Add shortcut to desktop"
   - Click "OK" to begin installation

4. **Complete Installation:**
   - Wait for the installation to complete (this may take several minutes)
   - Click "Close and restart" when prompted
   - Your computer will restart

### Step 4: Start Docker Desktop

1. **Launch Docker Desktop:**

   - Look for the Docker Desktop icon on your desktop or Start menu
   - Double-click to launch it

2. **Complete Setup:**
   - Docker Desktop will start and may show a tutorial
   - You can skip the tutorial for now
   - Wait for the Docker engine to start (you'll see "Docker Desktop is running" in the system tray)

### Step 5: Verify Docker Installation

1. **Open Command Prompt or PowerShell:**

   - Press `Windows Key + R`
   - Type `cmd` and press Enter

2. **Test Docker:**

   ```cmd
   docker --version
   ```

   You should see output like:

   ```
   Docker version 24.0.6, build ed223bc
   ```

3. **Test Docker with a simple container:**

   ```cmd
   docker run hello-world
   ```

   This should download and run a test container, showing a "Hello from Docker!" message.

> **Success Indicator:** If you see the hello-world message, Docker is installed correctly!

## Running Redis in Docker

Now let's set up Redis in a Docker container.

### Step 1: Pull the Redis Docker Image

1. **Open Command Prompt or PowerShell**
2. **Download the Redis image:**

   ```cmd
   docker pull redis:latest
   ```

   This downloads the Redis software packaged as a Docker image.

### Step 2: Create and Run the Redis Container

**Run this command to start Redis:**

```cmd
docker run -d --name frcs-redis -p 6379:6379 redis:latest
```

**Let's break down this command:**

- `docker run` - Creates and starts a new container
- `-d` - Runs the container in "detached" mode (in the background)
- `--name frcs-redis` - Names our container "frcs-redis" for easy reference
- `-p 6379:6379` - Maps port 6379 from the container to port 6379 on your computer
- `redis:latest` - Uses the Redis image we downloaded

### Step 3: Verify Redis is Running

**Check if the container is running:**

```cmd
docker ps
```

You should see output similar to:

```
CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS          PORTS                    NAMES
abc123def456   redis:latest   "docker-entrypoint.s…"   30 seconds ago   Up 29 seconds   0.0.0.0:6379->6379/tcp   frcs-redis
```

**Test Redis connectivity:**

```cmd
docker exec -it frcs-redis redis-cli ping
```

You should see:

```
PONG
```

> **Success Indicator:** If you see "PONG", Redis is running and accepting connections!

## Creating Environment Configuration

Now we need to create a configuration file that tells your application how to connect to Redis.

### Step 1: Navigate to Your Project Directory

1. **Open File Explorer**
2. **Navigate to your project folder** - this should be where your `server/Frcspos` folder is located
3. **Open the `server/Frcspos` folder**

### Step 2: Create the .env File

1. **Right-click in the `server/Frcspos` folder**
2. **Select "New" > "Text Document"**
3. **Name the file `.env`** (including the dot at the beginning)
   - Windows might warn about changing the file extension - click "Yes"

### Step 3: Add the Redis Configuration

1. **Open the `.env` file** with Notepad or any text editor
2. **Add this line:**
   ```
   REDIS_CONNECTION_STRING=localhost:6379
   ```
3. **Save the file** (Ctrl+S)

> **Important:** Make sure there are no spaces around the equals sign and no extra spaces at the end of the line.

### Alternative Method: Using Command Line

If you're comfortable with the command line:

1. **Open Command Prompt in your project directory:**

   - Navigate to `server/Frcspos`
   - Hold Shift and right-click in the folder
   - Select "Open PowerShell window here" or "Open Command Prompt here"

2. **Create the .env file:**
   ```cmd
   ConnectionStrings__Redis=localhost:6379
   ```

## Verification and Testing

Let's make sure everything is working correctly:

### Test 1: Container Status

```cmd
docker ps
```

Look for the `frcs-redis` container in the list.

### Test 2: Redis Connectivity

```cmd
docker exec -it frcs-redis redis-cli ping
```

Should return `PONG`.

### Test 3: Basic Redis Operations

```cmd
docker exec -it frcs-redis redis-cli set test "Hello Redis"
docker exec -it frcs-redis redis-cli get test
```

Should return `"Hello Redis"`.

### Test 4: Port Connectivity

You can test if Redis is accessible from your application:

```cmd
telnet localhost 6379
```

If telnet connects successfully, Redis is accessible on the correct port.

> **Note:** If telnet isn't available, you can enable it in Windows Features or use `Test-NetConnection localhost -Port 6379` in PowerShell.

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Docker command not found"

**Solution:**

- Make sure Docker Desktop is running (check system tray)
- Restart your command prompt/PowerShell
- Try running as Administrator

#### Issue: WSL 2 installation problems

**Solution:**

- Ensure virtualization is enabled in BIOS
- Run Windows Update to get the latest version
- Try the manual WSL kernel update from Microsoft

#### Issue: Docker Desktop won't start

**Solution:**

- Restart your computer
- Check that Hyper-V is enabled in Windows Features
- Run Docker Desktop as Administrator

### Useful Docker Commands

**View all containers (including stopped ones):**

```cmd
docker ps -a
```

**Stop the Redis container:**

```cmd
docker stop frcs-redis
```

**Start the Redis container:**

```cmd
docker start frcs-redis
```

**Remove the Redis container:**

```cmd
docker rm frcs-redis
```

**View container logs:**

```cmd
docker logs frcs-redis
```

**Access Redis CLI directly:**

```cmd
docker exec -it frcs-redis redis-cli
```

## Summary

Congratulations! You now have:

✅ Docker Desktop installed on Windows
✅ Redis running in a Docker container named `frcs-redis`
✅ Redis accessible on port 6379
✅ Environment configuration file (`.env`) created
✅ Knowledge of basic Docker commands

Your Redis instance is now ready for your application to use. The connection string `localhost:6379` will allow your ASP.NET Core application to connect to Redis.

### Next Steps

1. **Start your application** and verify it can connect to Redis
2. **Learn more Redis commands** for data manipulation
3. **Set up Redis persistence** if you need data to survive container restarts
4. **Consider Redis security** for production environments

### Quick Reference

**Start Redis:**

```cmd
docker start frcs-redis
```

**Stop Redis:**

```cmd
docker stop frcs-redis
```

**Check Redis status:**

```cmd
docker ps
```

**Test Redis:**

```cmd
docker exec -it frcs-redis redis-cli ping
```

---

> **Need Help?** If you encounter issues not covered here, check the [Docker Desktop documentation](https://docs.docker.com/desktop/windows/) or the [Redis documentation](https://redis.io/docs/).
