import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:9999';
const cleanText = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();

const getById = (items, id) => items.find((item) => item.id === id);

function Movie() {
  const [movieList, setMovieList] = useState([]);
  const [producerList, setProducerList] = useState([]);
  const [directorList, setDirectorList] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [producerId, setProducerId] = useState('all');
  const [directorId, setDirectorId] = useState('all');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/movies`),
      axios.get(`${API_URL}/producers`),
      axios.get(`${API_URL}/directors`),
    ])
      .then(([moviesResponse, producersResponse, directorsResponse]) => {
        setMovieList(moviesResponse.data);
        setProducerList(producersResponse.data);
        setDirectorList(directorsResponse.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const movies = useMemo(() => {
    const searchText = keyword.trim().toLowerCase();

    return [...movieList]
      .filter((movie) => {
        const matchesTitle = cleanText(movie.Title).toLowerCase().includes(searchText);
        const matchesProducer = producerId === 'all' || String(movie.ProducerId) === producerId;
        const matchesDirector = directorId === 'all' || String(movie.DirectorId) === directorId;

        return matchesTitle && matchesProducer && matchesDirector;
      })
      .sort((firstMovie, secondMovie) => {
        const firstDate = new Date(firstMovie.ReleaseDate).getTime();
        const secondDate = new Date(secondMovie.ReleaseDate).getTime();

        return sortDirection === 'asc' ? firstDate - secondDate : secondDate - firstDate;
      });
  }, [directorId, keyword, movieList, producerId, sortDirection]);

  return (
    <section>
      <h2 className="mb-3">Movies List</h2>

      <Row className="g-3 mb-3 align-items-stretch">
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="Search title..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select value={producerId} onChange={(event) => setProducerId(event.target.value)}>
            <option value="all">All Producers</option>
            {producerList.map((producer) => (
              <option key={producer.id} value={producer.id}>
                {cleanText(producer.Name)}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select value={directorId} onChange={(event) => setDirectorId(event.target.value)}>
            <option value="all">All Directors</option>
            {directorList.map((director) => (
              <option key={director.id} value={director.id}>
                {cleanText(director.FullName)}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button
            className="w-100"
            variant="primary"
            onClick={() =>
              setSortDirection((currentDirection) =>
                currentDirection === 'asc' ? 'desc' : 'asc'
              )
            }
          >
            Sort Date ({sortDirection})
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Release</th>
            <th>Language</th>
            <th>Producer</th>
            <th>Director</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => {
            const producer = getById(producerList, movie.ProducerId);
            const director = getById(directorList, movie.DirectorId);

            return (
              <tr key={movie.id}>
                <td>{movie.id}</td>
                <td>{cleanText(movie.Title)}</td>
                <td>{movie.ReleaseDate}</td>
                <td>{cleanText(movie.Language)}</td>
                <td>{cleanText(producer?.Name)}</td>
                <td>{cleanText(director?.FullName)}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </section>
  );
}

export default Movie;
