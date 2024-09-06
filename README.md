# Slot Machine Game

This is a simple slot machine game built using **HTML**, **CSS**, **SCSS**, and **JavaScript**, with **VueJS** and **jQuery** for reactive behavior and animations. This project is perfect for learning how to implement a basic slot machine with smooth interactions.

## Preview

![Slot Machine Preview](./assets/preview.png)

## Features

- **Responsive Design**: Scales to fit any screen size.
- **Smooth Animations**: Utilizes CSS transitions and JavaScript for a smooth slot machine experience.
- **VueJS Integration**: Manages the state of the slot machine and its components.
- **jQuery**: Handles DOM manipulation and animation logic.
- **SCSS**: Utilizes SCSS for better modularity and flexibility in styling.

## How to Run

1. **Download the Repository**: Clone or download the ZIP file from this repository.
   ```bash
   git clone https://github.com/your-username/slot-machine-game.git
   ```
2. **Install a Live Server**: This project requires a local server to run. You can use **Live Server** extension in Visual Studio Code or any local server of your choice.

   - **Using Visual Studio Code:**
     - Install the Live Server extension.
     - Right-click `index.html` and select **Open with Live Server**.
   - Alternatively, you can use tools like `http-server`:
     ```bash
     npm install -g http-server
     http-server .
     ```

3. **Open in Browser**: Once the server is running, open `http://localhost:8080` (or the specified port) in your browser.

## Technologies Used

- **HTML5** for structure.
- **CSS3 & SCSS** for styling and animations.
- **VueJS** for reactive components.
- **jQuery** for DOM manipulation and animations.
- **JavaScript** for game logic.

## Project Structure

```bash
├── .vscode/              # VSCode settings
├── html/                 # HTML files (if any additional are added later)
├── assets/               # Assets folder (images, icons, etc.)
│   ├── icons/            # Icons for the slot machine
│   │   ├── coin.svg
│   │   ├── dots.png
│   │   ├── left_splash.svg
│   │   ├── lever_base.svg
│   │   ├── lever.svg
│   │   ├── right_splash.svg
│   │   └── star.svg
│   └── preview.png       # Slot machine preview image
├── css/
│   ├── reset.css         # CSS Reset
│   └── style.min.css     # Compiled & Minified CSS
├── js/
│   ├── config.js         # Configuration settings for the slot machine
│   └── main.js           # VueJS and jQuery logic for the game
├── scss/
│   └── style.scss        # SCSS file for styling
├── index.html            # Main HTML file
└── README.md             # Project documentation
```
