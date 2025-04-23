import { Backdrop, CircularProgress, Typography } from "@mui/material";

export default function ProgressCircle({ message, openBackdrop }: { message: string, openBackdrop: boolean }) {
    return (
        <Backdrop
            sx={{ zIndex: "99999" }}
            open={openBackdrop}
        >
            <div style={{ display: 'flex', justifyContent: "center", alignItems: "center", flexDirection: 'column' }}>
                <CircularProgress sx={{ color: '#FFA500' }} />
                <Typography variant="h6" component="div" color="white">
                    {message}
                </Typography>
            </div>
        </Backdrop>
    )
}