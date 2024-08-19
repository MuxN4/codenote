# CodeNote

CodeNote is a web-based code editor and note-taking application built with Vue.js and PocketBase. It allows users to create, edit, and organize code snippets and notes with syntax highlighting for various programming languages.

## Features

- User authentication (signup, login, logout)
- Create and edit notes with syntax highlighting
- Organize notes into folders
- Customizable editor settings (theme, font size, tab size, line wrapping)
- Responsive design for various screen sizes

## Tech Stack

- Frontend: Vue.js 3, Vuex, Vue Router
- Backend: PocketBase
- Editor: CodeMirror 5
- Icons: Font Awesome

## Setup and Installation

1. Clone the repository:
```
 git clone https://github.com/MuxN4/codenote.git
```
2. Install dependencies:
npm install

3. Set up PocketBase:
- Download PocketBase from https://pocketbase.io/
- Place the PocketBase executable in the project root
- Start PocketBase:
  ```
  ./pocketbase serve
  ```
- Access the admin UI at http://127.0.0.1:8090/_/
- Create the necessary collections (users, notes, folders, user_settings)

4. Start the development server:
```
npm run serve
```