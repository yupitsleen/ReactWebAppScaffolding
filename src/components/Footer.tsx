import { Box, Typography } from "@mui/material";
import { appConfig } from "../data/configurableData";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        py: 0.5,
        backgroundColor: "primary.main",
        color: "primary.contrastText",
      }}
    >
      <Typography variant="caption" align="center" display="block">
        © {currentYear} {appConfig.appName}
      </Typography>
    </Box>
  );
}

export default Footer;
