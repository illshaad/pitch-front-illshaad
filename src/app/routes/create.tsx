import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CheckIcon from '@mui/icons-material/Check';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Picture from '../dashboard/picture.jpg';

import { Input } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { createStartup } from '../services/startup';

const defaultTheme = createTheme();

type Inputs = {
  name: string;
  description: string;
  file: string;
};

export default function Create() {
  const { register, handleSubmit } = useForm<Inputs>();
  const [isUpload, setIsUpload] = React.useState<boolean>(false);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (data) {
      const formData = new FormData();

      formData.append('file', data.file[0]);
      formData.append('name', data.name);
      formData.append('description', data.description);
      mutation.mutate(formData);
    }
  };

  const mutation = useMutation({
    mutationFn: (data: FormData) => createStartup(data),
    onSuccess: () => {
      navigate('/list');
    },
  });

  const handleCheckImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      setIsUpload(true);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${Picture})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6}>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <RocketLaunchIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Création de votre startup
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Nom de votre startup"
                  autoFocus
                  inputProps={{
                    ...register('name', { required: true }),
                  }}
                />

                <TextField
                  id="outlined-multiline-static"
                  multiline
                  margin="normal"
                  required
                  fullWidth
                  label="Description de votre startup"
                  inputProps={{
                    minLength: 2,
                    maxLength: 100,
                    ...register('description', { required: true }),
                  }}
                />

                <label htmlFor="file">
                  <Input
                    style={{ display: 'none' }}
                    id="file"
                    required
                    inputProps={{
                      ...register('file'),
                    }}
                    onChange={handleCheckImage}
                    type="file"
                  />

                  <Button
                    sx={{ mt: 3 }}
                    size="small"
                    color="secondary"
                    variant="contained"
                    component="span"
                  >
                    {isUpload ? (
                      <CheckIcon />
                    ) : (
                      'Inserer le logo de votre startup'
                    )}
                  </Button>
                </label>
              </Box>
              <Button
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
                color="secondary"
              >
                Création
              </Button>
            </form>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
