import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Form, Table } from 'react-bootstrap';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:9999';
const cleanText = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
const genderText = (male) => (male ? 'Male' : 'Female');

function Director() {
  const [directorList, setDirectorList] = useState([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    axios
      .get(`${API_URL}/directors`)
      .then((response) => setDirectorList(response.data))
      .catch((error) => console.error(error));
  }, []);

  const directors = useMemo(() => {
    const searchText = keyword.trim().toLowerCase();

    return directorList.filter((director) =>
      cleanText(director.FullName).toLowerCase().includes(searchText)
    );
  }, [directorList, keyword]);

  return (
    <section>
      <h2 className="mb-3">Directors List</h2>

      <Form.Control
        className="mb-3"
        type="text"
        placeholder="Search by full name..."
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
      />

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Gender</th>
            <th>DOB</th>
            <th>Nationality</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {directors.map((director) => (
            <tr key={director.id}>
              <td>{director.id}</td>
              <td>{cleanText(director.FullName)}</td>
              <td>{genderText(director.Male)}</td>
              <td>{director.Dob}</td>
              <td>{cleanText(director.Nationality)}</td>
              <td>{cleanText(director.Description)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </section>
  );
}

export default Director;
