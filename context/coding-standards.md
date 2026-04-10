Dựa trên **Project Specifications của dự án CineFast** (Dự án đặt vé xem phim sử dụng ReactJS/Vite + Python FastAPI), tôi đã điều chỉnh lại bản Coding Standards cho phù hợp với stack công nghệ thực tế (tách biệt Frontend và Backend, không sử dụng Next.js hay Prisma, đổi sang Vite, FastAPI và SQLAlchemy/SQLModel).

---

# CineFast Coding Standards

## 1. General Principles
- **Clarity over cleverness:** Code must be readable and easy to understand.
- **Strict Typing:** Both Frontend (TypeScript) and Backend (Python) must use strict typing.
- **Separation of Concerns:** Keep business logic in the backend, and UI presentation in the frontend.

---

## 2. Frontend (ReactJS + Vite)

### TypeScript
- Strict mode enabled (`"strict": true` in `tsconfig.json`).
- Avoid `any` - use proper interfaces/types or `unknown` if necessary.
- Define explicit interfaces for all component Props, API requests, and API responses.

### React Components
- **Functional components only** (No class components).
- Use hooks (`useState`, `useEffect`, `useMemo`, `useCallback`) for state and side effects.
- Extract complex logic into custom hooks (e.g., `useSeatSelection`, `useCountdown`).
- Keep components small and focused (Single Responsibility Principle).

### State Management & Data Fetching
- Use **React Query (TanStack Query)** for server state management (caching API responses, mutations, loading states).
- Use **Zustand** or React Context for global client state (e.g., Dark Mode, User Session, Shopping Cart/Selected Seats).
- Fetch data exclusively through a centralized API service layer (e.g., `src/services/api.ts`) using `axios` or `fetch`.

### Styling & UI Framework
- **Tailwind CSS v4** for all styling.
  - *Note for v4:* Configuration is CSS-based via `@theme` in `src/index.css`. **Do not** create `tailwind.config.js`.
- Use **ShadCN UI** components for consistent, accessible design patterns.
- Ensure **Dark Mode First** design, using Tailwind's `dark:` variant.
- No inline styles unless dynamically calculated (like absolute positioning for seat maps).

### File Organization (Frontend)
```text
src/
├── components/
│   ├── common/         # Shared UI (Buttons, Inputs)
│   ├── features/       # Feature-specific components (e.g., SeatMap, CheckoutModal)
│   └── layouts/        # Header, Footer, Sidebar
├── hooks/              # Custom React hooks
├── pages/              # Route components (Home, MovieDetail, Booking)
├── services/           # API calls and Axios config
├── store/              # Zustand stores
├── types/              # TypeScript interfaces
└── utils/              # Helper functions (date formatters, price calculators)
```

### Naming Conventions
- Components/Interfaces: `PascalCase` (e.g., `SeatMap.tsx`, `MovieProps`).
- Functions/Variables: `camelCase` (e.g., `fetchShowtimes`, `selectedSeats`).
- Constants: `SCREAMING_SNAKE_CASE` (e.g., `MAX_SEATS_PER_BOOKING`).
- File names: Match component name (`SeatMap.tsx`) or kebab-case for utilities (`date-utils.ts`).

---

## 3. Backend (Python FastAPI)

### Python Standards
- Use Python 3.10+ features.
- Strict type hinting using standard `typing` and Pydantic models.
- Follow **PEP 8** style guidelines (enforced by `Ruff` or `Black`).

### FastAPI & Pydantic
- Use Pydantic `BaseModel` for all request/response schemas.
- Group API routes into logical routers (e.g., `routers/movies.py`, `routers/bookings.py`).
- Keep route handlers thin; delegate business logic to services/controllers.

### Database (SQLAlchemy + Alembic)
- Use **SQLAlchemy 2.0** style (or SQLModel) for all database operations.
- **Never modify the database schema manually.** Always use Alembic.
  - Create migrations: `alembic revision --autogenerate -m "description"`
  - Apply migrations: `alembic upgrade head`
- Keep database sessions scoped per request using FastAPI's `Depends(get_db)`.

### Redis & Real-time Locking (Crucial for CineFast)
- Use `redis-py` for seat locking and caching.
- Seat locks must ALWAYS have a **TTL (Time To Live)** (e.g., 5 minutes) to prevent permanent deadlocks if a user drops off.
- Use explicit Redis lock patterns to prevent race conditions during checkout.

### File Organization (Backend)
```text
app/
├── api/
│   ├── dependencies.py # Reusable FastAPI Depends (Auth, DB session)
│   └── routers/        # Route definitions
├── core/               # Settings, config, security setup
├── models/             # SQLAlchemy ORM models
├── schemas/            # Pydantic models (Input/Output validation)
├── services/           # Business logic (e.g., BookingService, SeatLockService)
├── tasks/              # Celery background tasks
└── utils/              # Helper functions
```

### Error Handling
- Never return raw 500 stack traces to the client.
- Raise specific `HTTPException` with clear, user-friendly messages (e.g., `409 Conflict` for "Seat already locked").
- Use centralized exception handlers in FastAPI for consistent error response formats.

---

## 4. General Code Quality
- **Validation:** Validate all inputs thoroughly on both Frontend (Zod/Yup) and Backend (Pydantic).
- **No Dead Code:** Remove commented-out code, unused imports, and console logs before pushing.
- **Functions:** Keep functions concise (ideally under 50 lines). If it's longer, consider refactoring.
- **Git Flow:** Write clear, descriptive commit messages. Create feature branches for new development.