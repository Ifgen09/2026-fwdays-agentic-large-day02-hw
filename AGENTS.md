# AGENTS.md — орієнтир для агентів у цьому репозиторії

Цей файл узагальнює контекст для автоматизованих асистентів і людей, які швидко входять у проєкт. **Джерело правди для деталей** — memory bank у `docs/memory/` (особливо `techContext.md` та `systemPatterns.md`).

## Memory bank

Читай актуальний контекст у цих файлах (решта за потреби):

| Файл | Зміст |
|------|--------|
| `docs/memory/techContext.md` | Yarn workspaces, Node, версії залежностей, збірка, команди, Vite, тести |
| `docs/memory/systemPatterns.md` | Монорепо, межі пакетів, app vs library, Jotai, стилі, колаб, Sentry |
| `docs/memory/projectbrief.md` | Продукт, цілі, non-goals, шари пакетів |
| `docs/memory/activeContext.md` | Поточний фокус роботи (оновлюється в процесі) |
| `docs/memory/decisionLog.md` | Рішення та обґрунтування |
| `docs/memory/progress.md`, `docs/memory/productContext.md` | Стан і продуктовий контекст |

## Проєкт у двох реченнях

**Excalidraw** — open-source whiteboard у hand-drawn стилі. Репозиторій — **монорепо** (`excalidraw-monorepo`): бібліотека `@excalidraw/excalidraw` і продуктовий за додаток `excalidraw-app` (колаборація, Firebase, PWA тощо). Детальніше: `docs/memory/projectbrief.md`.

## Технології та команди (з `techContext.md`)

- **Пакети:** Yarn Classic **1.22.22**, workspaces: `excalidraw-app`, `packages/*`, `examples/*`.
- **Node:** `>=18.0.0` (корінь і `excalidraw-app`).
- **Ключовий стек:** TypeScript **5.9**, Vite **5**, Vitest **3**, React **19**, Jotai **2.11**; публічні пакети `@excalidraw/*` за версіями з відповідних `package.json`.
- **Збірка бібліотеки:** esbuild + esbuild-sass-plugin (`scripts/buildPackage.js`).
- **Корисні скрипти (з кореня):**
  - `yarn start` — dev застосунку (Vite у `excalidraw-app`)
  - `yarn build` / `yarn build:packages` — збірка
  - `yarn test`, `yarn test:app`, `yarn test:all` — тести та повна перевірка
  - `yarn test:typecheck`, `yarn test:code`, `yarn test:other` — типи, ESLint, Prettier
  - `yarn fix`, `yarn fix:code` — автофікс
  - `yarn start:example` — приклад після `build:packages`
- **Середовище:** Vite читає `.env*` з кореня (`envDir: "../"` у `excalidraw-app/vite.config.mts`); порт **3000** або `VITE_APP_PORT`.
- **Тести:** Vitest з alias `@excalidraw/*`, як у `tsconfig` / Vite (`vitest.config.mts`).

## Архітектурні патерни (з `systemPatterns.md`)

- **TypeScript:** кореневий `tsconfig.json` покриває `packages` і `excalidraw-app`; `examples`, `dist`, `types`, `tests` виключені з `include` там, де це зафіксовано в memory bank.
- **Path aliases:** `@excalidraw/common|element|excalidraw|math|utils` → `packages/*/src` (узгоджено в `tsconfig` і Vite для dev).
- **Розділення:**
  - `packages/excalidraw` — React-компоненти редактора, публічний API (`ExcalidrawAPIProvider`, `onExcalidrawAPI`, контексти).
  - `excalidraw-app` — імпорт з `@excalidraw/excalidraw` + колаб (`collab/`), Firebase (`data/firebase.ts`), Jotai у `app-jotai`, обгортка `App.tsx`.
- **Стан:** Jotai у ядрі та в застосунку; **imperative API** для керування редактором ззовні.
- **Стилі:** глобальні імпорти в `packages/excalidraw/index.tsx`; для компонентів — **CSS modules** (конвенція в репозиторії).
- **Інтеграції в застосунку:** Firebase (Firestore, Storage), Socket.IO у колабі, Sentry (`excalidraw-app/sentry`, підключення з `index.tsx`).
- **Геометрія:** узгоджувати типи з `packages/math` (наприклад `Point` у `packages/math/src/types.ts`).

## Обовʼязкові обмеження для змін коду

### Захищені файли (не змінювати без явного схвалення)

- `packages/excalidraw/scene/Renderer.ts` — пайплайн рендеру
- `packages/excalidraw/data/restore.ts` — сумісність формату файлів
- `packages/excalidraw/actions/manager.tsx` — система дій
- `packages/excalidraw/types.ts` — основні типи

Після змін у цих файлах очікується повне розуміння залежностей, повний тестовий прогін і ручна перевірка.

### Конвенції коду (`.cursor/rules/excalidraw-code-conventions.mdc`)

- Компоненти: лише функції + hooks; `type {Name}Props`; **named exports**; тести поруч: `ComponentName.test.tsx`.
- TypeScript: strict, без `any` і `@ts-ignore`; для простих форм краще `type`; типи імпортувати через `import type`.
- Імена файлів: kebab-case для утиліт, PascalCase для компонентів React.

## Pull request workflow

### Документація для контрибʼюторів

- Коротко в репо: `CONTRIBUTING.md` → посилання на [офіційні docs — Contributing](https://docs.excalidraw.com/docs/introduction/contributing).
- Локальна копія: `dev-docs/docs/introduction/contributing.mdx` (якщо збираєш dev-docs).

### Гілки та PR

- Базова гілка: **`master`** (див. workflows у `.github/workflows/`).
- Робоча гілка: окрема feature/fix гілка від `master`, один PR на змістовну зміну (легше ревʼю й відкат).
- **Заголовок PR** має відповідати **Conventional Commits** / semantic PR (перевіряє workflow `Semantic PR title` — `.github/workflows/semantic-pr-title.yml`). Типові префікси: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:` тощо.
- **Шаблон опису PR:** `.github/PULL_REQUEST_TEMPLATE.md` (у цьому форку — чеклист workshop Day 2; для upstream зазвичай інший шаблон — орієнтуйся на репозиторій, куди відкриваєш PR).

### Що запускати локально перед push

Мінімум узгоджений з CI на PR (див. нижче):

- `yarn test:typecheck` — TypeScript
- `yarn test:code` — ESLint
- `yarn test:other` — Prettier check
- `yarn test` або `yarn test:app` — тести (на `push` у `master` у CI гоняється `yarn test:app`)

Повна перевірка як у «all»: `yarn test:all` (typecheck + eslint + prettier + тести застосунку). Після змін у пакетах бібліотеки: `yarn build` / `yarn build:packages` за потреби.

### CI на pull request (орієнтир)

| Workflow (файл) | Що робить |
|-----------------|-----------|
| `lint.yml` | `yarn test:other`, `yarn test:code`, `yarn test:typecheck` |
| `test-coverage-pr.yml` | `yarn test:coverage` + звіт покриття у PR |
| `size-limit.yml` | перевірка розміру бандла `@excalidraw/excalidraw` (PR у `master`) |
| `semantic-pr-title.yml` | валідація semantic title |
| `locales-coverage.yml` | покриття перекладів (push у гілку `l10n_master`, не звичайний PR) |

Після злиття на `master` тести застосунку також гоняються в `test.yml` (`yarn test:app`).

`cancel.yml` скасовує застарілі прогони CI при нових push/оновленнях PR (зменшує чергу).

### Ревʼю та мердж

- Відповідай на коментарі ревʼю, тримай PR оновленим відносно базової гілки (`master`), розвʼязуй конфлікти до мерджу.
- Стратегія мерджу (squash / merge commit) залежить від налаштувань репозиторію на GitHub — уточнюй у мейнтейнерів або в політиці org/repo.
- Зміни в **захищених файлах** (розділ вище) — лише з обережністю: повний прогін тестів і ручна перевірка перед мерджем.

### Додаткові орієнтири для AI / Copilot

- `.github/copilot-instructions.md` — стиль і узгоджені практики TypeScript/React у цьому репо.

## Де що шукати в коді

| Питання | Куди дивитися |
|---------|----------------|
| Точка входу застосунку | `excalidraw-app/index.tsx`, `excalidraw-app/App.tsx` |
| Публічний API редактора | `packages/excalidraw/index.tsx` |
| Колаборація | `excalidraw-app/collab/` |
| Конфіг Vite | `excalidraw-app/vite.config.mts` |
| Alias і типи для тестів | `tsconfig.json`, `vitest.config.mts` |

Перед значними змінами перечитуй `docs/memory/activeContext.md` і при потребі оновлюй memory bank відповідно до процесу команди.
