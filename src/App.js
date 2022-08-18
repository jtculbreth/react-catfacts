import './App.css';
import Sidebar from './components/Sidebar/Sidebar.js';
import CatWindow from './components/CatWindow/CatWindow.js';
import { CatProvider, SearchProvider } from './contexts.js';

function App() {

  return (
    <div className="App">
      <CatProvider>
        <div className="container">
          <div className="row">
            <div className="col-md-3 col-sm-3 col-lg-3">
              <SearchProvider>
                <Sidebar></Sidebar>
              </SearchProvider>
            </div>
            <div className="col-sm-9 col-md-9 col-lg-9">
              <CatWindow test-id="CatWindow"></CatWindow>
            </div>
          </div>
        </div>
      </CatProvider>
    </div>
  );
}



export default App;
