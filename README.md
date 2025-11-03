# 🛒 FreshCart Monorepo

This is the main monorepo for the FreshCart e-commerce application, containing both the frontend and backend services.

## \#\# Project Structure

This project is managed as an `npm workspace`.

  * `/freshcart-frontend`: The React frontend application.
  * `/freshcart-backend`: The Node.js API backend.

-----

## \#\# Getting Started

### \#\#\# Prerequisites

  * Node.js (v18.x or higher)
  * npm (v8.x or higher)

### \#\#\# Installation

1.  Clone this repository.
2.  From the root `FreshCart` folder, run the installer. This will install all dependencies for **both** the frontend and backend at once.
    ```bash
    npm install
    ```

-----

## \#\# How to Run

You must run all commands from the **root `FreshCart` folder**.

### \#\#\# 1. Run the Backend (API)

```bash
npm run start -w freshcart-backend
```

> **Note:** This requires you to have a `"start"` script in your `freshcart-backend/package.json`. If you don't, add one.
>
> **Example (`freshcart-backend/package.json`):**
>
> ```json
> "scripts": {
>   "start": "node server.js"
> }
> ```

### \#\#\# 2. Run the Frontend (React App)

In a **new terminal**, run:

```bash
npm run start -w freshcart-frontend
```

The React app will open on `http://localhost:3000`.

-----

## \#\# Managing Packages

To add new packages to a specific project, use the `-w` (workspace) flag.

  * **To add a frontend package:**
    ```bash
    npm install <package-name> -w freshcart-frontend
    ```
  * **To add a backend package:**
    ```bash
    npm install <package-name> -w freshcart-backend
    ```
