# Backend Integration with Next.js 15 Summary

## ✅ Completed Implementation

### 1. Database Setup and Configuration
- **PostgreSQL**: Configured for Docker at port 5432
- **Database Name**: `frontend` for hosting tables
- **Connection**: Environment-based configuration
- **Drizzle ORM**: Type-safe database operations

### 2. Dependencies Installed
```json
{
  "zod": "^3.22.4",           // Runtime validation
  "drizzle-orm": "^0.29.0",   // Type-safe ORM
  "postgres": "^3.4.3",       // PostgreSQL driver
  "@types/pg": "^8.15.5",     // TypeScript types
  "drizzle-kit": "^0.20.0"   // Database migrations
}
```

### 3. Database Schema
```typescript
// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Posts table
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content'),
  published: boolean('published').default(false).notNull(),
  authorId: serial('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Comments table
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  postId: serial('post_id').references(() => posts.id),
  authorId: serial('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Newsletter subscriptions table
export const newsletterSubscriptions = pgTable('newsletter_subscriptions', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  subscribed: boolean('subscribed').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

## 🔧 Zod Validation Schemas

### 1. User Validation
```typescript
export const createUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  name: z.string().min(1, { message: "Name is required." }).max(255),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }).max(255).optional(),
});
```

### 2. Post Validation
```typescript
export const createPostSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }).max(255),
  content: z.string().optional(),
  published: z.boolean().default(false),
  authorId: z.number().int().positive(),
});
```

### 3. Newsletter Validation
```typescript
export const newsletterSubscriptionSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});
```

## 🚀 Server Actions Implementation

### 1. User Management
```typescript
export async function createUser(formData: FormData) {
  try {
    const rawData = {
      email: formData.get('email') as string,
      name: formData.get('name') as string,
    };

    const validation = createUserSchema.safeParse(rawData);

    if (!validation.success) {
      return { 
        success: false, 
        message: validation.error.issues[0].message 
      };
    }

    const newUser = await db.insert(users).values(validation.data).returning();

    return { 
      success: true, 
      message: 'User created successfully!',
      data: newUser[0]
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return { 
      success: false, 
      message: 'Failed to create user. Please try again.' 
    };
  }
}
```

### 2. Newsletter Subscription
```typescript
export async function subscribeToNewsletter(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    
    const validation = newsletterSubscriptionSchema.safeParse({ email });

    if (!validation.success) {
      return { 
        success: false, 
        message: validation.error.issues[0].message 
      };
    }

    // Check if email already exists
    const existingSubscription = await db
      .select()
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, email))
      .limit(1);

    if (existingSubscription.length > 0) {
      return { 
        success: false, 
        message: 'Email is already subscribed to the newsletter.' 
      };
    }

    const newSubscription = await db
      .insert(newsletterSubscriptions)
      .values({ email })
      .returning();

    return { 
      success: true, 
      message: 'Successfully subscribed to newsletter!',
      data: newSubscription[0]
    };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return { 
      success: false, 
      message: 'Failed to subscribe to newsletter. Please try again.' 
    };
  }
}
```

## 🌐 API Routes Implementation

### 1. Users API Route
```typescript
// GET /api/users
export async function GET() {
  try {
    const allUsers = await db.select().from(users);
    
    return NextResponse.json({
      success: true,
      message: 'Users retrieved successfully',
      data: allUsers
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch users.' 
      },
      { status: 500 }
    );
  }
}

// POST /api/users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = createUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: validation.error.issues[0].message 
        },
        { status: 400 }
      );
    }

    const newUser = await db.insert(users).values(validation.data).returning();

    return NextResponse.json({
      success: true,
      message: 'User created successfully!',
      data: newUser[0]
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create user. Please try again.' 
      },
      { status: 500 }
    );
  }
}
```

### 2. Newsletter API Route
```typescript
// POST /api/newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = newsletterSubscriptionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: validation.error.issues[0].message 
        },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Check if email already exists
    const existingSubscription = await db
      .select()
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, email))
      .limit(1);

    if (existingSubscription.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email is already subscribed to the newsletter.' 
        },
        { status: 409 }
      );
    }

    const newSubscription = await db
      .insert(newsletterSubscriptions)
      .values({ email })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
      data: newSubscription[0]
    }, { status: 201 });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to subscribe to newsletter. Please try again.' 
      },
      { status: 500 }
    );
  }
}
```

## 📁 Project Structure

```
src/
├── lib/
│   ├── db/
│   │   ├── index.ts          # Database connection
│   │   └── schema.ts         # Database schema
│   ├── server/
│   │   └── actions.ts        # Server Actions
│   └── validations.ts        # Zod schemas
├── app/
│   ├── api/
│   │   ├── users/
│   │   │   └── route.ts      # Users API
│   │   ├── posts/
│   │   │   └── route.ts      # Posts API
│   │   └── newsletter/
│   │       └── route.ts      # Newsletter API
│   └── page.tsx              # Main page with demos
└── components/
    └── BackendDemo.tsx       # Backend functionality demo
```

## 🔧 Configuration Files

### 1. Environment Variables (.env.local)
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/frontend"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

### 2. Drizzle Configuration (drizzle.config.ts)
```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### 3. Package.json Scripts
```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

## 🎯 Key Features

### 1. Type Safety
- **Zod Validation**: Runtime type checking for all inputs
- **Drizzle ORM**: Compile-time type safety for database operations
- **TypeScript**: Full type coverage for all backend code

### 2. Error Handling
- **Validation Errors**: Clear error messages from Zod
- **Database Errors**: Proper error handling and user feedback
- **HTTP Status Codes**: Appropriate status codes for different scenarios

### 3. Data Validation
- **Email Validation**: Proper email format checking
- **Required Fields**: Validation for required data
- **Length Limits**: String length validation
- **Type Checking**: Runtime type validation

### 4. Database Operations
- **CRUD Operations**: Create, Read, Update, Delete
- **Relationships**: Foreign key relationships between tables
- **Unique Constraints**: Email uniqueness validation
- **Timestamps**: Automatic created/updated timestamps

## 🚀 Usage Examples

### 1. Server Actions
```typescript
// In a React component
const handleCreateUser = () => {
  startTransition(async () => {
    const formData = new FormData();
    formData.append('email', 'user@example.com');
    formData.append('name', 'John Doe');
    
    const result = await createUser(formData);
    setResponse(result);
  });
};
```

### 2. API Routes
```typescript
// Fetch users via API
const response = await fetch('/api/users');
const data = await response.json();

// Create user via API
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', name: 'John Doe' })
});
```

### 3. Database Operations
```typescript
// Direct database operations
const users = await db.select().from(users);
const newUser = await db.insert(users).values({ email, name }).returning();
```

## 🎉 Benefits Achieved

1. **Type Safety**: Full type coverage from frontend to database
2. **Data Validation**: Runtime validation with clear error messages
3. **Database Integration**: Type-safe ORM with PostgreSQL
4. **API Routes**: RESTful endpoints with proper error handling
5. **Server Actions**: Form integration with server-side validation
6. **Error Handling**: Comprehensive error handling and user feedback
7. **Scalability**: Structured codebase ready for growth

## 🔧 Database Setup Commands

```bash
# Generate database migrations
npm run db:generate

# Push schema to database
npm run db:push

# Open Drizzle Studio
npm run db:studio
```

The backend integration is now complete with full-stack type safety, data validation, and database operations ready for production use!
