import React, { useState } from 'react';

import { Button, Grid, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';

import Picture from '../dashboard/picture.jpg';
import { Startup } from '../type';
import Checkbox from '@mui/material/Checkbox';
import { deleteStartup } from '../services/startup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
export default function Startups({
  startup,
  selectedStartupId,
  setSelectedStartupId,
  isSelected,
}: {
  startup: Startup;
  selectedStartupId: Startup['_id'][];
  isSelected: boolean;
  setSelectedStartupId: React.Dispatch<React.SetStateAction<Startup['_id'][]>>;
}) {
  const [expandedDescription, setExpandedDescription] =
    useState<boolean>(false);

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  const { name, description, _id } = startup;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (_id: string) => {
      return deleteStartup(_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getStartups'] });
    },
  });

  const toggleSelectedStartup = (startupId: string) => {
    const isSelected = selectedStartupId.includes(startupId);
    if (isSelected) {
      setSelectedStartupId(selectedStartupId.filter((id) => id !== startupId));
    } else {
      setSelectedStartupId([...selectedStartupId, startupId]);
    }
  };
  const toggleDescription = () => {
    setExpandedDescription(!expandedDescription);
  };

  const shortenedDescription =
    description.length >= 100 ? description.substring(0, 30) : description;

  return (
    <Paper
      sx={{
        boxShadow: isSelected ? 5 : 'none',
        mt: 2,
        p: 2,
        width: 350,
        overflow: 'auto',
      }}
    >
      <Checkbox {...label} onClick={() => toggleSelectedStartup(startup._id)} />

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          alt="Startup team"
          src={Picture}
          style={{ width: 60, height: 60, borderRadius: '50%' }}
        />

        <Typography component="h1" variant="h6" sx={{ ml: 2 }}>
          {name}
        </Typography>
      </div>

      <Typography variant="subtitle1" sx={{ ml: 2, mt: 2 }}>
        {expandedDescription ? description : shortenedDescription}
        {description.length >= 100 && (
          <span
            onClick={toggleDescription}
            style={{ cursor: 'pointer', color: 'blue' }}
          >
            {expandedDescription ? ' Réduire' : ' ...'}
          </span>
        )}
      </Typography>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Link to={`/update/${_id}`}>
          <Button size="small">Modifier</Button>
        </Link>
        <Button size="small" color="error" onClick={() => mutation.mutate(_id)}>
          Supprimer
        </Button>
      </div>
    </Paper>
  );
}
