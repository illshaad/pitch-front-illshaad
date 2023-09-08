import Axios from 'axios';

const createStartup = async (data: FormData) => {
  const response = await Axios.post(
    'http://localhost:3000/startups/create',
    data
  );
  return response.data;
};

const getStartups = async () => {
  const response = await Axios.get('http://localhost:3000/startups');
  return response.data;
};

const getStartupById = async (id: string) => {
  const response = await Axios.get(`http://localhost:3000/startups/${id}`);
  return response.data;
};
const editStartup = async (id: string, data: FormData) => {
  const response = await Axios.put(
    `http://localhost:3000/startups/${id}`,
    data
  );
  return response.data;
};

const deleteStartup = async (id: string) => {
  const response = await Axios.delete(`http://localhost:3000/startups/${id}`);
  return response.data;
};

const deleteStartups = async (ids: string[]) => {
  const response = await Axios.delete(
    `http://localhost:3000/startups/allremoves`,
    { data: ids }
  );
  return response.data;
};

export {
  createStartup,
  getStartups,
  getStartupById,
  editStartup,
  deleteStartup,
  deleteStartups,
};
