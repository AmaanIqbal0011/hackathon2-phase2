# Data Model: Todo Frontend Redesign

## UI Components Data Structure

### StatCard Component
- **Props**:
  - `icon`: ReactNode - Icon element to display
  - `value`: number | string - Numeric value to display
  - `label`: string - Descriptive label
  - `className?`: string - Additional CSS classes

### TaskCard Component
- **Props**:
  - `task`: Todo - Task object with id, title, description, completed status
  - `onToggleComplete`: (id: number, completed: boolean) => void - Callback for completion toggle
  - `onDelete`: (id: number) => void - Callback for deletion
  - `onEdit`: (task: Todo) => void - Callback for editing
  - `isCompleted`: boolean - Whether task is completed (affects styling)

### Sidebar Component
- **Props**:
  - `user`: User - Current user information
  - `navigationItems`: Array<{name: string, href: string, icon: ReactNode}> - Navigation items
  - `onLogout`: () => void - Logout callback

### AddTaskForm Component
- **Props**:
  - `onSubmit`: (title: string, description: string) => Promise<void> - Submit handler
  - `disabled`: boolean - Whether form is disabled during submission

## State Management

### Dashboard Page State
- `user`: User | null - Current authenticated user
- `tasks`: Todo[] - List of user's tasks
- `loading`: boolean - Loading state
- `error`: string | null - Error messages
- `filter`: 'all' | 'active' | 'completed' - Task filter state
- `searchQuery`: string - Search query for filtering tasks

### Landing Page State
- No complex state required (mostly static content)

## API Integration Objects

### Todo Interface
```typescript
interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}
```

### User Interface
```typescript
interface User {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
}
```

### Statistics Interface
```typescript
interface TaskStatistics {
  total: number;
  active: number;
  completed: number;
}
```

## Component Relationships

1. **Dashboard Page** contains:
   - Sidebar component
   - Header component
   - StatCard components (3 instances)
   - AddTaskForm component
   - TaskCard components (dynamic list)

2. **Landing Page** contains:
   - Hero section components
   - Features grid components
   - How it works components
   - Call to action components

3. **Sidebar** connects to:
   - Navigation routing
   - User logout functionality

## Validation Rules

- Task title must not be empty when adding new tasks
- Task title must not exceed 255 characters
- Search query should be trimmed and validated
- Form submissions should be disabled during API requests