# Task Flow — Task Manager

A simple and elegant task manager web application built with Next.js.

## Live Demo

[https://task-manager-deltone.vercel.app/](https://task-manager-deltone.vercel.app/)


## Screenshot

![alt text](image.png)

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **Plain CSS** (no Tailwind, no CSS frameworks)
- **localStorage** for data persistence
- **Jest** + **React Testing Library** for unit testing
- **GitHub Actions** for CI/CD
- **Vercel** for deployment

## Features

- Create tasks with title and description
- Edit existing tasks with pre-filled modal form
- Delete tasks with confirmation prompt
- Toggle tasks between complete and incomplete states
- Search tasks by title and description (debounced)
- Filter tasks: All / Active / Completed with count badges
- Pagination (5 tasks per page)
- Form validation with character counters
- Responsive design (mobile, tablet, desktop)
- Data persists across browser refreshes via localStorage
- Skeleton loading state
- Custom 404 page

## How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AshenSachinthana/task-manager-deltone.git
   cd task-manager-deltone
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Running Tests Locally

Run all unit tests with:

```bash
npm test
```

## CI/CD Pipeline

This project uses **GitHub Actions** for continuous integration and deployment.

Every push to `main` automatically triggers the pipeline:

```
Push to main → Install Dependencies → Run All Tests → Tests Pass? → Deploy to Vercel
                                                     → Tests Fail? → Deployment blocked
```

- Tests must pass before any deployment happens
- Pull requests to `main` also run tests (but do not deploy)
- The workflow is defined in `.github/workflows/ci-cd.yml`

## Architecture

Next.js App Router is used to demonstrate server/client component separation. All task state is managed client-side via localStorage, keeping the app fully static with no backend required.

### Project Structure

```
app/
  layout.tsx         — Root layout with Inter font and metadata
  page.tsx           — Home page (Server Component wrapper)
  loading.tsx        — Full-page loading skeleton
  not-found.tsx      — Custom 404 page
  globals.css        — Global styles, CSS variables, resets

components/
  TaskBoard.tsx      — Main client container, holds all state
  TaskForm.tsx       — Add new task modal/form
  TaskEditModal.tsx  — Edit existing task modal
  TaskItem.tsx       — Single task card
  TaskList.tsx       — Renders filtered/paginated task cards
  SearchBar.tsx      — Search input component
  FilterTabs.tsx     — All / Active / Completed tabs
  Pagination.tsx     — Pagination controls
  EmptyState.tsx     — Empty state messages
  Navbar.tsx         — App header

hooks/
  useTasks.ts        — Task CRUD logic + localStorage sync
  usePagination.ts   — Pagination logic
  useSearch.ts       — Debounced search logic

__tests__/
  hooks/             — Unit tests for custom hooks
  components/        — Unit tests for React components

.github/workflows/
  ci-cd.yml      — GitHub Actions CI/CD pipeline
```
