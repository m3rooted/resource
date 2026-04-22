import { Button, Stack } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const menuItems = [
  { label: 'Directors', path: '/directors', variant: 'success' },
  { label: 'Producers', path: '/producers', variant: 'info' },
  { label: 'Stars', path: '/stars', variant: 'danger' },
  { label: 'Genres', path: '/genres', variant: 'secondary' },
  { label: 'Movies', path: '/movies', variant: 'warning' },
];

function Menu() {
  return (
    <div className="text-center py-5">
      <h2 className="mb-4">Dashboard</h2>

      <Stack direction="horizontal" gap={2} className="justify-content-center flex-wrap">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            as={NavLink}
            to={item.path}
            variant={item.variant}
            className="px-4"
            style={{ minWidth: 136 }}
          >
            {item.label}
          </Button>
        ))}
      </Stack>
    </div>
  );
}

export default Menu;
