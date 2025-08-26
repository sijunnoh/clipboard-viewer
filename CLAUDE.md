# Project Conventions

## Icon Imports
When importing icons from `lucide-react`, always use the component name with "Icon" suffix.

✅ Correct:
```typescript
import { XIcon, ClipboardPasteIcon, MaximizeIcon } from "lucide-react"
```

❌ Incorrect:
```typescript
import { X, ClipboardPaste, Maximize } from "lucide-react"
```

## Project Structure
```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   └── react-flow/   # React Flow custom components
│       └── nodes/    # Custom node components
├── store/           # Zustand stores
└── lib/             # Utility functions
```

## Key Features
- **Clipboard Viewer**: Visualizes clipboard content with different data types
- **React Flow**: Node-based visualization
- **Data Type Detection**: Automatically detects HTML, images, JSON, and text
- **Zoom Modal**: Detailed view for each clipboard entry

## Development Commands
```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm lint     # Run ESLint
```

## Technologies
- React 19
- TypeScript
- React Flow
- Zustand
- Tailwind CSS
- shadcn/ui
- Vite