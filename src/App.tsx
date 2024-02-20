import './App.css'
import { QueryClientProvider, QueryClient } from 'react-query'
import TablePage from './components/page/tablePage'

function App() {
 
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <TablePage/>
      </QueryClientProvider>
  )
}

export default App
