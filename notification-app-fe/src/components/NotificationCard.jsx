import { Box, Chip, Paper, Typography } from "@mui/material";

const colors = {
  Placement: "success",
  Result: "warning",
  Event: "info",
};

export function NotificationCard({ notification }) {
  const { Type, Message, Timestamp } = notification;
  const color = colors[Type] ?? "default";

  const date = new Date(Timestamp).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderLeft: 4,
        borderColor: `${color}.main`,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
        <Chip label={Type} color={color} size="small" />
        <Typography variant="caption" color="text.secondary">{date}</Typography>
      </Box>
      <Typography variant="body2" color="text.secondary">{Message}</Typography>
    </Paper>
  );
}