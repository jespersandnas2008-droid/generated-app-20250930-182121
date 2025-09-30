# Ritual

A visually stunning and minimalist habit tracker designed to help you build better routines with elegance and focus.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/jespersandnas2008-droid/generated-app-20250930-150140)

## About The Project

Ritual is a minimalist and visually stunning web application designed to help users track personal habits and daily routines with ease and elegance. The application prioritizes a clean, uncluttered interface and delightful micro-interactions to create a motivating and enjoyable user experience.

The core of the application is a personal dashboard that provides insightful statistics on habit completion through beautiful charts and progress indicators. The design is mobile-first, ensuring a seamless experience across all devices.

## Key Features

- **Minimalist & Modern UI**: A clean, uncluttered interface with a strong emphasis on typography and white space.
- **Habit Management**: Easily create, view, edit, and delete personal habits.
- **Insightful Dashboard**: A central hub to view today's habits, weekly completion charts, and key stats like current streak.
- **Responsive Perfection**: Flawless layouts across all device sizes, from mobile to desktop.
- **Dark/Light Mode**: A gorgeous, seamless theme toggle for user preference.
- **Interactive Polish**: Smooth animations, hover states, and micro-interactions for a delightful user experience.

## Technology Stack

This project is a full-stack application built with a modern, type-safe technology stack.

- **Frontend**:
    - [React](https://reactjs.org/)
    - [Vite](https://vitejs.dev/)
    - [TypeScript](https://www.typescriptlang.org/)
    - [Tailwind CSS](https://tailwindcss.com/)
    - [shadcn/ui](https://ui.shadcn.com/)
    - [Zustand](https://zustand-demo.pmnd.rs/) for state management
    - [Framer Motion](https://www.framer.com/motion/) for animations
    - [Recharts](https://recharts.org/) for data visualization
- **Backend**:
    - [Hono](https://hono.dev/) running on Cloudflare Workers
- **Storage**:
    - [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/) for stateful, persistent storage.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine.
- A [Cloudflare account](https://dash.cloudflare.com/sign-up).

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/ritual-habit-tracker.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd ritual-habit-tracker
    ```
3.  **Install dependencies:**
    ```sh
    bun install
    ```
4.  **Run the development server:**
    The application will be available at `http://localhost:3000`.
    ```sh
    bun dev
    ```

## Project Structure

The project is organized into three main directories:

-   `src/`: Contains the frontend React application, including pages, components, hooks, and styles.
-   `worker/`: Contains the Hono backend application that runs on Cloudflare Workers, including API routes and Durable Object entity definitions.
-   `shared/`: Contains TypeScript types and mock data shared between the frontend and backend to ensure end-to-end type safety.

## Available Scripts

In the project directory, you can run:

-   `bun dev`: Runs the app in development mode with hot-reloading.
-   `bun build`: Builds the app for production.
-   `bun lint`: Lints the codebase using ESLint.
-   `bun deploy`: Builds and deploys the application to Cloudflare Workers.

## Deployment

This application is designed for seamless deployment to the Cloudflare network.

1.  **Login to Wrangler:**
    Authenticate the Wrangler CLI with your Cloudflare account.
    ```sh
    bunx wrangler login
    ```
2.  **Deploy the application:**
    Run the deploy script. This will build the frontend, bundle the worker, and deploy everything to your Cloudflare account.
    ```sh
    bun deploy
    ```

Alternatively, you can deploy directly from your GitHub repository using the button below.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/jespersandnas2008-droid/generated-app-20250930-150140)

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.