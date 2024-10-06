import { Link } from "react-router-dom"
import Button from '@mui/joy/Button';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

export default function LandingPage() {
  return (
    <>
      <main className="flex-1">
        <div className="flex flex-col min-h-[80dvh]">
          <section className="w-full h-[80dvh] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50] to-[#8BC34A] opacity-80 transition-all duration-500 group-hover:opacity-100" />

            <div className="relative w-full aspect-square">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--secondary))" />
                  </linearGradient>
                </defs>
                <g className="animate-bounce">
                  <path d="M200,50 a150,150 0 1,0 0,300 a150,150 0 1,0 0,-300" fill="url(#gradient)" stroke="none" />
                  <g transform="translate(100,100)">
                    <path
                      d="M100,100 l-50,-50 l-50,50 l100,100 l100,-100 l-50,-50 z"
                      fill="hsl(var(--background))"
                      stroke="hsl(var(--primary-foreground))"
                      strokeWidth="10"
                    />
                    <g className="animate-spin">
                      <rect
                        x="20"
                        y="20"
                        width="60"
                        height="60"
                        rx="10"
                        ry="10"
                        fill="hsl(var(--background))"
                        stroke="hsl(var(--primary-foreground))"
                        strokeWidth="10"
                      />
                      <path d="M50,50 l20,0 l0,20 l-20,0 z" fill="hsl(var(--primary-foreground))" />
                    </g>
                  </g>
                </g>
              </svg>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
              <h1 className="text-4xl font-bold text-dark sm:text-5xl md:text-6xl lg:text-7xl">
                Stay on Top of Your Tasks | Streamline Your Workflow with TaskQuest
              </h1>
              <p className="max-w-[600px] mt-4 text-lg text-dark/80 sm:text-xl md:text-2xl">
                Our task tracking app helps you organize your work, stay focused, and achieve your goals.
                <br />
                Effortlessly manage your tasks, collaborate with your team, and stay on top of your projects
              </p>
              <Link
                to="/login"
              >
                <Button endDecorator={<KeyboardArrowRight />} color="danger">
                  Get Started
                </Button>
              </Link>
            </div>
          </section>
        </div>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="flex flex-col items-start space-y-4">
                <div className="bg-muted rounded-md flex items-center justify-center aspect-square w-12 md:w-16">
                  <ClipboardIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Task Management</h3>
                <p className="text-muted-foreground">
                  Easily create, assign, and track tasks for your team. Stay organized and on top of your projects.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="bg-muted rounded-md flex items-center justify-center aspect-square w-12 md:w-16">
                  <UsersIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Collaboration</h3>
                <p className="text-muted-foreground">
                  Invite your team members, assign tasks, and communicate seamlessly within the app.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="bg-muted rounded-md flex items-center justify-center aspect-square w-12 md:w-16">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Project Tracking</h3>
                <p className="text-muted-foreground">
                  Stay on top of your project timelines, deadlines, and progress with our powerful tracking features.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

function CalendarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  )
}


function ClipboardIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  )
}


function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}