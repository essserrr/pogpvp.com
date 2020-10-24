import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    text: {
      primary: "#1a1a1a",
    },
    background: {
      main: "#eff0f1",
    },
  },
  overrides: {
    MuiTableCell: {
      body: {
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.12)",
      }
    }
  }
});

export default theme;
