import { User, ChevronRight } from 'lucide-react' // Add User if not there

// Inside the return, right after <h1>Settings</h1>:
<Section title="Account">
  <LinkRow 
    to="/profile" 
    title="Profile" 
    hint="Manage your name, photo and personal details." 
  />
</Section>