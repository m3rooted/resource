import { Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Menu from './components/Menu';
import Director from './components/Director';
import Star from './components/Star';
import Movie from './components/Movie';

function App() {
  return (
    <BrowserRouter>
      <Container>
        <Menu />

        <Routes>
          <Route path="/directors" element={<Director />} />
          <Route path="/stars" element={<Star />} />
          <Route path="/movies" element={<Movie />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;