# vue3-bookshelf-spa

A simple SPA for managing a bookshelf, built with Vue 3, Typescript, and populated using a JSON Server database.

## Features

- View a list of books
- Add, edit, and delete books
- Data persisted in a `db.json` file via JSON Server

## Technologies used

- Vue3
- TypeScript
- TailwindCSS
- JSON Server

## Getting Started

Follow these steps to run the project locally:

### 1. Clone the repository

```bash
git clone https://github.com/scsoares/bookshelf-vue3-spa
cd vue3-bookshelf-spa-main
```

### 2. Install dependencies

```bash
npm install
```

- I already provided a db.json file with 50 books, but you can use any data you want in that file, as long as it has the Book fields stated in the /src/types/ folder.

- I added the port 3005 in the package.json for JSON Server, but you can change it as you wish.

### 3. Create an .env file in root folder with base url variable

```bash
touch .env
```

- This will create an .env file where you should create a variable called "BASE_URL". (if your API port is 3005, the variable should store the string "http://localhost:3005")

### 4. Run the db in a terminal

```bash
npm run mock:api
```

- This will start a JSON Server API at http://localhost:3005.

### 5. Run the vue app in a different terminal (do not close the API one)

```bash
npm run dev
```

### 6. Visit the app

- In your browser, visit the app in http://localhost:5173 or whatever custom port you have defined for frontend
- Browse the bookshelf, add new books, edit or delete existing ones
- Changes are automatically saved to db.json

## Author

- Sarah Soares (@scsoares)

## License

- This project is open source and free to use.
