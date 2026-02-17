export interface StepConfig {
  id: number;
  slug: string;
  title: string;
  prompt: string;
}

export const RB_STEPS: StepConfig[] = [
  { 
    id: 1, 
    slug: '01-problem', 
    title: 'Problem Statement', 
    prompt: 'Draft a comprehensive problem statement for the AI Resume Builder. Focus on user pain points in the current job market, ATS compatibility issues, and the need for AI-driven content optimization.' 
  },
  { 
    id: 2, 
    slug: '02-market', 
    title: 'Market Analysis', 
    prompt: 'Perform a market analysis. Identify top 3 competitors (e.g., Rezi, Teal), analyze their feature sets, pricing models, and gaps. Define our Unique Value Proposition (UVP).' 
  },
  { 
    id: 3, 
    slug: '03-architecture', 
    title: 'System Architecture', 
    prompt: 'Design the high-level system architecture. Define the frontend (React/Vite), backend (Node/Python or Serverless), Database (PostgreSQL/Supabase), and AI integration points (OpenAI API).' 
  },
  { 
    id: 4, 
    slug: '04-hld', 
    title: 'High Level Design (HLD)', 
    prompt: 'Create the High Level Design. Map out the user flow: Sign up -> Upload Resume/Input Data -> AI Processing -> Preview -> Export. Define the core microservices or modules.' 
  },
  { 
    id: 5, 
    slug: '05-lld', 
    title: 'Low Level Design (LLD)', 
    prompt: 'Create the Low Level Design. Define the database schema (Users, Resumes, Experience, Education tables). Define the API endpoints (POST /generate, GET /resume/:id).' 
  },
  { 
    id: 6, 
    slug: '06-build', 
    title: 'Core Build', 
    prompt: 'Generate the core React components. Create the ResumeEditor, PreviewPane, and FormInput components. Ensure responsive design using Tailwind CSS.' 
  },
  { 
    id: 7, 
    slug: '07-test', 
    title: 'Testing Strategy', 
    prompt: 'Develop a testing strategy. Write unit tests for the resume parsing logic. Create integration tests for the AI generation flow. Define manual QA steps.' 
  },
  { 
    id: 8, 
    slug: '08-ship', 
    title: 'Deployment & Ship', 
    prompt: 'Prepare for deployment. Configure the build scripts, set up environment variables, and define the CI/CD pipeline (e.g., GitHub Actions to Vercel/Netlify).' 
  },
];

export const STORAGE_PREFIX = 'rb_step_';
