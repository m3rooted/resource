import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Col, Form, Row, Table } from 'react-bootstrap';
import fallbackData from '../data/database.json';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:9999';
const cleanText = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
const genderText = (male) => (male ? 'Male' : 'Female');

function Star() {
  const [starList, setStarList] = useState(fallbackData.stars);
  const [keyword, setKeyword] = useState('');
  const [gender, setGender] = useState('all');

  useEffect(() => {
    axios
      .get(`${API_URL}/stars`)
      .then((response) => setStarList(response.data))
      .catch(() => setStarList(fallbackData.stars));
  }, []);

  const stars = useMemo(() => {
    const searchText = keyword.trim().toLowerCase();

    return starList.filter((star) => {
      const matchesName = cleanText(star.FullName).toLowerCase().includes(searchText);
      const matchesGender =
        gender === 'all' ||
        (gender === 'male' && star.Male) ||
        (gender === 'female' && !star.Male);

      return matchesName && matchesGender;
    });
  }, [gender, keyword, starList]);

  return (
    <section>
      <h2 className="mb-3">Stars List</h2>

      <Row className="g-3 mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search by full name..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select value={gender} onChange={(event) => setGender(event.target.value)}>
            <option value="all">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Form.Select>
        </Col>
      </Row>

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
          {stars.map((star) => (
            <tr key={star.id}>
              <td>{star.id}</td>
              <td>{cleanText(star.FullName)}</td>
              <td>{genderText(star.Male)}</td>
              <td>{star.Dob}</td>
              <td>{cleanText(star.Nationality)}</td>
              <td className="text-truncate" style={{ maxWidth: 470 }}>
                {cleanText(star.Description)}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </section>
  );
}

export default Star;
