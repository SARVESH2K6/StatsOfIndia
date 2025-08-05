import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "./ui/button"
import { 
  Home, 
  Database, 
  User, 
  BarChart3, 
  LogOut,
  Settings,
  Bookmark,
  Download
} from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

interface NavigationProps {
  user?: any
  onLogout?: () => void
}

export default function Navigation({ user, onLogout }: NavigationProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-stone-50/90 backdrop-blur-md border-b border-stone-200/50 dark:bg-stone-900/90 dark:border-stone-700/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  StatsOfIndia
                </h1>
                <p className="text-xs text-stone-500 dark:text-stone-400">Data Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
                         <Button
               variant={isActive('/') ? "default" : "ghost"}
               size="sm"
               onClick={() => navigate('/')}
               className={isActive('/') ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" : ""}
             >
               <Home className="w-4 h-4 mr-2" />
               Home
             </Button>
             
             <Button
               variant={isActive('/data-portal') ? "default" : "ghost"}
               size="sm"
               onClick={() => navigate('/data-portal')}
               className={isActive('/data-portal') ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" : ""}
             >
               <Database className="w-4 h-4 mr-2" />
               Browse Data
             </Button>

             {user && (
               <>
                 <Button
                   variant={isActive('/dashboard') ? "default" : "ghost"}
                   size="sm"
                   onClick={() => navigate('/dashboard')}
                   className={isActive('/dashboard') ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" : ""}
                 >
                   <User className="w-4 h-4 mr-2" />
                   Dashboard
                 </Button>

                 {user.role === 'admin' && (
                   <Button
                     variant={isActive('/admin') ? "default" : "ghost"}
                     size="sm"
                     onClick={() => navigate('/admin')}
                     className={isActive('/admin') ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" : ""}
                   >
                     <Settings className="w-4 h-4 mr-2" />
                     Admin
                   </Button>
                 )}
               </>
             )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                                 <div className="flex items-center space-x-2">
                   <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                     <User className="w-4 h-4 text-white" />
                   </div>
                   <span className="text-sm font-medium text-stone-700 dark:text-stone-300 hidden sm:block">
                     {user.fullName}
                   </span>
                   <div className="px-2 py-1 text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 rounded-full">
                     {user.role === 'admin' ? 'Admin' : 'User'}
                   </div>
                 </div>

                 <ThemeToggle />
                 <Button 
                   variant="outline" 
                   size="sm" 
                   onClick={onLogout}
                   className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                 >
                   <LogOut className="w-4 h-4 mr-2" />
                   <span className="hidden sm:inline">Logout</span>
                 </Button>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 