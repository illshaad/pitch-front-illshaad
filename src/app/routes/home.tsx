import * as React from 'react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

import Container from '@mui/material/Container';

import { Link } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import Startups from '../dashboard/startups';
import { deleteStartups, getStartups } from '../services/startup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Startup } from '../type';
import { Button } from '@mui/material';

const drawerWidth = 300;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export default function Home() {
  const [open, setOpen] = React.useState<boolean>(true);
  const [selectedStartupId, setSelectedStartupId] = React.useState<
    Startup['_id'][]
  >([]);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['getStartups'],
    queryFn: getStartups,
  });

  const mutation = useMutation({
    mutationFn: (selectedStartupId: string[]) => {
      return deleteStartups(selectedStartupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getStartups'] });
    },
  });

  const toggleDrawer = () => {
    setOpen(!open);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: '24px',
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Mes startups
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />

        <div
          style={{
            marginTop: 10,
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Link to="/">
            <Button size="small">Crée une startup</Button>
          </Link>
          <Button
            onClick={() => mutation.mutate(selectedStartupId)}
            disabled={selectedStartupId.length < 2}
            size="small"
          >
            Supprimer les startups
          </Button>
        </div>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) => theme.palette.grey[100],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />

        <Container
          maxWidth="lg"
          sx={{
            mt: 4,
            mb: 4,
          }}
        >
          {data.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {data?.map((startup: Startup, index: number) => (
                <Startups
                  key={index}
                  isSelected={selectedStartupId.includes(startup._id)}
                  startup={startup}
                  selectedStartupId={selectedStartupId}
                  setSelectedStartupId={setSelectedStartupId}
                />
              ))}
            </div>
          ) : (
            <Typography variant="h6" gutterBottom>
              Vous avez supprimer tous les startups veuillez cliquer sur crée
              une startup pour les ajouter.
            </Typography>
          )}
        </Container>
      </Box>
    </Box>
  );
}
