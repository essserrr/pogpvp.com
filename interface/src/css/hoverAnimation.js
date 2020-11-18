import { makeStyles } from '@material-ui/core/styles';

const useAnimation = makeStyles((theme) => ({
    animation: {
        position: "relative",
        "-webkit-transition": 'all 0.15s cubic-bezier(0.165, 0.84, 0.44, 1)',
        transition: "all 0.15s cubic-bezier(0.165, 0.84, 0.44, 1)",
        "&::after": {
            content: '""',
            borderRadius: "5px",
            position: "absolute",
            zIndex: -1,
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
            opacity: 0,
            "-webkit-transition": 'all 0.15s cubic-bezier(0.165, 0.84, 0.44, 1)',
            transition: "all 0.15s cubic-bezier(0.165, 0.84, 0.44, 1)",
        },

        "&:hover": {
            transform: "scale(1.02, 1.02)",
            "-webkit-transform": "scale(1.02, 1.02)",
        },
        "&:hover::after": {
            opacity: 1,
            display: "block",
        }
    },
}));

export default useAnimation;