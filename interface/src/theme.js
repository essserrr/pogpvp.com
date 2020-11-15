import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        text: {
            primary: "#1a1a1a",
            link: "#0039e6",
        },

        background: {
            main: "#eff0f1",
        },

        glow: {
            attack: "drop-shadow(0px 0px 4px rgba(255, 0, 0, 0.753))",
            defence: "drop-shadow(0px 0px 4px rgba(24, 39, 248, 0.753))",
            attackdefence: "drop-shadow(0px 0px 4px rgb(255, 166, 0))",
        },

        types: {
            type0: {
                text: "black",
                background: "#a8b820",
            },
            type1: {
                text: "white",
                background: "#42434e",
            },
            type2: {
                text: "white",
                background: "#7038f8",
            },
            type3: {
                text: "black",
                background: "#ffcc00",
            },
            type4: {
                text: "black",
                background: "#ee99ac",
            },
            type5: {
                text: "white",
                background: "#c02038",
            },
            type6: {
                text: "black",
                background: "#ff9933",
            },
            type7: {
                text: "black",
                background: "#78c8e4",
            },
            type8: {
                text: "white",
                background: "#7546bb",
            },
            type9: {
                text: "black",
                background: "#78c850",
            },
            type10: {
                text: "black",
                background: "#b17d4a",
            },
            type11: {
                text: "black",
                background: "#98d8d8",
            },
            type12: {
                text: "black",
                background: "#9f9f9a",
            },
            type13: {
                text: "black",
                background: "#a040a1",
            },
            type14: {
                text: "black",
                background: "#fe6688",
            },
            type15: {
                text: "black",
                background: "#adad85",
            },
            type16: {
                text: "white",
                background: "#496d92",
            },
            type17: {
                text: "black",
                background: "#3590d1",
            },
        },

        stages: {
            stageN34: {
                text: "red",
            },
            stageN12: {
                text: "rgb(255, 115, 0)",
            },
            stage0: {
                text: "#1a1a1a",
            },
            stageP12: {
                text: "rgb(108, 167, 0)",
            },
            stageP34: {
                text: "green",
            },
        },

        news: {
            border: "#acacac",
        },

        tableCell: {
            main: "rgba(0, 0, 0, 0.12)",
        }
    },
    overrides: {
        MuiTableCell: {
            body: {
                borderWidth: 1,
                borderColor: "rgba(0, 0, 0, 0.12)",
            }
        },
        MuiAppBar: {
            colorDefault: "#1a1a1a",
        }
    }
});

export default theme;